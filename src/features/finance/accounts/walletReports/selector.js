import { flow } from 'lodash-es';

import { SERVER_SIDE_TABLE_KEYS } from '@/constants/server_table';

import { STATE_REDUCER_KEY } from './constants';

const walletReportsKey = (state) => state[STATE_REDUCER_KEY];

const lnpWallet = (state) => state?.lnpWallet?.data || {};
export const getLNPWallet = flow(walletReportsKey, lnpWallet);

const lnpWalletSummary = (state) => state?.walletReports?.formData?.lnpWalletSummary || {};
export const getLNPWalletSummary = flow(walletReportsKey, lnpWalletSummary);

const subscriberWallet = (state) => {
  const data = state?.walletReports?.formData?.[SERVER_SIDE_TABLE_KEYS.SUBSCRIBER_WALLET_REPORT_TABLE] || [];
  return { data };
};
export const getSubscriberWallet = flow(walletReportsKey, subscriberWallet);

const subscriberWalletSummary = (state) => state?.walletReports?.formData?.subscriberWalletSummary || {};
export const getSubscriberWalletSummary = flow(walletReportsKey, subscriberWalletSummary);

const agnpWallet = (state) => {
  const data = state?.walletReports?.formData?.[SERVER_SIDE_TABLE_KEYS.AGNP_WALLET_REPORT_TABLE] || [];
  return { data };
};
export const getAGNPWallet = flow(walletReportsKey, agnpWallet);

const agnpWalletSummary = (state) => state?.walletReports?.formData?.agnpWalletSummary || {};
export const getAGNPWalletSummary = flow(walletReportsKey, agnpWalletSummary);
