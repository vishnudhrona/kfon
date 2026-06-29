import { get } from 'lodash-es';

export const STATE_REDUCER_KEY = 'plan-package';
export const UNLIMITED_CODE = 'UNLIMITED';
export const BOD = 'BOD'

export const FIELD_LABELS = {
  packageType: 'packageType',
  subPackageType: 'subPackageType',
  subscriptionType: 'subscriptionType',
  serviceCategory: 'serviceCategory',
  planType: 'planType',
  freeValidity: 'freeValidity',
  initialFreeValidity: 'trialFreeValidity',
  createCorrespondingTermPlan: 'createCorrespondingTermPlan',
  status: 'status',
  packageFee: 'packageFee',
  speedProfile: 'speedProfile',
  exclusiveOfGst: 'exclusiveOfGst',
  mb: 'mbps',
  allocatedVolume: 'allocatedVol',
  fallbackSpeed: 'fallbackSpeed',
  categoryType: 'categoryType',
  packagePlanType: 'packagePlanType',
  endDate: 'endDate',
  discount: 'discount',
  noOfSubPackages: 'noOfSubPackages',
  remarks: 'remarks',
  packageName: 'packageName',
  bodMin: 'bodMin',
  bodMax: 'bodMax',
  disbursementType: 'disbursementType',
  rechargeAllow: 'rechargeAllow',
  ontDeviceAllow: 'ontDeviceAllow',
  renewPeriod: 'renewPeriod',
  isAddon: 'isAddon',
  totalRenewalFee: 'totalRenewalFee',
  bonusValidity: 'bonusValidity'
};

export const PACKAGE_TYPES = {
  FUP: 'FUP',
  UNLIMITED: 'UNLIMITED'
};

export const DISBURSEMENT_TYPE_LIST = [
  { label: 'SINGLE', name: 'Single' },
  { label: 'MONTHLY', name: 'Monthly' }
];

export const RECHARGE_ALLOW_LIST = [
  { label: 'BOTH', name: 'BOTH' },
  { label: 'OFFLINE_ONLY', name: 'OFFLINE_ONLY' },
  { label: 'ONLINE_ONLY', name: 'ONLINE_ONLY' }
];

export const DISCOUNT_TYPE_LIST = [
  { label: 'PERCENTAGE', name: 'PERCENTAGE' },
  { label: 'FLAT', name: 'FLAT' }
]

export const BUNDLE_TYPE = [
  { label: 'VAS', name: 'VAS', value: 'VAS' },
  { label: 'INT', name: 'INT', value: 'INT' }
]

export const CATEGORY_TYPE = [
  { label: 'CORPORATE', name: 'CORPORATE', value: 'CORPORATE' },
  { label: 'RETAIL', name: 'RETAIL', value: 'RETAIL' }
]

export const VISIBLE_COLUMNS_FUP_LIST = [
  { header: 'slNo', accessor: 'slNo' },
  { header: 'plan', accessor: 'packageName' },
  { header: 'speedInKbps', accessor: 'speedInKbps', cell: (row = {}) => `${get(row, 'speedInKbps', 1) / 1024} Mbps` },
  { header: 'renewPeriod', accessor: 'renewPeriod', cell: (row = {}) => `${get(row, 'renewPeriod', 0)} Days` },
  {
    header: 'fbSpeedInKbps',
    accessor: 'fbSpeedInKbps',
    cell: (row = {}) => `${get(row, 'fbSpeedInKbps', 1) / 1024} Mbps`
  },
  {
    header: 'planVolume',
    accessor: 'allocatedVolume',
    cell: (row = {}) => `${get(row, 'allocatedVolume', 1) / 1024} GB`
  },
  { header: 'renewalFeeTaxExtra', accessor: 'renewalFee' },
  { header: 'numberOfSubPackages', accessor: 'subPackageCount' },
  { header: 'speedProfile', accessor: 'speedProfile' },
  { header: 'status', accessor: 'status', cell: (row = {}) => (get(row, 'status', false) ? 'Active' : 'Inactive') }
];

export const VISIBLE_COLUMNS_SUB_PACKAGE = [
  { header: 'slNo', accessor: 'slNo' },
  { header: 'Sub Service Type', accessor: 'subServiceCategory.name' },
  { header: 'Package Fee', accessor: 'packageFee' },
  { header: 'Revenue Share', accessor: 'revenueShare.name' },
  { header: 'Partner Type', accessor: 'partnerType.name' },
  { header: 'Provider', accessor: 'provider.providerName' },
  { header: 'Remarks', accessor: 'remarks' },
  { header: 'Discount', accessor: 'discount' }
];


