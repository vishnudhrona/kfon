import { createAction } from '@reduxjs/toolkit';

import { generateActionTypeVariants } from '@/utils/actionUtils';

import { STATE_REDUCER_KEY } from './constants';

const API_ACTION_TYPES = {
  FETCH_LNP_WALLET: `${STATE_REDUCER_KEY}/FETCH_LNP_WALLET`,
  EXPORT_LNP_WALLET_CSV: `${STATE_REDUCER_KEY}/EXPORT_LNP_WALLET_CSV`,
  FETCH_SUBSCRIBER_WALLET: `${STATE_REDUCER_KEY}/FETCH_SUBSCRIBER_WALLET`,
  FETCH_AGNP_WALLET: `${STATE_REDUCER_KEY}/FETCH_AGNP_WALLET`
};

export const ACTION_TYPES = { ...API_ACTION_TYPES };

export const API_ACTION_TYPE_VARIANTS = generateActionTypeVariants(API_ACTION_TYPES);

export const fetchLNPWallet = createAction(ACTION_TYPES.FETCH_LNP_WALLET);
export const exportLNPWalletCsv = createAction(ACTION_TYPES.EXPORT_LNP_WALLET_CSV);
export const fetchSubscriberWallet = createAction(ACTION_TYPES.FETCH_SUBSCRIBER_WALLET);
export const fetchAGNPWallet = createAction(ACTION_TYPES.FETCH_AGNP_WALLET);
