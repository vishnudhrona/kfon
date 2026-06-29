import { all, call, takeLatest } from 'redux-saga/effects';

import { handleAPIRequest } from '@/utils/httpUtils';

import { ACTION_TYPES } from './action';
import * as api from './api';

export function* fetchSubscriptionTableData() {
  yield call(handleAPIRequest, api.subscriptionTableDataApi);
}

export default function* agnpSubscriptionSaga() {
  yield all([takeLatest(ACTION_TYPES.FETCH_SUBSCRIPTION_TABLE_DATA, fetchSubscriptionTableData)]);
}
