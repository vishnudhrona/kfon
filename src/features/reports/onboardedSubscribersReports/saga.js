import { all, call, put, takeLatest } from 'redux-saga/effects';

import { setCommonPaginationResponse } from '@/features/others/Pagination/saga';

import { ACTION_TYPES, API_ACTION_TYPE_VARIANTS } from './action';
import { MOCK_ONBOARDED_SUBSCRIBERS_DATA } from './constants';

export function* fetchOnboardedSubscribersReportList({ payload = {} }) {
  const { key } = payload;
  const mockResponse = {
    content: MOCK_ONBOARDED_SUBSCRIBERS_DATA,
    totalElements: MOCK_ONBOARDED_SUBSCRIBERS_DATA.length,
    pageable: {
      pageNumber: 0,
      pageSize: 10
    }
  };

  yield call(setCommonPaginationResponse, key, mockResponse);

  yield put({
    type: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_ONBOARDED_SUBSCRIBERS_REPORT_LIST][1],
    payload: mockResponse
  });
}

export default function* onboardedSubscribersReportSaga() {
  yield all([takeLatest(ACTION_TYPES.FETCH_ONBOARDED_SUBSCRIBERS_REPORT_LIST, fetchOnboardedSubscribersReportList)]);
}
