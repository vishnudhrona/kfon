import { createAction } from '@reduxjs/toolkit';

import { generateActionTypeVariants } from '@/utils/actionUtils';

import { STATE_REDUCER_KEY } from './constants';

const API_ACTION_TYPES = {
  FETCH_LNP_RETAIL_SUBC_LIST: `${STATE_REDUCER_KEY}/FETCH_LNP_RETAIL_SUBC_LIST`,
  FETCH_LNP_RETAIL_SUBC_DETAILS: `${STATE_REDUCER_KEY}/FETCH_LNP_RETAIL_SUBC_DETAILS`
};

export const ACTION_TYPES = {
  ...API_ACTION_TYPES
};

export const API_ACTION_TYPE_VARIANTS = generateActionTypeVariants(API_ACTION_TYPES);

export const fetchLNPRetailSubcriberList = createAction(ACTION_TYPES.FETCH_LNP_RETAIL_SUBC_LIST);
export const fetchLNPRetailSubcriberDetails = createAction(ACTION_TYPES.FETCH_LNP_RETAIL_SUBC_DETAILS);
