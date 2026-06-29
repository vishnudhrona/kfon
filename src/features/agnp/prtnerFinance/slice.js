import { createSlice } from '@reduxjs/toolkit';
import { set } from 'lodash-es';

import { ACTION_TYPES, API_ACTION_TYPE_VARIANTS } from './action';
import { STATE_REDUCER_KEY } from './constants';

const initialState = {
  lnpList: {
    data: []
  },
  agnpList: {
    data: []
  },
  manDateForm: {
    tableData: []
  },
  oltDeviceList: {
    data: []
  }
};

const slice = createSlice({
  initialState,
  name: STATE_REDUCER_KEY,
  reducers: {
    setPartnerListData: (state, { payload }) => {
      const { data, partnerType } = payload;
      const listContent = data?.content || data || [];
      if (partnerType === 'AGNP') {
        state.agnpList.data = listContent;
      } else {
        state.lnpList.data = listContent;
      }
    },
    setSingleOnboardingData: (state, { payload }) => {
      state.singleOnboardingData = payload?.data || {};
    }
  },
  extraReducers: (builder) => {
    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_MANDATE_FROM_TABLE_DATA][1], (state, { payload }) => {
      set(state, 'manDateForm.tableData', payload);
    });

    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_OLT_DEVICE_LIST][1], (state, { payload }) => {
      set(state, 'oltDeviceList.data', payload?.data || []);
    });
  }
});

export const { actions, reducer } = slice;
