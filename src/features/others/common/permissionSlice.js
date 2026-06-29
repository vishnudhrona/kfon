import { createSlice } from '@reduxjs/toolkit';

import { STATE_REDUCER_KEY } from './permissionConstants';

const initialState = {
  permissionMap: {}
};

const slice = createSlice({
  name: STATE_REDUCER_KEY,
  initialState,
  reducers: {
    setPermissions: (state, { payload }) => {
      state.permissionMap = payload;
    },
    clearPermissions: () => initialState
  }
});

export const { actions, reducer } = slice;
