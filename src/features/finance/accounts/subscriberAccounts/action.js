import { createAction } from '@reduxjs/toolkit';

import { generateActionTypeVariants } from '@/utils/actionUtils';

import { STATE_REDUCER_KEY } from './constants';

const API_ACTION_TYPES = {
  FETCH_SUBSCRIPTION_RENEWAL: `${STATE_REDUCER_KEY}/FETCH_SUBSCRIPTION_RENEWAL`,
  FETCH_SUBSCRIBER_FINANCE: `${STATE_REDUCER_KEY}/FETCH_SUBSCRIBER_FINANCE`,
  FETCH_SUBSCRIBER_PARTNER_TRANSFER: `${STATE_REDUCER_KEY}/FETCH_SUBSCRIBER_PARTNER_TRANSFER`,
  FETCH_SUBSCRIBER_ACCOUNT: `${STATE_REDUCER_KEY}/FETCH_SUBSCRIBER_ACCOUNT`
};

export const ACTION_TYPES = {
  ...API_ACTION_TYPES
};

export const API_ACTION_TYPE_VARIANTS = generateActionTypeVariants(API_ACTION_TYPES);

export const fetchSubscriptionRenewal = createAction(ACTION_TYPES.FETCH_SUBSCRIPTION_RENEWAL);
export const fetchSubscriberFinance = createAction(ACTION_TYPES.FETCH_SUBSCRIBER_FINANCE);
export const fetchSubscriberPartnerTransfer = createAction(ACTION_TYPES.FETCH_SUBSCRIBER_PARTNER_TRANSFER);
export const fetchSubscriberAccount = createAction(ACTION_TYPES.FETCH_SUBSCRIBER_ACCOUNT);
