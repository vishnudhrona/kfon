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

function* fetchGSTR2ARefund(action) {
  yield* listSaga(
    { ...action, payload: { ...action.payload, key: SERVER_SIDE_TABLE_KEYS.GSTR2A_REFUND_TABLE } },
    api.fetchGSTR2ARefundApi
  );
}

function* fetchGSTR1Report(action) {
  yield* listSaga(
    { ...action, payload: { ...action.payload, key: SERVER_SIDE_TABLE_KEYS.GSTR1_REPORT_TABLE } },
    api.fetchGSTR1ReportApi
  );
}

function* fetchB2BInvoices(action) {
  yield* listSaga(
    { ...action, payload: { ...action.payload, key: SERVER_SIDE_TABLE_KEYS.B2B_INVOICES_TABLE } },
    api.fetchB2BInvoicesApi
  );
}

export default function* gstReportsSaga() {
  yield all([
    takeLatest(ACTION_TYPES.FETCH_GSTR2A_REFUND, fetchGSTR2ARefund),
    takeLatest(ACTION_TYPES.FETCH_GSTR1_REPORT, fetchGSTR1Report),
    takeLatest(ACTION_TYPES.FETCH_B2B_INVOICES, fetchB2BInvoices)
  ]);
}
