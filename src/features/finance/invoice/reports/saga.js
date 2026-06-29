import { all, call, put, select, takeLatest } from 'redux-saga/effects';

import { SERVER_SIDE_TABLE_KEYS } from '@/constants/server_table';
import { setCommonPaginationResponse } from '@/features/others/Pagination/saga';
import { getServerSidePaginationDetails } from '@/features/others/Pagination/selectors';
import { selectorWithKey } from '@/utils/commonUtils';
import { handleAPIRequest } from '@/utils/httpUtils';

import { ACTION_TYPES } from './action';
import * as api from './api';
import { actions as sliceActions } from './slice';

function* listSaga(action, apiFn) {
  const { payload: { key, isDropdown = false, ...data } = {} } = action;
  let payload = data;
  if (key && !isDropdown) {
    const paginationDetails = yield select(getServerSidePaginationDetails);
    const { page, size } = selectorWithKey(paginationDetails, key) || {};
    if (page !== undefined && size !== undefined) {
      payload = { page, size, ...payload };
    }
  }
  const { response } = yield call(handleAPIRequest, apiFn, payload);
  if (key && response) {
    if (!isDropdown) {
      yield call(setCommonPaginationResponse, key, response);
      yield put(sliceActions.updateFormData({ [key]: response?.data?.content || response?.data || response }));
    }
  }
  return response;
}

function* fetchLNPSummaryDetails(action) {
  yield* listSaga({ ...action, payload: { ...action.payload, key: SERVER_SIDE_TABLE_KEYS.LNP_SUMMARY_DETAILS_TABLE } }, api.fetchLNPSummaryDetailsApi);
}
function* fetchLNPSummaryCorporate(action) {
  yield* listSaga({ ...action, payload: { ...action.payload, key: SERVER_SIDE_TABLE_KEYS.LNP_SUMMARY_CORPORATE_TABLE } }, api.fetchLNPSummaryCorporateApi);
}
function* fetchGSTINStatusLNP(action) {
  yield* listSaga({ ...action, payload: { ...action.payload, key: SERVER_SIDE_TABLE_KEYS.GSTIN_STATUS_LNP_TABLE } }, api.fetchGSTINStatusLNPApi);
}
function* fetchSubscriberSummaryDetails(action) {
  yield* listSaga({ ...action, payload: { ...action.payload, key: SERVER_SIDE_TABLE_KEYS.SUBSCRIBER_SUMMARY_DETAILS_TABLE } }, api.fetchSubscriberSummaryDetailsApi);
}
function* fetchLNPSpecialIncentive(action) {
  yield* listSaga({ ...action, payload: { ...action.payload, key: SERVER_SIDE_TABLE_KEYS.LNP_SPECIAL_INCENTIVE_TABLE } }, api.fetchLNPSpecialIncentiveApi);
}
function* fetchAGNPSummary(action) {
  yield* listSaga({ ...action, payload: { ...action.payload, key: SERVER_SIDE_TABLE_KEYS.AGNP_SUMMARY_TABLE } }, api.fetchAGNPSummaryApi);
}
function* fetchInvoiceWiseAgeingReport(action) {
  yield* listSaga({ ...action, payload: { ...action.payload, key: SERVER_SIDE_TABLE_KEYS.INVOICE_WISE_AGEING_REPORT_TABLE } }, api.fetchInvoiceWiseAgeingReportApi);
}
function* fetchInvoicePaymentReport(action) {
  yield* listSaga({ ...action, payload: { ...action.payload, key: SERVER_SIDE_TABLE_KEYS.INVOICE_PAYMENT_REPORT_TABLE } }, api.fetchInvoicePaymentReportApi);
}
function* fetchRetentionIncentiveReport(action) {
  yield* listSaga({ ...action, payload: { ...action.payload, key: SERVER_SIDE_TABLE_KEYS.RETENTION_INCENTIVE_REPORT_TABLE } }, api.fetchRetentionIncentiveReportApi);
}
function* fetchCorporateCustomerPayment(action) {
  yield* listSaga({ ...action, payload: { ...action.payload, key: SERVER_SIDE_TABLE_KEYS.CORPORATE_CUSTOMER_PAYMENT_TABLE } }, api.fetchCorporateCustomerPaymentApi);
}
function* fetchCorporateInvoicePayment(action) {
  yield* listSaga({ ...action, payload: { ...action.payload, key: SERVER_SIDE_TABLE_KEYS.CORPORATE_INVOICE_PAYMENT_TABLE } }, api.fetchCorporateInvoicePaymentApi);
}

export default function* invoiceReportsSaga() {
  yield all([
    takeLatest(ACTION_TYPES.FETCH_LNP_SUMMARY_DETAILS, fetchLNPSummaryDetails),
    takeLatest(ACTION_TYPES.FETCH_LNP_SUMMARY_CORPORATE, fetchLNPSummaryCorporate),
    takeLatest(ACTION_TYPES.FETCH_GSTIN_STATUS_LNP, fetchGSTINStatusLNP),
    takeLatest(ACTION_TYPES.FETCH_SUBSCRIBER_SUMMARY_DETAILS, fetchSubscriberSummaryDetails),
    takeLatest(ACTION_TYPES.FETCH_LNP_SPECIAL_INCENTIVE, fetchLNPSpecialIncentive),
    takeLatest(ACTION_TYPES.FETCH_AGNP_SUMMARY, fetchAGNPSummary),
    takeLatest(ACTION_TYPES.FETCH_INVOICE_WISE_AGEING_REPORT, fetchInvoiceWiseAgeingReport),
    takeLatest(ACTION_TYPES.FETCH_INVOICE_PAYMENT_REPORT, fetchInvoicePaymentReport),
    takeLatest(ACTION_TYPES.FETCH_RETENTION_INCENTIVE_REPORT, fetchRetentionIncentiveReport),
    takeLatest(ACTION_TYPES.FETCH_CORPORATE_CUSTOMER_PAYMENT, fetchCorporateCustomerPayment),
    takeLatest(ACTION_TYPES.FETCH_CORPORATE_INVOICE_PAYMENT, fetchCorporateInvoicePayment)
  ]);
}
