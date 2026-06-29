import { REQUEST_METHOD } from '@/constants/api';
import { API_URL } from '@/constants/urls';

import { ACTION_TYPES, API_ACTION_TYPE_VARIANTS } from './action';

export const fetchRevenueSourcesApi = (data = {}) => ({
  url: API_URL.FINANCE.DASHBOARD.REVENUE_SOURCES,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_REVENUE_SOURCES],
    data,
    progressKey: ACTION_TYPES.FETCH_REVENUE_SOURCES
  }
});

export const fetchPayableSummaryApi = (data = {}) => ({
  url: API_URL.FINANCE.DASHBOARD.PAYABLE_SUMMARY,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_PAYABLE_SUMMARY],
    data,
    progressKey: ACTION_TYPES.FETCH_PAYABLE_SUMMARY
  }
});

export const fetchPartnerShareApi = (data = {}) => ({
  url: API_URL.FINANCE.DASHBOARD.PARTNER_SHARE,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_PARTNER_SHARE],
    data,
    progressKey: ACTION_TYPES.FETCH_PARTNER_SHARE
  }
});
