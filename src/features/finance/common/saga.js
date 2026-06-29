import { all, fork, put, take, takeLatest } from 'redux-saga/effects';

import { handleAPIRequest } from '@/utils/httpUtils';

import { ACTION_TYPES, API_ACTION_TYPE_VARIANTS } from './action';
import * as api from './api';
import { actions as sliceActions } from './slice';

function* fetchTopupPaymentResult(action) {
    const { payload } = action;

    yield fork(handleAPIRequest, api.fetchTopupPaymentResultApi, payload);

    const { payload: responsePayload = {}, type } = yield take([
        API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_TOPUP_PAYMENT_RESULT][1],
        API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_TOPUP_PAYMENT_RESULT][2]
    ]);

    if (type === API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_TOPUP_PAYMENT_RESULT][1]) {
        yield put(sliceActions.setPaymentResult(responsePayload?.data || {}));
    }
}

export default function* financeCommonSaga() {
    yield all([takeLatest(ACTION_TYPES.FETCH_TOPUP_PAYMENT_RESULT, fetchTopupPaymentResult)]);
}
