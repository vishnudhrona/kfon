import { yupResolver } from '@hookform/resolvers/yup';
import {
  AccordionItem,
  Box,
  Flex,
  FormController,
  Icons,
  Image,
  SimpleGrid,
  Text,
  useForm,
  VStack
} from '@kfonbss/bss-ui-components';
import { useLocation, useSearch } from '@tanstack/react-router';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { STORAGE_KEYS } from '@/constants';
import { fetchRandomNumber } from '@/features/common/actions';
import { getAadhaarOtpDetails, getEnteredAadhaarNumber, getRandomNumber } from '@/features/common/selectors';
import { actions as commonActions } from '@/features/common/slice';

import { fetchPartnerList, submitBasicDetails, updateBasicDetails } from '../../actions';
import { getPartnerList, getPrepopulatedData, getSubscriberId } from '../../selectors';
import { basicDetailsValidationSchema } from '../../validation';
import { CONNECTION_TYPES } from '../common/constants';

const { greenTickIcon: GreenTickIcon } = Icons;

const AdharDetails = ({ connectionType = CONNECTION_TYPES.EKYC_CONNECTION, onSuccess }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const aadhaarDetailsRedux = useSelector(getAadhaarOtpDetails);
  const enteredAadhaarNumber = useSelector(getEnteredAadhaarNumber);
  const randomNumber = useSelector(getRandomNumber);
  const subscriberId = useSelector(getSubscriberId);
  const prepopulatedData = useSelector(getPrepopulatedData);
  const location = useLocation();
  const { enquiryId: searchEnqId } = useSearch({ strict: false });
  const { enteredDetails, partial: isPartial } = location.state || {};

  const isSme =
    connectionType === CONNECTION_TYPES.SME_EKYC_CONNECTION || connectionType === CONNECTION_TYPES.SME_CONNECTION;
  const isEws = connectionType === CONNECTION_TYPES.EWS_EKYC_CONNECTION;

  const aadhaarDetails = aadhaarDetailsRedux?.data || aadhaarDetailsRedux;

  useEffect(() => {
    if (!prepopulatedData?.basicDetail?.applicationFormNumber && !randomNumber) {
      dispatch(fetchRandomNumber());
    }
    // randomNumber intentionally excluded: adding it causes a re-run after fetch resolves,
    // which re-dispatches when prepopulatedData.applicationFormNumber is still null.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, prepopulatedData]);

  // On mount: if Redux has no aadhaar data (post-refresh), restore from sessionStorage keyed by enquiryId
  useEffect(() => {
    if (aadhaarDetailsRedux) return;
    const enquiryId =
      searchEnqId ||
      sessionStorage.getItem(STORAGE_KEYS.APPLIED_ONLINE_ENQ_ID) ||
      prepopulatedData?.basicDetail?.appliedOnlineEnqId;
    if (!enquiryId) return;
    try {
      const stored = JSON.parse(sessionStorage.getItem(STORAGE_KEYS.AADHAAR_DATA) || '{}');
      const saved = stored[enquiryId];
      if (saved) {
        dispatch(commonActions.restoreAadhaarDetails(saved));
      }
    } catch {
      // ignore malformed storage
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const partnerList = useSelector(getPartnerList);
  const hasPartners = partnerList?.length > 0;

  const validationSchema = useMemo(
    () => basicDetailsValidationSchema(t, connectionType, hasPartners),
    [t, connectionType, hasPartners]
  );

  const {
    control,
    formState: { errors },
    handleSubmit,
    setValue
  } = useForm({
    defaultValues: {
      applicationFormNumber: '',
      mobileNumber: '',
      emailAddress: '',
      applicantName: '',
      companyName: '',
      dateOfBirth: '',
      gender: '',
      lnpPartnerId: '',
      isMsme: false
    },
    resolver: yupResolver(validationSchema)
  });

  // Fetch the partners (assigned LNP users) available to the current user
  useEffect(() => {
    dispatch(fetchPartnerList());
  }, [dispatch]);

  // Restore a previously chosen partner, else auto-select the single available one
  useEffect(() => {
    if (!partnerList?.length) return;
    const prefilledId = prepopulatedData?.basicDetail?.lnpPartnerId;
    if (prefilledId) {
      const match = partnerList.find((partner) => partner.id === prefilledId);
      if (match) {
        setValue('lnpPartnerId', match, { shouldValidate: true });
        return;
      }
    }
    if (partnerList.length === 1) {
      setValue('lnpPartnerId', partnerList[0], { shouldValidate: true });
    }
  }, [partnerList, prepopulatedData, setValue]);

  useEffect(() => {
    if (randomNumber && !prepopulatedData?.basicDetail?.applicationFormNumber) {
      setValue('applicationFormNumber', randomNumber);
    }
  }, [randomNumber, prepopulatedData, setValue]);

  useEffect(() => {
    const applicationFormNumber = prepopulatedData?.basicDetail?.applicationFormNumber;

    if (applicationFormNumber) setValue('applicationFormNumber', applicationFormNumber);
    if (aadhaarDetails) {
      const mobileNumber = enteredDetails?.ekyc?.mobileNo || prepopulatedData?.basicDetail?.mobileNumber || '';
      const emailAddress = enteredDetails?.ekyc?.emailId || prepopulatedData?.basicDetail?.emailAddress || '';
      setValue('mobileNumber', mobileNumber);
      setValue('emailAddress', emailAddress);

      // Population for validation fields — prefer aadhaar data, fall back to saved record
      const full_name = aadhaarDetails.full_name || prepopulatedData?.basicDetail?.applicantName || '';
      const dob = aadhaarDetails.dob || prepopulatedData?.basicDetail?.dateOfBirth || '';
      const gender = aadhaarDetails.gender;
      if (isSme) {
        setValue('companyName', full_name);
      } else {
        setValue('applicantName', full_name);
      }
      setValue('dateOfBirth', dob);
      if (gender) {
        setValue('gender', gender === 'M' ? 'MALE' : gender === 'F' ? 'FEMALE' : 'OTHERS');
      } else if (prepopulatedData?.basicDetail?.gender) {
        setValue('gender', prepopulatedData.basicDetail.gender);
      }
      if (isSme) setValue('isMsme', !!prepopulatedData?.basicDetail?.isMsme);
    } else if (prepopulatedData?.basicDetail) {
      // No aadhaar session — pre-fill entirely from saved record
      const { applicantName, dateOfBirth, gender, mobileNumber, emailAddress } = prepopulatedData.basicDetail;
      if (isSme) {
        setValue('companyName', applicantName || '');
      } else {
        setValue('applicantName', applicantName || '');
      }
      if (dateOfBirth) setValue('dateOfBirth', dateOfBirth);
      if (gender) setValue('gender', gender);
      if (mobileNumber) setValue('mobileNumber', mobileNumber);
      if (emailAddress) setValue('emailAddress', emailAddress);
      if (isSme) setValue('isMsme', !!prepopulatedData.basicDetail.isMsme);
    }
  }, [aadhaarDetails, prepopulatedData, enteredDetails, setValue, isSme]);

  const handleSaveAndContinue = (data) => {
    if (!aadhaarDetails && !prepopulatedData?.basicDetail) return;

    let appliedOnlineEnqId = searchEnqId || sessionStorage.getItem(STORAGE_KEYS.APPLIED_ONLINE_ENQ_ID);
    if (!appliedOnlineEnqId || appliedOnlineEnqId === 'null' || appliedOnlineEnqId === 'undefined') {
      appliedOnlineEnqId =
        prepopulatedData?.basicDetail?.appliedOnlineEnqId ||
        location.state?.enteredDetails?.ekyc?.enquiryId ||
        location.state?.trackingId ||
        null;
    }

    const sessionEnquiryData = JSON.parse(sessionStorage.getItem(STORAGE_KEYS.ENQUIRY_DATA) || 'null');
    const latitude =
      sessionEnquiryData?.latitude ||
      prepopulatedData?.basicDetail?.latitude ||
      location.state?.enteredDetails?.ekyc?.latitude ||
      '';
    const longitude =
      sessionEnquiryData?.longitude ||
      prepopulatedData?.basicDetail?.longitude ||
      location.state?.enteredDetails?.ekyc?.longitude ||
      '';

    const { lnpPartnerId: selectedPartner, isMsme: msmeChecked, ...basicFields } = data;

    const payload = {
      ...basicFields,
      type: isEws ? 'EWS' : isSme ? 'SME' : 'HOME',
      kycType: 'E_KYC',
      status: 'PENDING',
      appliedOnlineEnqId: appliedOnlineEnqId,
      latitude: String(latitude),
      longitude: String(longitude),
      ...(aadhaarDetails?.profile_image && { photo: aadhaarDetails.profile_image }),
      aadharNumber: enteredAadhaarNumber || prepopulatedData?.basicDetail?.aadharNumber || '',
      // Only send lnpPartnerId when partners are available; avoids clobbering on PATCH
      ...(hasPartners && { lnpPartnerId: selectedPartner?.id || selectedPartner || null }),
      // MSME flag applies only to SME connections
      ...(isSme && { isMsme: !!msmeChecked }),
      onSuccess
    };

    if (subscriberId || isPartial) {
      dispatch(updateBasicDetails({ id: subscriberId, ...payload }));
    } else {
      dispatch(submitBasicDetails(payload));
    }
  };
  return (
    <AccordionItem
      title={t('basicDetails')}
      name={'BasicDetails'}
      value={'BasicDetails'}
      saveButton={true}
      buttonValue={t('saveAndContinue')}
      onSubmit={handleSubmit(handleSaveAndContinue)}
    >
      <VStack spacing={6} align='stretch' w='full' gridColumn='span 3'>
        {/* Aadhaar Details Banner */}
        <Flex background='#F5F6FA' borderRadius='md' p={4} alignItems='center' gap={6} w='full'>
          <Box
            borderRadius='6.64px'
            p='5.94px'
            border='0.64px solid #EEEEEE'
            bg='#F4F4F4'
            boxShadow='0px 7.75px 23.25px rgba(0, 0, 0, 0.05)'
          >
            <Image
              width='78px'
              height='82px'
              objectFit='cover'
              borderRadius='4px'
              src={
                aadhaarDetails?.profile_image
                  ? `data:image/jpeg;base64,${aadhaarDetails.profile_image}`
                  : prepopulatedData?.basicDetail?.photo
                    ? `data:image/jpeg;base64,${prepopulatedData.basicDetail.photo}`
                    : ''
              }
              fallbackSrc='https://via.placeholder.com/80?text=Profile'
            />
          </Box>

          <SimpleGrid columns={4} flex={1} gap={8}>
            <VStack align='start' spacing={1}>
              <Text fontSize='12px' color='gray.500' fontWeight='semibold'>
                {t('aadhaarNumber')}
              </Text>
              <Text fontSize='14px' fontWeight='bold' color='font_color.primary'>
                {enteredAadhaarNumber || prepopulatedData?.basicDetail?.aadharNumber || '-'}
              </Text>
            </VStack>
            <VStack align='start' spacing={1}>
              <Text fontSize='12px' color='gray.500' fontWeight='semibold'>
                {t('applicantName')}
              </Text>
              <Text fontSize='14px' fontWeight='bold' color='font_color.primary'>
                {aadhaarDetails?.full_name || prepopulatedData?.basicDetail?.applicantName || '-'}
              </Text>
            </VStack>
            <VStack align='start' spacing={1}>
              <Text fontSize='12px' color='gray.500' fontWeight='semibold'>
                {t('dateOfBirth')}
              </Text>
              <Text fontSize='14px' fontWeight='bold' color='font_color.primary'>
                {aadhaarDetails?.dob || prepopulatedData?.basicDetail?.dateOfBirth || '-'}
              </Text>
            </VStack>
            <VStack align='start' spacing={1}>
              <Text fontSize='12px' color='gray.500' fontWeight='semibold'>
                {t('gender')}
              </Text>
              <Text fontSize='14px' fontWeight='bold' color='font_color.primary'>
                {aadhaarDetails?.gender === 'M'
                  ? t('male')
                  : aadhaarDetails?.gender === 'F'
                    ? t('female')
                    : prepopulatedData?.basicDetail?.gender
                      ? t(prepopulatedData.basicDetail.gender.toLowerCase())
                      : '-'}
              </Text>
            </VStack>
          </SimpleGrid>

          <GreenTickIcon boxSize='20px' width='20px' height='20px' mr={4} />
        </Flex>

        <SimpleGrid columns={3} gap={6} w='full' pt={4}>
          <FormController
            name='applicationFormNumber'
            labelName={`${t('applicationFormNumber')}`}
            placeholder={t('enter', { 0: t('applicationFormNumber') })}
            control={control}
            errors={errors}
            required
            disabled
          />
          <FormController
            name='mobileNumber'
            labelName={`${t('mobileNo')}`}
            placeholder={t('enter', { 0: t('mobileNo') })}
            control={control}
            errors={errors}
            required
          />
          <FormController
            name='emailAddress'
            labelName={`${t('emailId')}`}
            placeholder={t('enter', { 0: t('emailId') })}
            control={control}
            errors={errors}
            required
          />
          {hasPartners && (
            <FormController
              name='lnpPartnerId'
              type='select'
              labelName={t('partner')}
              placeholder={t('choose', { 0: t('partner') })}
              items={partnerList}
              control={control}
              errors={errors}
              isDisabled={partnerList.length === 1}
              required
            />
          )}
          {isSme && (
            <FormController name='isMsme' type='checkbox' labelName={t('msme')} control={control} errors={errors} />
          )}
        </SimpleGrid>
      </VStack>
    </AccordionItem>
  );
};

export default AdharDetails;
