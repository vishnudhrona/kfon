import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, Flex, FormController, Heading, SimpleGrid, useForm } from '@kfonbss/bss-ui-components';
import { useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { BsCheckCircle } from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux';

import { sendOtpForForms } from '@/features/public/common/actions';
import OtpPopup from '@/features/public/common/components/OtpPopup';
import SuccessPopup from '@/features/public/common/components/SuccessPopup';
import { STATE_REDUCER_KEY as COMMON_KEY } from '@/features/public/common/constants';
import { actions as commonSliceActions } from '@/features/public/common/slice';
import { stripExtraSpaces } from '@/utils/validationUtils';

import { formatDarkFibreEnquiryRequest } from '../helpers';
import { DarkFibreSchema } from '../validations';
import CircleSelect from './CircleSelect';

const DarkFibreEnquiry = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isSuccessOpen = useSelector((s) => s[COMMON_KEY].successPopupOpen);
  const otpPopupOpen = useSelector((state) => state[COMMON_KEY].otpPopupOpen);

  const DEFAULT_VALUES = {
    circle: null,
    nameOfTheFirm: '',
    fullAddress: '',
    firmPhoneNumber: '',
    firmEmail: '',
    contactPersonName: '',
    contactPersonPhoneNumber: '',
    contactPersonEmail: '',
    purposeOfLeasing: '',
    areaCircleWhereTelecomServiceIs: '',
    forAndOnBehalfLeaseCompanyMS: ''
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm({
    defaultValues: DEFAULT_VALUES,
    resolver: yupResolver(DarkFibreSchema(t))
  });

  const onSubmit = (formValues) => {
    const payload = formatDarkFibreEnquiryRequest(formValues);
    dispatch(sendOtpForForms(payload));
  };

  const handleSuccessClose = (val) => {
    dispatch(commonSliceActions.setSuccessPopupOpen(val));

    if (!val) {
      reset(DEFAULT_VALUES);
    }
  };

  const handleDone = () => {
    handleSuccessClose(false);
    navigate({ to: '/app/darkfiber/enquiry-list' });
  };

  return (
    <Box w='100%' p={{ base: '16px', md: '40px', xl: '55px' }}>
      <Box
        bg='white'
        borderRadius='12px'
        p={{ base: '16px', md: '24px', xl: '32px' }}
        boxShadow='0 4px 18px rgba(0,0,0,0.08)'
        w='100%'
      >
        <Flex
          mb='40px'
          direction='column'
          align='center'
          bg='#F5F6FA'
          borderRadius='12px'
          p='24px 0'
          gap='20px'
          w='100%'
        >
          <Heading as='h1' fontSize='32px' fontWeight={600}>
            {t('darkFiberConnection')}
          </Heading>
          <Box fontSize='18px' fontWeight={400} color='#666'>
            {t('wifiConnectionRequestSubtitle')}
          </Box>
        </Flex>

        <form onSubmit={handleSubmit(onSubmit)}>
          <SimpleGrid
            columns={{ base: 1, md: 2, xl: 3 }}
            columnGap={{ base: 4, md: 8, xl: 10 }}
            rowGap={{ base: 6, md: 8 }}
          >
            <CircleSelect control={control} errors={errors} setValue={setValue} />
            <FormController
              labelName={t('nameOfOrgOrCompany')}
              name='nameOfTheFirm'
              placeholder={t('enterNameOfOrgOrCompany')}
              control={control}
              errors={errors}
              required
              maxLength={200}
              onInput={stripExtraSpaces}
            />
            <FormController
              labelName={t('locationorAddress')}
              name='fullAddress'
              placeholder={t('enterLocationAddress')}
              control={control}
              errors={errors}
              required
              maxLength={500}
            />
            <FormController
              labelName={t('orgOrCompanyPhoneNumber')}
              name='firmPhoneNumber'
              placeholder={t('enterOrgOrCompanyPhoneNumber')}
              control={control}
              errors={errors}
              required
              maxLength={10}
              inputMode='numeric'
              pattern='[0-9]*'
              onInput={(e) => (e.target.value = e.target.value.replace(/\D/g, ''))}
            />
            <FormController
              labelName={t('orgOrCompanyEmailId')}
              name='firmEmail'
              placeholder={t('enterOrgOrCompanyEmailId')}
              control={control}
              errors={errors}
              required
              type='email'
              maxLength={100}
            />
            <FormController
              labelName={t('contactPersonName')}
              name='contactPersonName'
              placeholder={t('enterContactPersonName')}
              control={control}
              errors={errors}
              required
              maxLength={100}
              onInput={stripExtraSpaces}
            />
            <FormController
              labelName={t('contactPersonPhoneNumber')}
              name='contactPersonPhoneNumber'
              placeholder={t('enterContactPersonPhoneNumber')}
              control={control}
              errors={errors}
              required
              maxLength={10}
              inputMode='numeric'
              pattern='[0-9]*'
              onInput={(e) => (e.target.value = e.target.value.replace(/\D/g, ''))}
            />
            <FormController
              labelName={t('contactPersonEmailId')}
              name='contactPersonEmail'
              placeholder={t('enterContactPersonEmailId')}
              control={control}
              errors={errors}
              required
              type='email'
              maxLength={100}
            />
            <FormController
              labelName={t('purposeOfLeasing')}
              name='purposeOfLeasing'
              placeholder={t('enterPurposeOfLeasing')}
              control={control}
              errors={errors}
              maxLength={300}
            />
            <FormController
              labelName={t('areaCircleServiceRequired')}
              name='areaCircleWhereTelecomServiceIs'
              placeholder={t('enterAreaCircleServiceRequired')}
              control={control}
              errors={errors}
              maxLength={200}
            />
            <FormController
              labelName={t('purposeLabel')}
              name='forAndOnBehalfLeaseCompanyMS'
              placeholder={t('enterPurpose')}
              control={control}
              errors={errors}
              maxLength={200}
            />
          </SimpleGrid>
          <Flex justifyContent='center' mt='40px'>
            <Button
              type='submit'
              w={{ base: '100%', md: 'auto' }}
              px='8'
              py='2'
              bg='#890052'
              _hover={{ bg: '#6d0041' }}
              color='white'
              borderRadius='full'
            >
              {t('generateOTP')}
              <BsCheckCircle style={{ marginLeft: '8px' }} />
            </Button>
          </Flex>
        </form>
      </Box>
      <SuccessPopup
        isOpen={isSuccessOpen}
        setIsOpen={handleSuccessClose}
        onCancel={() => handleSuccessClose(false)}
        onDone={handleDone}
      />
      <OtpPopup isOpen={otpPopupOpen} setIsOpen={(val) => dispatch(commonSliceActions.setOtpPopupOpen(val))} />
    </Box>
  );
};

export default DarkFibreEnquiry;
