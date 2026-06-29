import { SERVER_SIDE_TABLE_KEYS } from '@/constants/server_table';

export const STATE_REDUCER_KEY = 'inventory';

export const INVENTORY_KEYS = {
  DEVICE_MAKE_LIST: SERVER_SIDE_TABLE_KEYS.DEVICE_MAKE_LIST,
  DEVICE_TYPE_LIST: SERVER_SIDE_TABLE_KEYS.DEVICE_TYPE_LIST,
  DEVICE_CATEGORY_LIST: SERVER_SIDE_TABLE_KEYS.DEVICE_CATEGORY_LIST,
  DEVICE_VENDOR_LIST: SERVER_SIDE_TABLE_KEYS.DEVICE_VENDOR_LIST,
  DEVICE_MODEL_LIST: SERVER_SIDE_TABLE_KEYS.DEVICE_MODEL_LIST,
  DEVICE_LIST_TABLE: SERVER_SIDE_TABLE_KEYS.DEVICE_LIST_TABLE,
  TRANSFER_DEVICE_LIST: SERVER_SIDE_TABLE_KEYS.TRANSFER_DEVICE_LIST,
  DEVICE_VENDOR_BY_ID: 'deviceVendorById',
  DEVICE_MODEL_BY_ID: 'deviceModelById',
  ASSET_TYPE_LIST: 'assetTypeList',
  DEVICE_LIST_DASHBOARD: 'deviceListDashboard',
  USER_LISTS: 'userLists',
  TRANSFER_DETAILS: 'transferDetails',
  TRANSFER_DETAILS_LIST: 'transferDetailsList',
  DEVICE_REQUESTS_LIST: 'deviceRequestsList',
  STOCK_TYPE_COUNT: 'stockTypeCount',
  MY_STOCK_LIST: SERVER_SIDE_TABLE_KEYS.MY_STOCK_LIST,
  TRANSFERRED_STOCK_LIST: SERVER_SIDE_TABLE_KEYS.TRANSFERRED_STOCK_LIST,
  STOCK_DETAILS_LIST: SERVER_SIDE_TABLE_KEYS.STOCK_DETAILS_LIST,
  CATEGORY_COUNT: 'categoryCount',
  INVENTORY_DETAILS_LIST: SERVER_SIDE_TABLE_KEYS.INVENTORY_DETAILS_LIST,
  OEM_REQUEST_LIST: SERVER_SIDE_TABLE_KEYS.OEM_REQUEST_LIST,
  STOCK_STATUS_DROPDOWN: 'stockStatusDropdown',
  DEVICE_TYPE_CATEGORY: 'deviceTypeCategory',
  LNP_REQUESTS_LIST: 'lnpRequestsList'
};

export const UNMAPPABLE_DEVICE_TYPES = new Set([
  'OLT',
  'Switch',
  'SFP',
  'Media Converter',
  'Fiber Patch cord',
  'PON SFP',
  'DAC Cable',
  'Artemis family shelves',
  'Panel Blank ASSY'
]);

export const VISIBLE_COLUMNS_DEVICE_REQUESTS = [
  { header: 'slNo', accessor: 'slNo' },
  { header: 'deviceType', accessor: 'deviceType' },
  { header: 'mspDcName', accessor: 'mspDcName' },
  { header: 'requestedDeviceCount', accessor: 'requestedDeviceCount' },
  { header: 'approvedDeviceCount', accessor: 'approvedDeviceCount' },
  { header: 'acceptedDeviceCount', accessor: 'acceptedDeviceCount' },
  { header: 'status', accessor: 'status' },
  { header: 'remarks', accessor: 'remarks' },
  { header: 'createdDate', accessor: 'createdDate' },
  { header: 'updatedDate', accessor: 'updatedDate' }
];

export const VISIBLE_COLUMNS_PARTNER_DEVICE_REQUESTS = [
  { header: 'slNo', accessor: 'slNo' },
  { header: 'partnerName', accessor: 'partnerName' },
  { header: 'deviceType', accessor: 'deviceType' },
  { header: 'requestedDeviceCount', accessor: 'requestedDeviceCount' },
  { header: 'approvedDeviceCount', accessor: 'approvedDeviceCount' },
  { header: 'acceptedDeviceCount', accessor: 'acceptedDeviceCount' },
  { header: 'status', accessor: 'status' },
  { header: 'remarks', accessor: 'remarks' },
  { header: 'createdDate', accessor: 'createdDate' },
  { header: 'updatedDate', accessor: 'updatedDate' }
];

export const USER_ROLES = {
  KFON_DC: 'KFON-DC',
  KFON_NOC_MGR: 'KFON-NOC-MGR',
  DGM: 'DGM'
};

export const TRANSFER_STATUS = {
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  ACKNOWLEDGED: 'Acknowledged'
};

export const DEVICE_CONDITION_OPTIONS = [
  { id: 'GOOD', name: 'Good', value: 'GOOD' },
  { id: 'FAULTY', name: 'Faulty', value: 'FAULTY' }
];

export const VISIBLE_COLUMNS_DEVICE_MODEL = [
  { header: 'slNo', accessor: 'slNo' },
  { header: 'deviceModelName', accessor: 'modelName' },
  { header: 'description', accessor: 'modelDescription' },
  { header: 'deviceType', accessor: 'typeName' },
  { header: 'deviceMake', accessor: 'makeName' },
  { header: 'deviceCategory', accessor: 'categoryName' }
];

export const VISIBLE_COLUMNS_DEVICE_TYPE = [
  { header: 'slNo', accessor: 'slNo' },
  { header: 'deviceTypeName', accessor: 'typeName' },
  { header: 'description', accessor: 'typeDescription' }
];

export const VISIBLE_COLUMNS_DEVICE_MAKE = [
  { header: 'slNo', accessor: 'slNo' },
  { header: 'deviceMakeName', accessor: 'makeName' },
  { header: 'description', accessor: 'makeDescription' }
];

export const VISIBLE_COLUMNS_DEVICE_CATEGORY = [
  { header: 'slNo', accessor: 'slNo' },
  { header: 'deviceCategoryName', accessor: 'catName' },
  { header: 'description', accessor: 'catDescription' }
];

export const VISIBLE_COLUMNS_DEVICE_VENDOR = [
  { header: 'slNo', accessor: 'slNo' },
  { header: 'deviceVendorName', accessor: 'vendor.name' },
  { header: 'deviceModels', cell: (row) => row.vendorMap.map((model) => model.modelName).join(', ') },
  { header: 'mobileNumber', accessor: 'vendor.mobileNumber' },
  { header: 'address', accessor: 'vendor.address' },
  { header: 'description', accessor: 'vendor.description' },
  { header: 'actions', accessor: 'actions' }
];

export const DUMMY_TABLE_DATA = {
  deviceTypeList: {
    COLUMN_DATA: VISIBLE_COLUMNS_DEVICE_TYPE
  },
  deviceMakeList: {
    COLUMN_DATA: VISIBLE_COLUMNS_DEVICE_MAKE
  },
  deviceCategoryList: {
    COLUMN_DATA: VISIBLE_COLUMNS_DEVICE_CATEGORY
  },
  deviceVendorList: {
    COLUMN_DATA: VISIBLE_COLUMNS_DEVICE_VENDOR
  }
};

export const VISIBLE_COLUMNS_DEVICE_LIST = [
  { header: 'slNo', accessor: 'slNo' },
  { header: 'deviceType', accessor: 'deviceType' },
  { header: 'deviceMake', accessor: 'deviceMake' },
  { header: 'deviceModel', accessor: 'deviceModel' },
  { header: 'deviceCategory', accessor: 'deviceCategory' },
  { header: 'vendorName', accessor: 'vendorName' },
  { header: 'gponSerialNumber', accessor: 'deviceSlNo' },
  { header: 'deviceSerialNumber', accessor: 'deviceSerialNumber' },
  { header: 'deviceMac', accessor: 'deviceMack' },
  { header: 'poNo', accessor: 'poNo' },
  { header: 'invoiceDate', accessor: 'invoiceDate' },
  { header: 'warrantyStartDate', accessor: 'warrantyStartDate' },
  { header: 'warrantyEndDate', accessor: 'warrantyEndDate' },
  { header: 'deviceStatusName', accessor: 'deviceStatusName' },
  { header: 'repairStatus', accessor: 'repairStatus' },
  { header: 'createdDate', accessor: 'createdDate' },
  { header: 'modifiedDate', accessor: 'modifiedDate' }
];

export const VISIBLE_COLUMNS_TRANSFER_DEVICE_LIST = [
  { header: 'slNo', accessor: 'slNo' },
  {
    header: 'deviceType',
    accessor: 'deviceType'
  },
  {
    header: 'deviceMake',
    accessor: 'deviceMake'
  },
  {
    header: 'deviceCategory',
    accessor: 'deviceCategory'
  },
  {
    header: 'deviceModel',
    accessor: 'deviceModel'
  },
  { header: 'gponSerialNumber', accessor: 'gponSerialNumber' },
  { header: 'deviceSerialNumber', accessor: 'deviceSerialNumber' },
  {
    header: 'macAddress',
    accessor: 'macAddress'
  },
  {
    header: 'deviceStatus',
    accessor: 'deviceStatus'
  },
  { header: 'warrantyStartDate', accessor: 'warrantyStartDate' },
  { header: 'warrantyEndDate', accessor: 'warrantyEndDate' }
];

export const VISIBLE_COLUMNS_TRANSFER_DETAILS = [
  { header: 'slNo', accessor: 'slNo' },
  { header: 'deviceType', accessor: 'deviceType' },
  { header: 'deviceMake', accessor: 'deviceMake' },
  { header: 'deviceCategory', accessor: 'deviceCategory' },
  { header: 'deviceModel', accessor: 'deviceModel' },
  { header: 'gponSerialNumber', accessor: 'gponSerialNumber' },
  { header: 'deviceSerialNumber', accessor: 'deviceSerialNumber' },
  { header: 'macAddress', cell: (row) => row.deviceMac || row.macAddress },
  { header: 'deviceStatus', accessor: 'deviceStatus' },
  { header: 'createdDate', accessor: 'createdDate' },
  { header: 'modifiedDate', accessor: 'updatedDate' }
];

export const DEVICE_CONFIG_FIELDS = {
  deviceTypeList: [
    {
      name: 'typeName',
      label: 'deviceTypeName',
      type: 'text'
    },
    {
      name: 'typeDescription',
      label: 'description',
      type: 'text'
    }
  ],
  deviceMakeList: [
    {
      name: 'makeName',
      label: 'deviceMakeName',
      type: 'text'
    },
    {
      name: 'makeDescription',
      label: 'description',
      type: 'text'
    }
  ],
  deviceCategoryList: [
    {
      name: 'catName',
      label: 'deviceCategoryName',
      type: 'text'
    },
    {
      name: 'deviceType',
      label: 'deviceType',
      type: 'select',
      props: { valueKey: 'name' }
    },
    {
      name: 'catDescription',
      label: 'description',
      type: 'text'
    }
  ]
};

export const DUMMY_KFON_DC_DATA = [
  { id: '1', name: 'Kfon DC 1' },
  { id: '2', name: 'Kfon DC 2' },
  { id: '3', name: 'Kfon DC 3' }
];

export const VISIBLE_COLUMNS_STOCK_DETAILS_LIST = [
  { header: 'slNo', accessor: 'slNo' },
  { header: 'poNumber', accessor: 'poNo' },
  { header: 'invoiceDate', accessor: 'invoiceDate' },
  { header: 'deviceType', accessor: 'type.name' },
  { header: 'deviceVendor', accessor: 'vendor.name' },
  { header: 'deviceModel', accessor: 'model.name' },
  { header: 'assetType', accessor: 'assetType' },
  { header: 'deviceSlNo', accessor: 'deviceSlNo' },
  { header: 'gponSerialNumber', accessor: 'gponSerialNumber' },
  { header: 'deviceMac', accessor: 'deviceMac' },
  { header: 'warrantyStartDate', accessor: 'warrantyStartDate' },
  { header: 'warrantyEndDate', accessor: 'warrantyEndDate' },
  { header: 'status', accessor: 'status' }
];

export const STOCK_STATUS_CONFIG = {
  STOCK_ENTERED: { label: 'Stock Entered', color: '#00897B', bg: 'rgba(0, 137, 123, 0.1)' },
  STOCK_APPROVED: { label: 'Stock Approved', color: '#2E7D32', bg: 'rgba(46, 125, 50, 0.1)' },
  IN_STOCK: { label: 'Stock Approved', color: '#2E7D32', bg: 'rgba(46, 125, 50, 0.1)' },
  STOCK_REJECTED: { label: 'Stock Rejected', color: '#FF3B30', bg: 'rgba(255, 59, 48, 0.1)' }
};

export const STOCK_STATUS_OPTIONS = {
  IN_STOCK: { label: 'In Stock', value: 'IN_STOCK', color: '#2E7D32', bg: 'rgba(46, 125, 50, 0.1)' },
  TRANSFER_REQUEST: {
    label: 'Transfer Request',
    value: 'TRANSFER_REQUEST',
    color: '#FF9500',
    bg: 'rgba(255, 149, 0, 0.1)'
  },
  TRANSFER_APPROVED: {
    label: 'Transfer Approved',
    value: 'TRANSFER_APPROVED',
    color: '#2E7D32',
    bg: 'rgba(46, 125, 50, 0.1)'
  },
  TRANSFER_REJECTED: {
    label: 'Transfer Rejected',
    value: 'TRANSFER_REJECTED',
    color: '#FF3B30',
    bg: 'rgba(255, 59, 48, 0.1)'
  },
  TRANSIT: { label: 'Transit', value: 'TRANSIT', color: '#00CF87', bg: 'rgba(0, 207, 135, 0.1)' },
  OEM: { label: 'OEM', value: 'OEM', color: '#00BBFF', bg: 'rgba(0, 187, 255, 0.1)' },
  NOT_WORKING: { label: 'Not Working', value: 'NOT_WORKING', color: '#FF9500', bg: 'rgba(255, 149, 0, 0.1)' },
  STOCK_ENTERED: { label: 'Stock Entered', value: 'STOCK_ENTERED', color: '#00897B', bg: 'rgba(0, 137, 123, 0.1)' },
  STOCK_APPROVED: { label: 'Stock Approved', value: 'STOCK_APPROVED', color: '#2E7D32', bg: 'rgba(46, 125, 50, 0.1)' },
  STOCK_REJECTED: { label: 'Stock Rejected', value: 'STOCK_REJECTED', color: '#FF3B30', bg: 'rgba(255, 59, 48, 0.1)' },
  REQUEST_TO_OEM: { label: 'Request To OEM', value: 'REQUEST_TO_OEM', color: '#9C27B0', bg: 'rgba(156, 39, 176, 0.1)' },
  RETURN_TO_OEM: { label: 'Return To OEM', value: 'RETURN_TO_OEM', color: '#E91E63', bg: 'rgba(233, 30, 99, 0.1)' },
  UNMAPPED: { label: 'Unmapped', value: 'UNMAPPED', color: '#607D8B', bg: 'rgba(96, 125, 139, 0.1)' },
  MAPPED_TO_LOCATION: {
    label: 'Mapped To Location',
    value: 'MAPPED_TO_LOCATION',
    color: '#1976D2',
    bg: 'rgba(25, 118, 210, 0.1)'
  },
  CONDITION_CHANGE: {
    label: 'Condition Change',
    value: 'CONDITION_CHANGE',
    color: '#FF3B30',
    bg: 'rgba(255, 59, 48, 0.1)'
  },
  RECEIVED: { label: 'Received', value: 'RECEIVED', color: '#2E7D32', bg: 'rgba(46, 125, 50, 0.1)' },
  IN_USE: { label: 'In Use', value: 'IN_USE', color: '#1976D2', bg: 'rgba(25, 118, 210, 0.1)' },
  MAPPED_TO_SUBSCRIBER: {
    label: 'Mapped to Subscriber',
    value: 'MAPPED_TO_SUBSCRIBER',
    color: '#8D0247',
    bg: 'rgba(141, 2, 71, 0.1)'
  },
  UPDATED: { label: 'Updated', value: 'UPDATED', color: '#3484F4', bg: 'rgba(52, 132, 244, 0.1)' }
};

export const MY_STOCK_COLUMNS = [
  { header: 'category', accessor: 'assetType' },
  { header: 'model', accessor: 'model.name' },
  { header: 'equipmentId', accessor: 'detailsId' },
  { header: 'custodian', accessor: 'custodianName' },
  { header: 'status', accessor: 'status' },
  { header: 'condition', accessor: 'deviceCondition' },
  { header: 'serialNumber', accessor: 'deviceSerialNumber' },
  { header: 'macAddress', accessor: 'deviceMac' }
];

export const FIELD_METADATA_OVERRIDES = {
  DEVICE_MAC: {
    format: 'macAddress',
    name: 'deviceMac'
  },
  IP_ADDRESS: {
    format: 'ipAddress',
    name: 'deviceIp'
  },
  GPON: {
    max: 12,
    name: 'gponSerialNumber'
  },
  DEVICE_SLNO: {
    max: 20,
    name: 'deviceSlno'
  },
  DISTANCE_KM: {
    min: 0,
    max: 99,
    name: 'distanceInKm'
  },
  WARRANTY_START: {
    name: 'warrantyStartDate'
  },
  WARRANTY_END: {
    name: 'warrantyEndDate',
    minValueRef: 'warrantyStartDate'
  }
};
