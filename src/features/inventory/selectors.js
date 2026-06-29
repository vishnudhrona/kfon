import { createSelector } from '@reduxjs/toolkit';
import { flow, get } from 'lodash-es';

import { INVENTORY_KEYS, STATE_REDUCER_KEY } from './constants';

const inventory = (state) => state[STATE_REDUCER_KEY];

export const getTableData = (key) => flow(inventory, (state) => get(state, key, {}));
export const getDropdownData = (key) => flow(inventory, (state) => get(state, `${key}.dropdownData`, []));

const deviceModelDetail = (state) => state?.[INVENTORY_KEYS.DEVICE_MODEL_BY_ID];
export const getDeviceModelDetails = flow(inventory, deviceModelDetail);

const deviceVendorByIdDetails = (state) => state?.[INVENTORY_KEYS.DEVICE_VENDOR_BY_ID];
export const getDeviceVendorDetails = flow(inventory, deviceVendorByIdDetails);

const assetTypes = (state) => state?.[INVENTORY_KEYS.ASSET_TYPE_LIST];
export const getAssetTypesDropdown = flow(inventory, assetTypes);

export const getDeviceListDashboard = createSelector([inventory], (inventoryState) =>
  get(inventoryState, `${INVENTORY_KEYS.DEVICE_LIST_DASHBOARD}.data`, [])
);

export const getUserListByRole = (role) => getDropdownData(`userList_${role}`);

export const getTransferDeviceDetails = createSelector([inventory], (inventoryState) =>
  get(inventoryState, `${INVENTORY_KEYS.TRANSFER_DETAILS}.data.deviceDetails`, [])
);

export const getRequestDeviceDetails = createSelector([inventory], (inventoryState) =>
  get(inventoryState, `${INVENTORY_KEYS.TRANSFER_DETAILS}.data.devices`, [])
);

export const getStockTypeCount = createSelector([inventory], (inventoryState) =>
  get(inventoryState, INVENTORY_KEYS.STOCK_TYPE_COUNT, [])
);

export const getCategoryCount = createSelector([inventory], (inventoryState) =>
  get(inventoryState, INVENTORY_KEYS.CATEGORY_COUNT, [])
);

export const getDeviceTypeCategory = createSelector([inventory], (inventoryState) =>
  get(inventoryState, INVENTORY_KEYS.DEVICE_TYPE_CATEGORY, [])
);

export const getInventoryDetailsList = createSelector([inventory], (inventoryState) =>
  get(inventoryState, `${INVENTORY_KEYS.INVENTORY_DETAILS_LIST}.data`, [])
);

export const getSearchedDevice = createSelector([inventory], (inventoryState) =>
  get(inventoryState, `searchedDevice`, {})
);

export const getStockTrack = createSelector([inventory], (inventoryState) =>
  get(inventoryState, `stockTrack`, null)
);

export const getAllRoles = createSelector([inventory], (inventoryState) =>
  get(inventoryState, `allRoles`, [])
);

export const getUsersByRoleId = createSelector([inventory], (inventoryState) =>
  get(inventoryState, `usersByRoleId`, [])
);

export const getDeviceMappedValues = createSelector([inventory], (inventoryState) =>
  get(inventoryState, `deviceMappedValues`, [])
);

export const getPopNameDropdown = createSelector([inventory], (inventoryState) =>
  get(inventoryState, `popNameDropdown`, [])
);

export const getReplaceDeviceCondition = createSelector([inventory], (inventoryState) =>
  get(inventoryState, `replaceDeviceCondition`, [])
);

export const getStockStatusDropdown = getDropdownData(INVENTORY_KEYS.STOCK_STATUS_DROPDOWN);

export const getDeviceConditionDropdown = createSelector([inventory], (inventoryState) =>
  get(inventoryState, 'deviceConditionDropdown', [])
);

export const getInventoryDetailsById = createSelector([inventory], (inventoryState) =>
  get(inventoryState, 'inventoryDetailsById', null)
);

export const getStockByPoNo = (poNo) =>
  createSelector([inventory], (inventoryState) => get(inventoryState, ['stockByPoNo', poNo], []));

export const getDeviceTypeFields = createSelector([inventory], (inventoryState) =>
  get(inventoryState, 'deviceTypeFields', {})
);

export const getLnpRequestsList = createSelector([inventory], (inventoryState) =>
  get(inventoryState, `${INVENTORY_KEYS.LNP_REQUESTS_LIST}.data`, [])
);
