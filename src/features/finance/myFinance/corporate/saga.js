import { all, takeLatest } from 'redux-saga/effects';

import { SERVER_SIDE_TABLE_KEYS } from '@/constants/server_table';
import { commonListSaga } from '@/utils/sagaUtils';

import { ACTION_TYPES } from './action';
import * as api from './api';

function* fetchFranchiseeCorporateInvoices(action) {
  const { payload } = action;
  yield* commonListSaga(
    { ...action, payload: { ...payload, key: SERVER_SIDE_TABLE_KEYS.FRANCHISEE_CORPORATE_INVOICES_TABLE } },
    api.fetchFranchiseeCorporateInvoicesApi
  );
}

function* fetchOTCApproval(action) {
  const { payload } = action;
  yield* commonListSaga(
    { ...action, payload: { ...payload, key: SERVER_SIDE_TABLE_KEYS.OTC_APPROVAL_TABLE } },
    api.fetchOTCApprovalApi
  );
}

function* fetchSubscriberDetails(action) {
  const { payload } = action;
  yield* commonListSaga(
    { ...action, payload: { ...payload, key: SERVER_SIDE_TABLE_KEYS.SUBSCRIBER_DETAILS_TABLE } },
    api.fetchSubscriberDetailsApi
  );
}

function* fetchLNPPartnerFinance(action) {
  const { payload } = action;
  yield* commonListSaga(
    { ...action, payload: { ...payload, key: SERVER_SIDE_TABLE_KEYS.LNP_PARTNER_FINANCE_TABLE } },
    api.fetchLNPPartnerFinanceApi
  );
}

function* fetchDisbursement(action) {
  const { payload } = action;
  yield* commonListSaga(
    { ...action, payload: { ...payload, key: SERVER_SIDE_TABLE_KEYS.DISBURSEMENT_TABLE } },
    api.fetchDisbursementApi
  );
}

function* fetchLNPSummaryLocation(action) {
  const { payload } = action;
  yield* commonListSaga(
    { ...action, payload: { ...payload, key: SERVER_SIDE_TABLE_KEYS.LNP_SUMMARY_LOCATION_TABLE } },
    api.fetchLNPSummaryLocationApi
  );
}

function* fetchLNPCreditNotes(action) {
  const { payload } = action;
  yield* commonListSaga(
    { ...action, payload: { ...payload, key: SERVER_SIDE_TABLE_KEYS.LNP_CREDIT_NOTES_TABLE } },
    api.fetchLNPCreditNotesApi
  );
}

function* fetchLNPCumulativeSummary(action) {
  const { payload } = action;
  yield* commonListSaga(
    { ...action, payload: { ...payload, key: SERVER_SIDE_TABLE_KEYS.LNP_CUMULATIVE_SUMMARY_TABLE } },
    api.fetchLNPCumulativeSummaryApi
  );
}

export default function* myFinanceSaga() {
  yield all([
    takeLatest(ACTION_TYPES.FETCH_FRANCHISEE_CORPORATE_INVOICES, fetchFranchiseeCorporateInvoices),
    takeLatest(ACTION_TYPES.FETCH_OTC_APPROVAL, fetchOTCApproval),
    takeLatest(ACTION_TYPES.FETCH_SUBSCRIBER_DETAILS, fetchSubscriberDetails),
    takeLatest(ACTION_TYPES.FETCH_LNP_PARTNER_FINANCE, fetchLNPPartnerFinance),
    takeLatest(ACTION_TYPES.FETCH_DISBURSEMENT, fetchDisbursement),
    takeLatest(ACTION_TYPES.FETCH_LNP_SUMMARY_LOCATION, fetchLNPSummaryLocation),
    takeLatest(ACTION_TYPES.FETCH_LNP_CREDIT_NOTES, fetchLNPCreditNotes),
    takeLatest(ACTION_TYPES.FETCH_LNP_CUMULATIVE_SUMMARY, fetchLNPCumulativeSummary)
  ]);
}
