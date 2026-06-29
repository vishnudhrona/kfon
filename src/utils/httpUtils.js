import { createAction } from '@reduxjs/toolkit';
import { t } from 'i18next';
import { has, isEmpty, isObject, set } from 'lodash-es';
import queryString from 'query-string';
import { eventChannel } from 'redux-saga';
import { call, put, select, take } from 'redux-saga/effects';

import { deleteRequest, getRequest, patchRequest, postRequest, putRequest } from '@/app/axios';
import { errorToast } from '@/components/custom/Toast';
import { STORAGE_KEYS } from '@/constants';
import { API_STATUS, HTTP_HEADERS, REQUEST_METHOD } from '@/constants/api';
import { FILE_RESPONSE_TYPE } from '@/constants/file';
import { POPUP_TEMPLATES } from '@/constants/popup';
import { actions as apiProgressActions } from '@/features/others/ApiProgress/slice';
import { doLogout, validateToken } from '@/features/others/common/actions';
import { getCommonConfigSelector } from '@/features/others/common/projectSelectors';
import { actions as commonSliceActions } from '@/features/others/common/slice';

import { getDataFromStorage } from './encryptionUtils';
import {
  downloadFileFromBlobResponse,
  getFileDetailsFromBlob,
  getFileDetailsFromStream,
  getFileNameFromHeaders
} from './fileUtils';
import { isTokenExpired } from './jwtUtils';
import { enqueueRequest, getIsRefreshing } from './refreshLock';

// export const baseApiURL = import.meta.env.VITE_API_BASE_URL;

// const apiStatus = new ApiStatus();

const getApiMethod = (method) => {
  switch (method) {
    case REQUEST_METHOD.DELETE:
      return deleteRequest;
    case REQUEST_METHOD.PUT:
      return putRequest;
    case REQUEST_METHOD.PATCH:
      return patchRequest;
    case REQUEST_METHOD.POST:
      return postRequest;
    default:
      return getRequest;
  }
};

const getRequestParams = ({
  data: requestData = {},
  params: requestParams = {},
  method,
  commonConfig,
  bearerToken,
  customHeaders: tempHeaders = {}
}) => {
  let params = {};
  let data = {};
  const headers = { ...HTTP_HEADERS };

  if (method === REQUEST_METHOD.DELETE || method === REQUEST_METHOD.GET) {
    params = { ...requestData, ...requestParams };
    data = {};
  } else {
    params = requestParams;
    data = requestData;
  }
  let baseURL = import.meta.env.VITE_API_BASE_URL;
  let authHeaders = {};

  if (bearerToken) {
    authHeaders = { Authorization: `Bearer ${bearerToken}` };
  }

  const customHeaders = {
    'X-LANGUAGE': commonConfig.locale,
    ...tempHeaders
  };

  // if (import.meta.env.MODE === 'development') {
  //   baseURL = '';
  // }

  return {
    config: {
      headers: {
        ...headers,
        ...authHeaders,
        ...customHeaders
      },
      params,
      paramsSerializer: (details) => queryString.stringify(details, { encode: false })
    },
    baseURL,
    data,
    api: getApiMethod(method)
  };
};

function* invokeApi(method, url, payload, isGuest = false) {
  const {
    types = ['REQUEST', 'SUCCESS', 'FAILURE'],
    data: payloadData,
    params = {},
    headers = {},
    isDocument = false,
    documentType = FILE_RESPONSE_TYPE.STREAM,
    progressKey,
    isErrorToast = true,
    fileName: customFileName
  } = payload;
  const requestAction = createAction(types[0]);
  const successAction = createAction(types[1]);
  const failureAction = createAction(types[2]);

  const commonConfig = yield select(getCommonConfigSelector);

  const bearerToken = getDataFromStorage(STORAGE_KEYS.AUTH_TOKEN, false);
  if (!isGuest && isEmpty(bearerToken)) {
    yield put(doLogout());
    return { response: {}, error: {} };
  }
  const { api, config, baseURL, data } = getRequestParams({
    url,
    data: payloadData,
    params,
    method,
    commonConfig,
    customHeaders: headers,
    bearerToken: isGuest && isTokenExpired(bearerToken) ? undefined : bearerToken
  });

  if (isDocument) {
    const streamConfig = config.headers;
    delete streamConfig.Accept;
    if (documentType === FILE_RESPONSE_TYPE.BLOB) {
      set(config, 'responseType', 'blob');
    }
    if (documentType === FILE_RESPONSE_TYPE.STREAM) {
      set(config, 'responseType', 'arraybuffer');
    }
    set(config, 'headers', streamConfig);
  }

  yield put(requestAction({ isLoading: true, status: API_STATUS.PROGRESS }));
  if (progressKey) {
    yield put(apiProgressActions.setProgress({ key: progressKey, isLoading: true }));
  }

  function* handleCustomErrorNotifications(customError) {
    const { title = 'Error Occurred', description = '', isToast = false, type: status = 'error' } = customError;
    if (isToast) {
      const errorMessage = { title, description, type: status };
      yield call(errorToast, { id: 'ERROR_CUSTOM', ...errorMessage });
    } else {
      yield put(
        commonSliceActions.changeCommonPopupData({
          data: {
            heading: title,
            content: description,
            template: POPUP_TEMPLATES.COMMON_WITH_STATUS,
            status
          }
        })
      );
      yield put(commonSliceActions.changeCommonPopupStatus({ isActive: true }));
    }
  }

  const apiResponse = yield call(api, url, { config, baseURL, data });
  const { data: response, error } = apiResponse;
  if (error) {
    const {
      code,
      message = 'Please try again after some time.',
      response: { data: customErrorResponse, status } = {}
    } = error;
    yield put(
      failureAction({
        error: { code, message, customErrorResponse, status },
        isLoading: false,
        status: API_STATUS.FAILURE
      })
    );
    if (progressKey) {
      yield put(apiProgressActions.setProgress({ key: progressKey, isLoading: false }));
    }
    let toastStatus = 'error';
    let description = isObject(customErrorResponse)
      ? customErrorResponse.error || message
      : customErrorResponse || message;
    if (status === 400 || status === 409) {
      description = customErrorResponse.message;
    } else if (status === 401) {
      if (!isGuest) {
        if (!getIsRefreshing()) {
          yield put(validateToken());
        }
        let retryResult;
        const retryChannel = eventChannel((emit) => {
          enqueueRequest(
            (token) => emit({ token }),
            (err) => emit({ err })
          );
          return () => {};
        });
        try {
          retryResult = yield take(retryChannel);
        } finally {
          retryChannel.close();
        }

        if (retryResult?.token) {
          const retryConfig = {
            ...config,
            headers: {
              ...config.headers,
              Authorization: `Bearer ${retryResult.token}`
            }
          };
          const retryResponse = yield call(api, url, { config: retryConfig, baseURL, data });
          if (retryResponse?.data && !retryResponse.error) {
            let retryPayLoad = {};
            const retryData = retryResponse.data;
            if (has(retryData, 'payload')) {
              retryPayLoad = { data: retryData.payload, message: retryData.message };
            } else if (has(retryData, 'data')) {
              retryPayLoad = { data: retryData.data, message: retryData.message };
            } else {
              retryPayLoad = { data: retryData, message: retryData.message };
            }
            yield put(successAction({ ...retryPayLoad, isLoading: false, status: API_STATUS.SUCCESS }));
            if (progressKey) {
              yield put(apiProgressActions.setProgress({ key: progressKey, isLoading: false }));
            }
            return { response: retryResponse.data, error: null };
          } else {
            yield put(doLogout());
            return { response: {}, error: {} };
          }
        } else {
          yield put(doLogout());
          return { response: {}, error: {} };
        }
      }
      description = customErrorResponse?.message;
    } else if (status === 404) {
      description = error?.response?.data?.message || t('error.unableToLoadData');
      toastStatus = 'warning';
    }
    if (code === 'ERR_NETWORK') {
      description = t('error.somethingUnexpected');
    }
    const errorMessage = { description, type: toastStatus };
    if (isErrorToast) {
      yield call(errorToast, { id: 'ERROR_PRIMARY', ...errorMessage });
    }
  } else if (has(response, 'error') && !isEmpty(response.error)) {
    const customError = response.error || {};
    yield put(
      failureAction({
        error: customError,
        isLoading: false,
        status: API_STATUS.FAILURE
      })
    );
    if (progressKey) {
      yield put(apiProgressActions.setProgress({ key: progressKey, isLoading: false }));
    }
    yield* handleCustomErrorNotifications(customError);
  } else {
    let responsePayLoad = {};
    if (isDocument) {
      responsePayLoad = {
        data:
          documentType === FILE_RESPONSE_TYPE.BLOB || documentType === FILE_RESPONSE_TYPE.EDCR_BLOB
            ? getFileDetailsFromBlob(response)
            : getFileDetailsFromStream(response)
      };
    } else {
      // Handle different API response structures:
      // 1. If response has 'payload' field, extract it
      // 2. If response has 'data' field, extract it
      // 3. Otherwise, the response object itself is the data
      if (has(response, 'payload')) {
        responsePayLoad = {
          data: response.payload,
          message: response.message
        };
      } else if (has(response, 'data')) {
        responsePayLoad = {
          data: response.data,
          message: response.message
        };
      } else {
        // The response object itself is the data
        responsePayLoad = {
          data: response,
          message: response.message
        };
      }
    }
    yield put(
      successAction({
        ...responsePayLoad,
        isLoading: false,
        status: API_STATUS.SUCCESS
      })
    );
    if (progressKey) {
      yield put(apiProgressActions.setProgress({ key: progressKey, isLoading: false }));
    }
    if (isDocument) {
      const fileName = customFileName || getFileNameFromHeaders(apiResponse.headers);
      downloadFileFromBlobResponse(response, fileName);
    }
  }

  return { response, error };
}

export function* handleAPIRequest(apiFn, ...rest) {
  const { method, url, payload, guestAccess } = apiFn(...rest);
  try {
    return yield call(invokeApi, method, url, payload, guestAccess);
  } catch (error) {
    console.error(error);
    // Always return the {response, error} shape so callers can safely destructure.
    return { response: undefined, error };
  }
}
