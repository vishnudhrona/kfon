import { Box, Controller, FormController, Text } from '@kfonbss/bss-ui-components';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import OtpInput from '@/components/custom/OtpInput';
import { allowOnlyDigits } from '@/utils/validationUtils';

const EkycFields = ({ show = false, isOtpSend = false, errors, control, onResendOtp }) => {
  const { t } = useTranslation();
  const [otpCounter, setOtpCounter] = useState(60);
  const [otpTimerKey, setOtpTimerKey] = useState(0);

  useEffect(() => {
    if (isOtpSend) {
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
    } else {
      setOtpCounter(60);
      setOtpTimerKey(0);
    }
  }, [isOtpSend, otpTimerKey]);

  const handleResendOtp = () => {
    if (onResendOtp) {
      setOtpTimerKey((k) => k + 1);
      onResendOtp();
    }
  };

  return show ? (
    <>
      <FormController
        placeholder={t('enter', { 0: t('aadhaarNumber') })}
        labelName={t('aadhaarNumber')}
        name={'ekyc.aadhaarNumber'}
        errors={errors}
        control={control}
        onKeyDown={allowOnlyDigits}
        maxLength={12}
        required
      />
      {isOtpSend && (
        <Box w='100%'>
          <Text fontSize='14px' fontWeight={500} mb={2}>
            {t('otp')}
          </Text>
          <Controller
            name='ekyc.otp'
            control={control}
            render={({ field }) => (
              <OtpInput
                length={6}
                value={field.value ?? ''}
                onChange={field.onChange}
                error={!!errors?.ekyc?.otp}
                autoFocus
              />
            )}
          />
          {errors?.ekyc?.otp && (
            <Text fontSize='13px' color='red.400' mt={1}>
              {errors.ekyc.otp.message}
            </Text>
          )}
          {otpCounter > 0 ? (
            <Text fontSize='14px' textAlign='right' color='gray.500' mt={5}>
              {t('resendOtpIn')} 00:{otpCounter < 10 ? `0${otpCounter}` : otpCounter}
            </Text>
          ) : (
            <Text fontSize='14px' textAlign='right' mt={2}>
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
        </Box>
      )}
    </>
  ) : null;
};

export default EkycFields;
