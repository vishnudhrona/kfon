import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, FormController, HStack, Popup, Text, useForm, VStack } from '@kfonbss/bss-ui-components';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect, useSelector } from 'react-redux';

import { Close, Save } from '@/components/custom';
import { getApiProgress } from '@/features/others/ApiProgress/selectors';

import { ACTION_TYPES, sendOtp, submitOtp } from '../actions';
import { getOtpDetails } from '../selectors';
import { otpSchema } from '../validation';

const VerifyOtpPopUp = ({ open, setOpen, otpDetails, mobileNumber, sendOtpValue, submitOtpValue }) => {
  const apiProgress = useSelector(getApiProgress);
  const isSubmittingOtp = !!apiProgress[ACTION_TYPES.SUBMIT_OTP];
  const { t } = useTranslation();
  const [counter, setCounter] = useState(60);
  const [resetTrigger, setResetTrigger] = useState(0);
  const [otpError, setOtpError] = useState('');

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: yupResolver(otpSchema),
    defaultValues: { otp: '' }
  });

  useEffect(() => {
    if (!open) return;

    reset({ otp: '' });
    setOtpError('');
    setCounter(60);
    const interval = setInterval(() => {
      setCounter((sec) => {
        if (sec <= 1) {
          clearInterval(interval);
          return 0;
        }
        return sec - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [open, resetTrigger, reset]);

  const handleClose = () => {
    setOpen(false);
  };

  const handleResend = () => {
    sendOtpValue({ mobile: mobileNumber });
    setResetTrigger((prev) => prev + 1);
  };

  const onSubmit = (data) => {
    setOtpError('');
    const payload = {
      otpReferenceId: otpDetails,
      otp: data?.otp,
      onSuccess: () => setOpen(false),
      onError: (message) => setOtpError(message)
    };

    submitOtpValue(payload);
  };

  return (
    <Popup
      isOpen={open}
      onOpenChange={(e) => setOpen(e?.open)}
      size='md'
      placement='center'
      title={t('verifyYourMobileNumber')}
      contentProps={{ maxW: { base: '320px', md: '360px' }, mx: 'auto' }}
    >
      <VStack as='form' onSubmit={handleSubmit(onSubmit)} gap={5} alignItems='stretch'>
        <Text fontSize='15px' textAlign={{ base: 'center', md: 'left' }}>
          {t('enterTheOtpSentTo', { 0: mobileNumber })}
        </Text>

        <VStack gap={2} alignItems='stretch' width='full'>
          <FormController
            labelName={t('otp')}
            name='otp'
            placeholder='XXXXXX'
            control={control}
            errors={errors}
            maxLength={6}
            minLength={6}
            required
            width='full'
            onChange={() => setOtpError('')}
          />
          {otpError && (
            <Text fontSize='sm' color='red.500'>
              {otpError}
            </Text>
          )}
        </VStack>

        <Box textAlign={{ base: 'center', md: 'right' }}>
          {counter > 0 ? (
            <Text fontSize='14px' color='gray.600'>
              {t('resendOtpIn')} 00:{counter < 10 ? `0${counter}` : counter}
            </Text>
          ) : (
            <Button
              variant='link'
              colorScheme='primary'
              color={'gray.600'}
              fontSize='14px'
              onClick={handleResend}
              ml={'auto'}
            >
              {t('resendOtp')}
            </Button>
          )}
        </Box>

        <HStack justifyContent={{ base: 'center', md: 'flex-end' }} flexWrap={{ base: 'wrap', md: 'nowrap' }} gap={3}>
          <Button variant='outline' type='button' onClick={handleClose} w={{ base: '100%', md: 'auto' }}>
            <Close /> {t('close')}
          </Button>

          <Button type='submit' colorScheme='primary' w={{ base: '100%', md: 'auto' }} isLoading={isSubmittingOtp}>
            <Save /> {t('submit')}
          </Button>
        </HStack>
      </VStack>
    </Popup>
  );
};

const mapStateToProps = (state) => ({
  otpDetails: getOtpDetails(state)
});

const mapDispatchToProps = {
  submitOtpValue: submitOtp,
  sendOtpValue: sendOtp
};

export default connect(mapStateToProps, mapDispatchToProps)(VerifyOtpPopUp);
