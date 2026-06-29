import { REQUEST_METHOD } from '@/constants/api';
import { API_URL } from '@/constants/urls';

import { ACTION_TYPES, API_ACTION_TYPE_VARIANTS } from './action';

export const fetchLNPSummaryDetailsApi = (data = {}) => ({
  url: API_URL.FINANCE.INVOICE_REPORTS.FETCH_LNP_SUMMARY_DETAILS,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_LNP_SUMMARY_DETAILS],
    progressKey: ACTION_TYPES.FETCH_LNP_SUMMARY_DETAILS,
    data
  }
});

export const fetchLNPSummaryCorporateApi = (data = {}) => ({
  url: API_URL.FINANCE.INVOICE_REPORTS.FETCH_LNP_SUMMARY_CORPORATE,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_LNP_SUMMARY_CORPORATE],
    progressKey: ACTION_TYPES.FETCH_LNP_SUMMARY_CORPORATE,
    data
  }
});

export const fetchGSTINStatusLNPApi = (data = {}) => ({
  url: API_URL.FINANCE.INVOICE_REPORTS.FETCH_GSTIN_STATUS_LNP,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_GSTIN_STATUS_LNP],
    progressKey: ACTION_TYPES.FETCH_GSTIN_STATUS_LNP,
    data
  }
});

export const fetchSubscriberSummaryDetailsApi = (data = {}) => ({
  url: API_URL.FINANCE.INVOICE_REPORTS.FETCH_SUBSCRIBER_SUMMARY_DETAILS,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_SUBSCRIBER_SUMMARY_DETAILS],
    progressKey: ACTION_TYPES.FETCH_SUBSCRIBER_SUMMARY_DETAILS,
    data
  }
});

export const fetchLNPSpecialIncentiveApi = (data = {}) => ({
  url: API_URL.FINANCE.INVOICE_REPORTS.FETCH_LNP_SPECIAL_INCENTIVE,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_LNP_SPECIAL_INCENTIVE],
    progressKey: ACTION_TYPES.FETCH_LNP_SPECIAL_INCENTIVE,
    data
  }
});

export const fetchAGNPSummaryApi = (data = {}) => ({
  url: API_URL.FINANCE.INVOICE_REPORTS.FETCH_AGNP_SUMMARY,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_AGNP_SUMMARY],
    progressKey: ACTION_TYPES.FETCH_AGNP_SUMMARY,
    data
  }
});

export const fetchInvoiceWiseAgeingReportApi = (data = {}) => ({
  url: API_URL.FINANCE.INVOICE_REPORTS.FETCH_INVOICE_WISE_AGEING_REPORT,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_INVOICE_WISE_AGEING_REPORT],
    progressKey: ACTION_TYPES.FETCH_INVOICE_WISE_AGEING_REPORT,
    data
  }
});

export const fetchInvoicePaymentReportApi = (data = {}) => ({
  url: API_URL.FINANCE.INVOICE_REPORTS.FETCH_INVOICE_PAYMENT_REPORT,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_INVOICE_PAYMENT_REPORT],
    progressKey: ACTION_TYPES.FETCH_INVOICE_PAYMENT_REPORT,
    data
  }
});

export const fetchRetentionIncentiveReportApi = (data = {}) => ({
  url: API_URL.FINANCE.INVOICE_REPORTS.FETCH_RETENTION_INCENTIVE_REPORT,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_RETENTION_INCENTIVE_REPORT],
    progressKey: ACTION_TYPES.FETCH_RETENTION_INCENTIVE_REPORT,
    data
  }
});

export const fetchCorporateCustomerPaymentApi = (data = {}) => ({
  url: API_URL.FINANCE.INVOICE_REPORTS.FETCH_CORPORATE_CUSTOMER_PAYMENT,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_CORPORATE_CUSTOMER_PAYMENT],
    progressKey: ACTION_TYPES.FETCH_CORPORATE_CUSTOMER_PAYMENT,
    data
  }
});

export const fetchCorporateInvoicePaymentApi = (data = {}) => ({
  url: API_URL.FINANCE.INVOICE_REPORTS.FETCH_CORPORATE_INVOICE_PAYMENT,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_CORPORATE_INVOICE_PAYMENT],
    progressKey: ACTION_TYPES.FETCH_CORPORATE_INVOICE_PAYMENT,
    data
  }
});


