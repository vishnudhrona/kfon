import { STORAGE_KEYS } from '@/constants';
import { MULTI_PART_FORM_HEADER, REQUEST_METHOD } from '@/constants/api';
import { API_URL } from '@/constants/urls';
import { getDataFromStorage } from '@/utils/encryptionUtils';

import { ACTION_TYPES, API_ACTION_TYPE_VARIANTS } from './action';

// Resolve selected tenant code from storage so guest (pre-token) enquiry
// submissions can attach `X-Tenant-ID` — backend needs it for multi-tenant
// routing the same way the auth endpoints do. Mirrors login/api.js.
const getTenantCode = () => {
  try {
    const tenant = getDataFromStorage(STORAGE_KEYS.SELECTED_TENANT, true, null);
    return tenant?.code || tenant?.tenantCode || tenant?.iso || tenant?.isoCode || '';
  } catch {
    return '';
  }
};

const tenantHeader = () => {
  const code = getTenantCode();
  return code ? { 'X-Tenant-ID': code } : {};
};

export const bplEnquiryApi = (data = {}) => ({
  url: API_URL.ENQUIRY.SUBMIT_BPL_ENQUIRY,
  method: REQUEST_METHOD.POST,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.SAVE_BPL_ENQUIRY],
    progressKey: ACTION_TYPES.SAVE_BPL_ENQUIRY,
    headers: tenantHeader(),
    data
  },
  guestAccess: true
});

export const homeSubscriberEnquiryApi = (data = {}, isGuest = true) => ({
  url: API_URL.ENQUIRY.SAVE_HOME_SUBSCRIBER_ENQUIRY,
  method: REQUEST_METHOD.POST,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.SAVE_HOME_SUBSCRIBER_ENQUIRY],
    data,
    headers: tenantHeader(),
    progressKey: ACTION_TYPES.SAVE_HOME_SUBSCRIBER_ENQUIRY
  },
  guestAccess: isGuest
});

export const saveCorpGovSubscriberEnquiryApi = (data = {}) => ({
  url: API_URL.ENQUIRY.SUBMIT_CORP_GOV_SUBSCRIBER_ENQUIRY,
  method: REQUEST_METHOD.POST,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.SAVE_CORP_GOV_SUBSCRIBER_ENQUIRY],
    data,
    headers: tenantHeader(),
    progressKey: ACTION_TYPES.SAVE_CORP_GOV_SUBSCRIBER_ENQUIRY
  },
  guestAccess: true
});

export const agnpEnquiryApi = (data = {}) => ({
  url: API_URL.ENQUIRY.SUBMIT_AGNP_ENQUIRY,
  method: REQUEST_METHOD.POST,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.SAVE_AGNP_ENQUIRY_SUBMIT],
    data,
    headers: tenantHeader(),
    progressKey: ACTION_TYPES.SAVE_AGNP_ENQUIRY_SUBMIT
  },
  guestAccess: true
});

export const lnpEnquiryApi = (data = {}) => ({
  url: API_URL.ENQUIRY.SUBMIT_LNP_ENQUIRY,
  method: REQUEST_METHOD.POST,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.SAVE_LNP_ENQUIRY_SUBMIT],
    data,
    headers: { ...MULTI_PART_FORM_HEADER, ...tenantHeader() },
    progressKey: ACTION_TYPES.SAVE_LNP_ENQUIRY_SUBMIT
  },
  guestAccess: true
});

export const fetchLnpCreatedByApi = () => ({
  url: API_URL.ENQUIRY.FETCH_LNP_CREATED_BY,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_LNP_CREATED_BY],
    progressKey: ACTION_TYPES.FETCH_LNP_CREATED_BY
  },
  guestAccess: true
});

export const fetchHomeEnquiryByMobileApi = (data = {}) => ({
  url: API_URL.ENQUIRY.FETCH_HOME_ENQUIRY_BY_MOBILE.replace(':mobile', data?.mobileNumber),
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_HOME_ENQUIRY_BY_MOBILE],
    progressKey: ACTION_TYPES.FETCH_HOME_ENQUIRY_BY_MOBILE,
    isErrorToast: false
  },
  guestAccess: true
});

export const fetchEnquiryTrackingApi = (data = {}) => ({
  url: `${API_URL.ENQUIRY.FETCH_ENQUIRY_TRACKING}?trackingId=${data?.trackingId}`,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_ENQUIRY_TRACKING],
    progressKey: ACTION_TYPES.FETCH_ENQUIRY_TRACKING,
    isErrorToast: false
  },
  guestAccess: true
});

export const fetchLnpEnquiryByMobileApi = (data = {}) => {
  const { mobileNumber, email } = data;
  let url = API_URL.ENQUIRY.FETCH_LNP_ENQUIRY_BY_MOBILE;
  const params = [];
  if (mobileNumber) params.push(`mobile=${mobileNumber}`);
  if (email) params.push(`email=${encodeURIComponent(email)}`);
  if (params.length > 0) {
    url = `${url}?${params.join('&')}`;
  }
  return {
    url,
    method: REQUEST_METHOD.GET,
    payload: {
      types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_LNP_ENQUIRY_BY_MOBILE],
      progressKey: ACTION_TYPES.FETCH_LNP_ENQUIRY_BY_MOBILE,
      isErrorToast: false
    },
    guestAccess: true
  };
};

export const fetchAgnpEnquiryByMobileApi = (data = {}) => {
  const { mobileNumber, email } = data;
  let url = API_URL.ENQUIRY.FETCH_AGNP_ENQUIRY_BY_MOBILE;
  const params = [];
  if (mobileNumber) params.push(`mobile=${mobileNumber}`);
  if (email) params.push(`email=${encodeURIComponent(email)}`);
  if (params.length > 0) {
    url = `${url}?${params.join('&')}`;
  }
  return {
    url,
    method: REQUEST_METHOD.GET,
    payload: {
      types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_AGNP_ENQUIRY_BY_MOBILE],
      progressKey: ACTION_TYPES.FETCH_AGNP_ENQUIRY_BY_MOBILE,
      isErrorToast: false
    },
    guestAccess: true
  };
};

export const darkFibreEnquiryApi = (data = {}) => ({
  url: API_URL.ENQUIRY.SUBMIT_DARK_FIBRE_ENQUIRY,
  method: REQUEST_METHOD.POST,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.SAVE_DARK_FIBRE_ENQUIRY],
    progressKey: ACTION_TYPES.SAVE_DARK_FIBRE_ENQUIRY,
    headers: tenantHeader(),
    data
  },
  guestAccess: true
});

export const fetchIndustryApi = () => ({
  url: API_URL.ENQUIRY.FETCH_INDUSTRY,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_INDUSTRY],
    progressKey: ACTION_TYPES.FETCH_INDUSTRY
  },
  guestAccess: true
});

export const fetchServiceApi = () => ({
  url: API_URL.ENQUIRY.FETCH_SERVICE,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_SERVICE],
    progressKey: ACTION_TYPES.FETCH_SERVICE
  },
  guestAccess: true
});

export const fetchBplApplicationStatusApi = ({ year } = {}) => ({
  url: `${API_URL.ENQUIRY.BPL_APPLICATION_STATUS}?year=${year}`,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_BPL_APPLICATION_STATUS],
    progressKey: ACTION_TYPES.FETCH_BPL_APPLICATION_STATUS
  },
  guestAccess: true
});

export const fetchDepartmentApi = () => ({
  url: API_URL.ENQUIRY.FETCH_DEPARTMENT,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_DEPARTMENT],
    progressKey: ACTION_TYPES.FETCH_DEPARTMENT
  },
  guestAccess: true
});

export const fetchSubDepartmentApi = (id) => ({
  url: API_URL.ENQUIRY.FETCH_SUB_DEPARTMENT.replace(':mainDepartmentId', id),
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_SUB_DEPARTMENT],
    progressKey: ACTION_TYPES.FETCH_SUB_DEPARTMENT
  },
  guestAccess: true
});

export const fetchTicketCategoryApi = () => ({
  url: API_URL.ENQUIRY.FETCH_TICKET_CATEGORY,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_TICKET_CATEGORY],
    progressKey: ACTION_TYPES.FETCH_TICKET_CATEGORY
  },
  guestAccess: true
});

export const ticketCreationNotificationApi = (data = {}) => ({
  url: API_URL.ENQUIRY.TICKET_CREATION_NOTIFICATION.replace(':ticketId', data?.ticketId),
  method: REQUEST_METHOD.POST,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.TICKET_CREATION_NOTIFICATION],
    progressKey: ACTION_TYPES.TICKET_CREATION_NOTIFICATION
  },
  guestAccess: true
});

export const trackComplaintApi = (data = {}) => ({
  url: API_URL.ENQUIRY.TRACK_COMPLAINT.replace(':ticketId', data?.ticketId),
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.TRACK_COMPLAINT],
    progressKey: ACTION_TYPES.TRACK_COMPLAINT
  },
  guestAccess: true
})

export const fetchDistrictByPincodeApi = (data = {}) => ({
  url: API_URL.ENQUIRY.FETCH_DISTRICT_BY_PINCODE.replace(':pincode', data),
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_DISTRICT_BY_PINCODE],
    progressKey: ACTION_TYPES.FETCH_DISTRICT_BY_PINCODE
  },
  guestAccess: true
})
