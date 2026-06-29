import { REQUEST_METHOD } from '@/constants/api';
import { API_URL } from '@/constants/urls';

import { ACTION_TYPES, API_ACTION_TYPE_VARIANTS } from './action';

export const fetchRechargeInsightsApi = (data = {}) => ({
  url: API_URL.FINANCE.RECHARGE_REPORTS.FETCH_RECHARGE_INSIGHTS,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_RECHARGE_INSIGHTS],
    progressKey: ACTION_TYPES.FETCH_RECHARGE_INSIGHTS,
    data
  }
});

export const fetchSubscriberRechargeApi = (data = {}) => ({
  url: API_URL.FINANCE.RECHARGE_REPORTS.FETCH_SUBSCRIBER_RECHARGE,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_SUBSCRIBER_RECHARGE],
    progressKey: ACTION_TYPES.FETCH_SUBSCRIBER_RECHARGE,
    data
  }
});

export const fetchPartnerRechargeApi = (data = {}) => ({
  url: API_URL.FINANCE.RECHARGE_REPORTS.FETCH_PARTNER_RECHARGE,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_PARTNER_RECHARGE],
    progressKey: ACTION_TYPES.FETCH_PARTNER_RECHARGE,
    data
  }
});
