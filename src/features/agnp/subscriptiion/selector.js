import { flow } from 'lodash-es';

import { STATE_REDUCER_KEY } from './constants';

const agnpKey = (state) => state[STATE_REDUCER_KEY];

const subscriptionListTableDetails = (state) => state.subscriptionList.tableData;
export const getSubscriptionListTableData = flow(agnpKey, subscriptionListTableDetails);
