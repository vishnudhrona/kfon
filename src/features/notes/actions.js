import { createAction } from '@reduxjs/toolkit';

import { generateActionTypeVariants } from '@/utils/actionUtils';

import { STATE_REDUCER_KEY } from './constants';

export const API_ACTION_TYPES = {
  FETCH_NOTES: `${STATE_REDUCER_KEY}/FETCH_NOTES`,
  CREATE_NOTE: `${STATE_REDUCER_KEY}/CREATE_NOTE`,
  FORWARD_NOTE: `${STATE_REDUCER_KEY}/FORWARD_NOTE`,
  FETCH_ALL_ROLES: `${STATE_REDUCER_KEY}/FETCH_ALL_ROLES`,
  FETCH_USERS_BY_ROLE_ID: `${STATE_REDUCER_KEY}/FETCH_USERS_BY_ROLE_ID`,
  FETCH_FILE_VIEW_URL: `${STATE_REDUCER_KEY}/FETCH_FILE_VIEW_URL`,
  FETCH_FORWARDED_NOTES: `${STATE_REDUCER_KEY}/FETCH_FORWARDED_NOTES`,
  MARK_NOTE_VIEWED: `${STATE_REDUCER_KEY}/MARK_NOTE_VIEWED`
};

export const API_ACTION_TYPE_VARIANTS = generateActionTypeVariants(API_ACTION_TYPES);

export const fetchNotes = createAction(API_ACTION_TYPES.FETCH_NOTES);
export const createNote = createAction(API_ACTION_TYPES.CREATE_NOTE);
export const forwardNote = createAction(API_ACTION_TYPES.FORWARD_NOTE);
export const fetchAllRoles = createAction(API_ACTION_TYPES.FETCH_ALL_ROLES);
export const fetchUsersByRoleId = createAction(API_ACTION_TYPES.FETCH_USERS_BY_ROLE_ID);
export const fetchFileViewUrl = createAction(API_ACTION_TYPES.FETCH_FILE_VIEW_URL);
export const fetchForwardedNotes = createAction(API_ACTION_TYPES.FETCH_FORWARDED_NOTES);
export const markNoteViewed = createAction(API_ACTION_TYPES.MARK_NOTE_VIEWED);
