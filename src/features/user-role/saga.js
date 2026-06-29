import { t } from 'i18next';
import { isEmpty } from 'lodash-es';
import { all, call, put, select, takeLatest } from 'redux-saga/effects';

import { successToast } from '@/components/custom/Toast';
import { SERVER_SIDE_TABLE_KEYS } from '@/constants/server_table';
import { setCommonPaginationResponse } from '@/features/others/Pagination/saga';
import { router } from '@/routes/routes';
import { selectorWithKey } from '@/utils/commonUtils';
import { handleAPIRequest } from '@/utils/httpUtils';
import { commonListSaga } from '@/utils/sagaUtils';

import { getServerSideData, getServerSidePaginationDetails } from '../others/Pagination/selectors';
import { actions as paginationActions } from '../others/Pagination/slice';
import { ACTION_TYPES, API_ACTION_TYPE_VARIANTS } from './action';
import * as api from './api';

export function* fetchRoleCreationMenu() {
  try {
    yield call(handleAPIRequest, api.fetchRoleMenuApi);
  } catch (error) {
    console.error(error);
  }
}

export function* fetchAllRole() {
  try {
    yield call(handleAPIRequest, api.fetchAllRoleApi);
  } catch (error) {
    console.error(error);
  }
}

export function* fetchBusinessUnit(action) {
  try {
    yield call(handleAPIRequest, api.fetchBusinessUnitApi, action?.payload);
  } catch (error) {
    console.error(error);
  }
}

export function* createUserSubmit(action) {
  try {
    const { onSuccess, ...payload } = action?.payload || {};
    const { response, error } = yield call(handleAPIRequest, api.createUserApi, payload);
    if (response && !error && isEmpty(response?.error)) {
      yield call(successToast, { description: response?.message || t('saveSuccess') });
      if (onSuccess) onSuccess();
      yield* fetchUserList({ payload: { key: SERVER_SIDE_TABLE_KEYS.USER_LIST_TABLE } });
    }
  } catch (error) {
    console.error(error);
  }
}

export function* updateUserSubmit(action) {
  try {
    const { onSuccess, ...payload } = action?.payload || {};
    const { response, error } = yield call(handleAPIRequest, api.updateUserApi, payload);
    if (response && !error && isEmpty(response?.error)) {
      yield call(successToast, { description: response?.message || t('saveSuccess') });
      if (onSuccess) onSuccess();

      yield* fetchUserList({ payload: { key: SERVER_SIDE_TABLE_KEYS.USER_LIST_TABLE } });
    }
  } catch (error) {
    console.error(error);
  }
}

export function* fetchUserList(action) {
  try {
    const { key, ...rest } = action.payload || {};
    const paginationDetails = yield select(getServerSidePaginationDetails);
    const { page, size } = selectorWithKey(paginationDetails, key) || {};
    let data = rest;
    if (page !== undefined && size !== undefined) {
      data = { page, size, ...rest };
    }
    const { response } = yield call(handleAPIRequest, api.fetchUserListApi, data);
    if (response && key) {
      yield call(setCommonPaginationResponse, key, response);
    }
  } catch (error) {
    console.error(error);
  }
}

export function* rolePermissionSubmit(action) {
  try {
    const { response, error } = yield call(handleAPIRequest, api.rolePermissionSubmitApi, action?.payload);
    if (response && !error && isEmpty(response?.error)) {
      yield call(successToast, { description: response?.message || t('saveSuccess') });
      router.navigate({ to: '/app/users/roles' });
    }
  } catch (error) {
    console.error(error);
  }
}

export function* fetchUserRoleList({ payload = {} }) {
  yield* commonListSaga(payload, api.fetchUserRoleListApi, API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_USER_ROLE_LIST]);
}

export function* fetchEditUserPermission({ payload = {} }) {
  try {
    const { response, error } = yield call(handleAPIRequest, api.fetchEditUserPermissionApi, payload);
    if (response && !error && isEmpty(response?.error)) {
      router.navigate({ to: '/app/users/roles/permission' });
    }
  } catch (error) {
    console.error(error);
  }
}

export function* downloadUserListCsv() {
  try {
    yield call(handleAPIRequest, api.downloadUserListCsvApi);
  } catch (error) {
    console.error(error);
  }
}

export function* downloadSeatListCsv() {
  try {
    yield call(handleAPIRequest, api.downloadSeatListCsvApi);
  } catch (error) {
    console.error(error);
  }
}

export function* downloadRoleListCsv() {
  try {
    yield call(handleAPIRequest, api.downloadRoleListCsvApi);
  } catch (error) {
    console.error(error);
  }
}

export function* updateRolePermission(action) {
  try {
    const { response, error } = yield call(handleAPIRequest, api.updateRolePermissionApi, action?.payload);
    if (response && !error && isEmpty(response?.error)) {
      yield call(successToast, { description: response?.message || t('saveSuccess') });
      router.navigate({ to: '/app/users/roles' });
    }
  } catch (error) {
    console.error(error);
  }
}

export function* userMappingSubmit(action) {
  try {
    const { onSuccess } = action?.payload || {};
    const { response, error } = yield call(handleAPIRequest, api.userMappingSubmitApi, action?.payload);
    if (response && !error && isEmpty(response?.error)) {
      yield call(successToast, { description: response?.message || t('saveSuccess') });
      if (onSuccess) onSuccess();
    }
  } catch (error) {
    console.error(error);
  }
}

export function* createSeatSubmit(action) {
  try {
    const { onSuccess } = action?.payload || {};
    const { response, error } = yield call(handleAPIRequest, api.createSeatSubmitApi, action?.payload);
    if (response && !error && isEmpty(response?.error)) {
      yield call(successToast, { description: response?.message || t('saveSuccess') });
      yield* fetchSeatList({ payload: { key: SERVER_SIDE_TABLE_KEYS.SEAT_LIST_TABLE } });
      if (onSuccess) onSuccess();
    }
  } catch (error) {
    console.error(error);
  }
}

export function* fetchOrganization() {
  try {
    yield call(handleAPIRequest, api.fetchOrganizationApi);
  } catch (error) {
    console.error(error);
  }
}

export function* fetchSeatList(action) {
  try {
    const { key, ...rest } = action.payload || {};
    const paginationDetails = yield select(getServerSidePaginationDetails);
    const { page, size } = selectorWithKey(paginationDetails, key) || {};
    let data = rest;
    if (page !== undefined && size !== undefined) {
      data = { page, size, ...rest };
    }
    const { response } = yield call(handleAPIRequest, api.fetchSeatListApi, data);
    if (response && key) {
      yield call(setCommonPaginationResponse, key, response);
    }
  } catch (error) {
    console.error(error);
  }
}

export function* fetchRoleByUser(action) {
  try {
    yield call(handleAPIRequest, api.fetchRoleByUserApi, action?.payload);
  } catch (error) {
    console.error(error);
  }
}

export function* linkUser(action) {
  try {
    const { onSuccess } = action?.payload || {};
    const { response, error } = yield call(handleAPIRequest, api.linkUserApi, action?.payload);
    if (response && !error && isEmpty(response?.error)) {
      yield call(successToast, { description: response?.message || t('saveSuccess') });
      yield* fetchSeatList({ payload: { key: SERVER_SIDE_TABLE_KEYS.SEAT_LIST_TABLE } });
      yield* fetchUnmappedUser();
      if (onSuccess) onSuccess();
    }
  } catch (error) {
    console.error(error);
  }
}

export function* fetchUnmappedUser(action) {
  try {
    yield call(handleAPIRequest, api.fetchUnmappedUserApi, action?.payload);
  } catch (error) {
    console.error(error);
  }
}

export function* fetchZone() {
  try {
    yield call(handleAPIRequest, api.fetchZoneApi);
  } catch (error) {
    console.error(error);
  }
}

export function* fetchSeatPermission(action) {
  try {
    yield call(handleAPIRequest, api.fetchSeatPermissionApi, action?.payload);
  } catch (error) {
    console.error(error);
  }
}

export function* updateUserMapping(action) {
  try {
    const { response, error } = yield call(handleAPIRequest, api.updateUserMappingApi, action?.payload);
    if (response && !error && isEmpty(response?.error)) {
      yield call(successToast, { description: response?.message || t('saveSuccess') });
      router.navigate({ to: '/app/users/seat-list' });
    }
  } catch (error) {
    console.error(error);
  }
}

export function* fetchPincodeByDistrictIds(action) {
  try {
    yield call(handleAPIRequest, api.fetchPincodeByDistrictIdsApi, action?.payload);
  } catch (error) {
    console.error(error);
  }
}

export function* submitPincodeMapping(action) {
  try {
    const { seatId, pincode, onSuccess } = action?.payload || {};
    const { response, error } = yield call(handleAPIRequest, api.submitPincodeMappingApi, { seatId, pincode });
    if (response && !error && isEmpty(response?.error)) {
      yield call(successToast, { description: response?.message || t('saveSuccess') });
      if (onSuccess) onSuccess();
      yield* fetchSeatList({ payload: { key: SERVER_SIDE_TABLE_KEYS.SEAT_LIST_TABLE } });
    }
  } catch (error) {
    console.error(error);
  }
}

export function* delinkUser(action) {
  try {
    const { seatUserId } = action?.payload || {};
    const { response, error } = yield call(handleAPIRequest, api.delinkUserApi, seatUserId);
    if (response && !error && isEmpty(response?.error)) {
      yield call(successToast, { description: response?.message || t('saveSuccess') });
      yield* fetchSeatList({ payload: { key: SERVER_SIDE_TABLE_KEYS.SEAT_LIST_TABLE } });
      yield* fetchUnmappedUser();
    }
  } catch (error) {
    console.error(error);
  }
}

export function* updateSeatSubmit(action) {
  try {
    const { onSuccess } = action?.payload || {};
    const { response, error } = yield call(handleAPIRequest, api.updateSeatSubmitApi, action?.payload);
    if (response && !error && isEmpty(response?.error)) {
      yield call(successToast, { description: response?.message || t('saveSuccess') });
      yield* fetchSeatList({ payload: { key: SERVER_SIDE_TABLE_KEYS.SEAT_LIST_TABLE } });
      if (onSuccess) onSuccess();
    }
  } catch (error) {
    console.error(error);
  }
}

export function* submitTemplate(action) {
  try {
    const { onSuccess, ...payload } = action?.payload || {};
    const { response, error } = yield call(handleAPIRequest, api.submitTemplateApi, payload);
    if (response && !error && isEmpty(response?.error)) {
      yield* fetchTemplateList({ payload: { key: SERVER_SIDE_TABLE_KEYS.TEMPLATE_LIST_TABLE } });
      yield call(successToast, { description: response?.message || t('saveSuccess') });
      if (onSuccess) onSuccess();
    }
  } catch (error) {
    console.error(error);
  }
}

export function* fetchTemplateList({ payload = {} }) {
  yield* commonListSaga(payload, api.fetchTemplateListApi, API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_TEMPLATE_LIST]);
}

export function* editTemplate(action) {
  try {
    const { onSuccess, ...payload } = action?.payload || {};
    const { response, error } = yield call(handleAPIRequest, api.editTemplateApi, payload);
    if (response && !error && isEmpty(response?.error)) {
      yield call(successToast, { description: response?.message || t('saveSuccess') });
      yield* fetchTemplateList({ payload: { key: SERVER_SIDE_TABLE_KEYS.TEMPLATE_LIST_TABLE } });
      if (onSuccess) onSuccess();
    }
  } catch (error) {
    console.error(error);
  }
}

export function* fetchDesignation() {
  try {
    yield call(handleAPIRequest, api.fetchDesignationApi);
  } catch (error) {
    console.error(error);
  }
}

export function* fetchMappedDist(action) {
  try {
    yield call(handleAPIRequest, api.fetchMappedDistApi, action?.payload);
  } catch (error) {
    console.error(error);
  }
}

export function* updatePincodeMapping(action) {
  try {
    const { seatId, pincode, onSuccess } = action?.payload || {};
    const { response, error } = yield call(handleAPIRequest, api.updatePincodeMappingApi, { seatId, pincode });
    if (response && !error && isEmpty(response?.error)) {
      yield call(successToast, { description: response?.message || t('saveSuccess') });
      if (onSuccess) onSuccess();
      yield* fetchSeatList({ payload: { key: SERVER_SIDE_TABLE_KEYS.SEAT_LIST_TABLE } });
    }
  } catch (error) {
    console.error(error);
  }
}

export function* fetchDesignationList({ payload = {} }) {
  if (payload.key === SERVER_SIDE_TABLE_KEYS.DESIGNATION_LIST_TABLE) {
    yield* commonListSaga(
      payload,
      api.fetchDesignationListApi,
      API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_DESIGNATION_LIST]
    );
  }
}

export function* createDesignationSubmit(action) {
  try {
    const { onSuccess, ...payload } = action?.payload || {};
    const { response, error } = yield call(handleAPIRequest, api.createDesignationSubmitApi, payload);
    if (response && !error && isEmpty(response?.error)) {
      yield call(successToast, { description: response?.message || t('saveSuccess') });
      yield* fetchDesignationList({ payload: { key: SERVER_SIDE_TABLE_KEYS.DESIGNATION_LIST_TABLE } });
      if (onSuccess) onSuccess();
    }
  } catch (error) {
    console.error(error);
  }
}

export function* createDivisionSubmit(action) {
  try {
    const { onSuccess, ...payload } = action?.payload || {};
    const { response, error } = yield call(handleAPIRequest, api.createDivisionSubmitApi, payload);
    if (response && !error && isEmpty(response?.error)) {
      yield call(successToast, { description: response?.message || t('saveSuccess') });
      yield* fetchDivisionList({ payload: { key: SERVER_SIDE_TABLE_KEYS.DIVISION_LIST_TABLE } });
      if (onSuccess) onSuccess();
    }
  } catch (error) {
    console.error(error);
  }
}

export function* fetchDivisionList({ payload = {} }) {
  yield* commonListSaga(payload, api.fetchDivisionListApi, API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_DIVISION_LIST]);
}

export function* fetchDivisionByOrganization(action) {
  try {
    yield call(handleAPIRequest, api.fetchDivisionByOrganizationApi, action?.payload);
  } catch (error) {
    console.error(error);
  }
}

export function* updateDivisionSubmit(action) {
  try {
    const { onSuccess, ...payload } = action?.payload || {};
    const { response, error } = yield call(handleAPIRequest, api.updateDivisionSubmitApi, payload);
    if (response && !error && isEmpty(response?.error)) {
      yield call(successToast, { description: response?.message || t('saveSuccess') });
      yield* fetchDivisionList({ payload: { key: SERVER_SIDE_TABLE_KEYS.DIVISION_LIST_TABLE } });
      if (onSuccess) onSuccess();
    }
  } catch (error) {
    console.error(error);
  }
}

export const updateDesignationSubmit = function* (action) {
  try {
    const { onSuccess, ...payload } = action?.payload || {};
    const { response, error } = yield call(handleAPIRequest, api.updateDesignationSubmitApi, payload);
    if (response && !error && isEmpty(response?.error)) {
      yield call(successToast, { description: response?.message || t('saveSuccess') });
      yield* fetchDesignationList({ payload: { key: SERVER_SIDE_TABLE_KEYS.DESIGNATION_LIST_TABLE } });
      if (onSuccess) onSuccess();
    }
  } catch (error) {
    console.error(error);
  }
};

export function* fetchWorkflowTypes() {
  try {
    yield call(handleAPIRequest, api.fetchWorkflowTypesApi);
  } catch (error) {
    console.error(error);
  }
}

export function* fetchWorkflowSubtypes(action) {
  try {
    yield call(handleAPIRequest, api.fetchWorkflowSubtypesApi, action?.payload);
  } catch (error) {
    console.error(error);
  }
}

export function* fetchSeatsByRoles(action) {
  try {
    yield call(handleAPIRequest, api.fetchSeatsByRolesApi, action?.payload);
  } catch (error) {
    console.error(error);
  }
}

export function* fetchFeLnpFeUsers(action) {
  try {
    yield call(handleAPIRequest, api.fetchFeLnpFeUsersApi, action?.payload);
  } catch (error) {
    console.error(error);
  }
}

export function* fetchFeLnpLnpUsers(action) {
  try {
    yield call(handleAPIRequest, api.fetchFeLnpLnpUsersApi, action?.payload);
  } catch (error) {
    console.error(error);
  }
}

export function* attachFeLnp(action) {
  try {
    const { onSuccess, ...payload } = action?.payload || {};
    const { response, error } = yield call(handleAPIRequest, api.attachFeLnpApi, payload);
    if (response && !error && isEmpty(response?.error)) {
      yield call(successToast, { description: response?.message || t('saveSuccess') });
      if (onSuccess) onSuccess();
    }
  } catch (error) {
    console.error(error);
  }
}

export function* detachFeLnp(action) {
  try {
    const { onSuccess, ...payload } = action?.payload || {};
    const { response, error } = yield call(handleAPIRequest, api.detachFeLnpApi, payload);
    if (response && !error && isEmpty(response?.error)) {
      yield call(successToast, { description: response?.message || t('saveSuccess') });
      if (onSuccess) onSuccess();
    }
  } catch (error) {
    console.error(error);
  }
}

export function* saveStageConfig(action) {
  try {
    const { onSuccess, ...payload } = action?.payload || {};
    const { response, error } = yield call(handleAPIRequest, api.saveStageConfigApi, payload);
    if (response && !error && isEmpty(response?.error)) {
      yield call(successToast, { description: response?.message || t('saveSuccess') });
      if (onSuccess) onSuccess(response?.data);
    }
  } catch (error) {
    console.error(error);
  }
}

export function* fetchStageConfig(action) {
  try {
    yield call(handleAPIRequest, api.fetchStageConfigApi, action?.payload);
  } catch (error) {
    console.error(error);
  }
}

export function* updateStageConfig(action) {
  try {
    const { onSuccess, ...payload } = action?.payload || {};
    const { response, error } = yield call(handleAPIRequest, api.updateStageConfigApi, payload);
    if (response && !error && isEmpty(response?.error)) {
      yield call(successToast, { description: response?.message || t('saveSuccess') });
      if (onSuccess) onSuccess(response?.data);
    }
  } catch (error) {
    console.error(error);
  }
}

export function* deleteStageConfig(action) {
  try {
    const { onSuccess, ...payload } = action?.payload || {};
    const { response, error } = yield call(handleAPIRequest, api.deleteStageConfigApi, payload);
    if (response && !error && isEmpty(response?.error)) {
      yield call(successToast, { description: response?.message || t('deleteSuccess') });
      if (onSuccess) onSuccess(response?.data);
    }
  } catch (error) {
    console.error(error);
  }
}

export const updateRoleStatus = function* (action) {
  try {
    const { id, active } = action?.payload || {};
    const { response, error } = yield call(handleAPIRequest, api.updateRoleStatusApi, action?.payload);
    if (response && !error && isEmpty(response?.error)) {
      yield call(successToast, { description: response?.message || t('saveSuccess') });

      const serverSideData = yield select(getServerSideData);
      const currentData = selectorWithKey(serverSideData, SERVER_SIDE_TABLE_KEYS.USER_ROLE_LIST_TABLE) || [];
      const updatedData = currentData.map((item) => (item.id === id ? { ...item, active } : item));

      yield put(
        paginationActions.setTableData({
          tableKey: SERVER_SIDE_TABLE_KEYS.USER_ROLE_LIST_TABLE,
          data: updatedData
        })
      );
    }
  } catch (error) {
    console.error(error);
  }
};

export default function* onboardingSaga() {
  yield all([
    takeLatest(ACTION_TYPES.ROLE_CREATION_MENU_FETCH, fetchRoleCreationMenu),
    takeLatest(ACTION_TYPES.FETCH_ALL_ROLE, fetchAllRole),
    takeLatest(ACTION_TYPES.FETCH_BUISINESS_UNIT, fetchBusinessUnit),
    takeLatest(ACTION_TYPES.CREATE_USER_SUBMIT, createUserSubmit),
    takeLatest(ACTION_TYPES.UPDATE_USER_SUBMIT, updateUserSubmit),
    takeLatest(ACTION_TYPES.USER_LIST_FETCH, fetchUserList),
    takeLatest(ACTION_TYPES.ROLE_PERMISSION_SUBMIT, rolePermissionSubmit),
    takeLatest(ACTION_TYPES.FETCH_USER_ROLE_LIST, fetchUserRoleList),
    takeLatest(ACTION_TYPES.FETCH_EDIT_USER_PERMISSION, fetchEditUserPermission),
    takeLatest(ACTION_TYPES.DOWNLOAD_USER_LIST_CSV, downloadUserListCsv),
    takeLatest(ACTION_TYPES.UPDATE_ROLE_PERMISSION, updateRolePermission),
    takeLatest(ACTION_TYPES.USER_MAPPING_SUBMIT, userMappingSubmit),
    takeLatest(ACTION_TYPES.CREATE_SEAT_SUBMIT, createSeatSubmit),
    takeLatest(ACTION_TYPES.UPDATE_SEAT_SUBMIT, updateSeatSubmit),
    takeLatest(ACTION_TYPES.FETCH_ORGANIZATION, fetchOrganization),
    takeLatest(ACTION_TYPES.FETCH_SEAT_LIST, fetchSeatList),
    takeLatest(ACTION_TYPES.FETCH_ROLE_BY_USER, fetchRoleByUser),
    takeLatest(ACTION_TYPES.LINK_USER, linkUser),
    takeLatest(ACTION_TYPES.FETCH_UNMAPPED_USER, fetchUnmappedUser),
    takeLatest(ACTION_TYPES.FETCH_ZONE, fetchZone),
    takeLatest(ACTION_TYPES.FETCH_SEAT_PERMISSION, fetchSeatPermission),
    takeLatest(ACTION_TYPES.UPDATE_USER_MAPPING, updateUserMapping),
    takeLatest(ACTION_TYPES.FETCH_PINCODE_BY_DISTRICT_IDS, fetchPincodeByDistrictIds),
    takeLatest(ACTION_TYPES.SUBMIT_PINCODE_MAPPING, submitPincodeMapping),
    takeLatest(ACTION_TYPES.DELINK_USER, delinkUser),
    takeLatest(ACTION_TYPES.SUBMIT_TEMPLATE, submitTemplate),
    takeLatest(ACTION_TYPES.FETCH_TEMPLATE_LIST, fetchTemplateList),
    takeLatest(ACTION_TYPES.EDIT_TEMPLATE, editTemplate),
    takeLatest(ACTION_TYPES.FETCH_DESIGNATION, fetchDesignation),
    takeLatest(ACTION_TYPES.FETCH_MAPPED_DIST, fetchMappedDist),
    takeLatest(ACTION_TYPES.UPDATE_PINCODE_MAPPING, updatePincodeMapping),
    takeLatest(ACTION_TYPES.DOWNLOAD_SEAT_LIST_CSV, downloadSeatListCsv),
    takeLatest(ACTION_TYPES.DOWNLOAD_ROLE_LIST_CSV, downloadRoleListCsv),
    takeLatest(ACTION_TYPES.FETCH_DESIGNATION_LIST, fetchDesignationList),
    takeLatest(ACTION_TYPES.CREATE_DESIGNATION_SUBMIT, createDesignationSubmit),
    takeLatest(ACTION_TYPES.UPDATE_DESIGNATION_SUBMIT, updateDesignationSubmit),
    takeLatest(ACTION_TYPES.UPDATE_ROLE_STATUS, updateRoleStatus),
    takeLatest(ACTION_TYPES.FETCH_WORKFLOW_TYPES, fetchWorkflowTypes),
    takeLatest(ACTION_TYPES.FETCH_WORKFLOW_SUBTYPES, fetchWorkflowSubtypes),
    takeLatest(ACTION_TYPES.FETCH_SEAT_BY_ROLES, fetchSeatsByRoles),
    takeLatest(ACTION_TYPES.SAVE_STAGE_CONFIG, saveStageConfig),
    takeLatest(ACTION_TYPES.FETCH_STAGE_CONFIG, fetchStageConfig),
    takeLatest(ACTION_TYPES.UPDATE_STAGE_CONFIG, updateStageConfig),
    takeLatest(ACTION_TYPES.DELETE_STAGE_CONFIG, deleteStageConfig),
    takeLatest(ACTION_TYPES.CREATE_DIVISION_SUBMIT, createDivisionSubmit),
    takeLatest(ACTION_TYPES.UPDATE_DIVISION_SUBMIT, updateDivisionSubmit),
    takeLatest(ACTION_TYPES.FETCH_DIVISION_LIST, fetchDivisionList),
    takeLatest(ACTION_TYPES.FETCH_DIVISION_BY_ORGANIZATION, fetchDivisionByOrganization),
    takeLatest(ACTION_TYPES.FETCH_FE_LNP_FE_USERS, fetchFeLnpFeUsers),
    takeLatest(ACTION_TYPES.FETCH_FE_LNP_LNP_USERS, fetchFeLnpLnpUsers),
    takeLatest(ACTION_TYPES.ATTACH_FE_LNP, attachFeLnp),
    takeLatest(ACTION_TYPES.DETACH_FE_LNP, detachFeLnp)
  ]);
}
