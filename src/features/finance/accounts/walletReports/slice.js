import { createSlice } from '@reduxjs/toolkit';
import { set } from 'lodash-es';

import { ACTION_TYPES, API_ACTION_TYPE_VARIANTS } from './action';
import { STATE_REDUCER_KEY } from './constants';

const initialState = {
  walletReports: {
    formData: {}
  },
  lnpWallet: { data: {} },
  subscriberWallet: {},
  agnpWallet: {}
};

const slice = createSlice({
  name: STATE_REDUCER_KEY,
  initialState,
  reducers: {
    updateFormData: (state, { payload }) => {
      state.walletReports.formData = {
        ...state.walletReports.formData,
        ...payload
      };
    }
  },
  extraReducers: (builder) => {
    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_LNP_WALLET][1], (state, { payload }) => {
      set(state, 'lnpWallet', payload);
    });
    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_SUBSCRIBER_WALLET][1], (state, { payload }) => {
      set(state, 'subscriberWallet', payload);
    });
    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_AGNP_WALLET][1], (state, { payload }) => {
      set(state, 'agnpWallet', payload);
    });
  }
});

export const { reducer, actions } = slice;
