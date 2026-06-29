import { createSlice } from '@reduxjs/toolkit';
import { set } from 'lodash-es';

import { ACTION_TYPES, API_ACTION_TYPE_VARIANTS } from './action';
import { STATE_REDUCER_KEY } from './constants';

const initialState = {
  rechargeReports: {
    formData: {}
  },
  rechargeInsights: {},
  subscriberRecharge: {},
  partnerRecharge: {}
};

const slice = createSlice({
  name: STATE_REDUCER_KEY,
  initialState,
  reducers: {
    updateFormData: (state, { payload }) => {
      state.rechargeReports.formData = {
        ...state.rechargeReports.formData,
        ...payload
      };
    }
  },
  extraReducers: (builder) => {
    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_RECHARGE_INSIGHTS][1], (state, { payload }) => {
      set(state, 'rechargeInsights', payload);
    });
    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_SUBSCRIBER_RECHARGE][1], (state, { payload }) => {
      set(state, 'subscriberRecharge', payload);
    });
    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_PARTNER_RECHARGE][1], (state, { payload }) => {
      set(state, 'partnerRecharge', payload);
    });
  }
});

export const { reducer, actions } = slice;
