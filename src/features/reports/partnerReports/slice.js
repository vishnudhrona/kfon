import { createSlice } from '@reduxjs/toolkit';

import { STATE_REDUCER_KEY } from './constants';

const initialState = {};

const slice = createSlice({
  name: STATE_REDUCER_KEY,
  initialState,
  reducers: {}
});

export const { actions, reducer } = slice;
