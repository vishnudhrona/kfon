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

function* fetchExpenseDashboard(action) {
  yield* listSaga(action, api.fetchExpenseDashboardApi);
}

function* fetchLnpRetail(action) {
  yield* listSaga(
    { ...action, payload: { ...action.payload, key: SERVER_SIDE_TABLE_KEYS.EXPENSE_REPORTS_LNP_RETAIL } },
    api.fetchLnpRetailApi
  );
}

function* fetchLnpEnterprise(action) {
  yield* listSaga(
    { ...action, payload: { ...action.payload, key: SERVER_SIDE_TABLE_KEYS.EXPENSE_REPORTS_LNP_ENTERPRISE } },
    api.fetchLnpEnterpriseApi
  );
}

function* fetchAgnpEnterprise(action) {
  yield* listSaga(
    { ...action, payload: { ...action.payload, key: SERVER_SIDE_TABLE_KEYS.EXPENSE_REPORTS_AGNP_ENTERPRISE } },
    api.fetchAgnpEnterpriseApi
  );
}

function* fetchMspRevenue(action) {
  yield* listSaga(
    { ...action, payload: { ...action.payload, key: SERVER_SIDE_TABLE_KEYS.EXPENSE_REPORTS_MSP_REVENUE } },
    api.fetchMspRevenueApi
  );
}

function* fetchVasProvider(action) {
  yield* listSaga(
    { ...action, payload: { ...action.payload, key: SERVER_SIDE_TABLE_KEYS.EXPENSE_REPORTS_VAS_PROVIDER } },
    api.fetchVasProviderApi
  );
}

function* fetchPartnersIncentives(action) {
  yield* listSaga(
    { ...action, payload: { ...action.payload, key: SERVER_SIDE_TABLE_KEYS.EXPENSE_REPORTS_PARTNERS_INCENTIVES } },
    api.fetchPartnersIncentivesApi
  );
}

function* fetchIncentivesSummary(action) {
  yield* listSaga(
    { ...action, payload: { ...action.payload, key: SERVER_SIDE_TABLE_KEYS.EXPENSE_REPORTS_INCENTIVES_SUMMARY } },
    api.fetchIncentivesSummaryApi
  );
}

function* fetchPartnerGstRefund(action) {
  yield* listSaga(
    { ...action, payload: { ...action.payload, key: SERVER_SIDE_TABLE_KEYS.EXPENSE_REPORTS_PARTNER_GST_REFUND } },
    api.fetchPartnerGstRefundApi
  );
}

function* fetchRevenueControl(action) {
  yield* listSaga(
    { ...action, payload: { ...action.payload, key: SERVER_SIDE_TABLE_KEYS.EXPENSE_REPORTS_REVENUE_CONTROL } },
    api.fetchRevenueControlApi
  );
}

export default function* expenseReportsSaga() {
  yield all([
    takeLatest(ACTION_TYPES.FETCH_EXPENSE_DASHBOARD, fetchExpenseDashboard),
    takeLatest(ACTION_TYPES.FETCH_LNP_RETAIL, fetchLnpRetail),
    takeLatest(ACTION_TYPES.FETCH_LNP_ENTERPRISE, fetchLnpEnterprise),
    takeLatest(ACTION_TYPES.FETCH_AGNP_ENTERPRISE, fetchAgnpEnterprise),
    takeLatest(ACTION_TYPES.FETCH_MSP_REVENUE, fetchMspRevenue),
    takeLatest(ACTION_TYPES.FETCH_VAS_PROVIDER, fetchVasProvider),
    takeLatest(ACTION_TYPES.FETCH_PARTNERS_INCENTIVES, fetchPartnersIncentives),
    takeLatest(ACTION_TYPES.FETCH_INCENTIVES_SUMMARY, fetchIncentivesSummary),
    takeLatest(ACTION_TYPES.FETCH_PARTNER_GST_REFUND, fetchPartnerGstRefund),
    takeLatest(ACTION_TYPES.FETCH_REVENUE_CONTROL, fetchRevenueControl)
  ]);
}
