import { STORAGE_KEYS } from '@/constants';
import { REQUEST_METHOD } from '@/constants/api';
import { API_URL } from '@/constants/urls';
import { getDataFromStorage } from '@/utils/encryptionUtils';

import { ACTION_TYPES, API_ACTION_TYPE_VARIANTS } from './action';

// Resolve the selected tenant code from storage so we can attach
// `X-Tenant-ID` header (and `tenantId` body field) to all pre-token
// auth endpoints — the backend requires it for multi-tenant routing.
const getTenantCode = () => {
  try {
    const tenant = getDataFromStorage(STORAGE_KEYS.SELECTED_TENANT, true, null);
    // The /api/state/fetch-all response carries the alphabetic short code
    // (e.g. "KL") in `code`. `stateCode` is the numeric state code (32, etc.)
    // — not what the backend's X-Tenant-ID header expects.
    return tenant?.code || tenant?.tenantCode || tenant?.iso || tenant?.isoCode || '';
  } catch {
    return '';
  }
};

const tenantHeader = () => {
  const code = getTenantCode();
  return code ? { 'X-Tenant-ID': code } : {};
};

export const refreshTokenApi = (data = {}) => ({
  url: API_URL.AUTH.REFRESH_TOKEN,
  method: REQUEST_METHOD.POST,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.REFRESH_TOKEN],
    data,
    headers: tenantHeader(),
    isErrorToast: false
  },
  guestAccess: true
});

export const userLoginApi = (data = {}) => {
  const tenantCode = getTenantCode();
  return {
    url: API_URL.AUTH.LOGIN,
    method: REQUEST_METHOD.POST,
    payload: {
      types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.USER_LOGIN],
      data: { ...data, tenantId: tenantCode },
      headers: tenantCode ? { 'X-Tenant-ID': tenantCode } : {},
      progressKey: ACTION_TYPES.USER_LOGIN,
      isErrorToast: false
    },
    guestAccess: true
  };
};

export const verifyLoginOtpApi = (data = {}) => ({
  url: API_URL.AUTH.LOGIN_VERIFY_OTP,
  method: REQUEST_METHOD.POST,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.VERIFY_LOGIN_OTP],
    data,
    headers: tenantHeader(),
    progressKey: ACTION_TYPES.VERIFY_LOGIN_OTP,
    isErrorToast: false
  },
  guestAccess: true
});

export const resendLoginOtpApi = (data = {}) => ({
  url: API_URL.AUTH.LOGIN_RESEND_OTP,
  method: REQUEST_METHOD.POST,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.RESEND_LOGIN_OTP],
    data,
    headers: tenantHeader(),
    progressKey: ACTION_TYPES.RESEND_LOGIN_OTP,
    isErrorToast: false
  },
  guestAccess: true
});

export const sendOtpApi = (data = {}) => ({
  url: API_URL.AUTH.SEND_OTP,
  method: REQUEST_METHOD.POST,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.SEND_OTP],
    data,
    progressKey: ACTION_TYPES.SEND_OTP
  },
  guestAccess: true
});

export const resendOtpApi = (data = {}) => ({
  url: API_URL.AUTH.RESEND_OTP,
  method: REQUEST_METHOD.POST,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.RESEND_OTP],
    data,
    progressKey: ACTION_TYPES.RESEND_OTP
  },
  guestAccess: true
});

export const verifyOtpApi = (data = {}) => ({
  url: API_URL.AUTH.VERIFY_OTP,
  method: REQUEST_METHOD.POST,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.VERIFY_OTP],
    data,
    progressKey: ACTION_TYPES.VERIFY_OTP
  },
  guestAccess: true
});

export const resetPasswordApi = (data = {}) => ({
  url: API_URL.AUTH.RESET_PASSWORD,
  method: REQUEST_METHOD.POST,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.PASSWORD_RESET],
    data,
    progressKey: ACTION_TYPES.PASSWORD_RESET
  },
  guestAccess: true
});

export const logoutApi = (data = {}) => ({
  url: API_URL.AUTH.LOGOUT,
  method: REQUEST_METHOD.POST,
  payload: {
    types: [`LOGOUT/REQUEST`, `LOGOUT/SUCCESS`, `LOGOUT/FAILURE`],
    data,
    isErrorToast: false
  },
  guestAccess: true
});

export const fetchStatesApi = () => ({
  url: API_URL.COMMON.STATE_FETCH_ALL,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_STATES],
    progressKey: ACTION_TYPES.FETCH_STATES,
    isErrorToast: false
  },
  guestAccess: true
});
