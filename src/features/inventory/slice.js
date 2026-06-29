import { createSlice } from '@reduxjs/toolkit';
import { camelCase, set } from 'lodash-es';

import { API_ACTION_TYPE_VARIANTS, API_ACTION_TYPES } from './actions';
import { FIELD_METADATA_OVERRIDES, STATE_REDUCER_KEY } from './constants';

export const initialState = {
  deviceModelList: {
    data: [],
    dropdownData: [],
    isLoading: false
  },

  deviceTypeList: {
    data: [],
    dropdownData: [],
    isLoading: false
  },

  deviceMakeList: {
    data: [],
    dropdownData: [],
    isLoading: false
  },

  deviceCategoryList: {
    data: [],
    dropdownData: [],
    isLoading: false
  },

  deviceVendorList: {
    data: [],
    dropdownData: [],
    isLoading: false
  },
  deviceVendorById: {},
  deviceModelById: {},
  assetTypeList: {},
  deviceListTable: {
    data: [],
    dropdownData: [],
    isLoading: false
  },
  deviceListDashboard: {
    data: [],
    isLoading: false
  },
  transferDeviceList: {
    data: [],
    isLoading: false
  },

  transferDetails: {
    data: {},
    isLoading: false
  },
  transferDetailsList: {
    data: [],
    isLoading: false
  },

  deviceRequestsList: {
    data: [],
    isLoading: false
  },

  stockTypeCount: [],
  myStockList: {
    data: [],
    isLoading: false
  },
  transferredStockList: {
    data: [],
    isLoading: false
  },
  stockDetailsList: {
    data: [],
    isLoading: false
  },
  categoryCount: [],
  inventoryDetailsList: {
    data: [],
    isLoading: false
  },
  searchedDevice: {},
  stockTrack: null,
  allRoles: [],
  usersByRoleId: [],
  deviceMappedValues: [],
  popNameDropdown: [],
  replaceDeviceCondition: [],
  inventoryDetailsById: null,
  stockByPoNo: {},
  deviceTypeFields: {}
};

const slice = createSlice({
  initialState,
  name: STATE_REDUCER_KEY,
  reducers: {
    setTableData: (state, { payload: { tableKey, data } }) => {
      set(state, `${tableKey}.data`, data);
    },
    setDropdownData: (state, { payload: { tableKey, data } }) => {
      set(state, `${tableKey}.dropdownData`, data);
    },
    clearStockTrack: (state) => {
      state.stockTrack = null;
    },
    clearInventoryDetailsById: (state) => {
      state.inventoryDetailsById = null;
    },
    setStockByPoNo: (state, { payload: { poNo, data } }) => {
      state.stockByPoNo[poNo] = data;
    }
  },
  extraReducers: (builder) => {
    const successMappings = {
      [API_ACTION_TYPES.FETCH_DEVICE_VENDOR_DETAILS]: 'deviceVendorById',
      [API_ACTION_TYPES.FETCH_DEVICE_MODEL_DETAILS]: 'deviceModelById',
      [API_ACTION_TYPES.FETCH_ASSET_TYPE_DROPDOWN]: 'assetTypeList',
      [API_ACTION_TYPES.FETCH_STOCK_TYPE_COUNT]: 'stockTypeCount',
      [API_ACTION_TYPES.FETCH_CATEGORY_COUNT]: 'categoryCount',
      [API_ACTION_TYPES.FETCH_SEARCH_DEVICE]: 'searchedDevice',
      [API_ACTION_TYPES.FETCH_STOCK_TRACK]: 'stockTrack',
      [API_ACTION_TYPES.FETCH_ALL_ROLES]: 'allRoles',
      [API_ACTION_TYPES.FETCH_USERS_BY_ROLE_ID]: 'usersByRoleId',
      [API_ACTION_TYPES.FETCH_DEVICE_MAPPED_VALUES]: 'deviceMappedValues',
      [API_ACTION_TYPES.FETCH_POP_NAME_DROPDOWN]: 'popNameDropdown',
      [API_ACTION_TYPES.FETCH_REPLACE_DEVICE_CONDITION]: 'replaceDeviceCondition',
      [API_ACTION_TYPES.FETCH_DEVICE_CONDITION_DROPDOWN]: 'deviceConditionDropdown',
      [API_ACTION_TYPES.FETCH_INVENTORY_DETAILS_BY_ID]: 'inventoryDetailsById',
      [API_ACTION_TYPES.FETCH_DEVICE_TYPE_CATEGORY]: 'deviceTypeCategory'
    };

    builder.addCase(API_ACTION_TYPE_VARIANTS[API_ACTION_TYPES.FETCH_DEVICE_TYPE_FIELDS][1], (state, action) => {
      const normalized = {};
      const rawData = action.payload?.data || action.payload || {};
      Object.entries(rawData).forEach(([key, value]) => {
        const uppercaseKey = key.toUpperCase();
        normalized[uppercaseKey] = (value || []).map((field) => {
          const overrides = FIELD_METADATA_OVERRIDES[field.label] || {};
          return {
            ...field,
            name: camelCase(field.label),
            label: field.name,
            ...overrides
          };
        });
      });
      state.deviceTypeFields = normalized;
    });

    Object.entries(successMappings).forEach(([actionType, stateKey]) => {
      builder.addMatcher(
        (action) => action.type.endsWith(API_ACTION_TYPE_VARIANTS[actionType][1]),
        (state, { payload }) => {
          state[stateKey] = payload?.data || payload;
        }
      );
    });
  }
});

export const { actions, reducer } = slice;
