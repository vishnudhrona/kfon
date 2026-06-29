import { createSlice } from '@reduxjs/toolkit';
import { set } from 'lodash-es';

import { SERVER_SIDE_TABLE_KEYS } from '@/constants/server_table';

import { ACTION_TYPES, API_ACTION_TYPE_VARIANTS } from './action';
import {
  DROPDOWN_FALLBACK_DATA,
  DUMMY_CORPORATE_CUSTOMER_DATA,
  DUMMY_ENQ_LOCATION_DATA,
  DUMMY_PACKAGES_DATA,
  DUMMY_PROPOSAL_DATA,
  DUMMY_PURCHASE_ORDER_DATA,
  STATE_REDUCER_KEY
} from './constants';

const initialState = {
  ticket: {
    tableData: []
  },
  [SERVER_SIDE_TABLE_KEYS.ENQUIRY_LIST]: {
    data: [],
    isLoading: false,
    totalPages: 0,
    totalElements: 0,
    currentPage: 1,
    status: 'SUCCESS'
  },
  [SERVER_SIDE_TABLE_KEYS.ENQUIRY_EXPANDED_LIST]: {
    data: [],
    isLoading: false,
    totalPages: 0,
    totalElements: 0,
    currentPage: 1,
    status: 'SUCCESS'
  },
  [SERVER_SIDE_TABLE_KEYS.ENQUIRY_LOCATION_LIST]: {
    data: DUMMY_ENQ_LOCATION_DATA.data,
    isLoading: false,
    totalPages: 0,
    totalElements: DUMMY_ENQ_LOCATION_DATA.data.length,
    currentPage: 1,
    status: 'SUCCESS'
  },
  [SERVER_SIDE_TABLE_KEYS.CORPORATE_CUSTOMER_LIST]: {
    data: DUMMY_CORPORATE_CUSTOMER_DATA.data,
    isLoading: false,
    totalPages: 0,
    totalElements: DUMMY_CORPORATE_CUSTOMER_DATA.data.length,
    currentPage: 1,
    status: 'SUCCESS'
  },
  [SERVER_SIDE_TABLE_KEYS.CORPORATE_PACKAGES]: {
    data: DUMMY_PACKAGES_DATA.data,
    isLoading: false,
    totalPages: 0,
    totalElements: DUMMY_PACKAGES_DATA.data.length,
    currentPage: 1,
    status: 'SUCCESS'
  },
  [SERVER_SIDE_TABLE_KEYS.CORPORATE_PROPOSAL_LIST]: {
    data: DUMMY_PROPOSAL_DATA.data,
    isLoading: false,
    totalPages: 0,
    totalElements: DUMMY_PROPOSAL_DATA.data.length,
    currentPage: 1,
    status: 'SUCCESS'
  },
  [SERVER_SIDE_TABLE_KEYS.CORPORATE_PURCHASE_ORDER_LIST]: {
    data: DUMMY_PURCHASE_ORDER_DATA.data,
    isLoading: false,
    totalPages: 0,
    totalElements: DUMMY_PURCHASE_ORDER_DATA.data.length,
    currentPage: 1,
    status: 'SUCCESS'
  },
  serviceTypeList: {
    data: [],
    dropdownData: DROPDOWN_FALLBACK_DATA.SERVICES,
    isLoading: false,
    status: ''
  },
  enquiryList: {
    dropdownData: DROPDOWN_FALLBACK_DATA.ENQUIRIES,
    isLoading: false,
    status: ''
  },
  companyTypeList: {
    dropdownData: DROPDOWN_FALLBACK_DATA.COMPANY_TYPES,
    isLoading: false,
    status: ''
  },
  industryList: {
    data: [],
    isLoading: false,
    status: ''
  },
  proposalRevisions: {
    data: [],
    isLoading: false,
    status: ''
  },
  proposalDetails: {
    data: {},
    isLoading: false,
    status: ''
  },
  purchaseOrderDetails: {
    data: null,
    isLoading: false
  },
  circuitProvisioningDetails: {
    data: null,
    isLoading: false
  },
  serviceProvisioningDetails: {
    data: null,
    isLoading: false
  },
  circuitMulticastTypes: {
    data: [],
    isLoading: false
  },
  circuitServiceProviders: {
    data: [],
    isLoading: false
  },
  enquiryDetails: {
    data: {},
    isLoading: false,
    status: ''
  },
  meetingHistory: {
    data: [],
    isLoading: false,
    status: ''
  },
  forwardRoles: {
    data: [],
    isLoading: false
  },
  forwardRoleUsers: {
    data: [],
    isLoading: false
  },
  enquiryNotes: {
    data: [],
    isLoading: false
  },
  dispositionList: {
    data: [],
    isLoading: false
  },
  reasonList: {
    data: [],
    isLoading: false
  },
  feasibilityLnpList: {
    data: [],
    isLoading: false
  },
  feasibilityConnectedByList: {
    data: [],
    isLoading: false
  },
  nearestPopList: {
    data: [],
    isLoading: false
  },
  customerVerificationList: {
    data: [],
    isLoading: false
  },
  kycCustomer: {
    cusId: null,
    isLoading: false
  },
  kycDetails: {
    data: null,
    isLoading: false
  },
  gstSearchDetails: {
    data: null,
    isLoading: false
  },
  enquiryLocations: {
    data: [],
    isLoading: false
  },
  packageTypesList: {
    data: [],
    isLoading: false
  },
  packagesList: {
    data: [],
    isLoading: false
  },
  additionalServicesList: {
    data: [],
    isLoading: false
  },
  enquiryLocationDetails: {
    data: null,
    isLoading: false
  },
  kycDocument: {
    data: null,
    isLoading: false
  },
  forwardEnquiry: {
    isLoading: false
  },
  nearestLocation: {
    data: null,
    isLoading: false
  },
  locationDisposition: {
    data: null,
    isLoading: false
  },
  enquiryDispositionList: {
    data: [],
    isLoading: false
  },
  returnToInfo: {
    data: null,
    isLoading: false
  },
  proposalParams: {
    enquiryId: null,
    locationIds: []
  },
  proposalDispatch: {
    data: null,
    isLoading: false
  },
  enquirySummaryWithProposals: {
    data: [],
    isLoading: false
  },
  proposalsByEnquiry: {
    data: [],
    isLoading: false
  },
  enquirySummaryWithPo: {
    data: [],
    isLoading: false
  },
  poByEnquiry: {
    data: [],
    isLoading: false
  },
  enquirySummaryWithCircuitProvisioning: {
    data: [],
    isLoading: false
  },
  serviceCommissioningByEnquiry: {
    data: [],
    isLoading: false
  },
  nextStepUsers: {
    data: [],
    workflowTypeName: ''
  }
};

const slice = createSlice({
  initialState,
  name: STATE_REDUCER_KEY,
  reducers: {
    setTableData: (state, { payload: { tableKey, data } }) => {
      set(state, `${tableKey}.data`, data);
    },
    mergeEnquiryExpandedData: (state, { payload: expandedItems }) => {
      const current = state[SERVER_SIDE_TABLE_KEYS.ENQUIRY_LIST]?.data || [];
      state[SERVER_SIDE_TABLE_KEYS.ENQUIRY_LIST].data = current.map(item => {
        const match = expandedItems.find(
          exp => String(exp.enquiryId ?? exp.id) === String(item.enquiryId ?? item.id)
        );
        if (!match) return item;
        const merged = { ...item };
        Object.entries(match).forEach(([key, value]) => {
          if (value !== null && value !== undefined) merged[key] = value;
        });
        return merged;
      });
    },
    setDropdownData: (state, { payload: { tableKey, data } }) => {
      set(state, `${tableKey}.dropdownData`, data);
    },
    setProposalDetails: (state, action) => {
      state.proposalDetails.data = action.payload;
    },
    setPurchaseOrderDetails: (state, action) => {
      state.purchaseOrderDetails.data = action.payload;
    },
    setCircuitProvisioningDetails: (state, action) => {
      state.circuitProvisioningDetails.data = action.payload;
    },
    setServiceProvisioningDetails: (state, action) => {
      state.serviceProvisioningDetails.data = action.payload;
    },
    setCircuitMulticastTypes: (state, action) => {
      state.circuitMulticastTypes.data = action.payload;
    },
    setCircuitServiceProviders: (state, action) => {
      state.circuitServiceProviders.data = action.payload;
    },
    setEnquiryDetails: (state, action) => {
      state.enquiryDetails.data = action.payload;
    },
    setMeetingHistory: (state, action) => {
      state.meetingHistory.data = action.payload;
      state.meetingHistory.isLoading = false;
    },
    setMeetingHistoryLoading: (state, action) => {
      state.meetingHistory.isLoading = action.payload;
    },
    setForwardRoles: (state, action) => {
      state.forwardRoles.data = action.payload;
      state.forwardRoles.isLoading = false;
    },
    setForwardRolesLoading: (state, action) => {
      state.forwardRoles.isLoading = action.payload;
    },
    setForwardRoleUsers: (state, action) => {
      state.forwardRoleUsers.data = action.payload;
      state.forwardRoleUsers.isLoading = false;
    },
    setForwardRoleUsersLoading: (state, action) => {
      state.forwardRoleUsers.isLoading = action.payload;
    },
    setEnquiryNotes: (state, action) => {
      state.enquiryNotes.data = action.payload;
      state.enquiryNotes.isLoading = false;
    },
    setEnquiryNotesLoading: (state, action) => {
      state.enquiryNotes.isLoading = action.payload;
    },
    setDispositionList: (state, action) => {
      state.dispositionList.data = action.payload;
      state.dispositionList.isLoading = false;
    },
    setDispositionListLoading: (state, action) => {
      state.dispositionList.isLoading = action.payload;
    },
    setReasonList: (state, action) => {
      state.reasonList.data = action.payload;
      state.reasonList.isLoading = false;
    },
    setReasonListLoading: (state, action) => {
      state.reasonList.isLoading = action.payload;
    },
    setFeasibilityLnpList: (state, action) => {
      state.feasibilityLnpList.data = action.payload;
      state.feasibilityLnpList.isLoading = false;
    },
    setFeasibilityLnpListLoading: (state, action) => {
      state.feasibilityLnpList.isLoading = action.payload;
    },
    setFeasibilityConnectedByList: (state, action) => {
      state.feasibilityConnectedByList.data = action.payload;
      state.feasibilityConnectedByList.isLoading = false;
    },
    setFeasibilityConnectedByListLoading: (state, action) => {
      state.feasibilityConnectedByList.isLoading = action.payload;
    },
    setNearestPopList: (state, action) => {
      state.nearestPopList.data = action.payload;
      state.nearestPopList.isLoading = false;
    },
    setNearestPopListLoading: (state, action) => {
      state.nearestPopList.isLoading = action.payload;
    },
    setCustomerVerificationList: (state, action) => {
      state.customerVerificationList.data = action.payload;
      state.customerVerificationList.isLoading = false;
    },
    setCustomerVerificationLoading: (state, action) => {
      state.customerVerificationList.isLoading = action.payload;
    },
    setKycCusId: (state, action) => {
      state.kycCustomer.cusId = action.payload;
    },
    setKycCustomerLoading: (state, action) => {
      state.kycCustomer.isLoading = action.payload;
    },
    setKycDetails: (state, action) => {
      state.kycDetails.data = action.payload;
      state.kycDetails.isLoading = false;
    },
    setKycDetailsLoading: (state, action) => {
      state.kycDetails.isLoading = action.payload;
    },
    clearKycDocumentPath: (state, action) => {
      if (state.kycDetails.data) {
        const docType = action.payload?.toLowerCase();
        if (docType === 'pan') state.kycDetails.data.panPath = null;
        else if (docType === 'gst') state.kycDetails.data.gstinPath = null;
        else if (docType === 'support') state.kycDetails.data.supportDocPath = null;
        else if (docType === 'lut') state.kycDetails.data.lutPath = null;
      }
    },
    setGstSearchDetails: (state, action) => {
      state.gstSearchDetails.data = action.payload;
      state.gstSearchDetails.isLoading = false;
    },
    setGstSearchDetailsLoading: (state, action) => {
      state.gstSearchDetails.isLoading = action.payload;
    },
    setEnquiryLocations: (state, action) => {
      state.enquiryLocations.data = action.payload;
      state.enquiryLocations.isLoading = false;
    },
    mergeEnquiryLocation: (state, action) => {
      if (!action.payload) { state.enquiryLocations.isLoading = false; return; }
      const idx = state.enquiryLocations.data.findIndex(l => l.id === action.payload.id);
      if (idx >= 0) {
        state.enquiryLocations.data[idx] = { ...state.enquiryLocations.data[idx], ...action.payload };
      }
      state.enquiryLocations.isLoading = false;
    },
    setEnquiryLocationsLoading: (state, action) => {
      state.enquiryLocations.isLoading = action.payload;
    },
    setPackageTypesList: (state, action) => {
      state.packageTypesList.data = action.payload;
      state.packageTypesList.isLoading = false;
    },
    setPackageTypesListLoading: (state, action) => {
      state.packageTypesList.isLoading = action.payload;
    },
    setPackagesList: (state, action) => {
      state.packagesList.data = action.payload;
      state.packagesList.isLoading = false;
    },
    setPackagesListLoading: (state, action) => {
      state.packagesList.isLoading = action.payload;
    },
    setAdditionalServicesList: (state, action) => {
      state.additionalServicesList.data = action.payload;
      state.additionalServicesList.isLoading = false;
    },
    setAdditionalServicesListLoading: (state, action) => {
      state.additionalServicesList.isLoading = action.payload;
    },
    setEnquiryLocationDetails: (state, action) => {
      state.enquiryLocationDetails.data = action.payload;
      state.enquiryLocationDetails.isLoading = false;
    },
    setEnquiryLocationDetailsLoading: (state, action) => {
      state.enquiryLocationDetails.isLoading = action.payload;
    },
    setKycDocument: (state, action) => {
      state.kycDocument.data = action.payload;
      state.kycDocument.isLoading = false;
    },
    setKycDocumentLoading: (state, action) => {
      state.kycDocument.isLoading = action.payload;
    },
    setForwardEnquiryLoading: (state, action) => {
      state.forwardEnquiry.isLoading = action.payload;
    },
    setNearestLocation: (state, action) => {
      state.nearestLocation.data = action.payload;
      state.nearestLocation.isLoading = false;
    },
    setNearestLocationLoading: (state, action) => {
      state.nearestLocation.isLoading = action.payload;
    },
    setLocationDisposition: (state, action) => {
      state.locationDisposition.data = action.payload;
      state.locationDisposition.isLoading = false;
    },
    setLocationDispositionLoading: (state, action) => {
      state.locationDisposition.isLoading = action.payload;
    },
    setEnquiryDispositionList: (state, action) => {
      state.enquiryDispositionList.data = action.payload;
      state.enquiryDispositionList.isLoading = false;
    },
    setEnquiryDispositionListLoading: (state, action) => {
      state.enquiryDispositionList.isLoading = action.payload;
    },
    setReturnToInfo: (state, action) => {
      state.returnToInfo.data = action.payload;
      state.returnToInfo.isLoading = false;
    },
    setReturnToInfoLoading: (state, action) => {
      state.returnToInfo.isLoading = action.payload;
    },
    setProposalParams: (state, action) => {
      state.proposalParams = action.payload;
    },
    setProposalDispatch: (state, action) => {
      state.proposalDispatch.data = action.payload;
      state.proposalDispatch.isLoading = false;
    },
    setProposalDispatchLoading: (state, action) => {
      state.proposalDispatch.isLoading = action.payload;
    },
    setEnquirySummaryWithProposals: (state, action) => {
      state.enquirySummaryWithProposals.data = action.payload;
      state.enquirySummaryWithProposals.isLoading = false;
    },
    setEnquirySummaryWithProposalsLoading: (state, action) => {
      state.enquirySummaryWithProposals.isLoading = action.payload;
    },
    setProposalsByEnquiry: (state, action) => {
      state.proposalsByEnquiry.data = action.payload;
      state.proposalsByEnquiry.isLoading = false;
    },
    setProposalsByEnquiryLoading: (state, action) => {
      state.proposalsByEnquiry.isLoading = action.payload;
    },
    setEnquirySummaryWithPo: (state, action) => {
      state.enquirySummaryWithPo.data = action.payload;
      state.enquirySummaryWithPo.isLoading = false;
    },
    setEnquirySummaryWithPoLoading: (state, action) => {
      state.enquirySummaryWithPo.isLoading = action.payload;
    },
    setPoByEnquiry: (state, action) => {
      state.poByEnquiry.data = action.payload;
      state.poByEnquiry.isLoading = false;
    },
    setPoByEnquiryLoading: (state, action) => {
      state.poByEnquiry.isLoading = action.payload;
    },
    setEnquirySummaryWithCircuitProvisioning: (state, action) => {
      state.enquirySummaryWithCircuitProvisioning.data = action.payload;
      state.enquirySummaryWithCircuitProvisioning.isLoading = false;
    },
    setEnquirySummaryWithCircuitProvisioningLoading: (state, action) => {
      state.enquirySummaryWithCircuitProvisioning.isLoading = action.payload;
    },
    setServiceCommissioningByEnquiry: (state, action) => {
      state.serviceCommissioningByEnquiry.data = action.payload;
      state.serviceCommissioningByEnquiry.isLoading = false;
    },
    setServiceCommissioningByEnquiryLoading: (state, action) => {
      state.serviceCommissioningByEnquiry.isLoading = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_TICKET_TABLE_DATA][1], (state, { payload }) => {
      set(state, 'ticket.tableData', payload);
    });

    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_INDUSTRY_LIST][1], (state, { payload }) => {
      set(state, 'industryList.data', payload?.data);
      set(state, 'industryList.isLoading', false);
    });

    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_SERVICES_LIST][1], (state, { payload }) => {
      set(state, 'serviceTypeList.data', payload?.data);
      set(state, 'serviceTypeList.isLoading', false);
    });

    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.SEARCH_CORPORATE_GST_DETAILS][1], (state, { payload }) => {
      set(state, 'gstSearchDetails.data', payload?.data);
      set(state, 'gstSearchDetails.isLoading', false);
    });

    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_NEXT_STEP_USERS][1], (state, { payload }) => {
      const data = payload?.data ?? payload ?? {};
      const steps = Array.isArray(data) ? data : [];
      const list = steps.flatMap((step) =>
        (step?.seats || []).map((seat) => ({
          ...seat,
          nextStepCode: step?.nextStepCode,
          nextStepName: step?.nextStepName
        }))
      );
      const stepNames = steps.map((s) => s?.nextStepName).filter(Boolean).join(', ');
      set(state, 'nextStepUsers.data', list);
      set(state, 'nextStepUsers.workflowTypeName', stepNames);
    });

    builder.addCase(ACTION_TYPES.CLEAR_NEXT_STEP_USERS, (state) => {
      set(state, 'nextStepUsers.data', []);
      set(state, 'nextStepUsers.workflowTypeName', '');
    });
  }
});

export const { actions, reducer } = slice;
