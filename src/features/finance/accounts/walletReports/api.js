import { REQUEST_METHOD } from '@/constants/api';
import { FILE_RESPONSE_TYPE } from '@/constants/file';
import { API_URL } from '@/constants/urls';
import { getFileNameWithTimestamp } from '@/utils/dateUtils';

import { ACTION_TYPES, API_ACTION_TYPE_VARIANTS } from './action';

export const fetchLNPWalletApi = (data = {}) => ({
  url: API_URL.FINANCE.WALLET_REPORTS.FETCH_LNP_WALLET,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_LNP_WALLET],
    progressKey: ACTION_TYPES.FETCH_LNP_WALLET,
    data
  }
});

export const exportLNPWalletCsvApi = (data = {}) => ({
  url: API_URL.FINANCE.WALLET_REPORTS.EXPORT_LNP_WALLET_CSV,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.EXPORT_LNP_WALLET_CSV],
    progressKey: ACTION_TYPES.EXPORT_LNP_WALLET_CSV,
    data,
    isDocument: true,
    documentType: FILE_RESPONSE_TYPE.BLOB,
    fileName: getFileNameWithTimestamp('lnp_wallet_balance')
  }
});

export const fetchSubscriberWalletApi = (data = {}) => ({
  url: API_URL.FINANCE.WALLET_REPORTS.FETCH_SUBSCRIBER_WALLET,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_SUBSCRIBER_WALLET],
    progressKey: ACTION_TYPES.FETCH_SUBSCRIBER_WALLET,
    data
  }
});

export const fetchAGNPWalletApi = (data = {}) => ({
  url: API_URL.FINANCE.WALLET_REPORTS.FETCH_AGNP_WALLET,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_AGNP_WALLET],
    progressKey: ACTION_TYPES.FETCH_AGNP_WALLET,
    data
  }
});
