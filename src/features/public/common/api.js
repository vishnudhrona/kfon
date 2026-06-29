import { REQUEST_METHOD } from '@/constants/api';
import { API_URL } from '@/constants/urls';

import { ACTION_TYPES, API_ACTION_TYPE_VARIANTS } from './actions';

export const sendOtpFormsApi = (data = {}) => ({
  url: API_URL.COMMON.OTP_SEND,
  method: REQUEST_METHOD.POST,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.SEND_OTP_FORMS],
    data,
    progressKey: ACTION_TYPES.SEND_OTP_FORMS
  },
  guestAccess: true
});

export const verifyOtpFormsApi = (data = {}) => ({
  url: API_URL.COMMON.OTP_VERIFY,
  method: REQUEST_METHOD.POST,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.VERIFY_OTP_FORMS],
    data,
    progressKey: ACTION_TYPES.VERIFY_OTP_FORMS,
    isErrorToast: false
  },
  guestAccess: true
});
