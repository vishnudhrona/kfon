import { flow } from 'lodash-es';

import { STATE_REDUCER_KEY } from './constants';

const loginKey = (state) => state[STATE_REDUCER_KEY];

const loginDetails = (state) => state.loginDetails;
export const getLoginDetails = flow(loginKey, loginDetails);

const otpSent = (state) => state.otpSent;
export const getOtpSent = flow(loginKey, otpSent);

const otpVerified = (state) => state.otpVerified;
export const getOtpVerified = flow(loginKey, otpVerified);

const forgotPasswordUsername = (state) => state.forgotPasswordUsername;
export const getForgotPasswordUsername = flow(loginKey, forgotPasswordUsername);

const loginOtpDetails = (state) => state.loginOtpDetails;
export const getLoginOtpDetails = flow(loginKey, loginOtpDetails);

const states = (state) => state.states;
export const getStates = flow(loginKey, states);

const selectedTenant = (state) => state.selectedTenant;
export const getSelectedTenant = flow(loginKey, selectedTenant);
