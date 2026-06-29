import { t } from 'i18next';
import { call, fork, put, take } from 'redux-saga/effects';

import { successToast } from '@/components/custom/Toast';
import {
  getCommonFilterDetails,
  getCommonPaginationDetails,
  getCommonSortDetails,
  setCommonPaginationResponse
} from '@/features/others/Pagination/saga';
import { actions as sliceActions } from '@/features/others/Pagination/slice';

import { handleAPIRequest } from './httpUtils';

export function* createSaga(payload, apiFn, actionTypes = []) {
  const additionalData = { title: t('success'), description: t('saveSuccess') };
  return yield* commonApiSAga(payload, apiFn, actionTypes, additionalData);
}

export function* updateSaga(payload, apiFn, actionTypes = []) {
  const additionalData = { title: t('success'), description: t('updateSuccess') };
  return yield* commonApiSAga(payload, apiFn, actionTypes, additionalData);
}

function* commonApiSAga(payload, apiFn, actionTypes, { title, description } = {}) {
  yield fork(handleAPIRequest, apiFn, payload);

  const { payload: { message = '', ...responseData } = {}, type } = yield take([actionTypes[1], actionTypes[2]]);

  if (type === actionTypes[1]) {
    yield call(successToast, { title: title || 'success', description: message || description || t('saveSuccess') });
  }
  return { type, responseData };
}

export function* commonListSaga(
  { key, isDropdown = false, ...data },
  apiFn,
  actionTypes = ['REQUEST', 'SUCCESS', 'FAILURE']
) {
  let payload = {};
  if (key && !isDropdown) {
    const pageDetails = yield getCommonPaginationDetails(key);
    payload = { ...pageDetails };
  }

  const sortDetails = yield getCommonSortDetails(key);
  const filterDetails = yield getCommonFilterDetails(key);

  payload = { ...payload, ...sortDetails, ...filterDetails, ...data };

  yield fork(handleAPIRequest, apiFn, payload);

  const { payload: response = {}, type } = yield take([actionTypes[1], actionTypes[2]]);

  if (type === actionTypes[1]) {
    if (key && response) {
      if (!isDropdown) {
        yield call(setCommonPaginationResponse, key, response);
      } else {
        yield put(sliceActions.setDropdownData({ tableKey: key, data: response?.data || response }));
      }
    }
  }
  return response;
}
