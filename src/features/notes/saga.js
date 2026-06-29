import { t } from 'i18next';
import { all, call, fork, take, takeLatest } from 'redux-saga/effects';

import { successToast } from '@/components/custom/Toast';
import { handleAPIRequest } from '@/utils/httpUtils';

import { API_ACTION_TYPE_VARIANTS, API_ACTION_TYPES } from './actions';
import * as api from './api';

function* createSaga(payload, apiFn, actionType, onSuccess) {
  yield fork(handleAPIRequest, apiFn, payload);

  const { payload: { message = '' } = {}, type } = yield take([
    API_ACTION_TYPE_VARIANTS[actionType][1],
    API_ACTION_TYPE_VARIANTS[actionType][2]
  ]);

  if (type === API_ACTION_TYPE_VARIANTS[actionType][1]) {
    yield call(successToast, { title: 'success', description: message || t('saveSuccess') });
    if (onSuccess) {
      yield call(onSuccess);
    }
    return true;
  }
}

function* fetchNotes(action) {
  yield call(handleAPIRequest, api.fetchNotesApi, action.payload);
}

function* fetchForwardedNotes(action) {
  yield call(handleAPIRequest, api.fetchForwardedNotesApi, action.payload);
}

function* createNote(action) {
  const { onSuccess, attachment, ...request } = action.payload;
  yield* createSaga({ file: attachment, request }, api.createNoteApi, API_ACTION_TYPES.CREATE_NOTE, onSuccess);
}

function* forwardNote(action) {
  const { onSuccess, attachment, ...request } = action.payload;
  yield* createSaga({ file: attachment, request }, api.forwardNoteApi, API_ACTION_TYPES.FORWARD_NOTE, onSuccess);
}

function* fetchAllRoles() {
  yield call(handleAPIRequest, api.fetchAllRolesApi);
}

function* fetchUsersByRoleId(action) {
  yield call(handleAPIRequest, api.fetchUsersByRoleIdApi, action.payload);
}

function* fetchFileViewUrl(action) {
  yield call(handleAPIRequest, api.fetchFileViewUrlApi, action.payload);
}

function* markNoteViewed(action) {
  yield call(handleAPIRequest, api.markNoteViewedApi, action.payload);
}

export default function* notesSaga() {
  yield all([
    takeLatest(API_ACTION_TYPES.FETCH_NOTES, fetchNotes),
    takeLatest(API_ACTION_TYPES.FETCH_FORWARDED_NOTES, fetchForwardedNotes),
    takeLatest(API_ACTION_TYPES.CREATE_NOTE, createNote),
    takeLatest(API_ACTION_TYPES.FORWARD_NOTE, forwardNote),
    takeLatest(API_ACTION_TYPES.FETCH_ALL_ROLES, fetchAllRoles),
    takeLatest(API_ACTION_TYPES.FETCH_USERS_BY_ROLE_ID, fetchUsersByRoleId),
    takeLatest(API_ACTION_TYPES.FETCH_FILE_VIEW_URL, fetchFileViewUrl),
    takeLatest(API_ACTION_TYPES.MARK_NOTE_VIEWED, markNoteViewed)
  ]);
}
