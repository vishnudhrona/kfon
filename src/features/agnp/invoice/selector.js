import { flow } from 'lodash-es';

import { STATE_REDUCER_KEY } from './constants';

const agnpKey = (state) => state[STATE_REDUCER_KEY];

const approvalTableDetails = (state) => state.approval.tableData;
export const getApprovalTableData = flow(agnpKey, approvalTableDetails);

const summaryTableDetails = (state) => state.summary.tableData
export const getSummaryTableData = flow(agnpKey, summaryTableDetails)

const partnerFinanceTableDetails = (state) => state.partnerFinance.tableData
export const getPartnerFinanceTableData = flow(agnpKey, partnerFinanceTableDetails)

const invoiceTableDetails = (state) => state.invoice.tableData
export const getInvoiceTableData = flow(agnpKey, invoiceTableDetails)

const financeTransactionTableDetails = (state) => state.transaction.tableData
export const getFinanceTransactionTableData = flow(agnpKey, financeTransactionTableDetails)

const gstWalletTableDetails = (state) => state.gstWallet.tableData
export const getGstWalletTableData = flow(agnpKey, gstWalletTableDetails)

const lnpRevenueTableDetails = (state) => state.lnpRevenue.tableData
export const getLnpRevenueTableData = flow(agnpKey, lnpRevenueTableDetails)

const gstDetails = (state) => state.gstDetails.tableData
export const getGstDetailsData = flow(agnpKey, gstDetails)