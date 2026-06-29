import { t } from 'i18next';
import { all, call, put, takeEvery, takeLatest } from 'redux-saga/effects';

import { successToast } from '@/components/custom/Toast';
import { SERVER_SIDE_TABLE_KEYS } from '@/constants/server_table';
import { getCommonFilterDetails } from '@/features/others/Pagination/saga';
import { handleAPIRequest } from '@/utils/httpUtils';
import { commonListSaga } from '@/utils/sagaUtils';

import { ACTION_TYPES, API_ACTION_TYPE_VARIANTS } from './action';
import * as api from './api';
import { actions } from './slice';

export function* fetchRevenueShareList({ payload = {} }) {
  const response = yield* commonListSaga(
    payload,
    api.fetchRevenueShareListApi,
    API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_REVENUE_SHARE_LIST]
  );
  if (response) {
    yield put(actions.setRevenueShareList(response?.data?.content || response?.data || response));
  }
}

export function* fetchPartnerList(action) {
  const { type } = action.payload;
  const { response, error } = yield call(handleAPIRequest, api.partnerListApi, { partnerType: type });
  console.log(27, response);
  if (response && !error) {
    const data = response.data || response;
    if (type?.toUpperCase() === 'LNP') {
      yield put(actions.setPartnerLnpList(data));
    } else {
      yield put(actions.setPartnerList(data));
    }
  }
}

export function* submitNewGroupAssociation(action) {
  const { onSuccess, ...data } = action?.payload || {};
  const { response, error } = yield call(handleAPIRequest, api.submitNewGroupAssociationApi, data);
  if (response && !error) {
    yield call(successToast, { title: 'success', description: response?.message || t('saveSuccess') });
    if (onSuccess) {
      onSuccess();
    }
    yield* fetchRevenueShareList({ payload: { key: SERVER_SIDE_TABLE_KEYS.REVENUE_SHARE_TABLE } });
  }
}

// CSV export of the current filtered partner-group list
export function* downloadRevenueShareCsv() {
  const filters = yield call(getCommonFilterDetails, SERVER_SIDE_TABLE_KEYS.REVENUE_SHARE_TABLE);
  yield call(handleAPIRequest, api.downloadRevenueShareCsvApi, filters);
}

export default function* revenueShareSaga() {
  yield all([
    takeLatest(ACTION_TYPES.FETCH_REVENUE_SHARE_LIST, fetchRevenueShareList),
    takeEvery(ACTION_TYPES.FETCH_PARTNER_LIST, fetchPartnerList),
    takeLatest(ACTION_TYPES.SUBMIT_NEW_GROUP_ASSOCIATION, submitNewGroupAssociation),
    takeLatest(ACTION_TYPES.DOWNLOAD_REVENUE_SHARE_CSV, downloadRevenueShareCsv)
  ]);
}
