import { createSlice } from '@reduxjs/toolkit';
import { set } from 'lodash-es';

import { STATE_REDUCER_KEY } from './constants';

const initialState = {
  selectedFormFields: {},
  packagePlandetails: {},
  packageTypes: [],
  planTypes: [],
  categoryTypes: [],
  packagePlanTypes: [],
  fallbackSpeed: [],
  speedProfile: [],
  subscriberProfile: [],
  serviceTypes: [],
  revenueShare: [],
  corporateServiceTypes: [],
  corporateSubServiceTypes: [],
  retailServiceTypes: [],
  mainServices: [],
  submitSuccess: false,
  defaultPackageType: [],
  serviceCategoryLookup: [],
  subServiceCategoryLookup: [],
  subPackageTypeLookup: [],
  subServices: [],
  subServiceDetail: null,
  serviceCategoryById: {},
  serviceTypesLookUp: [],
  corporatePackageDetails: null
};

const slice = createSlice({
  initialState,
  name: STATE_REDUCER_KEY,
  reducers: {
    setPackageTypes: (state, { payload }) => {
      set(state, 'packageTypes', payload);
    },
    setSelectedFormFields: (state, { payload = {} }) => {
      const { key, data } = payload;
      set(state, `selectedFormFields.${key}`, data);
    },
    setPlanTypes: (state, { payload = {} }) => {
      set(state, 'planTypes', payload);
    },
    setCategoryTypes: (state, { payload = {} }) => {
      set(state, 'categoryTypes', payload);
    },
    setPackagePlanTypes: (state, { payload = {} }) => {
      set(state, 'packagePlanTypes', payload);
    },
    setFallbackSpeed: (state, { payload = {} }) => {
      set(state, 'fallbackSpeed', payload);
    },
    setSpeedProfile: (state, { payload = {} }) => {
      set(state, 'speedProfile', payload);
    },
    setSubscriberProfile: (state, { payload = {} }) => {
      set(state, 'subscriberProfile', payload);
    },
    setServiceTypes: (state, { payload = {} }) => {
      set(state, 'serviceTypes', payload);
    },
    setRevenueShare: (state, { payload = {} }) => {
      set(state, 'revenueShare', payload);
    },
    setPackagePlandetails: (state, { payload = {} }) => {
      set(state, 'packagePlandetails', payload);
    },
    setCorporatePackageDetails: (state, { payload = null }) => {
      set(state, 'corporatePackageDetails', payload);
    },
    clearCorporatePackageDetails: (state) => {
      set(state, 'corporatePackageDetails', null);
    },
    setCorporateServiceType: (state, { payload = {} }) => {
      set(state, 'corporateServiceTypes', payload);
    },
    setCorporateSubServiceType: (state, { payload = {} }) => {
      set(state, 'corporateSubServiceTypes', payload);
    },
    setRetailServiceType: (state, { payload = {} }) => {
      set(state, 'retailServiceTypes', payload);
    },
    setSubmitSuccess: (state, { payload }) => {
      set(state, 'submitSuccess', payload);
    },
    setSubServiceTypes: (state, { payload = {} }) => {
      set(state, 'subServiceTypes', payload);
    },
    setPartnerType: (state, { payload = {} }) => {
      set(state, 'partnerType', payload);
    },
    setProvider: (state, { payload = [] }) => {
      set(state, 'providers', payload);
    },
    setMainServices: (state, { payload = [] }) => {
      set(state, 'mainServices', payload);
    },
    setDefaultPackageType: (state, { payload = [] }) => {
      set(state, 'defaultPackageType', payload);
    },
    setServiceCategoryLookup: (state, { payload = [] }) => {
      set(state, 'serviceCategoryLookup', payload);
    },
    setSubServiceCategoryLookup: (state, { payload = [] }) => {
      set(state, 'subServiceCategoryLookup', payload);
    },
    setSubPackageTypeLookup: (state, { payload = [] }) => {
      set(state, 'subPackageTypeLookup', payload);
    },
    setSubServices: (state, { payload = [] }) => {
      set(state, 'subServices', payload);
    },
    setSubServiceDetail: (state, { payload = null }) => {
      set(state, 'subServiceDetail', payload);
    },
    clearSubServiceDetail: (state) => {
      set(state, 'subServiceDetail', null);
    },
    setServiceCategoryById: (state, { payload = {} }) => {
      set(state, 'serviceCategoryById', payload);
    },
    setServiceTypesLookup: (state, {payload = []}) => {
      set(state, 'serviceTypesLookUp', payload);
    }
  }
});

export const { actions, reducer } = slice;
