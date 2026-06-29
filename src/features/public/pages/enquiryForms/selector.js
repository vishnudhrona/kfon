import { flow } from 'lodash-es';

import { STATE_REDUCER_KEY } from './constants';

const enquiryKey = (state) => state[STATE_REDUCER_KEY];

const nlpDetails = (state) => state.nlpDetails;
export const getNlpDetails = flow(enquiryKey, nlpDetails);

const companyTypes = (state) => state.corpDetails.formProps.companyTypes;
export const getCompanyTypes = flow(enquiryKey, companyTypes);

const services = (state) => state.corpDetails.formProps.services;
export const getServices = flow(enquiryKey, services);

const getProgress = (state) => state.formProgress;
export const getFormProgress = flow(enquiryKey, getProgress);

const agnpSubscriberSubmitDetails = (state) => state.agnpSubscriberSubmitDetails;
export const getAgnpSubscriberSubmitDetails = flow(enquiryKey, agnpSubscriberSubmitDetails);

const lnpSubscriberSubmitDetails = (state) => state.lnpSubscriberSubmitDetails;
export const getLnpSubscriberSubmitDetails = flow(enquiryKey, lnpSubscriberSubmitDetails);

const lnpCreatedBy = (state) => state.lnpCreatedBy;
export const getLnpCreatedBy = flow(enquiryKey, lnpCreatedBy);

const homeSubscriberSubmitDetails = (state) => state.homeSubscriberSubmitDetails;
export const getHomeSubscriberSubmitDetails = flow(enquiryKey, homeSubscriberSubmitDetails);

const homeEnquiryData = (state) => state.homeEnquiryData;
export const getHomeEnquiryData = flow(enquiryKey, homeEnquiryData);

const homeEnquiryDataPopupOpen = (state) => state.homeEnquiryDataPopupOpen;
export const getHomeEnquiryDataPopupOpen = flow(enquiryKey, homeEnquiryDataPopupOpen);

const lnpMobileEnquiryData = (state) => state.lnpMobileEnquiryData;
export const getLnpMobileEnquiryData = flow(enquiryKey, lnpMobileEnquiryData);

const lnpEmailEnquiryData = (state) => state.lnpEmailEnquiryData;
export const getLnpEmailEnquiryData = flow(enquiryKey, lnpEmailEnquiryData);

const lnpEnquiryDataPopupOpen = (state) => state.lnpEnquiryDataPopupOpen;
export const getLnpEnquiryDataPopupOpen = flow(enquiryKey, lnpEnquiryDataPopupOpen);

const agnpMobileEnquiryData = (state) => state.agnpMobileEnquiryData;
export const getAgnpMobileEnquiryData = flow(enquiryKey, agnpMobileEnquiryData);

const agnpEmailEnquiryData = (state) => state.agnpEmailEnquiryData;
export const getAgnpEmailEnquiryData = flow(enquiryKey, agnpEmailEnquiryData);

const agnpEnquiryDataPopupOpen = (state) => state.agnpEnquiryDataPopupOpen;
export const getAgnpEnquiryDataPopupOpen = flow(enquiryKey, agnpEnquiryDataPopupOpen);

const industryList = (state) => state.industryList;
export const getIndustryList = flow(enquiryKey, industryList);

const serviceList = (state) => state.serviceList;
export const getServiceList = flow(enquiryKey, serviceList);

const corpGovSubscriberSubmitDetails = (state) => state.corpGovSubscriberSubmitDetails;
export const getCorpGovSubscriberSubmitDetails = flow(enquiryKey, corpGovSubscriberSubmitDetails);

const bplDetails = (state) => state.bplDetails;
export const getBplDetails = flow(enquiryKey, bplDetails);

const departmentList = (state) => state.departmentList;
export const getDepartmentList = flow(enquiryKey, departmentList);

const subDepartmentList = (state) => state.subDepartmentList;
export const getSubDepartmentList = flow(enquiryKey, subDepartmentList);

const enquiryTrackingData = (state) => state.enquiryTrackingData;
export const getEnquiryTrackingData = flow(enquiryKey, enquiryTrackingData);

const enquiryTrackingLoading = (state) => state.enquiryTrackingLoading;
export const getEnquiryTrackingLoading = flow(enquiryKey, enquiryTrackingLoading);

const enquiryTrackingError = (state) => state.enquiryTrackingError;
export const getEnquiryTrackingError = flow(enquiryKey, enquiryTrackingError);

const ticketCategoryList = (state) => state.ticketCategoryList;
export const getTicketCategoryList = flow(enquiryKey, ticketCategoryList);

const trackComplaintData = (state) => state.trackComplaintData;
export const getTrackComplaintData = flow(enquiryKey, trackComplaintData);

const trackComplaintLoading = (state) => state.trackComplaintLoading;
export const getTrackComplaintLoading = flow(enquiryKey, trackComplaintLoading);

const pinCodeDetails = (state) => state.pinCodeDetails;
export const getPinCodeDetails = flow(enquiryKey, pinCodeDetails);
