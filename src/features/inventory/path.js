export const INVENTORY_ROUTES = {
  INVENTORY: { label: 'menu.inventory', path: '/app/inventory', icon: 'InventoryMenuIcon', activeOn: ['/app/dashboard/inventory-dashboard'] },
  INVENTORY_MANAGEMENT: { label: 'menu.inventoryManagement', icon: 'InventoryManagementMenuIcon' },
  ADD_STOCK: { label: 'menu.addStock', path: '/app/inventory/add-device', icon: 'AddStockChildIcon' },
  STOCK_LIST: { label: 'menu.stockList', path: '/app/inventory/device-list', icon: 'StockListChildIcon' },
  STOCK_PO_DETAILS: { label: 'menu.poDetails', path: '/app/inventory/device-list/:poNo', icon: '' },
  DEVICE_DETAILS: { label: 'menu.deviceDetails', icon: 'DevicesMenuIcon' },
  ADD_DEVICE_DETAILS: { label: 'menu.addDeviceDetails', path: '/app/inventory/add-device' },
  DEVICE_LIST: { label: 'menu.deviceList', path: '/app/inventory/device-list' },
  'DEVICE_TRANSFER_TO_KFON-DC': {
    label: 'menu.deviceTransferToKfonDc',
    path: '/app/inventory/transfer-to-kfon-dc'
  },
  'DEVICE_TRANSFER_TO_KFON-DGM': {
    label: 'menu.deviceTransferToKfonDgm',
    path: '/app/inventory/transfered-to-kfon-dgm'
  },
  'DEVICE_REQUEST_MSP-DC': { label: 'menu.deviceRequestMspDc', path: '/app/inventory/device-request-msp-dc' },
  DEVICE_TYPE_LIST: { label: 'menu.deviceTypeList', path: '/app/inventory/device-type-list' },
  DEVICE_MAKE_LIST: { label: 'menu.deviceMakeList', path: '/app/inventory/device-make-list' },
  DEVICE_CATEGORY_LIST: {
    label: 'menu.deviceCategoryList',
    path: '/app/inventory/device-category-list'
  },
  DEVICE_MODEL_LIST: { label: 'menu.deviceModelList', path: '/app/inventory/device-model-list' },
  DEVICE_VENDOR_LIST: { label: 'menu.deviceVendorList', path: '/app/inventory/device-supplier-list' },
  ADD_DEVICE_MODEL: { label: 'menu.addDeviceModel', path: '/app/inventory/device-model-list/add' },
  STOCK_MANAGEMENT: { label: 'menu.stockManagement', path: '/app/inventory/stock-management', icon: 'StockManagementChildIcon' },
  OEM_REQUESTS: { label: 'menu.oemRequests', path: '/app/inventory/oem-request', icon: 'OemRequestChildIcon' },
  INVENTORY_DASHBOARD: { label: 'menu.inventoryDashboard', path: '/app/dashboard/inventory-dashboard' }
  
};
