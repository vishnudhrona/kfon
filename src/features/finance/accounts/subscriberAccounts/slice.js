import { createSlice } from '@reduxjs/toolkit';
import { set } from 'lodash-es';

import { ACTION_TYPES, API_ACTION_TYPE_VARIANTS } from './action';
import { STATE_REDUCER_KEY } from './constants';

const initialState = {
  subscriberAccounts: {
    formData: {}
  },
  subscriptionRenewal: {},
  subscriberFinance: {},
  subscriberPartnerTransfer: {},
  subscriberAccount: {}
};

const slice = createSlice({
  name: STATE_REDUCER_KEY,
  initialState,
  reducers: {
    updateFormData: (state, { payload }) => {
      state.subscriberAccounts.formData = {
        ...state.subscriberAccounts.formData,
        ...payload
      };
    }
  },
  extraReducers: (builder) => {
    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_SUBSCRIPTION_RENEWAL][1], (state, { payload }) => {
      set(state, 'subscriptionRenewal', payload);
    });
    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_SUBSCRIBER_FINANCE][1], (state, { payload }) => {
      set(state, 'subscriberFinance', payload);
    });
    builder.addCase(
      API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_SUBSCRIBER_PARTNER_TRANSFER][1],
      (state, { payload }) => {
        set(state, 'subscriberPartnerTransfer', payload);
      }
    );
    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_SUBSCRIBER_ACCOUNT][1], (state, { payload }) => {
      set(state, 'subscriberAccount', payload);
    });
  }
});

export const { reducer, actions } = slice;
