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

function* fetchRevenueControl(action) {
  const { payload } = action;
  yield* listSaga(
    { ...action, payload: { ...payload, key: SERVER_SIDE_TABLE_KEYS.REVENUE_CONTROL_TABLE } },
    api.fetchRevenueControlApi
  );
}

function* fetchGstr2aPartners(action) {
  const { payload } = action;
  yield* listSaga(
    { ...action, payload: { ...payload, key: SERVER_SIDE_TABLE_KEYS.GSTR2A_PARTNERS_TABLE } },
    api.fetchGstr2aPartnersApi
  );
}

function* fetchGstr1RetailCorporate(action) {
  const { payload } = action;
  yield* listSaga(
    { ...action, payload: { ...payload, key: SERVER_SIDE_TABLE_KEYS.GSTR1_RETAIL_CORPORATE_TABLE } },
    api.fetchGstr1RetailCorporateApi
  );
}

function* fetchSubInvoiceB2B(action) {
  const { payload } = action;
  yield* listSaga(
    { ...action, payload: { ...payload, key: SERVER_SIDE_TABLE_KEYS.SUB_INVOICE_B2B_TABLE } },
    api.fetchSubInvoiceB2BApi
  );
}

function* fetchSubInvoiceB2CRetails(action) {
  const { payload } = action;
  yield* listSaga(
    { ...action, payload: { ...payload, key: SERVER_SIDE_TABLE_KEYS.SUB_INVOICE_B2C_RETAILS_TABLE } },
    api.fetchSubInvoiceB2CRetailsApi
  );
}

function* fetchSubInvoiceB2BCorporate(action) {
  const { payload } = action;
  yield* listSaga(
    { ...action, payload: { ...payload, key: SERVER_SIDE_TABLE_KEYS.SUB_INVOICE_B2B_CORPORATE_TABLE } },
    api.fetchSubInvoiceB2BCorporateApi
  );
}

function* fetchSubInvoiceB2CCorporate(action) {
  const { payload } = action;
  yield* listSaga(
    { ...action, payload: { ...payload, key: SERVER_SIDE_TABLE_KEYS.SUB_INVOICE_B2C_CORPORATE_TABLE } },
    api.fetchSubInvoiceB2CCorporateApi
  );
}

function* fetchNldReport(action) {
  const { payload } = action;
  yield* listSaga(
    { ...action, payload: { ...payload, key: SERVER_SIDE_TABLE_KEYS.NLD_REPORT_TABLE } },
    api.fetchNldReportApi
  );
}

function* fetchAgrReport(action) {
  const { payload } = action;
  yield* listSaga(
    { ...action, payload: { ...payload, key: SERVER_SIDE_TABLE_KEYS.AGR_REPORT_TABLE } },
    api.fetchAgrReportApi
  );
}

export default function* statutorySaga() {
  yield all([
    takeLatest(ACTION_TYPES.FETCH_REVENUE_CONTROL, fetchRevenueControl),
    takeLatest(ACTION_TYPES.FETCH_GSTR2A_PARTNERS, fetchGstr2aPartners),
    takeLatest(ACTION_TYPES.FETCH_GSTR1_RETAIL_CORPORATE, fetchGstr1RetailCorporate),
    takeLatest(ACTION_TYPES.FETCH_SUB_INVOICE_B2B, fetchSubInvoiceB2B),
    takeLatest(ACTION_TYPES.FETCH_SUB_INVOICE_B2C_RETAILS, fetchSubInvoiceB2CRetails),
    takeLatest(ACTION_TYPES.FETCH_SUB_INVOICE_B2B_CORPORATE, fetchSubInvoiceB2BCorporate),
    takeLatest(ACTION_TYPES.FETCH_SUB_INVOICE_B2C_CORPORATE, fetchSubInvoiceB2CCorporate),
    takeLatest(ACTION_TYPES.FETCH_NLD_REPORT, fetchNldReport),
    takeLatest(ACTION_TYPES.FETCH_AGR_REPORT, fetchAgrReport)
  ]);
}
