import { createSlice } from '@reduxjs/toolkit';

import { STATE_REDUCER_KEY } from './constants';

const initialState = {};

const slice = createSlice({
  initialState,
  name: STATE_REDUCER_KEY,
  reducers: {},
  extraReducers: () => { }
});

export const { actions, reducer } = slice;
