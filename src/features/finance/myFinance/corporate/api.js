import { API_URL } from '@/constants/urls';
import { createCommonFetchApi } from '@/utils/apiUtils';

import { ACTION_TYPES, API_ACTION_TYPE_VARIANTS } from './action';

const commonFetchApi = createCommonFetchApi(API_ACTION_TYPE_VARIANTS);

export const fetchFranchiseeCorporateInvoicesApi = (data = {}) =>
  commonFetchApi({
    url: API_URL.FINANCE.MY_FINANCE.CORPORATE.FETCH_CORPORATE_INVOICES,
    data,
    actionType: ACTION_TYPES.FETCH_FRANCHISEE_CORPORATE_INVOICES
  });

export const fetchOTCApprovalApi = (data = {}) =>
  commonFetchApi({
    url: API_URL.FINANCE.MY_FINANCE.CORPORATE.FETCH_OTC_APPROVAL,
    data,
    actionType: ACTION_TYPES.FETCH_OTC_APPROVAL
  });

export const fetchSubscriberDetailsApi = (data = {}) =>
  commonFetchApi({
    url: API_URL.FINANCE.MY_FINANCE.CORPORATE.FETCH_SUBSCRIBER_DETAILS,
    data,
    actionType: ACTION_TYPES.FETCH_SUBSCRIBER_DETAILS
  });

export const fetchLNPPartnerFinanceApi = (data = {}) =>
  commonFetchApi({
    url: API_URL.FINANCE.MY_FINANCE.CORPORATE.FETCH_LNP_PARTNER_FINANCE,
    data,
    actionType: ACTION_TYPES.FETCH_LNP_PARTNER_FINANCE
  });

export const fetchDisbursementApi = (data = {}) =>
  commonFetchApi({
    url: API_URL.FINANCE.MY_FINANCE.CORPORATE.FETCH_DISBURSEMENT,
    data,
    actionType: ACTION_TYPES.FETCH_DISBURSEMENT
  });

export const fetchLNPSummaryLocationApi = (data = {}) =>
  commonFetchApi({
    url: API_URL.FINANCE.MY_FINANCE.CORPORATE.FETCH_LNP_SUMMARY_LOCATION,
    data,
    actionType: ACTION_TYPES.FETCH_LNP_SUMMARY_LOCATION
  });

export const fetchLNPCreditNotesApi = (data = {}) =>
  commonFetchApi({
    url: API_URL.FINANCE.MY_FINANCE.CORPORATE.FETCH_LNP_CREDIT_NOTES,
    data,
    actionType: ACTION_TYPES.FETCH_LNP_CREDIT_NOTES
  });

export const fetchLNPCumulativeSummaryApi = (data = {}) =>
  commonFetchApi({
    url: API_URL.FINANCE.MY_FINANCE.CORPORATE.FETCH_LNP_CUMULATIVE_SUMMARY,
    data,
    actionType: ACTION_TYPES.FETCH_LNP_CUMULATIVE_SUMMARY
  });
