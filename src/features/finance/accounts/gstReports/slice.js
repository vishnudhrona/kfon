import { createSlice } from '@reduxjs/toolkit';
import { set } from 'lodash-es';

import { ACTION_TYPES, API_ACTION_TYPE_VARIANTS } from './action';
import { STATE_REDUCER_KEY } from './constants';

const initialState = {
  gstReports: {
    formData: {}
  },
  gstr2aRefund: {},
  gstr1Report: {},
  b2bInvoices: {}
};

const slice = createSlice({
  name: STATE_REDUCER_KEY,
  initialState,
  reducers: {
    updateFormData: (state, { payload }) => {
      state.gstReports.formData = {
        ...state.gstReports.formData,
        ...payload
      };
    }
  },
  extraReducers: (builder) => {
    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_GSTR2A_REFUND][1], (state, { payload }) => {
      set(state, 'gstr2aRefund', payload);
    });
    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_GSTR1_REPORT][1], (state, { payload }) => {
      set(state, 'gstr1Report', payload);
    });
    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_B2B_INVOICES][1], (state, { payload }) => {
      set(state, 'b2bInvoices', payload);
    });
  }
});

export const { reducer, actions } = slice;
