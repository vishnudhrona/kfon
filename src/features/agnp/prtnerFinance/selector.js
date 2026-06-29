import { flow } from 'lodash-es';

import { STATE_REDUCER_KEY } from './constants';

const agnpKey = (state) => state[STATE_REDUCER_KEY];

const lnpListTableDetails = (state) => state.lnpList;
export const getLnpListTableData = flow(agnpKey, lnpListTableDetails);

const agnpListTableDetails = (state) => state.agnpList;
export const getAgnpListTableData = flow(agnpKey, agnpListTableDetails);

const mandateFormTableDetails = (state) => state.manDateForm.tableData;
export const getMandateFormTableData = flow(agnpKey, mandateFormTableDetails);

const getSingleOnboardingDataSelector = (state) => state.singleOnboardingData;
export const getSingleOnboardingData = flow(agnpKey, getSingleOnboardingDataSelector);
const getOltDeviceListSelector = (state) => state.oltDeviceList;
export const getOltDeviceList = flow(agnpKey, getOltDeviceListSelector);
