import { flow, orderBy } from 'lodash-es';

import { STATE_REDUCER_KEY } from './constants';

const getCommonData = (state) => state[STATE_REDUCER_KEY];

const commonModalData = (state) => state.commonModal;
export const getCommonModalData = flow(getCommonData, commonModalData);

const district = (state) => state.district;
export const getDistrict = flow(getCommonData, district);

const postOffice = (state) => state.postOffice;
export const getPostOffice = flow(getCommonData, postOffice, (list) => orderBy(list, ['postOffice'], ['asc']));

const postOfficeByPincode = (state) => state.postOfficeByPincode;
export const getPostOfficeByPincode = flow(getCommonData, postOfficeByPincode, (list) =>
  Array.isArray(list) ? orderBy(list, ['postOffice'], ['asc']) : list
);

const otpDetails = (state) => state.otpDetails;
export const getOtpDetails = flow(getCommonData, otpDetails);

const pincodeList = (state) => state.pincodeList;
export const getPincodeList = flow(getCommonData, pincodeList);

const localBodyList = (state) => state.localBodyList;
export const getLocalBodyList = flow(getCommonData, localBodyList);

const panchayathList = (state) => state.panchayathList;
export const getPanchayathList = flow(getCommonData, panchayathList);

const blockList = (state) => state.blockList;
export const getBlockList = flow(getCommonData, blockList);

const corporationList = (state) => state.corporationList;
export const getCorporationList = flow(getCommonData, corporationList);

const usernameAvailability = (state) => state.usernameAvailability;
export const getCheckUsernameAvailability = flow(getCommonData, usernameAvailability);

export const getAadhaarOtpDetails = flow(getCommonData, (state) => state.aadhaarDetails);

export const getEnteredAadhaarNumber = flow(getCommonData, (state) => state.enteredAadhaarNumber);

const randomNumber = (state) => state.randomNumber;
export const getRandomNumber = flow(getCommonData, randomNumber);

const gstDetails = (state) => state.gstDetails;
export const getGstDetails = flow(getCommonData, gstDetails);
