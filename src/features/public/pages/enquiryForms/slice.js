import { createSlice } from '@reduxjs/toolkit';
import { set } from 'lodash-es';

import { ACTION_TYPES, API_ACTION_TYPE_VARIANTS } from './action';
import { POST_OFFICES, STATE_REDUCER_KEY } from './constants';

const initialState = {
  formProgress: {
    steps: [],
    currentStep: 0
  },
  bplDetails: {
    formProps: {
      postOffices: POST_OFFICES
    },
    data: {},
    formStatus: {
      active: false,
      isLoading: false
    }
  },
  corpGovSubcriberSubmitDetails: {},
  homeSubscriberDraft: null,
  homeSubscriberSubmitDetails: {},
  agnpSubscriberSubmitDetails: {},
  lnpSubscriberSubmitDetails: {},
  lnpCreatedBy: {},
  homeEnquiryData: null,
  homeEnquiryDataPopupOpen: false,
  lnpMobileEnquiryData: null,
  lnpEmailEnquiryData: null,
  lnpEnquiryDataPopupOpen: false,
  agnpMobileEnquiryData: null,
  agnpEmailEnquiryData: null,
  agnpEnquiryDataPopupOpen: false,
  industryList: [],
  serviceList: [],
  departmentList: [],
  subDepartmentList: [],
  enquiryTrackingData: null,
  enquiryTrackingLoading: false,
  enquiryTrackingError: null,
  ticketCategoryList: [],
  trackComplaintData: [],
  trackComplaintLoading: false,
  pinCodeDetails: {}
};

const slice = createSlice({
  initialState,
  name: STATE_REDUCER_KEY,
  reducers: {
    clearAll: () => initialState,
    setFormProgress: (state, { payload }) => {
      state.formProgress = {
        ...state.formProgress,
        ...payload
      };
    },
    setHomeSubscriberDraft(state, action) {
      state.homeSubscriberDraft = action.payload;
    },
    clearHomeSubscriberDraft(state) {
      state.homeSubscriberDraft = null;
    },
    setHomeSubcriberSubmitDetails(state, action) {
      state.homeSubscriberSubmitDetails = action.payload;
    },
    setCorpGovSubcriberSubmitDetails: (state, { payload }) => {
      set(state, 'corpGovSubcriberSubmitDetails', payload);
    },
    clearCorporateSubscriberDraft(state) {
      state.corpGovSubcriberSubmitDetails = null;
    },
    setHomeEnquiryDataPopupOpen(state, action) {
      state.homeEnquiryDataPopupOpen = action.payload;
    },
    clearHomeEnquiryData(state) {
      state.homeEnquiryData = null;
      state.homeEnquiryDataPopupOpen = false;
    },
    setLnpMobileEnquiryData(state, action) {
      state.lnpMobileEnquiryData = action.payload;
    },
    setLnpEmailEnquiryData(state, action) {
      state.lnpEmailEnquiryData = action.payload;
    },
    setLnpEnquiryDataPopupOpen(state, action) {
      state.lnpEnquiryDataPopupOpen = action.payload;
    },
    clearLnpEnquiryData(state) {
      state.lnpMobileEnquiryData = null;
      state.lnpEmailEnquiryData = null;
      state.lnpEnquiryDataPopupOpen = false;
    },
    setAgnpMobileEnquiryData(state, action) {
      state.agnpMobileEnquiryData = action.payload;
    },
    setAgnpEmailEnquiryData(state, action) {
      state.agnpEmailEnquiryData = action.payload;
    },
    setAgnpEnquiryDataPopupOpen(state, action) {
      state.agnpEnquiryDataPopupOpen = action.payload;
    },
    clearAgnpEnquiryData(state) {
      state.agnpMobileEnquiryData = null;
      state.agnpEmailEnquiryData = null;
      state.agnpEnquiryDataPopupOpen = false;
    },
    clearEnquiryTrackingData(state) {
      state.enquiryTrackingData = null;
      state.enquiryTrackingError = null;
    },
    clearTrackComplaint(state) {
      state.trackComplaintData = [];
      state.trackComplaintLoading = false;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(
      API_ACTION_TYPE_VARIANTS[ACTION_TYPES.SAVE_CORP_GOV_SUBSCRIBER_ENQUIRY][1],
      (state, { payload }) => {
        set(state, 'corpGovSubscriberSubmitDetails', payload?.data);
      }
    );
    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.SAVE_AGNP_ENQUIRY_SUBMIT][1], (state, { payload }) => {
      set(state, 'agnpSubscriberSubmitDetails', payload?.data);
    });
    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.SAVE_LNP_ENQUIRY_SUBMIT][1], (state, { payload }) => {
      set(state, 'lnpSubscriberSubmitDetails', payload?.data);
    });
    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_LNP_CREATED_BY][1], (state, { payload }) => {
      set(state, 'lnpCreatedBy', payload?.data);
    });
    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_HOME_ENQUIRY_BY_MOBILE][1], (state, { payload }) => {
      set(state, 'homeEnquiryData', payload?.data);
    });
    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_INDUSTRY][1], (state, { payload }) => {
      set(state, 'industryList', payload?.data || []);
    });
    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_SERVICE][1], (state, { payload }) => {
      const mappedServices = (payload?.data || []).map((srv) => ({
        ...srv,
        id: srv.srvId ?? srv.uuid,
        name: srv.serviceName ?? srv.name
      }));
      set(state, 'serviceList', mappedServices);
    });
    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_DEPARTMENT][1], (state, { payload }) => {
      const mappedDepartments = (payload?.data?.mainDepartments || []).map((dept) => ({
        ...dept,
        id: dept.departmentId,
        name: dept.departmentName,
        nameInLocal: dept.departmentName
      }));
      set(state, 'departmentList', mappedDepartments);
    });
    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_SUB_DEPARTMENT][1], (state, { payload }) => {
      const mappedSubDepartments = (payload?.data?.subDepartments || []).map((subDept) => ({
        ...subDept,
        id: subDept.subDepartmentId,
        name: subDept.subDepartmentName,
        nameInLocal: subDept.subDepartmentName
      }));
      set(state, 'subDepartmentList', mappedSubDepartments);
    });
    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_BPL_APPLICATION_STATUS][1], (state, { payload }) => {
      set(state, 'bplDetails.formStatus', payload?.data || { active: false });
      set(state, 'bplDetails.formStatus.isLoading', false);
    });
    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_BPL_APPLICATION_STATUS][0], (state) => {
      set(state, 'bplDetails.formStatus.isLoading', true);
    });
    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_BPL_APPLICATION_STATUS][2], (state) => {
      set(state, 'bplDetails.formStatus.isLoading', false);
    });
    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_ENQUIRY_TRACKING][0], (state) => {
      set(state, 'enquiryTrackingLoading', true);
      set(state, 'enquiryTrackingData', null);
      set(state, 'enquiryTrackingError', null);
    });
    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_ENQUIRY_TRACKING][1], (state, { payload }) => {
      set(state, 'enquiryTrackingLoading', false);
      set(state, 'enquiryTrackingData', payload?.data);
      set(state, 'enquiryTrackingError', null);
    });
    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_ENQUIRY_TRACKING][2], (state, { payload }) => {
      set(state, 'enquiryTrackingLoading', false);
      set(state, 'enquiryTrackingError', payload?.error?.customErrorResponse?.error || 'notFound');
    });
    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_TICKET_CATEGORY][1], (state, { payload }) => {
      set(state, 'ticketCategoryList', payload?.data || []);
    });
    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.TRACK_COMPLAINT][0], (state) => {
      set(state, 'trackComplaintLoading', true);
      set(state, 'trackComplaintData', []);
    });
    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.TRACK_COMPLAINT][1], (state, { payload }) => {
      set(state, 'trackComplaintData', payload?.data || []);
      set(state, 'trackComplaintLoading', false);
    });
    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.TRACK_COMPLAINT][2], (state) => {
      set(state, 'trackComplaintLoading', false);
    });
    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_DISTRICT_BY_PINCODE][1], (state, { payload }) => {
      set(state, 'pinCodeDetails', payload?.data || {});
    });
  }
});

export const { actions, reducer } = slice;
