import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, Flex, FormController, SimpleGrid, useForm } from '@kfonbss/bss-ui-components';
import _ from 'lodash-es';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { TickIcon } from '@/assets/svg';
import { fetchPostOfice } from '@/features/common/actions';
import { getPostOffice } from '@/features/common/selectors';
import { sendOtpForForms } from '@/features/public/common/actions';
import OtpPopup from '@/features/public/common/components/OtpPopup';
import SuccessPopup from '@/features/public/common/components/SuccessPopup';
import { STATE_REDUCER_KEY as COMMON_KEY } from '@/features/public/common/constants';
import { actions as commonSliceActions } from '@/features/public/common/slice';
import { stripExtraSpaces } from '@/utils/validationUtils';

import { fetchBplApplicationStatus } from '../action';
import { MALAYALAM_BPL_FORM_MESSAGES } from '../constants';
import { formatBPLEnquiryRequest } from '../helpers';
import { getBplDetails } from '../selector';
import { BPLSchema } from '../validations';
import CircleSelect from './CircleSelect';

const BPLEnquiry = ({ onSuccess, bare = false }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const isSuccessOpen = useSelector((s) => s[COMMON_KEY].successPopupOpen);
  const otpPopupOpen = useSelector((state) => state[COMMON_KEY].otpPopupOpen);
  const postOfficeMaster = useSelector(getPostOffice);
  const bplDetails = useSelector(getBplDetails);

  // Control form visibility - set to true to show form, false to show message
  const isFormOpen = bplDetails?.formStatus?.active;
  // const isFormOpen = true;

  useEffect(() => {
    dispatch(fetchBplApplicationStatus());
  }, [dispatch]);

  const DEFAULT_VALUES = {
    circle: null,
    rationCardHolderName: '',
    rationCardNumber: '',
    aadhaarLinkedMobileNumber: '',
    ksebConsumerNumber: '',
    aadhaarNumberOfRationCardHolder: '',
    installationAddress: '',
    pincode: '',
    postOffice: '',
    district: '',
    districtId: '',
    referralCode: '',
    consent: false
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch
  } = useForm({
    defaultValues: DEFAULT_VALUES,
    resolver: yupResolver(BPLSchema(t))
  });

  const postOffice = watch('postOffice');
  const consent = watch('consent');

  useEffect(() => {
    if (postOffice && !_.isEmpty(postOfficeMaster)) {
      const selectedPostOffice = postOfficeMaster?.find(
        (item) =>
          item?.id === postOffice ||
          item?.value === postOffice ||
          item?.postOffice === postOffice ||
          (typeof postOffice === 'object' && item?.id === postOffice?.id)
      );
      if (selectedPostOffice) {
        setValue('district', selectedPostOffice?.district);
        setValue('districtId', selectedPostOffice?.districtId);
      }
    }
  }, [postOffice, postOfficeMaster, setValue]);

  const onSubmit = (formValues) => {
    dispatch(sendOtpForForms(formatBPLEnquiryRequest(formValues)));
  };

  const handleSuccessClose = (val) => {
    dispatch(commonSliceActions.setSuccessPopupOpen(val));

    if (!val) {
      reset(DEFAULT_VALUES);
    }
  };

  const pincodeChange = (e) => {
    const value = e?.target?.value;
    setValue('postOffice', '');
    setValue('district', '');
    setValue('districtId', '');

    if (value?.length === 6) {
      dispatch(fetchPostOfice({ pincode: value }));
    }
  };

  // Render message screen when form is closed
  if (!isFormOpen) {
    return (
      <Box w='100%' p={{ base: '16px', md: '40px', xl: '55px' }}>
        <Flex justifyContent='center' alignItems='center' minH='60vh'>
          <Box
            bg='white'
            borderRadius='12px'
            p={{ base: '32px', md: '48px', xl: '64px' }}
            boxShadow='0 4px 18px rgba(0,0,0,0.08)'
            maxW='800px'
            w='100%'
            textAlign='center'
          >
            <Box fontSize={{ base: '32px', md: '40px' }} fontWeight='700' color='blue.600' mb='24px'>
              EWS
            </Box>
            <Box fontSize={{ base: '16px', md: '18px' }} lineHeight='1.8' color='gray.700'>
              {MALAYALAM_BPL_FORM_MESSAGES.bplFormClosedMessage}
            </Box>
          </Box>
        </Flex>
      </Box>
    );
  }

  // Render form when isFormOpen is true
  const inner = (
    <>
      {!bare && (
        <Box
          bg='#F5F6FA'
          p={{ base: '24px 16px', md: '32px 24px', xl: '30px 32px' }}
          textAlign='center'
          mb='0'
          borderRadius='12px'
        >
          <Box fontSize={{ base: '24px', md: '36px', xl: '32px' }} fontWeight='600' lineHeight='1.2' mb='8px'>
            {t('bplSubscriptionEnquiry')}
          </Box>
          <Box fontSize={{ base: '14px', md: '20px' }} color='#000000' fontWeight='400'>
            {t('pleaseFillInTheFieldsBelowToGetWiFiConnection')}
          </Box>
        </Box>
      )}
      <Box mt='20px' w='100%'>
        <Flex alignItems='center' gap='12px'>
          <Box fontSize='16px' fontWeight='600'>
            {t('rationCardDetails')}
          </Box>
          <Box flex='1' h='1px' bg='#E6E6E6' />
        </Flex>
        <Box mb='20px' />
      </Box>

      <form onSubmit={handleSubmit(onSubmit)}>
          <SimpleGrid
            columns={{ base: 1, md: 2, xl: 3 }}
            columnGap={{ base: 4, md: 8, xl: 10 }}
            rowGap={{ base: 6, md: 8 }}
          >
            <FormController
              labelName={t('rationCardHolderName')}
              name='rationCardHolderName'
              placeholder={t('enter', { 0: t('rationCardHolderName') })}
              control={control}
              errors={errors}
              required
              maxLength={100}
              onInput={stripExtraSpaces}
            />
            <FormController
              labelName={t('rationCardNumber')}
              name='rationCardNumber'
              placeholder={t('enter', { 0: t('rationCardNumber') })}
              control={control}
              errors={errors}
              required
              minLength='10'
              maxLength='10'
              onInput={(e) => (e.target.value = e.target.value.replace(/\D/g, ''))}
            />
            <FormController
              labelName={t('aadhaarLinkedMobileNumber')}
              name='aadhaarLinkedMobileNumber'
              placeholder={t('enter', { 0: t('aadhaarLinkedMobileNumber') })}
              control={control}
              errors={errors}
              required
              maxLength={10}
              inputMode='numeric'
              pattern='[0-9]*'
              onInput={(e) => (e.target.value = e.target.value.replace(/\D/g, ''))}
            />
            <FormController
              labelName={t('ksebConsumerNumber')}
              name='ksebConsumerNumber'
              placeholder={t('enter', { 0: t('ksebConsumerNumber') })}
              control={control}
              errors={errors}
              required
              maxLength={13}
            />
            <FormController
              labelName={t('aadhaarNumberOfRationCardHolder')}
              name='aadhaarNumberOfRationCardHolder'
              placeholder={t('enter', { 0: t('aadhaarNumberOfRationCardHolder') })}
              control={control}
              errors={errors}
              required
              maxLength={12}
              inputMode='numeric'
              pattern='[0-9]*'
              onInput={(e) => (e.target.value = e.target.value.replace(/\D/g, ''))}
            />

            <Box gridColumn={{ base: '1 / -1', xl: '1 / span 3' }}>
              <Flex alignItems='center' gap='12px'>
                <Box fontSize='16px' fontWeight='600'>
                  {t('addressInformation')}
                </Box>
                <Box flex='1' h='1px' bg='#E6E6E6' />
              </Flex>
            </Box>

            <FormController
              type='textArea'
              labelName={t('installationAddress')}
              name='installationAddress'
              placeholder={t('enter', { 0: t('installationAddress') })}
              control={control}
              errors={errors}
              required
              maxLength={300}
              rows={4}
            />
            <CircleSelect control={control} errors={errors} setValue={setValue} />
            <FormController
              labelName={t('pinCode')}
              name='pincode'
              placeholder={t('enter', { 0: t('pinCode') })}
              control={control}
              errors={errors}
              required
              minLength={6}
              maxLength={6}
              inputMode='numeric'
              onInput={(e) => (e.target.value = e.target.value.replace(/\D/g, ''))}
              handleChange={(e) => pincodeChange(e)}
            />
            <FormController
              labelName={t('postOffice')}
              name='postOffice'
              type='select'
              items={postOfficeMaster}
              placeholder={t('choose', { 0: t('postOffice') })}
              control={control}
              errors={errors}
              required
            />
            <FormController
              labelName={t('district')}
              name='district'
              placeholder={t('district')}
              control={control}
              errors={errors}
              required
              readOnly
            />
            <FormController
              labelName={t('referralCode')}
              name='referralCode'
              placeholder={t('enter', { 0: t('referralCode') })}
              control={control}
              errors={errors}
              maxLength={20}
            />

            <Box gridColumn={{ base: '1 / -1', xl: '1 / span 3' }}>
              <Flex alignItems='center' gap='12px'>
                <Box fontSize='16px' fontWeight='600'>
                  {t('declaration')}
                </Box>
                <Box flex='1' h='1px' bg='#E6E6E6' />
              </Flex>
            </Box>

            <Box gridColumn={{ base: '1 / -1', xl: '1 / span 3' }}>
              <Box
                p='16px'
                bg='gray.50'
                borderRadius='8px'
                border='1px solid'
                borderColor='gray.200'
                fontSize='14px'
                lineHeight='1.6'
              >
                <Flex alignItems='flex-start' gap='12px'>
                  <Box mt='4px'>
                    <FormController name='consent' errors={errors} control={control} type='checkbox' />
                  </Box>
                  <Box flex='1' color='gray.700'>
                    {t('bplDeclarationEnglish')}
                  </Box>
                </Flex>
              </Box>
            </Box>

            <Box gridColumn={{ base: '1 / -1', xl: '1 / span 3' }}>
              <Flex alignItems='center' gap='12px'>
                <Box fontSize='16px' fontWeight='600'>
                  {t('disclaimer')}
                </Box>
                <Box flex='1' h='1px' bg='#E6E6E6' />
              </Flex>
            </Box>

            <Box gridColumn={{ base: '1 / -1', xl: '1 / span 3' }}>
              <Box
                p='16px'
                bg='blue.50'
                borderRadius='8px'
                border='1px solid'
                borderColor='blue.200'
                fontSize='13px'
                lineHeight='1.6'
              >
                <Box mb='8px' fontWeight='600'>
                  {t('bplDisclaimerTitle')}
                </Box>
                <Box>{t('bplDisclaimerEnglish')}</Box>
              </Box>
            </Box>
          </SimpleGrid>
          <Flex justifyContent='center' mt='40px'>
            <Button
              type='submit'
              w={{ base: '100%', md: 'auto' }}
              px='10'
              py='3'
              borderRadius='full'
              bg='#8B1538'
              color='white'
              fontSize='18px'
              fontWeight='normal'
              _hover={{ bg: '#6D1028' }}
              disabled={!consent}
            >
              {t('generateOTP')}
              <TickIcon />
            </Button>
          </Flex>
        </form>
      <SuccessPopup isOpen={isSuccessOpen} setIsOpen={handleSuccessClose} onDone={onSuccess} />
      <OtpPopup isOpen={otpPopupOpen} setIsOpen={(val) => dispatch(commonSliceActions.setOtpPopupOpen(val))} />
    </>
  );

  if (bare) {
    return inner;
  }

  return (
    <Box w='100%' p={{ base: '16px', md: '40px', xl: '55px' }}>
      <Box
        bg='white'
        borderRadius='12px'
        p={{ base: '16px', md: '24px', xl: '32px' }}
        boxShadow='0 4px 18px rgba(0,0,0,0.08)'
        w='100%'
      >
        {inner}
      </Box>
    </Box>
  );
};

export default BPLEnquiry;
