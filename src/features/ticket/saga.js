import { all, call, takeLatest } from 'redux-saga/effects';

import { handleAPIRequest } from '@/utils/httpUtils';

import { ACTION_TYPES } from './action';
import * as api from './api';

export function* fetchTicketListSaga({ payload }) {
  try {
    yield call(handleAPIRequest, api.fetchTicketListApi, payload);
  } catch (error) {
    console.error(error);
  }
}

export default function* ticketSaga() {
  yield all([takeLatest(ACTION_TYPES.FETCH_TICKET_LIST, fetchTicketListSaga)]);
}
