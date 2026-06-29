import { createSlice } from '@reduxjs/toolkit';
import { set } from 'lodash-es';

import { ACTION_TYPES, API_ACTION_TYPE_VARIANTS } from './action';
import { STATE_REDUCER_KEY } from './constants';

// Success payload is the Response wrapper ({ status, message, data }); unwrap to `data`.
const unwrap = (payload) => payload?.data ?? payload ?? null;

// Normalise a Spring Page into the shape the component consumes.
const toPage = (payload) => {
  const d = unwrap(payload) ?? {};
  return {
    content: Array.isArray(d) ? d : (d.content ?? []),
    totalElements: d.totalElements ?? (Array.isArray(d) ? d.length : 0),
    totalPages: d.totalPages ?? 1,
    number: d.number ?? 0,
    size: d.size ?? (Array.isArray(d) ? d.length : 0)
  };
};

const emptyPage = { content: [], totalElements: 0, totalPages: 1, number: 0, size: 0 };

const initialState = {
  statCards: null,
  summaryCards: null,
  onboardingEfficiency: null,
  longPendingNotOnboarded: emptyPage,
  longPendingLinkNotEstablished: emptyPage,
  enquiryPosition: emptyPage,
  districtSummary: [],
  activeList: emptyPage,
  isLoadingStatCards: false,
  isLoadingSummary: false,
  isLoadingEfficiency: false,
  isLoadingNotOnboarded: false,
  isLoadingLinkNotEstablished: false,
  isLoadingEnquiry: false,
  isLoadingDistrict: false,
  isLoadingActive: false,
  isDownloadingCsv: false
};

const slice = createSlice({
  initialState,
  name: STATE_REDUCER_KEY,
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_PARTNER_STAT_CARDS][0], (state) => {
        set(state, 'isLoadingStatCards', true);
      })
      .addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_PARTNER_STAT_CARDS][1], (state, { payload }) => {
        set(state, 'isLoadingStatCards', false);
        set(state, 'statCards', unwrap(payload));
      })
      .addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_PARTNER_STAT_CARDS][2], (state) => {
        set(state, 'isLoadingStatCards', false);
      });

    builder
      .addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_PARTNER_SUMMARY_CARDS][0], (state) => {
        set(state, 'isLoadingSummary', true);
      })
      .addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_PARTNER_SUMMARY_CARDS][1], (state, { payload }) => {
        set(state, 'isLoadingSummary', false);
        set(state, 'summaryCards', unwrap(payload));
      })
      .addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_PARTNER_SUMMARY_CARDS][2], (state) => {
        set(state, 'isLoadingSummary', false);
      });

    builder
      .addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_PARTNER_ONBOARDING_EFFICIENCY][0], (state) => {
        set(state, 'isLoadingEfficiency', true);
      })
      .addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_PARTNER_ONBOARDING_EFFICIENCY][1], (state, { payload }) => {
        set(state, 'isLoadingEfficiency', false);
        set(state, 'onboardingEfficiency', unwrap(payload));
      })
      .addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_PARTNER_ONBOARDING_EFFICIENCY][2], (state) => {
        set(state, 'isLoadingEfficiency', false);
      });

    builder
      .addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_PARTNER_LONG_PENDING_NOT_ONBOARDED][0], (state) => {
        set(state, 'isLoadingNotOnboarded', true);
      })
      .addCase(
        API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_PARTNER_LONG_PENDING_NOT_ONBOARDED][1],
        (state, { payload }) => {
          set(state, 'isLoadingNotOnboarded', false);
          set(state, 'longPendingNotOnboarded', toPage(payload));
        }
      )
      .addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_PARTNER_LONG_PENDING_NOT_ONBOARDED][2], (state) => {
        set(state, 'isLoadingNotOnboarded', false);
      });

    builder
      .addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_PARTNER_LONG_PENDING_LINK_NOT_ESTABLISHED][0], (state) => {
        set(state, 'isLoadingLinkNotEstablished', true);
      })
      .addCase(
        API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_PARTNER_LONG_PENDING_LINK_NOT_ESTABLISHED][1],
        (state, { payload }) => {
          set(state, 'isLoadingLinkNotEstablished', false);
          set(state, 'longPendingLinkNotEstablished', toPage(payload));
        }
      )
      .addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_PARTNER_LONG_PENDING_LINK_NOT_ESTABLISHED][2], (state) => {
        set(state, 'isLoadingLinkNotEstablished', false);
      });

    builder
      .addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_PARTNER_ENQUIRY_POSITION][0], (state) => {
        set(state, 'isLoadingEnquiry', true);
      })
      .addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_PARTNER_ENQUIRY_POSITION][1], (state, { payload }) => {
        set(state, 'isLoadingEnquiry', false);
        set(state, 'enquiryPosition', toPage(payload));
      })
      .addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_PARTNER_ENQUIRY_POSITION][2], (state) => {
        set(state, 'isLoadingEnquiry', false);
      });

    builder
      .addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_PARTNER_DISTRICT_SUMMARY][0], (state) => {
        set(state, 'isLoadingDistrict', true);
      })
      .addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_PARTNER_DISTRICT_SUMMARY][1], (state, { payload }) => {
        set(state, 'isLoadingDistrict', false);
        const d = unwrap(payload);
        set(state, 'districtSummary', Array.isArray(d) ? d : []);
      })
      .addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_PARTNER_DISTRICT_SUMMARY][2], (state) => {
        set(state, 'isLoadingDistrict', false);
      });

    builder
      .addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_PARTNER_ACTIVE_LIST][0], (state) => {
        set(state, 'isLoadingActive', true);
      })
      .addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_PARTNER_ACTIVE_LIST][1], (state, { payload }) => {
        set(state, 'isLoadingActive', false);
        set(state, 'activeList', toPage(payload));
      })
      .addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_PARTNER_ACTIVE_LIST][2], (state) => {
        set(state, 'isLoadingActive', false);
      });

    builder
      .addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.DOWNLOAD_PARTNER_ACTIVE_CSV][0], (state) => {
        set(state, 'isDownloadingCsv', true);
      })
      .addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.DOWNLOAD_PARTNER_ACTIVE_CSV][1], (state) => {
        set(state, 'isDownloadingCsv', false);
      })
      .addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.DOWNLOAD_PARTNER_ACTIVE_CSV][2], (state) => {
        set(state, 'isDownloadingCsv', false);
      });
  }
});

export const { actions, reducer } = slice;
