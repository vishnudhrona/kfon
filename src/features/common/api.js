import { REQUEST_METHOD } from '@/constants/api';
import { API_URL } from '@/constants/urls';

import { ACTION_TYPES, API_ACTION_TYPE_VARIANTS } from './actions';

export const fetchDistictDetailsApi = () => ({
  url: API_URL.COMMON.DISTRICT,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_DISTRICT],
    progressKey: ACTION_TYPES.FETCH_DISTRICT,
    isErrorToast: false
  },
  guestAccess: true
});

export const fetchPostOfficeDetailsApi = (data) => ({
  url: API_URL.COMMON.POSTOFFICE.replace(':pincode', data?.pincode),
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_POSTOFFICE],
    progressKey: ACTION_TYPES.FETCH_POSTOFFICE,
    isErrorToast: false
  },
  guestAccess: true
});

export const fetchPostOfficeByPincodeApi = (data) => ({
  url: API_URL.COMMON.POSTOFFICE_BY_PINCODE.replace(':pinCode', data?.pinCode),
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_POSTOFFICE_BY_PINCODE],
    progressKey: ACTION_TYPES.FETCH_POSTOFFICE_BY_PINCODE,
    isErrorToast: false
  },
  guestAccess: true
});

export const sendOtpApi = (data) => ({
  url: API_URL.COMMON.OTP_SEND,
  method: REQUEST_METHOD.POST,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.SEND_OTP],
    data,
    progressKey: ACTION_TYPES.SEND_OTP
  },
  guestAccess: true
});

export const submitOtpApi = (data) => ({
  url: API_URL.COMMON.OTP_VERIFY,
  method: REQUEST_METHOD.POST,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.SUBMIT_OTP],
    data,
    progressKey: ACTION_TYPES.SUBMIT_OTP,
    isErrorToast: false
  },
  guestAccess: true
});

export const fetchPincodeApi = () => ({
  url: API_URL.COMMON.PINCODE,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_PINCODE],
    progressKey: ACTION_TYPES.FETCH_PINCODE,
    isErrorToast: false
  },
  guestAccess: true
});

export const fetchLocalBodyApi = ({ locationType } = {}) => ({
  url: API_URL.COMMON.LOCAL_BODY.replace(':locationType', locationType),
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_LOCAL_BODY],
    progressKey: ACTION_TYPES.FETCH_LOCAL_BODY,
    isErrorToast: false
  }
});

export const fetchPanchayathApi = ({ districtId, villageTypeId } = {}) => ({
  url: API_URL.COMMON.PANCHAYATH.replace(':districtId', districtId).replace(':villageTypeId', villageTypeId),
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_PANCHAYATH],
    progressKey: ACTION_TYPES.FETCH_PANCHAYATH,
    isErrorToast: false
  }
});

export const fetchBlockApi = ({ districtId, villageTypeId } = {}) => ({
  url: API_URL.COMMON.BLOCK.replace(':districtId', districtId).replace(':villageTypeId', villageTypeId),
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_BLOCK],
    progressKey: ACTION_TYPES.FETCH_BLOCK,
    isErrorToast: false
  }
});

export const fetchCorporationApi = ({ districtId, villageTypeId } = {}) => ({
  url: API_URL.COMMON.CORPORATION.replace(':districtId', districtId).replace(':villageTypeId', villageTypeId),
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_CORPORATION],
    progressKey: ACTION_TYPES.FETCH_CORPORATION,
    isErrorToast: false
  }
});

export const checkUsernameAvailabilityApi = (data) => ({
  url: API_URL.COMMON.CHECK_USERNAME_AVAILABILITY,
  method: REQUEST_METHOD.GET,
  payload: {
    data,
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.CHECK_USERNAME_AVAILABILITY],
    progressKey: ACTION_TYPES.CHECK_USERNAME_AVAILABILITY,
    isErrorToast: false
  }
});

export const fetchRandomNumberApi = () => ({
  url: API_URL.COMMON.RANDOM_NUMBER,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_RANDOM_NUMBER],
    progressKey: ACTION_TYPES.FETCH_RANDOM_NUMBER,
    isErrorToast: false
  }
});

export const searchGstDetailsApi = (data) => ({
  url: API_URL.ONBOARDING.ONBOARDING_GST_DETAILS_SEARCH,
  method: REQUEST_METHOD.POST,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.SEARCH_GST_DETAILS],
    data,
    progressKey: ACTION_TYPES.SEARCH_GST_DETAILS
  }
});

export const requestAadhaarOtpApi = (data = {}) => ({
  url: API_URL.COMMON.AADHAAR_OTP_REQUEST,
  method: REQUEST_METHOD.POST,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.REQUEST_AADHAAR_OTP],
    progressKey: ACTION_TYPES.REQUEST_AADHAAR_OTP,
    isErrorToast: false,
    data
  }
});

export const verifyAadhaarOtpApi = (data) => ({
  url: API_URL.COMMON.AADHAAR_OTP_VERIFY,
  method: REQUEST_METHOD.POST,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.VERIFY_AADHAAR_OTP],
    progressKey: ACTION_TYPES.VERIFY_AADHAAR_OTP,
    data,
    isErrorToast: false
  }
});

export const fileStorageDeleteApi = (fileId) => ({
  url: API_URL.COMMON.FILE_DELETE_URL.replace(':fileId', fileId),
  method: REQUEST_METHOD.DELETE,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FILE_STORAGE_DELETE],
    progressKey: ACTION_TYPES.FILE_STORAGE_DELETE
  }
});

export const fileStorageViewUrlApi = (fileId) => ({
  url: API_URL.COMMON.FILE_URL.replace(':fileId', fileId),
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FILE_STORAGE_VIEW_URL],
    progressKey: ACTION_TYPES.FILE_STORAGE_VIEW_URL,
    isErrorToast: false
  }
});
