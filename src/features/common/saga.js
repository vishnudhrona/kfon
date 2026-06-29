import { t } from 'i18next';
import { isEmpty } from 'lodash-es';
import { all, call, put, takeEvery, takeLatest } from 'redux-saga/effects';

import { errorToast, successToast } from '@/components/custom/Toast';
import { actions as apiProgressActions } from '@/features/others/ApiProgress/slice';
import { handleAPIRequest } from '@/utils/httpUtils';

import { ACTION_TYPES } from './actions';
import * as api from './api';

export function* fetchDistrictDetails() {
  yield call(handleAPIRequest, api.fetchDistictDetailsApi);
}

export function* sendOtp(action) {
  yield call(handleAPIRequest, api.sendOtpApi, action.payload);
}

export function* submitOtp(action) {
  const { response, error } = yield call(handleAPIRequest, api.submitOtpApi, action.payload);
  if (response && !error) {
    if (action.payload.onSuccess) {
      action.payload.onSuccess();
    }
  } else if (error) {
    const message = error?.response?.data?.message || error?.response?.data?.error || error?.message;
    if (action.payload.onError) {
      action.payload.onError(message || t('error.somethingUnexpected'));
    }
  }
}

export function* fetchPostOfficeDetails(action) {
  yield call(handleAPIRequest, api.fetchPostOfficeDetailsApi, action.payload);
}

export function* fetchPostOfficeByPincodeDetails(action) {
  yield call(handleAPIRequest, api.fetchPostOfficeByPincodeApi, action.payload);
}

export function* fetchPincode() {
  yield call(handleAPIRequest, api.fetchPincodeApi);
}

export function* fetchLocalBody(action) {
  yield call(handleAPIRequest, api.fetchLocalBodyApi, action.payload);
}

export function* fetchPanchayath(action) {
  yield call(handleAPIRequest, api.fetchPanchayathApi, action.payload);
}

export function* fetchBlock(action) {
  yield call(handleAPIRequest, api.fetchBlockApi, action.payload);
}

export function* fetchCorporation(action) {
  yield call(handleAPIRequest, api.fetchCorporationApi, action.payload);
}

export function* checkUsernameAvailability(action) {
  yield call(handleAPIRequest, api.checkUsernameAvailabilityApi, action.payload);
}

export function* fetchRandomNumber() {
  yield call(handleAPIRequest, api.fetchRandomNumberApi);
}

export function* searchGstDetails(action) {
  yield call(handleAPIRequest, api.searchGstDetailsApi, action.payload);
}

export function* requestAadhaarOtp(action) {
  const { response, error } = yield call(handleAPIRequest, api.requestAadhaarOtpApi, action.payload);
  if (response && !error) {
    yield call(successToast, {
      id: 'aadhaar-otp-success',
      description: t('otpSentSuccessfully')
    });
    if (action.payload.onSuccess) {
      yield call(action.payload.onSuccess, response.data);
    }
  } else {
    yield call(errorToast, {
      id: 'aadhaar-otp-error',
      description: t('failedToSendOtp')
    });
  }
}

export function* verifyAadhaarOtp(action) {
  const { response, error } = yield call(handleAPIRequest, api.verifyAadhaarOtpApi, action.payload);
  if (error) {
    yield call(errorToast, {
      id: 'aadhaar-otp-error',
      description: t('failedToVerifyOtp')
    });
  } else if (response && !error) {
    if (action.payload.onSuccess) {
      yield call(action.payload.onSuccess, response.data);
    }
  }
}

export function* fileStorageDeleteSaga(action) {
  const { fileId, fieldName, onSuccess, onError } = action?.payload || {};
  const progressKey = `${ACTION_TYPES.FILE_STORAGE_DELETE}_${fieldName}`;

  try {
    yield put(apiProgressActions.setProgress({ key: progressKey, isLoading: true }));
    const { response, error } = yield call(handleAPIRequest, api.fileStorageDeleteApi, fileId);

    if (!error && isEmpty(response?.error)) {
      if (onSuccess) onSuccess();
    } else {
      if (onError) onError();
    }
  } catch (err) {
    console.error(err);
    if (onError) onError();
  } finally {
    yield put(apiProgressActions.setProgress({ key: progressKey, isLoading: false }));
  }
}

export function* fileStorageViewUrlSaga(action) {
  const { fileId, onSuccess, onError } = action?.payload || {};

  try {
    const { response, error } = yield call(handleAPIRequest, api.fileStorageViewUrlApi, fileId);

    if (!error && response?.data?.url) {
      if (onSuccess) onSuccess({ url: response.data.url, contentType: response.data.contentType });
    } else {
      if (onError) onError();
    }
  } catch (err) {
    console.error(err);
    if (onError) onError();
  }
}

export default function* commonSaga() {
  yield all([
    takeLatest(ACTION_TYPES.FETCH_DISTRICT, fetchDistrictDetails),
    takeLatest(ACTION_TYPES.FETCH_POSTOFFICE, fetchPostOfficeDetails),
    takeLatest(ACTION_TYPES.FETCH_POSTOFFICE_BY_PINCODE, fetchPostOfficeByPincodeDetails),
    takeLatest(ACTION_TYPES.SEND_OTP, sendOtp),
    takeLatest(ACTION_TYPES.SUBMIT_OTP, submitOtp),
    takeLatest(ACTION_TYPES.FETCH_PINCODE, fetchPincode),
    takeLatest(ACTION_TYPES.FETCH_LOCAL_BODY, fetchLocalBody),
    takeLatest(ACTION_TYPES.FETCH_PANCHAYATH, fetchPanchayath),
    takeLatest(ACTION_TYPES.FETCH_BLOCK, fetchBlock),
    takeLatest(ACTION_TYPES.FETCH_CORPORATION, fetchCorporation),
    takeLatest(ACTION_TYPES.CHECK_USERNAME_AVAILABILITY, checkUsernameAvailability),
    takeLatest(ACTION_TYPES.FETCH_RANDOM_NUMBER, fetchRandomNumber),
    takeLatest(ACTION_TYPES.SEARCH_GST_DETAILS, searchGstDetails),
    takeLatest(ACTION_TYPES.REQUEST_AADHAAR_OTP, requestAadhaarOtp),
    takeLatest(ACTION_TYPES.VERIFY_AADHAAR_OTP, verifyAadhaarOtp),
    takeLatest(ACTION_TYPES.FILE_STORAGE_DELETE, fileStorageDeleteSaga),
    takeEvery(ACTION_TYPES.FILE_STORAGE_VIEW_URL, fileStorageViewUrlSaga)
  ]);
}
