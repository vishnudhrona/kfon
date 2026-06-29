import { createSlice } from '@reduxjs/toolkit';
import { set } from 'lodash-es';

import { STORAGE_KEYS } from '@/constants';
import { getDataFromStorage, setDataToStorage } from '@/utils/encryptionUtils';

import { ACTION_TYPES, API_ACTION_TYPE_VARIANTS } from './action';
import { STATE_REDUCER_KEY } from './constants';

const getInitialLoginDetails = () => {
  try {
    const stored = getDataFromStorage(STORAGE_KEYS.LOGIN_DETAILS, true, { data: {} });
    return stored || { data: {} };
  } catch (error) {
    console.error('Error loading login details from localStorage:', error);
    return { data: {} };
  }
};

const getInitialSelectedTenant = () => {
  try {
    const stored = getDataFromStorage(STORAGE_KEYS.SELECTED_TENANT, true, null);
    return stored || null;
  } catch (error) {
    console.error('Error loading selected tenant from localStorage:', error);
    return null;
  }
};

const initialState = {
  loginDetails: getInitialLoginDetails(),
  error: '',
  otpSent: {},
  otpVerified: {},
  forgotPasswordUsername: '',
  loginOtpDetails: null,
  states: [],
  selectedTenant: getInitialSelectedTenant()
};

const slice = createSlice({
  initialState,
  name: STATE_REDUCER_KEY,
  reducers: {
    clearAll: () => {
      localStorage.removeItem(STORAGE_KEYS.LOGIN_DETAILS);
      return {
        loginDetails: { data: {} },
        error: ''
      };
    },
    setLoginDetails: (state, { payload }) => {
      set(state, 'loginDetails', payload);
      setDataToStorage(STORAGE_KEYS.LOGIN_DETAILS, payload, true);
    },
    setLoginError: (state, { payload }) => {
      set(state, 'error', payload);
    },
    logout: (state) => {
      state.loginDetails = { data: {} };
      state.error = '';
      state.loginOtpDetails = null;
    },
    setForgotPasswordUsername: (state, { payload }) => {
      set(state, 'forgotPasswordUsername', payload);
    },
    clearIsFirstLogin: (state) => {
      if (state.loginDetails?.data) {
        state.loginDetails.data.isFirstLogin = false;
        setDataToStorage(STORAGE_KEYS.LOGIN_DETAILS, state.loginDetails, true);
      }
    },
    setLoginOtpDetails: (state, { payload }) => {
      set(state, 'loginOtpDetails', payload);
    },
    clearLoginOtpDetails: (state) => {
      set(state, 'loginOtpDetails', null);
    },
    setSelectedTenant: (state, { payload }) => {
      set(state, 'selectedTenant', payload);
      setDataToStorage(STORAGE_KEYS.SELECTED_TENANT, payload, true);
    },
    clearSelectedTenant: (state) => {
      set(state, 'selectedTenant', null);
      localStorage.removeItem(STORAGE_KEYS.SELECTED_TENANT);
    }
  },
  extraReducers: (builder) => {
    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.USER_LOGIN][1], (state, { payload }) => {
      set(state, 'loginOtpDetails', payload?.data ?? null);
    });

    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.VERIFY_LOGIN_OTP][1], (state, { payload }) => {
      set(state, 'loginDetails', payload);
      set(state, 'loginOtpDetails', null);
      setDataToStorage(STORAGE_KEYS.LOGIN_DETAILS, payload, true);
    });

    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.SEND_OTP][1], (state, { payload }) => {
      set(state, 'otpSent', payload?.data);
    });

    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.VERIFY_OTP][1], (state, { payload }) => {
      set(state, 'otpVerified', payload?.data);
    });

    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_STATES][1], (state, { payload }) => {
      set(state, 'states', payload?.data || []);
    });
  }
});

export const { actions, reducer } = slice;
