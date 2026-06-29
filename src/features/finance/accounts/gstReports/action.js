import { createAction } from '@reduxjs/toolkit';

import { generateActionTypeVariants } from '@/utils/actionUtils';

import { STATE_REDUCER_KEY } from './constants';

const API_ACTION_TYPES = {
  FETCH_GSTR2A_REFUND: `${STATE_REDUCER_KEY}/FETCH_GSTR2A_REFUND`,
  FETCH_GSTR1_REPORT: `${STATE_REDUCER_KEY}/FETCH_GSTR1_REPORT`,
  FETCH_B2B_INVOICES: `${STATE_REDUCER_KEY}/FETCH_B2B_INVOICES`
};

export const ACTION_TYPES = { ...API_ACTION_TYPES };

export const API_ACTION_TYPE_VARIANTS = generateActionTypeVariants(API_ACTION_TYPES);

export const fetchGSTR2ARefund = createAction(ACTION_TYPES.FETCH_GSTR2A_REFUND);
export const fetchGSTR1Report = createAction(ACTION_TYPES.FETCH_GSTR1_REPORT);
export const fetchB2BInvoices = createAction(ACTION_TYPES.FETCH_B2B_INVOICES);
