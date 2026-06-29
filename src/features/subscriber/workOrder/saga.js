import { t } from 'i18next';
import { all, call, fork, take, takeLatest } from 'redux-saga/effects';

import { successToast } from '@/components/custom/Toast';
import { handleAPIRequest } from '@/utils/httpUtils';
import { commonListSaga } from '@/utils/sagaUtils';

import { API_ACTION_TYPE_VARIANTS, API_ACTION_TYPES } from './actions';
import * as api from './api';

function* createWorkOrderSaga(action) {
  const { payload: { onSuccess, ...data } = {} } = action;

  yield fork(handleAPIRequest, api.createWorkOrderApi, data);

  const { payload: { message = '' } = {}, type } = yield take([
    API_ACTION_TYPE_VARIANTS[API_ACTION_TYPES.CREATE_WORK_ORDER][1],
    API_ACTION_TYPE_VARIANTS[API_ACTION_TYPES.CREATE_WORK_ORDER][2]
  ]);

  if (type === API_ACTION_TYPE_VARIANTS[API_ACTION_TYPES.CREATE_WORK_ORDER][1]) {
    yield call(successToast, {
      title: t('success'),
      description: message || t('workOrderCreatedSuccessfully')
    });
    onSuccess?.();
  }
}

function* fetchWorkOrderListSaga(action) {
  const { payload = {} } = action;
  yield commonListSaga(
    payload,
    api.fetchWorkOrderListApi,
    API_ACTION_TYPE_VARIANTS[API_ACTION_TYPES.FETCH_WORK_ORDER_LIST]
  );
}

function* fetchEwsPackagesSaga() {
  yield fork(handleAPIRequest, api.fetchEwsPackagesApi);
}

function* approveWorkOrderSaga(action) {
  const { payload: { onSuccess, ...data } = {} } = action;

  yield fork(handleAPIRequest, api.approveWorkOrderApi, data);

  const { payload: { message = '' } = {}, type } = yield take([
    API_ACTION_TYPE_VARIANTS[API_ACTION_TYPES.APPROVE_WORK_ORDER][1],
    API_ACTION_TYPE_VARIANTS[API_ACTION_TYPES.APPROVE_WORK_ORDER][2]
  ]);

  if (type === API_ACTION_TYPE_VARIANTS[API_ACTION_TYPES.APPROVE_WORK_ORDER][1]) {
    yield call(successToast, {
      title: t('success'),
      description: message || t('workOrderUpdatedSuccessfully')
    });
    onSuccess?.();
  }
}

function* fetchEwsWorkOrderDropdownSaga() {
  yield fork(handleAPIRequest, api.fetchEwsWorkOrderDropdownApi);
}

function* assignWorkOrderSaga(action) {
  const { payload: { onSuccess, ...data } = {} } = action;

  yield fork(handleAPIRequest, api.assignWorkOrderApi, data);

  const { payload: { message = '' } = {}, type } = yield take([
    API_ACTION_TYPE_VARIANTS[API_ACTION_TYPES.ASSIGN_WORK_ORDER][1],
    API_ACTION_TYPE_VARIANTS[API_ACTION_TYPES.ASSIGN_WORK_ORDER][2]
  ]);

  if (type === API_ACTION_TYPE_VARIANTS[API_ACTION_TYPES.ASSIGN_WORK_ORDER][1]) {
    yield call(successToast, {
      title: t('success'),
      description: message || t('workOrderAssignedSuccessfully')
    });
    onSuccess?.();
  }
}

export default function* rootSaga() {
  yield all([
    takeLatest(API_ACTION_TYPES.CREATE_WORK_ORDER, createWorkOrderSaga),
    takeLatest(API_ACTION_TYPES.FETCH_WORK_ORDER_LIST, fetchWorkOrderListSaga),
    takeLatest(API_ACTION_TYPES.FETCH_EWS_PACKAGES, fetchEwsPackagesSaga),
    takeLatest(API_ACTION_TYPES.APPROVE_WORK_ORDER, approveWorkOrderSaga),
    takeLatest(API_ACTION_TYPES.FETCH_EWS_WORK_ORDER_DROPDOWN, fetchEwsWorkOrderDropdownSaga),
    takeLatest(API_ACTION_TYPES.ASSIGN_WORK_ORDER, assignWorkOrderSaga)
  ]);
}
