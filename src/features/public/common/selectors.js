import { flow } from 'lodash-es';

import { STATE_REDUCER_KEY } from './constants';

const publicKeys = (state) => state[STATE_REDUCER_KEY];

const otpDetails = (publicState) => publicState.otpDetails;
export const getOtpDetails = flow(publicKeys, otpDetails);

const otpError = (publicState) => publicState.otpError;
export const getOtpError = flow(publicKeys, otpError);

