import { flow } from 'lodash-es';

import { SERVER_SIDE_TABLE_KEYS } from '@/constants/server_table';

import { STATE_REDUCER_KEY } from './constants';

const gstReportsKey = (state) => state[STATE_REDUCER_KEY];

const gstr2aRefund = (state) => {
  const data = state?.gstReports?.formData?.[SERVER_SIDE_TABLE_KEYS.GSTR2A_REFUND_TABLE] || [];
  return { data };
};
export const getGSTR2ARefund = flow(gstReportsKey, gstr2aRefund);

const gstr1Report = (state) => {
  const data = state?.gstReports?.formData?.[SERVER_SIDE_TABLE_KEYS.GSTR1_REPORT_TABLE] || [];
  return { data };
};
export const getGSTR1Report = flow(gstReportsKey, gstr1Report);

const b2bInvoices = (state) => {
  const data = state?.gstReports?.formData?.[SERVER_SIDE_TABLE_KEYS.B2B_INVOICES_TABLE] || [];
  return { data };
};
export const getB2BInvoices = flow(gstReportsKey, b2bInvoices);
