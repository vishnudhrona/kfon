import { createSlice } from '@reduxjs/toolkit';
import { set } from 'lodash-es';

import { ACTION_TYPES, API_ACTION_TYPE_VARIANTS } from './action';
import { STATE_REDUCER_KEY } from './constants';

const initialState = {
  inventory: {
    tableData: []
  },
  devicePartner: {
    tableData: []
  }
};

const slice = createSlice({
  initialState,
  name: STATE_REDUCER_KEY,
  extraReducers: (builder) => {
    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_DEVICELIST_TABLE_DATA][1], (state, { payload }) => {
        set(state, 'inventory.tableData', payload);
    });
    
    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_DEVICE_PARTNER_TABLE_DATA][1], (state, { payload }) => {
        set(state, 'devicePartner.tableData', payload);
    });
  }
});

export const { actions, reducer } = slice;