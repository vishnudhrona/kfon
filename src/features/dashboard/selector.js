import { flow } from 'lodash-es';

import { STATE_REDUCER_KEY } from './constants';

const dashboardDetails = (state) => state[STATE_REDUCER_KEY];

const dashBoardData = (state) => state?.dashBoardData || {};
export const getDashBoardData = flow(dashboardDetails, dashBoardData);

const lnpDashboardData = (state) => state?.lnpDashboardData || {};
export const getLnpDashboardData = flow(dashboardDetails, lnpDashboardData);
