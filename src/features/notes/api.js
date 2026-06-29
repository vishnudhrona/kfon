import { MULTI_PART_FORM_HEADER, REQUEST_METHOD } from '@/constants/api';
import { API_URL } from '@/constants/urls';

import { API_ACTION_TYPE_VARIANTS, API_ACTION_TYPES } from './actions';

export const fetchNotesApi = ({ moduleId } = {}) => ({
  url: `${API_URL.NOTES.FETCH}?moduleId=${moduleId}`,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[API_ACTION_TYPES.FETCH_NOTES],
    progressKey: API_ACTION_TYPES.FETCH_NOTES
  }
});

export const fetchForwardedNotesApi = ({ userId } = {}) => ({
  url: `${API_URL.NOTES.FETCH}?forwardedUserId=${userId}`,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[API_ACTION_TYPES.FETCH_FORWARDED_NOTES],
    progressKey: API_ACTION_TYPES.FETCH_FORWARDED_NOTES
  }
});

export const createNoteApi = ({ file, request } = {}) => {
  const { moduleId, moduleName, subModule, note, status, visibility } = request || {};
  const params = new URLSearchParams();
  if (moduleId) params.append('moduleId', moduleId);
  if (moduleName) params.append('moduleName', moduleName);
  if (subModule) params.append('subModule', subModule);
  if (note) params.append('note', note);
  if (status) params.append('status', status);
  if (visibility) params.append('visibility', visibility);
  const formData = new FormData();
  if (file) formData.append('file', file);
  return {
    url: `${API_URL.NOTES.CREATE}?${params.toString()}`,
    method: REQUEST_METHOD.POST,
    payload: {
      types: API_ACTION_TYPE_VARIANTS[API_ACTION_TYPES.CREATE_NOTE],
      data: formData,
      headers: MULTI_PART_FORM_HEADER,
      progressKey: API_ACTION_TYPES.CREATE_NOTE
    }
  };
};

export const forwardNoteApi = ({ file, request } = {}) => {
  const { moduleId, moduleName, subModule, note, forwardedUserId, status, visibility } = request || {};
  const params = new URLSearchParams();
  if (moduleId) params.append('moduleId', moduleId);
  if (moduleName) params.append('moduleName', moduleName);
  if (subModule) params.append('subModule', subModule);
  if (note) params.append('note', note);
  if (forwardedUserId) params.append('forwardedUserId', forwardedUserId);
  if (status) params.append('status', status);
  if (visibility) params.append('visibility', visibility);
  const formData = new FormData();
  if (file) formData.append('file', file);
  return {
    url: `${API_URL.NOTES.CREATE}?${params.toString()}`,
    method: REQUEST_METHOD.POST,
    payload: {
      types: API_ACTION_TYPE_VARIANTS[API_ACTION_TYPES.FORWARD_NOTE],
      data: formData,
      headers: MULTI_PART_FORM_HEADER,
      progressKey: API_ACTION_TYPES.FORWARD_NOTE
    }
  };
};

export const fetchAllRolesApi = () => ({
  url: API_URL.COMMON.FETCH_ALL_ROLES,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[API_ACTION_TYPES.FETCH_ALL_ROLES],
    progressKey: API_ACTION_TYPES.FETCH_ALL_ROLES
  }
});

export const fetchUsersByRoleIdApi = ({ roleId } = {}) => ({
  url: API_URL.CORPORATE.ENQUIRY.ROLE_USERS,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[API_ACTION_TYPES.FETCH_USERS_BY_ROLE_ID],
    params: { roleId },
    progressKey: API_ACTION_TYPES.FETCH_USERS_BY_ROLE_ID
  }
});

export const markNoteViewedApi = ({ noteId } = {}) => ({
  url: API_URL.NOTES.MARK_VIEWED.replace(':noteId', noteId),
  method: REQUEST_METHOD.PATCH,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[API_ACTION_TYPES.MARK_NOTE_VIEWED],
    progressKey: API_ACTION_TYPES.MARK_NOTE_VIEWED
  }
});

export const fetchFileViewUrlApi = ({ fileId } = {}) => ({
  url: API_URL.NOTES.FILE_VIEW_URL.replace(':fileId', fileId),
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[API_ACTION_TYPES.FETCH_FILE_VIEW_URL],
    progressKey: API_ACTION_TYPES.FETCH_FILE_VIEW_URL
  }
});
