import { t } from 'i18next';
import { all, call, fork, put, take, takeLatest } from 'redux-saga/effects';

import { successToast } from '@/components/custom/Toast';
import { setCommonPaginationResponse } from '@/features/others/Pagination/saga';
import { handleAPIRequest } from '@/utils/httpUtils';

import { ACTION_TYPES, API_ACTION_TYPE_VARIANTS } from './action';
import * as api from './api';
import { MOCK_DATA, MOCK_PROPOSAL_DATA, NOT_UPDATED } from './constants';
import { actions as sliceActions } from './slice';

export function* fetchEnquiryList(action) {
  const { payload = {} } = action;
  const { key } = payload;

  try {
    const { response, error } = yield call(handleAPIRequest, api.fetchEnquiryListApi, payload);

    let finalData = MOCK_DATA;
    let totalElements = MOCK_DATA.length;
    let pageable = { pageNumber: 0, pageSize: 10 };

    if (!error && response?.data) {
      const { content = [], totalElements: total = 0, pageable: p = {} } = response.data;
      if (content?.length > 0) {
        finalData = content.map((item) => ({
          requestId: item.enquiryId,
          companyName: item.firmName,
          companyPhone: item.firmContactNo,
          contactPersonName: item.contactPersonName,
          contactPersonPhone: item.contactPersonMobileNo,
          assignTo: item.assignTo || '-',
          createdDate: item.createdDt,
          status: item.status,
          companyProfile: item.companyProfile ? 'Updated' : NOT_UPDATED,
          darkFiberDetails: item.darkFiberDetails ? 'Updated' : NOT_UPDATED,
          action: '...'
        }));
        totalElements = total;
        pageable = p;
      }
    }

    const mockResponse = {
      content: finalData,
      totalElements,
      pageable
    };

    yield call(setCommonPaginationResponse, key, mockResponse);

    yield put({
      type: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_ENQUIRY_LIST][1],
      payload: mockResponse
    });
  } catch (error) {
    console.error('Failed to fetch dark fiber enquiry list', error);
    const mockResponse = {
      content: MOCK_DATA,
      totalElements: MOCK_DATA.length,
      pageable: {
        pageNumber: 0,
        pageSize: 10
      }
    };

    yield call(setCommonPaginationResponse, key, mockResponse);

    yield put({
      type: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_ENQUIRY_LIST][1],
      payload: mockResponse
    });
  }
}

function* createSaga(payload, apiFn, actionType) {
  yield fork(handleAPIRequest, apiFn, payload);

  const { payload: { message = '' } = {}, type } = yield take([
    API_ACTION_TYPE_VARIANTS[actionType][1],
    API_ACTION_TYPE_VARIANTS[actionType][2]
  ]);

  if (type === API_ACTION_TYPE_VARIANTS[actionType][1]) {
    yield call(successToast, { title: 'success', description: message || t('saveSuccess') });
    return true;
  }
  return false;
}

function* fetchDropdown({ payload, apiFn, key }) {
  try {
    const { response, error } = yield call(handleAPIRequest, apiFn, payload);
    if (error || !response?.data) {
      throw new Error(error?.message || 'Failed to fetch data');
    }
    yield put(sliceActions.setDropdownData({ key, data: response.data }));
  } catch (error) {
    console.warn(`Failed to fetch ${key}`, error);
    if (key === 'assignToUsers') {
      yield put(
        sliceActions.setDropdownData({
          key,
          data: [
            { id: 'user1', name: 'Verified User 1' },
            { id: 'user2', name: 'Verified User 2' }
          ]
        })
      );
    }
    if (key === 'popList') {
      yield put(
        sliceActions.setDropdownData({
          key,
          data: [
            { id: 'pop1', name: 'POP Trivandrum' },
            { id: 'pop2', name: 'POP Kochi' }
          ]
        })
      );
    }
    if (key === 'enquiryDetails') {
      const mockDetails = {
        '003': {
          panNumber: 'ABCDE1234F'
        },
        '001': {
          // PAN missing for 001
        }
      };
      yield put(sliceActions.setDropdownData({ key, data: mockDetails[payload] || {} }));
    }
  }
}

function* assignEnquiry(action) {
  const { onSuccess, ...payload } = action.payload || {};
  const isSuccess = yield createSaga(payload, api.assignEnquiryApi, ACTION_TYPES.ASSIGN_ENQUIRY);
  if (isSuccess && onSuccess) {
    onSuccess();
  }
}

function* createDarkFiberDetails(action) {
  const { onSuccess, ...payload } = action.payload || {};
  const isSuccess = yield createSaga(payload, api.createDarkFiberDetailsApi, ACTION_TYPES.CREATE_DARK_FIBER_DETAILS);
  if (isSuccess && onSuccess) {
    onSuccess();
  }
}

function* fetchAssignToUsersSaga(action) {
  yield fetchDropdown({ payload: action.payload, apiFn: api.fetchAssignToUsersApi, key: 'assignToUsers' });
}

function* fetchPopListSaga(action) {
  yield fetchDropdown({ payload: action.payload, apiFn: api.fetchPopListApi, key: 'popList' });
}

function* createDarkFiberProposal(action) {
  const { onSuccess, ...payload } = action.payload || {};
  const isSuccess = yield createSaga(payload, api.createDarkFiberProposalApi, ACTION_TYPES.CREATE_DARK_FIBER_PROPOSAL);
  if (isSuccess && onSuccess) {
    onSuccess();
  }
}

export function* fetchProposalList({ payload = {} }) {
  const { key } = payload;
  const mockResponse = {
    content: MOCK_PROPOSAL_DATA,
    totalElements: MOCK_PROPOSAL_DATA.length,
    pageable: {
      pageNumber: 0,
      pageSize: 10
    }
  };

  yield call(setCommonPaginationResponse, key, mockResponse);

  yield put({
    type: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_PROPOSAL_LIST][1],
    payload: mockResponse
  });
}

function* fetchDarkFiberEnquiryDetailsSaga(action) {
  yield fetchDropdown({
    payload: action.payload,
    apiFn: api.fetchDarkFiberEnquiryDetailsApi,
    key: 'enquiryDetails'
  });
}

function* uploadCompanyProfile(action) {
  const { onSuccess, panDoc, gstDoc, supportingDoc, lutDoc, ...rest } = action.payload || {};
  const formData = new FormData();

  if (panDoc && panDoc[0]) formData.append('panproof', panDoc[0]);
  if (gstDoc && gstDoc[0]) formData.append('gstinproof', gstDoc[0]);
  if (supportingDoc && supportingDoc[0]) formData.append('supportdoc', supportingDoc[0]);
  if (lutDoc && lutDoc[0]) formData.append('lutdoc', lutDoc[0]);

  formData.append('payload', JSON.stringify(rest));

  const isSuccess = yield createSaga(formData, api.uploadCompanyProfileApi, ACTION_TYPES.UPLOAD_COMPANY_PROFILE);
  if (isSuccess && onSuccess) {
    onSuccess();
  }
}

function* downloadEnquiryListCsv(action) {
  yield call(handleAPIRequest, api.downloadEnquiryListCsvApi, action.payload);
}

export default function* enquirySaga() {
  yield all([
    takeLatest(ACTION_TYPES.FETCH_ENQUIRY_LIST, fetchEnquiryList),
    takeLatest(ACTION_TYPES.ASSIGN_ENQUIRY, assignEnquiry),
    takeLatest(ACTION_TYPES.CREATE_DARK_FIBER_DETAILS, createDarkFiberDetails),
    takeLatest(ACTION_TYPES.FETCH_ASSIGN_TO_USERS, fetchAssignToUsersSaga),
    takeLatest(ACTION_TYPES.FETCH_POP_LIST, fetchPopListSaga),
    takeLatest(ACTION_TYPES.CREATE_DARK_FIBER_PROPOSAL, createDarkFiberProposal),
    takeLatest(ACTION_TYPES.FETCH_PROPOSAL_LIST, fetchProposalList),
    takeLatest(ACTION_TYPES.FETCH_DARK_FIBER_ENQUIRY_DETAILS, fetchDarkFiberEnquiryDetailsSaga),
    takeLatest(ACTION_TYPES.UPLOAD_COMPANY_PROFILE, uploadCompanyProfile),
    takeLatest(ACTION_TYPES.DOWNLOAD_ENQUIRY_LIST_CSV, downloadEnquiryListCsv)
  ]);
}
