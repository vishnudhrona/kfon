import { t } from 'i18next';
import get from 'lodash-es/get';
import { eventChannel } from 'redux-saga';
import { all, call, delay, fork, put, race, take, takeLatest } from 'redux-saga/effects';

import { successToast } from '@/components/custom/Toast';
import { STORAGE_KEYS } from '@/constants';
import { doLogout, logout, validateToken } from '@/features/others/common/actions';
import { router } from '@/routes/routes';
import { getDataFromStorage, setDataToStorage } from '@/utils/encryptionUtils';
import { handleAPIRequest } from '@/utils/httpUtils';
import { isTokenExpired } from '@/utils/jwtUtils';
import { enqueueRequest, getIsRefreshing, rejectQueue, resolveQueue, setIsRefreshing } from '@/utils/refreshLock';

import { ACTION_TYPES, API_ACTION_TYPE_VARIANTS } from './action';
import * as api from './api';
import { actions as LoginActions } from './slice';

let proactiveRefreshTask = null;

export function* userLogin(action) {
  const { payload } = action;
  yield fork(handleAPIRequest, api.userLoginApi, payload);

  const { payload: responsePayload = {}, type } = yield take([
    API_ACTION_TYPE_VARIANTS[ACTION_TYPES.USER_LOGIN][1],
    API_ACTION_TYPE_VARIANTS[ACTION_TYPES.USER_LOGIN][2]
  ]);

  if (type === API_ACTION_TYPE_VARIANTS[ACTION_TYPES.USER_LOGIN][2]) {
    const message =
      get(responsePayload, 'error.customErrorResponse.message') || get(responsePayload, 'error.message', '');
    yield put(LoginActions.setLoginError(message));
    return;
  }

  if (type === API_ACTION_TYPE_VARIANTS[ACTION_TYPES.USER_LOGIN][1]) {
    yield put(LoginActions.setLoginError(''));
    router.navigate({ to: '/auth/login-otp' });
  }
}

export function* verifyLoginOtp(action) {
  const { payload } = action;
  yield fork(handleAPIRequest, api.verifyLoginOtpApi, payload);

  const { payload: responsePayload = {}, type } = yield take([
    API_ACTION_TYPE_VARIANTS[ACTION_TYPES.VERIFY_LOGIN_OTP][1],
    API_ACTION_TYPE_VARIANTS[ACTION_TYPES.VERIFY_LOGIN_OTP][2]
  ]);

  if (type === API_ACTION_TYPE_VARIANTS[ACTION_TYPES.VERIFY_LOGIN_OTP][2]) {
    const message =
      get(responsePayload, 'error.customErrorResponse.message') ||
      get(responsePayload, 'error.message', t('invalidOtp', { defaultValue: 'Invalid OTP' }));
    yield put(LoginActions.setLoginError(message));
    return;
  }

  if (type === API_ACTION_TYPE_VARIANTS[ACTION_TYPES.VERIFY_LOGIN_OTP][1]) {
    const token = get(responsePayload, 'data.token');
    const refreshToken = get(responsePayload, 'data.refreshToken');
    const expiresIn = get(responsePayload, 'data.expiresIn');
    if (token) {
      setDataToStorage(STORAGE_KEYS.AUTH_TOKEN, token, false);
    }
    if (refreshToken) {
      setDataToStorage(STORAGE_KEYS.REFRESH_TOKEN, refreshToken, false);
    }
    if (expiresIn) {
      setDataToStorage(STORAGE_KEYS.TOKEN_EXPIRES_IN, String(expiresIn), false);
    }

    // Set login response to Redux state (this will also persist to localStorage via the reducer)
    yield put(LoginActions.setLoginDetails(responsePayload));
    yield put(LoginActions.setLoginError(''));

    if (expiresIn) {
      if (proactiveRefreshTask) {
        proactiveRefreshTask.cancel();
      }
      proactiveRefreshTask = yield fork(watchProactiveRefresh, expiresIn);
    }

    const currentLocation = router.state.location;
    const redirectUrl = get(currentLocation, 'search.redirect');
    if (redirectUrl) {
      router.navigate({ to: redirectUrl });
    } else {
      router.navigate({ to: '/app' });
    }
  }
}

export function* resendLoginOtp(action) {
  const { payload } = action;
  const { response, error } = yield call(handleAPIRequest, api.resendLoginOtpApi, payload);

  if (response && !error) {
    const data = get(response, 'data');
    if (data?.otpRefId || data?.loginSessionToken || data?.mobile) {
      yield put(LoginActions.setLoginOtpDetails(data));
    }
    yield call(successToast, { title: 'success', description: t('otpResentSuccessfully') });
  }
}

export function* sendOtp(action) {
  const { onSuccess, username } = action.payload;
  const { response, error } = yield call(handleAPIRequest, api.sendOtpApi, { username });

  if (response && !error) {
    yield put(LoginActions.setForgotPasswordUsername(username));
    yield call(successToast, { title: 'success', description: response?.message || t('otpSentSuccessfully') });
    onSuccess();
  }
}

export function* verifyOtp(action) {
  const { payload } = action;
  const { response, error } = yield call(handleAPIRequest, api.verifyOtpApi, payload);

  if (response && !error) {
    yield call(successToast, { title: 'success', description: response?.message || t('otpVerifiedSuccessfully') });
    router.navigate({ to: '/auth/enter-new-password/' });
  }
}

export function* resetPassword(action) {
  const { payload } = action;

  const { response, error } = yield call(handleAPIRequest, api.resetPasswordApi, payload);

  if (response && !error) {
    yield put(LoginActions.clearIsFirstLogin());
    yield call(successToast, { title: 'success', description: response?.message || t('passwordResetSuccessfully') });
    router.navigate({ to: '/app' });
  }
}

export function* logoutSaga() {
  const storedRefreshToken = getDataFromStorage(STORAGE_KEYS.REFRESH_TOKEN, false);
  if (storedRefreshToken) {
    yield call(handleAPIRequest, api.logoutApi, { refreshToken: storedRefreshToken });
  }
  // logout() triggers root reducer: localStorage.clear() + all Redux slices reset to undefined
  yield put(logout());
  router.navigate({ to: '/' });
}

function* watchProactiveRefresh(expiresIn) {
  const waitMs = Math.max(expiresIn * 0.8 * 1000, 5000);
  const { timedOut } = yield race({
    timedOut: delay(waitMs),
    cancelled: take(doLogout.type)
  });
  if (timedOut) {
    yield put(validateToken());
  }
}

export function* refreshTokenSaga() {
  if (getIsRefreshing()) {
    const ch = eventChannel((emit) => {
      enqueueRequest(
        (token) => emit({ token }),
        (err) => emit({ err })
      );
      return () => {};
    });
    let result;
    try {
      result = yield take(ch);
    } finally {
      ch.close();
    }
    if (result?.err) {
      yield put(doLogout());
    }
    return;
  }

  const storedRefreshToken = getDataFromStorage(STORAGE_KEYS.REFRESH_TOKEN, false);
  if (!storedRefreshToken || isTokenExpired(storedRefreshToken)) {
    rejectQueue(new Error('Refresh token expired or missing'));
    yield put(doLogout());
    return;
  }

  setIsRefreshing(true);

  try {
    yield fork(handleAPIRequest, api.refreshTokenApi, { refreshToken: storedRefreshToken });

    const { payload: responsePayload, type } = yield take([
      API_ACTION_TYPE_VARIANTS[ACTION_TYPES.REFRESH_TOKEN][1],
      API_ACTION_TYPE_VARIANTS[ACTION_TYPES.REFRESH_TOKEN][2]
    ]);

    if (type === API_ACTION_TYPE_VARIANTS[ACTION_TYPES.REFRESH_TOKEN][1]) {
      const newToken = get(responsePayload, 'data.token');
      const newRefreshToken = get(responsePayload, 'data.refreshToken');
      const newExpiresIn = get(responsePayload, 'data.expiresIn');

      if (newToken) setDataToStorage(STORAGE_KEYS.AUTH_TOKEN, newToken, false);
      if (newRefreshToken) setDataToStorage(STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken, false);
      if (newExpiresIn) setDataToStorage(STORAGE_KEYS.TOKEN_EXPIRES_IN, String(newExpiresIn), false);

      yield put(LoginActions.setLoginDetails(responsePayload));
      setIsRefreshing(false);
      resolveQueue(newToken);

      if (newExpiresIn) {
        if (proactiveRefreshTask) {
          proactiveRefreshTask.cancel();
        }
        proactiveRefreshTask = yield fork(watchProactiveRefresh, newExpiresIn);
      }
    } else {
      rejectQueue(new Error('Token refresh failed'));
      setIsRefreshing(false);
      yield put(doLogout());
    }
  } finally {
    if (getIsRefreshing()) {
      setIsRefreshing(false);
      // Do NOT rejectQueue here — superseding saga (takeLatest) will resolve/reject the queue
    }
  }
}

export function* fetchStates() {
  yield call(handleAPIRequest, api.fetchStatesApi);
}

export default function* loginSaga() {
  yield all([
    takeLatest(ACTION_TYPES.USER_LOGIN, userLogin),
    takeLatest(ACTION_TYPES.VERIFY_LOGIN_OTP, verifyLoginOtp),
    takeLatest(ACTION_TYPES.RESEND_LOGIN_OTP, resendLoginOtp),
    takeLatest(ACTION_TYPES.SEND_OTP, sendOtp),
    takeLatest(ACTION_TYPES.VERIFY_OTP, verifyOtp),
    takeLatest(ACTION_TYPES.PASSWORD_RESET, resetPassword),
    takeLatest(ACTION_TYPES.FETCH_STATES, fetchStates),
    takeLatest(validateToken.type, refreshTokenSaga),
    takeLatest(doLogout.type, logoutSaga)
  ]);
}
