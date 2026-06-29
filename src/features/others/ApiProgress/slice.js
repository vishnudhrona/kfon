import { createSlice } from '@reduxjs/toolkit';
import { set } from 'lodash-es';

import { STATE_REDUCER_KEY } from './constants';

const initialState = {};

const slice = createSlice({
  initialState,
  name: STATE_REDUCER_KEY,
  reducers: {
    resetAll: () => initialState,
    setProgress: (state, { payload }) => {
      const { key, isLoading = false } = payload;
      set(state, key, isLoading);
    }
  }
});

export const { actions, reducer } = slice;
