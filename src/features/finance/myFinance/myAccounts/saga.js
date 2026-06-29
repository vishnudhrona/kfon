import { all, fork, put, take, takeLatest } from 'redux-saga/effects';

import { SERVER_SIDE_TABLE_KEYS } from '@/constants/server_table';
import { handleAPIRequest } from '@/utils/httpUtils';
import { commonListSaga } from '@/utils/sagaUtils';

import { ACTION_TYPES, API_ACTION_TYPE_VARIANTS } from './action';
import * as api from './api';
import { actions as sliceActions } from './slice';

function* fetchAccountTopupReceiptDetails(action) {
  const { payload } = action;
  yield* commonListSaga(
    { ...action, payload: { ...payload, key: SERVER_SIDE_TABLE_KEYS.ACCOUNT_TOPUP_RECEIPT_DETAILS_TABLE } },
    api.fetchAccountTopupReceiptDetailsApi
  );
}

function* fetchSubscriberAdvancedTopupVoucher(action) {
  const { payload } = action;
  yield* commonListSaga(
    { ...action, payload: { ...payload, key: SERVER_SIDE_TABLE_KEYS.SUBSCRIBER_ADVANCED_TOPUP_VOUCHER_TABLE } },
    api.fetchSubscriberAdvancedTopupVoucherApi
  );
}

function* fetchTransferredToSubscriber(action) {
  const { payload } = action;
  yield* commonListSaga(
    { ...action, payload: { ...payload, key: SERVER_SIDE_TABLE_KEYS.TRANSFERRED_TO_SUBSCRIBER_TABLE } },
    api.fetchTransferredToSubscriberApi
  );
}

function* fetchRevenue(action) {
  const { payload } = action;
  yield* commonListSaga(
    { ...action, payload: { ...payload, key: SERVER_SIDE_TABLE_KEYS.REVENUE_TABLE } },
    api.fetchRevenueApi
  );
}

function* fetchGSTWallet(action) {
  const { payload } = action;
  yield* commonListSaga(
    { ...action, payload: { ...payload, key: SERVER_SIDE_TABLE_KEYS.GST_WALLET_TABLE } },
    api.fetchGSTWalletApi
  );
}

function* fetchFinanceTransactions(action) {
  const { payload } = action;
  yield* commonListSaga(
    { ...action, payload: { ...payload, key: SERVER_SIDE_TABLE_KEYS.FINANCE_TRANSACTIONS_TABLE } },
    api.fetchFinanceTransactionsApi
  );
}

function* fetchSubscriberFinance(action) {
  const { payload } = action;
  yield* commonListSaga(
    { ...action, payload: { ...payload, key: SERVER_SIDE_TABLE_KEYS.SUBSCRIBER_FINANCE_TABLE } },
    api.fetchSubscriberFinanceApi
  );
}

function* fetchDisbursementDetails(action) {
  const { payload } = action;
  yield* commonListSaga(
    { ...action, payload: { ...payload, key: SERVER_SIDE_TABLE_KEYS.DISBURSEMENT_DETAILS_TABLE } },
    api.fetchDisbursementDetailsApi
  );
}

function* fetchSubscriberInvoice(action) {
  const { payload } = action;
  yield* commonListSaga(
    { ...action, payload: { ...payload, key: SERVER_SIDE_TABLE_KEYS.SUBSCRIBER_INVOICE_TABLE } },
    api.fetchSubscriberInvoiceApi
  );
}

function* fetchMonthlyLNPInvoice(action) {
  const { payload } = action;
  yield* commonListSaga(
    { ...action, payload: { ...payload, key: SERVER_SIDE_TABLE_KEYS.MONTHLY_LNP_INVOICE_TABLE } },
    api.fetchMonthlyLNPInvoiceApi
  );
}

function* fetchOnlineTransactionHistory(action) {
  const { payload } = action;
  yield* commonListSaga(
    { ...action, payload: { ...payload, key: SERVER_SIDE_TABLE_KEYS.ONLINE_TRANSACTION_HISTORY_TABLE } },
    api.fetchOnlineTransactionHistoryApi
  );
}

function* fetchSubscriberOnlineRecharge(action) {
  const { payload } = action;
  yield* commonListSaga(
    { ...action, payload: { ...payload, key: SERVER_SIDE_TABLE_KEYS.SUBSCRIBER_ONLINE_RECHARGE_TABLE } },
    api.fetchSubscriberOnlineRechargeApi
  );
}

function* submitOnlineTopupRecharge(action) {
  const { payload } = action;

  yield fork(handleAPIRequest, api.submitOnlineTopupRechargeApi, payload);

  const { payload: responsePayload = {}, type } = yield take([
    API_ACTION_TYPE_VARIANTS[ACTION_TYPES.SUBMIT_ONLINE_TOPUP_RECHARGE][1],
    API_ACTION_TYPE_VARIANTS[ACTION_TYPES.SUBMIT_ONLINE_TOPUP_RECHARGE][2]
  ]);

  if (type === API_ACTION_TYPE_VARIANTS[ACTION_TYPES.SUBMIT_ONLINE_TOPUP_RECHARGE][1]) {
    console.log('full data:', responsePayload?.data);
    const redirect = responsePayload?.data?.redirect;
    console.log('redirect:', JSON.stringify(redirect, null, 2));
    console.log('redirect.actionUrl:', redirect?.actionUrl);
    console.log('redirect.params:', redirect?.params);

    if (redirect?.actionUrl) {
      const { encRequest, access_code, ...rest } = redirect.params || {};
      const orderedParts = [
        encRequest ? `encRequest=${encodeURIComponent(encRequest)}` : null,
        access_code ? `access_code=${encodeURIComponent(access_code)}` : null,
        ...Object.entries(rest).map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
      ].filter(Boolean);
      const separator = redirect.actionUrl.includes('?') ? '&' : '?';
      const fullUrl = orderedParts.length
        ? `${redirect.actionUrl}${separator}${orderedParts.join('&')}`
        : redirect.actionUrl;
      console.log('navigating to:', fullUrl);
      window.location.href = fullUrl;
    }
  }
}

function* fetchAccountBalance(action) {
  const { payload } = action;

  yield fork(handleAPIRequest, api.fetchAccountBalanceApi, payload);

  const { payload: responsePayload = {}, type } = yield take([
    API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_ACCOUNT_BALANCE][1],
    API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_ACCOUNT_BALANCE][2]
  ]);

  if (type === API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_ACCOUNT_BALANCE][1]) {
    const data = responsePayload?.data;
    const balance = typeof data === 'number' ? data : (data?.balance ?? responsePayload?.balance ?? 0);
    yield put(sliceActions.setAccountBalance(balance));
  }
}

export default function* myAccountsSaga() {
  yield all([
    takeLatest(ACTION_TYPES.FETCH_ACCOUNT_TOPUP_RECEIPT_DETAILS, fetchAccountTopupReceiptDetails),
    takeLatest(ACTION_TYPES.FETCH_SUBSCRIBER_ADVANCED_TOPUP_VOUCHER, fetchSubscriberAdvancedTopupVoucher),
    takeLatest(ACTION_TYPES.FETCH_TRANSFERRED_TO_SUBSCRIBER, fetchTransferredToSubscriber),
    takeLatest(ACTION_TYPES.FETCH_REVENUE, fetchRevenue),
    takeLatest(ACTION_TYPES.FETCH_GST_WALLET, fetchGSTWallet),
    takeLatest(ACTION_TYPES.FETCH_FINANCE_TRANSACTIONS, fetchFinanceTransactions),
    takeLatest(ACTION_TYPES.FETCH_SUBSCRIBER_FINANCE, fetchSubscriberFinance),
    takeLatest(ACTION_TYPES.FETCH_DISBURSEMENT_DETAILS, fetchDisbursementDetails),
    takeLatest(ACTION_TYPES.FETCH_SUBSCRIBER_INVOICE, fetchSubscriberInvoice),
    takeLatest(ACTION_TYPES.FETCH_MONTHLY_LNP_INVOICE, fetchMonthlyLNPInvoice),
    takeLatest(ACTION_TYPES.FETCH_ONLINE_TRANSACTION_HISTORY, fetchOnlineTransactionHistory),
    takeLatest(ACTION_TYPES.FETCH_SUBSCRIBER_ONLINE_RECHARGE, fetchSubscriberOnlineRecharge),
    takeLatest(ACTION_TYPES.SUBMIT_ONLINE_TOPUP_RECHARGE, submitOnlineTopupRecharge),
    takeLatest(ACTION_TYPES.FETCH_ACCOUNT_BALANCE, fetchAccountBalance)
  ]);
}
