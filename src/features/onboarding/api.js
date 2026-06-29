import { MULTI_PART_FORM_HEADER, REQUEST_METHOD } from '@/constants/api';
import { FILE_RESPONSE_TYPE } from '@/constants/file';
import { API_URL } from '@/constants/urls';
import { getFileNameWithTimestamp } from '@/utils/dateUtils';

import { ACTION_TYPES, API_ACTION_TYPE_VARIANTS } from './action';

export const onboardingBasicDetailsApi = (data = {}) => ({
  url: API_URL.ONBOARDING.ONBOARDING_BASIC_DETAILS_SUBMIT,
  method: REQUEST_METHOD.POST,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.ONBOARDING_BASIC_DETAILS_SUBMIT],
    data,
    progressKey: ACTION_TYPES.ONBOARDING_BASIC_DETAILS_SUBMIT
  }
});

export const updateOnboardingBasicDetailsApi = (payload = {}) => {
  const { id, ...data } = payload;
  return {
    url: API_URL.ONBOARDING.ONBOARDING_BASIC_DETAILS_UPDATE.replace(':id', id),
    method: REQUEST_METHOD.PATCH,
    payload: {
      types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.ONBOARDING_BASIC_DETAILS_SUBMIT],
      data,
      progressKey: ACTION_TYPES.ONBOARDING_BASIC_DETAILS_SUBMIT
    }
  };
};

export const fetchOnboardingDetailsApi = (data = {}) => ({
  url: API_URL.ONBOARDING.FETCH_DETAILS.replace(':id', data?.id),
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_ONBOARDING_DETAILS],
    progressKey: ACTION_TYPES.FETCH_ONBOARDING_DETAILS
  }
});

export const onboardingAgreementDetailsApi = (payload = {}) => {
  const { id, ...data } = payload;
  return {
    url: API_URL.ONBOARDING.ONBOARDING_AGREEMENT_DETAILS_SUBMIT.replace(':id', id),
    method: REQUEST_METHOD.PATCH,
    payload: {
      types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.ONBOARDING_AGREEMENT_DETAILS_SUBMIT],
      data,
      progressKey: ACTION_TYPES.ONBOARDING_AGREEMENT_DETAILS_SUBMIT
    }
  };
};

export const onboardingBankDetailsApi = (payload = {}) => {
  const { id, ...data } = payload;
  return {
    url: API_URL.ONBOARDING.ONBOARDING_BANK_DETAILS_SUBMIT.replace(':id', id),
    method: REQUEST_METHOD.PATCH,
    payload: {
      types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.ONBOARDING_BANK_DETAILS_SUBMIT],
      data,
      progressKey: ACTION_TYPES.ONBOARDING_BANK_DETAILS_SUBMIT
    }
  };
};

export const onboardingKycGstDetailsApi = (payload = {}) => {
  const { id, ...data } = payload;
  return {
    url: API_URL.ONBOARDING.ONBOARDING_KYC_GST_DETAILS_SUBMIT.replace(':id', id),
    method: REQUEST_METHOD.PATCH,
    payload: {
      types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.ONBOARDING_KYC_GST_DETAILS_SUBMIT],
      data,
      progressKey: ACTION_TYPES.ONBOARDING_KYC_GST_DETAILS_SUBMIT
    }
  };
};

export const onboardingDocumentUploadApi = (payload = {}) => {
  const { id, type, file } = payload;
  const formData = new FormData();
  const actualFile = file && typeof file === 'object' && 'length' in file ? file[0] : file;
  formData.append('file', actualFile);

  return {
    url: API_URL.ONBOARDING.ONBOARDING_DOCUMENT_UPLOAD.replace(':id', id),
    method: REQUEST_METHOD.POST,
    payload: {
      types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.ONBOARDING_SUPPORTING_DOCUMENTS_SUBMIT],
      data: formData,
      params: { type },
      headers: MULTI_PART_FORM_HEADER,
      progressKey: ACTION_TYPES.ONBOARDING_SUPPORTING_DOCUMENTS_SUBMIT
    }
  };
};

export const fetchDistributorFieldApi = () => ({
  url: API_URL.ONBOARDING.DISTRIBUTOR_FIELD_FETCH,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.DISTRIBUTOR_FIELD_FETCH],
    progressKey: ACTION_TYPES.DISTRIBUTOR_FIELD_FETCH
  }
});

export const searchOnboardingGstDetailsApi = (data = {}) => {
  return {
    url: API_URL.ONBOARDING.ONBOARDING_GST_DETAILS_SEARCH,
    method: REQUEST_METHOD.POST,
    payload: {
      types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.ONBOARDING_GST_DETAILS_SEARCH],
      data,
      progressKey: ACTION_TYPES.ONBOARDING_GST_DETAILS_SEARCH
    }
  };
};

export const fetchOnboardingPopNameApi = () => ({
  url: API_URL.ONBOARDING.ONBOARDING_POP_NAME_FETCH,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.ONBOARDING_POP_NAME_FETCH],
    progressKey: ACTION_TYPES.ONBOARDING_POP_NAME_FETCH
  }
});

export const updateOnboardingPopApi = (payload = {}) => {
  const { id, ...data } = payload;
  return {
    url: API_URL.ONBOARDING.ONBOARDING_POP_DETAILS_UPDATE.replace(':id', id),
    method: REQUEST_METHOD.PATCH,
    payload: {
      types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.ONBOARDING_POP_UPDATE],
      data,
      progressKey: ACTION_TYPES.ONBOARDING_POP_UPDATE
    }
  };
};

export const fetchOnboardingPincodeApi = () => ({
  url: API_URL.ONBOARDING.ONBOARDING_PINCODE_FETCH,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.ONBOARDING_PINCODE_FETCH],
    progressKey: ACTION_TYPES.ONBOARDING_PINCODE_FETCH
  }
});

export const fetchOnboardingPostofficeApi = (data) => ({
  url: API_URL.ONBOARDING.ONBOARDING_POSTOFFICE_FETCH.replace(':pincode', data?.pincode),
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.ONBOARDING_POSTOFFICE_FETCH],
    progressKey: ACTION_TYPES.ONBOARDING_POSTOFFICE_FETCH,
    isErrorToast: false
  }
});

export const fetchOnboardingIfscDetailsApi = (data) => ({
  url: API_URL.ONBOARDING.ONBOARDING_IFSC_DETAILS_FETCH.replace(':ifscCode', data?.ifscCode),
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.ONBOARDING_IFSC_DETAILS_FETCH],
    progressKey: ACTION_TYPES.ONBOARDING_IFSC_DETAILS_FETCH,
    isErrorToast: false
  }
});

export const fetchOnboardingCompanyNatureApi = () => ({
  url: API_URL.ONBOARDING.ONBOARDING_COMPANY_NATURE_FETCH,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.ONBOARDING_COMPANY_NATURE_FETCH],
    progressKey: ACTION_TYPES.ONBOARDING_COMPANY_NATURE_FETCH
  }
});

export const fetchOnboardingBankAccountTypeApi = () => ({
  url: API_URL.ONBOARDING.ONBOARDING_BANK_ACCOUNT_TYPE_FETCH,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.ONBOARDING_BANK_ACCOUNT_TYPE_FETCH],
    progressKey: ACTION_TYPES.ONBOARDING_BANK_ACCOUNT_TYPE_FETCH
  }
});

export const fetchOnboardingSharePlanApi = () => ({
  url: API_URL.ONBOARDING.ONBOARDING_SHARE_PLAN_FETCH,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.ONBOARDING_SHARE_PLAN_FETCH],
    progressKey: ACTION_TYPES.ONBOARDING_SHARE_PLAN_FETCH
  }
});

export const fetchLnpPartnersListApi = (data = {}) => ({
  url: API_URL.ENQUIRY.FETCH_LNP_AGNP_PARTNERS_LIST,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.LNP_PARTNERS_LIST_FETCH],
    params: { ...data, forwardType: data.forwardType || 'inbox' },
    progressKey: ACTION_TYPES.LNP_PARTNERS_LIST_FETCH
  }
});

export const fetchLnpPartnerStatusDropdownApi = (data = {}) => ({
  url: API_URL.ENQUIRY.FETCH_LNP_PARTNER_STATUS_DROPDOWN,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.LNP_PARTNER_STATUS_DROPDOWN_FETCH],
    data,
    progressKey: ACTION_TYPES.LNP_PARTNER_STATUS_DROPDOWN_FETCH
  }
});

export const updateLnpPartnerApi = (payload = {}) => {
  const { enquiryId, ...data } = payload;
  return {
    url: API_URL.ENQUIRY.UPDATE_LNP_PARTNER.replace(':enquiryId', enquiryId),
    method: REQUEST_METHOD.PUT,
    payload: {
      types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.LNP_PARTNER_UPDATE],
      data,
      progressKey: ACTION_TYPES.LNP_PARTNER_UPDATE
    }
  };
};

export const fetchAgnpPartnersListApi = (data = {}) => ({
  url: API_URL.ENQUIRY.FETCH_LNP_AGNP_PARTNERS_LIST,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.AGNP_PARTNERS_LIST_FETCH],
    progressKey: ACTION_TYPES.AGNP_PARTNERS_LIST_FETCH,
    params: { ...data, forwardType: data.forwardType || 'inbox' }
  }
});

export const updateAgnpPartnerApi = (payload = {}) => {
  const { enquiryId, ...data } = payload;
  return {
    url: API_URL.ENQUIRY.UPDATE_AGNP_PARTNER.replace(':enquiryId', enquiryId),
    method: REQUEST_METHOD.PUT,
    payload: {
      types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.AGNP_PARTNER_UPDATE],
      data,
      progressKey: ACTION_TYPES.AGNP_PARTNER_UPDATE
    }
  };
};

export const fetchVlanMappingDataApi = (data = {}) => ({
  url: API_URL.VLAN.ONBOARDING_VLAN_MAPPING_DATA_FETCH,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.ONBOARDING_VLAN_MAPPING_DATA_FETCH],
    progressKey: ACTION_TYPES.ONBOARDING_VLAN_MAPPING_DATA_FETCH,
    data
  }
});

export const fetchVlanRequestDataApi = (data = {}) => ({
  url: API_URL.VLAN.ONBOARDING_VLAN_REQUEST_DATA_FETCH,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.ONBOARDING_VLAN_REQUEST_DATA_FETCH],
    progressKey: ACTION_TYPES.ONBOARDING_VLAN_REQUEST_DATA_FETCH,
    data
  }
});

export const fetchPartnerForwardUsersApi = ({ onboardingType, enquiryId } = {}) => ({
  url: API_URL.ENQUIRY.FETCH_PARTNER_FORWARD_USERS.replace(':onboardingType', onboardingType).replace(
    ':enquiryId',
    enquiryId
  ),
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_PARTNER_FORWARD_USERS],
    progressKey: ACTION_TYPES.FETCH_PARTNER_FORWARD_USERS
  }
});

export const forwardPartnerEnquiryApi = (payload = {}) => {
  const { enquiryId, ...data } = payload;
  return {
    url: API_URL.ENQUIRY.FORWARD_PARTNER_ENQUIRY.replace(':enquiryId', enquiryId),
    method: REQUEST_METHOD.POST,
    payload: {
      types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FORWARD_PARTNER_ENQUIRY],
      data,
      progressKey: ACTION_TYPES.FORWARD_PARTNER_ENQUIRY
    }
  };
};

export const forwardAgnpEnquiryApi = (payload = {}) => {
  const { enquiryId, ...data } = payload;
  return {
    url: API_URL.ENQUIRY.FORWARD_AGNP_ENQUIRY.replace(':enquiryId', enquiryId),
    method: REQUEST_METHOD.POST,
    payload: {
      types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FORWARD_AGNP_ENQUIRY],
      data,
      progressKey: ACTION_TYPES.FORWARD_AGNP_ENQUIRY
    }
  };
};

export const assignEnquiryApi = (data = {}) => ({
  url: API_URL.ENQUIRY.ASSIGN_ENQUIRY,
  method: REQUEST_METHOD.POST,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.ASSIGN_ENQUIRY],
    data,
    progressKey: ACTION_TYPES.ASSIGN_ENQUIRY
  }
});

export const assignEnquiryToPreviousUserApi = (data = {}) => ({
  url: API_URL.ENQUIRY.ASSIGN_ENQUIRY_TO_PREVIOUS_USER,
  method: REQUEST_METHOD.POST,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.ASSIGN_ENQUIRY_TO_PREVIOUS_USER],
    data,
    progressKey: ACTION_TYPES.ASSIGN_ENQUIRY_TO_PREVIOUS_USER
  }
});

export const submitVlanRequestApi = (data = {}) => ({
  url: API_URL.VLAN.ONBOARDING_VLAN_REQUEST_SUBMIT,
  method: REQUEST_METHOD.POST,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.ONBOARDING_VLAN_REQUEST_SUBMIT],
    progressKey: ACTION_TYPES.ONBOARDING_VLAN_REQUEST_SUBMIT,
    data
  }
});

export const submitVlanMappingApi = (data = {}) => ({
  url: API_URL.VLAN.ONBOARDING_VLAN_MAPPING_SUBMIT,
  method: REQUEST_METHOD.POST,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.ONBOARDING_VLAN_MAPPING_SUBMIT],
    progressKey: ACTION_TYPES.ONBOARDING_VLAN_MAPPING_SUBMIT,
    data
  }
});

export const updateVlanMappingApi = ({ id, ...data } = {}) => ({
  url: API_URL.VLAN.ONBOARDING_VLAN_MAPPING_UPDATE.replace(':id', id),
  method: REQUEST_METHOD.PATCH,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.ONBOARDING_VLAN_MAPPING_UPDATE],
    progressKey: ACTION_TYPES.ONBOARDING_VLAN_MAPPING_UPDATE,
    data
  }
});

export const fetchVlanTypeListApi = () => ({
  url: API_URL.VLAN.FETCH_VLAN_TYPE_LIST,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_VLAN_TYPE_LIST],
    progressKey: ACTION_TYPES.FETCH_VLAN_TYPE_LIST
  }
});

export const fetchPartnerListApi = (data = {}) => ({
  url: API_URL.VLAN.FETCH_PARTNER_LIST,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_VLAN_PARTNER_LIST],
    progressKey: ACTION_TYPES.FETCH_VLAN_PARTNER_LIST,
    params: data
  }
});

export const fetchPartnerEnquiryApi = (data = {}) => {
  const { enquiryId, type } = data;
  let url = API_URL.ENQUIRY.FETCH_PARTNER_ENQUIRY.replace(':enquiryId', enquiryId);

  if (type === 'agnp') {
    url = API_URL.ENQUIRY.FETCH_AGNP_PARTNER_ENQUIRY.replace(':enquiryId', enquiryId);
  }

  return {
    url,
    method: REQUEST_METHOD.GET,
    payload: {
      types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_PARTNER_ENQUIRY],
      progressKey: ACTION_TYPES.FETCH_PARTNER_ENQUIRY
    }
  };
};

export const singleOnboardingDataApi = (data = {}) => ({
  url: API_URL.ONBOARDING.FETCH_SINGLE_ONBOARDING_DATA.replace(':id', data),
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_SINGLE_ONBOARDING_DATA],
    params: {},
    progressKey: ACTION_TYPES.FETCH_SINGLE_ONBOARDING_DATA
  }
});

export const resetPasswordApi = (data = {}) => ({
  url: API_URL.ONBOARDING.RESET_PASSWORD.replace(':id', data),
  method: REQUEST_METHOD.PATCH,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.RESET_PASSWORD],
    params: data,
    progressKey: ACTION_TYPES.RESET_PASSWORD
  }
});

export const downloadAgnpListCsvApi = (data = {}) => ({
  url: API_URL.AGNP.DOWNLOAD_AGNP_LIST_CSV,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.DOWNLOAD_AGNP_LIST_CSV],
    params: data,
    progressKey: ACTION_TYPES.DOWNLOAD_AGNP_LIST_CSV,
    isDocument: true,
    documentType: FILE_RESPONSE_TYPE.BLOB,
    fileName: getFileNameWithTimestamp('agnp_list')
  }
});

export const addServiceAreaApi = (data = {}) => {
  const { id, ...payload } = data;
  return {
    url: API_URL.ONBOARDING.ADD_SERVICE_AREA.replace(':id', id),
    method: REQUEST_METHOD.PATCH,
    payload: {
      types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.ADD_SERVICE_AREA],
      data: payload,
      progressKey: ACTION_TYPES.ADD_SERVICE_AREA
    }
  };
};

export const fetchOltDeviceListApi = () => ({
  url: API_URL.INVENTORY.PON_PORT.FETCH_OLT_DEVICE_LIST,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_OLT_DEVICE_LIST],
    progressKey: ACTION_TYPES.FETCH_OLT_DEVICE_LIST
  }
});

export const fileStorageUploadApi = (payload = {}) => {
  const { file, module, entityId, ownerUserId } = payload;
  const formData = new FormData();
  formData.append('file', file);
  const params = { module };
  if (entityId) params.entityId = entityId;
  if (ownerUserId) params.ownerUserId = ownerUserId;

  return {
    url: API_URL.COMMON.FILE_UPLOAD,
    method: REQUEST_METHOD.POST,
    payload: {
      types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FILE_STORAGE_UPLOAD],
      data: formData,
      params,
      headers: MULTI_PART_FORM_HEADER,
      progressKey: ACTION_TYPES.FILE_STORAGE_UPLOAD
    }
  };
};

export const fileStorageDeleteApi = (fileId) => ({
  url: API_URL.COMMON.FILE_DELETE_URL.replace(':fileId', fileId),
  method: REQUEST_METHOD.DELETE,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FILE_STORAGE_DELETE],
    progressKey: ACTION_TYPES.FILE_STORAGE_DELETE
  }
});

export const deleteOnboardingDocumentApi = ({ fileId, documentType }) => ({
  url: API_URL.ONBOARDING.ONBOARDING_DOCUMENT_DELETE,
  method: REQUEST_METHOD.DELETE,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.ONBOARDING_DOCUMENT_DELETE],
    params: { fileId, documentType },
    progressKey: ACTION_TYPES.ONBOARDING_DOCUMENT_DELETE
  }
});

export const fileStorageViewUrlApi = (fileId) => ({
  url: API_URL.COMMON.FILE_URL.replace(':fileId', fileId),
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FILE_STORAGE_VIEW_URL],
    progressKey: ACTION_TYPES.FILE_STORAGE_VIEW_URL
  }
});

export const submitOnboardingApi = (payload = {}) => {
  const { id, submitFlag } = payload;
  return {
    url: API_URL.ONBOARDING.ONBOARDING_FINAL_SUBMIT.replace(':id', id),
    method: REQUEST_METHOD.PATCH,
    payload: {
      types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.ONBOARDING_FINAL_SUBMIT],
      params: { submitFlag },
      progressKey: ACTION_TYPES.ONBOARDING_FINAL_SUBMIT
    }
  };
};

export const fetchPartnerDetailsByIdApi = (id) => ({
  url: API_URL.ONBOARDING.FETCH_PARTNER_DETAILS_BY_ID.replace(':id', id),
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_PARTNER_DETAILS_BY_ID],
    progressKey: ACTION_TYPES.FETCH_PARTNER_DETAILS_BY_ID
  }
});

export const fetchPartnersAllApi = (data = {}) => ({
  url: API_URL.ONBOARDING.PARTNERS_FETCH_ALL,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.PARTNERS_FETCH_ALL],
    params: data,
    progressKey: ACTION_TYPES.PARTNERS_FETCH_ALL
  }
});

export const updatePartnerDetailsApi = (payload = {}) => {
  const { id, ...data } = payload;
  return {
    url: API_URL.ONBOARDING.UPDATE_PARTNER_DETAILS.replace(':id', id),
    method: REQUEST_METHOD.PATCH,
    payload: {
      types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.UPDATE_PARTNER_DETAILS],
      data,
      progressKey: ACTION_TYPES.UPDATE_PARTNER_DETAILS
    }
  };
};

export const fetchLinkTypeOptionsApi = () => ({
  url: API_URL.ONBOARDING.FETCH_LINK_TYPE_OPTIONS,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_LINK_TYPE_OPTIONS],
    progressKey: ACTION_TYPES.FETCH_LINK_TYPE_OPTIONS
  }
});

export const fetchLinkEstablishmentStatusOptionsApi = () => ({
  url: API_URL.ONBOARDING.FETCH_LINK_ESTABLISHMENT_STATUS_OPTIONS,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_LINK_ESTABLISHMENT_STATUS_OPTIONS],
    progressKey: ACTION_TYPES.FETCH_LINK_ESTABLISHMENT_STATUS_OPTIONS
  }
});

export const fetchFrcReceivedOptionsApi = () => ({
  url: API_URL.ONBOARDING.FETCH_FRC_RECEIVED_OPTIONS,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_FRC_RECEIVED_OPTIONS],
    progressKey: ACTION_TYPES.FETCH_FRC_RECEIVED_OPTIONS
  }
});

export const downloadPartnerListCsvApi = (data = {}) => ({
  url: API_URL.ONBOARDING.DOWNLOAD_PARTNER_LIST_CSV,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.DOWNLOAD_PARTNER_LIST_CSV],
    params: data,
    progressKey: ACTION_TYPES.DOWNLOAD_PARTNER_LIST_CSV,
    isDocument: true,
    documentType: FILE_RESPONSE_TYPE.BLOB,
    fileName: getFileNameWithTimestamp('partner_list')
  }
});

export const downloadPartnerEnquiryCsvApi = (data = {}) => ({
  url: API_URL.ENQUIRY.DOWNLOAD_PARTNER_ENQUIRY_CSV,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.DOWNLOAD_PARTNER_ENQUIRY_CSV],
    params: data,
    progressKey: ACTION_TYPES.DOWNLOAD_PARTNER_ENQUIRY_CSV,
    isDocument: true,
    documentType: FILE_RESPONSE_TYPE.BLOB,
    fileName: getFileNameWithTimestamp('partner_enquiry')
  }
});

export const downloadVlanMappingsCsvApi = (data = {}) => ({
  url: API_URL.VLAN.DOWNLOAD_VLAN_MAPPINGS_CSV,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.DOWNLOAD_VLAN_MAPPINGS_CSV],
    params: data,
    progressKey: ACTION_TYPES.DOWNLOAD_VLAN_MAPPINGS_CSV,
    isDocument: true,
    documentType: FILE_RESPONSE_TYPE.BLOB,
    fileName: getFileNameWithTimestamp('vlan_association')
  }
});
