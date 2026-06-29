import { API_URL } from '@/constants/urls';
import { createCommonFetchApi } from '@/utils/apiUtils';

import { ACTION_TYPES, API_ACTION_TYPE_VARIANTS } from './action';

const commonFetchApi = createCommonFetchApi(API_ACTION_TYPE_VARIANTS);

export const fetchAccountTopupReceiptDetailsApi = (data = {}) =>
  commonFetchApi({
    url: API_URL.FINANCE.MY_FINANCE.MY_ACCOUNTS.FETCH_ACCOUNT_TOPUP_RECEIPT_DETAILS,
    data,
    actionType: ACTION_TYPES.FETCH_ACCOUNT_TOPUP_RECEIPT_DETAILS
  });

export const fetchSubscriberAdvancedTopupVoucherApi = (data = {}) =>
  commonFetchApi({
    url: API_URL.FINANCE.MY_FINANCE.MY_ACCOUNTS.FETCH_SUBSCRIBER_ADVANCED_TOPUP_VOUCHER,
    data,
    actionType: ACTION_TYPES.FETCH_SUBSCRIBER_ADVANCED_TOPUP_VOUCHER
  });

export const fetchTransferredToSubscriberApi = (data = {}) =>
  commonFetchApi({
    url: API_URL.FINANCE.MY_FINANCE.MY_ACCOUNTS.FETCH_TRANSFERRED_TO_SUBSCRIBER,
    data,
    actionType: ACTION_TYPES.FETCH_TRANSFERRED_TO_SUBSCRIBER
  });

export const fetchRevenueApi = (data = {}) =>
  commonFetchApi({
    url: API_URL.FINANCE.MY_FINANCE.MY_ACCOUNTS.FETCH_REVENUE,
    data,
    actionType: ACTION_TYPES.FETCH_REVENUE
  });

export const fetchGSTWalletApi = (data = {}) =>
  commonFetchApi({
    url: API_URL.FINANCE.MY_FINANCE.MY_ACCOUNTS.FETCH_GST_WALLET,
    data,
    actionType: ACTION_TYPES.FETCH_GST_WALLET
  });

export const fetchFinanceTransactionsApi = (data = {}) =>
  commonFetchApi({
    url: API_URL.FINANCE.MY_FINANCE.MY_ACCOUNTS.FETCH_FINANCE_TRANSACTIONS,
    data,
    actionType: ACTION_TYPES.FETCH_FINANCE_TRANSACTIONS
  });

export const fetchSubscriberFinanceApi = (data = {}) =>
  commonFetchApi({
    url: API_URL.FINANCE.MY_FINANCE.MY_ACCOUNTS.FETCH_SUBSCRIBER_FINANCE,
    data,
    actionType: ACTION_TYPES.FETCH_SUBSCRIBER_FINANCE
  });

export const fetchDisbursementDetailsApi = (data = {}) =>
  commonFetchApi({
    url: API_URL.FINANCE.MY_FINANCE.MY_ACCOUNTS.FETCH_DISBURSEMENT_DETAILS,
    data,
    actionType: ACTION_TYPES.FETCH_DISBURSEMENT_DETAILS
  });

export const fetchSubscriberInvoiceApi = (data = {}) =>
  commonFetchApi({
    url: API_URL.FINANCE.MY_FINANCE.MY_ACCOUNTS.FETCH_SUBSCRIBER_INVOICE,
    data,
    actionType: ACTION_TYPES.FETCH_SUBSCRIBER_INVOICE
  });

export const fetchMonthlyLNPInvoiceApi = (data = {}) =>
  commonFetchApi({
    url: API_URL.FINANCE.MY_FINANCE.MY_ACCOUNTS.FETCH_MONTHLY_LNP_INVOICE,
    data,
    actionType: ACTION_TYPES.FETCH_MONTHLY_LNP_INVOICE
  });

export const fetchOnlineTransactionHistoryApi = (data = {}) =>
  commonFetchApi({
    url: API_URL.FINANCE.MY_FINANCE.MY_ACCOUNTS.FETCH_ONLINE_TRANSACTION_HISTORY,
    data,
    actionType: ACTION_TYPES.FETCH_ONLINE_TRANSACTION_HISTORY
  });

export const fetchSubscriberOnlineRechargeApi = (data = {}) =>
  commonFetchApi({
    url: API_URL.FINANCE.MY_FINANCE.MY_ACCOUNTS.FETCH_SUBSCRIBER_ONLINE_RECHARGE,
    data,
    actionType: ACTION_TYPES.FETCH_SUBSCRIBER_ONLINE_RECHARGE
  });

export const submitOnlineTopupRechargeApi = (data = {}) =>
  commonFetchApi({
    url: API_URL.FINANCE.MY_FINANCE.MY_ACCOUNTS.SUBMIT_ONLINE_TOPUP_RECHARGE,
    data,
    actionType: ACTION_TYPES.SUBMIT_ONLINE_TOPUP_RECHARGE,
    method: 'POST'
  });

export const fetchAccountBalanceApi = (data = {}) =>
  commonFetchApi({
    url: API_URL.FINANCE.MY_FINANCE.MY_ACCOUNTS.FETCH_ACCOUNT_BALANCE,
    data,
    actionType: ACTION_TYPES.FETCH_ACCOUNT_BALANCE
  });
