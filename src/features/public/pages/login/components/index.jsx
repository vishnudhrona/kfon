import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, chakra, FormController, HStack, Icon, Text, useForm } from '@kfonbss/bss-ui-components';
import { useNavigate } from '@tanstack/react-router';
import { get } from 'lodash-es';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { useDispatch, useSelector } from 'react-redux';

import { LoginSvg, NormalBackSvg } from '@/assets/svg';
import CustomEditIcon from '@/components/custom/CustomEditIcon';
import { stripExtraSpaces } from '@/utils/validationUtils';

import { userLoginRequest } from '../action';
import { STATE_REDUCER_KEY } from '../constants';
import { getSelectedTenant } from '../selector';
import { userLoginSchema } from '../validations';
import { actions as loginActions } from './../slice';

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const errorMessage = useSelector((state) => get(state, `${STATE_REDUCER_KEY}.error`, ''));
  const selectedTenant = useSelector(getSelectedTenant);
  const tenantName = selectedTenant?.name || selectedTenant?.stateName || '';

  const {
    control,
    handleSubmit,
    clearErrors,
    formState: { errors },
    setError
  } = useForm({ resolver: yupResolver(userLoginSchema(t)) });

  const handleLogin = (values) => {
    dispatch(userLoginRequest({ username: values.username?.trim(), password: values.password }));
  };

  useEffect(() => {
    // Preload the OTP screen chunk so the first navigation feels instant
    import('./LoginOtp');
  }, []);

  useEffect(() => {
    if (errorMessage) {
      const lower = errorMessage.toLowerCase();
      const isUsernameError = lower.includes('user') && !lower.includes('password');
      const targetField = isUsernameError ? 'username' : 'password';
      const otherField = isUsernameError ? 'password' : 'username';
      setError(targetField, { type: 'manual', message: errorMessage });
      clearErrors(otherField);
    } else {
      clearErrors(['username', 'password']);
    }
  }, [errorMessage, setError, clearErrors]);

  useEffect(() => {
    if (!errors.password && !errors.username && errorMessage) {
      dispatch(loginActions.setLoginError(''));
    }
  }, [errors.password, errors.username, errorMessage, dispatch]);

  return (
    <Box display={'flex'} flexDir={'column'}>
      <Text
        fontSize={'44px'}
        lineHeight={'44px'}
        fontWeight={600}
        p={0}
        m={'0 0 24px'}
        color={'black'}
        textAlign={'center'}
      >
        {t('login')}
      </Text>

      {tenantName && (
        <HStack
          justifyContent='space-between'
          alignItems='center'
          position='relative'
          bgGradient='linear(to-r, #FFF4F9 0%, #FFFFFF 70%)'
          border='1px solid'
          borderColor='#F4D5E2'
          borderRadius='14px'
          boxShadow='0 6px 18px rgba(141, 2, 71, 0.08)'
          pl='22px'
          pr='12px'
          py='14px'
          mb='32px'
          gap='12px'
          overflow='hidden'
          _before={{
            content: '""',
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: '4px',
            bg: '#FFDE74',
            borderRadius: '0 4px 4px 0'
          }}
          _after={{
            content: '""',
            position: 'absolute',
            right: '-30px',
            top: '-30px',
            width: '90px',
            height: '90px',
            borderRadius: 'full',
            bg: '#FDF2F8',
            opacity: 0.6,
            pointerEvents: 'none'
          }}
        >
          <Box position='relative' zIndex={1}>
            <Text fontSize='11px' fontWeight={600} color='black' lineHeight='1' textTransform='uppercase' letterSpacing='1.2px' mb='4px'>
              {t('selectedCircle', { defaultValue: 'Selected Circle' })}
            </Text>
            <Text fontSize='18px' fontWeight={700} color='primary.500' lineHeight='1.2'>
              {tenantName}
            </Text>
          </Box>
          <Box position='relative' zIndex={1}>
            <CustomEditIcon onClick={() => navigate({ to: '/auth/tenant-selection' })} />
          </Box>
        </HStack>
      )}

      <chakra.form display={'flex'} flexDir={'column'} gap={'24px'} onSubmit={handleSubmit(handleLogin)}>
        <Box>
          <FormController
            placeholder={t('enter', { 0: t('userName') })}
            labelName={t('userName')}
            name={'username'}
            control={control}
            errors={errors}
            onInput={stripExtraSpaces}
          />
        </Box>
        <Box position='relative'>
          <FormController
            placeholder={t('enterPasswordHere')}
            labelName={t('password')}
            name={'password'}
            control={control}
            errors={errors}
            type={showPassword ? 'text' : 'password'}
          />
          <Box
            position='absolute'
            right='12px'
            top='38px'
            cursor='pointer'
            onClick={() => setShowPassword(!showPassword)}
            zIndex={2}
          >
            <Icon as={showPassword ? AiOutlineEyeInvisible : AiOutlineEye} w={5} h={5} color='gray.500' />
          </Box>
          <Box mt={7} display={'flex'} justifyContent={'flex-end'}>
            <Button
              onClick={() =>
                navigate({
                  to: '/auth/forgot-password'
                })
              }
              variant='unstyled'
              p={0}
            >
              {`${t('forgotPassword')}?`}
            </Button>
          </Box>
        </Box>
        <Box>
          <Button type='submit' variant='solid' width={'full'}>
            {t('login')} <LoginSvg />
          </Button>
          <Button
            width={'full'}
            mt={'20px'}
            color={'black'}
            textAlign={'center'}
            onClick={() => navigate({ to: '/auth/tenant-selection' })}
            variant='unstyled'
            p={0}
          >
            <NormalBackSvg /> {t('back')}
          </Button>
        </Box>
      </chakra.form>
    </Box>
  );
}

export default Login;
