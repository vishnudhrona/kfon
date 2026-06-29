import { t } from 'i18next';
import { isEmpty } from 'lodash-es';
import { all, call, put, select, takeLatest } from 'redux-saga/effects';

import { successToast } from '@/components/custom/Toast';
import { SERVER_SIDE_TABLE_KEYS } from '@/constants/server_table';
import { setCommonPaginationResponse } from '@/features/others/Pagination/saga';
import { getServerSidePaginationDetails } from '@/features/others/Pagination/selectors';
import { selectorWithKey } from '@/utils/commonUtils';
import { handleAPIRequest } from '@/utils/httpUtils';

import { ACTION_TYPES } from './action';
import * as api from './api';
import { actions as sliceActions } from './slice';

export function* fetchLnpListTableData(action) {
  try {
    const { key, ...rest } = action.payload || {};
    let partnerType = action.payload?.partnerType;

    if (!partnerType && key === SERVER_SIDE_TABLE_KEYS.AGNP_PARTNERS_LIST_TABLE) {
      partnerType = 'AGNP';
    } else if (!partnerType) {
      partnerType = 'LNP';
    }

    const paginationDetails = yield select(getServerSidePaginationDetails);
    const { page, size } = selectorWithKey(paginationDetails, key) || {};
    let data = { partnerType, ...rest };

    if (page !== undefined && size !== undefined) {
      data = { page, size, partnerType, ...rest };
    }

    const { response } = yield call(handleAPIRequest, api.lnpListTableDataApi, data);

    if (response && key) {
      yield put(sliceActions.setPartnerListData({ data: response?.data, partnerType }));
      const responseWithType = { ...response, partnerType };
      yield call(setCommonPaginationResponse, key, responseWithType);
    }
  } catch (error) {
    console.error(error);
  }
}

export function* fetchMandateFormTableData() {
  yield call(handleAPIRequest, api.mandateFormTableDataApi);
}

export function* fetchSingleOnboardingData(action) {
  const { response } = yield call(handleAPIRequest, api.singleOnboardingDataApi, action.payload);
  yield put(sliceActions.setSingleOnboardingData(response));
}

export function* resetPassword(action) {
  const { response, error } = yield call(handleAPIRequest, api.resetPasswordApi, action.payload);

  if (response && !error && isEmpty(response?.error)) {
    yield call(successToast, { title: 'success', description: response?.message || t('saveSuccess') });
  }
}

export function* downloadAgnpListCsv(action) {
  yield call(handleAPIRequest, api.downloadAgnpListCsvApi, action.payload);
}

export function* addServiceArea(action) {
  const { id, onSuccess, postOffices } = action?.payload || {};
  const { response, error } = yield call(handleAPIRequest, api.addServiceAreaApi, { id, postOffices});

  if (response && !error && (!response?.error || Object.keys(response.error).length === 0)) {
    yield call(successToast, { title: 'success', description: response?.message || t('saveSuccess') });
    if (onSuccess) {
      yield call(onSuccess);
    }
  }
}

export function* fetchOltDeviceList(action) {
  yield call(handleAPIRequest, api.fetchOltDeviceListApi, action.payload);  
}

export default function* agnpFranchiseesSaga() {
  yield all([
    takeLatest(ACTION_TYPES.FETCH_LNPLIST_TABLE_DATA, fetchLnpListTableData),
    takeLatest(ACTION_TYPES.FETCH_MANDATE_FROM_TABLE_DATA, fetchMandateFormTableData),
    takeLatest(ACTION_TYPES.FETCH_SINGLE_ONBOARDING_DATA, fetchSingleOnboardingData),
    takeLatest(ACTION_TYPES.RESET_PASSWORD, resetPassword),
    takeLatest(ACTION_TYPES.DOWNLOAD_AGNP_LIST_CSV, downloadAgnpListCsv),
    takeLatest(ACTION_TYPES.ADD_SERVICE_AREA, addServiceArea),
    takeLatest(ACTION_TYPES.FETCH_OLT_DEVICE_LIST, fetchOltDeviceList)
  ]);
}
