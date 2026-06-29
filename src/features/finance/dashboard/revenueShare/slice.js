import { createSlice } from '@reduxjs/toolkit';
import { set } from 'lodash-es';

import { ACTION_TYPES, API_ACTION_TYPE_VARIANTS } from './action';
import { STATE_REDUCER_KEY } from './constants';

const initialState = {
  formData: {},
  revenueSources: {},
  payableSummary: {},
  partnerShare: {}
};

const slice = createSlice({
  name: STATE_REDUCER_KEY,
  initialState,
  reducers: {
    updateFormData: (state, { payload }) => {
      state.formData = { ...state.formData, ...payload };
    }
  },
  extraReducers: (builder) => {
    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_REVENUE_SOURCES][1], (state, { payload }) => {
      set(state, 'revenueSources', payload);
    });
    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_PAYABLE_SUMMARY][1], (state, { payload }) => {
      set(state, 'payableSummary', payload);
    });
    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_PARTNER_SHARE][1], (state, { payload }) => {
      set(state, 'partnerShare', payload);
    });
  }
});

export const { reducer, actions } = slice;
