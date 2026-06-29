import { createAction } from '@reduxjs/toolkit';

import { generateActionTypeVariants } from '@/utils/actionUtils';

import { STATE_REDUCER_KEY } from './constants';

const API_ACTION_TYPES = {
  FETCH_LNPLIST_TABLE_DATA: `${STATE_REDUCER_KEY}/FETCH_LNPLIST_TABLE_DATA`,
  FETCH_MANDATE_FROM_TABLE_DATA: `${STATE_REDUCER_KEY}/FETCH_MANDATE_FROM_TABLE_DATA`,
  FETCH_SINGLE_ONBOARDING_DATA: `${STATE_REDUCER_KEY}/FETCH_SINGLE_ONBOARDING_DATA`,
  RESET_PASSWORD: `${STATE_REDUCER_KEY}/RESET_PASSWORD`,
  DOWNLOAD_AGNP_LIST_CSV: `${STATE_REDUCER_KEY}/DOWNLOAD_AGNP_LIST_CSV`,
  ADD_SERVICE_AREA: `${STATE_REDUCER_KEY}/ADD_SERVICE_AREA`,
  FETCH_OLT_DEVICE_LIST: `${STATE_REDUCER_KEY}/FETCH_OLT_DEVICE_LIST`
};

export const ACTION_TYPES = {
  ...API_ACTION_TYPES
};

export const API_ACTION_TYPE_VARIANTS = generateActionTypeVariants(API_ACTION_TYPES);

export const fetchLnpListTableData = createAction(ACTION_TYPES.FETCH_LNPLIST_TABLE_DATA);
export const fetchMandateFormTableData = createAction(ACTION_TYPES.FETCH_MANDATE_FROM_TABLE_DATA);
export const fetchSingleOnboardingData = createAction(ACTION_TYPES.FETCH_SINGLE_ONBOARDING_DATA);
export const resetPassword = createAction(ACTION_TYPES.RESET_PASSWORD);
export const downloadAgnpListCsv = createAction(ACTION_TYPES.DOWNLOAD_AGNP_LIST_CSV);
export const addServiceArea = createAction(ACTION_TYPES.ADD_SERVICE_AREA);
export const fetchOltDeviceList = createAction(ACTION_TYPES.FETCH_OLT_DEVICE_LIST);