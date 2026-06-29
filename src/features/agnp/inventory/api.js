import { REQUEST_METHOD } from "@/constants/api";
import { API_URL } from "@/constants/urls";

import { ACTION_TYPES, API_ACTION_TYPE_VARIANTS } from './action'

export const devicelistTableDataApi = () => ({
  url: API_URL.AGNP.FETCH_DEVICELIST_TABLE_DATA,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_DEVICELIST_TABLE_DATA],
    progressKey: ACTION_TYPES.FETCH_DEVICELIST_TABLE_DATA
  },
  guestAccess: true
});

export const devicePartnerTableDataApi = () => ({
  url: API_URL.AGNP.FETCH_DEVICE_PARTNER_TABLE_DATA,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_DEVICE_PARTNER_TABLE_DATA],
    progressKey: ACTION_TYPES.FETCH_DEVICE_PARTNER_TABLE_DATA
  },
  guestAccess: true
});