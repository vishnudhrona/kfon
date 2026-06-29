import { flow } from 'lodash-es';

import { SERVER_SIDE_TABLE_KEYS } from '@/constants/server_table';

import { STATE_REDUCER_KEY } from './constants';

const myAccountsKey = (state) => state[STATE_REDUCER_KEY];

const accountTopupReceiptDetails = (state) => {
  const data = state?.myAccounts?.formData?.[SERVER_SIDE_TABLE_KEYS.ACCOUNT_TOPUP_RECEIPT_DETAILS_TABLE] || [];
  return { data };
};

const subscriberAdvancedTopupVoucher = (state) => {
  const data = state?.myAccounts?.formData?.[SERVER_SIDE_TABLE_KEYS.SUBSCRIBER_ADVANCED_TOPUP_VOUCHER_TABLE] || [];
  return { data };
};

const transferredToSubscriber = (state) => {
  const data = state?.myAccounts?.formData?.[SERVER_SIDE_TABLE_KEYS.TRANSFERRED_TO_SUBSCRIBER_TABLE] || [];
  return { data };
};

const revenue = (state) => {
  const data = state?.myAccounts?.formData?.[SERVER_SIDE_TABLE_KEYS.REVENUE_TABLE] || [];
  return { data };
};

const accountBalance = (state) => state?.accountBalance || 0;

export const getAccountTopupReceiptDetails = flow(myAccountsKey, accountTopupReceiptDetails);
export const getSubscriberAdvancedTopupVoucher = flow(myAccountsKey, subscriberAdvancedTopupVoucher);
export const getTransferredToSubscriber = flow(myAccountsKey, transferredToSubscriber);
export const getRevenue = flow(myAccountsKey, revenue);
export const getAccountBalance = flow(myAccountsKey, accountBalance);
