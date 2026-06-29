import { createSlice } from '@reduxjs/toolkit';
import { set } from 'lodash-es';

import { STATE_REDUCER_KEY } from './constants';

const initialState = {
  downloads: {},
  status: {}
};

const slice = createSlice({
  initialState,
  name: STATE_REDUCER_KEY,
  reducers: {
    clearAll: () => initialState,
    setDocument: (state, { payload }) => {
      set(state, 'downloads', { ...state.downloads, ...payload });
    },
    setDocumentStatus: (state, { payload: { key, value = {} } }) => {
      set(state, `status.${key}`, value);
    }
  }
});

export const { actions, reducer } = slice;
