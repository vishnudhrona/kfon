import { REQUEST_METHOD } from '@/constants/api';
import { FILE_RESPONSE_TYPE } from '@/constants/file';
import { API_URL } from '@/constants/urls';

import { ACTION_TYPES, API_ACTION_TYPE_VARIANTS } from './action';

export const fetchPartnerStatCardsApi = (params = {}) => ({
  url: API_URL.DASHBOARD.PARTNER.SUMMARY_STAT_CARDS,
  method: REQUEST_METHOD.GET,
  payload: {
    params,
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_PARTNER_STAT_CARDS],
    progressKey: ACTION_TYPES.FETCH_PARTNER_STAT_CARDS,
    isErrorToast: false
  }
});

export const fetchPartnerSummaryCardsApi = (params = {}) => ({
  url: API_URL.DASHBOARD.PARTNER.SUMMARY_CARDS,
  method: REQUEST_METHOD.GET,
  payload: {
    params,
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_PARTNER_SUMMARY_CARDS],
    progressKey: ACTION_TYPES.FETCH_PARTNER_SUMMARY_CARDS,
    isErrorToast: false
  }
});

export const fetchPartnerOnboardingEfficiencyApi = (params = {}) => ({
  url: API_URL.DASHBOARD.PARTNER.ONBOARDING_EFFICIENCY,
  method: REQUEST_METHOD.GET,
  payload: {
    params,
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_PARTNER_ONBOARDING_EFFICIENCY],
    progressKey: ACTION_TYPES.FETCH_PARTNER_ONBOARDING_EFFICIENCY,
    isErrorToast: false
  }
});

export const fetchPartnerLongPendingNotOnboardedApi = (params = {}) => ({
  url: API_URL.DASHBOARD.PARTNER.LONG_PENDING_NOT_ONBOARDED,
  method: REQUEST_METHOD.GET,
  payload: {
    params,
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_PARTNER_LONG_PENDING_NOT_ONBOARDED],
    progressKey: ACTION_TYPES.FETCH_PARTNER_LONG_PENDING_NOT_ONBOARDED,
    isErrorToast: false
  }
});

export const fetchPartnerLongPendingLinkNotEstablishedApi = (params = {}) => ({
  url: API_URL.DASHBOARD.PARTNER.LONG_PENDING_LINK_NOT_ESTABLISHED,
  method: REQUEST_METHOD.GET,
  payload: {
    params,
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_PARTNER_LONG_PENDING_LINK_NOT_ESTABLISHED],
    progressKey: ACTION_TYPES.FETCH_PARTNER_LONG_PENDING_LINK_NOT_ESTABLISHED,
    isErrorToast: false
  }
});

export const fetchPartnerEnquiryPositionApi = (params = {}) => ({
  url: API_URL.DASHBOARD.PARTNER.ENQUIRY_POSITION,
  method: REQUEST_METHOD.GET,
  payload: {
    params,
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_PARTNER_ENQUIRY_POSITION],
    progressKey: ACTION_TYPES.FETCH_PARTNER_ENQUIRY_POSITION,
    isErrorToast: false
  }
});

export const fetchPartnerDistrictSummaryApi = (params = {}) => ({
  url: API_URL.DASHBOARD.PARTNER.DISTRICT_SUMMARY,
  method: REQUEST_METHOD.GET,
  payload: {
    params,
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_PARTNER_DISTRICT_SUMMARY],
    progressKey: ACTION_TYPES.FETCH_PARTNER_DISTRICT_SUMMARY,
    isErrorToast: false
  }
});

export const fetchPartnerActiveListApi = (params = {}) => ({
  url: API_URL.DASHBOARD.PARTNER.ACTIVE,
  method: REQUEST_METHOD.GET,
  payload: {
    params,
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_PARTNER_ACTIVE_LIST],
    progressKey: ACTION_TYPES.FETCH_PARTNER_ACTIVE_LIST,
    isErrorToast: false
  }
});

export const downloadPartnerActiveCsvApi = (params = {}) => ({
  url: API_URL.DASHBOARD.PARTNER.ACTIVE_DOWNLOAD_CSV,
  method: REQUEST_METHOD.GET,
  payload: {
    params,
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.DOWNLOAD_PARTNER_ACTIVE_CSV],
    progressKey: ACTION_TYPES.DOWNLOAD_PARTNER_ACTIVE_CSV,
    isDocument: true,
    documentType: FILE_RESPONSE_TYPE.BLOB,
    fileName: 'active_partners.csv'
  }
});
