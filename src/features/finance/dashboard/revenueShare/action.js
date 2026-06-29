import { createAction } from '@reduxjs/toolkit';

import { generateActionTypeVariants } from '@/utils/actionUtils';

import { STATE_REDUCER_KEY } from './constants';

const API_ACTION_TYPES = {
  FETCH_REVENUE_SOURCES: `${STATE_REDUCER_KEY}/FETCH_REVENUE_SOURCES`,
  FETCH_PAYABLE_SUMMARY: `${STATE_REDUCER_KEY}/FETCH_PAYABLE_SUMMARY`,
  FETCH_PARTNER_SHARE: `${STATE_REDUCER_KEY}/FETCH_PARTNER_SHARE`
};

export const ACTION_TYPES = { ...API_ACTION_TYPES };

export const API_ACTION_TYPE_VARIANTS = generateActionTypeVariants(API_ACTION_TYPES);

export const fetchRevenueSources = createAction(ACTION_TYPES.FETCH_REVENUE_SOURCES);
export const fetchPayableSummary = createAction(ACTION_TYPES.FETCH_PAYABLE_SUMMARY);
export const fetchPartnerShare = createAction(ACTION_TYPES.FETCH_PARTNER_SHARE);
