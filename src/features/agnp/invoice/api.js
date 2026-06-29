import { REQUEST_METHOD } from "@/constants/api";
import { API_URL } from "@/constants/urls";

import { ACTION_TYPES, API_ACTION_TYPE_VARIANTS } from './action'

export const approvalTableDataApi = () => ({
  url: API_URL.AGNP.AGNP.FETCH_APPROVAL_TABLE_DATA,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_APPROVAL_TABLE_DATA],
    progressKey: ACTION_TYPES.FETCH_APPROVAL_TABLE_DATA
  },
  guestAccess: true
});

export const summaryTableDataApi = () => ({
  url: API_URL.AGNP.FETCH_SUMMARY_TABLE_DATA,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_SUMMARY_TABLE_DATA],
    progressKey: ACTION_TYPES.FETCH_SUMMARY_TABLE_DATA
  },
  guestAccess: true
});

export const partnerFinanceTableDataApi = () => ({
  url: API_URL.AGNP.FETCH_PARTNER_FINANCE_TABLE_DATA,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_PARTNER_FINANCE_TABLE_DATA],
    progressKey: ACTION_TYPES.FETCH_PARTNER_FINANCE_TABLE_DATA
  },
  guestAccess: true
});

export const invoiceTableDataApi = () => ({
  url: API_URL.AGNP.FETCH_INVOICE_TABLE_DATA,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_INVOICE_TABLE_DATA],
    progressKey: ACTION_TYPES.FETCH_INVOICE_TABLE_DATA
  },
  guestAccess: true
});

export const financeTransactionTableDataApi = () => ({
  url: API_URL.AGNP.FETCH_FINANCE_TRANSACTION_TABLE_DATA,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_FINANCE_TRANSACTION_TABLE_DATA],
    progressKey: ACTION_TYPES.FETCH_FINANCE_TRANSACTION_TABLE_DATA
  },
  guestAccess: true
});

export const gstWalletTableDataApi = () => ({
  url: API_URL.AGNP.FETCH_GST_WALLET_TABLE_DATA,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_GST_WALLET_TABLE_DATA],
    progressKey: ACTION_TYPES.FETCH_GST_WALLET_TABLE_DATA
  },
  guestAccess: true
});

export const lnpRevenueTableDataApi = () => ({
  url: API_URL.AGNP.FETCH_LNP_REVENUE_TABLE_DATA,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_LNP_REVENUE_TABLE_DATA],
    progressKey: ACTION_TYPES.FETCH_LNP_REVENUE_TABLE_DATA
  },
  guestAccess: true
});

export const gstDetailsDataApi = () => ({
  url: API_URL.AGNP.FETCH_GST_DETAILS_DATA,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_GST_DETAILS_DATA],
    progressKey: ACTION_TYPES.FETCH_GST_DETAILS_DATA
  },
  guestAccess: true
});