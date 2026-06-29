import { flow } from 'lodash-es';

import { SERVER_SIDE_TABLE_KEYS } from '@/constants/server_table';

import { STATE_REDUCER_KEY } from './constants';

const rechargeReportsKey = (state) => state[STATE_REDUCER_KEY];

const rechargeInsights = (state) => {
  const data = state?.rechargeReports?.formData?.[SERVER_SIDE_TABLE_KEYS.RECHARGE_INSIGHTS_TABLE] || [];
  return { data };
};
export const getRechargeInsights = flow(rechargeReportsKey, rechargeInsights);

const subscriberRecharge = (state) => {
  const data = state?.rechargeReports?.formData?.[SERVER_SIDE_TABLE_KEYS.SUBSCRIBER_RECHARGE_REPORT_TABLE] || [];
  return { data };
};
export const getSubscriberRecharge = flow(rechargeReportsKey, subscriberRecharge);

const partnerRecharge = (state) => {
  const data = state?.rechargeReports?.formData?.[SERVER_SIDE_TABLE_KEYS.PARTNER_RECHARGE_REPORT_TABLE] || [];
  return { data };
};
export const getPartnerRecharge = flow(rechargeReportsKey, partnerRecharge);
