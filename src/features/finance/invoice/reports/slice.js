import { createSlice } from '@reduxjs/toolkit';
import { set } from 'lodash-es';

import { ACTION_TYPES, API_ACTION_TYPE_VARIANTS } from './action';
import { STATE_REDUCER_KEY } from './constants';

const initialState = {
  invoiceReports: {
    formData: {}
  },
  lnpSummaryDetails: {},
  lnpSummaryCorporate: {},
  gstinStatusLnp: {},
  subscriberSummaryDetails: {},
  lnpSpecialIncentive: {},
  agnpSummary: {},
  invoiceWiseAgeingReport: {},
  invoicePaymentReport: {},
  retentionIncentiveReport: {},
  corporateCustomerPayment: {},
  corporateInvoicePayment: {}
};

const slice = createSlice({
  name: STATE_REDUCER_KEY,
  initialState,
  reducers: {
    updateFormData: (state, { payload }) => {
      state.invoiceReports.formData = {
        ...state.invoiceReports.formData,
        ...payload
      };
    }
  },
  extraReducers: (builder) => {
    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_LNP_SUMMARY_DETAILS][1], (state, { payload }) => {
      set(state, 'lnpSummaryDetails', payload);
    });
    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_LNP_SUMMARY_CORPORATE][1], (state, { payload }) => {
      set(state, 'lnpSummaryCorporate', payload);
    });
    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_GSTIN_STATUS_LNP][1], (state, { payload }) => {
      set(state, 'gstinStatusLnp', payload);
    });
    builder.addCase(
      API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_SUBSCRIBER_SUMMARY_DETAILS][1],
      (state, { payload }) => {
        set(state, 'subscriberSummaryDetails', payload);
      }
    );
    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_LNP_SPECIAL_INCENTIVE][1], (state, { payload }) => {
      set(state, 'lnpSpecialIncentive', payload);
    });
    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_AGNP_SUMMARY][1], (state, { payload }) => {
      set(state, 'agnpSummary', payload);
    });
    builder.addCase(
      API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_INVOICE_WISE_AGEING_REPORT][1],
      (state, { payload }) => {
        set(state, 'invoiceWiseAgeingReport', payload);
      }
    );
    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_INVOICE_PAYMENT_REPORT][1], (state, { payload }) => {
      set(state, 'invoicePaymentReport', payload);
    });
    builder.addCase(
      API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_RETENTION_INCENTIVE_REPORT][1],
      (state, { payload }) => {
        set(state, 'retentionIncentiveReport', payload);
      }
    );
    builder.addCase(
      API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_CORPORATE_CUSTOMER_PAYMENT][1],
      (state, { payload }) => {
        set(state, 'corporateCustomerPayment', payload);
      }
    );
    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_CORPORATE_INVOICE_PAYMENT][1], (state, { payload }) => {
      set(state, 'corporateInvoicePayment', payload);
    });
  }
});

export const { reducer, actions } = slice;
