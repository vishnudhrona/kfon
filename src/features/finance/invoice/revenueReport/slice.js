import { createSlice } from '@reduxjs/toolkit';
import { set } from 'lodash-es';

import { ACTION_TYPES, API_ACTION_TYPE_VARIANTS } from './action';
import { STATE_REDUCER_KEY } from './constants';

const initialState = {
  formData: {},
  dashboard: {},
  allReports: {},
  br11: {},
  br27: {},
  bySegment: {},
  topCustomers: {}
};

const slice = createSlice({
  name: STATE_REDUCER_KEY,
  initialState,
  reducers: {
    updateFormData: (state, { payload }) => {
      state.formData = { ...state.formData, ...payload };
    },
    clearFormData: (state) => {
      state.formData = {};
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_REVENUE_DASHBOARD][1], (state, { payload }) => {
        set(state, 'dashboard', payload);
      })
      .addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_REVENUE_REPORTS_LIST][1], (state, { payload }) => {
        set(state, 'allReports', payload);
      })
      .addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_BR11_DATA][1], (state, { payload }) => {
        set(state, 'br11', payload);
      })
      .addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_BR27_DATA][1], (state, { payload }) => {
        set(state, 'br27', payload);
      })
      .addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_REVENUE_BY_SEGMENT][1], (state, { payload }) => {
        set(state, 'bySegment', payload);
      })
      .addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_REVENUE_TOP_CUSTOMERS][1], (state, { payload }) => {
        set(state, 'topCustomers', payload);
      });
  }
});

export const { reducer, actions } = slice;
