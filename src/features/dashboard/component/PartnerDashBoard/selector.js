import { flow } from 'lodash-es';

import { STATE_REDUCER_KEY } from './constants';

const partnerDashboardState = (state) => state[STATE_REDUCER_KEY];

const emptyPage = { content: [], totalElements: 0, totalPages: 1, number: 0, size: 0 };

export const getPartnerStatCards = flow(partnerDashboardState, (s) => s?.statCards ?? null);
export const getPartnerSummaryCards = flow(partnerDashboardState, (s) => s?.summaryCards ?? null);
export const getPartnerOnboardingEfficiency = flow(partnerDashboardState, (s) => s?.onboardingEfficiency ?? null);
export const getPartnerLongPendingNotOnboarded = flow(
  partnerDashboardState,
  (s) => s?.longPendingNotOnboarded ?? emptyPage
);
export const getPartnerLongPendingLinkNotEstablished = flow(
  partnerDashboardState,
  (s) => s?.longPendingLinkNotEstablished ?? emptyPage
);
export const getPartnerEnquiryPosition = flow(partnerDashboardState, (s) => s?.enquiryPosition ?? emptyPage);
export const getPartnerDistrictSummary = flow(partnerDashboardState, (s) => s?.districtSummary ?? []);
export const getPartnerActiveList = flow(partnerDashboardState, (s) => s?.activeList ?? emptyPage);

export const getPartnerLoadingStatCards = flow(partnerDashboardState, (s) => s?.isLoadingStatCards ?? false);
export const getPartnerLoadingSummary = flow(partnerDashboardState, (s) => s?.isLoadingSummary ?? false);
export const getPartnerLoadingEfficiency = flow(partnerDashboardState, (s) => s?.isLoadingEfficiency ?? false);
export const getPartnerLoadingNotOnboarded = flow(partnerDashboardState, (s) => s?.isLoadingNotOnboarded ?? false);
export const getPartnerLoadingLinkNotEstablished = flow(
  partnerDashboardState,
  (s) => s?.isLoadingLinkNotEstablished ?? false
);
export const getPartnerLoadingEnquiry = flow(partnerDashboardState, (s) => s?.isLoadingEnquiry ?? false);
export const getPartnerLoadingDistrict = flow(partnerDashboardState, (s) => s?.isLoadingDistrict ?? false);
export const getPartnerLoadingActive = flow(partnerDashboardState, (s) => s?.isLoadingActive ?? false);
export const getPartnerDownloadingCsv = flow(partnerDashboardState, (s) => s?.isDownloadingCsv ?? false);
