import { flow } from 'lodash-es';

import { STATE_REDUCER_KEY } from './constants';

const agnpKey = (state) => state[STATE_REDUCER_KEY];

const tableDetails = (state) => state.inventory.tableData;
export const getTableData = flow(agnpKey, tableDetails);

const devicePartnerTableDetails = (state) => state.devicePartner.tableData
export const getDevicePartnerTableData = flow(agnpKey, devicePartnerTableDetails)