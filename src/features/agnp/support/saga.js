import { t } from 'i18next';
import { all, call, take, takeLatest } from 'redux-saga/effects';

import { successToast } from '@/components/custom/Toast';
import { handleAPIRequest } from '@/utils/httpUtils';

import { ACTION_TYPES, API_ACTION_TYPE_VARIANTS } from './action';
import * as api from './api';

export function* fetchTicketTableData() {
  yield call(handleAPIRequest, api.ticketTableDataApi);
}

export function* submitTicketData() {
  yield call(handleAPIRequest, api.submitTicketApi);

  const successAction = yield take(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.SUBMIT_TICKET_DATA][1]);

  yield call(successToast, { title: 'success', description: successAction?.payload?.message || t('saveSuccess') });
}

export default function* agnpInventorySaga() {
  yield all([
    takeLatest(ACTION_TYPES.FETCH_TICKET_TABLE_DATA, fetchTicketTableData),
    takeLatest(ACTION_TYPES.SUBMIT_TICKET_DATA, submitTicketData)
  ]);
}
