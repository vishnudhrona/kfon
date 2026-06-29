import { createSlice } from '@reduxjs/toolkit';

import { API_ACTION_TYPE_VARIANTS, API_ACTION_TYPES } from './actions';
import { STATE_REDUCER_KEY } from './constants';

export const initialState = {
  notesList: [],
  allRoles: [],
  usersByRoleId: [],
  fileViewUrl: null,
  forwardedNotes: []
};

const slice = createSlice({
  initialState,
  name: STATE_REDUCER_KEY,
  reducers: {
    clearFileViewUrl: (state) => {
      state.fileViewUrl = null;
    },
    clearNotesList: (state) => {
      state.notesList = [];
    }
  },
  extraReducers: (builder) => {
    const successMappings = {
      [API_ACTION_TYPES.FETCH_NOTES]: 'notesList',
      [API_ACTION_TYPES.FETCH_ALL_ROLES]: 'allRoles',
      [API_ACTION_TYPES.FETCH_USERS_BY_ROLE_ID]: 'usersByRoleId',
      [API_ACTION_TYPES.FETCH_FILE_VIEW_URL]: 'fileViewUrl',
      [API_ACTION_TYPES.FETCH_FORWARDED_NOTES]: 'forwardedNotes'
    };

    Object.entries(successMappings).forEach(([actionType, stateKey]) => {
      builder.addMatcher(
        (action) => action.type.endsWith(API_ACTION_TYPE_VARIANTS[actionType][1]),
        (state, { payload }) => {
          state[stateKey] = payload?.data || payload;
        }
      );
    });
  }
});

export const { actions, reducer } = slice;
