import { createSlice } from '@reduxjs/toolkit';
import { set } from 'lodash-es';

import { ACTION_TYPES, API_ACTION_TYPE_VARIANTS } from './action';
import { STATE_REDUCER_KEY } from './constants';

const initialState = {
  formData: {},
  dashboard: {},
  lnpRetail: {},
  lnpEnterprise: {},
  agnpEnterprise: {},
  mspRevenue: {},
  vasProvider: {},
  partnersIncentives: {},
  incentivesSummary: {},
  partnerGstRefund: {},
  revenueControl: {}
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
      .addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_EXPENSE_DASHBOARD][1], (state, { payload }) => {
        set(state, 'dashboard', payload);
      })
      .addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_LNP_RETAIL][1], (state, { payload }) => {
        set(state, 'lnpRetail', payload);
      })
      .addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_LNP_ENTERPRISE][1], (state, { payload }) => {
        set(state, 'lnpEnterprise', payload);
      })
      .addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_AGNP_ENTERPRISE][1], (state, { payload }) => {
        set(state, 'agnpEnterprise', payload);
      })
      .addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_MSP_REVENUE][1], (state, { payload }) => {
        set(state, 'mspRevenue', payload);
      })
      .addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_VAS_PROVIDER][1], (state, { payload }) => {
        set(state, 'vasProvider', payload);
      })
      .addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_PARTNERS_INCENTIVES][1], (state, { payload }) => {
        set(state, 'partnersIncentives', payload);
      })
      .addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_INCENTIVES_SUMMARY][1], (state, { payload }) => {
        set(state, 'incentivesSummary', payload);
      })
      .addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_PARTNER_GST_REFUND][1], (state, { payload }) => {
        set(state, 'partnerGstRefund', payload);
      })
      .addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_REVENUE_CONTROL][1], (state, { payload }) => {
        set(state, 'revenueControl', payload);
      });
  }
});

export const { reducer, actions } = slice;
