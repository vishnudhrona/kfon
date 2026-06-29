import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { DEFAULT_HEADERS, REQUEST_METHOD } from '@/constants/api';

const mergeHeaders = (headers, overrides = {}) => {
  Object.entries(overrides).forEach(([key, value]) => {
    headers.set(key, value);
  });
  return headers;
};

const prepareHeaders = (headers, { getState, meta }) => {
  // Set default headers
  mergeHeaders(headers, DEFAULT_HEADERS);

  // Set Authorization from Redux
  const token = getState().auth?.token;
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  // Per-endpoint overrides
  if (meta?.headersOverride) {
    mergeHeaders(headers, meta.headersOverride);
  }

  return headers;
};

export const createBaseApi = ({ reducerPath = 'api', baseUrl = '/api', tagTypes = [] } = {}) =>
  createApi({
    reducerPath,
    baseQuery: fetchBaseQuery({
      baseUrl,
      prepareHeaders
    }),
    tagTypes,
    endpoints: () => ({})
  });

export const createCommonFetchApi =
  (actionVariants) =>
  ({ url, method = REQUEST_METHOD.GET, data = {}, actionType, isErrorToast } = {}) => ({
    url,
    method,
    payload: {
      data,
      types: actionVariants[actionType],
      progressKey: actionType,
      isErrorToast
    }
  });
