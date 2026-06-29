import { flow } from 'lodash-es';

import { STATE_REDUCER_KEY } from './constants';

const inventoryDashboardState = (state) => state[STATE_REDUCER_KEY];

export const getInventorySummaryCards = flow(inventoryDashboardState, (s) => s?.summaryCards ?? []);
export const getInventoryStockTypeCount = flow(inventoryDashboardState, (s) => s?.stockTypeCount ?? []);
export const getInventoryDeviceList = flow(inventoryDashboardState, (s) => s?.deviceList ?? []);
export const getInventoryDistrictBreakdown = flow(inventoryDashboardState, (s) => s?.districtBreakdown ?? []);
export const getInventoryWarrantyAlerts = flow(inventoryDashboardState, (s) => s?.warrantyAlerts ?? { expiringSoon: [], expired: [], safeCount: 0 });
export const getInventoryRequestPipeline = flow(inventoryDashboardState, (s) => s?.requestPipeline ?? { raised: 0, pendingApproval: 0, approved: 0, rejected: 0 });
export const getInventoryRecentActivity = flow(inventoryDashboardState, (s) => s?.recentActivity ?? []);
export const getInventoryTransferList = flow(inventoryDashboardState, (s) => s?.transferList ?? []);
export const getInventoryRequestQueue = flow(inventoryDashboardState, (s) => s?.requestQueue ?? []);
export const getInventoryActiveRoutes = flow(inventoryDashboardState, (s) => s?.activeRoutes ?? []);
export const getInventoryVendorStock = flow(inventoryDashboardState, (s) => s?.vendorStock ?? []);
export const getInventoryStockEntries = flow(inventoryDashboardState, (s) => s?.stockEntries ?? []);
export const getInventoryAssetValue = flow(inventoryDashboardState, (s) => s?.assetValue ?? { value: '—', period: '—' });

export const getInventoryLoadingSummary = flow(inventoryDashboardState, (s) => s?.isLoadingSummary ?? false);
export const getInventoryLoadingStockType = flow(inventoryDashboardState, (s) => s?.isLoadingStockType ?? false);
export const getInventoryLoadingDeviceList = flow(inventoryDashboardState, (s) => s?.isLoadingDeviceList ?? false);
export const getInventoryLoadingDistrict = flow(inventoryDashboardState, (s) => s?.isLoadingDistrict ?? false);
export const getInventoryLoadingWarranty = flow(inventoryDashboardState, (s) => s?.isLoadingWarranty ?? false);
export const getInventoryLoadingPipeline = flow(inventoryDashboardState, (s) => s?.isLoadingPipeline ?? false);
export const getInventoryLoadingActivity = flow(inventoryDashboardState, (s) => s?.isLoadingActivity ?? false);
