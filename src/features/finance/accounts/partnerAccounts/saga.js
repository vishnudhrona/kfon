import { all, call, put, select, takeLatest } from 'redux-saga/effects';

import { SERVER_SIDE_TABLE_KEYS } from '@/constants/server_table';
import { setCommonPaginationResponse } from '@/features/others/Pagination/saga';
import { getServerSidePaginationDetails } from '@/features/others/Pagination/selectors';
import { selectorWithKey } from '@/utils/commonUtils';
import { handleAPIRequest } from '@/utils/httpUtils';

import { ACTION_TYPES } from './action';
import * as api from './api';
import { actions as sliceActions } from './slice';

function* listSaga(action, apiFn) {
  const { payload: { key, isDropdown = false, ...data } = {} } = action;

  let payload = data;
  if (key && !isDropdown) {
    const paginationDetails = yield select(getServerSidePaginationDetails);
    const { page, size } = selectorWithKey(paginationDetails, key) || {};
    if (page !== undefined && size !== undefined) {
      payload = { page, size, ...payload };
    }
  }
  const { response } = yield call(handleAPIRequest, apiFn, payload);

  if (key && response) {
    if (!isDropdown) {
      yield call(setCommonPaginationResponse, key, response);
      yield put(sliceActions.updateFormData({ [key]: response?.data?.content || response?.data || response }));
    }
  }
  return response;
}

function* fetchCorporateSubscriberOnlineRecharge(action) {
  const { payload } = action;
  yield* listSaga(
    { ...action, payload: { ...payload, key: SERVER_SIDE_TABLE_KEYS.CORPORATE_SUBSCRIBER_ONLINE_RECHARGE_TABLE } },
    api.fetchCorporateSubscriberOnlineRechargeApi
  );
}

function* fetchLNPOnlineRecharge(action) {
  const { payload } = action;
  yield* listSaga(
    { ...action, payload: { filterType: 'ORDERED', ...payload, key: SERVER_SIDE_TABLE_KEYS.LNP_ONLINE_RECHARGE_TABLE } },
    api.fetchLNPOnlineRechargeApi
  );
}

function* fetchAGNPPartnerFinanceCorporate(action) {
  const { payload } = action;
  yield* listSaga(
    { ...action, payload: { ...payload, key: SERVER_SIDE_TABLE_KEYS.AGNP_PARTNER_FINANCE_CORPORATE_TABLE } },
    api.fetchAGNPPartnerFinanceCorporateApi
  );
}

function* fetchLNPPartnerFinanceCorporate(action) {
  const { payload } = action;
  yield* listSaga(
    { ...action, payload: { ...payload, key: SERVER_SIDE_TABLE_KEYS.LNP_PARTNER_FINANCE_CORPORATE_TABLE } },
    api.fetchLNPPartnerFinanceCorporateApi
  );
}

function* fetchPartnerAccountBalance(action) {
  const { payload } = action;
  yield* listSaga(
    { ...action, payload: { ...payload, key: SERVER_SIDE_TABLE_KEYS.PARTNER_ACCOUNT_BALANCE_TABLE } },
    api.fetchPartnerAccountBalanceApi
  );
}

function* fetchPartnerAccountDisbursement(action) {
  const { payload } = action;
  const key = SERVER_SIDE_TABLE_KEYS.PARTNER_ACCOUNT_DISBURSEMENT_TABLE;
  const { response } = yield call(handleAPIRequest, api.fetchPartnerAccountDisbursementApi, payload);
  if (response) {
    const disbData = response?.data;
    yield call(setCommonPaginationResponse, key, {
      totalElements: disbData?.totalElements,
      content: disbData?.content || [],
      pageable: { pageNumber: disbData?.page || 0, pageSize: disbData?.size || 10 }
    });
    yield put(sliceActions.updateFormData({
      [key]: disbData?.content || [],
      partnerDisbursementMeta: {
        month: disbData?.month,
        totalDisbursedRevenue: disbData?.totalDisbursedRevenue,
        revenueGeneratedAsBill: disbData?.revenueGeneratedAsBill
      }
    }));
  }
}

function* fetchOnePlusOne(action) {
  const { payload } = action;
  const key = SERVER_SIDE_TABLE_KEYS.ONE_PLUS_ONE_TABLE;
  const { response } = yield call(handleAPIRequest, api.fetchOnePlusOneApi, payload);
  if (response) {
    const data = response?.data;
    yield call(setCommonPaginationResponse, key, {
      totalElements: data?.totalElements,
      content: data?.content || [],
      pageable: {
        pageNumber: data?.pageable?.pageNumber ?? data?.page ?? 0,
        pageSize: data?.pageable?.pageSize ?? data?.size ?? 10
      }
    });
    yield put(sliceActions.updateFormData({
      [key]: data?.content || [],
      onePlusOneMeta: {
        month: data?.month,
        totalRevenue: data?.totalRevenue,
        totalKfc: data?.totalKfc,
        totalGst: data?.totalGst,
        totalElements: data?.totalElements
      }
    }));
  }
}

function* fetchPartnerAccountTopupReceipt(action) {
  const { payload } = action;
  yield* listSaga(
    { ...action, payload: { ...payload, key: SERVER_SIDE_TABLE_KEYS.PARTNER_ACCOUNT_TOPUP_RECEIPT_TABLE } },
    api.fetchPartnerAccountTopupReceiptApi
  );
}

function* fetchPartnerFinance(action) {
  const { payload } = action;
  yield* listSaga(
    { ...action, payload: { ...payload, key: SERVER_SIDE_TABLE_KEYS.PARTNER_FINANCE_TABLE } },
    api.fetchPartnerFinanceApi
  );
}

function* fetchSubscriberOnlineRecharge(action) {
  const { payload } = action;
  yield* listSaga(
    { ...action, payload: { ...payload, key: SERVER_SIDE_TABLE_KEYS.SUBSCRIBER_ONLINE_RECHARGE_TABLE } },
    api.fetchSubscriberOnlineRechargeApi
  );
}

export default function* partnerAccountSaga() {
  yield all([
    takeLatest(ACTION_TYPES.FETCH_CORPORATE_SUBSCRIBER_ONLINE_RECHARGE, fetchCorporateSubscriberOnlineRecharge),
    takeLatest(ACTION_TYPES.FETCH_LNP_ONLINE_RECHARGE, fetchLNPOnlineRecharge),
    takeLatest(ACTION_TYPES.FETCH_AGNP_PARTNER_FINANCE_CORPORATE, fetchAGNPPartnerFinanceCorporate),
    takeLatest(ACTION_TYPES.FETCH_LNP_PARTNER_FINANCE_CORPORATE, fetchLNPPartnerFinanceCorporate),
    takeLatest(ACTION_TYPES.FETCH_ONE_PLUS_ONE, fetchOnePlusOne),
    takeLatest(ACTION_TYPES.FETCH_PARTNER_ACCOUNT_BALANCE, fetchPartnerAccountBalance),
    takeLatest(ACTION_TYPES.FETCH_PARTNER_ACCOUNT_DISBURSEMENT, fetchPartnerAccountDisbursement),
    takeLatest(ACTION_TYPES.FETCH_PARTNER_ACCOUNT_TOPUP_RECEIPT, fetchPartnerAccountTopupReceipt),
    takeLatest(ACTION_TYPES.FETCH_PARTNER_FINANCE, fetchPartnerFinance),
    takeLatest(ACTION_TYPES.FETCH_SUBSCRIBER_ONLINE_RECHARGE, fetchSubscriberOnlineRecharge)
  ]);
}
