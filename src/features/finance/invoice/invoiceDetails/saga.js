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

function* fetchAGNPCorporateInvoice(action) {
  const { payload } = action;
  yield* listSaga(
    { ...action, payload: { ...payload, key: SERVER_SIDE_TABLE_KEYS.AGNP_CORPORATE_INVOICE_TABLE } },
    api.fetchAGNPCorporateInvoiceApi
  );
}

function* fetchAGNPRetailInvoice(action) {
  const { payload } = action;
  yield* listSaga(
    { ...action, payload: { ...payload, key: SERVER_SIDE_TABLE_KEYS.AGNP_RETAIL_INVOICE_TABLE } },
    api.fetchAGNPRetailInvoiceApi
  );
}

function* fetchEOSubscriberInvoice(action) {
  const { payload } = action;
  yield* listSaga(
    { ...action, payload: { ...payload, key: SERVER_SIDE_TABLE_KEYS.EO_SUBSCRIBER_INVOICE_TABLE } },
    api.fetchEOSubscriberInvoiceApi
  );
}

function* fetchLNPCorporateInvoice(action) {
  const { payload } = action;
  yield* listSaga(
    { ...action, payload: { ...payload, key: SERVER_SIDE_TABLE_KEYS.LNP_CORPORATE_INVOICE_TABLE } },
    api.fetchLNPCorporateInvoiceApi
  );
}

function* fetchLNPCorporateOTCInvoice(action) {
  const { payload } = action;
  yield* listSaga(
    { ...action, payload: { ...payload, key: SERVER_SIDE_TABLE_KEYS.LNP_CORPORATE_OTC_INVOICE_TABLE } },
    api.fetchLNPCorporateOTCInvoiceApi
  );
}

function* fetchLNPRetailInvoice(action) {
  const { payload } = action;
  yield* listSaga(
    { ...action, payload: { ...payload, key: SERVER_SIDE_TABLE_KEYS.LNP_RETAIL_INVOICE_TABLE } },
    api.fetchLNPRetailInvoiceApi
  );
}

function* fetchMSPBuOeInvoice(action) {
  const { payload } = action;
  yield* listSaga(
    { ...action, payload: { ...payload, key: SERVER_SIDE_TABLE_KEYS.MSP_BU_OE_INVOICE_TABLE } },
    api.fetchMSPBuOeInvoiceApi
  );
}

function* fetchMSPCorporateInvoice(action) {
  const { payload } = action;
  yield* listSaga(
    { ...action, payload: { ...payload, key: SERVER_SIDE_TABLE_KEYS.MSP_CORPORATE_INVOICE_TABLE } },
    api.fetchMSPCorporateInvoiceApi
  );
}

function* fetchONTPurchaseInvoice(action) {
  const { payload } = action;
  yield* listSaga(
    { ...action, payload: { ...payload, key: SERVER_SIDE_TABLE_KEYS.ONT_PURCHASE_INVOICE_TABLE } },
    api.fetchONTPurchaseInvoiceApi
  );
}

function* fetchOTTProviderInvoice(action) {
  const { payload } = action;
  yield* listSaga(
    { ...action, payload: { ...payload, key: SERVER_SIDE_TABLE_KEYS.OTT_PROVIDER_INVOICE_TABLE } },
    api.fetchOTTProviderInvoiceApi
  );
}

function* fetchSubscriberBPLInvoice(action) {
  const { payload } = action;
  yield* listSaga(
    { ...action, payload: { ...payload, key: SERVER_SIDE_TABLE_KEYS.SUBSCRIBER_BPL_INVOICE_TABLE } },
    api.fetchSubscriberBPLInvoiceApi
  );
}

function* fetchSubscriberInvoiceReports(action) {
  const { payload } = action;
  yield* listSaga(
    { ...action, payload: { ...payload, key: SERVER_SIDE_TABLE_KEYS.SUBSCRIBER_INVOICE_REPORTS_TABLE } },
    api.fetchSubscriberInvoiceReportsApi
  );
}

export default function* invoiceDetailsSaga() {
  yield all([
    takeLatest(ACTION_TYPES.FETCH_AGNP_CORPORATE_INVOICE, fetchAGNPCorporateInvoice),
    takeLatest(ACTION_TYPES.FETCH_AGNP_RETAIL_INVOICE, fetchAGNPRetailInvoice),
    takeLatest(ACTION_TYPES.FETCH_EO_SUBSCRIBER_INVOICE, fetchEOSubscriberInvoice),
    takeLatest(ACTION_TYPES.FETCH_LNP_CORPORATE_INVOICE, fetchLNPCorporateInvoice),
    takeLatest(ACTION_TYPES.FETCH_LNP_CORPORATE_OTC_INVOICE, fetchLNPCorporateOTCInvoice),
    takeLatest(ACTION_TYPES.FETCH_LNP_RETAIL_INVOICE, fetchLNPRetailInvoice),
    takeLatest(ACTION_TYPES.FETCH_MSP_BU_OE_INVOICE, fetchMSPBuOeInvoice),
    takeLatest(ACTION_TYPES.FETCH_MSP_CORPORATE_INVOICE, fetchMSPCorporateInvoice),
    takeLatest(ACTION_TYPES.FETCH_ONT_PURCHASE_INVOICE, fetchONTPurchaseInvoice),
    takeLatest(ACTION_TYPES.FETCH_OTT_PROVIDER_INVOICE, fetchOTTProviderInvoice),
    takeLatest(ACTION_TYPES.FETCH_SUBSCRIBER_BPL_INVOICE, fetchSubscriberBPLInvoice),
    takeLatest(ACTION_TYPES.FETCH_SUBSCRIBER_INVOICE_REPORTS, fetchSubscriberInvoiceReports)
  ]);
}
