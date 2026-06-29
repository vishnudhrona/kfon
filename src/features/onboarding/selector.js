import { createSelector } from '@reduxjs/toolkit';
import { flow, get } from 'lodash-es';

import { SERVER_SIDE_TABLE_KEYS } from '@/constants/server_table';
import { sortByNameAsc } from '@/utils/validationUtils';

import { STATE_REDUCER_KEY } from './constants';

const onboardingKey = (state) => state[STATE_REDUCER_KEY];

// Base selectors for specific state branches
const getOnboardingState = (state) => state[STATE_REDUCER_KEY]?.onboarding;
const getPopNameState = (state) => state[STATE_REDUCER_KEY]?.popName;
const getPincodeState = (state) => state[STATE_REDUCER_KEY]?.pincode;
const getPostofficeState = (state) => state[STATE_REDUCER_KEY]?.postOffice;
const getIfscDetailsState = (state) => state[STATE_REDUCER_KEY]?.ifscDetails;
const getCompanyNatureState = (state) => state[STATE_REDUCER_KEY]?.companyNature;
const getBankAccountTypeState = (state) => state[STATE_REDUCER_KEY]?.bankAccountType;
const getSharePlanState = (state) => state[STATE_REDUCER_KEY]?.sharePlan;

const onboardingBasicDetails = () => null;
export const getonboardingFormId = flow(onboardingKey, onboardingBasicDetails);

export const getonboardingFormDetails = createSelector(
  [getOnboardingState],
  (onboarding) => onboarding?.onboardingFormDetails || null
);

export const getDistributorField = createSelector(
  [getOnboardingState],
  (onboarding) => onboarding?.distributor?.data || null
);

export const getGstDetails = createSelector(
  [getOnboardingState],
  (onboarding) => onboarding?.gstDetails || null
);

export const getGstSearchFailed = createSelector(
  [getOnboardingState],
  (onboarding) => onboarding?.gstSearchFailed || false
);

export const getBasicDetailsResponse = createSelector(
  [getOnboardingState],
  (onboarding) => onboarding?.basicDetailsResponse || null
);

export const getPopName = createSelector(
  [getPopNameState],
  (popName) => popName?.data || null
);

export const getPincode = createSelector(
  [getPincodeState],
  (pincode) => pincode?.data || null
);

export const getPostoffice = createSelector(
  [getPostofficeState],
  (postOffice) => postOffice || null
);

export const getIfscDetails = createSelector(
  [getIfscDetailsState],
  (ifscDetails) => ifscDetails || null
);

export const getCompanyNature = createSelector(
  [getCompanyNatureState],
  (companyNature) => companyNature?.data || null
);

export const getBankAccountType = createSelector(
  [getBankAccountTypeState],
  (bankAccountType) => bankAccountType?.data || null
);

export const getSharePlan = createSelector(
  [getSharePlanState],
  (sharePlan) => sharePlan?.data || null
);

export const getTableData = (key) => flow(onboardingKey, (state) => get(state, key, {}));

const getLnpPartnersListRaw = (state) => state[SERVER_SIDE_TABLE_KEYS.LNP_PARTNERS_LIST_TABLE]?.data || [];

export const getLnpPartnersList = createSelector([getLnpPartnersListRaw], (data) => {
  const formattedData = data.map((item) => ({
    ...item,
    district: item.district?.name || '-'
  }));
  return { data: formattedData };
});

const getAgnpPartnersListRaw = (state) => state[SERVER_SIDE_TABLE_KEYS.AGNP_PARTNERS_LIST_TABLE]?.data || [];

export const getAgnpPartnersList = createSelector([getAgnpPartnersListRaw], (data) => {
  return { data };
});

export const getLnpPartnerStatusOptions = createSelector(
  [onboardingKey],
  (state) => state?.lnpPartnerStatusOptions || []
);

export const getCompletedSteps = createSelector([getOnboardingState], (onboarding) => {
  const data = onboarding?.completedSteps || [];
  return Array.isArray(data) ? data : [];
});

const getRootDataSelector = createSelector(
  [getonboardingFormDetails],
  (data) => (Array.isArray(data) ? data[0] : data)
);

export const getBasicDetails = createSelector([getRootDataSelector], (root) => {
  if (root?.basicDetails) {
    return { ...root.basicDetails, id: root.id || root.basicDetails.id };
  }
  return root;
});

export const getAgreementType = createSelector([getBasicDetails], (basicDetails) => {
  return basicDetails?.agreementType || '';
});

export const getAgreementDetails = createSelector([getRootDataSelector], (root) => {
  return root?.agreementDetails;
});

export const getBankDetails = createSelector([getRootDataSelector], (root) => {
  return root?.bankDetails;
});

export const getKycGstInformation = createSelector([getRootDataSelector], (root) => {
  return root?.kycGstInformation;
});

export const getSupportingDocuments = createSelector([getRootDataSelector], (root) => {
  return root?.supportingDocuments;
});

export const getGstInformation = createSelector([getRootDataSelector], (root) => {
  return root?.kycGstInformation;
});

export const getGstEnabled = createSelector([getRootDataSelector], (root) => {
  return root?.gstEnabled;
});

export const getVlanMappingData = getTableData(SERVER_SIDE_TABLE_KEYS.VLAN_ASSOCIATION_TABLE);
export const getVlanRequestData = getTableData(SERVER_SIDE_TABLE_KEYS.VLAN_REQUEST_TABLE);

const partnerList = (state) => {
  const data = state?.partnerList || [];
  return sortByNameAsc(
    data.map((item) => ({
      ...item,
      name: item.displayName
    })),
    'name'
  );
};
export const getPartnerList = flow(onboardingKey, partnerList);

const vlanType = (state) => state?.vlanType || [];
export const getVlanType = flow(onboardingKey, vlanType);

const singleOnboardingData = (state) => state?.singleOnboardingData;
export const getSingleOnboardingData = flow(onboardingKey, singleOnboardingData);

const oltDeviceListSelector = (state) => state?.oltDeviceList;
export const getOltDeviceList = flow(onboardingKey, oltDeviceListSelector);

const partnerDetails = (state) => state?.partnerDetails;
export const getPartnerDetails = flow(onboardingKey, partnerDetails);

const linkTypeOptions = (state) => state?.linkTypeOptions || [];
export const getLinkTypeOptions = flow(onboardingKey, linkTypeOptions);

const linkEstablishmentStatusOptions = (state) => state?.linkEstablishmentStatusOptions || [];
export const getLinkEstablishmentStatusOptions = flow(onboardingKey, linkEstablishmentStatusOptions);

const frcReceivedOptions = (state) => state?.frcReceivedOptions || [];
export const getFrcReceivedOptions = flow(onboardingKey, frcReceivedOptions);

const partnerForwardUsers = (state) => state?.partnerForwardUsers || [];
export const getPartnerForwardUsers = flow(onboardingKey, partnerForwardUsers);
