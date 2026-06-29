import { flow } from 'lodash-es';

import { SERVER_SIDE_TABLE_KEYS } from '@/constants/server_table';

import { STATE_REDUCER_KEY } from './constants';

const statutoryKey = (state) => state[STATE_REDUCER_KEY];

const revenueControl = (state) => {
    const data = state?.statutory?.formData?.[SERVER_SIDE_TABLE_KEYS.REVENUE_CONTROL_TABLE] || [];
    return { data };
};
export const getRevenueControl = flow(statutoryKey, revenueControl);

const gstr2aPartners = (state) => {
    const data = state?.statutory?.formData?.[SERVER_SIDE_TABLE_KEYS.GSTR2A_PARTNERS_TABLE] || [];
    return { data };
};
export const getGstr2aPartners = flow(statutoryKey, gstr2aPartners);

const gstr1RetailCorporate = (state) => {
    const data = state?.statutory?.formData?.[SERVER_SIDE_TABLE_KEYS.GSTR1_RETAIL_CORPORATE_TABLE] || [];
    return { data };
};
export const getGstr1RetailCorporate = flow(statutoryKey, gstr1RetailCorporate);

const subInvoiceB2B = (state) => {
    const data = state?.statutory?.formData?.[SERVER_SIDE_TABLE_KEYS.SUB_INVOICE_B2B_TABLE] || [];
    return { data };
};
export const getSubInvoiceB2B = flow(statutoryKey, subInvoiceB2B);

const subInvoiceB2CRetails = (state) => {
    const data = state?.statutory?.formData?.[SERVER_SIDE_TABLE_KEYS.SUB_INVOICE_B2C_RETAILS_TABLE] || [];
    return { data };
};
export const getSubInvoiceB2CRetails = flow(statutoryKey, subInvoiceB2CRetails);

const subInvoiceB2BCorporate = (state) => {
    const data = state?.statutory?.formData?.[SERVER_SIDE_TABLE_KEYS.SUB_INVOICE_B2B_CORPORATE_TABLE] || [];
    return { data };
};
export const getSubInvoiceB2BCorporate = flow(statutoryKey, subInvoiceB2BCorporate);

const subInvoiceB2CCorporate = (state) => {
    const data = state?.statutory?.formData?.[SERVER_SIDE_TABLE_KEYS.SUB_INVOICE_B2C_CORPORATE_TABLE] || [];
    return { data };
};
export const getSubInvoiceB2CCorporate = flow(statutoryKey, subInvoiceB2CCorporate);

const nldReport = (state) => {
    const data = state?.statutory?.formData?.[SERVER_SIDE_TABLE_KEYS.NLD_REPORT_TABLE] || [];
    return { data };
};
export const getNldReport = flow(statutoryKey, nldReport);

const agrReport = (state) => {
    const data = state?.statutory?.formData?.[SERVER_SIDE_TABLE_KEYS.AGR_REPORT_TABLE] || [];
    return { data };
};
export const getAgrReport = flow(statutoryKey, agrReport);
