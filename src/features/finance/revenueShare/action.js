import { createAction } from '@reduxjs/toolkit';

import { generateActionTypeVariants } from '@/utils/actionUtils';

import { STATE_REDUCER_KEY } from './constants';

const API_ACTION_TYPES = {
  FETCH_REVENUE_SHARE_LIST: `${STATE_REDUCER_KEY}/FETCH_REVENUE_SHARE_LIST`,
  FETCH_PARTNER_LIST: `${STATE_REDUCER_KEY}/FETCH_PARTNER_LIST`,
  SUBMIT_NEW_GROUP_ASSOCIATION: `${STATE_REDUCER_KEY}/SUBMIT_NEW_GROUP_ASSOCIATION`,
  DOWNLOAD_REVENUE_SHARE_CSV: `${STATE_REDUCER_KEY}/DOWNLOAD_REVENUE_SHARE_CSV`
};

export const ACTION_TYPES = {
  ...API_ACTION_TYPES
};

export const API_ACTION_TYPE_VARIANTS = generateActionTypeVariants(API_ACTION_TYPES);

export const fetchRevenueShareList = createAction(ACTION_TYPES.FETCH_REVENUE_SHARE_LIST);
export const fetchPartnerList = createAction(ACTION_TYPES.FETCH_PARTNER_LIST);
export const submitNewGroupAssociation = createAction(ACTION_TYPES.SUBMIT_NEW_GROUP_ASSOCIATION);
export const downloadRevenueShareCsv = createAction(ACTION_TYPES.DOWNLOAD_REVENUE_SHARE_CSV);
