import { all, call, put, takeLatest } from 'redux-saga/effects';

import { SERVER_SIDE_TABLE_KEYS } from '@/constants/server_table';
import { setCommonPaginationResponse } from '@/features/others/Pagination/saga';
import { handleAPIRequest } from '@/utils/httpUtils';

import { ACTION_TYPES } from './action';
import * as api from './api';
import { actions as sliceActions } from './slice';

function* fetchLNPWallet(action) {
  const key = SERVER_SIDE_TABLE_KEYS.LNP_WALLET_REPORT_TABLE;
  const { response } = yield call(handleAPIRequest, api.fetchLNPWalletApi, action.payload || {});
  if (response) {
    yield call(setCommonPaginationResponse, key, response);
  }
}

function* fetchSubscriberWallet(action) {
  const key = SERVER_SIDE_TABLE_KEYS.SUBSCRIBER_WALLET_REPORT_TABLE;
  const { response } = yield call(handleAPIRequest, api.fetchSubscriberWalletApi, action.payload || {});
  if (response) {
    const data = response?.data;
    yield call(setCommonPaginationResponse, key, response);
    yield put(
      sliceActions.updateFormData({
        [key]: data?.content || data || [],
        subscriberWalletSummary: {
          totalSubscribers: data?.totalSubscribers,
          fundedWallets: data?.fundedWallets,
          zeroBalance: data?.zeroBalance,
          totalBalance: data?.totalBalance,
          fundedPct: data?.fundedPct
        }
      })
    );
  }
}

function* fetchAGNPWallet(action) {
  const key = SERVER_SIDE_TABLE_KEYS.AGNP_WALLET_REPORT_TABLE;
  const { response } = yield call(handleAPIRequest, api.fetchAGNPWalletApi, action.payload || {});
  if (response) {
    const data = response?.data;
    yield call(setCommonPaginationResponse, key, response);
    yield put(
      sliceActions.updateFormData({
        [key]: data?.content || data || [],
        agnpWalletSummary: {
          totalPartners: data?.totalPartners,
          fundedWallets: data?.fundedWallets,
          zeroBalance: data?.zeroBalance,
          totalBalance: data?.totalBalance,
          fundedPct: data?.fundedPct
        }
      })
    );
  }
}

function* exportLNPWalletCsv(action) {
  yield call(handleAPIRequest, api.exportLNPWalletCsvApi, action.payload || {});
}

export default function* walletReportsSaga() {
  yield all([
    takeLatest(ACTION_TYPES.FETCH_LNP_WALLET, fetchLNPWallet),
    takeLatest(ACTION_TYPES.EXPORT_LNP_WALLET_CSV, exportLNPWalletCsv),
    takeLatest(ACTION_TYPES.FETCH_SUBSCRIBER_WALLET, fetchSubscriberWallet),
    takeLatest(ACTION_TYPES.FETCH_AGNP_WALLET, fetchAGNPWallet)
  ]);
}
