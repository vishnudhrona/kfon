import { flow } from 'lodash-es';

import { STATE_REDUCER_KEY } from './constants';

const lnpKey = (state) => state[STATE_REDUCER_KEY];

const retailSubsList = (state) => state.retailSubsList;
export const getRetailSubsList = flow(lnpKey, retailSubsList);
