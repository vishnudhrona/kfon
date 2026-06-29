import { REQUEST_METHOD } from '@/constants/api';
import { API_URL } from '@/constants/urls';

import { ACTION_TYPES, API_ACTION_TYPE_VARIANTS } from './action';

const ER = API_URL.FINANCE.EXPENSE_REPORTS;

const paginatedGet =
  (url, actionType) =>
  (data = {}) => ({
    url,
    method: REQUEST_METHOD.GET,
    payload: {
      types: API_ACTION_TYPE_VARIANTS[actionType],
      data,
      progressKey: actionType
    }
  });

export const fetchExpenseDashboardApi = paginatedGet(ER.FETCH_DASHBOARD, ACTION_TYPES.FETCH_EXPENSE_DASHBOARD);
export const fetchLnpRetailApi = paginatedGet(ER.FETCH_LNP_RETAIL, ACTION_TYPES.FETCH_LNP_RETAIL);
export const fetchLnpEnterpriseApi = paginatedGet(ER.FETCH_LNP_ENTERPRISE, ACTION_TYPES.FETCH_LNP_ENTERPRISE);
export const fetchAgnpEnterpriseApi = paginatedGet(ER.FETCH_AGNP_ENTERPRISE, ACTION_TYPES.FETCH_AGNP_ENTERPRISE);
export const fetchMspRevenueApi = paginatedGet(ER.FETCH_MSP_REVENUE, ACTION_TYPES.FETCH_MSP_REVENUE);
export const fetchVasProviderApi = paginatedGet(ER.FETCH_VAS_PROVIDER, ACTION_TYPES.FETCH_VAS_PROVIDER);
export const fetchPartnersIncentivesApi = paginatedGet(
  ER.FETCH_PARTNERS_INCENTIVES,
  ACTION_TYPES.FETCH_PARTNERS_INCENTIVES
);
export const fetchIncentivesSummaryApi = paginatedGet(
  ER.FETCH_INCENTIVES_SUMMARY,
  ACTION_TYPES.FETCH_INCENTIVES_SUMMARY
);
export const fetchPartnerGstRefundApi = paginatedGet(
  ER.FETCH_PARTNER_GST_REFUND,
  ACTION_TYPES.FETCH_PARTNER_GST_REFUND
);
export const fetchRevenueControlApi = paginatedGet(ER.FETCH_REVENUE_CONTROL, ACTION_TYPES.FETCH_REVENUE_CONTROL);
