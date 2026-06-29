import { all, call, takeLatest } from 'redux-saga/effects';

import { handleAPIRequest } from '@/utils/httpUtils';

import { API_ACTION_TYPES } from './actions';
import * as api from './api';

function* fetchNotifications() {
  yield call(handleAPIRequest, api.fetchNotificationsApi);
}

export default function* notificationsSaga() {
  yield all([takeLatest(API_ACTION_TYPES.FETCH_NOTIFICATIONS, fetchNotifications)]);
}
