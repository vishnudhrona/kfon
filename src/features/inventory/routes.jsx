import { createRoute, Outlet } from '@tanstack/react-router';
import { lazy } from 'react';

import { MENU_KEYS } from '@/constants/permissions';
import { redirectToFirstPermitted } from '@/utils/permissionUtils';

import { appRoute } from '../appRoute';

const StockListOrPoDetails = lazy(() => import('@/features/inventory/pages/StockListOrPoDetails'));
const AddDevice = lazy(() => import('@/features/inventory/pages/AddDevice'));
const DeviceModelList = lazy(() => import('@/features/inventory/pages/DeviceModelList'));
const AddDeviceModel = lazy(() => import('@/features/inventory/pages/AddDeviceModel'));
const DeviceVendorList = lazy(() => import('@/features/inventory/pages/DeviceVendorList'));
const DeviceTypeList = lazy(() => import('@/features/inventory/pages/DeviceTypeList'));
const DeviceMakeList = lazy(() => import('@/features/inventory/pages/DeviceMakeList'));
const DeviceCategoryList = lazy(() => import('@/features/inventory/pages/DeviceCategoryList'));
const StockManagementLayout = lazy(() => import('@/features/inventory/pages/StockManagement'));
const StockManagementIndex = lazy(() => import('@/features/inventory/pages/StockManagementIndex'));
const StockTypeView = lazy(() => import('@/features/inventory/pages/StockTypeView'));
const StockCategoryView = lazy(() => import('@/features/inventory/pages/StockCategoryView'));
const OemRequestList = lazy(() => import('@/features/inventory/pages/OemRequestList'));

// Ordered list used for permission-aware index redirect.
// First entry the user has access to is where /inventory redirects.
const INVENTORY_MENU_TO_PATH = [
  { menuKey: MENU_KEYS.STOCK_LIST, path: 'device-list' },
  { menuKey: MENU_KEYS.ADD_STOCK, path: 'add-device' },
  { menuKey: MENU_KEYS.DEVICE_MODEL, path: 'device-model-list' },
  { menuKey: MENU_KEYS.DEVICE_VENDOR, path: 'device-supplier-list' },
  { menuKey: MENU_KEYS.DEVICE_TYPE, path: 'device-type-list' },
  { menuKey: MENU_KEYS.DEVICE_MAKE, path: 'device-make-list' },
  { menuKey: MENU_KEYS.DEVICE_CATEGORY, path: 'device-category-list' },
  { menuKey: MENU_KEYS.STOCK_MANAGEMENT, path: 'stock-management' },
  { menuKey: MENU_KEYS.OEM_REQUEST, path: 'oem-request' }
];

const inventoryRoot = createRoute({ path: 'inventory', getParentRoute: () => appRoute });

const inventoryDashboard = createRoute({
  path: '/',
  getParentRoute: () => inventoryRoot,
  beforeLoad: () => redirectToFirstPermitted(INVENTORY_MENU_TO_PATH, 'device-list')
});

export const deviceListRoute = createRoute({
  path: 'device-list',
  getParentRoute: () => inventoryRoot,
  component: Outlet
});

export const deviceListIndexRoute = createRoute({
  path: '/',
  getParentRoute: () => deviceListRoute,
  component: StockListOrPoDetails,
  context: () => ({ menuKey: MENU_KEYS.STOCK_LIST })
});

export const addDeviceRoute = createRoute({
  path: 'add-device',
  getParentRoute: () => inventoryRoot,
  component: AddDevice,
  context: () => ({ menuKey: MENU_KEYS.ADD_STOCK })
});

export const deviceModelListRoute = createRoute({
  path: 'device-model-list',
  getParentRoute: () => inventoryRoot,
  component: DeviceModelList,
  context: () => ({ menuKey: MENU_KEYS.DEVICE_MODEL })
});

const deviceAddModelRoute = createRoute({
  path: 'device-model-list/add',
  getParentRoute: () => inventoryRoot,
  component: AddDeviceModel
});

const deviceVendorListRoute = createRoute({
  path: 'device-supplier-list',
  getParentRoute: () => inventoryRoot,
  component: DeviceVendorList,
  context: () => ({ menuKey: MENU_KEYS.DEVICE_VENDOR })
});

const deviceTypeListRoute = createRoute({
  path: 'device-type-list',
  getParentRoute: () => inventoryRoot,
  component: DeviceTypeList,
  context: () => ({ menuKey: MENU_KEYS.DEVICE_TYPE })
});

const deviceMakeListRoute = createRoute({
  path: 'device-make-list',
  getParentRoute: () => inventoryRoot,
  component: DeviceMakeList,
  context: () => ({ menuKey: MENU_KEYS.DEVICE_MAKE })
});

const deviceCategoryListRoute = createRoute({
  path: 'device-category-list',
  getParentRoute: () => inventoryRoot,
  component: DeviceCategoryList,
  context: () => ({ menuKey: MENU_KEYS.DEVICE_CATEGORY })
});

export const stockManagementRoute = createRoute({
  path: 'stock-management',
  getParentRoute: () => inventoryRoot,
  component: StockManagementLayout,
  context: () => ({ menuKey: MENU_KEYS.STOCK_MANAGEMENT })
});

export const stockManagementIndexRoute = createRoute({
  path: '/',
  getParentRoute: () => stockManagementRoute,
  component: StockManagementIndex
});

export const stockTypeRoute = createRoute({
  path: '$typeName',
  getParentRoute: () => stockManagementRoute,
  component: StockTypeView
});

export const stockCategoryRoute = createRoute({
  path: '$typeName/$categoryId',
  getParentRoute: () => stockManagementRoute,
  component: StockCategoryView
});

export const oemRequestRoute = createRoute({
  path: 'oem-request',
  getParentRoute: () => inventoryRoot,
  component: OemRequestList,
  context: () => ({ menuKey: MENU_KEYS.OEM_REQUEST })
});

export const inventoryRoutes = [
  inventoryRoot,
  inventoryDashboard,
  deviceListRoute,
  deviceListIndexRoute,
  addDeviceRoute,
  deviceModelListRoute,
  deviceAddModelRoute,
  deviceVendorListRoute,
  deviceTypeListRoute,
  deviceMakeListRoute,
  deviceCategoryListRoute,
  stockManagementRoute,
  stockManagementIndexRoute,
  stockTypeRoute,
  stockCategoryRoute,
  oemRequestRoute
];
