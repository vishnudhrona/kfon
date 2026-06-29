import { createAction } from '@reduxjs/toolkit';
import { get, isEmpty } from 'lodash-es';
import {
  all, call, fork, put, select, take, takeEvery, takeLatest
} from 'redux-saga/effects';

import { showToast } from '@/components/custom/Toast';
import { FILE_RESPONSE_TYPE } from '@/constants/file';
import { generateLocalURLFromBlob } from '@/utils/fileUtils';
import { handleAPIRequest } from '@/utils/httpUtils';

import { ACTION_TYPES } from './actions';
import * as api from './api';
import { STATE_REDUCER_KEY } from './constants';
import { getDownloads } from './selectors';
import { actions as sliceActions } from './slice';


function* singleDocument(data, name, isDownload) {
  const { url: fileUrl, ext } = data;
  const fileName = `${name}.${ext}`;
  if (isDownload) {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
  } else {
    yield put(sliceActions.setDocument({ [name]: data }));
    const dispatchDocumentAction = createAction(`${STATE_REDUCER_KEY}/${name.toUpperCase()}/DISPATCH_COMMON_DOCUMENT`);
    yield put(dispatchDocumentAction({ [name]: data }));
  }
}

function* multipleDocument(data, name) {
  const newPayload = data?.map(({ blob, type: fileType, ...rest }) => {
    return {
      ...rest,
      ...generateLocalURLFromBlob(blob, fileType)
    };
  });
  const dispatchDocumentAction = createAction(`${STATE_REDUCER_KEY}/${name.toUpperCase()}/DISPATCH_COMMON_DOCUMENT`);
  yield put(dispatchDocumentAction({ [name]: newPayload }));
}

function* downloadFromLocal({ payload }) {
  const { data, name, isDownload } = payload;
  yield* singleDocument(data, name, isDownload);
}

const validateRequest = ({
  name, url, method, responseType
}) => {
  let validRequest = true;

  if (isEmpty(name) || isEmpty(url) || isEmpty(responseType) || isEmpty(method)) {
    validRequest = false;
  }

  return validRequest;
};

/**
 * Generates a generator function that fetches a document.
 *
 * @param {object} payload - The payload object.
 * @param {string} payload.name - The name of the document to fetch. Defaults to 'download'.
 * @param {array} payload.types - An array of action types for tracking
 *                  the fetch document request, success, and failure.
 * @param {boolean} payload.isDownload - A flag indicating whether
 *                  the document should be downloaded.
 * @param {object} payload.rest - Additional properties to be passed to the API request.
 * @return {undefined}
 */

export function* fetchDocument({ payload }) {
  if (validateRequest(payload)) {
    const { name = 'download', isList = false, enableCache = false } = payload;
    let isApiCallEnabled = true;
    const {
      types = [
        `${STATE_REDUCER_KEY}/${name.toUpperCase()}/FETCH_DOCUMENT_REQUEST`,
        `${STATE_REDUCER_KEY}/${name.toUpperCase()}/FETCH_DOCUMENT_SUCCESS`,
        `${STATE_REDUCER_KEY}/${name.toUpperCase()}/FETCH_DOCUMENT_FAILURE`
      ],
      isDownload = false,
      responseType = FILE_RESPONSE_TYPE.STREAM,
      ...rest
    } = payload;

    if (enableCache) {
      const downloads = yield select(getDownloads);
      const selectedDocument = get(downloads, name, {});
      if (!isEmpty(selectedDocument)) {
        isApiCallEnabled = false;
      }
    }

    if (isApiCallEnabled) {
      yield fork(handleAPIRequest, api.fetchDocument, {
        types, responseType, isDocument: !isList, ...rest
      });
      const {
        payload: {
          isLoading: startLoading,
          status: statusProgress
        } = {}
      } = yield take([types[0]]);
      yield put(sliceActions.setDocumentStatus({
        key: name,
        value: { isLoading: startLoading, status: statusProgress }
      }));
      const { payload: { data, isLoading, status } = {}, type } = yield take([
        types[1],
        types[2]]);
      yield put(sliceActions.setDocumentStatus({
        key: name,
        value: { isLoading, status }
      }));

      if (type === types[1]) {
        if (isList) {
          yield* multipleDocument(data, name);
        } else {
          yield* singleDocument(data, name, isDownload);
        }
      }
    }
  } else {
    yield call(showToast, {
      id: 'DOC-DOWNLOAD', status: 'info', title: 'Document Fetch is blocked', description: 'Minimum parameters are not available for fetching the document'
    });
  }
}

function* downloadDocument({ payload }) {
  yield* fetchDocument({
    payload: {
      isDownload: true,
      ...payload
    }
  });
}

export default function* downloadSaga() {
  yield all([
    takeEvery(ACTION_TYPES.FETCH_DOCUMENT, fetchDocument),
    takeLatest(ACTION_TYPES.DOWNLOAD_DOCUMENT, downloadDocument),
    takeLatest(ACTION_TYPES.DOWNLOAD_DOCUMENT_FROM_URL, downloadFromLocal)
  ]);
}
