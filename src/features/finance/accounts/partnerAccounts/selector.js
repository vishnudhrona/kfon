import { flow } from 'lodash-es';

import { SERVER_SIDE_TABLE_KEYS } from '@/constants/server_table';

import { STATE_REDUCER_KEY } from './constants';

const partnerAccountsKey = (state) => state[STATE_REDUCER_KEY];

const corporateSubscriberOnlineRecharge = (state) => {
    const data = state?.partnerAccounts?.formData?.[SERVER_SIDE_TABLE_KEYS.CORPORATE_SUBSCRIBER_ONLINE_RECHARGE_TABLE] || [];
    return { data };
};
export const getCorporateSubscriberOnlineRecharge = flow(partnerAccountsKey, corporateSubscriberOnlineRecharge);

const lnpOnlineRecharge = (state) => {
    const data = state?.partnerAccounts?.formData?.[SERVER_SIDE_TABLE_KEYS.LNP_ONLINE_RECHARGE_TABLE] || [];
    return { data };
};
export const getLnpOnlineRecharge = flow(partnerAccountsKey, lnpOnlineRecharge);

const agnpPartnerFinanceCorporate = (state) => {
    const data = state?.partnerAccounts?.formData?.[SERVER_SIDE_TABLE_KEYS.AGNP_PARTNER_FINANCE_CORPORATE_TABLE] || [];
    return { data };
};
export const getAgnpPartnerFinanceCorporate = flow(partnerAccountsKey, agnpPartnerFinanceCorporate);

const lnpPartnerFinanceCorporate = (state) => {
    const data = state?.partnerAccounts?.formData?.[SERVER_SIDE_TABLE_KEYS.LNP_PARTNER_FINANCE_CORPORATE_TABLE] || [];
    return { data };
};
export const getLnpPartnerFinanceCorporate = flow(partnerAccountsKey, lnpPartnerFinanceCorporate);

const onePlusOne = (state) => {
    const data = state?.partnerAccounts?.formData?.[SERVER_SIDE_TABLE_KEYS.ONE_PLUS_ONE_TABLE] || [];
    return { data };
};
export const getOnePlusOne = flow(partnerAccountsKey, onePlusOne);

const onePlusOneMeta = (state) => {
    return state?.partnerAccounts?.formData?.onePlusOneMeta || {};
};
export const getOnePlusOneMeta = flow(partnerAccountsKey, onePlusOneMeta);

const partnerAccountBalance = (state) => {
    const data = state?.partnerAccounts?.formData?.[SERVER_SIDE_TABLE_KEYS.PARTNER_ACCOUNT_BALANCE_TABLE] || [];
    return { data };
};
export const getPartnerAccountBalance = flow(partnerAccountsKey, partnerAccountBalance);

const partnerAccountDisbursement = (state) => {
    const data = state?.partnerAccounts?.formData?.[SERVER_SIDE_TABLE_KEYS.PARTNER_ACCOUNT_DISBURSEMENT_TABLE] || [];
    return { data };
};
export const getPartnerAccountDisbursement = flow(partnerAccountsKey, partnerAccountDisbursement);

const partnerDisbursementMeta = (state) => {
    return state?.partnerAccounts?.formData?.partnerDisbursementMeta || {};
};
export const getPartnerDisbursementMeta = flow(partnerAccountsKey, partnerDisbursementMeta);

const partnerAccountTopupReceipt = (state) => {
    const data = state?.partnerAccounts?.formData?.[SERVER_SIDE_TABLE_KEYS.PARTNER_ACCOUNT_TOPUP_RECEIPT_TABLE] || [];
    return { data };
};
export const getPartnerAccountTopupReceipt = flow(partnerAccountsKey, partnerAccountTopupReceipt);

const partnerFinance = (state) => {
    const data = state?.partnerAccounts?.formData?.[SERVER_SIDE_TABLE_KEYS.PARTNER_FINANCE_TABLE] || [];
    return { data };
};
export const getPartnerFinance = flow(partnerAccountsKey, partnerFinance);

const subscriberOnlineRecharge = (state) => {
    const data = state?.partnerAccounts?.formData?.[SERVER_SIDE_TABLE_KEYS.SUBSCRIBER_ONLINE_RECHARGE_TABLE] || [];
    return { data };
};
export const getSubscriberOnlineRecharge = flow(partnerAccountsKey, subscriberOnlineRecharge);
