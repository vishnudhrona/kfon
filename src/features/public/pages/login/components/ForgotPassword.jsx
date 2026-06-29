import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, FormController, HStack, Text, useForm } from '@kfonbss/bss-ui-components';
import { useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { BackSvg, ForwardSvg } from '@/assets/svg';
import { SimpleGrid } from '@/components/custom';

import { sendOtp, verifyOtp } from '../action';
import { getForgotPasswordUsername, getOtpSent } from '../selector';
import { forgotPasswordOtpSchema, forgotPasswordUsernameSchema } from '../validations';

function ForgotPassword() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const dispatch = useDispatch()
  const [openOtp, setOpenOtp] = useState(false);
  const [counter, setCounter] = useState(0);

  const otpSent = useSelector(getOtpSent);
  const forgotPasswordUsername = useSelector(getForgotPasswordUsername);

  useEffect(() => {
    let timer;
    if (counter > 0) {
      timer = setInterval(() => {
        setCounter((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [counter]);

  const schema = openOtp ? forgotPasswordOtpSchema(t) : forgotPasswordUsernameSchema(t);

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema)
  });

  const handleSendOtp = (values) => {
    if (!openOtp) {
      dispatch(sendOtp({
        username: values?.userName,
        onSuccess: () => setOpenOtp(true)
      }));
    } else {
      dispatch(verifyOtp({
        otpReferenceId: otpSent?.otpRefId,
        otp: values?.otp
      }));
    }
  };

  const handleResend = () => {
    setCounter(60);
    dispatch(sendOtp({
      username: forgotPasswordUsername,
      onSuccess: () => setOpenOtp(true)
    }));
  };

  return (
    <Box display={'flex'} flexDir={'column'}>
      <Text
        fontSize={'36px'}
        lineHeight={'36px'}
        fontWeight={600}
        p={0}
        mb={'30px'}
        color={'black'}
        textAlign={'center'}
      >
        {t('forgotPassword')}
      </Text>

      <Box as='form' onSubmit={handleSubmit(handleSendOtp)} display={'flex'} flexDir={'column'} gap={'24px'}>
        <SimpleGrid gap={'24px'}>
          <FormController
            placeholder={t('userName')}
            labelName={t('userName')}
            name={'userName'}
            control={control}
            disabled={openOtp}
            errors={errors}
          />

          {openOtp && (
            <>
              <FormController
                placeholder={t('enterOtp')}
                labelName={t('enterOtp')}
                name={'otp'}
                control={control}
                errors={errors}
                maxLength={6}
              />
              <Box display={'flex'} justifyContent={'flex-end'}>
                <Button p={0} variant='unstyled' onClick={handleResend} disabled={counter > 0}>
                  {counter > 0 ? `${t('resendOtpIn')} ${counter}s` : t('resendOtp')}
                </Button>
              </Box>
            </>
          )}
        </SimpleGrid>

        <HStack mt={'26px'}>
          <Button onClick={() => navigate({ to: '/auth/login' })} variant='outline' flex={1}>
            <BackSvg />
            {t('back')}
          </Button>

          <Button
            type='submit'
            variant='solid' flex={1}>
            {openOtp ? t('verify') : t('sendOtp')}
            <ForwardSvg />
          </Button>
        </HStack>
      </Box>
    </Box>
  );
}

export default ForgotPassword;
