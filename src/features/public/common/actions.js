import { createAction } from '@reduxjs/toolkit';

import { generateActionTypeVariants } from '@/utils/actionUtils';

import { STATE_REDUCER_KEY } from './constants';

const API_ACTION_TYPES = {
  SEND_OTP_FORMS: `${STATE_REDUCER_KEY}/SEND_OTP_FORMS`,
  VERIFY_OTP_FORMS: `${STATE_REDUCER_KEY}/VERIFY_OTP_FORMS`
};

export const ACTION_TYPES = {
  ...API_ACTION_TYPES
};

export const API_ACTION_TYPE_VARIANTS = generateActionTypeVariants(API_ACTION_TYPES);

export const sendOtpForForms = createAction(ACTION_TYPES.SEND_OTP_FORMS);
export const verifyOtpForForms = createAction(ACTION_TYPES.VERIFY_OTP_FORMS);
