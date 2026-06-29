import { createSelector } from '@reduxjs/toolkit';
import { flow } from 'lodash-es';

import { getServerSideData } from '@/features/others/Pagination/selectors';
import { selectorWithKey } from '@/utils/commonUtils';

import { ENQUIRY_TABLE_KEY, EWS_ENQUIRY_TABLE_KEY, STATE_REDUCER_KEY, SUBSCRIBERS_LIST_TABLE_KEY } from './constants';

const applicationKey = (state) => state[STATE_REDUCER_KEY];

const enquiryList = (state) => state.enquiryList;
export const getEnquiryList = flow(applicationKey, enquiryList);

const enquiryDashboard = (state) => state.enquiryDashboard;
export const getEnquiryDashboard = flow(applicationKey, enquiryDashboard);

const subscriberId = (state) => state.subscriberId;
export const getSubscriberId = flow(applicationKey, subscriberId);

const subscriberDetail = (state) => state.subscriberDetail;
export const getSubscriberDetail = flow(applicationKey, subscriberDetail);

const subscriberDetailLoading = (state) => state.subscriberDetailLoading;
export const getSubscriberDetailLoading = flow(applicationKey, subscriberDetailLoading);

const subscriberDataUsage = (state) => state.subscriberDataUsage;
export const getSubscriberDataUsage = flow(applicationKey, subscriberDataUsage);

const radiusDetails = (state) => state.radiusDetails;
export const getRadiusDetails = flow(applicationKey, radiusDetails);

const basicDetailsCompleted = (state) => state.completedSteps.basicDetails;
export const getBasicDetailsCompleted = flow(applicationKey, basicDetailsCompleted);

const deviceDetailsCompleted = (state) => state.completedSteps.deviceDetails;
export const getDeviceDetailsCompleted = flow(applicationKey, deviceDetailsCompleted);

const gstInformationCompleted = (state) => state.completedSteps.gstInformation;
export const getGstInformationCompleted = flow(applicationKey, gstInformationCompleted);

const supportingDocumentsCompleted = (state) => state.completedSteps.supportingDocuments;
export const getSupportingDocumentsCompleted = flow(applicationKey, supportingDocumentsCompleted);

const permanentAddressCompleted = (state) => state.completedSteps.permanentAddress;
export const getPermanentAddressCompleted = flow(applicationKey, permanentAddressCompleted);

const installationAddressCompleted = (state) => state.completedSteps.installationAddress;
export const getInstallationAddressCompleted = flow(applicationKey, installationAddressCompleted);

const isDifferentInstallationAddress = (state) => state.isDifferentInstallationAddress;
export const getIsDifferentInstallationAddress = flow(applicationKey, isDifferentInstallationAddress);

const addressDetailsCompleted = (state) => state.completedSteps.permanentAddress || state.completedSteps.installationAddress;
export const getAddressDetailsCompleted = flow(applicationKey, addressDetailsCompleted);

const subscriptionDetailsCompleted = (state) => state.completedSteps.subscriptionDetails;
export const getSubscriptionDetailsCompleted = flow(applicationKey, subscriptionDetailsCompleted);

const addressDetails = (state) => state.addressDetails;
export const getAddressDetails = flow(applicationKey, addressDetails);

const permanentAddressDetails = (state) => state.permanentAddressDetails;
export const getPermanentAddressDetails = flow(applicationKey, permanentAddressDetails);

const deviceProviderList = (state) => state.deviceProviderList;
export const getDeviceProviderList = flow(applicationKey, deviceProviderList);

const deviceList = (state) => state.deviceList;
export const getDeviceList = flow(applicationKey, deviceList);

const deviceTypeList = (state) => state.deviceTypeList;
export const getDeviceTypeList = flow(applicationKey, deviceTypeList);

const oltTypeList = (state) => state.oltTypeList;
export const getOltTypeList = flow(applicationKey, oltTypeList);

const oltDeviceList = (state) => state.oltDeviceList;
export const getOltDeviceList = flow(applicationKey, oltDeviceList);

const ponPortNumberList = (state) => state.ponPortNumberList;
export const getPonPortNumberList = flow(applicationKey, ponPortNumberList);

const planTypeList = (state) => state.planTypeList;
export const getPlanTypeList = flow(applicationKey, planTypeList);

const packageTypeList = (state) => state.packageTypeList;
export const getPackageTypeList = flow(applicationKey, packageTypeList);

const packageList = (state) => state.packageList;
export const getPackageList = flow(applicationKey, packageList);

const distributorList = (state) => state.distributorList;
export const getDistributorList = flow(applicationKey, distributorList);

const partnerList = (state) => state.partnerList;
export const getPartnerList = flow(applicationKey, partnerList);

const selectedDeviceDetails = (state) => state.selectedDeviceDetails;
export const getSelectedDeviceDetails = flow(applicationKey, selectedDeviceDetails);

const subscriberList = (state) => state.subscriberList.data.content;
export const getSubscriberList = flow(applicationKey, subscriberList);

export const getEnquiryByTrackingId = createSelector(
  [getEnquiryList, (state, trackingId) => trackingId],
  (enquiryList, trackingId) => {
    const list = Array.isArray(enquiryList?.data) ? enquiryList.data : enquiryList?.data?.content || [];
    return list.find((item) => item.trackingId === trackingId);
  }
);

const enquiryCardData = (state) => state.enquiryCardData;
export const getEnquiryCardData = flow(applicationKey, enquiryCardData);

export const getEnquirySummary = (state) => selectorWithKey(getServerSideData(state), ENQUIRY_TABLE_KEY) || [];
export const getEwsEnquiryList = (state) => selectorWithKey(getServerSideData(state), EWS_ENQUIRY_TABLE_KEY) || [];
export const getSubscribersPage = (state) => selectorWithKey(getServerSideData(state), SUBSCRIBERS_LIST_TABLE_KEY) || [];

const meetingList = (state) => state.meetingList;
export const getMeetingList = flow(applicationKey, meetingList);

const feList = (state) => state.feList;
export const getFEList = flow(applicationKey, feList);

const lnpList = (state) => state.lnpList;
export const getLNPList = flow(applicationKey, lnpList);

const dispositionList = (state) => state.dispositionList;
export const getDispositionList = flow(applicationKey, dispositionList);

const reasonList = (state) => state.reasonList;
export const getReasonList = flow(applicationKey, reasonList);

const enquiryStatusList = (state) => state.enquiryStatusList;
export const getEnquiryStatusList = flow(applicationKey, enquiryStatusList);

const prepopulatedData = (state) => state.prepopulatedData;
export const getPrepopulatedData = flow(applicationKey, prepopulatedData);



const residenceProofTypeList = (state) => state.residenceProofTypeList;
export const getResidenceProofTypeList = flow(applicationKey, residenceProofTypeList);

const identityProofTypeList = (state) => state.identityProofTypeList;
export const getIdentityProofTypeList = flow(applicationKey, identityProofTypeList);

const dispositionHistoryMap = (state) => state.dispositionHistoryMap;
export const getDispositionHistoryMap = flow(applicationKey, dispositionHistoryMap);

const meetingHistoryMap = (state) => state.meetingHistoryMap;
export const getMeetingHistoryMap = flow(applicationKey, meetingHistoryMap);

export const getMeetingHistoryByEnquiryId = createSelector(
  [getMeetingHistoryMap, (_, enquiryId) => enquiryId],
  (historyMap, enquiryId) => historyMap[enquiryId] || []
);

const feasibilityData = (state) => state.feasibilityData;
export const getFeasibilityData = flow(applicationKey, feasibilityData);

const subscriberForwardUsers = (state) => state.subscriberForwardUsers || [];
export const getSubscriberForwardUsers = flow(applicationKey, subscriberForwardUsers);

const ewsPackageList = (state) => state.ewsPackageList;
export const getEwsPackageList = flow(applicationKey, ewsPackageList);

const feasibilityLoading = (state) => state.feasibilityLoading;
export const getFeasibilityLoading = flow(applicationKey, feasibilityLoading);

export const getLatestDispositionByEnquiryId = createSelector(
  [getDispositionHistoryMap, (_, enquiryId) => enquiryId],
  (historyMap, enquiryId) => {
    const history = historyMap[enquiryId];
    if (!history || history.length === 0) return null;
    return history.reduce((latest, current) => {
      if (!latest.createdAt || !current.createdAt) return current;
      return new Date(current.createdAt) > new Date(latest.createdAt) ? current : latest;
    }, history[0]);
  }
);

