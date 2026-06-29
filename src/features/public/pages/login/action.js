import { createAction } from '@reduxjs/toolkit';

import { generateActionTypeVariants } from '@/utils/actionUtils';

import { STATE_REDUCER_KEY } from './constants';

const API_ACTION_TYPES = {
  USER_LOGIN: `${STATE_REDUCER_KEY}/USER_LOGIN`,
  VERIFY_LOGIN_OTP: `${STATE_REDUCER_KEY}/VERIFY_LOGIN_OTP`,
  RESEND_LOGIN_OTP: `${STATE_REDUCER_KEY}/RESEND_LOGIN_OTP`,
  SEND_OTP: `${STATE_REDUCER_KEY}/SEND_OTP`,
  VERIFY_OTP: `${STATE_REDUCER_KEY}/VERIFY_OTP`,
  RESEND_OTP: `${STATE_REDUCER_KEY}/RESEND_OTP`,
  PASSWORD_RESET: `${STATE_REDUCER_KEY}/PASSWORD_RESET`,
  REFRESH_TOKEN: `${STATE_REDUCER_KEY}/REFRESH_TOKEN`,
  FETCH_STATES: `${STATE_REDUCER_KEY}/FETCH_STATES`
};

export const ACTION_TYPES = {
  ...API_ACTION_TYPES
};

export const API_ACTION_TYPE_VARIANTS = generateActionTypeVariants(API_ACTION_TYPES);

export const userLoginRequest = createAction(ACTION_TYPES.USER_LOGIN);
export const verifyLoginOtp = createAction(ACTION_TYPES.VERIFY_LOGIN_OTP);
export const resendLoginOtp = createAction(ACTION_TYPES.RESEND_LOGIN_OTP);
export const sendOtp = createAction(ACTION_TYPES.SEND_OTP);
export const resendOtp = createAction(ACTION_TYPES.RESEND_OTP);
export const verifyOtp = createAction(ACTION_TYPES.VERIFY_OTP);
export const resetPassword = createAction(ACTION_TYPES.PASSWORD_RESET);
export const fetchStates = createAction(ACTION_TYPES.FETCH_STATES);
