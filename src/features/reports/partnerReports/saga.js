import { all, call, put, takeLatest } from 'redux-saga/effects';

import { setCommonPaginationResponse } from '@/features/others/Pagination/saga';

import { ACTION_TYPES, API_ACTION_TYPE_VARIANTS } from './action';
import { MOCK_PARTNER_REQUEST_DATA } from './constants';

export function* fetchPartnerRequestList({ payload = {} }) {
  const { key } = payload;
  const mockResponse = {
    content: MOCK_PARTNER_REQUEST_DATA,
    totalElements: MOCK_PARTNER_REQUEST_DATA.length,
    pageable: {
      pageNumber: 0,
      pageSize: 10
    }
  };

  yield call(setCommonPaginationResponse, key, mockResponse);

  yield put({
    type: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_PARTNER_REQUEST_LIST][1],
    payload: mockResponse
  });
}

export default function* partnerRequestSaga() {
  yield all([takeLatest(ACTION_TYPES.FETCH_PARTNER_REQUEST_LIST, fetchPartnerRequestList)]);
}
