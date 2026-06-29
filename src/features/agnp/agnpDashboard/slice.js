import { createSlice } from '@reduxjs/toolkit';
import { set } from 'lodash-es';

import { ACTION_TYPES, API_ACTION_TYPE_VARIANTS } from './action';
import { STATE_REDUCER_KEY } from './constants';

const initialState = {
  dashboard: {
    tableData: [],
    cardData: []
  }
};

const slice = createSlice({
  initialState,
  name: STATE_REDUCER_KEY,
  extraReducers: (builder) => {
    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_DASHBOARD_TABLE_DATA][2], (state, { payload }) => {
        set(state, 'dashboard.tableData', payload);
    });
    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_DASHBOARD_TABLE_DATA][1], (state, { payload }) => {
        set(state, 'dashboard.tableData', payload);
    });
    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_DASHBOARD_CARD_DATA][2], (state, { payload }) => {
        set(state, 'dashboard.cardData', payload)
    });
    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_DASHBOARD_CARD_DATA][1], (state, { payload }) => {
        set(state, 'dashboard.cardData', payload)
    })
  }
});

export const { actions, reducer } = slice;
