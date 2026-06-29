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

function* fetchRechargeInsights(action) {
  yield* listSaga(
    { ...action, payload: { ...action.payload, key: SERVER_SIDE_TABLE_KEYS.RECHARGE_INSIGHTS_TABLE } },
    api.fetchRechargeInsightsApi
  );
}

function* fetchSubscriberRecharge(action) {
  yield* listSaga(
    { ...action, payload: { ...action.payload, key: SERVER_SIDE_TABLE_KEYS.SUBSCRIBER_RECHARGE_REPORT_TABLE } },
    api.fetchSubscriberRechargeApi
  );
}

function* fetchPartnerRecharge(action) {
  yield* listSaga(
    { ...action, payload: { ...action.payload, key: SERVER_SIDE_TABLE_KEYS.PARTNER_RECHARGE_REPORT_TABLE } },
    api.fetchPartnerRechargeApi
  );
}

export default function* rechargeReportsSaga() {
  yield all([
    takeLatest(ACTION_TYPES.FETCH_RECHARGE_INSIGHTS, fetchRechargeInsights),
    takeLatest(ACTION_TYPES.FETCH_SUBSCRIBER_RECHARGE, fetchSubscriberRecharge),
    takeLatest(ACTION_TYPES.FETCH_PARTNER_RECHARGE, fetchPartnerRecharge)
  ]);
}
