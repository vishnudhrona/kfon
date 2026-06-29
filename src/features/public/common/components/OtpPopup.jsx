import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, Controller, HStack, Popup, Text, useForm, VStack } from '@kfonbss/bss-ui-components';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { Close } from '@/components/custom';
import OtpInput from '@/components/custom/OtpInput';
import { getApiProgress } from '@/features/others/ApiProgress/selectors';

import { ACTION_TYPES, sendOtpForForms, verifyOtpForForms } from '../actions';
import { STATE_REDUCER_KEY } from '../constants';
import { getOtpDetails, getOtpError } from '../selectors';
import { actions as sliceOtpActions } from '../slice';
import { otpSchema } from '../validations';

const OtpPopup = ({ isOpen, setIsOpen, confirmLabel }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [counter, setCounter] = useState(60);
  const [timerKey, setTimerKey] = useState(0);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
    clearErrors
  } = useForm({
    resolver: yupResolver(otpSchema),
    defaultValues: { otp: '' }
  });

  const otpDetails = useSelector(getOtpDetails);
  const mobile = useSelector((state) => state[STATE_REDUCER_KEY].otpMobile);
  const apiProgress = useSelector(getApiProgress);
  const isVerifying = apiProgress[ACTION_TYPES.VERIFY_OTP_FORMS] || false;
  const otpError = useSelector(getOtpError);

  useEffect(() => {
    if (otpError) {
      setError('otp', { type: 'server', message: otpError });
    } else {
      clearErrors('otp');
    }
  }, [otpError, setError, clearErrors]);

  useEffect(() => {
    if (!isOpen) return;

    reset({ otp: '' });
    dispatch(sliceOtpActions.setOtpError(''));
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
  }, [isOpen, timerKey, reset, dispatch]);

  const handleResendOtp = () => {
    dispatch(sliceOtpActions.setOtpError(''));
    dispatch(sendOtpForForms({ cusMobile: otpDetails?.cusMobile || mobile, isResend: true }));
    setTimerKey((k) => k + 1);
  };

  const handleClose = () => {
    dispatch(sliceOtpActions.setOtpError(''));
    setIsOpen(false);
  };

  const onSubmit = (data) => {
    dispatch(sliceOtpActions.setOtpError(''));
    dispatch(
      verifyOtpForForms({
        ...otpDetails,
        otp: data.otp
      })
    );
  };

  return (
    <Popup
      isOpen={isOpen}
      onOpenChange={(e) => setIsOpen(e?.open)}
      size='md'
      placement='center'
      title={t('verify')}
      titleMain={t('yourMobileNumber')}
      contentProps={{ maxW: { base: '320px', md: '320px' }, mx: 'auto' }}
      closeOnInteractOutside={false}
    >
      <VStack as='form' onSubmit={handleSubmit(onSubmit)} alignItems='stretch' p={5} pt={0} gap={3}>
        <Text fontSize='15px' textAlign={{ base: 'center', md: 'left' }}>
          {t('enterTheOtpSentTo', { 0: otpDetails.cusMobile ?? mobile })}
        </Text>

        <Controller
          name='otp'
          control={control}
          render={({ field }) => (
            <OtpInput
              length={6}
              value={field.value}
              onChange={field.onChange}
              error={!!errors.otp}
              autoFocus
            />
          )}
        />
        {errors.otp && (
          <Text fontSize='13px' color='red.400'>
            {errors.otp.message}
          </Text>
        )}

        <Text
          fontSize='14px'
          ml={{ base: 0, md: 'auto' }}
          mt='2'
          textAlign={{ base: 'center', md: 'right' }}
          aria-live='polite'
          aria-atomic='true'
        >
          {counter > 0 ? (
            <Box as='span' color='gray.600'>
              {t('resendOtpIn')} 00:{counter < 10 ? `0${counter}` : counter}
            </Box>
          ) : (
            <Box
              as='button'
              type='button'
              color='primary.500'
              fontWeight='600'
              textDecoration='underline'
              onClick={handleResendOtp}
              cursor={'pointer'}
            >
              {t('resendOtp')}
            </Box>
          )}
        </Text>

        <HStack justifyContent={{ base: 'center', md: 'flex-end' }} flexWrap={{ base: 'wrap', md: 'nowrap' }} gap={3}>
          <Button variant='outline' type='button' onClick={handleClose} w={{ base: '100%', md: 'auto' }}>
            <Close /> {t('close')}
          </Button>

          <Button type='submit' colorScheme='primary' w={{ base: '100%', md: 'auto' }} isLoading={isVerifying}>
            {confirmLabel ?? t('confirmBooking')}
          </Button>
        </HStack>
      </VStack>
    </Popup>
  );
};

export default OtpPopup;
