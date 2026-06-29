import { createAction } from "@reduxjs/toolkit";

import { generateActionTypeVariants } from '@/utils/actionUtils'

import { STATE_REDUCER_KEY } from './constants'

const API_ACTION_TYPES = {
    FETCH_DASHBOARD_TABLE_DATA: `${STATE_REDUCER_KEY}/FETCH_DASHBOARD_TABLE_DATA`,
    FETCH_DASHBOARD_CARD_DATA: `${STATE_REDUCER_KEY}/FETCH_DASHBOARD_CARD_DATA`
}

export const ACTION_TYPES = {
  ...API_ACTION_TYPES
};

export const API_ACTION_TYPE_VARIANTS = generateActionTypeVariants(API_ACTION_TYPES);

export const fetchDashboardTableData = createAction(ACTION_TYPES.FETCH_DASHBOARD_TABLE_DATA)
export const fetchDashboardCardData = createAction(ACTION_TYPES.FETCH_DASHBOARD_CARD_DATA)