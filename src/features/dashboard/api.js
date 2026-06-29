import { REQUEST_METHOD } from '@/constants/api';
import { API_URL } from '@/constants/urls';

import { ACTION_TYPES, API_ACTION_TYPE_VARIANTS } from './action';

export const fecthDashboardDetailsApi = (payload) => {
  let url = API_URL.DASHBOARD.GET_DASHBOARD_DATA;

  if (payload?.type === 'Dark Fiber Stats') {
    url = API_URL.DASHBOARD.GET_DARK_FIBER_DATA;
  } else if (payload?.type === 'Enterprise-Private Stats') {
    url = API_URL.DASHBOARD.GET_ENTERPRISE_PRIVATE_DATA;
  } else if (payload?.type === 'Enterprise-Government Stats') {
    url = API_URL.DASHBOARD.GET_ENTERPRISE_GOV_DATA;
  }

  return {
    url,
    method: REQUEST_METHOD.GET,
    payload: {
      types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_DASHBOARD_DETAILS],
      progressKey: ACTION_TYPES.FETCH_DASHBOARD_DETAILS
    },
    params: payload
  };
};

export const fetchLnpDashboardDetailsApi = (payload) => {
  return {
    url: API_URL.DASHBOARD.GET_LNP_DASHBOARD_DATA,
    method: REQUEST_METHOD.GET,
    payload: {
      types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_LNP_DASHBOARD_DETAILS],
      progressKey: ACTION_TYPES.FETCH_LNP_DASHBOARD_DETAILS,
      isErrorToast: false
    },
    params: payload
  };
};
