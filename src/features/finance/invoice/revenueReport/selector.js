import { flow } from 'lodash-es';

import { STATE_REDUCER_KEY } from './constants';

const stateKey = (state) => state[STATE_REDUCER_KEY];

export const getRevenueDashboard = flow(stateKey, (s) => s.dashboard);
export const getRevenueReportsList = flow(stateKey, (s) => s.allReports);
export const getBr11Data = flow(stateKey, (s) => s.br11);
export const getBr27Data = flow(stateKey, (s) => s.br27);
export const getRevenueBySegment = flow(stateKey, (s) => s.bySegment);
export const getRevenueTopCustomers = flow(stateKey, (s) => s.topCustomers);
export const getRevenueFormData = flow(stateKey, (s) => s.formData);
