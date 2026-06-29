import { createSlice } from '@reduxjs/toolkit';
import { set } from 'lodash-es';

import { ACTION_TYPES, API_ACTION_TYPE_VARIANTS } from './action';
import { STATE_REDUCER_KEY } from './constants';

const initialState = {
  invoiceDetails: {
    formData: {}
  },
  agnpCorporateInvoice: {},
  agnpRetailInvoice: {},
  eoSubscriberInvoice: {},
  lnpCorporateInvoice: {},
  lnpCorporateOtcInvoice: {},
  lnpRetailInvoice: {},
  mspBuOeInvoice: {},
  mspCorporateInvoice: {},
  ontPurchaseInvoice: {},
  ottProviderInvoice: {},
  subscriberBplInvoice: {},
  subscriberInvoiceReports: {}
};

const slice = createSlice({
  name: STATE_REDUCER_KEY,
  initialState,
  reducers: {
    updateFormData: (state, { payload }) => {
      state.invoiceDetails.formData = {
        ...state.invoiceDetails.formData,
        ...payload
      };
    }
  },
  extraReducers: (builder) => {
    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_AGNP_CORPORATE_INVOICE][1], (state, { payload }) => {
      set(state, 'agnpCorporateInvoice', payload);
    });

    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_AGNP_RETAIL_INVOICE][1], (state, { payload }) => {
      set(state, 'agnpRetailInvoice', payload);
    });
    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_EO_SUBSCRIBER_INVOICE][1], (state, { payload }) => {
      set(state, 'eoSubscriberInvoice', payload);
    });
    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_LNP_CORPORATE_INVOICE][1], (state, { payload }) => {
      set(state, 'lnpCorporateInvoice', payload);
    });
    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_LNP_CORPORATE_OTC_INVOICE][1], (state, { payload }) => {
      set(state, 'lnpCorporateOtcInvoice', payload);
    });
    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_LNP_RETAIL_INVOICE][1], (state, { payload }) => {
      set(state, 'lnpRetailInvoice', payload);
    });
    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_MSP_BU_OE_INVOICE][1], (state, { payload }) => {
      set(state, 'mspBuOeInvoice', payload);
    });
    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_MSP_CORPORATE_INVOICE][1], (state, { payload }) => {
      set(state, 'mspCorporateInvoice', payload);
    });
    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_ONT_PURCHASE_INVOICE][1], (state, { payload }) => {
      set(state, 'ontPurchaseInvoice', payload);
    });
    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_OTT_PROVIDER_INVOICE][1], (state, { payload }) => {
      set(state, 'ottProviderInvoice', payload);
    });
    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_SUBSCRIBER_BPL_INVOICE][1], (state, { payload }) => {
      set(state, 'subscriberBplInvoice', payload);
    });
    builder.addCase(
      API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_SUBSCRIBER_INVOICE_REPORTS][1],
      (state, { payload }) => {
        set(state, 'subscriberInvoiceReports', payload);
      }
    );
  }
});

export const { reducer, actions } = slice;
