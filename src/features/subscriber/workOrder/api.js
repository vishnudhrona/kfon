import { REQUEST_METHOD } from '@/constants/api';
import { API_URL } from '@/constants/urls';
import { createCommonFetchApi } from '@/utils/apiUtils';

import { API_ACTION_TYPE_VARIANTS, API_ACTION_TYPES as ACTION_TYPES } from './actions';

const commonFetchApi = createCommonFetchApi(API_ACTION_TYPE_VARIANTS);

export const createWorkOrderApi = (data = {}) => ({
  url: API_URL.SUBSCRIBER.CREATE_WORK_ORDER,
  method: REQUEST_METHOD.POST,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.CREATE_WORK_ORDER],
    data,
    progressKey: ACTION_TYPES.CREATE_WORK_ORDER
  }
});

export const fetchWorkOrderListApi = (params = {}) =>
  commonFetchApi({
    url: API_URL.SUBSCRIBER.FETCH_WORK_ORDER_LIST,
    actionType: ACTION_TYPES.FETCH_WORK_ORDER_LIST,
    params
  });

export const fetchEwsPackagesApi = () =>
  commonFetchApi({
    url: API_URL.SUBSCRIBER.FETCH_EWS_PACKAGES,
    actionType: ACTION_TYPES.FETCH_EWS_PACKAGES
  });

export const approveWorkOrderApi = ({ workorderId, ...data } = {}) => ({
  url: API_URL.SUBSCRIBER.APPROVE_WORK_ORDER.replace(':workorderId', workorderId),
  method: REQUEST_METHOD.PUT,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.APPROVE_WORK_ORDER],
    data,
    progressKey: ACTION_TYPES.APPROVE_WORK_ORDER
  }
});

export const fetchEwsWorkOrderDropdownApi = () =>
  commonFetchApi({
    url: API_URL.SUBSCRIBER.FETCH_EWS_WORK_ORDER_DROPDOWN,
    actionType: ACTION_TYPES.FETCH_EWS_WORK_ORDER_DROPDOWN
  });

export const assignWorkOrderApi = (data = {}) => ({
  url: API_URL.SUBSCRIBER.ASSIGN_WORK_ORDER,
  method: REQUEST_METHOD.POST,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.ASSIGN_WORK_ORDER],
    data,
    progressKey: ACTION_TYPES.ASSIGN_WORK_ORDER
  }
});
