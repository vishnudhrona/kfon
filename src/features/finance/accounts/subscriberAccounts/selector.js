import { flow } from 'lodash-es';

import { SERVER_SIDE_TABLE_KEYS } from '@/constants/server_table';

import { STATE_REDUCER_KEY } from './constants';

const subscriberAccountsKey = (state) => state[STATE_REDUCER_KEY];

const subscriptionRenewal = (state) => {
    const data = state?.subscriberAccounts?.formData?.[SERVER_SIDE_TABLE_KEYS.SUBSCRIPTION_RENEWAL_TABLE] || [];
    return { data };
};
export const getSubscriptionRenewal = flow(subscriberAccountsKey, subscriptionRenewal);

const subscriberFinance = (state) => {
    const data = state?.subscriberAccounts?.formData?.[SERVER_SIDE_TABLE_KEYS.SUBSCRIBER_FINANCE_TABLE] || [];
    return { data };
};
export const getSubscriberFinance = flow(subscriberAccountsKey, subscriberFinance);

const subscriberPartnerTransfer = (state) => {
    const data = state?.subscriberAccounts?.formData?.[SERVER_SIDE_TABLE_KEYS.SUBSCRIBER_PARTNER_TRANSFER_TABLE] || [];
    return { data };
};
export const getSubscriberPartnerTransfer = flow(subscriberAccountsKey, subscriberPartnerTransfer);

const subscriberAccount = (state) => {
    const data = state?.subscriberAccounts?.formData?.[SERVER_SIDE_TABLE_KEYS.SUBSCRIBER_ACCOUNT_TABLE] || [];
    return { data };
};
export const getSubscriberAccount = flow(subscriberAccountsKey, subscriberAccount);
