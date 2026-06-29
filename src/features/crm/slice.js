import { createSlice } from '@reduxjs/toolkit';
import { set } from 'lodash-es';

import { ACTION_TYPES, API_ACTION_TYPE_VARIANTS } from './action';
import { STATE_REDUCER_KEY } from './constants';

const initialState = {
  priorities: [],
  issueTypes: [],
  customerTypes: [],
  customerSubTypes: [],
  completedSteps: [],
  submitTicket: [],
  attachment: [],
  inboxTickets: [],
  outboxTickets: [],
  ticketList: [],
  visibilityPermission: [],
  updateState: [],
  roleName: [],
  subscriberList: [],
  uploadedFiles: [],
  crmTemplateList: {
    data: []
  },
  govtCustomers: [],
  isFileUploading: false,
  roleByTicketId: [],
  previousEmployee: [],
  takeoverSearchData: [],
  takeoverSearchLoading: false,
  takeoverSearchError: null,
  subscriberByNumber: [],
  dashboardTicketSummary: null,
  customerTypeBreakdown: [],
  top10Issues: [],
  subjectTypeBreakdown: [],
  districtWiseComplaints: [],
  performanceKpi: null,
  resolutionPerformance: null,
  monthlySummary: [],
  longPending: [],
  longPendingSummary: null,
  longPendingList: null,
  allTicketsList: null,
  noCustodianTicketCount: {}
};

const slice = createSlice({
  initialState,
  name: STATE_REDUCER_KEY,

  reducers: {
    addUploadedFile: (state, { payload }) => {
      state.uploadedFiles.push(payload);
    },
    removeUploadedFile: (state, { payload }) => {
      state.uploadedFiles = state.uploadedFiles.filter((f) => f.fileId !== payload);
    },
    clearUploadedFiles: (state) => {
      state.uploadedFiles = [];
    },
    updateAttachmentUrl: (state, { payload }) => {
      const { fileId, url } = payload;
      if (state.attachment?.attachments) {
        state.attachment.attachments = state.attachment.attachments.map((item) =>
          item.fileId === fileId ? { ...item, fileId: url } : item
        );
      }
      if (state.attachment?.movements) {
        state.attachment.movements = state.attachment.movements.map((movement) => ({
          ...movement,
          imageUrl: movement.imageUrl?.map((img) => (img.fileId === fileId ? { ...img, fileId: url } : img)),
          videoUrl: movement.videoUrl?.map((vid) => (vid.fileId === fileId ? { ...vid, fileId: url } : vid)),
          documentUrl: movement.documentUrl?.map((doc) => (doc.fileId === fileId ? { ...doc, fileId: url } : doc))
        }));
      }
    },
    clearAttachment: (state) => {
      state.attachment = [];
    },
    setIsFileUploading: (state, { payload }) => {
      state.isFileUploading = payload;
    },
    clearTakeoverSearch: (state) => {
      state.takeoverSearchData = [];
      state.takeoverSearchLoading = false;
      state.takeoverSearchError = null;
    },
    clearSubscriberByNumber: (state) => {
      state.subscriberByNumber = [];
    }
  },

  extraReducers: (builder) => {
    builder
      .addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_PRIORITIES][1], (state, { payload }) => {
        set(state, 'priorities', payload?.data || []);
      })

      .addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_ISSUE_TYPES][1], (state, { payload }) => {
        set(state, 'issueTypes', payload?.data || []);
      })

      .addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_CUSTOMER_TYPES][1], (state, { payload }) => {
        set(state, 'customerTypes', payload?.data || []);
      })
      .addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_CUSTOMER_SUBTYPES][1], (state, { payload }) => {
        set(state, 'customerSubTypes', payload?.data || []);
      })

      .addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.SUBMIT_TICKET][1], (state, { payload }) => {
        set(state, 'submitTicket', payload?.data || []);
      })

      .addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.CUSTOMER_SUBMIT_TICKET][1], (state, { payload }) => {
        set(state, 'submitTicket', payload?.data || []);
      })

      .addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_ATTACHMENT][1], (state, { payload }) => {
        state.attachment = payload?.data || [];
      })

      .addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_INBOX_TICKETS][1], (state, { payload }) => {
        set(state, 'inboxTickets', payload?.data || []);
      })

      .addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_OUTBOX_TICKETS][1], (state, { payload }) => {
        set(state, 'outboxTickets', payload?.data || []);
      })

      .addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_TICKET_LIST][1], (state, { payload }) => {
        set(state, 'ticketList', payload?.data || []);
      })

      .addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_VISIBILITY_PERMISSION][1], (state, { payload }) => {
        set(state, 'visibilityPermission', payload?.data || []);
      })

      .addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_UPDATE_STATE][1], (state, { payload }) => {
        set(state, 'updateState', payload?.data || []);
      })

      .addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_ROLE_NAME][1], (state, { payload }) => {
        set(state, 'roleName', payload?.data || []);
      })

      .addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_SUBSCRIBER_LIST][1], (state, { payload }) => {
        set(state, 'subscriberList', payload?.data || []);
      })
      .addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_CRM_TEMPLATE][1], (state, { payload }) => {
        set(state, 'crmTemplateList.data', payload?.data?.content ?? []);
      })
      .addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_GOVT_CUSTOMERS][1], (state, { payload }) => {
        set(state, 'govtCustomers', payload?.data || []);
      })
      .addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_ROLE_BY_TICKET_ID][1], (state, { payload }) => {
        set(state, 'roleByTicketId', payload?.data || []);
      })
      .addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_PREVIOUS_EMPLOYEE][1], (state, { payload }) => {
        set(state, 'previousEmployee', payload?.data || []);
      })
      .addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_SUBSCRIBER_BY_NUMBER][1], (state, { payload }) => {
        set(state, 'subscriberByNumber', payload?.data || []);
      })
      .addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.TAKEOVER_SEARCH][0], (state) => {
        state.takeoverSearchLoading = true;
        state.takeoverSearchError = null;
      })
      .addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.TAKEOVER_SEARCH][1], (state, { payload }) => {
        state.takeoverSearchLoading = false;
        state.takeoverSearchData = payload?.data || [];
      })
      .addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.TAKEOVER_SEARCH][2], (state, { payload }) => {
        state.takeoverSearchLoading = false;
        state.takeoverSearchError = payload;
      })
      .addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_DASHBOARD_TICKET_SUMMARY][1], (state, { payload }) => {
        state.dashboardTicketSummary = payload?.data || null;
      })
      .addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_CUSTOMER_TYPE_BREAKDOWN][1], (state, { payload }) => {
        state.customerTypeBreakdown = payload?.data || [];
      })
      .addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_TOP_10_ISSUES][1], (state, { payload }) => {
        state.top10Issues = payload?.data || [];
      })
      .addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_SUBJECT_TYPE_BREAKDOWN][1], (state, { payload }) => {
        state.subjectTypeBreakdown = payload?.data || [];
      })
      .addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_DISTRICT_WISE_COMPLAINTS][1], (state, { payload }) => {
        state.districtWiseComplaints = payload?.data?.content || [];
      })
      .addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_PERFORMANCE_KPI][1], (state, { payload }) => {
        state.performanceKpi = payload?.data || null;
      })
      .addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_RESOLUTION_PERFORMANCE][1], (state, { payload }) => {
        state.resolutionPerformance = payload?.data || null;
      })
      .addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_MONTHLY_SUMMARY][1], (state, { payload }) => {
        state.monthlySummary = payload?.data || [];
      })
      .addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_LONG_PENDING][1], (state, { payload }) => {
        state.longPending = payload?.data || [];
      })
      .addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_LONG_PENDING_SUMMARY][1], (state, { payload }) => {
        state.longPendingSummary = payload?.data || null;
      })
      .addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_LONG_PENDING_LIST][1], (state, { payload }) => {
        state.longPendingList = payload?.data || null;
      })
      .addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_ALL_TICKETS_LIST][1], (state, { payload }) => {
        state.allTicketsList = payload?.data || null;
      })
      .addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_NO_CUSTODIAN_TICKET_COUNT][1], (state, { payload }) => {
        state.noCustodianTicketCount = payload?.data || null;
      });
  }
});

export const { actions, reducer } = slice;
