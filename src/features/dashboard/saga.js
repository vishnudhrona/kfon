// import { t } from 'i18next';
import { all, call, takeLatest } from 'redux-saga/effects';

// import { successToast } from '@/components/custom/Toast';
import { handleAPIRequest } from '@/utils/httpUtils';

import { ACTION_TYPES } from './action';
import * as api from './api';

export function* fetchDashBoardDetails({ payload }) {
  try {
    yield call(handleAPIRequest, api.fecthDashboardDetailsApi, payload);
  } catch (error) {
    console.error(error);
  }
}

export function* fetchLnpDashboardDetails({ payload }) {
  try {
    yield call(handleAPIRequest, api.fetchLnpDashboardDetailsApi, payload);
  } catch (error) {
    console.error(error);
  }
}

export default function* onboardingSaga() {
  yield all([
    takeLatest(ACTION_TYPES.FETCH_DASHBOARD_DETAILS, fetchDashBoardDetails),
    takeLatest(ACTION_TYPES.FETCH_LNP_DASHBOARD_DETAILS, fetchLnpDashboardDetails)
  ]);
}
