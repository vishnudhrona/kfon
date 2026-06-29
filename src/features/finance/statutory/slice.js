import { createSlice } from '@reduxjs/toolkit';
import { set } from 'lodash-es';

import { ACTION_TYPES, API_ACTION_TYPE_VARIANTS } from './action';
import { STATE_REDUCER_KEY } from './constants';

const initialState = {
  statutory: {
    formData: {}
  },
  revenueControl: {},
  gstr2aPartners: {},
  gstr1RetailCorporate: {},
  subInvoiceB2B: {},
  subInvoiceB2CRetails: {},
  subInvoiceB2BCorporate: {},
  subInvoiceB2CCorporate: {},
  nldReport: {},
  agrReport: {}
};

const slice = createSlice({
  name: STATE_REDUCER_KEY,
  initialState,
  reducers: {
    updateFormData: (state, { payload }) => {
      state.statutory.formData = {
        ...state.statutory.formData,
        ...payload
      };
    }
  },
  extraReducers: (builder) => {
    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_REVENUE_CONTROL][1], (state, { payload }) => {
      set(state, 'revenueControl', payload);
    });
    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_GSTR2A_PARTNERS][1], (state, { payload }) => {
      set(state, 'gstr2aPartners', payload);
    });
    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_GSTR1_RETAIL_CORPORATE][1], (state, { payload }) => {
      set(state, 'gstr1RetailCorporate', payload);
    });
    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_SUB_INVOICE_B2B][1], (state, { payload }) => {
      set(state, 'subInvoiceB2B', payload);
    });
    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_SUB_INVOICE_B2C_RETAILS][1], (state, { payload }) => {
      set(state, 'subInvoiceB2CRetails', payload);
    });
    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_SUB_INVOICE_B2B_CORPORATE][1], (state, { payload }) => {
      set(state, 'subInvoiceB2BCorporate', payload);
    });
    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_SUB_INVOICE_B2C_CORPORATE][1], (state, { payload }) => {
      set(state, 'subInvoiceB2CCorporate', payload);
    });
    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_NLD_REPORT][1], (state, { payload }) => {
      set(state, 'nldReport', payload);
    });
    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_AGR_REPORT][1], (state, { payload }) => {
      set(state, 'agrReport', payload);
    });
  }
});

export const { reducer, actions } = slice;
