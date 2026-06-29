import { flow } from 'lodash-es';

import { STATE_REDUCER_KEY } from './constants';

const stateKey = (state) => state[STATE_REDUCER_KEY];

export const getExpenseDashboard = flow(stateKey, (s) => s.dashboard);
export const getLnpRetailData = flow(stateKey, (s) => s.lnpRetail);
export const getLnpEnterpriseData = flow(stateKey, (s) => s.lnpEnterprise);
export const getAgnpEnterpriseData = flow(stateKey, (s) => s.agnpEnterprise);
export const getMspRevenueData = flow(stateKey, (s) => s.mspRevenue);
export const getVasProviderData = flow(stateKey, (s) => s.vasProvider);
export const getPartnersIncentivesData = flow(stateKey, (s) => s.partnersIncentives);
export const getIncentivesSummaryData = flow(stateKey, (s) => s.incentivesSummary);
export const getPartnerGstRefundData = flow(stateKey, (s) => s.partnerGstRefund);
export const getRevenueControlData = flow(stateKey, (s) => s.revenueControl);
export const getExpenseFormData = flow(stateKey, (s) => s.formData);
