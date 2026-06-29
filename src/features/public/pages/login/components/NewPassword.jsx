import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { useDispatch, useSelector } from 'react-redux';

import { BackSvg, LoginSvg } from '@/assets/svg';
import { Box, Button, FormController, HStack, Icon, Text, useForm } from '@/components/custom';

import { resetPassword } from '../action';
import { getForgotPasswordUsername, getOtpVerified } from '../selector';
import { resetPasswordSchema } from '../validations';

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(resetPasswordSchema(t))
  });
  
  const otpVerified = useSelector(getOtpVerified);
  const forgotPasswordUsername = useSelector(getForgotPasswordUsername);

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const onSubmit = (data) => {
    const payload = {
      ...data,
      username: forgotPasswordUsername,
      token: otpVerified?.token
    }
    dispatch(resetPassword(payload));
  };

  return (
    <Box display={'flex'} flexDir={'column'}>
      <Text
        fontSize={'36px'}
        lineHeight={'36px'}
        fontWeight={600}
        p={0}
        m={'0 0 65px'}
        color={'black'}
        textAlign={'center'}
      >
        {t('forgotPassword')}
      </Text>

      <Box as='form' onSubmit={handleSubmit(onSubmit)} display={'flex'} flexDir={'column'} gap={'24px'}>
        <Box position='relative'>
          <FormController
            placeholder={t('enterNewPassword')}
            labelName={t('newPassword')}
            name={'newPassword'}
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
            name={'confirmPassword'}
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
        <HStack mt={'50px'}>
          <Button onClick={() => navigate({ to: '/auth/forgot-password' })} variant='outline' flex={1}>
            <BackSvg />
            {t('back')}
          </Button>

          <Button variant='solid' type='submit' flex={1}>
            {t('login')} <LoginSvg />
          </Button>
        </HStack>
      </Box>
    </Box>
  );
}

export default Login;
