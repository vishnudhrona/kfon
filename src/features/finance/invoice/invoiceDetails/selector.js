import { flow } from 'lodash-es';

import { SERVER_SIDE_TABLE_KEYS } from '@/constants/server_table';

import { STATE_REDUCER_KEY } from './constants';

const invoiceDetailsKey = (state) => state[STATE_REDUCER_KEY];

const agnpCorporateInvoice = (state) => {
    const data = state?.invoiceDetails?.formData?.[SERVER_SIDE_TABLE_KEYS.AGNP_CORPORATE_INVOICE_TABLE] || [];
    return { data };
};
export const getAGNPCorporateInvoice = flow(invoiceDetailsKey, agnpCorporateInvoice);

const agnpRetailInvoice = (state) => {
    const data = state?.invoiceDetails?.formData?.[SERVER_SIDE_TABLE_KEYS.AGNP_RETAIL_INVOICE_TABLE] || [];
    return { data };
};
export const getAGNPRetailInvoice = flow(invoiceDetailsKey, agnpRetailInvoice);

const eoSubscriberInvoice = (state) => {
    const data = state?.invoiceDetails?.formData?.[SERVER_SIDE_TABLE_KEYS.EO_SUBSCRIBER_INVOICE_TABLE] || [];
    return { data };
};
export const getEOSubscriberInvoice = flow(invoiceDetailsKey, eoSubscriberInvoice);

const lnpCorporateInvoice = (state) => {
    const data = state?.invoiceDetails?.formData?.[SERVER_SIDE_TABLE_KEYS.LNP_CORPORATE_INVOICE_TABLE] || [];
    return { data };
};
export const getLNPCorporateInvoice = flow(invoiceDetailsKey, lnpCorporateInvoice);

const lnpCorporateOtcInvoice = (state) => {
    const data = state?.invoiceDetails?.formData?.[SERVER_SIDE_TABLE_KEYS.LNP_CORPORATE_OTC_INVOICE_TABLE] || [];
    return { data };
};
export const getLNPCorporateOTCInvoice = flow(invoiceDetailsKey, lnpCorporateOtcInvoice);

const lnpRetailInvoice = (state) => {
    const data = state?.invoiceDetails?.formData?.[SERVER_SIDE_TABLE_KEYS.LNP_RETAIL_INVOICE_TABLE] || [];
    return { data };
};
export const getLNPRetailInvoice = flow(invoiceDetailsKey, lnpRetailInvoice);

const mspBuOeInvoice = (state) => {
    const data = state?.invoiceDetails?.formData?.[SERVER_SIDE_TABLE_KEYS.MSP_BU_OE_INVOICE_TABLE] || [];
    return { data };
};
export const getMSPBuOeInvoice = flow(invoiceDetailsKey, mspBuOeInvoice);

const mspCorporateInvoice = (state) => {
    const data = state?.invoiceDetails?.formData?.[SERVER_SIDE_TABLE_KEYS.MSP_CORPORATE_INVOICE_TABLE] || [];
    return { data };
};
export const getMSPCorporateInvoice = flow(invoiceDetailsKey, mspCorporateInvoice);

const ontPurchaseInvoice = (state) => {
    const data = state?.invoiceDetails?.formData?.[SERVER_SIDE_TABLE_KEYS.ONT_PURCHASE_INVOICE_TABLE] || [];
    return { data };
};
export const getONTPurchaseInvoice = flow(invoiceDetailsKey, ontPurchaseInvoice);

const ottProviderInvoice = (state) => {
    const data = state?.invoiceDetails?.formData?.[SERVER_SIDE_TABLE_KEYS.OTT_PROVIDER_INVOICE_TABLE] || [];
    return { data };
};
export const getOTTProviderInvoice = flow(invoiceDetailsKey, ottProviderInvoice);

const subscriberBplInvoice = (state) => {
    const data = state?.invoiceDetails?.formData?.[SERVER_SIDE_TABLE_KEYS.SUBSCRIBER_BPL_INVOICE_TABLE] || [];
    return { data };
};
export const getSubscriberBPLInvoice = flow(invoiceDetailsKey, subscriberBplInvoice);

const subscriberInvoiceReports = (state) => {
    const data = state?.invoiceDetails?.formData?.[SERVER_SIDE_TABLE_KEYS.SUBSCRIBER_INVOICE_REPORTS_TABLE] || [];
    return { data };
};
export const getSubscriberInvoiceReports = flow(invoiceDetailsKey, subscriberInvoiceReports);
