import { REQUEST_METHOD } from '@/constants/api';
import { API_URL } from '@/constants/urls';

import { ACTION_TYPES, API_ACTION_TYPE_VARIANTS } from './action';

export const fetchAGNPCorporateInvoiceApi = (data = {}) => ({
  url: API_URL.FINANCE.INVOICE_DETAILS.FETCH_AGNP_CORPORATE_INVOICE,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_AGNP_CORPORATE_INVOICE],
    progressKey: ACTION_TYPES.FETCH_AGNP_CORPORATE_INVOICE,
    data
  }
});

export const fetchAGNPRetailInvoiceApi = (data = {}) => ({
  url: API_URL.FINANCE.INVOICE_DETAILS.FETCH_AGNP_RETAIL_INVOICE,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_AGNP_RETAIL_INVOICE],
    progressKey: ACTION_TYPES.FETCH_AGNP_RETAIL_INVOICE,
    data
  }
});

export const fetchEOSubscriberInvoiceApi = (data = {}) => ({
  url: API_URL.FINANCE.INVOICE_DETAILS.FETCH_EO_SUBSCRIBER_INVOICE,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_EO_SUBSCRIBER_INVOICE],
    progressKey: ACTION_TYPES.FETCH_EO_SUBSCRIBER_INVOICE,
    data
  }
});

export const fetchLNPRetailInvoiceApi = (data = {}) => ({
  url: API_URL.FINANCE.INVOICE_DETAILS.FETCH_LNP_RETAIL_INVOICE,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_LNP_RETAIL_INVOICE],
    progressKey: ACTION_TYPES.FETCH_LNP_RETAIL_INVOICE,
    data
  }
});

export const fetchLNPCorporateInvoiceApi = (data = {}) => ({
  url: API_URL.FINANCE.INVOICE_DETAILS.FETCH_LNP_CORPORATE_INVOICE,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_LNP_CORPORATE_INVOICE],
    progressKey: ACTION_TYPES.FETCH_LNP_CORPORATE_INVOICE,
    data
  }
});

export const fetchLNPCorporateOTCInvoiceApi = (data = {}) => ({
  url: API_URL.FINANCE.INVOICE_DETAILS.FETCH_LNP_CORPORATE_OTC_INVOICE,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_LNP_CORPORATE_OTC_INVOICE],
    progressKey: ACTION_TYPES.FETCH_LNP_CORPORATE_OTC_INVOICE,
    data
  }
});

export const fetchMSPBuOeInvoiceApi = (data = {}) => ({
  url: API_URL.FINANCE.INVOICE_DETAILS.FETCH_MSP_BU_OE_INVOICE,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_MSP_BU_OE_INVOICE],
    progressKey: ACTION_TYPES.FETCH_MSP_BU_OE_INVOICE,
    data
  }
});

export const fetchMSPCorporateInvoiceApi = (data = {}) => ({
  url: API_URL.FINANCE.INVOICE_DETAILS.FETCH_MSP_CORPORATE_INVOICE,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_MSP_CORPORATE_INVOICE],
    progressKey: ACTION_TYPES.FETCH_MSP_CORPORATE_INVOICE,
    data
  }
});

export const fetchONTPurchaseInvoiceApi = (data = {}) => ({
  url: API_URL.FINANCE.INVOICE_DETAILS.FETCH_ONT_PURCHASE_INVOICE,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_ONT_PURCHASE_INVOICE],
    progressKey: ACTION_TYPES.FETCH_ONT_PURCHASE_INVOICE,
    data
  }
});

export const fetchOTTProviderInvoiceApi = (data = {}) => ({
  url: API_URL.FINANCE.INVOICE_DETAILS.FETCH_OTT_PROVIDER_INVOICE,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_OTT_PROVIDER_INVOICE],
    progressKey: ACTION_TYPES.FETCH_OTT_PROVIDER_INVOICE,
    data
  }
});

export const fetchSubscriberBPLInvoiceApi = (data = {}) => ({
  url: API_URL.FINANCE.INVOICE_DETAILS.FETCH_SUBSCRIBER_BPL_INVOICE,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_SUBSCRIBER_BPL_INVOICE],
    progressKey: ACTION_TYPES.FETCH_SUBSCRIBER_BPL_INVOICE,
    data
  }
});

export const fetchSubscriberInvoiceReportsApi = (data = {}) => ({
  url: API_URL.FINANCE.INVOICE_DETAILS.FETCH_SUBSCRIBER_INVOICE_REPORTS,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_SUBSCRIBER_INVOICE_REPORTS],
    progressKey: ACTION_TYPES.FETCH_SUBSCRIBER_INVOICE_REPORTS,
    data
  }
});


