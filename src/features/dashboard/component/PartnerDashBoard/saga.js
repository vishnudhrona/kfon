import { all, call, takeLatest } from 'redux-saga/effects';

import { handleAPIRequest } from '@/utils/httpUtils';

import { ACTION_TYPES } from './action';
import * as api from './api';

function* fetchPartnerStatCards({ payload }) {
  yield call(handleAPIRequest, api.fetchPartnerStatCardsApi, payload);
}

function* fetchPartnerSummaryCards({ payload }) {
  yield call(handleAPIRequest, api.fetchPartnerSummaryCardsApi, payload);
}

function* fetchPartnerOnboardingEfficiency({ payload }) {
  yield call(handleAPIRequest, api.fetchPartnerOnboardingEfficiencyApi, payload);
}

function* fetchPartnerLongPendingNotOnboarded({ payload }) {
  yield call(handleAPIRequest, api.fetchPartnerLongPendingNotOnboardedApi, payload);
}

function* fetchPartnerLongPendingLinkNotEstablished({ payload }) {
  yield call(handleAPIRequest, api.fetchPartnerLongPendingLinkNotEstablishedApi, payload);
}

function* fetchPartnerEnquiryPosition({ payload }) {
  yield call(handleAPIRequest, api.fetchPartnerEnquiryPositionApi, payload);
}

function* fetchPartnerDistrictSummary({ payload }) {
  yield call(handleAPIRequest, api.fetchPartnerDistrictSummaryApi, payload);
}

function* fetchPartnerActiveList({ payload }) {
  yield call(handleAPIRequest, api.fetchPartnerActiveListApi, payload);
}

function* downloadPartnerActiveCsv({ payload }) {
  yield call(handleAPIRequest, api.downloadPartnerActiveCsvApi, payload);
}

export default function* partnerDashboardSaga() {
  yield all([
    takeLatest(ACTION_TYPES.FETCH_PARTNER_STAT_CARDS, fetchPartnerStatCards),
    takeLatest(ACTION_TYPES.FETCH_PARTNER_SUMMARY_CARDS, fetchPartnerSummaryCards),
    takeLatest(ACTION_TYPES.FETCH_PARTNER_ONBOARDING_EFFICIENCY, fetchPartnerOnboardingEfficiency),
    takeLatest(ACTION_TYPES.FETCH_PARTNER_LONG_PENDING_NOT_ONBOARDED, fetchPartnerLongPendingNotOnboarded),
    takeLatest(ACTION_TYPES.FETCH_PARTNER_LONG_PENDING_LINK_NOT_ESTABLISHED, fetchPartnerLongPendingLinkNotEstablished),
    takeLatest(ACTION_TYPES.FETCH_PARTNER_ENQUIRY_POSITION, fetchPartnerEnquiryPosition),
    takeLatest(ACTION_TYPES.FETCH_PARTNER_DISTRICT_SUMMARY, fetchPartnerDistrictSummary),
    takeLatest(ACTION_TYPES.FETCH_PARTNER_ACTIVE_LIST, fetchPartnerActiveList),
    takeLatest(ACTION_TYPES.DOWNLOAD_PARTNER_ACTIVE_CSV, downloadPartnerActiveCsv)
  ]);
}
