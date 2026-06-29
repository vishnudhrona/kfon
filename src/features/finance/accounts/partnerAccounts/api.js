import { REQUEST_METHOD } from '@/constants/api';
import { API_URL } from '@/constants/urls';

import { ACTION_TYPES, API_ACTION_TYPE_VARIANTS } from './action';

export const fetchAGNPPartnerFinanceCorporateApi = (data = {}) => ({
  url: API_URL.FINANCE.PARTNER_ACCOUNTS.FETCH_AGNP_PARTNER_FINANCE_CORPORATE,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_AGNP_PARTNER_FINANCE_CORPORATE],
    progressKey: ACTION_TYPES.FETCH_AGNP_PARTNER_FINANCE_CORPORATE,
    data
  }
});

export const fetchCorporateSubscriberOnlineRechargeApi = (data = {}) => ({
  url: API_URL.FINANCE.PARTNER_ACCOUNTS.FETCH_CORPORATE_SUBSCRIBER_ONLINE_RECHARGE,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_CORPORATE_SUBSCRIBER_ONLINE_RECHARGE],
    progressKey: ACTION_TYPES.FETCH_CORPORATE_SUBSCRIBER_ONLINE_RECHARGE,
    data
  }
});

export const fetchLNPOnlineRechargeApi = (data = {}) => ({
  url: API_URL.FINANCE.PARTNER_ACCOUNTS.FETCH_LNP_ONLINE_RECHARGE,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_LNP_ONLINE_RECHARGE],
    progressKey: ACTION_TYPES.FETCH_LNP_ONLINE_RECHARGE,
    data
  }
});

export const fetchOnePlusOneApi = (data = {}) => ({
  url: API_URL.FINANCE.PARTNER_ACCOUNTS.FETCH_ONE_PLUS_ONE,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_ONE_PLUS_ONE],
    progressKey: ACTION_TYPES.FETCH_ONE_PLUS_ONE,
    data
  }
});

export const fetchLNPPartnerFinanceCorporateApi = (data = {}) => ({
  url: API_URL.FINANCE.PARTNER_ACCOUNTS.FETCH_LNP_PARTNER_FINANCE_CORPORATE,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_LNP_PARTNER_FINANCE_CORPORATE],
    progressKey: ACTION_TYPES.FETCH_LNP_PARTNER_FINANCE_CORPORATE,
    data
  }
});

export const fetchPartnerAccountBalanceApi = (data = {}) => ({
  url: API_URL.FINANCE.PARTNER_ACCOUNTS.FETCH_ACCOUNT_BALANCE,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_PARTNER_ACCOUNT_BALANCE],
    progressKey: ACTION_TYPES.FETCH_PARTNER_ACCOUNT_BALANCE,
    data
  }
});

export const fetchPartnerAccountDisbursementApi = (data = {}) => ({
  url: API_URL.FINANCE.PARTNER_ACCOUNTS.FETCH_ACCOUNT_DISBURSEMENT,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_PARTNER_ACCOUNT_DISBURSEMENT],
    progressKey: ACTION_TYPES.FETCH_PARTNER_ACCOUNT_DISBURSEMENT,
    data
  }
});

export const fetchPartnerAccountTopupReceiptApi = (data = {}) => ({
  url: API_URL.FINANCE.PARTNER_ACCOUNTS.FETCH_TOPUP_RECEIPT,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_PARTNER_ACCOUNT_TOPUP_RECEIPT],
    progressKey: ACTION_TYPES.FETCH_PARTNER_ACCOUNT_TOPUP_RECEIPT,
    data
  }
});

export const fetchPartnerFinanceApi = (data = {}) => ({
  url: API_URL.FINANCE.PARTNER_ACCOUNTS.FETCH_FINANCE,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_PARTNER_FINANCE],
    progressKey: ACTION_TYPES.FETCH_PARTNER_FINANCE,
    data
  }
});

export const fetchSubscriberOnlineRechargeApi = (data = {}) => ({
  url: API_URL.FINANCE.PARTNER_ACCOUNTS.FETCH_ONLINE_RECHARGE,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_SUBSCRIBER_ONLINE_RECHARGE],
    progressKey: ACTION_TYPES.FETCH_SUBSCRIBER_ONLINE_RECHARGE,
    data
  }
});


