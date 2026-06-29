import { flow, get } from 'lodash-es';

import { SERVER_SIDE_TABLE_KEYS } from '@/constants/server_table';
import { getServerSideData } from '@/features/others/Pagination/selectors';

import { STATE_REDUCER_KEY } from './constants';

const packagePlans = (state) => state[STATE_REDUCER_KEY];

const packageTypes = (state) => state.packageTypes;
export const getPackageTypes = flow(packagePlans, packageTypes);

const planTypes = (state) => state.planTypes;
export const getPlanTypes = flow(packagePlans, planTypes);

const packagePlanTypes = (state) => state.packagePlanTypes;
export const getPackagePlanTypes = flow(packagePlans, packagePlanTypes);

const categoryTypes = (state) => state.categoryTypes;
export const getCategoryTypes = flow(packagePlans, categoryTypes);

const fallbackSpeed = (state) => state.fallbackSpeed;
export const getFallbackSpeed = flow(packagePlans, fallbackSpeed);

const speedProfile = (state) => state.speedProfile;
export const getSpeedProfile = flow(packagePlans, speedProfile);

const subscriberProfile = (state) => state.subscriberProfile;
export const getSubscriberProfile = flow(packagePlans, subscriberProfile);

const serviceTypes = (state) => state.serviceTypes;
export const getServiceTypes = flow(packagePlans, serviceTypes);

const revenueShare = (state) => state.revenueShare;
export const getRevenueShare = flow(packagePlans, revenueShare);

const packagePlandetails = (state) => state.packagePlandetails;
export const getPackagePlandetails = flow(packagePlans, packagePlandetails);

const corporatePackageDetails = (state) => state.corporatePackageDetails;
export const getCorporatePackageDetails = flow(packagePlans, corporatePackageDetails);

const corporateServiceTypes = (state) => state.corporateServiceTypes;
export const getCorporateServiceTypes = flow(packagePlans, corporateServiceTypes);

const corporateSubServiceTypes = (state) => state.corporateSubServiceTypes;
export const getCorporateSubServiceTypes = flow(packagePlans, corporateSubServiceTypes);

export const getCorporatePackages = (state) =>
  get(getServerSideData(state), SERVER_SIDE_TABLE_KEYS.CORPORATE_PACKAGES, []);

export const getRetailPackages = (state) => get(getServerSideData(state), SERVER_SIDE_TABLE_KEYS.RETAIL_PACKAGES, []);

export const getRetailServiceType = (state) => get(packagePlans(state), 'retailServiceTypes', []);

export const getMainServicesData = (state) =>
  get(getServerSideData(state), SERVER_SIDE_TABLE_KEYS.MAIN_SERVICES_TABLE, {});

export const getSubmitSuccess = (state) => get(packagePlans(state), 'submitSuccess', false);

export const getSubServiceDetail = (state) => get(packagePlans(state), 'subServiceDetail', null);

export const getSubServiceTypes = (state) => get(packagePlans(state), 'subServiceTypes', []);

export const getPartnerType = (state) => get(packagePlans(state), 'partnerType', []);

export const getProviders = (state) => get(packagePlans(state), 'providers', []);

export const getDefaultPackageType = (state) => get(packagePlans(state), 'defaultPackageType', []);
export const getServiceCategoryLookup = (state) => get(packagePlans(state), 'serviceCategoryLookup', []);
export const getSubServiceCategoryLookup = (state) => get(packagePlans(state), 'subServiceCategoryLookup', []);
export const getSubPackageTypeLookup = (state) => get(packagePlans(state), 'subPackageTypeLookup', []);

export const getSubServicesData = (state) =>
  get(getServerSideData(state), SERVER_SIDE_TABLE_KEYS.SUB_SERVICES_TABLE, []);
export const getServiceMappingsData = (state) => get(getServerSideData(state), SERVER_SIDE_TABLE_KEYS.SERVICE_MAPPING_TABLE, []);
export const getServiceCategoryById = (state) => get(packagePlans(state), 'serviceCategoryById', {});
export const getServiceTypesLookup = (state) => get(packagePlans(state), 'serviceTypesLookUp', []);
