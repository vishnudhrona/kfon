import { flow } from 'lodash-es';

import { SERVER_SIDE_TABLE_KEYS } from '@/constants/server_table';

import { STATE_REDUCER_KEY } from './constants';

const invoiceReportsKey = (state) => state[STATE_REDUCER_KEY];

const lnpSummaryDetails = (state) => ({ data: state?.invoiceReports?.formData?.[SERVER_SIDE_TABLE_KEYS.LNP_SUMMARY_DETAILS_TABLE] || [] });
export const getLNPSummaryDetails = flow(invoiceReportsKey, lnpSummaryDetails);

const lnpSummaryCorporate = (state) => ({ data: state?.invoiceReports?.formData?.[SERVER_SIDE_TABLE_KEYS.LNP_SUMMARY_CORPORATE_TABLE] || [] });
export const getLNPSummaryCorporate = flow(invoiceReportsKey, lnpSummaryCorporate);

const gstinStatusLnp = (state) => ({ data: state?.invoiceReports?.formData?.[SERVER_SIDE_TABLE_KEYS.GSTIN_STATUS_LNP_TABLE] || [] });
export const getGSTINStatusLNP = flow(invoiceReportsKey, gstinStatusLnp);

const subscriberSummaryDetails = (state) => ({ data: state?.invoiceReports?.formData?.[SERVER_SIDE_TABLE_KEYS.SUBSCRIBER_SUMMARY_DETAILS_TABLE] || [] });
export const getSubscriberSummaryDetails = flow(invoiceReportsKey, subscriberSummaryDetails);

const lnpSpecialIncentive = (state) => ({ data: state?.invoiceReports?.formData?.[SERVER_SIDE_TABLE_KEYS.LNP_SPECIAL_INCENTIVE_TABLE] || [] });
export const getLNPSpecialIncentive = flow(invoiceReportsKey, lnpSpecialIncentive);

const agnpSummary = (state) => ({ data: state?.invoiceReports?.formData?.[SERVER_SIDE_TABLE_KEYS.AGNP_SUMMARY_TABLE] || [] });
export const getAGNPSummary = flow(invoiceReportsKey, agnpSummary);

const invoiceWiseAgeingReport = (state) => ({ data: state?.invoiceReports?.formData?.[SERVER_SIDE_TABLE_KEYS.INVOICE_WISE_AGEING_REPORT_TABLE] || [] });
export const getInvoiceWiseAgeingReport = flow(invoiceReportsKey, invoiceWiseAgeingReport);

const invoicePaymentReport = (state) => ({ data: state?.invoiceReports?.formData?.[SERVER_SIDE_TABLE_KEYS.INVOICE_PAYMENT_REPORT_TABLE] || [] });
export const getInvoicePaymentReport = flow(invoiceReportsKey, invoicePaymentReport);

const retentionIncentiveReport = (state) => ({ data: state?.invoiceReports?.formData?.[SERVER_SIDE_TABLE_KEYS.RETENTION_INCENTIVE_REPORT_TABLE] || [] });
export const getRetentionIncentiveReport = flow(invoiceReportsKey, retentionIncentiveReport);

const corporateCustomerPayment = (state) => ({ data: state?.invoiceReports?.formData?.[SERVER_SIDE_TABLE_KEYS.CORPORATE_CUSTOMER_PAYMENT_TABLE] || [] });
export const getCorporateCustomerPayment = flow(invoiceReportsKey, corporateCustomerPayment);

const corporateInvoicePayment = (state) => ({ data: state?.invoiceReports?.formData?.[SERVER_SIDE_TABLE_KEYS.CORPORATE_INVOICE_PAYMENT_TABLE] || [] });
export const getCorporateInvoicePayment = flow(invoiceReportsKey, corporateInvoicePayment);
