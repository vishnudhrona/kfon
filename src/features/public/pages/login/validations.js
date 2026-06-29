import * as yup from 'yup';

import { regex, validation } from '@/utils/validationUtils';

export const userLoginSchema = (t) =>
  yup.object({
    username: yup
      .string()
      .required(t('validations.required', { 0: t('username') }))
      .min(3, t('validations.invalidFormat', { 0: t('username') })),
    password: yup
      .string()
      .required(t('validations.required', { 0: t('password') }))
      .min(6, t('validations.invalidFormat', { 0: t('password') }))
  });

export const forgotPasswordUsernameSchema = (t) =>
  yup.object({
    userName: yup.string().required(t('validations.required', { 0: t('userName') }))
  });

export const forgotPasswordOtpSchema = (t) => {
  const msg = validation(t);
  return yup.object({
    userName: yup.string().required(t('validations.required', { 0: t('userName') })),
    otp: yup.string().required(msg.required('otp')).matches(regex.otp, msg.invalidDigits('otp', 6))
  });
};

export const resetPasswordSchema = (t) => {
  const msg = validation(t);
  return yup.object({
    newPassword: yup.string().required(msg.required('password')).min(8),
    confirmPassword: yup
      .string()
      .required(msg.required('confirmPassword'))
      .oneOf([yup.ref('newPassword'), null], 'Passwords must match')
  });
};
