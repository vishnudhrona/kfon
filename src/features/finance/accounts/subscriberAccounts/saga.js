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

function* fetchSubscriptionRenewal(action) {
  const { payload } = action;
  yield* listSaga(
    { ...action, payload: { ...payload, key: SERVER_SIDE_TABLE_KEYS.SUBSCRIPTION_RENEWAL_TABLE } },
    api.fetchSubscriptionRenewalApi
  );
}

function* fetchSubscriberFinance(action) {
  const { payload } = action;
  yield* listSaga(
    { ...action, payload: { ...payload, key: SERVER_SIDE_TABLE_KEYS.SUBSCRIBER_FINANCE_TABLE } },
    api.fetchSubscriberFinanceApi
  );
}

function* fetchSubscriberPartnerTransfer(action) {
  const { payload } = action;
  yield* listSaga(
    { ...action, payload: { ...payload, key: SERVER_SIDE_TABLE_KEYS.SUBSCRIBER_PARTNER_TRANSFER_TABLE } },
    api.fetchSubscriberPartnerTransferApi
  );
}

function* fetchSubscriberAccount(action) {
  const { payload } = action;
  yield* listSaga(
    { ...action, payload: { ...payload, key: SERVER_SIDE_TABLE_KEYS.SUBSCRIBER_ACCOUNT_TABLE } },
    api.fetchSubscriberAccountApi
  );
}

export default function* subscriberAccountSaga() {
  yield all([
    takeLatest(ACTION_TYPES.FETCH_SUBSCRIPTION_RENEWAL, fetchSubscriptionRenewal),
    takeLatest(ACTION_TYPES.FETCH_SUBSCRIBER_FINANCE, fetchSubscriberFinance),
    takeLatest(ACTION_TYPES.FETCH_SUBSCRIBER_PARTNER_TRANSFER, fetchSubscriberPartnerTransfer),
    takeLatest(ACTION_TYPES.FETCH_SUBSCRIBER_ACCOUNT, fetchSubscriberAccount)
  ]);
}
