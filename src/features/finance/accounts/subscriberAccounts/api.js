import { REQUEST_METHOD } from '@/constants/api';
import { API_URL } from '@/constants/urls';

import { ACTION_TYPES, API_ACTION_TYPE_VARIANTS } from './action';

export const fetchSubscriptionRenewalApi = (data = {}) => ({
  url: API_URL.FINANCE.SUBSCRIBER_ACCOUNTS.FETCH_SUBSCRIPTION_RENEWAL,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_SUBSCRIPTION_RENEWAL],
    progressKey: ACTION_TYPES.FETCH_SUBSCRIPTION_RENEWAL,
    data
  }
});

export const fetchSubscriberFinanceApi = (data = {}) => ({
  url: API_URL.FINANCE.SUBSCRIBER_ACCOUNTS.FETCH_SUBSCRIBER_FINANCE,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_SUBSCRIBER_FINANCE],
    progressKey: ACTION_TYPES.FETCH_SUBSCRIBER_FINANCE,
    data
  }
});

export const fetchSubscriberPartnerTransferApi = (data = {}) => ({
  url: API_URL.FINANCE.SUBSCRIBER_ACCOUNTS.FETCH_PARTNER_TRANSFER,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_SUBSCRIBER_PARTNER_TRANSFER],
    progressKey: ACTION_TYPES.FETCH_SUBSCRIBER_PARTNER_TRANSFER,
    data
  }
});

export const fetchSubscriberAccountApi = (data = {}) => ({
  url: API_URL.FINANCE.SUBSCRIBER_ACCOUNTS.FETCH_SUBSCRIBER_ACCOUNT,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_SUBSCRIBER_ACCOUNT],
    progressKey: ACTION_TYPES.FETCH_SUBSCRIBER_ACCOUNT,
    data
  }
});


