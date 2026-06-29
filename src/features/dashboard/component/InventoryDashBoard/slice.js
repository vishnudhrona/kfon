import { createSlice } from '@reduxjs/toolkit';
import { set } from 'lodash-es';

import { ACTION_TYPES, API_ACTION_TYPE_VARIANTS } from './action';
import {
  DUMMY_ACTIVE_ROUTES,
  DUMMY_ASSET_VALUE,
  DUMMY_DISTRICT_BREAKDOWN,
  DUMMY_RECENT_ACTIVITY,
  DUMMY_REQUEST_PIPELINE,
  DUMMY_REQUEST_QUEUE,
  DUMMY_STOCK_ENTRIES,
  DUMMY_STOCK_TYPE_COUNT,
  DUMMY_SUMMARY_CARDS,
  DUMMY_TRANSFER_LIST,
  DUMMY_VENDOR_STOCK,
  DUMMY_WARRANTY_ALERTS,
  STATE_REDUCER_KEY
} from './constants';

const toArray = (payload) =>
  Array.isArray(payload) ? payload : (payload?.content ?? payload?.data ?? []);

const initialState = {
  summaryCards: DUMMY_SUMMARY_CARDS,
  stockTypeCount: DUMMY_STOCK_TYPE_COUNT,
  deviceList: [],
  districtBreakdown: DUMMY_DISTRICT_BREAKDOWN,
  warrantyAlerts: DUMMY_WARRANTY_ALERTS,
  requestPipeline: DUMMY_REQUEST_PIPELINE,
  recentActivity: DUMMY_RECENT_ACTIVITY,
  transferList: DUMMY_TRANSFER_LIST,
  requestQueue: DUMMY_REQUEST_QUEUE,
  activeRoutes: DUMMY_ACTIVE_ROUTES,
  vendorStock: DUMMY_VENDOR_STOCK,
  stockEntries: DUMMY_STOCK_ENTRIES,
  assetValue: DUMMY_ASSET_VALUE,
  isLoadingSummary: false,
  isLoadingStockType: false,
  isLoadingDeviceList: false,
  isLoadingDistrict: false,
  isLoadingWarranty: false,
  isLoadingPipeline: false,
  isLoadingActivity: false
};


const slice = createSlice({
  initialState,
  name: STATE_REDUCER_KEY,
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_INVENTORY_SUMMARY_CARDS][0], (state) => {
        set(state, 'isLoadingSummary', true);
      })
      .addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_INVENTORY_SUMMARY_CARDS][1], (state, { payload }) => {
        set(state, 'isLoadingSummary', false);
        const data = toArray(payload);
        set(state, 'summaryCards', data.length ? data : DUMMY_SUMMARY_CARDS);
      })
      .addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_INVENTORY_SUMMARY_CARDS][2], (state) => {
        set(state, 'isLoadingSummary', false);
      });

    builder
      .addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_INVENTORY_STOCK_TYPE_COUNT][0], (state) => {
        set(state, 'isLoadingStockType', true);
      })
      .addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_INVENTORY_STOCK_TYPE_COUNT][1], (state, { payload }) => {
        set(state, 'isLoadingStockType', false);
        const data = toArray(payload);
        set(state, 'stockTypeCount', data.length ? data : DUMMY_STOCK_TYPE_COUNT);
      })
      .addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_INVENTORY_STOCK_TYPE_COUNT][2], (state) => {
        set(state, 'isLoadingStockType', false);
      });

    builder
      .addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_INVENTORY_DEVICE_LIST][0], (state) => {
        set(state, 'isLoadingDeviceList', true);
      })
      .addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_INVENTORY_DEVICE_LIST][1], (state, { payload }) => {
        set(state, 'isLoadingDeviceList', false);
        set(state, 'deviceList', toArray(payload));
      })
      .addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_INVENTORY_DEVICE_LIST][2], (state) => {
        set(state, 'isLoadingDeviceList', false);
      });

    builder
      .addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_INVENTORY_DISTRICT_BREAKDOWN][0], (state) => {
        set(state, 'isLoadingDistrict', true);
      })
      .addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_INVENTORY_DISTRICT_BREAKDOWN][1], (state, { payload }) => {
        set(state, 'isLoadingDistrict', false);
        set(state, 'districtBreakdown', toArray(payload).length ? toArray(payload) : DUMMY_DISTRICT_BREAKDOWN);
      })
      .addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_INVENTORY_DISTRICT_BREAKDOWN][2], (state) => {
        set(state, 'isLoadingDistrict', false);
      });

    builder
      .addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_INVENTORY_WARRANTY_ALERTS][0], (state) => {
        set(state, 'isLoadingWarranty', true);
      })
      .addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_INVENTORY_WARRANTY_ALERTS][1], (state, { payload }) => {
        set(state, 'isLoadingWarranty', false);
        set(state, 'warrantyAlerts', payload ?? { expiringSoon: [], expired: [], safeCount: 0 });
      })
      .addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_INVENTORY_WARRANTY_ALERTS][2], (state) => {
        set(state, 'isLoadingWarranty', false);
      });

    builder
      .addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_INVENTORY_REQUEST_PIPELINE][0], (state) => {
        set(state, 'isLoadingPipeline', true);
      })
      .addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_INVENTORY_REQUEST_PIPELINE][1], (state, { payload }) => {
        set(state, 'isLoadingPipeline', false);
        set(state, 'requestPipeline', payload ?? { raised: 0, pendingApproval: 0, approved: 0, rejected: 0 });
      })
      .addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_INVENTORY_REQUEST_PIPELINE][2], (state) => {
        set(state, 'isLoadingPipeline', false);
      });

    builder
      .addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_INVENTORY_RECENT_ACTIVITY][0], (state) => {
        set(state, 'isLoadingActivity', true);
      })
      .addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_INVENTORY_RECENT_ACTIVITY][1], (state, { payload }) => {
        set(state, 'isLoadingActivity', false);
        set(state, 'recentActivity', payload ?? []);
      })
      .addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_INVENTORY_RECENT_ACTIVITY][2], (state) => {
        set(state, 'isLoadingActivity', false);
      });
  }
});

export const { actions, reducer } = slice;
