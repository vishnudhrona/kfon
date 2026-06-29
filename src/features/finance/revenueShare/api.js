import { REQUEST_METHOD } from '@/constants/api';
import { FILE_RESPONSE_TYPE } from '@/constants/file';
import { API_URL } from '@/constants/urls';
import { getFileNameWithTimestamp } from '@/utils/dateUtils';

import { ACTION_TYPES, API_ACTION_TYPE_VARIANTS } from './action';

export const fetchRevenueShareListApi = (data = {}) => ({
  url: API_URL.REVENUE_SHARE.FETCH_REVENUE_SHARE_LIST,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_REVENUE_SHARE_LIST],
    params: data,
    progressKey: ACTION_TYPES.FETCH_REVENUE_SHARE_LIST
  }
});

export const partnerListApi = (data = {}) => {
  return {
    url: API_URL.REVENUE_SHARE.FETCH_PARTNER_LIST,
    method: REQUEST_METHOD.GET,
    payload: {
      types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_PARTNER_LIST],
      params: data,
      progressKey: ACTION_TYPES.FETCH_PARTNER_LIST
    }
  };
};

export const submitNewGroupAssociationApi = (data = {}) => {
  return {
    url: API_URL.REVENUE_SHARE.SUBMIT_NEW_GROUP_ASSOCIATION,
    method: REQUEST_METHOD.POST,
    payload: {
      types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.SUBMIT_NEW_GROUP_ASSOCIATION],
      data,
      progressKey: ACTION_TYPES.SUBMIT_NEW_GROUP_ASSOCIATION
    }
  };
};

// Maps server-side list filters onto the download-csv query params
export const downloadRevenueShareCsvApi = (filters = {}) => ({
  url: API_URL.REVENUE_SHARE.DOWNLOAD_CSV,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.DOWNLOAD_REVENUE_SHARE_CSV],
    data: {
      district: filters.district,
      revenueShareUuid: filters.revenueShareUuid,
      search: filters.search
    },
    progressKey: ACTION_TYPES.DOWNLOAD_REVENUE_SHARE_CSV,
    isDocument: true,
    documentType: FILE_RESPONSE_TYPE.BLOB,
    fileName: getFileNameWithTimestamp('partner-groups')
  }
});

export const fetchVlanTypeListApi = () => ({
  url: API_URL.REVENUE_SHARE.FETCH_VLAN_TYPE_LIST,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_VLAN_TYPE_LIST],
    progressKey: ACTION_TYPES.FETCH_VLAN_TYPE_LIST
  }
});
