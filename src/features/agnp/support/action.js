import { createAction } from '@reduxjs/toolkit';

import { generateActionTypeVariants } from '@/utils/actionUtils';

import { STATE_REDUCER_KEY } from './constants';

const API_ACTION_TYPES = {
  FETCH_TICKET_TABLE_DATA: `${STATE_REDUCER_KEY}/FETCH_TICKET_TABLE_DATA`,
  SUBMIT_TICKET_DATA: `${STATE_REDUCER_KEY}/SUBMIT_TICKET_DATA`
};

export const ACTION_TYPES = {
  ...API_ACTION_TYPES
};

export const API_ACTION_TYPE_VARIANTS = generateActionTypeVariants(API_ACTION_TYPES);

export const fetchTicketTableData = createAction(ACTION_TYPES.FETCH_TICKET_TABLE_DATA);
export const submitTicketData = createAction(ACTION_TYPES.SUBMIT_TICKET_DATA)
