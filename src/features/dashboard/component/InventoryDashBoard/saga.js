import { all, call, takeLatest } from 'redux-saga/effects';

import { handleAPIRequest } from '@/utils/httpUtils';

import { ACTION_TYPES } from './action';
import * as api from './api';

function* fetchInventorySummaryCards({ payload }) {
  yield call(handleAPIRequest, api.fetchInventorySummaryCardsApi, payload);
}

function* fetchInventoryStockTypeCount({ payload }) {
  yield call(handleAPIRequest, api.fetchInventoryStockTypeCountApi, payload);
}

function* fetchInventoryDeviceList({ payload }) {
  yield call(handleAPIRequest, api.fetchInventoryDeviceListApi, payload);
}

function* fetchInventoryDistrictBreakdown({ payload }) {
  yield call(handleAPIRequest, api.fetchInventoryDistrictBreakdownApi, payload);
}

function* fetchInventoryWarrantyAlerts({ payload }) {
  yield call(handleAPIRequest, api.fetchInventoryWarrantyAlertsApi, payload);
}

function* fetchInventoryRequestPipeline({ payload }) {
  yield call(handleAPIRequest, api.fetchInventoryRequestPipelineApi, payload);
}

function* fetchInventoryRecentActivity({ payload }) {
  yield call(handleAPIRequest, api.fetchInventoryRecentActivityApi, payload);
}

export default function* inventoryDashboardSaga() {
  yield all([
    takeLatest(ACTION_TYPES.FETCH_INVENTORY_SUMMARY_CARDS, fetchInventorySummaryCards),
    takeLatest(ACTION_TYPES.FETCH_INVENTORY_STOCK_TYPE_COUNT, fetchInventoryStockTypeCount),
    takeLatest(ACTION_TYPES.FETCH_INVENTORY_DEVICE_LIST, fetchInventoryDeviceList),
    takeLatest(ACTION_TYPES.FETCH_INVENTORY_DISTRICT_BREAKDOWN, fetchInventoryDistrictBreakdown),
    takeLatest(ACTION_TYPES.FETCH_INVENTORY_WARRANTY_ALERTS, fetchInventoryWarrantyAlerts),
    takeLatest(ACTION_TYPES.FETCH_INVENTORY_REQUEST_PIPELINE, fetchInventoryRequestPipeline),
    takeLatest(ACTION_TYPES.FETCH_INVENTORY_RECENT_ACTIVITY, fetchInventoryRecentActivity)
  ]);
}
