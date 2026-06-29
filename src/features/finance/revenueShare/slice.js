import { createSlice } from '@reduxjs/toolkit';
import { set } from 'lodash-es';

import { STATE_REDUCER_KEY } from './constants';

const initialState = {
  revenueShare: {
    partnerList: [],
    partnerLnpList: [],
    revenueShareList: {
      data: []
    }
  }
};

const slice = createSlice({
  name: STATE_REDUCER_KEY,
  initialState,
  reducers: {
    setPartnerList: (state, { payload }) => {
      set(state, 'revenueShare.partnerList', payload);
    },
    setPartnerLnpList: (state, { payload }) => {
      set(state, 'revenueShare.partnerLnpList', payload);
    },
    setRevenueShareList: (state, { payload }) => {
      set(state, 'revenueShare.revenueShareList.data', payload);
    }
  }
});

export const { reducer, actions } = slice;
