import { createSlice } from '@reduxjs/toolkit';

import { API_ACTION_TYPE_VARIANTS, API_ACTION_TYPES } from './actions';
import { STATE_REDUCER_KEY } from './constants';

export const initialState = {
  notificationsList: [],
  loading: false
};

const slice = createSlice({
  initialState,
  name: STATE_REDUCER_KEY,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addMatcher(
        (action) => action.type === API_ACTION_TYPE_VARIANTS[API_ACTION_TYPES.FETCH_NOTIFICATIONS][0],
        (state) => {
          state.loading = true;
        }
      )
      .addMatcher(
        (action) => action.type === API_ACTION_TYPE_VARIANTS[API_ACTION_TYPES.FETCH_NOTIFICATIONS][1],
        (state, { payload }) => {
          state.loading = false;
          state.notificationsList = payload?.data || payload || [];
        }
      )
      .addMatcher(
        (action) => action.type === API_ACTION_TYPE_VARIANTS[API_ACTION_TYPES.FETCH_NOTIFICATIONS][2],
        (state) => {
          state.loading = false;
          state.notificationsList = [];
        }
      );
  }
});

export const { actions, reducer } = slice;
