import { REQUEST_METHOD } from '@/constants/api';
import { API_URL } from '@/constants/urls';

import { ACTION_TYPES, API_ACTION_TYPE_VARIANTS } from './action';

const RR = API_URL.FINANCE.REVENUE_REPORT;

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

export const fetchRevenueDashboardApi = paginatedGet(RR.FETCH_DASHBOARD, ACTION_TYPES.FETCH_REVENUE_DASHBOARD);
export const fetchRevenueReportsListApi = paginatedGet(RR.FETCH_ALL_REPORTS, ACTION_TYPES.FETCH_REVENUE_REPORTS_LIST);
export const fetchBr11DataApi = paginatedGet(RR.FETCH_BR11, ACTION_TYPES.FETCH_BR11_DATA);
export const fetchBr27DataApi = paginatedGet(RR.FETCH_BR27, ACTION_TYPES.FETCH_BR27_DATA);
export const fetchRevenueBySegmentApi = paginatedGet(RR.FETCH_BY_SEGMENT, ACTION_TYPES.FETCH_REVENUE_BY_SEGMENT);
export const fetchRevenueTopCustomersApi = paginatedGet(
  RR.FETCH_TOP_CUSTOMERS,
  ACTION_TYPES.FETCH_REVENUE_TOP_CUSTOMERS
);
