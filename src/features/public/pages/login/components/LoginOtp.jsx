import { Box, Button, Text } from '@kfonbss/bss-ui-components';
import { useNavigate } from '@tanstack/react-router';
import { get } from 'lodash-es';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { LoginSvg, NormalBackSvg } from '@/assets/svg';
import { OtpInput } from '@/components/custom';

import { resendLoginOtp, verifyLoginOtp } from '../action';
import { STATE_REDUCER_KEY } from '../constants';
import { getLoginOtpDetails } from '../selector';
import { actions as loginActions } from '../slice';

const OTP_LENGTH = 6;

function LoginOtp() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [counter, setCounter] = useState(45);
  const [otp, setOtp] = useState('');
  const [localError, setLocalError] = useState('');
  const loginOtpDetails = useSelector(getLoginOtpDetails);
  const errorMessage = useSelector((state) => get(state, `${STATE_REDUCER_KEY}.error`, ''));

  useEffect(() => {
    if (!loginOtpDetails?.otpRefId) navigate({ to: '/auth/login' });
  }, [loginOtpDetails, navigate]);

  useEffect(() => {
    if (counter <= 0) return;
    const timer = setInterval(() => setCounter((s) => s - 1), 1000);
    return () => clearInterval(timer);
  }, [counter]);

  const handleOtpChange = (val) => {
    setOtp(val);
    setLocalError('');
    if (errorMessage) dispatch(loginActions.setLoginError(''));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (otp.length !== OTP_LENGTH) {
      setLocalError(t('pleaseEnterValid6DigitOtp', { defaultValue: 'Please enter a valid 6-digit OTP.' }));
      return;
    }
    if (!loginOtpDetails?.otpRefId) return;
    dispatch(
      verifyLoginOtp({
        otpRefId: loginOtpDetails.otpRefId,
        otp,
        loginSessionToken: loginOtpDetails.loginSessionToken
      })
    );
  };

  const handleBack = () => {
    setOtp('');
    setLocalError('');
    dispatch(loginActions.clearLoginOtpDetails());
    dispatch(loginActions.setLoginError(''));
    navigate({ to: '/auth/login' });
  };

  const handleResend = () => {
    if (!loginOtpDetails?.loginSessionToken) return;
    dispatch(resendLoginOtp({ loginSessionToken: loginOtpDetails.loginSessionToken }));
    setCounter(45);
    setOtp('');
    setLocalError('');
    dispatch(loginActions.setLoginError(''));
  };

  const mobile = loginOtpDetails?.mobile || '';
  const maskedMobile = mobile && mobile.length >= 4 ? `+91 XXXXXX${mobile.slice(-4)}` : '';

  const displayError = localError || errorMessage;

  return (
    <Box display='flex' flexDir='column'>
      <Text fontSize='44px' lineHeight='44px' fontWeight={700} m='0 0 40px' color='black' textAlign='center'>
        {t('logIn', { defaultValue: 'Log in' })}
      </Text>

      <Text fontSize='14px' color='#5F5F5F' mb='16px'>
        {t('weHaveSentOtpTo', { defaultValue: 'We have sent an OTP to' })} {maskedMobile}
      </Text>

      <Box as='form' onSubmit={handleSubmit} display='flex' flexDir='column' gap='12px'>
        <OtpInput value={otp} onChange={handleOtpChange} error={displayError} autoFocus />

        {displayError && (
          <Text fontSize='12px' color='red.500'>
            {displayError}
          </Text>
        )}

        <Box display='flex' justifyContent='flex-end' mt='4px'>
          {counter > 0 ? (
            <Text fontSize='14px'>
              <Text as='span' color='primary.500' fontWeight={600}>
                {t('resendOtp')}
              </Text>
              <Text as='span' color='#5F5F5F' ml='4px'>
                in {counter} s
              </Text>
            </Text>
          ) : (
            <Button
              p={0}
              variant='unstyled'
              onClick={handleResend}
              color='primary.500'
              fontWeight={600}
              fontSize='14px'
              h='auto'
            >
              {t('resendOtp')}
            </Button>
          )}
        </Box>

        <Box mt='32px'>
          <Button type='submit' variant='solid' width='full'>
            {t('login')} <LoginSvg />
          </Button>
          <Button width='full' mt='16px' color='black' variant='unstyled' p={0} onClick={handleBack}>
            <NormalBackSvg /> {t('back')}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default LoginOtp;
