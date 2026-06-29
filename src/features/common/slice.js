import { createSlice } from '@reduxjs/toolkit';
import { set } from 'lodash-es';

import { ACTION_TYPES, API_ACTION_TYPE_VARIANTS } from './actions';
import { STATE_REDUCER_KEY } from './constants';

const initialState = {
  district: [],
  postOffice: [],
  postOfficeByPincode: [],
  otpDetails: {},
  aadhaarDetails: null,
  enteredAadhaarNumber: null,
  pincodeList: [],
  localBodyList: [],
  panchayathList: [],
  blockList: [],
  corporationList: [],
  usernameAvailability: null,
  randomNumber: null,
  gstDetails: null
};

const slice = createSlice({
  initialState,
  name: STATE_REDUCER_KEY,
  reducers: {
    resetAadhaarDetails: (state) => {
      state.aadhaarDetails = null;
      state.enteredAadhaarNumber = null;
    },
    setAadhaarNumber: (state, { payload }) => {
      state.enteredAadhaarNumber = payload;
      state.aadhaarDetails = { aadharNumber: payload };
    },
    restoreAadhaarDetails: (state, { payload }) => {
      state.enteredAadhaarNumber = payload.aadharNumber || null;
      state.aadhaarDetails = payload;
    },
    resetOtpDetails: (state) => {
      state.otpDetails = {};
    },
    clearUsernameAvailability: (state) => {
      state.usernameAvailability = null;
    },
    clearPostOffice: (state) => {
      state.postOffice = [];
    }
  },
  extraReducers: (builder) => {
    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_DISTRICT][1], (state, { payload }) => {
      set(state, 'district', payload?.data);
    });
    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_POSTOFFICE][0], (state) => {
      set(state, 'postOffice', []);
    });

    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_POSTOFFICE][1], (state, { payload }) => {
      set(state, 'postOffice', payload?.data || []);
    });

    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_POSTOFFICE][2], (state) => {
      set(state, 'postOffice', []);
    });
    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_POSTOFFICE_BY_PINCODE][1], (state, { payload }) => {
      set(state, 'postOfficeByPincode', payload?.data);
    });
    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.SEND_OTP][1], (state, { payload }) => {
      set(state, 'otpDetails', payload?.data?.otpRefId);
    });
    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.SUBMIT_OTP][1], (state, { payload }) => {
      set(state, 'otpDetails', payload?.data);
    });
    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_PINCODE][1], (state, { payload }) => {
      const transformedData =
        payload?.data?.map((item) => ({
          ...item,
          name: item.code
        })) || [];
      set(state, 'pincodeList', transformedData);
    });
    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_LOCAL_BODY][1], (state, { payload }) => {
      set(state, 'localBodyList', payload?.data);
    });
    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_PANCHAYATH][1], (state, { payload }) => {
      set(state, 'panchayathList', payload?.data);
    });
    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_BLOCK][1], (state, { payload }) => {
      set(state, 'blockList', payload?.data);
    });
    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_CORPORATION][1], (state, { payload }) => {
      set(state, 'corporationList', payload?.data);
    });
    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.CHECK_USERNAME_AVAILABILITY][0], (state) => {
      set(state, 'usernameAvailability', null);
    });
    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.CHECK_USERNAME_AVAILABILITY][1], (state, { payload }) => {
      set(state, 'usernameAvailability', !payload?.data);
    });
    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_RANDOM_NUMBER][1], (state, { payload }) => {
      set(state, 'randomNumber', payload?.data);
    });
    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.SEARCH_GST_DETAILS][0], (state) => {
      set(state, 'gstDetails', null);
    });
    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.SEARCH_GST_DETAILS][1], (state, { payload }) => {
      set(state, 'gstDetails', payload?.data);
    });
    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.SEARCH_GST_DETAILS][2], (state) => {
      set(state, 'gstDetails', null);
    });
    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.REQUEST_AADHAAR_OTP][1], (state, { payload }) => {
      set(state, 'aadhaarDetails', { ...state.aadhaarDetails, ...payload?.data });
    });
    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.VERIFY_AADHAAR_OTP][1], (state, { payload }) => {
      set(state, 'aadhaarDetails', { ...state.aadhaarDetails, ...payload?.data });
    });
  }
});

export const { actions, reducer } = slice;
