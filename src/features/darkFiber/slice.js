import { createSlice } from '@reduxjs/toolkit';
import { set } from 'lodash-es';

import { STATE_REDUCER_KEY } from './constants';

const initialState = {
  assignToUsers: {
    data: [],
    isLoading: false,
    status: ''
  },
  popList: {
    data: [],
    isLoading: false,
    status: ''
  },
  enquiryDetails: {
    data: {},
    isLoading: false,
    status: ''
  }
};

const slice = createSlice({
  name: STATE_REDUCER_KEY,
  initialState,
  reducers: {
    setDropdownData: (state, { payload: { key, data } }) => {
      set(state, `${key}.data`, data);
    }
  }
});

export const { actions, reducer } = slice;
