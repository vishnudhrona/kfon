import { REQUEST_METHOD } from '@/constants/api';
import { API_URL } from '@/constants/urls';

import { ACTION_TYPES, API_ACTION_TYPE_VARIANTS } from './action';

export const fetchOnboardedSubscribersReportListApi = (data = {}) => ({
  url: API_URL.REPORTS?.ONBOARDED_SUBSCRIBERS_REPORT_LIST || '/api/reports/onboarded-subscribers',
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_ONBOARDED_SUBSCRIBERS_REPORT_LIST],
    params: data,
    progressKey: ACTION_TYPES.FETCH_ONBOARDED_SUBSCRIBERS_REPORT_LIST
  }
});
