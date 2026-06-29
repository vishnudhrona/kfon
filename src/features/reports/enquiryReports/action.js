import { createAction } from '@reduxjs/toolkit';

import { generateActionTypeVariants } from '@/utils/actionUtils';

import { STATE_REDUCER_KEY } from './constants';

const API_ACTION_TYPES = {
  FETCH_ENQUIRY_REPORT_LIST: `${STATE_REDUCER_KEY}/FETCH_ENQUIRY_REPORT_LIST`,
  ASSIGN_ENQUIRY: `${STATE_REDUCER_KEY}/ASSIGN_ENQUIRY`
};

export const ACTION_TYPES = {
  ...API_ACTION_TYPES
};

export const API_ACTION_TYPE_VARIANTS = generateActionTypeVariants(API_ACTION_TYPES);

export const fetchEnquiryReportList = createAction(ACTION_TYPES.FETCH_ENQUIRY_REPORT_LIST);
export const assignEnquiry = createAction(ACTION_TYPES.ASSIGN_ENQUIRY);
