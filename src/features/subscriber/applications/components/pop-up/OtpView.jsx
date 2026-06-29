import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, FormController, HStack, Text, useForm, VStack } from '@kfonbss/bss-ui-components';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { TickIcon } from '@/assets/svg';
import { BsArrowLeftCircle, Close } from '@/components/custom';
import { getApiProgress } from '@/features/others/ApiProgress/selectors';
import { ACTION_TYPES, sendOtpForForms, verifyOtpForForms } from '@/features/public/common/actions';
import { STATE_REDUCER_KEY } from '@/features/public/common/constants';
import { getOtpDetails, getOtpError } from '@/features/public/common/selectors';
import { actions as sliceOtpActions } from '@/features/public/common/slice';
import { otpSchema } from '@/features/public/common/validations';
import { getHomeSubscriberSubmitDetails } from '@/features/public/pages/enquiryForms/selector';

const OtpView = ({ onCancel, onBack }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [otpCounter, setOtpCounter] = useState(60);
  const [otpTimerKey, setOtpTimerKey] = useState(0);

  const otpMobile = useSelector((state) => state[STATE_REDUCER_KEY].otpMobile);
  const otpDetails = useSelector(getOtpDetails);
  const submitDetails = useSelector(getHomeSubscriberSubmitDetails);
  const apiProgress = useSelector(getApiProgress);
  const isVerifying = apiProgress[ACTION_TYPES.VERIFY_OTP_FORMS] || false;

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError
  } = useForm({
    resolver: yupResolver(otpSchema),
    defaultValues: { otp: '' }
  });

  const otpError = useSelector(getOtpError);

  useEffect(() => {
    if (otpError) {
      setError('otp', { type: 'server', message: otpError });
    }
  }, [otpError, setError]);

  useEffect(() => {
    setOtpCounter(60);
    const interval = setInterval(() => {
      setOtpCounter((sec) => {
        if (sec <= 1) {
          clearInterval(interval);
          return 0;
        }
        return sec - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [otpTimerKey]);

  const handleResendOtp = () => {
    dispatch(sliceOtpActions.setOtpError(''));
    dispatch(sendOtpForForms({ ...otpDetails, cusMobile: otpDetails?.cusMobile || otpMobile }));
    setOtpTimerKey((k) => k + 1);
  };

  const onSubmit = (data) => {
    dispatch(sliceOtpActions.setOtpError(''));
    dispatch(verifyOtpForForms({ ...otpDetails, otp: data.otp }));
  };

  const maskedMobile = otpMobile
    ? `${otpMobile.slice(0, 2)}${'*'.repeat(otpMobile.length - 4)}${otpMobile.slice(-2)}`
    : '';

  const isSuccess = !!submitDetails?.trackingId;

  if (isSuccess) {
    return (
      <Box px={4}>
        <VStack gap={5} alignItems='stretch'>
          <Box bg='gray.50' borderRadius='8px' p={4} textAlign='center'>
            <Text fontSize='14px' color='#272727'>
              {t('enquirySubmittedSuccessfully')}
            </Text>
            <Text fontSize='14px' color='#272727' fontWeight={600}>
              {t('yourTrackingId')} {submitDetails.trackingId}.
            </Text>
          </Box>

          <HStack justifyContent='flex-end' w='100%'>
            <Button
              type='button'
              borderRadius='48px'
              bg='primary.500'
              color='white'
              h='47px'
              px='18px'
              fontSize='16px'
              fontWeight='500'
              _hover={{ bg: '#700138' }}
              onClick={onCancel}
            >
              {t('done')}
              <Box as='span' ml='6px' display='inline-flex' alignItems='center'>
                <TickIcon />
              </Box>
            </Button>
          </HStack>
        </VStack>
      </Box>
    );
  }

  return (
    <Box px={4}>
      <VStack as='form' onSubmit={handleSubmit(onSubmit)} gap={5} alignItems='stretch'>
        <Text fontSize='14px' color='#272727'>
          {t('enterTheOtpSentTo', { 0: maskedMobile })}
        </Text>

        <FormController
          labelName={t('otp')}
          name='otp'
          placeholder='XXXX'
          control={control}
          errors={errors}
          maxLength={6}
          minLength={6}
          required
          width='100%'
        />

        {otpCounter > 0 ? (
          <Text fontSize='14px' textAlign='right' color='gray.500'>
            {t('resendOtpIn')} 00:{otpCounter < 10 ? `0${otpCounter}` : otpCounter}
          </Text>
        ) : (
          <Text fontSize='14px' textAlign='right'>
            <Box
              as='span'
              color='primary.500'
              fontWeight='600'
              cursor='pointer'
              textDecoration='underline'
              onClick={handleResendOtp}
            >
              {t('resendOtp')}
            </Box>
          </Text>
        )}

        <HStack justifyContent='space-between' w='100%' mt={2}>
          <HStack
            gap={1}
            cursor='pointer'
            color='#272727'
            fontSize='14px'
            _hover={{ color: 'primary.500' }}
            onClick={onBack}
            as='button'
            type='button'
          >
            <BsArrowLeftCircle boxSize={4} />
            <Text fontSize='14px'>{t('goToPrevious')}</Text>
          </HStack>

          <HStack gap={3}>
            <Button
              type='button'
              variant='outline'
              borderColor='primary.500'
              color='primary.500'
              borderRadius='48px'
              h='47px'
              px='18px'
              fontSize='16px'
              fontWeight='500'
              _hover={{ bg: 'primary.50' }}
              onClick={onCancel}
            >
              <Close />
              {t('cancel')}
            </Button>
            <Button
              type='submit'
              borderRadius='48px'
              bg='primary.500'
              color='white'
              h='47px'
              px='18px'
              fontSize='16px'
              fontWeight='500'
              _hover={{ bg: '#700138' }}
              isLoading={isVerifying}
            >
              {t('submit')}
              <Box as='span' ml='6px' display='inline-flex' alignItems='center'>
                <TickIcon />
              </Box>
            </Button>
          </HStack>
        </HStack>
      </VStack>
    </Box>
  );
};

export default OtpView;
