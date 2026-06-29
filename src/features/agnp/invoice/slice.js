import { createSlice } from '@reduxjs/toolkit';
import { set } from 'lodash-es';

import { ACTION_TYPES, API_ACTION_TYPE_VARIANTS } from './action';
import { STATE_REDUCER_KEY } from './constants';

const initialState = {
  approval: {
    tableData: []
  },
  summary: {
    tableData: []
  },
  partnerFinance: {
    tableData: []
  },
  invoice: {
    tableData: []
  },
  transaction: {
    tableData: []
  },
  gstWallet: {
    tableData: []
  },
  lnpRevenue: {
    tableData: []
  },
  gstDetails: {
    data: []
  }
};

const slice = createSlice({
  initialState,
  name: STATE_REDUCER_KEY,
  extraReducers: (builder) => {
    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_APPROVAL_TABLE_DATA][1], (state, { payload }) => {
        set(state, 'approval.tableData', payload);
    });

    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_SUMMARY_TABLE_DATA][1], (state, { payload }) => {
        set(state, 'summary.tableData', payload);
    });

    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_PARTNER_FINANCE_TABLE_DATA][1], (state, { payload }) => {
        set(state, 'partnerFinance.tableData', payload);
    });

    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_INVOICE_TABLE_DATA][1], (state, { payload }) => {
        set(state, 'invoice.tableData', payload);
    });

    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_FINANCE_TRANSACTION_TABLE_DATA][1], (state, { payload }) => {
        set(state, 'transaction.tableData', payload);
    });

    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_GST_WALLET_TABLE_DATA][1], (state, { payload }) => {
        set(state, 'gstWallet.tableData', payload);
    });

    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_LNP_REVENUE_TABLE_DATA][1], (state, { payload }) => {
        set(state, 'lnpRevenue.tableData', payload);
    });
    
    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_GST_DETAILS_DATA][1], (state, { payload }) => {
        set(state, 'gstDetails.data', payload);
    });
  }
});

export const { actions, reducer } = slice;