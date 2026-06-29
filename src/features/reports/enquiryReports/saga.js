import { all, call, put, takeLatest } from 'redux-saga/effects';

import { setCommonPaginationResponse } from '@/features/others/Pagination/saga';
import { handleAPIRequest } from '@/utils/httpUtils';

import { ACTION_TYPES, API_ACTION_TYPE_VARIANTS } from './action';
import * as api from './api';
import { MOCK_ENQUIRY_REPORT_DATA } from './constants';

export function* fetchEnquiryReportList({ payload = {} }) {
  const { key } = payload;
  const mockResponse = {
    content: MOCK_ENQUIRY_REPORT_DATA,
    totalElements: MOCK_ENQUIRY_REPORT_DATA.length,
    pageable: {
      pageNumber: 0,
      pageSize: 10
    }
  };

  yield call(setCommonPaginationResponse, key, mockResponse);

  yield put({
    type: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_ENQUIRY_REPORT_LIST][1],
    payload: mockResponse
  });
}

export function* assignEnquiry({ payload = {} }) {
  const { onSuccess, ...data } = payload;
  const { response, error } = yield call(handleAPIRequest, api.assignEnquiryApi, data);
  if (response && !error) {
    if (onSuccess) onSuccess();
  }
}

export default function* enquiryReportSaga() {
  yield all([
    takeLatest(ACTION_TYPES.FETCH_ENQUIRY_REPORT_LIST, fetchEnquiryReportList),
    takeLatest(ACTION_TYPES.ASSIGN_ENQUIRY, assignEnquiry)
  ]);
}
