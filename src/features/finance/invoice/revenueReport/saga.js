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

function* fetchRevenueDashboard(action) {
  yield* listSaga(
    { ...action, payload: { ...action.payload, key: SERVER_SIDE_TABLE_KEYS.REVENUE_REPORTS_DASHBOARD } },
    api.fetchRevenueDashboardApi
  );
}

function* fetchRevenueReportsList(action) {
  yield* listSaga(action, api.fetchRevenueReportsListApi);
}

function* fetchBr11Data(action) {
  yield* listSaga(
    { ...action, payload: { ...action.payload, key: SERVER_SIDE_TABLE_KEYS.REVENUE_REPORTS_INVOICE_REVENUE } },
    api.fetchBr11DataApi
  );
}

function* fetchBr27Data(action) {
  yield* listSaga(
    { ...action, payload: { ...action.payload, key: SERVER_SIDE_TABLE_KEYS.REVENUE_REPORTS_CREDIT_NOTE } },
    api.fetchBr27DataApi
  );
}

function* fetchRevenueBySegment(action) {
  yield* listSaga(
    { ...action, payload: { ...action.payload, key: SERVER_SIDE_TABLE_KEYS.REVENUE_REPORTS_BY_SEGMENT } },
    api.fetchRevenueBySegmentApi
  );
}

function* fetchRevenueTopCustomers(action) {
  yield* listSaga(
    { ...action, payload: { ...action.payload, key: SERVER_SIDE_TABLE_KEYS.REVENUE_REPORTS_BY_CUSTOMER } },
    api.fetchRevenueTopCustomersApi
  );
}

export default function* revenueReportSaga() {
  yield all([
    takeLatest(ACTION_TYPES.FETCH_REVENUE_DASHBOARD, fetchRevenueDashboard),
    takeLatest(ACTION_TYPES.FETCH_REVENUE_REPORTS_LIST, fetchRevenueReportsList),
    takeLatest(ACTION_TYPES.FETCH_BR11_DATA, fetchBr11Data),
    takeLatest(ACTION_TYPES.FETCH_BR27_DATA, fetchBr27Data),
    takeLatest(ACTION_TYPES.FETCH_REVENUE_BY_SEGMENT, fetchRevenueBySegment),
    takeLatest(ACTION_TYPES.FETCH_REVENUE_TOP_CUSTOMERS, fetchRevenueTopCustomers)
  ]);
}
