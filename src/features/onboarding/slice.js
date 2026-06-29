import { createSlice } from '@reduxjs/toolkit';

import { ACTION_TYPES, API_ACTION_TYPE_VARIANTS } from './action';
import { STATE_REDUCER_KEY } from './constants';

const initialState = {
  onboarding: {
    onboardingFormDetails: {},
    basicDetailsResponse: null,
    distributor: [],
    gstDetails: null,
    gstSearchFailed: false,
    completedSteps: [],
    formData: {}
  },
  popName: [],
  pincode: [],
  postOffice: [],
  ifscDetails: null,
  companyNature: [],
  bankAccountType: [],
  sharePlan: [],
  lnpPartnerStatusOptions: [],
  vlanType: [],
  partnerList: [],
  singleOnboardingData: null,
  oltDeviceList: [],
  partnerDetails: null,
  linkTypeOptions: [],
  linkEstablishmentStatusOptions: [],
  frcReceivedOptions: [],
  partnerForwardUsers: []
};

const slice = createSlice({
  initialState,
  name: STATE_REDUCER_KEY,
  reducers: {
    updateFormData: (state, { payload }) => {
      state.onboarding.formData = {
        ...state.onboarding.formData,
        ...payload
      };
    },
    setOnboardingFormDetails: (state, { payload }) => {
      state.onboarding.onboardingFormDetails = {
        ...state.onboarding.onboardingFormDetails,
        ...payload
      };
    },
    setTableData: (state, { payload: { tableKey, data } }) => {
      state[tableKey] = { data };
    },
    setSingleOnboardingData: (state, { payload }) => {
      state.singleOnboardingData = payload;
    },
    setPartnerDetails: (state, { payload }) => {
      state.partnerDetails = payload;
    },
    setPostOffice: (state, { payload }) => {
      state.postOffice = payload;
    },
    clearOnboardingDetails: (state) => {
      state.onboarding.onboardingFormDetails = {};
      state.onboarding.basicDetailsResponse = null;
      state.onboarding.distributor = [];
      state.onboarding.gstDetails = null;
      state.onboarding.gstSearchFailed = false;
      state.onboarding.completedSteps = [];
      state.onboarding.formData = {};
      state.postOffice = [];
      state.ifscDetails = null;
    },
    clearPartnerStatusOptions: (state) => {
      state.lnpPartnerStatusOptions = [];
    }
  },

  extraReducers: (builder) => {
    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.ONBOARDING_BASIC_DETAILS_SUBMIT][1], (state, { payload }) => {
      state.onboarding.onboardingFormDetails = payload?.data;
      state.onboarding.basicDetailsResponse = payload;
      state.onboarding.completedSteps = Array.from(new Set([...state.onboarding.completedSteps, 1]));
    });

    builder.addCase(
      API_ACTION_TYPE_VARIANTS[ACTION_TYPES.ONBOARDING_AGREEMENT_DETAILS_SUBMIT][1],
      (state, { payload }) => {
        state.onboarding.onboardingFormDetails = { ...state.onboarding.onboardingFormDetails, ...payload?.data };
        state.onboarding.completedSteps = Array.from(new Set([...state.onboarding.completedSteps, 2]));
      }
    );

    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.ONBOARDING_BANK_DETAILS_SUBMIT][1], (state, { payload }) => {
      state.onboarding.onboardingFormDetails = { ...state.onboarding.onboardingFormDetails, ...payload?.data };
      state.onboarding.completedSteps = Array.from(new Set([...state.onboarding.completedSteps, 3]));
    });

    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.DISTRIBUTOR_FIELD_FETCH][1], (state, { payload }) => {
      state.onboarding.distributor = payload;
    });

    builder.addCase(
      API_ACTION_TYPE_VARIANTS[ACTION_TYPES.ONBOARDING_KYC_GST_DETAILS_SUBMIT][1],
      (state, { payload }) => {
        state.onboarding.onboardingFormDetails = {
          ...state.onboarding.onboardingFormDetails,
          ...payload?.data
        };
        state.onboarding.completedSteps = Array.from(new Set([...state.onboarding.completedSteps, 4]));
      }
    );

    builder.addCase(
      API_ACTION_TYPE_VARIANTS[ACTION_TYPES.ONBOARDING_SUPPORTING_DOCUMENTS_SUBMIT][1],
      (state, { payload }) => {
        state.onboarding.onboardingFormDetails = { ...state.onboarding.onboardingFormDetails, ...payload?.data };
        state.onboarding.completedSteps = Array.from(new Set([...state.onboarding.completedSteps, 5]));
      }
    );

    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.ONBOARDING_GST_DETAILS_SEARCH][0], (state) => {
      state.onboarding.gstSearchFailed = false;
    });

    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.ONBOARDING_GST_DETAILS_SEARCH][1], (state, { payload }) => {
      state.onboarding.gstDetails = payload;
      state.onboarding.gstSearchFailed = false;
    });

    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.ONBOARDING_GST_DETAILS_SEARCH][2], (state) => {
      state.onboarding.gstDetails = null;
      state.onboarding.gstSearchFailed = true;
    });

    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.ONBOARDING_POP_NAME_FETCH][1], (state, { payload }) => {
      state.popName = payload;
    });

    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.ONBOARDING_PINCODE_FETCH][1], (state, { payload }) => {
      const data = payload?.data?.map((item) => ({
        ...item,
        name: item?.code,
        code: item?.name
      }));
      state.pincode = { ...payload, data };
    });

    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.ONBOARDING_POSTOFFICE_FETCH][0], (state) => {
      state.postOffice = [];
    });

    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.ONBOARDING_POSTOFFICE_FETCH][1], (state, { payload }) => {
      state.postOffice = payload?.data || [];
    });

    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.ONBOARDING_POSTOFFICE_FETCH][2], (state) => {
      state.postOffice = [];
    });

    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.ONBOARDING_IFSC_DETAILS_FETCH][1], (state, { payload }) => {
      state.ifscDetails = payload;
    });

    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.ONBOARDING_COMPANY_NATURE_FETCH][1], (state, { payload }) => {
      state.companyNature = payload;
    });

    builder.addCase(
      API_ACTION_TYPE_VARIANTS[ACTION_TYPES.ONBOARDING_BANK_ACCOUNT_TYPE_FETCH][1],
      (state, { payload }) => {
        state.bankAccountType = payload;
      }
    );

    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.ONBOARDING_SHARE_PLAN_FETCH][1], (state, { payload }) => {
      state.sharePlan = payload;
    });

    builder.addCase(
      API_ACTION_TYPE_VARIANTS[ACTION_TYPES.LNP_PARTNER_STATUS_DROPDOWN_FETCH][1],
      (state, { payload }) => {
        state.lnpPartnerStatusOptions = payload?.data || payload || [];
      }
    );

    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_VLAN_TYPE_LIST][1], (state, { payload }) => {
      state.vlanType = payload?.data || payload || [];
    });

    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_VLAN_PARTNER_LIST][1], (state, { payload }) => {
      state.partnerList = payload?.data || payload || [];
    });

    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_OLT_DEVICE_LIST][1], (state, { payload }) => {
      state.oltDeviceList = payload?.data || payload || [];
    });

    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_PARTNER_DETAILS_BY_ID][1], (state, { payload }) => {
      state.partnerDetails = payload?.data || null;
    });

    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_LINK_TYPE_OPTIONS][1], (state, { payload }) => {
      state.linkTypeOptions = payload?.data || payload || [];
    });

    builder.addCase(
      API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_LINK_ESTABLISHMENT_STATUS_OPTIONS][1],
      (state, { payload }) => {
        state.linkEstablishmentStatusOptions = payload?.data || payload || [];
      }
    );

    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_FRC_RECEIVED_OPTIONS][1], (state, { payload }) => {
      state.frcReceivedOptions = payload?.data || payload || [];
    });

    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_PARTNER_FORWARD_USERS][1], (state, { payload }) => {
      state.partnerForwardUsers = payload?.data || payload || [];
    });

    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_ONBOARDING_DETAILS][1], (state, { payload }) => {
      const data = payload?.data || {};
      state.onboarding.onboardingFormDetails = data;
      state.onboarding.gstDetails = { data: data?.kycGstInformation };

      const completed = [];
      if (data?.basicDetails?.id) completed.push(1);
      // agreementDetails and bankDetails share the same id as basicDetails (scaffold), so check meaningful fields
      if (
        data?.agreementDetails?.oltProvider ||
        data?.agreementDetails?.companyRegistrationNo ||
        data?.agreementDetails?.agreementNumber
      )
        completed.push(2);
      if (data?.bankDetails?.bankIfsc || data?.bankDetails?.bankAcNo) completed.push(3);
      if (data?.kycGstInformation?.pan) completed.push(4);

      state.onboarding.completedSteps = completed;
    });
  }
});

export const { actions, reducer } = slice;
