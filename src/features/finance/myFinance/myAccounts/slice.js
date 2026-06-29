import { createSlice } from '@reduxjs/toolkit';

import { STATE_REDUCER_KEY } from './constants';

const initialState = {
  formData: {},
  accountBalance: 0
};

const slice = createSlice({
  name: STATE_REDUCER_KEY,
  initialState,
  reducers: {
    updateFormData: (state, { payload }) => {
      state.formData = {
        ...state.formData,
        ...payload
      };
    },
    setTableData: (state, { payload: { tableKey, data } }) => {
      state.formData[tableKey] = data;
    },
    setAccountBalance: (state, { payload }) => {
      state.accountBalance = payload;
    }
  }
});

export const { reducer, actions } = slice;
