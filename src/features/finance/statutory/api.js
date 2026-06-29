import { REQUEST_METHOD } from '@/constants/api';
import { API_URL } from '@/constants/urls';

import { ACTION_TYPES, API_ACTION_TYPE_VARIANTS } from './action';

export const fetchRevenueControlApi = (data = {}) => ({
  url: API_URL.FINANCE.STATUTORY.REVENUE_CONTROL,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_REVENUE_CONTROL],
    data,
    progressKey: ACTION_TYPES.FETCH_REVENUE_CONTROL
  }
});

export const fetchGstr2aPartnersApi = (data = {}) => ({
  url: API_URL.FINANCE.STATUTORY.GSTR2A_PARTNERS,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_GSTR2A_PARTNERS],
    data,
    progressKey: ACTION_TYPES.FETCH_GSTR2A_PARTNERS
  }
});

export const fetchGstr1RetailCorporateApi = (data = {}) => ({
  url: API_URL.FINANCE.STATUTORY.GSTR1_RETAIL_CORPORATE,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_GSTR1_RETAIL_CORPORATE],
    data,
    progressKey: ACTION_TYPES.FETCH_GSTR1_RETAIL_CORPORATE
  }
});

export const fetchSubInvoiceB2BApi = (data = {}) => ({
  url: API_URL.FINANCE.STATUTORY.SUB_INVOICE_B2B,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_SUB_INVOICE_B2B],
    data,
    progressKey: ACTION_TYPES.FETCH_SUB_INVOICE_B2B
  }
});

export const fetchSubInvoiceB2CRetailsApi = (data = {}) => ({
  url: API_URL.FINANCE.STATUTORY.SUB_INVOICE_B2C_RETAILS,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_SUB_INVOICE_B2C_RETAILS],
    data,
    progressKey: ACTION_TYPES.FETCH_SUB_INVOICE_B2C_RETAILS
  }
});

export const fetchSubInvoiceB2BCorporateApi = (data = {}) => ({
  url: API_URL.FINANCE.STATUTORY.SUB_INVOICE_B2B_CORPORATE,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_SUB_INVOICE_B2B_CORPORATE],
    data,
    progressKey: ACTION_TYPES.FETCH_SUB_INVOICE_B2B_CORPORATE
  }
});

export const fetchSubInvoiceB2CCorporateApi = (data = {}) => ({
  url: API_URL.FINANCE.STATUTORY.SUB_INVOICE_B2C_CORPORATE,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_SUB_INVOICE_B2C_CORPORATE],
    data,
    progressKey: ACTION_TYPES.FETCH_SUB_INVOICE_B2C_CORPORATE
  }
});

export const fetchNldReportApi = (data = {}) => ({
  url: API_URL.FINANCE.STATUTORY.NLD_REPORT,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_NLD_REPORT],
    data,
    progressKey: ACTION_TYPES.FETCH_NLD_REPORT
  }
});

export const fetchAgrReportApi = (data = {}) => ({
  url: API_URL.FINANCE.STATUTORY.AGR_REPORT,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_AGR_REPORT],
    data,
    progressKey: ACTION_TYPES.FETCH_AGR_REPORT
  }
});
