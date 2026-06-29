import { createSlice } from '@reduxjs/toolkit';

import { ACTION_TYPES, API_ACTION_TYPE_VARIANTS } from './action';
import { STATE_REDUCER_KEY } from './constants';

const initialState = {
  tableData: [],
  ticketFormDetails: null
};

const slice = createSlice({
  initialState,
  name: STATE_REDUCER_KEY,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_TICKET_TABLE_DATA][1], (state, { payload }) => {
      state.tableData = payload;
    });

    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.SUBMIT_TICKET_DATA][1], (state, { payload }) => {
      state.ticketFormDetails = payload;
    });
  }
});

export const { actions, reducer } = slice;
