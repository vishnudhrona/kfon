import { all, call, takeLatest } from 'redux-saga/effects';

import { handleAPIRequest } from '@/utils/httpUtils';

import { ACTION_TYPES } from './action';
import * as api from './api';

export function* fetchRetailSubscriberList() {
  yield call(handleAPIRequest, api.fecthRetailSubcListApi);
}

export default function* agnpInventorySaga() {
  yield all([takeLatest(ACTION_TYPES.FETCH_LNP_RETAIL_SUBC_LIST, fetchRetailSubscriberList)]);
}
