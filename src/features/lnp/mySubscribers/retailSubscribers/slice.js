import { createSlice } from '@reduxjs/toolkit';
import { set } from 'lodash-es';

import { ACTION_TYPES, API_ACTION_TYPE_VARIANTS } from './action';
import { STATE_REDUCER_KEY } from './constants';

const initialState = {
  retailSubsList: {}
};

const slice = createSlice({
  initialState,
  name: STATE_REDUCER_KEY,
  extraReducers: (builder) => {
    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_LNP_RETAIL_SUBC_LIST][1], (state, { payload }) => {
      set(state, 'retailSubsList', payload);
    });
  }
});

export const { actions, reducer } = slice;
