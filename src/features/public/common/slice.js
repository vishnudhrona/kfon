import { createSlice } from '@reduxjs/toolkit';

import { ACTION_TYPES, API_ACTION_TYPE_VARIANTS } from './actions';
import { STATE_REDUCER_KEY } from './constants';

const initialState = {
  otpDetails: {},
  otpPopupOpen: false,
  successPopupOpen: false,
  otpMobile: '',
  otpError: ''
};

const slice = createSlice({
  name: STATE_REDUCER_KEY,
  initialState,
  reducers: {
    clearAll: () => initialState,
    setOtpPopupOpen: (state, { payload }) => {
      state.otpPopupOpen = payload;
    },
    setSuccessPopupOpen: (state, { payload }) => {
      state.successPopupOpen = payload;
    },
    setOtpMobile(state, action) {
      state.otpMobile = action.payload;
    },
    setOtpError(state, action) {
      state.otpError = action.payload;
    }
  },

  extraReducers: (builder) => {
    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.SEND_OTP_FORMS][1], (state, { payload }) => {
      state.otpDetails = payload?.data || {};
    });
  }
});

export const { actions, reducer } = slice;
