import { all,call, takeLatest } from 'redux-saga/effects';

import { handleAPIRequest } from '@/utils/httpUtils';

import { ACTION_TYPES } from './action';
import * as api from './api';

export function* fetchDashboardTableData() {
  yield call(handleAPIRequest, api.dashboardTableDataApi);
}

export function* fetchDashboardCardData() {
  yield call(handleAPIRequest, api.dashboardCardDataApi);
}

export default function* agnpSaga() {
  yield all([
    takeLatest(ACTION_TYPES.FETCH_DASHBOARD_CARD_DATA, fetchDashboardCardData),
    takeLatest(ACTION_TYPES.FETCH_DASHBOARD_TABLE_DATA, fetchDashboardTableData)
  ]);
}
