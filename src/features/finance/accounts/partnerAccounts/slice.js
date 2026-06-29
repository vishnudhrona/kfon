import { createSlice } from '@reduxjs/toolkit';
import { set } from 'lodash-es';

import { ACTION_TYPES, API_ACTION_TYPE_VARIANTS } from './action';
import { STATE_REDUCER_KEY } from './constants';

const initialState = {
  partnerAccounts: {
    formData: {}
  },
  corporateSubscriberOnlineRecharge: {},
  lnpOnlineRecharge: {},
  agnpPartnerFinanceCorporate: {},
  lnpPartnerFinanceCorporate: {},
  partnerAccountBalance: {},
  partnerAccountDisbursement: {},
  partnerAccountTopupReceipt: {},
  partnerFinance: {},
  subscriberOnlineRecharge: {}
};

const slice = createSlice({
  name: STATE_REDUCER_KEY,
  initialState,
  reducers: {
    updateFormData: (state, { payload }) => {
      state.partnerAccounts.formData = {
        ...state.partnerAccounts.formData,
        ...payload
      };
    }
  },
  extraReducers: (builder) => {
    builder.addCase(
      API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_CORPORATE_SUBSCRIBER_ONLINE_RECHARGE][1],
      (state, { payload }) => {
        set(state, 'corporateSubscriberOnlineRecharge', payload);
      }
    );
    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_LNP_ONLINE_RECHARGE][1], (state, { payload }) => {
      set(state, 'lnpOnlineRecharge', payload);
    });
    builder.addCase(
      API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_AGNP_PARTNER_FINANCE_CORPORATE][1],
      (state, { payload }) => {
        set(state, 'agnpPartnerFinanceCorporate', payload);
      }
    );
    builder.addCase(
      API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_LNP_PARTNER_FINANCE_CORPORATE][1],
      (state, { payload }) => {
        set(state, 'lnpPartnerFinanceCorporate', payload);
      }
    );
    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_PARTNER_ACCOUNT_BALANCE][1], (state, { payload }) => {
      set(state, 'partnerAccountBalance', payload);
    });
    builder.addCase(
      API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_PARTNER_ACCOUNT_DISBURSEMENT][1],
      (state, { payload }) => {
        set(state, 'partnerAccountDisbursement', payload);
      }
    );
    builder.addCase(
      API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_PARTNER_ACCOUNT_TOPUP_RECEIPT][1],
      (state, { payload }) => {
        set(state, 'partnerAccountTopupReceipt', payload);
      }
    );
    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_PARTNER_FINANCE][1], (state, { payload }) => {
      set(state, 'partnerFinance', payload);
    });
    builder.addCase(
      API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_SUBSCRIBER_ONLINE_RECHARGE][1],
      (state, { payload }) => {
        set(state, 'subscriberOnlineRecharge', payload);
      }
    );
  }
});

export const { reducer, actions } = slice;
