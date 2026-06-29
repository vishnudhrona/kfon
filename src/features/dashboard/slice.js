import { createSlice } from '@reduxjs/toolkit';
import { set } from 'lodash-es';

import { ACTION_TYPES, API_ACTION_TYPE_VARIANTS } from './action';
import { STATE_REDUCER_KEY } from './constants';

const initialState = {
  dashBoardData: {},
  lnpDashboardData: {}
};

const slice = createSlice({
  initialState,
  name: STATE_REDUCER_KEY,
  reducers: {},

  extraReducers: (builder) => {
    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_DASHBOARD_DETAILS][1], (state, { payload }) => {
      set(state, 'dashBoardData', payload);
    });
    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_LNP_DASHBOARD_DETAILS][1], (state, { payload }) => {
      set(state, 'lnpDashboardData', payload);
    });
  }
});

export const { actions, reducer } = slice;
