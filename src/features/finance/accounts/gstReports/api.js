import { REQUEST_METHOD } from '@/constants/api';
import { API_URL } from '@/constants/urls';

import { ACTION_TYPES, API_ACTION_TYPE_VARIANTS } from './action';

export const fetchGSTR2ARefundApi = (data = {}) => ({
  url: API_URL.FINANCE.GST_REPORTS.FETCH_GSTR2A_REFUND,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_GSTR2A_REFUND],
    progressKey: ACTION_TYPES.FETCH_GSTR2A_REFUND,
    data
  }
});

export const fetchGSTR1ReportApi = (data = {}) => ({
  url: API_URL.FINANCE.GST_REPORTS.FETCH_GSTR1_REPORT,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_GSTR1_REPORT],
    progressKey: ACTION_TYPES.FETCH_GSTR1_REPORT,
    data
  }
});

export const fetchB2BInvoicesApi = (data = {}) => ({
  url: API_URL.FINANCE.GST_REPORTS.FETCH_B2B_INVOICES,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_B2B_INVOICES],
    progressKey: ACTION_TYPES.FETCH_B2B_INVOICES,
    data
  }
});
