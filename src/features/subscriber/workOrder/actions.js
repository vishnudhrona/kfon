import { createAction } from '@reduxjs/toolkit';

import { generateActionTypeVariants } from '@/utils/actionUtils';

import { STATE_REDUCER_KEY } from './constants';

export const API_ACTION_TYPES = {
  CREATE_WORK_ORDER: `${STATE_REDUCER_KEY}/CREATE_WORK_ORDER`,
  FETCH_WORK_ORDER_LIST: `${STATE_REDUCER_KEY}/FETCH_WORK_ORDER_LIST`,
  FETCH_EWS_PACKAGES: `${STATE_REDUCER_KEY}/FETCH_EWS_PACKAGES`,
  APPROVE_WORK_ORDER: `${STATE_REDUCER_KEY}/APPROVE_WORK_ORDER`,
  FETCH_EWS_WORK_ORDER_DROPDOWN: `${STATE_REDUCER_KEY}/FETCH_EWS_WORK_ORDER_DROPDOWN`,
  ASSIGN_WORK_ORDER: `${STATE_REDUCER_KEY}/ASSIGN_WORK_ORDER`
};

export const API_ACTION_TYPE_VARIANTS = generateActionTypeVariants(API_ACTION_TYPES);

export const createWorkOrder = createAction(API_ACTION_TYPES.CREATE_WORK_ORDER);
export const fetchWorkOrderList = createAction(API_ACTION_TYPES.FETCH_WORK_ORDER_LIST);
export const fetchEwsPackages = createAction(API_ACTION_TYPES.FETCH_EWS_PACKAGES);
export const approveWorkOrder = createAction(API_ACTION_TYPES.APPROVE_WORK_ORDER);
export const fetchEwsWorkOrderDropdown = createAction(API_ACTION_TYPES.FETCH_EWS_WORK_ORDER_DROPDOWN);
export const assignWorkOrder = createAction(API_ACTION_TYPES.ASSIGN_WORK_ORDER);
