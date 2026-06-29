import { t } from 'i18next';
import { all, call, fork, put, select, take, takeLatest } from 'redux-saga/effects';

import { errorToast, successToast } from '@/components/custom/Toast';
import { actions as sliceOtpActions } from '@/features/public/common/slice';
import {
  saveAgnpEnquiry,
  saveBplEnquiry,
  saveCorpGovSubscriberEnquiry,
  saveDarkFibreEnquiry,
  saveHomeSubscriberEnquiry,
  saveLnpEnquiry
} from '@/features/public/pages/enquiryForms/action';
import { actions as enquiryFormActions } from '@/features/public/pages/enquiryForms/slice';
import { handleAPIRequest } from '@/utils/httpUtils';

import { ACTION_TYPES, API_ACTION_TYPE_VARIANTS } from './actions';
import * as api from './api';

export function* sendOtpForms(action) {
  const { payload } = action;
  const { cusMobile = '', isResend = false } = payload || {};
  if (!isResend) {
    yield put(enquiryFormActions.setHomeSubscriberDraft(payload));
  }
  yield put(sliceOtpActions.setOtpMobile(cusMobile));
  yield fork(handleAPIRequest, api.sendOtpFormsApi, { mobile: cusMobile });

  const { payload: { message = '' } = {}, type } = yield take([
    API_ACTION_TYPE_VARIANTS[ACTION_TYPES.SEND_OTP_FORMS][1],
    API_ACTION_TYPE_VARIANTS[ACTION_TYPES.SEND_OTP_FORMS][2]
  ]);
  if (type === API_ACTION_TYPE_VARIANTS[ACTION_TYPES.SEND_OTP_FORMS][1]) {
    yield call(successToast, {
      title: 'Success',
      description: message || t('saveSuccess')
    });
    yield put(sliceOtpActions.setOtpError(''));
    yield put(sliceOtpActions.setOtpPopupOpen(true));
  } else {
    yield call(errorToast, {
      title: 'Error',
      description: message || t('somethingWentWrong')
    });
  }
}

export function* verifyOtpForms(action) {
  const { payload: { otp = '', otpRefId = '' } = {} } = action;
  yield fork(handleAPIRequest, api.verifyOtpFormsApi, {
    otpReferenceId: otpRefId,
    otp: otp
  });
  const { payload = {}, type } = yield take([
    API_ACTION_TYPE_VARIANTS[ACTION_TYPES.VERIFY_OTP_FORMS][1],
    API_ACTION_TYPE_VARIANTS[ACTION_TYPES.VERIFY_OTP_FORMS][2]
  ]);

  if (type === API_ACTION_TYPE_VARIANTS[ACTION_TYPES.VERIFY_OTP_FORMS][2]) {
    const customErr = payload?.error?.customErrorResponse;
    const errorMessage =
      (typeof customErr === 'object' ? customErr?.message : customErr) ||
      payload?.error?.message ||
      t('invalidOtp');
    yield put(sliceOtpActions.setOtpError(errorMessage));
    return;
  }

  if (type === API_ACTION_TYPE_VARIANTS[ACTION_TYPES.VERIFY_OTP_FORMS][1]) {
    yield put(sliceOtpActions.setOtpError(''));
    yield put(sliceOtpActions.setOtpPopupOpen(false));
    yield call(successToast, {
      title: 'Success',
      description: payload?.message || t('saveSuccess')
    });
    const draftPayload = yield select((state) => state['enquiry-forms'].homeSubscriberDraft);
    if (draftPayload) {
      const { enquiryType, file, ...restPayload } = draftPayload;

      if (enquiryType === 'AGNP') {
        yield put(saveAgnpEnquiry(restPayload));
      } else if (enquiryType === 'DARK_FIBRE') {
        yield put(saveDarkFibreEnquiry(restPayload));
      } else if (enquiryType === 'LNP') {
        // eslint-disable-next-line no-unused-vars
        const { cusMobile, ...lnpPayload } = restPayload;
        if (file) {
          const formData = new FormData();
          formData.append('data', JSON.stringify(lnpPayload));
          formData.append('file', file);
          yield put(saveLnpEnquiry(formData));
        } else {
          const formData = new FormData();
          formData.append('data', JSON.stringify(lnpPayload));
          yield put(saveLnpEnquiry(formData));
        }
      } else if (enquiryType === 'BPL') {
        yield put(saveBplEnquiry(restPayload));
      } else if (enquiryType === 'CORP_GOV') {
        yield put(saveCorpGovSubscriberEnquiry(restPayload));
      } else {
        yield put(saveHomeSubscriberEnquiry(restPayload));
      }
      yield put(enquiryFormActions.clearHomeSubscriberDraft());
    }
  }
}

export default function* commonPublicSaga() {
  yield all([
    takeLatest(ACTION_TYPES.SEND_OTP_FORMS, sendOtpForms),
    takeLatest(ACTION_TYPES.VERIFY_OTP_FORMS, verifyOtpForms)
  ]);
}
