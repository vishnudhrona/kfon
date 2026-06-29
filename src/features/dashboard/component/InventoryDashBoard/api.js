import { REQUEST_METHOD } from '@/constants/api';
import { API_URL } from '@/constants/urls';

import { ACTION_TYPES, API_ACTION_TYPE_VARIANTS } from './action';

export const fetchInventorySummaryCardsApi = (params = {}) => ({
  url: API_URL.INVENTORY.DASHBOARD.FETCH,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_INVENTORY_SUMMARY_CARDS],
    progressKey: ACTION_TYPES.FETCH_INVENTORY_SUMMARY_CARDS
  },
  params
});

export const fetchInventoryStockTypeCountApi = (params = {}) => ({
  url: API_URL.INVENTORY.DASHBOARD.STOCK_TYPE_COUNT,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_INVENTORY_STOCK_TYPE_COUNT],
    progressKey: ACTION_TYPES.FETCH_INVENTORY_STOCK_TYPE_COUNT
  },
  params
});

export const fetchInventoryDeviceListApi = (params = {}) => ({
  url: API_URL.INVENTORY.DASHBOARD.LIST,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_INVENTORY_DEVICE_LIST],
    progressKey: ACTION_TYPES.FETCH_INVENTORY_DEVICE_LIST
  },
  params
});

export const fetchInventoryDistrictBreakdownApi = (params = {}) => ({
  url: API_URL.INVENTORY.DASHBOARD.DISTRICT_BREAKDOWN,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_INVENTORY_DISTRICT_BREAKDOWN],
    progressKey: ACTION_TYPES.FETCH_INVENTORY_DISTRICT_BREAKDOWN
  },
  params
});

// TODO: add WARRANTY_ALERTS endpoint to API_URL.INVENTORY.DASHBOARD when backend is ready
export const fetchInventoryWarrantyAlertsApi = (params = {}) => ({
  url: '/api/inventory-dashboard/warranty-alerts',
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_INVENTORY_WARRANTY_ALERTS],
    progressKey: ACTION_TYPES.FETCH_INVENTORY_WARRANTY_ALERTS
  },
  params
});

// TODO: add REQUEST_PIPELINE endpoint to API_URL.INVENTORY.DASHBOARD when backend is ready
export const fetchInventoryRequestPipelineApi = (params = {}) => ({
  url: '/api/inventory-dashboard/request-pipeline',
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_INVENTORY_REQUEST_PIPELINE],
    progressKey: ACTION_TYPES.FETCH_INVENTORY_REQUEST_PIPELINE
  },
  params
});

// TODO: add RECENT_ACTIVITY endpoint to API_URL.INVENTORY.DASHBOARD when backend is ready
export const fetchInventoryRecentActivityApi = (params = {}) => ({
  url: '/api/inventory-dashboard/recent-activity',
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_INVENTORY_RECENT_ACTIVITY],
    progressKey: ACTION_TYPES.FETCH_INVENTORY_RECENT_ACTIVITY
  },
  params
});
