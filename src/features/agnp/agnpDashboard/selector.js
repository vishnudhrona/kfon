import { flow } from 'lodash-es';

import { STATE_REDUCER_KEY } from './constants';

const agnpKey = (state) => state[STATE_REDUCER_KEY];

const tableDetails = (state) => state.tableData;
export const getTableData = flow(agnpKey, tableDetails)

const cardDetails = (state) => state.cardData;
export const getCardData = flow(agnpKey, cardDetails)