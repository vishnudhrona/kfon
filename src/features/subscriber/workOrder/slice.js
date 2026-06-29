import { createSlice } from '@reduxjs/toolkit';

import { API_ACTION_TYPE_VARIANTS, API_ACTION_TYPES } from './actions';
import { STATE_REDUCER_KEY, WORK_ORDER_TABLE_KEY } from './constants';

const initialState = {
  [WORK_ORDER_TABLE_KEY]: {
    data: [
      {
        id: 'WO-001',
        workOrderNumber: 'WO-2025-001',
        packageName: 'Basic Broadband',
        noOfCustomers: 50,
        connectedCustomers: 32,
        validityInMonths: 12,
        serviceStartDate: '2025-01-01',
        serviceEndDate: '2026-01-01',
        status: 'ACTIVE',
        remarks: 'Initial deployment',
        createdAt: '2025-01-01'
      },
      {
        id: 'WO-002',
        workOrderNumber: 'WO-2025-002',
        packageName: 'Premium Fiber',
        noOfCustomers: 100,
        connectedCustomers: 0,
        validityInMonths: 6,
        serviceStartDate: '2025-02-01',
        serviceEndDate: '2025-08-01',
        status: 'PENDING',
        remarks: 'Awaiting equipment',
        createdAt: '2025-01-15'
      },
      {
        id: 'WO-003',
        workOrderNumber: 'WO-2025-003',
        packageName: 'Business Pro',
        noOfCustomers: 25,
        connectedCustomers: 25,
        validityInMonths: 3,
        serviceStartDate: '2025-03-01',
        serviceEndDate: '2025-06-01',
        status: 'EXPIRED',
        remarks: 'Renewal required',
        createdAt: '2025-02-20'
      }
    ],
    totalCount: 3
  },
  ewsPackages: [],
  ewsWorkOrderOptions: []
};

const workOrderSlice = createSlice({
  name: STATE_REDUCER_KEY,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(API_ACTION_TYPE_VARIANTS[API_ACTION_TYPES.FETCH_WORK_ORDER_LIST][1], (state, action) => {
        const data = action.payload?.data?.content || [];
        const totalCount = action.payload?.data?.totalElements || 0;
        state[WORK_ORDER_TABLE_KEY] = { data, totalCount };
      })
      .addCase(API_ACTION_TYPE_VARIANTS[API_ACTION_TYPES.FETCH_EWS_PACKAGES][1], (state, action) => {
        const payload = action.payload;
        const list = Array.isArray(payload) ? payload : Array.isArray(payload?.data) ? payload.data : [];
        state.ewsPackages = list;
      })
      .addCase(API_ACTION_TYPE_VARIANTS[API_ACTION_TYPES.FETCH_EWS_WORK_ORDER_DROPDOWN][1], (state, action) => {
        const payload = action.payload;
        const list = Array.isArray(payload) ? payload : Array.isArray(payload?.data) ? payload.data : [];
        state.ewsWorkOrderOptions = list;
      });
  }
});

export const { actions, reducer } = workOrderSlice;
