import { createAction } from '@reduxjs/toolkit';

import { generateActionTypeVariants } from '@/utils/actionUtils';

import { STATE_REDUCER_KEY } from './constants';

const API_ACTION_TYPES = {
  FETCH_RECHARGE_INSIGHTS: `${STATE_REDUCER_KEY}/FETCH_RECHARGE_INSIGHTS`,
  FETCH_SUBSCRIBER_RECHARGE: `${STATE_REDUCER_KEY}/FETCH_SUBSCRIBER_RECHARGE`,
  FETCH_PARTNER_RECHARGE: `${STATE_REDUCER_KEY}/FETCH_PARTNER_RECHARGE`
};

export const ACTION_TYPES = { ...API_ACTION_TYPES };

export const API_ACTION_TYPE_VARIANTS = generateActionTypeVariants(API_ACTION_TYPES);

export const fetchRechargeInsights = createAction(ACTION_TYPES.FETCH_RECHARGE_INSIGHTS);
export const fetchSubscriberRecharge = createAction(ACTION_TYPES.FETCH_SUBSCRIBER_RECHARGE);
export const fetchPartnerRecharge = createAction(ACTION_TYPES.FETCH_PARTNER_RECHARGE);
