import { all, call, takeLatest } from 'redux-saga/effects';

import { handleAPIRequest } from '@/utils/httpUtils';

import { ACTION_TYPES } from './action';
import * as api from './api';

export function* fetchTicketTableData() {
  yield call(handleAPIRequest, api.ticketTableDataApi);
}

export default function* agnpInventorySaga() {
  yield all([takeLatest(ACTION_TYPES.FETCH_TICKET_TABLE_DATA, fetchTicketTableData)]);
}
