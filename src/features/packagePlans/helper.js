import { t } from 'i18next';
import { get } from 'lodash-es';

import { toNumber } from '@/utils/commonUtils';
import { formatDate } from '@/utils/dateUtils';

import { FIELD_LABELS } from './constants';

export const packageSubmitMappings = [
  // Transformations
  { key: 'freeValidity', target: 'freeValidity', transform: (v) => toNumber(v, 0), includeIfExists: true },
  {
    key: 'initialFreeValidity',
    target: 'initialFreeValidity',
    transform: (v) => toNumber(v, 0),
    includeIfExists: true
  },
  { key: 'bonusValidity', target: 'bonusValidity', transform: (v) => toNumber(v, 0), includeIfExists: true },
  { key: 'threeMonthFreeValidity', target: 'threeMonthFreeValidity', transform: (v) => toNumber(v, 0), includeIfExists: true },
  { key: 'threeMonthInitialFreeValidity', target: 'threeMonthInitialFreeValidity', transform: (v) => toNumber(v, 0), includeIfExists: true },
  { key: 'threeMonthBonusValidity', target: 'threeMonthBonusValidity', transform: (v) => toNumber(v, 0), includeIfExists: true },
  { key: 'sixMonthFreeValidity', target: 'sixMonthFreeValidity', transform: (v) => toNumber(v, 0), includeIfExists: true },
  { key: 'sixMonthInitialFreeValidity', target: 'sixMonthInitialFreeValidity', transform: (v) => toNumber(v, 0), includeIfExists: true },
  { key: 'sixMonthBonusValidity', target: 'sixMonthBonusValidity', transform: (v) => toNumber(v, 0), includeIfExists: true },
  { key: 'twelveMonthFreeValidity', target: 'twelveMonthFreeValidity', transform: (v) => toNumber(v, 0), includeIfExists: true },
  { key: 'twelveMonthInitialFreeValidity', target: 'twelveMonthInitialFreeValidity', transform: (v) => toNumber(v, 0), includeIfExists: true },
  { key: 'twelveMonthBonusValidity', target: 'twelveMonthBonusValidity', transform: (v) => toNumber(v, 0), includeIfExists: true },
  { key: 'packageFee', target: 'packageFee', transform: (v) => toNumber(v, 0), includeIfExists: true },
  { key: 'allocatedVolume', target: 'allocatedVolume', transform: (v) => toNumber(v, 0), includeIfExists: true },
  { key: 'bodMin', target: 'bodMin', transform: (v) => toNumber(v, 0), includeIfExists: true },
  { key: 'bodMax', target: 'bodMax', transform: (v) => toNumber(v, 0), includeIfExists: true },
  { key: 'discount', target: 'discount', transform: (v) => toNumber(v, 0), includeIfExists: true },
  { key: 'noOfSubPackages', target: 'numberOfSubPackages', transform: (v) => toNumber(v, 0), includeIfExists: true },
  { key: 'endDate', target: 'endDate', includeIfExists: true, transform: (v) => new Date(v).toISOString() },
  {
    key: 'status',
    target: 'status',
    includeIfExists: true,
    transform: (v) => (String(v) === 'true' ? 'Active' : 'Inactive')
  },

  // Dropdown code extractions
  { key: 'packageType', target: 'packageTypeId', extract: 'id', includeIfExists: true },
  { key: 'subPackageType', target: 'subPackageTypeId', extract: 'id', includeIfExists: true },
  { key: 'planType', target: 'planTypeId', extract: 'id', includeIfExists: true },
  { key: 'speedProfile', target: 'speedProfile', extract: 'code', includeIfExists: true },
  { key: 'packagePlanType', target: 'packagePlanTypeId', extract: 'id', includeIfExists: true },
  { key: 'fallbackSpeed', target: 'fallbackSpeed', extract: 'code', includeIfExists: true },
  { key: 'subscriptionType', target: 'subscriberTypeId', extract: 'id', includeIfExists: true },
  { key: 'serviceType', target: 'serviceCategoryId', extract: 'id', includeIfExists: true },
  { 
    key: 'serviceType',
    target: 'serviceId',
    transform: (v) => toNumber(v?.serviceId || v?.id || v?.mappingId || v?.srvId, 0),
    includeIfExists: true
  },
  { key: 'disbursementType', target: 'disbursementType', extract: 'label', includeIfExists: true },
  { key: 'renewPeriod', target: 'renewPeriod', transform: (v) => toNumber(v, 0), includeIfExists: true },
  { key: 'ontAllow', target: 'ontAllow', transform: (v) => !!v, includeIfExists: true },
  { key: 'rechargeAllow', target: 'rechargeAllow', extract: 'name', includeIfExists: true },

  // Delete unused fields
  { key: 'categoryType', target: 'categoryType', delete: true },
  { key: 'subPackageType', target: 'subPackageType', delete: true },
  { key: 'planType', target: 'planType', delete: true },
  { key: 'packageType', target: 'packageType', delete: true },
  { key: 'packagePlanType', target: 'packagePlanType', delete: true },
  { key: 'subscriptionType', target: 'subscriptionType', delete: true },
  { key: 'noOfSubPackages', target: 'noOfSubPackages', delete: true },
  { key: 'serviceType', target: 'serviceType', delete: true }
];

export const subPackageSubmitMappings = [
  // Transformations
  { key: 'packageFee', target: 'packageFee', transform: (v) => toNumber(v, 0), includeIfExists: true },
  { key: 'discount', target: 'discount', transform: (v) => toNumber(v, 0), includeIfExists: true },

  // Dropdown code extractions
  { key: 'subServiceType', target: 'subServiceCategoryId', extract: 'id', includeIfExists: true },
  { key: 'revenueShare', target: 'revenueShareId', extract: 'id', includeIfExists: true },
  { key: 'partnerType', target: 'partnerTypeId', extract: 'id', includeIfExists: true },
  { key: 'provider', target: 'providerId', extract: 'id', includeIfExists: true },
  { key: 'categoryType', target: 'categoryType', extract: 'name', includeIfExists: true },

  // Delete unused fields
  { key: 'revenueShare', target: 'revenueShare', delete: true },
  { key: 'subServiceType', target: 'subServiceType', delete: true },
  { key: 'partnerType', target: 'partnerType', delete: true },
  { key: 'provider', target: 'provider', delete: true },
  { key: 'tempId', target: 'tempId', delete: true },
  { key: 'isModified', target: 'isModified', delete: true }
];

export const corporatePackageSubmitMappings = [
  { key: 'renewalFee', target: 'renewalFee', transform: (v) => toNumber(v, 0), includeIfExists: true },
  { key: 'speedInMbps', target: 'speedInMbps', transform: (v) => toNumber(v, 0), includeIfExists: true },
  { key: 'validity', target: 'validity', transform: (v) => toNumber(v, 0), includeIfExists: true },
  { key: 'volume', target: 'volume', transform: (v) => toNumber(v, 0), includeIfExists: true },
  { key: 'otcCost', target: 'otcCost', transform: (v) => toNumber(v, 0), includeIfExists: true },

  { key: 'serviceType', target: 'serviceType', extract: 'id', includeIfExists: true },
  { key: 'subServiceType', target: 'subServiceType', extract: 'id', includeIfExists: true },
  { key: 'packageType', target: 'planType', extract: 'code', includeIfExists: true },
  { key: 'fallbackSpeed', target: 'fallbackSpeed', transform: (v) => toNumber(v, 0), includeIfExists: true },

  { key: 'packageType', delete: true }
];

export const formatPreviewData = (data) => {
  let response = [];
  if (data) {
    response = [
      { label: t(FIELD_LABELS.packageName), value: get(data, 'packageName', t('notAvailable')) },
      { label: t(FIELD_LABELS.packageType), value: get(data, 'packageType.name', t('notAvailable')) },
      { label: t(FIELD_LABELS.serviceType), value: get(data, 'serviceType.name', t('notAvailable')) },
      { label: t(FIELD_LABELS.planType), value: get(data, 'planType.name', t('notAvailable')) },
      { label: t(FIELD_LABELS.freeValidity), value: get(data, 'freeValidity', t('notAvailable')) },
      { label: t(FIELD_LABELS.initialFreeValidity), value: get(data, 'initialFreeValidity', t('notAvailable')) },
      {
        label: t(FIELD_LABELS.createCorrespondingTermPlan),
        value: get(data, 'createCorrespondingTermPlan', false) ? t('active') : t('inactive')
      },
      { label: t(FIELD_LABELS.disbursementType), value: get(data, 'disbursementType.name', t('notAvailable')) },
      { label: t(FIELD_LABELS.packageFee), value: get(data, 'packageFee', t('notAvailable')) },
      { label: t(FIELD_LABELS.speedProfile), value: get(data, 'speedProfile.name', t('notAvailable')) },
      { label: t(FIELD_LABELS.allocatedVolume), value: get(data, 'allocatedVolume', t('notAvailable')) },
      { label: t(FIELD_LABELS.bodMin), value: get(data, 'bodMin', t('notAvailable')) },
      { label: t(FIELD_LABELS.bodMax), value: get(data, 'bodMax', t('notAvailable')) },
      { label: t(FIELD_LABELS.fallbackSpeed), value: get(data, 'fallbackSpeed.name', t('notAvailable')) },
      { label: t(FIELD_LABELS.categoryType), value: get(data, 'categoryType.name', t('notAvailable')) },
      { label: t(FIELD_LABELS.packagePlanType), value: get(data, 'packagePlanType.name', t('notAvailable')) },
      { label: t(FIELD_LABELS.endDate), value: data.endDate ? formatDate(data.endDate) : t('notAvailable') },
      { label: t(FIELD_LABELS.discount), value: get(data, 'discount', t('notAvailable')) },
      { label: t(FIELD_LABELS.noOfSubPackages), value: get(data, 'noOfSubPackages', t('notAvailable')) },
      { label: t(FIELD_LABELS.subscriptionType), value: get(data, 'subscriptionType.name', t('notAvailable')) },
      { label: t(FIELD_LABELS.remarks), value: get(data, 'remarks', t('notAvailable')) }
    ];
  }
  return response;
};

export const formatCorporatePreviewData = (data) => {
  let response = [];
  if (data) {
    response = [
      {
        label: t('serviceType'),
        value: get(data, 'serviceType.name')
          ?? get(data, 'serviceType.serviceName')
          ?? get(data, 'serviceType.label')
          ?? t('notAvailable')
      },
      {
        label: t('subServiceType'),
        value: get(data, 'subServiceType.name')
          ?? get(data, 'subServiceType.serviceName')
          ?? get(data, 'subServiceType.label')
          ?? t('notAvailable')
      },
      { label: t('renewalFee'), value: get(data, 'renewalFee', t('notAvailable')) },
      { label: t('speedInMbps'), value: get(data, 'speedInMbps', t('notAvailable')) },
      { label: t('packageValidityInDays'), value: get(data, 'validity', t('notAvailable')) },
      { label: t('packageType'), value: get(data, 'packageType.name', t('notAvailable')) },
      { label: t('allocatedVolume'), value: get(data, 'volume', t('notAvailable')) },
      { label: t('fallBackSpeedInMbps', { defaultValue: 'Fall Back Speed in Mbps' }), value: get(data, 'fallbackSpeed', t('notAvailable')) },
      { label: t('otcCost'), value: get(data, 'otcCost', t('notAvailable')) }
    ];
  }
  return response;
};

export const formatMainServicedata = (data) => {
  return [
    { label: t('name'), value: get(data, 'name', t('notAvailable')) },
    { label: t('label'), value: get(data, 'label', t('notAvailable')) },
    { label: t(FIELD_LABELS.noOfSubPackages), value: get(data, 'count', 0) }
  ];
};

export const formatServiceMappingData = (data) => {
  const subServicesArray = get(data, 'subServices', []);
  const subServicesText = subServicesArray.length > 0 
    ? subServicesArray.map(s => s.subServiceName).filter(Boolean).join(', ')
    : t('notAvailable');

  return [
    { label: t('serviceName'), value: get(data, 'serviceName', t('notAvailable')) },
    { label: t('subService'), value: subServicesText }
  ];
};
