import { t } from 'i18next';
import { all, call, fork, put, take, takeLatest } from 'redux-saga/effects';

import { successToast } from '@/components/custom/Toast';
import { STORAGE_KEYS } from '@/constants';
import { fetchAttachment } from '@/features/crm/action';
import { actions as sliceOtpActions } from '@/features/public/common/slice';
import { fetchEnquiryCardData, fetchEnquirySummary } from '@/features/subscriber/applications/actions';
import { ENQUIRY_TABLE_KEY } from '@/features/subscriber/applications/constants';
import { getDataFromStorage } from '@/utils/encryptionUtils';
import { handleAPIRequest } from '@/utils/httpUtils';
import { isTokenExpired } from '@/utils/jwtUtils';

import { ACTION_TYPES, API_ACTION_TYPE_VARIANTS } from './action';
import * as api from './api';
import { formatAGNPEnquiryResponse, formatLNPEnquiryResponse } from './helpers';
import { actions as sliceActions } from './slice';

export function* saveHomeSubscriberEnquiry(action) {
  const token = getDataFromStorage(STORAGE_KEYS.AUTH_TOKEN, false);
  const isGuest = !token || isTokenExpired(token);
  yield fork(handleAPIRequest, api.homeSubscriberEnquiryApi, action.payload, isGuest);

  const {
    payload: { data, message },
    type
  } = yield take([
    API_ACTION_TYPE_VARIANTS[ACTION_TYPES.SAVE_HOME_SUBSCRIBER_ENQUIRY][1],
    API_ACTION_TYPE_VARIANTS[ACTION_TYPES.SAVE_HOME_SUBSCRIBER_ENQUIRY][2]
  ]);

  if (type === API_ACTION_TYPE_VARIANTS[ACTION_TYPES.SAVE_HOME_SUBSCRIBER_ENQUIRY][1]) {
    yield put(sliceActions.setHomeSubcriberSubmitDetails(data));
    yield put(sliceOtpActions.setOtpPopupOpen(false));
    yield put(sliceOtpActions.setSuccessPopupOpen(true));
    yield call(successToast, {
      title: 'success',
      description: message || t('saveSuccess')
    });
    yield put(sliceActions.clearHomeSubscriberDraft());
    if (!isGuest) {
      yield put(fetchEnquiryCardData());
      yield put(fetchEnquirySummary({ key: ENQUIRY_TABLE_KEY, page: 0, size: 10 }));
    }
  }
}

export function* saveCorpGovSubscriberEnquiry(action) {
  const { payload } = action;
  yield fork(handleAPIRequest, api.saveCorpGovSubscriberEnquiryApi, payload);
  const { payload: { message = '' } = {}, type } = yield take([
    API_ACTION_TYPE_VARIANTS[ACTION_TYPES.SAVE_CORP_GOV_SUBSCRIBER_ENQUIRY][1],
    API_ACTION_TYPE_VARIANTS[ACTION_TYPES.SAVE_CORP_GOV_SUBSCRIBER_ENQUIRY][2]
  ]);

  if (type === API_ACTION_TYPE_VARIANTS[ACTION_TYPES.SAVE_CORP_GOV_SUBSCRIBER_ENQUIRY][1]) {
    yield call(successToast, { title: 'success', description: message || t('saveSuccess') });
    yield put(sliceOtpActions.setSuccessPopupOpen(true));
    yield put(sliceActions.clearCorporateSubscriberDraft());
  }
}

export function* submitAgnpEnquiry(action) {
  const { payload } = action;

  yield fork(handleAPIRequest, api.agnpEnquiryApi, payload);

  const { payload: { message = '' } = {}, type } = yield take([
    API_ACTION_TYPE_VARIANTS[ACTION_TYPES.SAVE_AGNP_ENQUIRY_SUBMIT][1],
    API_ACTION_TYPE_VARIANTS[ACTION_TYPES.SAVE_AGNP_ENQUIRY_SUBMIT][2]
  ]);

  if (type === API_ACTION_TYPE_VARIANTS[ACTION_TYPES.SAVE_AGNP_ENQUIRY_SUBMIT][1]) {
    yield call(successToast, { title: 'success', description: message || t('saveSuccesss') });
    yield put(sliceOtpActions.setSuccessPopupOpen(true));
  }
}

export function* submitLnpEnquiry(action) {
  const { payload } = action;

  yield fork(handleAPIRequest, api.lnpEnquiryApi, payload);

  const { payload: { message = '' } = {}, type } = yield take([
    API_ACTION_TYPE_VARIANTS[ACTION_TYPES.SAVE_LNP_ENQUIRY_SUBMIT][1],
    API_ACTION_TYPE_VARIANTS[ACTION_TYPES.SAVE_LNP_ENQUIRY_SUBMIT][2]
  ]);
  if (type === API_ACTION_TYPE_VARIANTS[ACTION_TYPES.SAVE_LNP_ENQUIRY_SUBMIT][1]) {
    yield call(successToast, { title: 'success', description: message || t('saveSuccesss') });
    yield put(sliceOtpActions.setSuccessPopupOpen(true));
  }
}

export function* fetchLnpCreatedBy() {
  yield fork(handleAPIRequest, api.fetchLnpCreatedByApi);
}

export function* fetchHomeEnquiryByMobile(action) {
  const { payload } = action;
  yield fork(handleAPIRequest, api.fetchHomeEnquiryByMobileApi, payload);

  const { type } = yield take([
    API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_HOME_ENQUIRY_BY_MOBILE][1],
    API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_HOME_ENQUIRY_BY_MOBILE][2]
  ]);

  if (type === API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_HOME_ENQUIRY_BY_MOBILE][1]) {
    // Success - data will be stored in slice, popup will be opened by component
    yield put(sliceActions.setHomeEnquiryDataPopupOpen(true));
  }
}

export function* fetchLnpEnquiryByMobile(action) {
  const { payload } = action;
  const isMobileCheck = !!payload.mobileNumber;

  // Clear stale data for this check type before fetching
  if (isMobileCheck) {
    yield put(sliceActions.setLnpMobileEnquiryData(null));
  } else {
    yield put(sliceActions.setLnpEmailEnquiryData(null));
  }

  yield fork(handleAPIRequest, api.fetchLnpEnquiryByMobileApi, payload);

  const { type, payload: responsePayload } = yield take([
    API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_LNP_ENQUIRY_BY_MOBILE][1],
    API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_LNP_ENQUIRY_BY_MOBILE][2]
  ]);

  if (type === API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_LNP_ENQUIRY_BY_MOBILE][1]) {
    const data = responsePayload?.data ?? null;
    const formatted = formatLNPEnquiryResponse(data);

    if (isMobileCheck) {
      yield put(sliceActions.setLnpMobileEnquiryData(formatted));
    } else {
      yield put(sliceActions.setLnpEmailEnquiryData(formatted));
    }

    if (data !== null) {
      yield put(sliceActions.setLnpEnquiryDataPopupOpen(true));
    }
  }
}

export function* submitDarkFibreEnquiry(action) {
  const { payload } = action;

  yield fork(handleAPIRequest, api.darkFibreEnquiryApi, payload);

  const { payload: { message = '' } = {}, type } = yield take([
    API_ACTION_TYPE_VARIANTS[ACTION_TYPES.SAVE_DARK_FIBRE_ENQUIRY][1],
    API_ACTION_TYPE_VARIANTS[ACTION_TYPES.SAVE_DARK_FIBRE_ENQUIRY][2]
  ]);

  if (type === API_ACTION_TYPE_VARIANTS[ACTION_TYPES.SAVE_DARK_FIBRE_ENQUIRY][1]) {
    yield call(successToast, { title: 'success', description: message || t('saveSuccess') });
    yield put(sliceOtpActions.setSuccessPopupOpen(true));
  }
}

export function* submitBplEnquiry(action) {
  const { payload } = action;

  yield fork(handleAPIRequest, api.bplEnquiryApi, payload);

  const { payload: { message = '' } = {}, type } = yield take([
    API_ACTION_TYPE_VARIANTS[ACTION_TYPES.SAVE_BPL_ENQUIRY][1],
    API_ACTION_TYPE_VARIANTS[ACTION_TYPES.SAVE_BPL_ENQUIRY][2]
  ]);

  if (type === API_ACTION_TYPE_VARIANTS[ACTION_TYPES.SAVE_BPL_ENQUIRY][1]) {
    yield call(successToast, { title: 'success', description: message || t('saveSuccess') });
    yield put(sliceOtpActions.setSuccessPopupOpen(true));
  }
}

export function* fetchIndustry() {
  yield call(handleAPIRequest, api.fetchIndustryApi);
}

export function* fetchService() {
  yield call(handleAPIRequest, api.fetchServiceApi);
}

export function* fetchDepartment() {
  yield call(handleAPIRequest, api.fetchDepartmentApi);
}

export function* fetchSubDepartment(action) {
  const { payload } = action;
  yield call(handleAPIRequest, api.fetchSubDepartmentApi, payload);
}

export function* fetchAgnpEnquiryByMobile(action) {
  const { payload } = action;
  const isMobileCheck = !!payload.mobileNumber;

  if (isMobileCheck) {
    yield put(sliceActions.setAgnpMobileEnquiryData(null));
  } else {
    yield put(sliceActions.setAgnpEmailEnquiryData(null));
  }

  yield fork(handleAPIRequest, api.fetchAgnpEnquiryByMobileApi, payload);

  const { type, payload: responsePayload } = yield take([
    API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_AGNP_ENQUIRY_BY_MOBILE][1],
    API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_AGNP_ENQUIRY_BY_MOBILE][2]
  ]);

  if (type === API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_AGNP_ENQUIRY_BY_MOBILE][1]) {
    const data = responsePayload?.data ?? null;
    const formatted = formatAGNPEnquiryResponse(data);

    if (isMobileCheck) {
      yield put(sliceActions.setAgnpMobileEnquiryData(formatted));
    } else {
      yield put(sliceActions.setAgnpEmailEnquiryData(formatted));
    }

    if (data !== null) {
      yield put(sliceActions.setAgnpEnquiryDataPopupOpen(true));
    }
  }
}

export function* fetchBplApplicationStatus() {
  const year = new Date().getFullYear();
  yield call(handleAPIRequest, api.fetchBplApplicationStatusApi, { year });
}

export function* fetchEnquiryTrackingSaga(action) {
  const { payload } = action;
  yield fork(handleAPIRequest, api.fetchEnquiryTrackingApi, payload);
}

export function* fetchTicketCategory() {
  yield call(handleAPIRequest, api.fetchTicketCategoryApi);
}

export function* ticketCreationNotification(action) {
  const { payload } = action;
  yield fork(handleAPIRequest, api.ticketCreationNotificationApi, payload);
}

export function* trackComplaint(action) {
  const { payload } = action;
  const { response, error } = yield call(handleAPIRequest, api.trackComplaintApi, payload);

  if (response && !error) {
    const ticketId = response.data?.[0]?.ticketId;
    if (ticketId) {
      yield put(fetchAttachment(ticketId));
    }
  }
}

export function* fetchDistrictByPincode(action) {
  const { payload } = action;
  yield call(handleAPIRequest, api.fetchDistrictByPincodeApi, payload);
}

export default function* enquirySaga() {
  yield all([
    takeLatest(ACTION_TYPES.SAVE_HOME_SUBSCRIBER_ENQUIRY, saveHomeSubscriberEnquiry),
    takeLatest(ACTION_TYPES.SAVE_CORP_GOV_SUBSCRIBER_ENQUIRY, saveCorpGovSubscriberEnquiry),
    takeLatest(ACTION_TYPES.SAVE_AGNP_ENQUIRY_SUBMIT, submitAgnpEnquiry),
    takeLatest(ACTION_TYPES.SAVE_LNP_ENQUIRY_SUBMIT, submitLnpEnquiry),
    takeLatest(ACTION_TYPES.FETCH_LNP_CREATED_BY, fetchLnpCreatedBy),
    takeLatest(ACTION_TYPES.FETCH_HOME_ENQUIRY_BY_MOBILE, fetchHomeEnquiryByMobile),
    takeLatest(ACTION_TYPES.FETCH_LNP_ENQUIRY_BY_MOBILE, fetchLnpEnquiryByMobile),
    takeLatest(ACTION_TYPES.FETCH_AGNP_ENQUIRY_BY_MOBILE, fetchAgnpEnquiryByMobile),
    takeLatest(ACTION_TYPES.SAVE_DARK_FIBRE_ENQUIRY, submitDarkFibreEnquiry),
    takeLatest(ACTION_TYPES.SAVE_BPL_ENQUIRY, submitBplEnquiry),
    takeLatest(ACTION_TYPES.FETCH_INDUSTRY, fetchIndustry),
    takeLatest(ACTION_TYPES.FETCH_SERVICE, fetchService),
    takeLatest(ACTION_TYPES.FETCH_DEPARTMENT, fetchDepartment),
    takeLatest(ACTION_TYPES.FETCH_SUB_DEPARTMENT, fetchSubDepartment),
    takeLatest(ACTION_TYPES.FETCH_BPL_APPLICATION_STATUS, fetchBplApplicationStatus),
    takeLatest(ACTION_TYPES.FETCH_ENQUIRY_TRACKING, fetchEnquiryTrackingSaga),
    takeLatest(ACTION_TYPES.FETCH_TICKET_CATEGORY, fetchTicketCategory),
    takeLatest(ACTION_TYPES.TICKET_CREATION_NOTIFICATION, ticketCreationNotification),
    takeLatest(ACTION_TYPES.TRACK_COMPLAINT, trackComplaint),
    takeLatest(ACTION_TYPES.FETCH_DISTRICT_BY_PINCODE, fetchDistrictByPincode)
  ]);
}
