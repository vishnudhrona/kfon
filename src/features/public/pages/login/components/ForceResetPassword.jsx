import { yupResolver } from '@hookform/resolvers/yup';
import { Popup } from '@kfonbss/bss-ui-components';
import { get } from 'lodash-es';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { useDispatch, useSelector } from 'react-redux';

import { Box, Button, FormController, HStack, Icon, OtpInput, SimpleGrid, Text, useForm } from '@/components/custom';

import { resetPassword, sendOtp, verifyOtp } from '../action';
import { STATE_REDUCER_KEY } from '../constants';
import { getOtpSent, getOtpVerified } from '../selector';
import { resetPasswordSchema } from '../validations';

const STEP = { OTP: 'otp', NEW_PASSWORD: 'new_password' };

function ForceResetPassword({ isOpen }) {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const username = useSelector((state) => get(state[STATE_REDUCER_KEY], 'loginDetails.data.username'));
  const otpSent = useSelector(getOtpSent);
  const otpVerified = useSelector(getOtpVerified);

  const [step, setStep] = useState(STEP.OTP);
  const [counter, setCounter] = useState(0);
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const schema = resetPasswordSchema(t);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({ resolver: yupResolver(schema), defaultValues: { userName: username } });

  useEffect(() => {
    if (isOpen && username) {
      dispatch(sendOtp({ username, onSuccess: () => {} }));
      setCounter(60);
    }
  }, [isOpen, username, dispatch]);

  useEffect(() => {
    let timer;
    if (counter > 0) {
      timer = setInterval(() => setCounter((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [counter]);

  useEffect(() => {
    if (otpVerified?.token) {
      setStep(STEP.NEW_PASSWORD);
      reset();
    }
  }, [otpVerified?.token, reset]);

  const handleResend = () => {
    dispatch(sendOtp({ username, onSuccess: () => {} }));
    setCounter(60);
  };

  const onSubmitOtp = (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setOtpError(t('invalidOtp', { defaultValue: 'Invalid OTP' }));
      return;
    }
    setOtpError('');
    dispatch(verifyOtp({ otpReferenceId: otpSent?.otpRefId, otp }));
  };

  const onSubmitPassword = (data) => {
    dispatch(resetPassword({ ...data, username, token: otpVerified?.token }));
  };

  return (
    <Popup
      isOpen={isOpen}
      onOpenChange={() => {}}
      title={t('change')}
      titleMain={t('password')}
      closeButton={false}
      closeOnInteractOutside={false}
      size='md'
    >
      {step === STEP.OTP && (
        <Box p={5} as='form' onSubmit={onSubmitOtp} display='flex' flexDir='column' gap='24px'>
          <SimpleGrid gap='24px'>
            <Box display='flex' flexDir='column' gap='8px'>
              <Text fontSize='14px' fontWeight={500}>
                {t('enterOtp')}
              </Text>
              {otpSent?.mobile && (
                <Text fontSize='13px' color='gray.500'>
                  {t('otpSentToMobile', { last4: otpSent.mobile.slice(-4) })}
                </Text>
              )}
              <OtpInput
                length={6}
                value={otp}
                onChange={(val) => {
                  setOtp(val);
                  setOtpError('');
                }}
                error={otpError}
                autoFocus
              />
              {otpError && (
                <Text fontSize='12px' color='red.500'>
                  {otpError}
                </Text>
              )}
            </Box>
            <Box display='flex' justifyContent='flex-end'>
              <Button p={0} variant='unstyled' onClick={handleResend} disabled={counter > 0}>
                {counter > 0 ? `${t('resendOtpIn')} ${counter}s` : t('resendOtp')}
              </Button>
            </Box>
          </SimpleGrid>

          <HStack mt='26px'>
            <Button variant='solid' type='submit' flex={1}>
              {t('verify')}
            </Button>
          </HStack>
        </Box>
      )}

      {step === STEP.NEW_PASSWORD && (
        <Box p={5} as='form' onSubmit={handleSubmit(onSubmitPassword)} display='flex' flexDir='column' gap='24px'>
          <Box position='relative'>
            <FormController
              placeholder={t('enterNewPassword')}
              labelName={t('newPassword')}
              name='newPassword'
              control={control}
              errors={errors}
              type={showNewPassword ? 'text' : 'password'}
            />
            <Box
              position='absolute'
              right='12px'
              top='38px'
              cursor='pointer'
              onClick={() => setShowNewPassword(!showNewPassword)}
              zIndex={2}
            >
              <Icon as={showNewPassword ? AiOutlineEyeInvisible : AiOutlineEye} w={5} h={5} color='gray.500' />
            </Box>
          </Box>

          <Box position='relative'>
            <FormController
              placeholder={t('reEnterNewPassword')}
              labelName={t('confirmPassword')}
              name='confirmPassword'
              control={control}
              errors={errors}
              type={showConfirmPassword ? 'text' : 'password'}
            />
            <Box
              position='absolute'
              right='12px'
              top='38px'
              cursor='pointer'
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              zIndex={2}
            >
              <Icon as={showConfirmPassword ? AiOutlineEyeInvisible : AiOutlineEye} w={5} h={5} color='gray.500' />
            </Box>
          </Box>

          <HStack mt='16px'>
            <Button variant='solid' type='submit' flex={1}>
              {t('changePassword')}
            </Button>
          </HStack>
        </Box>
      )}
    </Popup>
  );
}

export default ForceResetPassword;
