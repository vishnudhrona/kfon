import { flow } from 'lodash-es';

import { STATE_REDUCER_KEY } from './constants';

const dashboardKey = (state) => state[STATE_REDUCER_KEY];

export const getRevenueSources = flow(dashboardKey, (s) => s.revenueSources);
export const getPayableSummary = flow(dashboardKey, (s) => s.payableSummary);
export const getPartnerShare = flow(dashboardKey, (s) => s.partnerShare);
