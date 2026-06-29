import { createAction } from '@reduxjs/toolkit';

import { generateActionTypeVariants } from '@/utils/actionUtils';

import { STATE_REDUCER_KEY } from './constants';

const API_ACTION_TYPES = {
  FETCH_REVENUE_DASHBOARD: `${STATE_REDUCER_KEY}/FETCH_REVENUE_DASHBOARD`,
  FETCH_REVENUE_REPORTS_LIST: `${STATE_REDUCER_KEY}/FETCH_REVENUE_REPORTS_LIST`,
  FETCH_BR11_DATA: `${STATE_REDUCER_KEY}/FETCH_BR11_DATA`,
  FETCH_BR27_DATA: `${STATE_REDUCER_KEY}/FETCH_BR27_DATA`,
  FETCH_REVENUE_BY_SEGMENT: `${STATE_REDUCER_KEY}/FETCH_REVENUE_BY_SEGMENT`,
  FETCH_REVENUE_TOP_CUSTOMERS: `${STATE_REDUCER_KEY}/FETCH_REVENUE_TOP_CUSTOMERS`
};

export const ACTION_TYPES = { ...API_ACTION_TYPES };

export const API_ACTION_TYPE_VARIANTS = generateActionTypeVariants(API_ACTION_TYPES);

export const fetchRevenueDashboard = createAction(ACTION_TYPES.FETCH_REVENUE_DASHBOARD);
export const fetchRevenueReportsList = createAction(ACTION_TYPES.FETCH_REVENUE_REPORTS_LIST);
export const fetchBr11Data = createAction(ACTION_TYPES.FETCH_BR11_DATA);
export const fetchBr27Data = createAction(ACTION_TYPES.FETCH_BR27_DATA);
export const fetchRevenueBySegment = createAction(ACTION_TYPES.FETCH_REVENUE_BY_SEGMENT);
export const fetchRevenueTopCustomers = createAction(ACTION_TYPES.FETCH_REVENUE_TOP_CUSTOMERS);
