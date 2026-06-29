import { all, call, fork, put, take, takeLatest } from 'redux-saga/effects';

import { SERVER_SIDE_TABLE_KEYS } from '@/constants/server_table';
import { setCommonPaginationResponse } from '@/features/others/Pagination/saga';
import { router } from '@/routes/routes';
import { applyObjectMappings } from '@/utils/commonUtils';
import { handleAPIRequest } from '@/utils/httpUtils';
import logger from '@/utils/loggerUtils';
import { commonListSaga, createSaga, updateSaga } from '@/utils/sagaUtils';

import {
  ACTION_TYPES,
  API_ACTION_TYPE_VARIANTS,
  fetchMainServices as fetchMainServicesAction,
  fetchRetailPackageList as fetchRetailPackageListAction,
  fetchServiceMappings as fetchServiceMappingsAction,
  fetchSubServices as fetchSubServicesAction
} from './action';
import * as api from './api';
import { PACKAGE_TYPES } from './constants';
import { corporatePackageSubmitMappings, packageSubmitMappings, subPackageSubmitMappings } from './helper';
import { actions as sliceActions } from './slice';

export function* fetchPackageTypesSaga(action) {
  const { id } = action.payload || {};
  try {
    yield fork(handleAPIRequest, api.fetchPackageTypes, { id });
    const { payload: { data = [] } = {}, type } = yield take([
      API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_MASTER_PACKAGE_TYPE][1],
      API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_MASTER_PACKAGE_TYPE][2]
    ]);
    if (type === API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_MASTER_PACKAGE_TYPE][1]) {
      yield put(sliceActions.setPackageTypes(data));
    }
  } catch (error) {
    logger.error(error, 'fetchPackageTypesSaga');
  }
}

export function* fetchPlanTypesSaga() {
  try {
    yield fork(handleAPIRequest, api.fetchPlanTypes);
    const { payload: { data = [] } = {}, type } = yield take([
      API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_MASTER_PLAN_TYPE][1],
      API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_MASTER_PLAN_TYPE][2]
    ]);
    if (type === API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_MASTER_PLAN_TYPE][1]) {
      yield put(sliceActions.setPlanTypes(data));
    }
  } catch (error) {
    logger.error(error, 'fetchPlanTypesSaga');
  }
}

export function* fetchCategoryTypes(action) {
  const params = action.payload || {};
  try {
    yield fork(handleAPIRequest, api.fetchCategoryTypes, params);
    const { payload: { data = [] } = {}, type } = yield take([
      API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_MASTER_CATEGORY_TYPE][1],
      API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_MASTER_CATEGORY_TYPE][2]
    ]);
    if (type === API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_MASTER_CATEGORY_TYPE][1]) {
      yield put(sliceActions.setCategoryTypes(data));
    }
  } catch (error) {
    logger.error(error, 'fetchCategoryTypes');
  }
}

export function* fetchPackagePlanTypes() {
  try {
    yield fork(handleAPIRequest, api.fetchPackagePlanTypes);
    const { payload: { data = [] } = {}, type } = yield take([
      API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_MASTER_PACKAGE_PLAN_TYPE][1],
      API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_MASTER_PACKAGE_PLAN_TYPE][2]
    ]);
    if (type === API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_MASTER_PACKAGE_PLAN_TYPE][1]) {
      yield put(sliceActions.setPackagePlanTypes(data));
    }
  } catch (error) {
    logger.error(error, 'fetchPackagePlanTypes');
  }
}

export function* fetchFallbackSpeed() {
  try {
    yield fork(handleAPIRequest, api.fetchFallbackSpeed);
    const { payload: { data = [] } = {}, type } = yield take([
      API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_MASTER_FALLBACK_SPEED][1],
      API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_MASTER_FALLBACK_SPEED][2]
    ]);
    if (type === API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_MASTER_FALLBACK_SPEED][1]) {
      yield put(sliceActions.setFallbackSpeed(data));
    }
  } catch (error) {
    logger.error(error, 'fetchFallbackSpeed');
  }
}

export function* fetchSpeedProfile() {
  try {
    yield fork(handleAPIRequest, api.fetchSpeedProfile);
    const { payload: { data = [] } = {}, type } = yield take([
      API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_MASTER_SPEED_PROFILE][1],
      API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_MASTER_SPEED_PROFILE][2]
    ]);
    if (type === API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_MASTER_SPEED_PROFILE][1]) {
      yield put(sliceActions.setSpeedProfile(data));
    }
  } catch (error) {
    logger.error(error, 'fetchSpeedProfile');
  }
}

export function* fetchSubscriberProfile() {
  try {
    yield fork(handleAPIRequest, api.fetchSubscriberProfile);
    const { payload: { data = [] } = {}, type } = yield take([
      API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_MASTER_SUBSCRIBER_PROFILE][1],
      API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_MASTER_SUBSCRIBER_PROFILE][2]
    ]);
    if (type === API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_MASTER_SUBSCRIBER_PROFILE][1]) {
      yield put(sliceActions.setSubscriberProfile(data));
    }
  } catch (error) {
    logger.error(error, 'fetchSubscriberProfile');
  }
}

export function* submitPlanPackage({ payload = {} }) {
  try {
    const requestPayload = applyObjectMappings(payload, packageSubmitMappings, { copyUnmapped: true });

    const { type } = yield createSaga(
      requestPayload,
      api.submitPlanPackage,
      API_ACTION_TYPE_VARIANTS[ACTION_TYPES.SUBMIT_PLAN_PACKAGE]
    );

    if (type === API_ACTION_TYPE_VARIANTS[ACTION_TYPES.SUBMIT_PLAN_PACKAGE][1]) {
      yield put(sliceActions.setSubmitSuccess(true));
      router.navigate({ to: '/app/packages/package-list', search: { viewType: 'retail' } });
    }
  } catch (error) {
    logger.error(error, 'submitPlanPackage');
  }
}

export function* updatePlanPackage({ payload = {} }) {
  try {
    const requestPayload = applyObjectMappings(payload, packageSubmitMappings, { copyUnmapped: true });
    const { type } = yield updateSaga(
      requestPayload,
      api.updatePlanPackage,
      API_ACTION_TYPE_VARIANTS[ACTION_TYPES.UPDATE_PLAN_PACKAGE]
    );

    if (type === API_ACTION_TYPE_VARIANTS[ACTION_TYPES.UPDATE_PLAN_PACKAGE][1]) {
      yield put(sliceActions.setSubmitSuccess(true));
      router.navigate({ to: '/app/packages/package-list', search: { viewType: 'retail' } });
    }
  } catch (error) {
    logger.error(error, 'updatePlanPackage');
  }
}

export function* updatePlanStatus({ payload = {} }) {
  try {
    const { type } = yield updateSaga(
      payload,
      api.updatePlanStatus,
      API_ACTION_TYPE_VARIANTS[ACTION_TYPES.UPDATE_PLAN_STATUS]
    );
    if (type === API_ACTION_TYPE_VARIANTS[ACTION_TYPES.UPDATE_PLAN_STATUS][1]) {
      yield put(fetchRetailPackageListAction({ key: SERVER_SIDE_TABLE_KEYS.RETAIL_PACKAGES }));
    }
  } catch (error) {
    logger.error(error, 'updatePlanStatus');
  }
}

export function* submitPlanSubPackage({ payload: { details: payload = {} } = {} }) {
  try {
    const requestPayload = payload.subPackages.map((obj) =>
      applyObjectMappings(obj, subPackageSubmitMappings, { copyUnmapped: true })
    );

    const submitPayload = {
      subPackages: requestPayload,
      deletedSubPackageIds: payload.deletedSubPackageIds
    };

    const { type } = yield createSaga(
      submitPayload,
      api.submitPlanSubPackage,
      API_ACTION_TYPE_VARIANTS[ACTION_TYPES.SUBMIT_PLAN_SUB_PACKAGE]
    );
    if (type === API_ACTION_TYPE_VARIANTS[ACTION_TYPES.SUBMIT_PLAN_SUB_PACKAGE][1]) {
      router.navigate({ to: '/app/packages/package-list', search: { viewType: 'retail' } });
    }
  } catch (error) {
    logger.error(error, 'submitPlanSubPackage');
  }
}

export function* updatePlanSubPackage({ payload: { subPackageId, details = {} } = {} }) {
  try {
    const requestPayload = details.subPackages.map((obj) =>
      applyObjectMappings(obj, subPackageSubmitMappings, { copyUnmapped: true })
    );

    let allSuccess = true;
    for (const subPkg of requestPayload) {
      const { type } = yield createSaga(
        { subPackageId: subPkg.subPackageId || subPackageId, details: subPkg },
        api.updatePlanSubPackage,
        API_ACTION_TYPE_VARIANTS[ACTION_TYPES.UPDATE_PLAN_SUB_PACKAGE]
      );
      if (type !== API_ACTION_TYPE_VARIANTS[ACTION_TYPES.UPDATE_PLAN_SUB_PACKAGE][1]) {
        allSuccess = false;
        break;
      }
    }

    if (allSuccess) {
      router.navigate({ to: '/app/packages/package-list', search: { viewType: 'retail' } });
    }
  } catch (error) {
    logger.error(error, 'updatePlanSubPackage');
  }
}

export function* listFupList({ payload = {} }) {
  try {
    yield commonListSaga(payload, api.fetchFupList, API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_FUP_LIST]);
  } catch (error) {
    logger.error(error, 'listFupList');
  }
}

export function* downloadPackageCsv({ payload = {} }) {
  const { type } = payload;
  try {
    if (!type) {
      throw new Error('Package type is required to download CSV');
    }
    yield call(handleAPIRequest, api.downloadPlanCsvApi, {
      data: { type },
      fileName: type === PACKAGE_TYPES.FUP ? 'fup_packages.csv' : 'unlimited_packages.csv'
    });
  } catch (error) {
    logger.error(error, 'downloadPackageCsv');
  }
}

export function* fetchServiceTypes() {
  try {
    yield fork(handleAPIRequest, api.fetchServiceTypeList);
    const { payload: { data = [] } = {}, type } = yield take([
      API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_SERVICE_TYPE_LIST][1],
      API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_SERVICE_TYPE_LIST][2]
    ]);
    if (type === API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_SERVICE_TYPE_LIST][1]) {
      yield put(sliceActions.setServiceTypes(data));
    }
  } catch (error) {
    logger.error(error, 'fetchServiceTypes');
  }
}

export function* fetchRevenueShareList() {
  try {
    yield fork(handleAPIRequest, api.fetchRevenueShareList);
    const { payload: { data = [] } = {}, type } = yield take([
      API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_REVENUE_SHARE_LIST][1],
      API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_REVENUE_SHARE_LIST][2]
    ]);
    if (type === API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_REVENUE_SHARE_LIST][1]) {
      yield put(sliceActions.setRevenueShare(data));
    }
  } catch (error) {
    logger.error(error, 'fetchRevenueShareList');
  }
}

export function* fetchPackageDetailsById({ payload = {} }) {
  try {
    yield fork(handleAPIRequest, api.fetchPackageDetailsById, payload);
    const { payload: { data = {} } = {}, type } = yield take([
      API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_PACKAGE_DETAILS_BY_ID][1],
      API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_PACKAGE_DETAILS_BY_ID][2]
    ]);
    if (type === API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_PACKAGE_DETAILS_BY_ID][1]) {
      yield put(sliceActions.setPackagePlandetails(data));
    }
  } catch (error) {
    logger.error(error, 'fetchPackageDetailsById');
  }
}

export function* fetchSubpackagePlanList({ payload = {} }) {
  try {
    yield commonListSaga(
      payload,
      api.fetchSubpackagePlanList,
      API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_SUB_PACKAGE_LIST]
    );
  } catch (error) {
    logger.error(error, 'fetchSubpackagePlanList');
  }
}

export function* fetchCorporateServiceType() {
  try {
    yield fork(handleAPIRequest, api.fetchCorporateServiceType);
    const { payload: { data = [] } = {}, type } = yield take([
      API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_CORPORATE_SERVICE_TYPE][1],
      API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_CORPORATE_SERVICE_TYPE][2]
    ]);
    if (type === API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_CORPORATE_SERVICE_TYPE][1]) {
      yield put(sliceActions.setCorporateServiceType(data));
    }
  } catch (error) {
    logger.error(error, 'fetchCorporateServiceType');
  }
}

export function* fetchCorporateSubServiceType({ payload = {} }) {
  try {
    yield fork(handleAPIRequest, api.fetchCorporateSubServiceType, payload);
    const { payload: { data = [] } = {}, type } = yield take([
      API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_CORPORATE_SUB_SERVICE_TYPE][1],
      API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_CORPORATE_SUB_SERVICE_TYPE][2]
    ]);
    if (type === API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_CORPORATE_SUB_SERVICE_TYPE][1]) {
      yield put(sliceActions.setCorporateSubServiceType(data));
    }
  } catch (error) {
    logger.error(error, 'fetchCorporateSubServiceType');
  }
}

export function* submitCorporatePackage({ payload = {} }) {
  try {
    const requestPayload = applyObjectMappings(payload, corporatePackageSubmitMappings, { copyUnmapped: true });    

    const { type } = yield createSaga(
      requestPayload,
      api.submitCorporatePackage,
      API_ACTION_TYPE_VARIANTS[ACTION_TYPES.SUBMIT_CORPORATE_PACKAGE]
    );

    if (type === API_ACTION_TYPE_VARIANTS[ACTION_TYPES.SUBMIT_CORPORATE_PACKAGE][1]) {
      router.navigate({ to: '/app/packages/package-list', search: { viewType: 'corporate' } });
    }
  } catch (error) {
    logger.error(error, 'submitCorporatePackage');
  }
}

export function* updateCorporatePackage({ payload = {} }) {
  try {
    const requestPayload = applyObjectMappings(payload, corporatePackageSubmitMappings, { copyUnmapped: true });
    const { type } = yield updateSaga(
      requestPayload,
      api.updateCorporatePackage,
      API_ACTION_TYPE_VARIANTS[ACTION_TYPES.UPDATE_CORPORATE_PACKAGE]
    );

    if (type === API_ACTION_TYPE_VARIANTS[ACTION_TYPES.UPDATE_CORPORATE_PACKAGE][1]) {
      router.navigate({ to: '/app/packages/package-list', search: { viewType: 'corporate' } });
    }
  } catch (error) {
    logger.error(error, 'updateCorporatePackage');
  }
}

export function* fetchCorporatePackageById({ payload = {} }) {
  try {
    yield fork(handleAPIRequest, api.fetchCorporatePackageById, payload);
    const { payload: { data = null } = {}, type } = yield take([
      API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_CORPORATE_PACKAGE_BY_ID][1],
      API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_CORPORATE_PACKAGE_BY_ID][2]
    ]);
    if (type === API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_CORPORATE_PACKAGE_BY_ID][1]) {
      yield put(sliceActions.setCorporatePackageDetails(data));
    }
  } catch (error) {
    logger.error(error, 'fetchCorporatePackageById');
  }
}

export function* fetchCorporatePackageList(action) {
  const { key, ...params } = action.payload || {};
  try {
    const { response, error } = yield call(handleAPIRequest, api.fetchCorporatePackageList, params);
    if (response && !error && key) {
      yield call(setCommonPaginationResponse, key, response);
    }
  } catch (error) {
    logger.error(error, 'fetchCorporatePackageList');
  }
}

export function* fetchRetailPackageList(action) {
  const { key, ...params } = action.payload || {};
  try {
    const { response, error } = yield call(handleAPIRequest, api.fetchRetailPackageList, params);
    if (response && !error && key) {
      yield call(setCommonPaginationResponse, key, response);
    }
  } catch (error) {
    logger.error(error, 'fetchRetailPackageList');
  }
}

export function* fetchRetailServiceType({ payload = {} }) {
  try {
    yield fork(handleAPIRequest, api.fetchRetailServiceType, payload);
    const { payload: { data = [] } = {}, type } = yield take([
      API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_RETAIL_SERVICE_TYPE][1],
      API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_RETAIL_SERVICE_TYPE][2]
    ]);
    if (type === API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_RETAIL_SERVICE_TYPE][1]) {
      yield put(sliceActions.setRetailServiceType(data));
    }
  } catch (error) {
    logger.error(error, 'fetchRetailServiceType');
  }
}

export function* fetchServiceCategoryById({ payload = {} }) {
  try {
    yield fork(handleAPIRequest, api.fetchServiceCategoryById, payload);
    const { payload: { data = {} } = {}, type } = yield take([
      API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_SERVICE_CATEGORY_BY_ID][1],
      API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_SERVICE_CATEGORY_BY_ID][2]
    ]);
    if (type === API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_SERVICE_CATEGORY_BY_ID][1]) {
      yield put(sliceActions.setServiceCategoryById(data));
    }
  } catch (error) {
    logger.error(error, 'fetchServiceCategoryById');
  }
}

export function* fetchSubServiceTypes({ payload = {} }) {
  try {
    yield fork(handleAPIRequest, api.fetchSubserviceTypes, payload);
    const { payload: { data = [] } = {}, type } = yield take([
      API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_SUB_SERVICE_TYPES][1],
      API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_SUB_SERVICE_TYPES][2]
    ]);
    if (type === API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_SUB_SERVICE_TYPES][1]) {
      yield put(sliceActions.setSubServiceTypes(data));
    }
  } catch (error) {
    logger.error(error, 'fetchSubServiceTypes');
  }
}

export function* fetchPartnerType({ payload = {} }) {
  try {
    yield fork(handleAPIRequest, api.fetchPartnerType, payload);
    const { payload: { data = [] } = {}, type } = yield take([
      API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_PARTNER_TYPE][1],
      API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_PARTNER_TYPE][2]
    ]);
    if (type === API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_PARTNER_TYPE][1]) {
      yield put(sliceActions.setPartnerType(data));
    }
  } catch (error) {
    logger.error(error, 'fetchPartnerType');
  }
}

export function* fetchProvider({ payload = {} }) {
  try {
    yield fork(handleAPIRequest, api.fetchProvider, payload);
    const { payload: { data = [] } = {}, type } = yield take([
      API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_PROVIDER][1],
      API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_PROVIDER][2]
    ]);
    if (type === API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_PROVIDER][1]) {
      yield put(sliceActions.setProvider(data));
    }
  } catch (error) {
    logger.error(error, 'fetchProvider');
  }
}

export function* submitMainService({ payload = {} }) {
  try {
    const { type } = yield createSaga(
      payload,
      api.submitMainService,
      API_ACTION_TYPE_VARIANTS[ACTION_TYPES.SUBMIT_MAIN_SERVICE]
    );

    if (type === API_ACTION_TYPE_VARIANTS[ACTION_TYPES.SUBMIT_MAIN_SERVICE][1]) {
      yield put(sliceActions.setSubmitSuccess(true));
      yield put(
        fetchMainServicesAction({
          key: SERVER_SIDE_TABLE_KEYS.MAIN_SERVICES_TABLE,
          page: 0,
          size: 10,
          type: payload?.serviceCategoryType
        })
      );
    }
  } catch (error) {
    logger.error(error, 'submitMainService');
  }
}

export function* updateMainService({ payload = {} }) {
  try {
    const { type } = yield createSaga(
      payload,
      api.updateMainService,
      API_ACTION_TYPE_VARIANTS[ACTION_TYPES.UPDATE_MAIN_SERVICE]
    );

    if (type === API_ACTION_TYPE_VARIANTS[ACTION_TYPES.UPDATE_MAIN_SERVICE][1]) {
      yield put(sliceActions.setSubmitSuccess(true));
      yield put(
        fetchMainServicesAction({
          key: SERVER_SIDE_TABLE_KEYS.MAIN_SERVICES_TABLE,
          page: 0,
          size: 10,
          type: payload?.serviceCategoryType
        })
      );
    }
  } catch (error) {
    logger.error(error, 'updateMainService');
  }
}

export function* submitServiceMapping({ payload = {} }) {
  try {
    const { type } = yield createSaga(
      payload,
      api.submitServiceMapping,
      API_ACTION_TYPE_VARIANTS[ACTION_TYPES.SUBMIT_SERVICE_MAPPING]
    );

    if (type === API_ACTION_TYPE_VARIANTS[ACTION_TYPES.SUBMIT_SERVICE_MAPPING][1]) {
      yield put(sliceActions.setSubmitSuccess(true));
      yield put(
        fetchServiceMappingsAction({
          key: SERVER_SIDE_TABLE_KEYS.SERVICE_MAPPING_TABLE,
          page: 0,
          size: 10,
          type: payload?.serviceCategoryType
        })
      );
    }
  } catch (error) {
    logger.error(error, 'submitServiceMapping');
  }
}

export function* updateServiceMapping({ payload = {} }) {
  try {
    const { type } = yield createSaga(
      payload,
      api.updateServiceMapping,
      API_ACTION_TYPE_VARIANTS[ACTION_TYPES.UPDATE_SERVICE_MAPPING]
    );

    if (type === API_ACTION_TYPE_VARIANTS[ACTION_TYPES.UPDATE_SERVICE_MAPPING][1]) {
      yield put(sliceActions.setSubmitSuccess(true));
      yield put(
        fetchServiceMappingsAction({
          key: SERVER_SIDE_TABLE_KEYS.SERVICE_MAPPING_TABLE,
          page: 0,
          size: 10,
          type: payload?.serviceCategoryType
        })
      );
    }
  } catch (error) {
    logger.error(error, 'updateServiceMapping');
  }
}

export function* fetchServiceMappingsSaga(action) {
  const { key, ...params } = action.payload || {};
  try {
    const { response, error } = yield call(handleAPIRequest, api.fetchServiceMappings, params);
    if (response && !error && key) {
      yield call(setCommonPaginationResponse, key, response);
    }
  } catch (error) {
    logger.error(error, 'fetchServiceMappingsSaga');
  }
}

export function* fetchMainServices(action) {
  const { key, ...params } = action.payload || {};
  try {
    const { response, error } = yield call(handleAPIRequest, api.fetchMainServices, params);
    if (response && !error && key) {
      yield call(setCommonPaginationResponse, key, response);
    }
  } catch (error) {
    logger.error(error, 'fetchMainServices');
  }
}

export function* fetchDefaultPackageType({ payload = {} }) {
  try {
    yield fork(handleAPIRequest, api.fetchDefaultPackageType, payload);
    const { payload: { data = [] } = {}, type } = yield take([
      API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_DEFAULT_PACKAGE_TYPE][1],
      API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_DEFAULT_PACKAGE_TYPE][2]
    ]);
    if (type === API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_DEFAULT_PACKAGE_TYPE][1]) {
      yield put(sliceActions.setDefaultPackageType(data));
    }
  } catch (error) {
    logger.error(error, 'fetchDefaultPackageType');
  }
}

export function* fetchServiceCategoryLookup(action) {
  try {
    const { type } = action.payload || {};
    const { response, error } = yield call(handleAPIRequest, api.fetchServiceCategoryLookup, type);
    if (response && !error) {
      yield put(sliceActions.setServiceCategoryLookup(response.data));
    }
  } catch (error) {
    logger.error(error, 'fetchServiceCategoryLookup');
  }
}

export function* fetchSubServiceCategoryLookup() {
  try {
    const { response, error } = yield call(handleAPIRequest, api.fetchSubServiceCategoryLookup);
    if (response && !error) {
      yield put(sliceActions.setSubServiceCategoryLookup(response.data));
    }
  } catch (error) {
    logger.error(error, 'fetchSubServiceCategoryLookup');
  }
}

export function* submitSubService({ payload = {} }) {
  try {
    const { type } = yield createSaga(
      payload,
      api.submitSubService,
      API_ACTION_TYPE_VARIANTS[ACTION_TYPES.SUBMIT_SUB_SERVICE]
    );

    if (type === API_ACTION_TYPE_VARIANTS[ACTION_TYPES.SUBMIT_SUB_SERVICE][1]) {
      yield put(sliceActions.setSubmitSuccess(true));
      yield put(fetchSubServicesAction({ key: SERVER_SIDE_TABLE_KEYS.SUB_SERVICES_TABLE, page: 0, size: 10 }));
    }
  } catch (error) {
    logger.error(error, 'submitSubService');
  }
}

export function* updateSubService(action) {
  const { id, ...data } = action.payload || {};
  try {
    const { response, error } = yield call(handleAPIRequest, api.updateSubService, id, data);
    if (response && !error) {
      yield put(sliceActions.setSubmitSuccess(true));
      yield put(fetchSubServicesAction({ key: SERVER_SIDE_TABLE_KEYS.SUB_SERVICES_TABLE, page: 0, size: 10 }));
    }
  } catch (error) {
    logger.error(error, 'updateSubService');
  }
}

export function* fetchSubServices(action) {
  const { key, ...params } = action.payload || {};
  try {
    const { response, error } = yield call(handleAPIRequest, api.fetchSubServices, params);
    if (response && !error && key) {
      yield call(setCommonPaginationResponse, key, response);
    }
  } catch (error) {
    logger.error(error, 'fetchSubServices');
  }
}

export function* fetchSubPackageTypeLookup({ payload = {} }) {
  try {
    yield fork(handleAPIRequest, api.fetchSubPackageTypeLookup, payload);
    const { payload: { data = [] } = {}, type } = yield take([
      API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_SUB_PACKAGE_TYPE_LOOKUP][1],
      API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_SUB_PACKAGE_TYPE_LOOKUP][2]
    ]);
    if (type === API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_SUB_PACKAGE_TYPE_LOOKUP][1]) {
      yield put(sliceActions.setSubPackageTypeLookup(data));
    }
  } catch (error) {
    logger.error(error, 'fetchSubPackageTypeLookup');
  }
}

export function* fetchSubServiceById({ payload: id }) {
  try {
    yield fork(handleAPIRequest, api.fetchSubServiceById, id);
    const { payload: { data = null } = {}, type } = yield take([
      API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_SUB_SERVICE_BY_ID][1],
      API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_SUB_SERVICE_BY_ID][2]
    ]);
    if (type === API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_SUB_SERVICE_BY_ID][1]) {
      yield put(sliceActions.setSubServiceDetail(data));
    }
  } catch (error) {
    logger.error(error, 'fetchSubServiceById');
  }
}

export function* fetchServiceTypesLookup({ payload = {} }) {
  try {
    yield fork(handleAPIRequest, api.fetchServiceTypesLookup, payload);
    const { payload: { data = [] } = {}, type } = yield take([
      API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_SERVICE_TYPES_LOOKUP][1],
      API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_SERVICE_TYPES_LOOKUP][2]
    ]);
    if (type === API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_SERVICE_TYPES_LOOKUP][1]) {
      yield put(sliceActions.setServiceTypesLookup(data));
    }
  } catch (error) {
    logger.error(error, 'fetchServiceTypesLookup');
  }
}

export default function* packageSaga() {
  yield all([
    takeLatest(ACTION_TYPES.FETCH_MASTER_PACKAGE_TYPE, fetchPackageTypesSaga),
    takeLatest(ACTION_TYPES.FETCH_MASTER_PLAN_TYPE, fetchPlanTypesSaga),
    takeLatest(ACTION_TYPES.FETCH_MASTER_CATEGORY_TYPE, fetchCategoryTypes),
    takeLatest(ACTION_TYPES.FETCH_MASTER_PACKAGE_PLAN_TYPE, fetchPackagePlanTypes),
    takeLatest(ACTION_TYPES.FETCH_MASTER_FALLBACK_SPEED, fetchFallbackSpeed),
    takeLatest(ACTION_TYPES.FETCH_MASTER_SPEED_PROFILE, fetchSpeedProfile),
    takeLatest(ACTION_TYPES.FETCH_MASTER_SUBSCRIBER_PROFILE, fetchSubscriberProfile),
    takeLatest(ACTION_TYPES.SUBMIT_PLAN_PACKAGE, submitPlanPackage),
    takeLatest(ACTION_TYPES.FETCH_FUP_LIST, listFupList),
    takeLatest(ACTION_TYPES.DOWNLOAD_PLAN_PACKAGE_CSV, downloadPackageCsv),
    takeLatest(ACTION_TYPES.FETCH_SERVICE_TYPE_LIST, fetchServiceTypes),
    takeLatest(ACTION_TYPES.FETCH_REVENUE_SHARE_LIST, fetchRevenueShareList),
    takeLatest(ACTION_TYPES.FETCH_PACKAGE_DETAILS_BY_ID, fetchPackageDetailsById),
    takeLatest(ACTION_TYPES.SUBMIT_PLAN_SUB_PACKAGE, submitPlanSubPackage),
    takeLatest(ACTION_TYPES.UPDATE_PLAN_SUB_PACKAGE, updatePlanSubPackage),
    takeLatest(ACTION_TYPES.UPDATE_PLAN_PACKAGE, updatePlanPackage),
    takeLatest(ACTION_TYPES.UPDATE_PLAN_STATUS, updatePlanStatus),
    takeLatest(ACTION_TYPES.FETCH_SUB_PACKAGE_LIST, fetchSubpackagePlanList),
    takeLatest(ACTION_TYPES.FETCH_CORPORATE_SERVICE_TYPE, fetchCorporateServiceType),
    takeLatest(ACTION_TYPES.FETCH_CORPORATE_SUB_SERVICE_TYPE, fetchCorporateSubServiceType),
    takeLatest(ACTION_TYPES.SUBMIT_CORPORATE_PACKAGE, submitCorporatePackage),
    takeLatest(ACTION_TYPES.UPDATE_CORPORATE_PACKAGE, updateCorporatePackage),
    takeLatest(ACTION_TYPES.FETCH_CORPORATE_PACKAGE_BY_ID, fetchCorporatePackageById),
    takeLatest(ACTION_TYPES.FETCH_CORPORATE_PACKAGE_LIST, fetchCorporatePackageList),
    takeLatest(ACTION_TYPES.FETCH_RETAIL_PACKAGE_LIST, fetchRetailPackageList),
    takeLatest(ACTION_TYPES.FETCH_RETAIL_SERVICE_TYPE, fetchRetailServiceType),
    takeLatest(ACTION_TYPES.FETCH_SERVICE_CATEGORY_BY_ID, fetchServiceCategoryById),
    takeLatest(ACTION_TYPES.FETCH_SUB_SERVICE_TYPES, fetchSubServiceTypes),
    takeLatest(ACTION_TYPES.FETCH_PARTNER_TYPE, fetchPartnerType),
    takeLatest(ACTION_TYPES.FETCH_PROVIDER, fetchProvider),
    takeLatest(ACTION_TYPES.SUBMIT_MAIN_SERVICE, submitMainService),
    takeLatest(ACTION_TYPES.SUBMIT_SERVICE_MAPPING, submitServiceMapping),
    takeLatest(ACTION_TYPES.UPDATE_SERVICE_MAPPING, updateServiceMapping),
    takeLatest(ACTION_TYPES.FETCH_SERVICE_MAPPINGS, fetchServiceMappingsSaga),
    takeLatest(ACTION_TYPES.UPDATE_MAIN_SERVICE, updateMainService),
    takeLatest(ACTION_TYPES.FETCH_MAIN_SERVICES, fetchMainServices),
    takeLatest(ACTION_TYPES.FETCH_DEFAULT_PACKAGE_TYPE, fetchDefaultPackageType),
    takeLatest(ACTION_TYPES.FETCH_SERVICE_CATEGORY_LOOKUP, fetchServiceCategoryLookup),
    takeLatest(ACTION_TYPES.FETCH_SUB_SERVICE_CATEGORY_LOOKUP, fetchSubServiceCategoryLookup),
    takeLatest(ACTION_TYPES.FETCH_SUB_PACKAGE_TYPE_LOOKUP, fetchSubPackageTypeLookup),
    takeLatest(ACTION_TYPES.FETCH_SUB_SERVICE_BY_ID, fetchSubServiceById),
    takeLatest(ACTION_TYPES.SUBMIT_SUB_SERVICE, submitSubService),
    takeLatest(ACTION_TYPES.UPDATE_SUB_SERVICE, updateSubService),
    takeLatest(ACTION_TYPES.FETCH_SUB_SERVICES, fetchSubServices),
    takeLatest(ACTION_TYPES.FETCH_SERVICE_TYPES_LOOKUP, fetchServiceTypesLookup)
  ]);
}
