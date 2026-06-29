import { createAction } from '@reduxjs/toolkit';

import { generateActionTypeVariants } from '@/utils/actionUtils';

import { STATE_REDUCER_KEY } from './constants';

const API_ACTION_TYPES = {
  FETCH_DASHBOARD_DETAILS: `${STATE_REDUCER_KEY}/FETCH_DASHBOARD_DETAILS`,
  FETCH_LNP_DASHBOARD_DETAILS: `${STATE_REDUCER_KEY}/FETCH_LNP_DASHBOARD_DETAILS`,
  FETCH_INVENTORY_DASHBOARD: `${STATE_REDUCER_KEY}/FETCH_INVENTORY_DASHBOARD`
};

export const ACTION_TYPES = {
  ...API_ACTION_TYPES
};

export const API_ACTION_TYPE_VARIANTS = generateActionTypeVariants(API_ACTION_TYPES);

export const fetchDashboardDetails = createAction(ACTION_TYPES.FETCH_DASHBOARD_DETAILS);
export const fetchLnpDashboardDetails = createAction(ACTION_TYPES.FETCH_LNP_DASHBOARD_DETAILS);
export const fetchInventoryDashboard = createAction(ACTION_TYPES.FETCH_INVENTORY_DASHBOARD);
