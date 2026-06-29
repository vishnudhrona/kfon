import { flow } from 'lodash-es';

import { STATE_REDUCER_KEY } from './constants';

const agnpKey = (state) => state[STATE_REDUCER_KEY];

const ticketTableDetails = (state) => state.tableData;
export const getTicketTableData = flow(agnpKey, ticketTableDetails);
