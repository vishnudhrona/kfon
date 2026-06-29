import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  Button,
  Flex,
  FormController,
  Icons,
  Popup,
  SimpleGrid,
  useForm,
  VStack
} from '@kfonbss/bss-ui-components';
import { useNavigate } from '@tanstack/react-router';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { STORAGE_KEYS } from '@/constants';
import { ACTION_TYPES, requestAadhaarOtp, verifyAadhaarOtp } from '@/features/common/actions';
import { actions as commonActions } from '@/features/common/slice';
import { getApiProgress } from '@/features/others/ApiProgress/selectors';
import { mapObjectValues } from '@/utils/commonUtils';

import { submitEkycDetails } from '../../actions';
import { clearAllFormStorage } from '../../hooks/useFormPersistence';
import { ekycValidationSchema } from '../../validation';
import { getFieldOptions } from './constants';
import EkycFields from './EkycFields';

const { BsCheckCircle, BsXCircle, BsArrowRightCircle } = Icons;

const navigateToApplicationRoute = (navigate, value, selectedEnquiryId) => {
  const { connectionType, subscriptionType } = value;
  const connectionTypeId = connectionType?.id || '';
  const subscriptionTypeId = subscriptionType?.id || '';

  if (connectionTypeId === 'basic') {
    const basicRoutes = {
      homeConnection: '/app/subscribers/home-connection',
      smeConnection: '/app/subscribers/sme-connection'
    };

    const route = basicRoutes[subscriptionTypeId];
    if (route) {
      navigate({
        to: route,
        search: { enquiryId: selectedEnquiryId.enquiryId },
        state: { trackingId: selectedEnquiryId.trackingId }
      });
    }
    return;
  }

  const ekycRoutes = {
    ewsConnection: '/app/subscribers/ekyc-ews-connection',
    homeConnection: '/app/subscribers/ekyc-home-connection',
    smeConnection: '/app/subscribers/ekyc-sme-connection'
  };

  const route = ekycRoutes[subscriptionTypeId];
  if (route) {
    navigate({
      to: route,
      search: { enquiryId: selectedEnquiryId.enquiryId },
      state: {
        trackingId: selectedEnquiryId.trackingId,
        enteredDetails: {
          ...value,
          ekyc: {
            ...value?.ekyc,
            mobileNo: selectedEnquiryId?.mobile,
            emailId: selectedEnquiryId?.email
          }
        }
      }
    });
  }
};

const NewApplication = ({ open, setOpen, selectedEnquiryId = { trackingId: '', enquiryId: '' }, isEws = false }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isOtpSend, setOtpSend] = useState(false);
  const [clientId, setClientId] = useState('');
  const [connectionType, setConnectionType] = useState('basic');

  const isBasicSelected = connectionType?.id === 'basic';

  const validationSchema = useMemo(
    () => ekycValidationSchema(isOtpSend, isBasicSelected, t),
    [isOtpSend, isBasicSelected, t]
  );

  const getDefaultValues = useMemo(
    () => (ews) => ({
      subscriptionType: ews
        ? getFieldOptions.subscriptionTypeOptions.find((o) => o.id === 'ewsConnection')
        : getFieldOptions.subscriptionTypeOptions[0],
      connectionType: ews
        ? getFieldOptions.connectionTypeOptions.find((o) => o.id === 'eKYC')
        : getFieldOptions.connectionTypeOptions[0],
      ekyc: { aadhaarNumber: '', otp: '' }
    }),
    []
  );

  const {
    control,
    formState: { errors },
    setValue,
    handleSubmit,
    watch,
    getValues,
    reset
  } = useForm({
    defaultValues: getDefaultValues(isEws),
    resolver: yupResolver(validationSchema)
  });

  const fieldOptions = useMemo(() => {
    const opts = mapObjectValues(getFieldOptions, t, ['name']);
    if (isEws) {
      opts.subscriptionTypeOptions = opts.subscriptionTypeOptions.filter((o) => o.id === 'ewsConnection');
    }
    return opts;
  }, [t, isEws]);

  const watchedConnectionType = watch('connectionType');
  const watchedSubscriptionType = watch('subscriptionType');

  const connectionTypeOptions = useMemo(() => {
    const subTypeId = watchedSubscriptionType?.id || watchedSubscriptionType;
    return subTypeId === 'ewsConnection'
      ? fieldOptions.connectionTypeOptions.filter((option) => option.id !== 'basic')
      : fieldOptions.connectionTypeOptions;
  }, [watchedSubscriptionType, fieldOptions]);

  useEffect(() => {
    setConnectionType(watchedConnectionType);
  }, [watchedConnectionType]);

  useEffect(() => {
    const subTypeId = watchedSubscriptionType?.id || watchedSubscriptionType;
    const value =
      subTypeId === 'ewsConnection'
        ? fieldOptions.connectionTypeOptions.find((opt) => opt.id === 'eKYC')
        : fieldOptions.connectionTypeOptions.find((opt) => opt.id === 'basic');
    setValue('connectionType', value, { shouldValidate: true });
  }, [watchedSubscriptionType, setValue, fieldOptions]);

  // Reset form and clear stale aadhaar data whenever popup opens
  useEffect(() => {
    if (open) {
      dispatch(commonActions.resetAadhaarDetails());
      setOtpSend(false);
      setClientId('');
      reset(getDefaultValues(isEws));
    }
  }, [open, dispatch, isEws, reset, getDefaultValues]);

  const sendOtp = async (data) => {
    const values = data || getValues();
    if (values?.ekyc?.aadhaarNumber) {
      dispatch(commonActions.setAadhaarNumber(values.ekyc.aadhaarNumber));
      dispatch(
        requestAadhaarOtp({
          id_number: values.ekyc.aadhaarNumber,
          onSuccess: (responseData) => {
            const extractedClientId = responseData?.client_id || responseData?.data?.client_id;
            setClientId(extractedClientId);
            setOtpSend(true);
          }
        })
      );
    }
  };

  const verifyOtp = (data) => {
    const values = data || getValues();
    if (values?.ekyc?.otp && clientId) {
      dispatch(
        verifyAadhaarOtp({
          otp: values.ekyc.otp,
          client_id: clientId,
          onSuccess: (responsePayload) => {
            const verifyData = responsePayload?.data || responsePayload;
            const status = verifyData?.status?.toLowerCase();
            const isSuccess = status === 'success_aadhaar' || status === 'success';

            if (isSuccess && verifyData?.full_name) {
              if (selectedEnquiryId?.enquiryId) {
                const stored = JSON.parse(sessionStorage.getItem(STORAGE_KEYS.AADHAAR_DATA) || '{}');
                stored[selectedEnquiryId.enquiryId] = {
                  ...verifyData,
                  aadharNumber: values?.ekyc?.aadhaarNumber
                };
                sessionStorage.setItem(STORAGE_KEYS.AADHAAR_DATA, JSON.stringify(stored));
              }

              dispatch(
                submitEkycDetails({
                  // POST /subscriber/ekyc fields
                  clientId: verifyData.client_id || clientId,
                  aadharNumber: values?.ekyc?.aadhaarNumber,
                  mobileNumber: selectedEnquiryId?.mobile,
                  email: selectedEnquiryId?.email,
                  status: verifyData.status,
                  // PUT /subscriber/ekyc/:id fields (id comes from POST response ekycId)
                  ...verifyData,
                  emailAddress: selectedEnquiryId?.email,
                  gender: verifyData.gender === 'F' ? 'FEMALE' : verifyData.gender === 'M' ? 'MALE' : 'OTHER',
                  kycType: 'E_KYC',
                  appliedOnlineEnqId: selectedEnquiryId?.enquiryId,
                  onSuccess: () => navigateToApplicationRoute(navigate, values, selectedEnquiryId)
                })
              );
            }
          }
        })
      );
    }
  };

  // Cleanup only when popup is closed, not on navigation success
  // (aadhaar details must persist in Redux for AdharDetails component to read)

  const handleClose = (isOpen) => {
    setOpen(isOpen);
    if (!isOpen) {
      dispatch(commonActions.resetAadhaarDetails());
      setOtpSend(false);
      reset(getDefaultValues(isEws));
    }
  };

  const onSubmit = (data) => {
    // Check if we're switching enquiries and clear storage if so
    const currentEnquiry = JSON.parse(sessionStorage.getItem(STORAGE_KEYS.ENQUIRY_DATA) || '{}');
    if (selectedEnquiryId?.enquiryId && currentEnquiry.enquiryId !== selectedEnquiryId.enquiryId) {
      clearAllFormStorage();
    }

    if (isBasicSelected) {
      navigateToApplicationRoute(navigate, data, selectedEnquiryId);
    } else if (isOtpSend) {
      verifyOtp(data);
    } else {
      sendOtp(data);
    }
  };

  const submitLabel = isOtpSend
    ? t('verifyOtp')
    : (watchedConnectionType?.id || watchedConnectionType) === 'basic'
      ? t('continue')
      : t('getOTP');
  const submitIcon = isOtpSend ? <BsCheckCircle /> : <BsArrowRightCircle />;

  const apiProgress = useSelector(getApiProgress);
  const isOtpLoading = apiProgress[ACTION_TYPES.REQUEST_AADHAAR_OTP] || apiProgress[ACTION_TYPES.VERIFY_AADHAAR_OTP];

  return (
    <Popup
      title={t('start')}
      titleMain={t('newApplication')}
      isOpen={open}
      onOpenChange={handleClose}
      closeOnInteractOutside={false}
    >
      <Box as={'form'} onSubmit={handleSubmit(onSubmit)}>
        <SimpleGrid rowGap={6} px='4' pb='4' w='100%'>
          {!isEws && (
            <FormController
              name='subscriptionType'
              labelName={t('subscriptionType')}
              type='select'
              items={fieldOptions.subscriptionTypeOptions}
              control={control}
            />
          )}
          <VStack alignItems={'stretch'} gap={2}>
            <FormController
              name='connectionType'
              labelName={t('connectionType')}
              type='select'
              items={connectionTypeOptions}
              control={control}
            />
          </VStack>
          <EkycFields
            show={watchedConnectionType.id === 'eKYC'}
            isOtpSend={isOtpSend}
            errors={errors}
            control={control}
            onResendOtp={() => sendOtp()}
          />
        </SimpleGrid>
        <Flex w='full' justify='flex-end' pb={5} pr='5' gap={3}>
          <Button
            variant='outline'
            onClick={() => handleClose(false)}
            h='47px'
            px='18px'
            borderRadius='48px'
            fontSize='16px'
            fontWeight='400'
          >
            <BsXCircle style={{ marginRight: '6px', width: '24px', height: '24px' }} /> {t('close')}
          </Button>
          <Button
            type='submit'
            variant='solid'
            colorScheme='pink'
            h='47px'
            px='18px'
            borderRadius='48px'
            fontSize='16px'
            fontWeight='400'
            loading={isOtpLoading}
          >
            {submitLabel}
            {submitIcon && (
              <Box as='span' ml='6px' display='inline-flex' alignItems='center' fontSize='24px'>
                {submitIcon}
              </Box>
            )}
          </Button>
        </Flex>
      </Box>
    </Popup>
  );
};

export default NewApplication;
