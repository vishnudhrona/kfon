import { all, call, takeLatest } from 'redux-saga/effects';

import { handleAPIRequest } from '@/utils/httpUtils';

import { ACTION_TYPES } from './action';
import * as api from './api';

export function* fetchApprovalTableData() {
  yield call(handleAPIRequest, api.approvalTableDataApi);
}

export function* fetchSummaryTableData() {
  yield call(handleAPIRequest, api.summaryTableDataApi);
}

export function* fetchPartnerFinanceTableData() {
  yield call(handleAPIRequest, api.partnerFinanceTableDataApi);
}

export function* fetchInvoiceTableData() {
  yield call(handleAPIRequest, api.invoiceTableDataApi);
}

export function* fetchFinanceTransactionTableData() {
  yield call(handleAPIRequest, api.financeTransactionTableDataApi);
}

export function* fetchGstWalletTableData() {
  yield call(handleAPIRequest, api.gstWalletTableDataApi);
}

export function* fetchLnpRevenuTableData() {
  yield call(handleAPIRequest, api.lnpRevenueTableDataApi);
}

export function* fetchGstDetails() {
  yield call(handleAPIRequest, api.gstDetailsDataApi);
}

export default function* agnpFinanceSaga() {
  yield all([
    takeLatest(ACTION_TYPES.FETCH_APPROVAL_TABLE_DATA, fetchApprovalTableData),
    takeLatest(ACTION_TYPES.FETCH_SUMMARY_TABLE_DATA, fetchSummaryTableData),
    takeLatest(ACTION_TYPES.FETCH_PARTNER_FINANCE_TABLE_DATA, fetchPartnerFinanceTableData),
    takeLatest(ACTION_TYPES.FETCH_INVOICE_TABLE_DATA, fetchInvoiceTableData),
    takeLatest(ACTION_TYPES.FETCH_FINANCE_TRANSACTION_TABLE_DATA, fetchFinanceTransactionTableData),
    takeLatest(ACTION_TYPES.FETCH_GST_WALLET_TABLE_DATA, fetchGstWalletTableData),
    takeLatest(ACTION_TYPES.FETCH_LNP_REVENUE_TABLE_DATA, fetchLnpRevenuTableData),
    takeLatest(ACTION_TYPES.FETCH_GST_DETAILS_DATA, fetchGstDetails)
  ]);
}
