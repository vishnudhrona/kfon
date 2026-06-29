import { REQUEST_METHOD } from '@/constants/api';
import { FILE_RESPONSE_TYPE } from '@/constants/file';
import { API_URL } from '@/constants/urls';

import { ACTION_TYPES, API_ACTION_TYPE_VARIANTS } from './action';

export const lnpListTableDataApi = (data = {}) => ({
  url: API_URL.AGNP.FETCH_LNPLIST_TABLE_DATA,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_LNPLIST_TABLE_DATA],
    params: data,
    progressKey: ACTION_TYPES.FETCH_LNPLIST_TABLE_DATA
  }
});

export const mandateFormTableDataApi = () => ({
  url: API_URL.AGNP.FETCH_MANDATE_FROM_TABLE_DATA,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_MANDATE_FROM_TABLE_DATA],
    progressKey: ACTION_TYPES.FETCH_MANDATE_FROM_TABLE_DATA
  }
});

export const singleOnboardingDataApi = (data = {}) => {
  return {
    url: API_URL.ONBOARDING.FETCH_SINGLE_ONBOARDING_DATA.replace(':id', data),
    method: REQUEST_METHOD.GET,
    payload: {
      types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_SINGLE_ONBOARDING_DATA],
      params: {},
      progressKey: ACTION_TYPES.FETCH_SINGLE_ONBOARDING_DATA
    }
  };
};

export const resetPasswordApi = (data = {}) => {
  return {
    url: API_URL.ONBOARDING.RESET_PASSWORD.replace(':id', data),
    method: REQUEST_METHOD.PATCH,
    payload: {
      types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.RESET_PASSWORD],
      params: data,
      progressKey: ACTION_TYPES.RESET_PASSWORD
    }
  };
};

export const downloadAgnpListCsvApi = (data = {}) => ({
  url: API_URL.AGNP.DOWNLOAD_AGNP_LIST_CSV,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.DOWNLOAD_AGNP_LIST_CSV],
    params: data,
    progressKey: ACTION_TYPES.DOWNLOAD_AGNP_LIST_CSV,
    isDocument: true,
    documentType: FILE_RESPONSE_TYPE.BLOB,
    fileName: 'agnp_list.csv'
  }
});

export const addServiceAreaApi = (data = {}) => {
  const { id, ...payload } = data;
  return {
    url: API_URL.ONBOARDING.ADD_SERVICE_AREA.replace(':id', id),
    method: REQUEST_METHOD.PATCH,
    payload: {
      types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.ADD_SERVICE_AREA],
      data: payload,
      progressKey: ACTION_TYPES.ADD_SERVICE_AREA
    }
  };
};

export const fetchOltDeviceListApi = () => ({
  url: API_URL.INVENTORY.PON_PORT.FETCH_OLT_DEVICE_LIST,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_OLT_DEVICE_LIST],
    progressKey: ACTION_TYPES.FETCH_OLT_DEVICE_LIST
  }
});
