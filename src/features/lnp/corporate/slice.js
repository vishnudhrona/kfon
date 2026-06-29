import { createSlice } from '@reduxjs/toolkit';
import { set } from 'lodash-es';

import { ACTION_TYPES, API_ACTION_TYPE_VARIANTS } from './action';
import { STATE_REDUCER_KEY } from './constants';

const initialState = {
  ticket: {
    tableData: []
  }
};

const slice = createSlice({
  initialState,
  name: STATE_REDUCER_KEY,
  extraReducers: (builder) => {
    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_TICKET_TABLE_DATA][1], (state, { payload }) => {
      set(state, 'ticket.tableData', payload);
    });
  }
});

export const { actions, reducer } = slice;
