import { REQUEST_METHOD } from '@/constants/api';
import { FILE_RESPONSE_TYPE } from '@/constants/file';
import { API_URL } from '@/constants/urls';
import { createCommonFetchApi } from '@/utils/apiUtils';
import { getFileNameWithTimestamp } from '@/utils/dateUtils';

import { API_ACTION_TYPE_VARIANTS, API_ACTION_TYPES as ACTION_TYPES } from './actions';
import { DEVICE_TYPES } from './constants';

const commonFetchApi = createCommonFetchApi(API_ACTION_TYPE_VARIANTS);

export const submitBasicDetailsApi = (data = {}) => ({
  url: API_URL.SUBSCRIBER.SUBMIT_BASIC_DETAILS,
  method: REQUEST_METHOD.POST,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.SUBMIT_BASIC_DETAILS],
    data,
    progressKey: ACTION_TYPES.SUBMIT_BASIC_DETAILS
  }
});

export const updateBasicDetailsApi = ({ id, ...data } = {}) => ({
  url: API_URL.SUBSCRIBER.UPDATE_BASIC_DETAILS.replace(':id', id),
  method: REQUEST_METHOD.PATCH,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.UPDATE_BASIC_DETAILS],
    data,
    progressKey: ACTION_TYPES.UPDATE_BASIC_DETAILS
  }
});

export const updateDeviceDetailsApi = ({ id, ...data }) => ({
  url: API_URL.SUBSCRIBER.UPDATE_DEVICE_DETAILS.replace(':id', id),
  method: REQUEST_METHOD.PATCH,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.UPDATE_DEVICE_DETAILS],
    data,
    progressKey: ACTION_TYPES.UPDATE_DEVICE_DETAILS
  }
});

export const updateGstInformationApi = ({ id, ...data }) => ({
  url: API_URL.SUBSCRIBER.UPDATE_GST_INFORMATION.replace(':id', id),
  method: REQUEST_METHOD.PATCH,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.UPDATE_GST_INFORMATION],
    data,
    progressKey: ACTION_TYPES.UPDATE_GST_INFORMATION
  }
});

export const updateAddressDetailsApi = ({ id, isPermanent, ...data }) => ({
  url: `${API_URL.SUBSCRIBER.UPDATE_ADDRESS_DETAILS.replace(':id', id)}?isPermanent=${isPermanent}`,
  method: REQUEST_METHOD.PATCH,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.UPDATE_ADDRESS_DETAILS],
    data,
    progressKey: ACTION_TYPES.UPDATE_ADDRESS_DETAILS
  }
});

export const updateSubscriptionDetailsApi = ({ id, ...data }) => ({
  url: API_URL.SUBSCRIBER.UPDATE_SUBSCRIPTION_DETAILS.replace(':id', id),
  method: REQUEST_METHOD.PATCH,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.UPDATE_SUBSCRIPTION_DETAILS],
    data,
    progressKey: ACTION_TYPES.UPDATE_SUBSCRIPTION_DETAILS
  }
});

export const updateSupportingDocumentsApi = ({ id, ...data }) => ({
  url: API_URL.SUBSCRIBER.UPDATE_SUPPORTING_DOCUMENTS.replace(':id', id),
  method: REQUEST_METHOD.PATCH,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.UPDATE_SUPPORTING_DOCUMENTS],
    data,
    progressKey: ACTION_TYPES.UPDATE_SUPPORTING_DOCUMENTS
  }
});

export const uploadDocumentApi = ({ id, type, file }) => {
  const formData = new FormData();
  formData.append('file', file);
  return {
    url: `${API_URL.SUBSCRIBER.UPLOAD_DOCUMENT.replace(':id', id)}?type=${type}`,
    method: REQUEST_METHOD.POST,
    payload: {
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' }
    }
  };
};

export const uploadSingleDocumentApi = ({ id, type, file }) => {
  const formData = new FormData();
  formData.append('file', file);
  return {
    url: `${API_URL.SUBSCRIBER.UPLOAD_DOCUMENT.replace(':id', id)}?type=${type}`,
    method: REQUEST_METHOD.POST,
    payload: {
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' }
    }
  };
};

export const fetchEnquiryListApi = (data = {}) =>
  commonFetchApi({
    url: API_URL.SUBSCRIBER.FETCH_ENQUIRY_LIST,
    method: REQUEST_METHOD.GET,
    data,
    actionType: ACTION_TYPES.FETCH_ENQUIRY_LIST
  });

export const fetchDeviceProviderApi = () =>
  commonFetchApi({
    url: API_URL.SUBSCRIBER.DEVICE_PROVIDER,
    actionType: ACTION_TYPES.FETCH_DEVICE_PROVIDER,
    isErrorToast: false
  });

export const fetchOntDevicesApi = ({ packageId, lnpId, type } = {}) =>
  commonFetchApi({
    url: API_URL.SUBSCRIBER.ONT_DEVICES.replace(':type', DEVICE_TYPES.ONT),
    actionType: ACTION_TYPES.FETCH_ONT_DEVICES,
    isErrorToast: false,
    data: { packageId, lnpId, type }
  });

export const fetchDeviceTypeApi = () =>
  commonFetchApi({
    url: API_URL.SUBSCRIBER.DEVICE_TYPE,
    actionType: ACTION_TYPES.FETCH_DEVICE_TYPE,
    isErrorToast: false
  });

export const fetchOltTypeApi = () =>
  commonFetchApi({
    url: API_URL.SUBSCRIBER.OLT_TYPE,
    actionType: ACTION_TYPES.FETCH_OLT_TYPE,
    isErrorToast: false
  });

export const fetchOltDeviceListApi = () =>
  commonFetchApi({
    url: API_URL.SUBSCRIBER.OLT_DEVICE_LIST.replace(':type', DEVICE_TYPES.OLT),
    actionType: ACTION_TYPES.FETCH_OLT_DEVICE_LIST,
    isErrorToast: false
  });

export const fetchAvailablePonPortsApi = (oltDeviceId) =>
  commonFetchApi({
    url: API_URL.SUBSCRIBER.PON_PORT_NUMBER.replace(':oltDeviceId', oltDeviceId),
    actionType: ACTION_TYPES.FETCH_AVAILABLE_PON_PORTS,
    isErrorToast: false
  });

export const fetchPlanTypeApi = () =>
  commonFetchApi({
    url: API_URL.SUBSCRIBER.FETCH_PLAN_TYPE,
    actionType: ACTION_TYPES.FETCH_PLAN_TYPE,
    isErrorToast: false
  });

export const fetchPackageTypeApi = () =>
  commonFetchApi({
    url: API_URL.SUBSCRIBER.FETCH_PACKAGE_TYPE,
    actionType: ACTION_TYPES.FETCH_PACKAGE_TYPE,
    isErrorToast: false
  });

export const fetchPackageListApi = (data) =>
  commonFetchApi({
    url: API_URL.PLAN_PACKAGE.FETCH_PACKAGE_LIST,
    data,
    actionType: ACTION_TYPES.FETCH_PACKAGE_LIST,
    isErrorToast: false
  });

export const fetchDistributorListApi = () =>
  commonFetchApi({
    url: API_URL.ONBOARDING.PARTNER_GROUP_AGNP,
    actionType: ACTION_TYPES.FETCH_DISTRIBUTOR_LIST,
    isErrorToast: false
  });

export const fetchPartnerListApi = () =>
  commonFetchApi({
    url: API_URL.ONBOARDING.FETCH_MY_LNP_PARTNERS,
    actionType: ACTION_TYPES.FETCH_PARTNER_LIST,
    isErrorToast: false
  });

export const fetchDeviceDetailsByIdApi = (id) =>
  commonFetchApi({
    url: API_URL.SUBSCRIBER.FETCH_DEVICE_DETAILS_BY_ID.replace(':id', id),
    actionType: ACTION_TYPES.FETCH_DEVICE_DETAILS_BY_ID,
    isErrorToast: false
  });

export const fetchOntNextPositionApi = (ponportMappingLnpId) =>
  commonFetchApi({
    url: API_URL.SUBSCRIBER.ONT_POSITION_NEXT,
    data: { ponportMappingLnpId },
    actionType: ACTION_TYPES.FETCH_ONT_NEXT_POSITION,
    isErrorToast: false
  });

export const fetchEnquiryDashboardApi = () =>
  commonFetchApi({
    url: API_URL.SUBSCRIBER.ENQUIRY_DASHBOARD,
    actionType: ACTION_TYPES.FETCH_ENQUIRY_DASHBOARD,
    isErrorToast: false
  });

export const fetchEnquiryCardDataApi = () =>
  commonFetchApi({
    url: API_URL.SUBSCRIBER.ENQUIRY_CARD_DATA,
    actionType: ACTION_TYPES.FETCH_ENQUIRY_CARD_DATA
  });

export const fetchEnquirySummaryApi = (data = {}) =>
  commonFetchApi({
    url: API_URL.SUBSCRIBER.ENQUIRY_SUMMARY,
    method: REQUEST_METHOD.GET,
    data,
    actionType: ACTION_TYPES.FETCH_ENQUIRY_SUMMARY
  });

export const createCustomerEnquiryApi = (data = {}) => ({
  url: API_URL.SUBSCRIBER.CREATE_ENQUIRY,
  method: REQUEST_METHOD.POST,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.CREATE_CUSTOMER_ENQUIRY],
    data,
    progressKey: ACTION_TYPES.CREATE_CUSTOMER_ENQUIRY
  }
});

export const downloadEnquiryCSVApi = (data = {}) => ({
  url: API_URL.SUBSCRIBER.DOWNLOAD_ENQUIRY_CSV,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.DOWNLOAD_ENQUIRY_CSV],
    data,
    progressKey: ACTION_TYPES.DOWNLOAD_ENQUIRY_CSV,
    isDocument: true,
    documentType: FILE_RESPONSE_TYPE.BLOB,
    fileName: getFileNameWithTimestamp('enquiries')
  }
});

export const assignEnquiryToFEApi = ({ enquiryId, feId, feName }) => ({
  url: API_URL.SUBSCRIBER.ASSIGN_TO_FE.replace(':enquiryId', enquiryId),
  method: REQUEST_METHOD.PATCH,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.ASSIGN_ENQUIRY_TO_FE],
    params: { feId, feName },
    data: { enquiryId },
    progressKey: ACTION_TYPES.ASSIGN_ENQUIRY_TO_FE
  }
});

export const assignEnquiryToLNPApi = ({ enquiryId, lnpId, lnpName }) => ({
  url: API_URL.SUBSCRIBER.ASSIGN_TO_LNP.replace(':enquiryId', enquiryId), // Update if a separate LNP endpoint exists
  method: REQUEST_METHOD.PATCH,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.ASSIGN_ENQUIRY_TO_LNP],
    params: { lnpId, lnpName },
    data: { enquiryId },
    progressKey: ACTION_TYPES.ASSIGN_ENQUIRY_TO_LNP
  }
});

export const saveMeetingApi = (data = {}) => ({
  url: API_URL.SUBSCRIBER.MEETING_SAVE,
  method: REQUEST_METHOD.POST,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.SAVE_MEETING],
    data,
    progressKey: ACTION_TYPES.SAVE_MEETING
  }
});

export const fetchMeetingListApi = (customerEnquiryId) => ({
  url: API_URL.SUBSCRIBER.MEETING_FETCH_ALL,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_MEETING_LIST],
    params: { customerEnquiryId },
    progressKey: ACTION_TYPES.FETCH_MEETING_LIST
  }
});

export const fetchSubscriberListApi = () =>
  commonFetchApi({
    url: API_URL.SUBSCRIBER.FETCH_ALL_SUBSCRIBERS,
    actionType: ACTION_TYPES.FETCH_SUBSCRIBER_LIST,
    isErrorToast: false
  });

export const fetchSubscribersPageApi = (data = {}) =>
  commonFetchApi({
    url: API_URL.SUBSCRIBER.FETCH_SUBSCRIBERS_PAGE,
    method: REQUEST_METHOD.GET,
    data,
    actionType: ACTION_TYPES.FETCH_SUBSCRIBERS_PAGE
  });

export const fetchDispositionListApi = () =>
  commonFetchApi({
    url: API_URL.SUBSCRIBER.FETCH_DISPOSITION_LIST,
    actionType: ACTION_TYPES.FETCH_DISPOSITION_LIST,
    isErrorToast: false
  });

export const fetchDispositionHistoryListApi = ({ customerEnquiryId }) => ({
  url: API_URL.SUBSCRIBER.FETCH_ALL_DISPOSITIONS_HISTORY,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_DISPOSITION_HISTORY_LIST],
    progressKey: ACTION_TYPES.FETCH_DISPOSITION_HISTORY_LIST,
    params: { customerEnquiryId }
  }
});

export const fetchReasonListApi = (disposition) =>
  commonFetchApi({
    url: API_URL.SUBSCRIBER.FETCH_REASON_LIST.replace(':disposition', disposition),
    actionType: ACTION_TYPES.FETCH_REASON_LIST,
    isErrorToast: false
  });

export const submitDispositionApi = ({ enquiryId, ...data }) => ({
  url: API_URL.SUBSCRIBER.SUBMIT_DISPOSITION,
  method: REQUEST_METHOD.POST,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.SUBMIT_DISPOSITION],
    data: { ...data, customerEnquiryId: enquiryId },
    progressKey: ACTION_TYPES.SUBMIT_DISPOSITION
  }
});

export const fetchFEListApi = ({ pincode } = {}) => ({
  url: API_URL.SUBSCRIBER.FETCH_FE_LIST.replace(':pincode', pincode),
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_FE_LIST],
    progressKey: ACTION_TYPES.FETCH_FE_LIST
  }
});

export const fetchLNPListApi = ({ pincode } = {}) => ({
  url: API_URL.SUBSCRIBER.FETCH_LNP_LIST.replace(':pincode', pincode),
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_LNP_LIST],
    progressKey: ACTION_TYPES.FETCH_LNP_LIST
  }
});

export const fetchEnquiryStatusesApi = () =>
  commonFetchApi({
    url: API_URL.SUBSCRIBER.FETCH_ENQUIRY_STATUSES,
    actionType: ACTION_TYPES.FETCH_ENQUIRY_STATUSES,
    isErrorToast: false
  });

export const fetchEwsEnquiryListApi = (data = {}) =>
  commonFetchApi({
    url: API_URL.SUBSCRIBER.FETCH_EWS_ENQUIRY_LIST,
    method: REQUEST_METHOD.GET,
    data,
    actionType: ACTION_TYPES.FETCH_EWS_ENQUIRY_LIST
  });

export const fetchSubscriberByEnquiryIdApi = (id) =>
  commonFetchApi({
    url: API_URL.SUBSCRIBER.FETCH_SUBSCRIBER_BY_ENQUIRY_ID.replace(':id', id),
    actionType: ACTION_TYPES.FETCH_SUBSCRIBER_BY_ENQUIRY_ID,
    isErrorToast: false
  });

export const fetchResidenceProofTypesApi = () =>
  commonFetchApi({
    url: API_URL.SUBSCRIBER.FETCH_RESIDENCE_PROOF_TYPES,
    actionType: ACTION_TYPES.FETCH_RESIDENCE_PROOF_TYPES,
    isErrorToast: true
  });

export const fetchIdentityProofTypesApi = () =>
  commonFetchApi({
    url: API_URL.SUBSCRIBER.FETCH_IDENTITY_PROOF_TYPES,
    actionType: ACTION_TYPES.FETCH_IDENTITY_PROOF_TYPES,
    isErrorToast: true
  });

export const finalizeCafApi = ({ id, enquiryId }) => ({
  url: API_URL.SUBSCRIBER.SUBMIT_CAF.replace(':id', id),
  method: REQUEST_METHOD.POST,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FINALIZE_CAF],
    data: { enquiryId },
    progressKey: ACTION_TYPES.FINALIZE_CAF
  }
});

export const verifySubscriberApi = ({ id, isApproved, reasonForRejection }) => ({
  url: API_URL.SUBSCRIBER.VERIFY_SUBSCRIBER.replace(':id', id),
  method: REQUEST_METHOD.PATCH,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.VERIFY_SUBSCRIBER],
    params: { isApproved },
    ...(isApproved ? {} : { data: { reasonForRejection } }),
    progressKey: ACTION_TYPES.VERIFY_SUBSCRIBER
  }
});

export const onboardSubscriberApi = ({ id }) => ({
  url: API_URL.SUBSCRIBER.ONBOARD_SUBSCRIBER.replace(':id', id),
  method: REQUEST_METHOD.POST,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.ONBOARD_SUBSCRIBER],
    progressKey: ACTION_TYPES.ONBOARD_SUBSCRIBER
  }
});

export const getOntAcknowledgementApi = ({ id }) => ({
  url: API_URL.SUBSCRIBER.GET_ONT_ACKNOWLEDGEMENT.replace(':id', id),
  method: REQUEST_METHOD.POST,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.GET_ONT_ACKNOWLEDGEMENT],
    progressKey: ACTION_TYPES.GET_ONT_ACKNOWLEDGEMENT
  }
});

export const verifyOntAcknowledgementApi = ({ id, otp, otpRefId }) => ({
  url: API_URL.SUBSCRIBER.VERIFY_ONT_ACKNOWLEDGEMENT.replace(':id', id),
  method: REQUEST_METHOD.POST,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.VERIFY_ONT_ACKNOWLEDGEMENT],
    data: { otp, otpReferenceId: otpRefId },
    progressKey: ACTION_TYPES.VERIFY_ONT_ACKNOWLEDGEMENT
  }
});

export const updateEkycDetailsApi = ({ id, ...data }) => ({
  url: API_URL.SUBSCRIBER.UPDATE_EKYC_DETAILS.replace(':id', id),
  method: REQUEST_METHOD.PUT,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.UPDATE_EKYC_DETAILS],
    data,
    progressKey: ACTION_TYPES.UPDATE_EKYC_DETAILS
  }
});

export const submitEkycDetailsApi = (data = {}) => ({
  url: API_URL.SUBSCRIBER.SUBMIT_EKYC_DETAILS,
  method: REQUEST_METHOD.POST,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.SUBMIT_EKYC_DETAILS],
    data,
    progressKey: ACTION_TYPES.SUBMIT_EKYC_DETAILS
  }
});

export const checkFeasibilityApi = ({ latitude, longitude } = {}) => ({
  url: API_URL.ONBOARDING.FEASIBILITY_CHECK,
  method: REQUEST_METHOD.POST,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.CHECK_FEASIBILITY],
    data: { latitude, longitude },
    progressKey: ACTION_TYPES.CHECK_FEASIBILITY
  }
});

export const fetchSubscriberForwardUsersApi = () =>
  commonFetchApi({
    url: API_URL.SUBSCRIBER.FETCH_SUBSCRIBER_FORWARD_USERS,
    actionType: ACTION_TYPES.FETCH_SUBSCRIBER_FORWARD_USERS,
    isErrorToast: false
  });

export const fetchEwsPackagesApi = () =>
  commonFetchApi({
    url: API_URL.SUBSCRIBER.FETCH_EWS_PACKAGES,
    actionType: ACTION_TYPES.FETCH_EWS_PACKAGES,
    isErrorToast: false
  });

export const assignSubscriberEnquiryApi = ({ enquiryId, seatId, seatName, userId, username, type, remarks } = {}) => ({
  url: API_URL.SUBSCRIBER.ASSIGN_SUBSCRIBER_ENQUIRY,
  method: REQUEST_METHOD.POST,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.ASSIGN_SUBSCRIBER_ENQUIRY],
    data: { enquiryId, seatId, seatName, userId, username, type, remarks },
    progressKey: ACTION_TYPES.ASSIGN_SUBSCRIBER_ENQUIRY
  }
});

// --- Subscriber list/details actions (TEMP urls — adjust payload/response when real API ready) ---

export const fetchSubscriberDetailApi = (id) =>
  commonFetchApi({
    url: API_URL.SUBSCRIBER.FETCH_SUBSCRIBER_DETAIL.replace(':id', id),
    actionType: ACTION_TYPES.FETCH_SUBSCRIBER_DETAIL,
    isErrorToast: false
  });

export const fetchSubscriberDataUsageApi = (id) =>
  commonFetchApi({
    url: API_URL.SUBSCRIBER.FETCH_SUBSCRIBER_DATA_USAGE.replace(':id', id),
    actionType: ACTION_TYPES.FETCH_SUBSCRIBER_DATA_USAGE,
    isErrorToast: false
  });

export const fetchRadiusDetailsApi = (username) =>
  commonFetchApi({
    url: API_URL.SUBSCRIBER.FETCH_RADIUS_DETAILS.replace(':username', encodeURIComponent(username)),
    actionType: ACTION_TYPES.FETCH_RADIUS_DETAILS,
    isErrorToast: false
  });

export const updateSubscriberDetailApi = ({ id, ...data } = {}) => ({
  url: API_URL.SUBSCRIBER.UPDATE_SUBSCRIBER_DETAIL.replace(':id', id),
  method: REQUEST_METHOD.PATCH,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.UPDATE_SUBSCRIBER_DETAIL],
    data,
    progressKey: ACTION_TYPES.UPDATE_SUBSCRIBER_DETAIL
  }
});

export const sendMobileChangeOtpApi = ({ id, newMobile } = {}) => ({
  url: API_URL.SUBSCRIBER.SEND_MOBILE_CHANGE_OTP.replace(':id', id),
  method: REQUEST_METHOD.POST,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.SEND_MOBILE_CHANGE_OTP],
    data: { mobileNumber: newMobile },
    progressKey: ACTION_TYPES.SEND_MOBILE_CHANGE_OTP
  }
});

export const verifyMobileChangeOtpApi = ({ id, otp, otpRefId } = {}) => ({
  url: API_URL.SUBSCRIBER.VERIFY_MOBILE_CHANGE_OTP.replace(':id', id),
  method: REQUEST_METHOD.POST,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.VERIFY_MOBILE_CHANGE_OTP],
    data: { otp, otpReferenceId: otpRefId },
    progressKey: ACTION_TYPES.VERIFY_MOBILE_CHANGE_OTP
  }
});

export const resetSubscriberPasswordApi = ({ id } = {}) => ({
  url: API_URL.SUBSCRIBER.RESET_SUBSCRIBER_PASSWORD.replace(':id', id),
  method: REQUEST_METHOD.POST,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.RESET_SUBSCRIBER_PASSWORD],
    progressKey: ACTION_TYPES.RESET_SUBSCRIBER_PASSWORD
  }
});

export const changeUsernameApi = ({ id, username } = {}) => ({
  url: API_URL.SUBSCRIBER.CHANGE_USERNAME.replace(':id', id),
  method: REQUEST_METHOD.PATCH,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.CHANGE_USERNAME],
    data: { newUsername: username },
    progressKey: ACTION_TYPES.CHANGE_USERNAME
  }
});

// Maps server-side list filters onto the download-csv query params
export const downloadSubscribersCsvApi = (filters = {}) => ({
  url: API_URL.SUBSCRIBER.DOWNLOAD_SUBSCRIBERS_CSV,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.DOWNLOAD_SUBSCRIBERS_CSV],
    data: {
      search: filters.search,
      subscriptionStatus: filters.status,
      fromDate: filters.fromDate,
      toDate: filters.toDate,
      district: filters.district,
      pincode: filters.pincode
    },
    progressKey: ACTION_TYPES.DOWNLOAD_SUBSCRIBERS_CSV,
    isDocument: true,
    documentType: FILE_RESPONSE_TYPE.BLOB,
    fileName: getFileNameWithTimestamp('subscribers')
  }
});
