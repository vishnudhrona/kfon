import { createSlice } from '@reduxjs/toolkit';
import { set } from 'lodash-es';

import { API_ACTION_TYPE_VARIANTS, API_ACTION_TYPES } from './actions';
import { DROPDOWN_KEYS, PACKAGE_LIST_TABLE_KEY, STATE_REDUCER_KEY } from './constants';

const initialState = {
  enquiryList: {
    data: [],
    loading: false,
    status: null
  },
  enquiryDashboard: {
    data: [],
    loading: false
  },
  [PACKAGE_LIST_TABLE_KEY]: {
    data: [],
    loading: false,
    status: null
  },
  subscriberList: {
    data: [],
    loading: false,
    status: null
  },
  subscriberId: null,
  subscriberDetail: null,
  subscriberDetailLoading: false,
  subscriberDataUsage: null,
  radiusDetails: null,
  completedSteps: {
    basicDetails: false,
    subscriptionDetails: false,
    deviceDetails: false,
    gstInformation: false,
    supportingDocuments: false,
    permanentAddress: false,
    installationAddress: false
  },
  isDifferentInstallationAddress: false,
  addressDetails: null,
  permanentAddressDetails: null,
  selectedDeviceDetails: null,
  [DROPDOWN_KEYS.DEVICE_LIST]: [],
  [DROPDOWN_KEYS.DEVICE_TYPE_LIST]: [],
  [DROPDOWN_KEYS.OLT_TYPE_LIST]: [],
  [DROPDOWN_KEYS.OLT_DEVICE_LIST]: [],
  [DROPDOWN_KEYS.PON_PORT_NUMBER_LIST]: [],
  [DROPDOWN_KEYS.PLAN_TYPE_LIST]: [],
  [DROPDOWN_KEYS.PACKAGE_TYPE_LIST]: [],
  [DROPDOWN_KEYS.DEVICE_PROVIDER_LIST]: [],
  [DROPDOWN_KEYS.DISTRIBUTOR_LIST]: [],
  enquiryCardData: [],
  meetingList: [],
  feList: [],
  lnpList: [],
  [DROPDOWN_KEYS.DISPOSITION_LIST]: [],
  [DROPDOWN_KEYS.REASON_LIST]: [],
  [DROPDOWN_KEYS.RESIDENCE_PROOF_TYPE_LIST]: [],
  [DROPDOWN_KEYS.IDENTITY_PROOF_TYPE_LIST]: [],
  enquiryStatusList: [],
  prepopulatedData: null,
  ontNextPosition: null,
  dispositionHistoryMap: {},
  meetingHistoryMap: {},
  feasibilityData: null,
  feasibilityLoading: false,
  subscriberForwardUsers: [],
  [DROPDOWN_KEYS.EWS_PACKAGE_LIST]: []
};

const applicationsSlice = createSlice({
  name: STATE_REDUCER_KEY,
  initialState,
  reducers: {
    setSubscriberId: (state, action) => {
      state.subscriberId = action.payload;
    },
    resetSubscriberForm: (state) => {
      state.subscriberId = null;
      state.completedSteps = { ...initialState.completedSteps };
      state.isDifferentInstallationAddress = false;
      state.addressDetails = null;
      state.permanentAddressDetails = null;
    },
    clearApplicationState: (state) => {
      state.subscriberId = null;
      state.completedSteps = { ...initialState.completedSteps };
      state.isDifferentInstallationAddress = false;
      state.addressDetails = null;
      state.permanentAddressDetails = null;
      state.selectedDeviceDetails = null;
      state.prepopulatedData = null;
    },
    setPrepopulatedData: (state, action) => {
      state.prepopulatedData = action.payload;
    },
    markBasicDetailsCompleted: (state) => {
      state.completedSteps.basicDetails = true;
    },
    markAddressCompleted: (state, action) => {
      const { isPermanent, isDifferentInstallationAddress } = action.payload;
      if (isPermanent) {
        state.completedSteps.permanentAddress = true;
      } else {
        state.completedSteps.installationAddress = true;
        if (isDifferentInstallationAddress !== undefined) {
          state.isDifferentInstallationAddress = isDifferentInstallationAddress;
        }
      }
    },
    restoreCompletionStatus: (state, action) => {
      const {
        basicDetailsCompleted,
        permanentAddressCompleted,
        installationAddressCompleted,
        subscriptionDetailsCompleted,
        deviceDetailsCompleted,
        gstInformationCompleted,
        supportingDocumentsCompleted,
        subscriberId
      } = action.payload;

      if (subscriberId) state.subscriberId = subscriberId;
      if (basicDetailsCompleted !== undefined) state.completedSteps.basicDetails = basicDetailsCompleted;
      if (permanentAddressCompleted !== undefined) state.completedSteps.permanentAddress = permanentAddressCompleted;
      if (installationAddressCompleted !== undefined)
        state.completedSteps.installationAddress = installationAddressCompleted;
      if (subscriptionDetailsCompleted !== undefined)
        state.completedSteps.subscriptionDetails = subscriptionDetailsCompleted;
      if (deviceDetailsCompleted !== undefined) state.completedSteps.deviceDetails = deviceDetailsCompleted;
      if (gstInformationCompleted !== undefined) state.completedSteps.gstInformation = gstInformationCompleted;
      if (supportingDocumentsCompleted !== undefined)
        state.completedSteps.supportingDocuments = supportingDocumentsCompleted;
    },
    setTableData: (state, action) => {
      const { tableKey, data } = action.payload;
      set(state, `${tableKey}.data`, data);
    },
    setDropdownData: (state, action) => {
      const { key, data } = action.payload;
      state[key] = data;
    },
    setDispositionHistory: (state, action) => {
      const { enquiryId, data } = action.payload;
      state.dispositionHistoryMap[enquiryId] = data;
    },
    setMeetingHistory: (state, action) => {
      const { enquiryId, data } = action.payload;
      state.meetingHistoryMap[enquiryId] = data;
    },
    setFeasibilityData: (state, action) => {
      state.feasibilityData = action.payload;
    },
    setFeasibilityLoading: (state, action) => {
      state.feasibilityLoading = action.payload;
    }
  },
  extraReducers: (builder) => {
    // --- Subscriber form step completions ---
    builder
      .addCase(API_ACTION_TYPE_VARIANTS[API_ACTION_TYPES.UPDATE_SUBSCRIPTION_DETAILS][1], (state) => {
        state.completedSteps.subscriptionDetails = true;
      })
      .addCase(API_ACTION_TYPE_VARIANTS[API_ACTION_TYPES.UPDATE_DEVICE_DETAILS][1], (state) => {
        state.completedSteps.deviceDetails = true;
      })
      .addCase(API_ACTION_TYPE_VARIANTS[API_ACTION_TYPES.UPDATE_GST_INFORMATION][1], (state) => {
        state.completedSteps.gstInformation = true;
      })
      .addCase(API_ACTION_TYPE_VARIANTS[API_ACTION_TYPES.UPDATE_ADDRESS_DETAILS][1], (state, action) => {
        // Only update if isPermanent is explicitly returned
        if (action.payload?.data?.isPermanent !== undefined) {
          if (action.payload.data.isPermanent) {
            state.completedSteps.permanentAddress = true;
          } else {
            state.completedSteps.installationAddress = true;
          }
        } else if (action.payload?.isPermanent !== undefined) {
          if (action.payload.isPermanent) {
            state.completedSteps.permanentAddress = true;
          } else {
            state.completedSteps.installationAddress = true;
          }
        }
        state.addressDetails = action.payload;
        const savedPayload = action.payload?.data || action.payload;
        if (savedPayload?.isPermanent) {
          state.permanentAddressDetails = savedPayload;
        }
      })
      .addCase(API_ACTION_TYPE_VARIANTS[API_ACTION_TYPES.UPDATE_SUPPORTING_DOCUMENTS][1], (state) => {
        state.completedSteps.supportingDocuments = true;
      });

    // --- Subscriber fetch & prepopulate ---
    builder
      .addCase(API_ACTION_TYPE_VARIANTS[API_ACTION_TYPES.FETCH_SUBSCRIBER_BY_ENQUIRY_ID][1], (state, action) => {
        const data = action.payload?.data || action.payload;
        state.prepopulatedData = data;
        if (data) {
          state.subscriberId = data.basicDetail?.id || data.subscriberDetail?.id || null;
          state.completedSteps.basicDetails = !!data.basicDetail;
          state.completedSteps.permanentAddress = !!data.permanentAddress;
          state.completedSteps.installationAddress = !!data.installationAddress;
          state.completedSteps.subscriptionDetails = !!data.subscriberDetail;
          state.completedSteps.deviceDetails = !!data.deviceDetail?.vlanId;
          state.completedSteps.gstInformation = data.gstInformation?.isGstAdded !== null;
          state.completedSteps.supportingDocuments = !!data.supportingDocument;
          if (data.permanentAddress) {
            state.permanentAddressDetails = data.permanentAddress;
          }
          if (data.permanentAddress?.pincode && data.installationAddress?.pincode) {
            const p = data.permanentAddress;
            const i = data.installationAddress;
            state.isDifferentInstallationAddress =
              p.pincode !== i.pincode || p.doorNo !== i.doorNo || p.streetName !== i.streetName;
          }
        }
      })
      .addCase(API_ACTION_TYPE_VARIANTS[API_ACTION_TYPES.FETCH_SUBSCRIBER_LIST][1], (state, action) => {
        state.subscriberList.data = action.payload?.data || [];
      });

    // --- Subscriber detail (by id) ---
    builder
      .addCase(API_ACTION_TYPE_VARIANTS[API_ACTION_TYPES.FETCH_SUBSCRIBER_DETAIL][0], (state) => {
        state.subscriberDetailLoading = true;
      })
      .addCase(API_ACTION_TYPE_VARIANTS[API_ACTION_TYPES.FETCH_SUBSCRIBER_DETAIL][1], (state, action) => {
        state.subscriberDetailLoading = false;
        state.subscriberDetail = action.payload?.data || action.payload || null;
      })
      .addCase(API_ACTION_TYPE_VARIANTS[API_ACTION_TYPES.FETCH_SUBSCRIBER_DETAIL][2], (state) => {
        state.subscriberDetailLoading = false;
      });

    // --- Subscriber data usage (by id) ---
    builder
      .addCase(API_ACTION_TYPE_VARIANTS[API_ACTION_TYPES.FETCH_SUBSCRIBER_DATA_USAGE][0], (state) => {
        state.subscriberDataUsage = null;
      })
      .addCase(API_ACTION_TYPE_VARIANTS[API_ACTION_TYPES.FETCH_SUBSCRIBER_DATA_USAGE][1], (state, action) => {
        state.subscriberDataUsage = action.payload?.data || action.payload || null;
      });

    // --- Radius details (by username) ---
    builder
      .addCase(API_ACTION_TYPE_VARIANTS[API_ACTION_TYPES.FETCH_RADIUS_DETAILS][0], (state) => {
        state.radiusDetails = null;
      })
      .addCase(API_ACTION_TYPE_VARIANTS[API_ACTION_TYPES.FETCH_RADIUS_DETAILS][1], (state, action) => {
        state.radiusDetails = action.payload?.data || action.payload || null;
      });

    // --- Enquiry dashboard & card ---
    builder
      .addCase(API_ACTION_TYPE_VARIANTS[API_ACTION_TYPES.FETCH_ENQUIRY_DASHBOARD][0], (state) => {
        state.enquiryDashboard.loading = true;
      })
      .addCase(API_ACTION_TYPE_VARIANTS[API_ACTION_TYPES.FETCH_ENQUIRY_DASHBOARD][1], (state, action) => {
        state.enquiryDashboard.loading = false;
        state.enquiryDashboard.data = action.payload?.data || [];
      })
      .addCase(API_ACTION_TYPE_VARIANTS[API_ACTION_TYPES.FETCH_ENQUIRY_DASHBOARD][2], (state) => {
        state.enquiryDashboard.loading = false;
      })
      .addCase(API_ACTION_TYPE_VARIANTS[API_ACTION_TYPES.FETCH_ENQUIRY_CARD_DATA][1], (state, action) => {
        state.enquiryCardData = action.payload?.data || [];
      });

    // --- Device & ONT ---
    builder
      .addCase(API_ACTION_TYPE_VARIANTS[API_ACTION_TYPES.FETCH_DEVICE_DETAILS_BY_ID][1], (state, action) => {
        state.selectedDeviceDetails = action.payload?.data || action.payload;
      })
      .addCase(API_ACTION_TYPE_VARIANTS[API_ACTION_TYPES.FETCH_ONT_NEXT_POSITION][1], (state, action) => {
        state.ontNextPosition = action.payload?.data ?? action.payload ?? null;
      });

    // --- Meeting & field engineer ---
    builder.addCase(API_ACTION_TYPE_VARIANTS[API_ACTION_TYPES.FETCH_MEETING_LIST][1], (state, action) => {
      state.meetingList = action.payload?.data || [];
    });

    builder.addCase(API_ACTION_TYPE_VARIANTS[API_ACTION_TYPES.FETCH_SUBSCRIBER_FORWARD_USERS][1], (state, action) => {
      state.subscriberForwardUsers = action.payload?.data || action.payload || [];
    });
  }
});

export const { actions, reducer } = applicationsSlice;
