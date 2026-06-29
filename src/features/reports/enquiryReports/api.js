import { REQUEST_METHOD } from '@/constants/api';
import { API_URL } from '@/constants/urls';

import { ACTION_TYPES, API_ACTION_TYPE_VARIANTS } from './action';

export const fetchEnquiryReportListApi = (data = {}) => ({
  url: API_URL.REPORTS?.ENQUIRY_REPORT_LIST || '/api/reports/enquiry-list',
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_ENQUIRY_REPORT_LIST],
    params: data,
    progressKey: ACTION_TYPES.FETCH_ENQUIRY_REPORT_LIST
  }
});

export const assignEnquiryApi = (data = {}) => ({
  url: API_URL.ENQUIRY.ASSIGN_ENQUIRY,
  method: REQUEST_METHOD.POST,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.ASSIGN_ENQUIRY],
    progressKey: ACTION_TYPES.ASSIGN_ENQUIRY,
    data
  }
});
