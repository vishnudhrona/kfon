import { MULTI_PART_FORM_HEADER, REQUEST_METHOD } from '@/constants/api';
import { FILE_RESPONSE_TYPE } from '@/constants/file';
import { API_URL } from '@/constants/urls';

import { ACTION_TYPES, API_ACTION_TYPE_VARIANTS } from './action';

export const ticketTableDataApi = () => ({
  url: API_URL.AGNP.FETCH_TICKET_TABLE_DATA,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_TICKET_TABLE_DATA],
    progressKey: ACTION_TYPES.FETCH_TICKET_TABLE_DATA
  }
});

export const corporateEnquiryListApi = (params) => ({
  url: API_URL.CORPORATE.ENQUIRY.LIST,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_CORPORATE_ENQUIRY_LIST],
    progressKey: ACTION_TYPES.FETCH_CORPORATE_ENQUIRY_LIST,
    params
  }
});

export const fetchCorporateEnquirySummaryListApi = (params) => ({
  url: API_URL.CORPORATE.ENQUIRY.FETCH_ALL_SUMMARY,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_CORPORATE_ENQUIRY_SUMMARY],
    progressKey: ACTION_TYPES.FETCH_CORPORATE_ENQUIRY_SUMMARY,
    params
  }
});

export const fetchCorporateEnquiryOutboxApi = (params) => ({
  url: API_URL.CORPORATE.ENQUIRY.OUTBOX,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_CORPORATE_ENQUIRY_OUTBOX],
    progressKey: ACTION_TYPES.FETCH_CORPORATE_ENQUIRY_OUTBOX,
    params
  }
});

export const downloadEnquiryListCsvApi = ({ type } = {}) => ({
  url: API_URL.CORPORATE.ENQUIRY.DOWNLOAD_CSV,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.DOWNLOAD_ENQUIRY_LIST_CSV],
    progressKey: ACTION_TYPES.DOWNLOAD_ENQUIRY_LIST_CSV,
    params: { ...(type && type !== 'ALL' && { type }) },
    isDocument: true,
    documentType: FILE_RESPONSE_TYPE.BLOB,
    fileName: 'enquiry_list.csv'
  }
});

export const downloadLocationListApi = () => ({
  url: API_URL.CORPORATE.ENQUIRY.DOWNLOAD_CSV,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.DOWNLOAD_LOCATION_LIST_CSV],
    progressKey: ACTION_TYPES.DOWNLOAD_LOCATION_LIST_CSV,
    isDocument: true,
    documentType: FILE_RESPONSE_TYPE.BLOB
  }
});

export const downloadLocationReportApi = () => ({
  url: API_URL.CORPORATE.ENQUIRY.LIST,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.DOWNLOAD_LOCATION_REPORT_CSV],
    progressKey: ACTION_TYPES.DOWNLOAD_LOCATION_REPORT_CSV,
    isDocument: true,
    documentType: FILE_RESPONSE_TYPE.BLOB
  }
});

export const createCorporateEnquiryApi = (data) => ({
  url: API_URL.CORPORATE.ENQUIRY.CREATE,
  method: REQUEST_METHOD.POST,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.CREATE_CORPORATE_ENQUIRY],
    progressKey: ACTION_TYPES.CREATE_CORPORATE_ENQUIRY,
    data,
    headers: MULTI_PART_FORM_HEADER
  }
});

export const corporateEnquiryLocationsListApi = () => ({
  url: API_URL.CORPORATE.ENQUIRY.FETCH_LOCATIONS,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_CORP_ENQUIRY_LOCATION_LIST],
    progressKey: ACTION_TYPES.FETCH_CORP_ENQUIRY_LOCATION_LIST
  }
});

export const corporateCustomerListApi = (params) => ({
  url: API_URL.CORPORATE.CUSTOMER.LIST,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_CORPORATE_CUSTOMER_LIST],
    progressKey: ACTION_TYPES.FETCH_CORPORATE_CUSTOMER_LIST,
    params
  }
});

export const createCorporateCustomerApi = (data) => ({
  url: API_URL.CORPORATE.CUSTOMER.CREATE,
  method: REQUEST_METHOD.POST,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.CREATE_CORPORATE_CUSTOMER],
    data,
    progressKey: ACTION_TYPES.CREATE_CORPORATE_CUSTOMER
  }
});

export const fetchCustomerDetailsApi = (params) => ({
  url: API_URL.CORPORATE.CUSTOMER.DETAILS,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_CUSTOMER_DETAILS],
    progressKey: ACTION_TYPES.FETCH_CUSTOMER_DETAILS,
    params
  }
});

export const fetchServicesListApi = () => ({
  url: API_URL.PLAN_PACKAGE.FETCH_SERVICE_CATEGORY_LOOKUP_BY_TYPE,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_SERVICES_LIST],
    progressKey: ACTION_TYPES.FETCH_SERVICES_LIST,
    params: { type: 'CORPORATE' }
  }
});

export const fetchEnquiryListApi = () => ({
  url: API_URL.CORPORATE.ENQUIRY.LIST,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_ENQUIRY_LIST],
    progressKey: ACTION_TYPES.FETCH_ENQUIRY_LIST
  }
});

export const fetchCompanyTypeListApi = () => ({
  url: API_URL.CORPORATE.ENQUIRY.FETCH_INDUSTRIES,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_COMPANY_TYPE_LIST],
    progressKey: ACTION_TYPES.FETCH_COMPANY_TYPE_LIST
  }
});

export const downloadLocationSampleCsvApi = () => ({
  url: API_URL.CORPORATE.ENQUIRY.DOWNLOAD_SAMPLE_CSV,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.DOWNLOAD_LOCATION_SAMPLE_CSV],
    progressKey: ACTION_TYPES.DOWNLOAD_LOCATION_SAMPLE_CSV,
    isDocument: true,
    documentType: FILE_RESPONSE_TYPE.BLOB,
    fileName: 'location_sample.csv'
  }
});

export const corporatePackageListApi = (params) => ({
  url: API_URL.CORPORATE.PACKAGES.LIST,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_CORPORATE_PACKAGE_LIST],
    progressKey: ACTION_TYPES.FETCH_CORPORATE_PACKAGE_LIST,
    params
  }
});

export const downloadPackageListCsvApi = () => ({
  url: API_URL.CORPORATE.PACKAGES.DOWNLOAD_CSV,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.DOWNLOAD_PACKAGE_LIST_CSV],
    progressKey: ACTION_TYPES.DOWNLOAD_PACKAGE_LIST_CSV,
    isDocument: true,
    documentType: FILE_RESPONSE_TYPE.BLOB,
    fileName: 'corporate_packages.csv'
  }
});

export const createCorporatePackageApi = (data) => ({
  url: API_URL.CORPORATE.PACKAGES.CREATE,
  method: REQUEST_METHOD.POST,
  data,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.CREATE_CORPORATE_PACKAGE],
    progressKey: ACTION_TYPES.CREATE_CORPORATE_PACKAGE
  }
});

export const fetchServiceTypesApi = () => ({
  url: API_URL.CORPORATE.PACKAGES.SERVICE_TYPES,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_SERVICE_TYPES],
    progressKey: ACTION_TYPES.FETCH_SERVICE_TYPES
  }
});

export const fetchSubServiceTypesApi = () => ({
  url: API_URL.CORPORATE.PACKAGES.SUB_SERVICE_TYPES,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_SUB_SERVICE_TYPES],
    progressKey: ACTION_TYPES.FETCH_SUB_SERVICE_TYPES
  }
});

export const fetchPlanTypesApi = () => ({
  url: API_URL.CORPORATE.PACKAGES.PLAN_TYPES,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_PLAN_TYPES],
    progressKey: ACTION_TYPES.FETCH_PLAN_TYPES
  }
});
export const fetchLocationDetailsApi = (params) => ({
  url: API_URL.CORPORATE.ENQUIRY.FETCH_LOCATIONS,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_LOCATION_DETAILS],
    progressKey: ACTION_TYPES.FETCH_LOCATION_DETAILS,
    params
  }
});

export const submitLocationDataApi = (data) => ({
  url: API_URL.CORPORATE.ENQUIRY.SUBMIT_LOCATION,
  method: REQUEST_METHOD.POST,
  data,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.SUBMIT_LOCATION_DATA],
    progressKey: ACTION_TYPES.SUBMIT_LOCATION_DATA
  }
});

export const locationForwardToFEApi = (data) => ({
  url: API_URL.CORPORATE.ENQUIRY.FORWARD_TO_FE,
  method: REQUEST_METHOD.POST,
  data,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.LOCATION_FORWARD_TO_FE],
    progressKey: ACTION_TYPES.LOCATION_FORWARD_TO_FE
  }
});

export const locationForwardToLNPApi = (data) => ({
  url: API_URL.CORPORATE.ENQUIRY.FORWARD_TO_LNP,
  method: REQUEST_METHOD.POST,
  data,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.LOCATION_FORWARD_TO_LNP],
    progressKey: ACTION_TYPES.LOCATION_FORWARD_TO_LNP
  }
});

export const corporateProposalListApi = (params) => ({
  url: API_URL.CORPORATE.PROPOSALS.LIST,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_CORPORATE_PROPOSAL_LIST],
    progressKey: ACTION_TYPES.FETCH_CORPORATE_PROPOSAL_LIST,
    params
  }
});

export const downloadProposalListCsvApi = () => ({
  url: API_URL.CORPORATE.PROPOSALS.DOWNLOAD_CSV,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.DOWNLOAD_PROPOSAL_LIST_CSV],
    progressKey: ACTION_TYPES.DOWNLOAD_PROPOSAL_LIST_CSV,
    isDocument: true,
    documentType: FILE_RESPONSE_TYPE.BLOB,
    fileName: 'corporate_proposals.csv'
  }
});

export const createCorporateProposalApi = (data) => ({
  url: API_URL.CORPORATE.PROPOSALS.CREATE,
  method: REQUEST_METHOD.POST,
  data,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.CREATE_CORPORATE_PROPOSAL],
    progressKey: ACTION_TYPES.CREATE_CORPORATE_PROPOSAL
  }
});

export const fetchProposalRevisionsApi = (params) => ({
  url: API_URL.CORPORATE.PROPOSALS.REVISIONS,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_PROPOSAL_REVISIONS],
    progressKey: ACTION_TYPES.FETCH_PROPOSAL_REVISIONS,
    params
  }
});

export const fetchProposalDetailsApi = (params) => ({
  url: API_URL.CORPORATE.PROPOSALS.DETAILS,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_PROPOSAL_DETAILS],
    progressKey: ACTION_TYPES.FETCH_PROPOSAL_DETAILS,
    params
  }
});

export const fetchEnquiryDetailsApi = (params) => ({
  url: API_URL.CORPORATE.ENQUIRY.DETAILS.replace(':enquiryId', params.enquiryId),
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_ENQUIRY_DETAILS],
    progressKey: ACTION_TYPES.FETCH_ENQUIRY_DETAILS
  }
});

export const updateCorporateProposalApi = ({ proposalId, ...data }) => ({
  url: API_URL.CORPORATE.PROPOSALS.UPDATE,
  method: REQUEST_METHOD.PUT,
  params: { proposalId },
  data,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.UPDATE_CORPORATE_PROPOSAL],
    progressKey: ACTION_TYPES.UPDATE_CORPORATE_PROPOSAL
  }
});

const formatPoDate = (date) => {
  if (!date) return null;
  const d = new Date(date);
  if (isNaN(d)) return null;
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
};

export const createPurchaseOrderApi = ({ enquiryId, version, poDate, poStartDate, poEndDate, ...rest }) => {
  const formData = new FormData();
  const body = {
    ...rest,
    poDate: formatPoDate(poDate),
    poStartDate: formatPoDate(poStartDate),
    poEndDate: formatPoDate(poEndDate)
  };
  formData.append('payload', new Blob([JSON.stringify(body)], { type: 'application/json' }));
  return {
    url: API_URL.CORPORATE.PROPOSALS.CREATE_PO.replace(':enquiryId', enquiryId).replace(':version', version),
    method: REQUEST_METHOD.POST,
    payload: {
      types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.CREATE_PURCHASE_ORDER],
      progressKey: ACTION_TYPES.CREATE_PURCHASE_ORDER,
      data: formData,
      headers: MULTI_PART_FORM_HEADER
    }
  };
};

export const fetchPurchaseOrderDetailsApi = ({ enquiryId, version, ...params }) => ({
  url: API_URL.CORPORATE.PROPOSALS.FETCH_PO.replace(':enquiryId', enquiryId).replace(':version', version),
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_PO_DETAILS],
    progressKey: ACTION_TYPES.FETCH_PO_DETAILS,
    params
  }
});

export const updatePurchaseOrderApi = ({ enquiryId, version, poDate, poStartDate, poEndDate, ...rest }) => {
  const formData = new FormData();
  const body = {
    ...rest,
    poDate: formatPoDate(poDate),
    poStartDate: formatPoDate(poStartDate),
    poEndDate: formatPoDate(poEndDate)
  };
  formData.append('payload', new Blob([JSON.stringify(body)], { type: 'application/json' }));
  return {
    url: API_URL.CORPORATE.PROPOSALS.UPDATE_PO.replace(':enquiryId', enquiryId).replace(':version', version),
    method: REQUEST_METHOD.PUT,
    payload: {
      types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.UPDATE_PURCHASE_ORDER],
      progressKey: ACTION_TYPES.UPDATE_PURCHASE_ORDER,
      data: formData,
      headers: MULTI_PART_FORM_HEADER
    }
  };
};

export const deletePurchaseOrderDocumentApi = ({ enquiryId, version, fileId }) => ({
  url: API_URL.CORPORATE.PROPOSALS.DELETE_PO_DOCUMENT.replace(':enquiryId', enquiryId)
    .replace(':version', version)
    .replace(':fileId', fileId),
  method: REQUEST_METHOD.DELETE,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.DELETE_PO_DOCUMENT],
    progressKey: ACTION_TYPES.DELETE_PO_DOCUMENT
  }
});

export const fetchCircuitProvisioningApi = ({ enquiryId, locationId }) => ({
  url: API_URL.CORPORATE.PROPOSALS.FETCH_CIRCUIT_PROVISIONING
    .replace(':enquiryId', enquiryId)
    .replace(':locationId', locationId),
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_CIRCUIT_PROVISIONING],
    progressKey: ACTION_TYPES.FETCH_CIRCUIT_PROVISIONING
  }
});

export const createCircuitProvisioningApi = ({ enquiryId, locationId, ...data }) => ({
  url: API_URL.CORPORATE.PROPOSALS.CREATE_CIRCUIT_PROVISIONING
    .replace(':enquiryId', enquiryId)
    .replace(':locationId', locationId),
  method: REQUEST_METHOD.POST,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.CREATE_CIRCUIT_PROVISIONING],
    progressKey: ACTION_TYPES.CREATE_CIRCUIT_PROVISIONING,
    data
  }
});

export const updateCircuitProvisioningApi = ({ enquiryId, locationId, ...data }) => ({
  url: API_URL.CORPORATE.PROPOSALS.UPDATE_CIRCUIT_PROVISIONING
    .replace(':enquiryId', enquiryId)
    .replace(':locationId', locationId),
  method: REQUEST_METHOD.PUT,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.UPDATE_CIRCUIT_PROVISIONING],
    progressKey: ACTION_TYPES.UPDATE_CIRCUIT_PROVISIONING,
    data
  }
});

export const fetchServiceProvisioningApi = ({ enquiryId, locationId }) => ({
  url: API_URL.CORPORATE.PROPOSALS.FETCH_SERVICE_PROVISIONING
    .replace(':enquiryId', enquiryId)
    .replace(':locationId', locationId),
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_SERVICE_PROVISIONING],
    progressKey: ACTION_TYPES.FETCH_SERVICE_PROVISIONING
  }
});

const formatServiceDate = (dateStr) => {
  if (!dateStr) return null;
  // Convert yyyy-MM-dd → dd-MM-yyyy expected by backend LocalDate
  const parts = dateStr.split('-');
  if (parts.length === 3 && parts[0].length === 4) return `${parts[2]}-${parts[1]}-${parts[0]}`;
  return dateStr;
};

export const createServiceProvisioningApi = ({ enquiryId, locationId, commissionDoc, commissionDate, ...rest }) => {
  const formData = new FormData();
  formData.append('payload', JSON.stringify({ ...rest, commissionDate: formatServiceDate(commissionDate) }));
  if (commissionDoc) formData.append('commissionDoc', commissionDoc);
  return {
    url: API_URL.CORPORATE.PROPOSALS.CREATE_SERVICE_PROVISIONING
      .replace(':enquiryId', enquiryId)
      .replace(':locationId', locationId),
    method: REQUEST_METHOD.POST,
    payload: {
      types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.CREATE_SERVICE_PROVISIONING],
      progressKey: ACTION_TYPES.CREATE_SERVICE_PROVISIONING,
      data: formData,
      headers: MULTI_PART_FORM_HEADER
    }
  };
};

export const updateServiceProvisioningApi = ({ enquiryId, locationId, commissionDoc, commissionDate, ...rest }) => {
  const formData = new FormData();
  formData.append('payload', JSON.stringify({ ...rest, commissionDate: formatServiceDate(commissionDate) }));
  if (commissionDoc) formData.append('commissionDoc', commissionDoc);
  return {
    url: API_URL.CORPORATE.PROPOSALS.UPDATE_SERVICE_PROVISIONING
      .replace(':enquiryId', enquiryId)
      .replace(':locationId', locationId),
    method: REQUEST_METHOD.PUT,
    payload: {
      types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.UPDATE_SERVICE_PROVISIONING],
      progressKey: ACTION_TYPES.UPDATE_SERVICE_PROVISIONING,
      data: formData,
      headers: MULTI_PART_FORM_HEADER
    }
  };
};

export const approveServiceProvisioningApi = ({ enquiryId, locationId, approvalStatus, remarks }) => ({
  url: API_URL.CORPORATE.PROPOSALS.APPROVE_SERVICE_PROVISIONING
    .replace(':enquiryId', enquiryId)
    .replace(':locationId', locationId),
  method: REQUEST_METHOD.PUT,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.APPROVE_SERVICE_PROVISIONING],
    progressKey: ACTION_TYPES.APPROVE_SERVICE_PROVISIONING,
    data: { approvalStatus, remarks }
  }
});

export const fetchServiceCommissioningInvoiceApi = ({ enquiryId, locationId }) => ({
  url: API_URL.CORPORATE.PROPOSALS.FETCH_SERVICE_COMMISSIONING_INVOICE
    .replace(':enquiryId', enquiryId)
    .replace(':locationId', locationId),
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_SERVICE_COMMISSIONING_INVOICE],
    progressKey: ACTION_TYPES.FETCH_SERVICE_COMMISSIONING_INVOICE
  }
});

export const generateServiceCommissioningInvoiceApi = ({ enquiryId, locationId }) => ({
  url: API_URL.CORPORATE.PROPOSALS.GENERATE_SERVICE_COMMISSIONING_INVOICE
    .replace(':enquiryId', enquiryId)
    .replace(':locationId', locationId),
  method: REQUEST_METHOD.POST,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.GENERATE_SERVICE_COMMISSIONING_INVOICE],
    progressKey: ACTION_TYPES.GENERATE_SERVICE_COMMISSIONING_INVOICE
  }
});

export const fetchCircuitMulticastTypesApi = () => ({
  url: API_URL.CORPORATE.PROPOSALS.FETCH_CIRCUIT_MULTICAST_TYPES,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_CIRCUIT_MULTICAST_TYPES],
    progressKey: ACTION_TYPES.FETCH_CIRCUIT_MULTICAST_TYPES
  }
});

export const fetchCircuitServiceProvidersApi = () => ({
  url: API_URL.CORPORATE.PROPOSALS.FETCH_CIRCUIT_SERVICE_PROVIDERS,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_CIRCUIT_SERVICE_PROVIDERS],
    progressKey: ACTION_TYPES.FETCH_CIRCUIT_SERVICE_PROVIDERS
  }
});

export const generatePoPdfApi = ({ enquiryId, version }) => ({
  url: API_URL.CORPORATE.PROPOSALS.GENERATE_PO_PDF.replace(':enquiryId', enquiryId).replace(':version', version),
  method: REQUEST_METHOD.POST,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.GENERATE_PO_PDF],
    progressKey: ACTION_TYPES.GENERATE_PO_PDF
  }
});

export const fetchForwardRolesApi = () => ({
  url: API_URL.CORPORATE.ENQUIRY.FORWARD_ROLES,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_FORWARD_ROLES],
    progressKey: ACTION_TYPES.FETCH_FORWARD_ROLES
  }
});

export const fetchRoleUsersApi = ({ roleId } = {}) => ({
  url: API_URL.CORPORATE.ENQUIRY.ROLE_USERS,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_ROLE_USERS],
    progressKey: ACTION_TYPES.FETCH_ROLE_USERS,
    params: { roleId }
  }
});

export const fetchEnquiryNotesApi = ({ enquiryId }) => ({
  url: API_URL.CORPORATE.ENQUIRY.ENQUIRY_NOTES.replace(':enquiryId', enquiryId),
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_ENQUIRY_NOTES],
    progressKey: ACTION_TYPES.FETCH_ENQUIRY_NOTES
  }
});

export const saveNoteApi = ({ enquiryId, ...data }) => ({
  url: API_URL.CORPORATE.ENQUIRY.SAVE_NOTE.replace(':enquiryId', enquiryId),
  method: REQUEST_METHOD.POST,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.SAVE_NOTE],
    progressKey: ACTION_TYPES.SAVE_NOTE,
    data
  }
});

export const fetchDispositionListApi = () => ({
  url: API_URL.CORPORATE.ENQUIRY.FETCH_DISPOSITIONS,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_DISPOSITION_LIST],
    progressKey: ACTION_TYPES.FETCH_DISPOSITION_LIST
  }
});

export const fetchReasonListApi = ({ disposition }) => ({
  url: API_URL.CORPORATE.ENQUIRY.FETCH_REASONS.replace(':disposition', disposition),
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_REASON_LIST],
    progressKey: ACTION_TYPES.FETCH_REASON_LIST
  }
});

const locationDispositionUrl = (enquiryId, locationId) =>
  API_URL.CORPORATE.ENQUIRY.SAVE_DISPOSITION.replace(':enquiryId', enquiryId).replace(':locationId', locationId);

export const saveDispositionApi = ({ enquiryId, locationId, ...data }) => ({
  url: locationDispositionUrl(enquiryId, locationId),
  method: REQUEST_METHOD.POST,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.SAVE_DISPOSITION],
    progressKey: ACTION_TYPES.SAVE_DISPOSITION,
    data
  }
});

export const updateDispositionApi = ({ enquiryId, locationId, ...data }) => ({
  url: locationDispositionUrl(enquiryId, locationId),
  method: REQUEST_METHOD.PUT,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.UPDATE_DISPOSITION],
    progressKey: ACTION_TYPES.UPDATE_DISPOSITION,
    data
  }
});

export const fetchLocationDispositionApi = ({ enquiryId, locationId }) => ({
  url: locationDispositionUrl(enquiryId, locationId),
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_LOCATION_DISPOSITION],
    progressKey: ACTION_TYPES.FETCH_LOCATION_DISPOSITION
  }
});

export const saveMeetingApi = ({ enquiryId, ...data }) => ({
  url: API_URL.CORPORATE.ENQUIRY.SAVE_MEETING.replace(':enquiryId', enquiryId),
  method: REQUEST_METHOD.POST,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.SAVE_MEETING],
    progressKey: ACTION_TYPES.SAVE_MEETING,
    data
  }
});

export const assignEnquiryApi = (data) => ({
  url: API_URL.CORPORATE.ENQUIRY.ASSIGN_INDIVIDUAL,
  method: REQUEST_METHOD.POST,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.ASSIGN_ENQUIRY],
    progressKey: ACTION_TYPES.ASSIGN_ENQUIRY,
    data
  }
});

export const assignEnquiryMultipleApi = (data) => ({
  url: API_URL.CORPORATE.ENQUIRY.ASSIGN_MULTIPLE,
  method: REQUEST_METHOD.POST,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.ASSIGN_ENQUIRY_MULTIPLE],
    progressKey: ACTION_TYPES.ASSIGN_ENQUIRY_MULTIPLE,
    data
  }
});

export const forwardEnquiryApi = ({ enquiryId, ...data }) => ({
  url: API_URL.CORPORATE.ENQUIRY.FORWARD_ENQUIRY.replace(':enquiryId', enquiryId),
  method: REQUEST_METHOD.POST,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FORWARD_ENQUIRY],
    progressKey: ACTION_TYPES.FORWARD_ENQUIRY,
    data
  }
});

export const fetchMeetingHistoryApi = ({ enquiryId }) => ({
  url: API_URL.CORPORATE.ENQUIRY.MEETING_HISTORY.replace(':enquiryId', enquiryId),
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_MEETING_HISTORY],
    progressKey: ACTION_TYPES.FETCH_MEETING_HISTORY
  }
});

export const updateCorporateEnquiryApi = ({ enquiryId, ...data }) => ({
  url: API_URL.CORPORATE.ENQUIRY.UPDATE_ENQUIRY.replace(':enquiryId', enquiryId),
  method: REQUEST_METHOD.PUT,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.UPDATE_CORPORATE_ENQUIRY],
    progressKey: ACTION_TYPES.UPDATE_CORPORATE_ENQUIRY,
    data
  }
});

export const fetchFeasibilityLnpListApi = () => ({
  url: API_URL.CORPORATE.ENQUIRY.FETCH_FEASIBILITY_LNP_LIST,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_FEASIBILITY_LNP_LIST],
    progressKey: ACTION_TYPES.FETCH_FEASIBILITY_LNP_LIST
  }
});

export const fetchFeasibilityConnectedByListApi = () => ({
  url: API_URL.CORPORATE.ENQUIRY.FETCH_FEASIBILITY_CONNECTED_BY_LIST,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_FEASIBILITY_CONNECTED_BY_LIST],
    progressKey: ACTION_TYPES.FETCH_FEASIBILITY_CONNECTED_BY_LIST
  }
});

export const fetchNearestPopApi = () => ({
  url: API_URL.CORPORATE.ENQUIRY.FETCH_NEAREST_POP,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_NEAREST_POP],
    progressKey: ACTION_TYPES.FETCH_NEAREST_POP
  }
});

export const saveFeasibilityApi = ({ enquiryId, ...data }) => ({
  url: API_URL.CORPORATE.ENQUIRY.SAVE_FEASIBILITY.replace(':enquiryId', enquiryId),
  method: REQUEST_METHOD.POST,
  data,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.SAVE_FEASIBILITY],
    progressKey: ACTION_TYPES.SAVE_FEASIBILITY
  }
});

const nearestConnectionUrl = (enquiryId, locationId) =>
  API_URL.CORPORATE.ENQUIRY.NEAREST_CONNECTION.replace(':enquiryId', enquiryId).replace(':locationId', locationId);

export const fetchNearestLocationApi = ({ enquiryId, locationId }) => ({
  url: nearestConnectionUrl(enquiryId, locationId),
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_NEAREST_LOCATION],
    progressKey: ACTION_TYPES.FETCH_NEAREST_LOCATION
  }
});

export const saveNearestLocationApi = ({ enquiryId, locationId, ...data }) => ({
  url: nearestConnectionUrl(enquiryId, locationId),
  method: REQUEST_METHOD.POST,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.SAVE_NEAREST_LOCATION],
    progressKey: ACTION_TYPES.SAVE_NEAREST_LOCATION,
    data
  }
});

export const updateNearestLocationApi = ({ enquiryId, locationId, ...data }) => ({
  url: nearestConnectionUrl(enquiryId, locationId),
  method: REQUEST_METHOD.PUT,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.UPDATE_NEAREST_LOCATION],
    progressKey: ACTION_TYPES.UPDATE_NEAREST_LOCATION,
    data
  }
});

export const saveCustomerBasicDetailsApi = (data) => ({
  url: API_URL.CORPORATE.KYC.BASIC_DETAILS_CREATE,
  method: REQUEST_METHOD.POST,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.SAVE_CUSTOMER_BASIC_DETAILS],
    progressKey: ACTION_TYPES.SAVE_CUSTOMER_BASIC_DETAILS,
    data
  }
});

export const updateCustomerBasicDetailsApi = ({ cusId, ...data }) => ({
  url: API_URL.CORPORATE.KYC.BASIC_DETAILS_UPDATE.replace(':cusId', cusId),
  method: REQUEST_METHOD.PUT,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.UPDATE_CUSTOMER_BASIC_DETAILS],
    progressKey: ACTION_TYPES.UPDATE_CUSTOMER_BASIC_DETAILS,
    data
  }
});

export const updateCustomerPANDetailsApi = ({ cusId, pan }) => ({
  url: API_URL.CORPORATE.KYC.PAN_DETAILS_UPDATE.replace(':cusId', cusId),
  method: REQUEST_METHOD.PUT,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.UPDATE_CUSTOMER_PAN_DETAILS],
    progressKey: ACTION_TYPES.UPDATE_CUSTOMER_PAN_DETAILS,
    data: { pan }
  }
});

export const fetchKycDetailsApi = ({ customerId }) => ({
  url: API_URL.CORPORATE.KYC.DETAILS.replace(':customerId', customerId),
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_KYC_DETAILS],
    progressKey: ACTION_TYPES.FETCH_KYC_DETAILS
  }
});

export const updateCustomerGSTDetailsApi = ({ cusId, ...data }) => ({
  url: API_URL.CORPORATE.KYC.GST_DETAILS_UPDATE.replace(':cusId', cusId),
  method: REQUEST_METHOD.PUT,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.UPDATE_CUSTOMER_GST_DETAILS],
    progressKey: ACTION_TYPES.UPDATE_CUSTOMER_GST_DETAILS,
    data
  }
});

export const uploadKycDocumentApi = ({ cusId, docType, formData }) => ({
  url: API_URL.CORPORATE.KYC.UPLOAD_KYC_DOCUMENT.replace(':cusId', cusId).replace(':docType', docType),
  method: REQUEST_METHOD.POST,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.UPLOAD_KYC_DOCUMENT],
    progressKey: ACTION_TYPES.UPLOAD_KYC_DOCUMENT,
    headers: MULTI_PART_FORM_HEADER,
    data: formData
  }
});

export const downloadLocationCsvTemplateApi = () => ({
  url: API_URL.CORPORATE.ENQUIRY.DOWNLOAD_LOCATION_CSV_TEMPLATE,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.DOWNLOAD_LOCATION_CSV_TEMPLATE],
    progressKey: ACTION_TYPES.DOWNLOAD_LOCATION_CSV_TEMPLATE,
    isDocument: true,
    documentType: FILE_RESPONSE_TYPE.BLOB,
    fileName: 'location_template.csv'
  }
});

export const corporateLocationUploadApi = ({ enquiryId, formData }) => ({
  url: API_URL.CORPORATE.ENQUIRY.CORPORATE_LOCATION_UPLOAD.replace(':enquiryId', enquiryId),
  method: REQUEST_METHOD.POST,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.CORPORATE_LOCATION_UPLOAD],
    progressKey: ACTION_TYPES.CORPORATE_LOCATION_UPLOAD,
    headers: MULTI_PART_FORM_HEADER,
    data: formData
  }
});

export const searchCorporateGstDetailsApi = (data = {}) => ({
  url: API_URL.ONBOARDING.ONBOARDING_GST_DETAILS_SEARCH,
  method: REQUEST_METHOD.POST,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.SEARCH_CORPORATE_GST_DETAILS],
    progressKey: ACTION_TYPES.SEARCH_CORPORATE_GST_DETAILS,
    data
  }
});

export const verifyCustomerApi = ({ q, page = 1, limit = 10 }) => ({
  url: API_URL.CORPORATE.ENQUIRY.CUSTOMER_VERIFICATION,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.VERIFY_CUSTOMER],
    progressKey: ACTION_TYPES.VERIFY_CUSTOMER,
    params: { q, page, limit }
  }
});

export const fetchEnquiryLocationsApi = ({ enquiryId, locationId }) => ({
  url: API_URL.CORPORATE.ENQUIRY.FETCH_ENQUIRY_LOCATIONS.replace(':enquiryId', enquiryId),
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_ENQUIRY_LOCATIONS],
    progressKey: ACTION_TYPES.FETCH_ENQUIRY_LOCATIONS,
    params: { ...(locationId && { locationId }) }
  }
});

export const fetchLocationsBySeatApi = ({ seatId } = {}) => ({
  url: API_URL.CORPORATE.ENQUIRY.FETCH_LOCATIONS_BY_SEAT,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_LOCATIONS_BY_SEAT],
    progressKey: ACTION_TYPES.FETCH_LOCATIONS_BY_SEAT,
    params: { ...(seatId && { seatId }) }
  }
});

export const submitEnquiryLocationApi = ({ enquiryId, ...data }) => ({
  url: API_URL.CORPORATE.ENQUIRY.SUBMIT_ENQUIRY_LOCATION.replace(':enquiryId', enquiryId),
  method: REQUEST_METHOD.POST,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.SUBMIT_ENQUIRY_LOCATION],
    progressKey: ACTION_TYPES.SUBMIT_ENQUIRY_LOCATION,
    data
  }
});

export const linkCorporateCustomerApi = ({ enquiryId, ...data }) => ({
  url: API_URL.CORPORATE.ENQUIRY.LINK_CUSTOMER.replace(':enquiryId', enquiryId),
  method: REQUEST_METHOD.PUT,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.LINK_CORPORATE_CUSTOMER],
    progressKey: ACTION_TYPES.LINK_CORPORATE_CUSTOMER,
    data
  }
});

export const delinkCorporateCustomerApi = ({ enquiryId }) => ({
  url: API_URL.CORPORATE.ENQUIRY.DELINK_CUSTOMER.replace(':enquiryId', enquiryId),
  method: REQUEST_METHOD.DELETE,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.DELINK_CORPORATE_CUSTOMER],
    progressKey: ACTION_TYPES.DELINK_CORPORATE_CUSTOMER
  }
});

export const fetchPackageTypesListApi = ({ serviceCategoryId } = {}) => ({
  url: API_URL.PLAN_PACKAGE.FETCH_PACKAGE_TYPE.replace(':id', serviceCategoryId),
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_PACKAGE_TYPES_LIST],
    progressKey: ACTION_TYPES.FETCH_PACKAGE_TYPES_LIST
  }
});

export const fetchPackagesListApi = (params) => ({
  url: API_URL.PLAN_PACKAGE.FETCH_CORPORATE_PACKAGE_LIST,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_PACKAGES_LIST],
    progressKey: ACTION_TYPES.FETCH_PACKAGES_LIST,
    params: { size: 10, ...params }
  }
});

export const fetchAdditionalServicesListApi = ({ serviceId, ...params } = {}) => ({
  url: API_URL.PLAN_PACKAGE.FETCH_CORPORATE_SERVICE_WISE_PACKAGES,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_ADDITIONAL_SERVICES_LIST],
    progressKey: ACTION_TYPES.FETCH_ADDITIONAL_SERVICES_LIST,
    params: { ...params, serviceId }
  }
});

export const fetchEnquiryLocationDetailsApi = ({ enquiryId, locationId }) => ({
  url: API_URL.CORPORATE.ENQUIRY.FETCH_ENQUIRY_LOCATION_DETAILS.replace(':enquiryId', enquiryId).replace(
    ':locationId',
    locationId
  ),
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_ENQUIRY_LOCATION_DETAILS],
    progressKey: ACTION_TYPES.FETCH_ENQUIRY_LOCATION_DETAILS
  }
});

export const fetchKycDocumentApi = ({ cusId, docType }) => ({
  url: API_URL.CORPORATE.KYC.FETCH_KYC_DOCUMENT.replace(':cusId', cusId).replace(':docType', docType),
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_KYC_DOCUMENT],
    progressKey: ACTION_TYPES.FETCH_KYC_DOCUMENT
  }
});

export const deleteKycDocumentApi = ({ cusId, docType }) => ({
  url: API_URL.CORPORATE.KYC.FETCH_KYC_DOCUMENT.replace(':cusId', cusId).replace(':docType', docType),
  method: REQUEST_METHOD.DELETE,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.DELETE_KYC_DOCUMENT],
    progressKey: ACTION_TYPES.DELETE_KYC_DOCUMENT
  }
});

export const fetchReturnToInfoApi = ({ enquiryId, locationId } = {}) => ({
  url: API_URL.CORPORATE.ENQUIRY.FETCH_RETURN_TO_INFO,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_RETURN_TO_INFO],
    progressKey: ACTION_TYPES.FETCH_RETURN_TO_INFO,
    params: locationId ? { locationId } : { enquiryId }
  }
});

export const returnToEnquiryApi = ({ enquiryId, locationId, remarks }) => ({
  url: API_URL.CORPORATE.ENQUIRY.RETURN_TO_ENQUIRY,
  method: REQUEST_METHOD.POST,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.RETURN_TO_ENQUIRY],
    progressKey: ACTION_TYPES.RETURN_TO_ENQUIRY,
    params: locationId ? { locationId } : { enquiryId },
    data: { remarks }
  }
});

export const fetchEnquiryDispositionListApi = ({ enquiryId, dispositionCode }) => ({
  url: API_URL.CORPORATE.ENQUIRY.FETCH_ENQUIRY_DISPOSITION_LIST.replace(':enquiryId', enquiryId),
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_ENQUIRY_DISPOSITION_LIST],
    progressKey: ACTION_TYPES.FETCH_ENQUIRY_DISPOSITION_LIST,
    ...(dispositionCode ? { params: { dispositionCode } } : {})
  }
});

export const updateEnquiryLocationApi = ({ enquiryId, locationId, ...data }) => ({
  url: API_URL.CORPORATE.ENQUIRY.UPDATE_ENQUIRY_LOCATION.replace(':enquiryId', enquiryId).replace(
    ':locationId',
    locationId
  ),
  method: REQUEST_METHOD.PUT,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.UPDATE_ENQUIRY_LOCATION],
    progressKey: ACTION_TYPES.UPDATE_ENQUIRY_LOCATION,
    data
  }
});

export const fetchEnquiryLocationsSummaryApi = ({ enquiryId, locationIds } = {}) => ({
  url: API_URL.CORPORATE.ENQUIRY.FETCH_ENQUIRY_LOCATIONS_SUMMARY.replace(':enquiryId', enquiryId),
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_ENQUIRY_LOCATIONS_SUMMARY],
    progressKey: ACTION_TYPES.FETCH_ENQUIRY_LOCATIONS_SUMMARY,
    params: { ...(locationIds?.length && { locationIds: locationIds.join(',') }) }
  }
});

export const fetchEnquiryProposalsApi = ({ enquiryId, locationIds } = {}) => ({
  url: API_URL.CORPORATE.ENQUIRY.FETCH_ENQUIRY_PROPOSALS,
  method: REQUEST_METHOD.POST,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_ENQUIRY_PROPOSALS],
    progressKey: ACTION_TYPES.FETCH_ENQUIRY_PROPOSALS,
    params: { enquiryId },
    data: { locationIds: locationIds || [] }
  }
});


export const saveEnquiryProposalApi = ({ enquiryId, ...data }) => ({
  url: API_URL.CORPORATE.ENQUIRY.SAVE_ENQUIRY_PROPOSAL.replace(':enquiryId', enquiryId),
  method: REQUEST_METHOD.POST,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.SAVE_ENQUIRY_PROPOSAL],
    progressKey: ACTION_TYPES.SAVE_ENQUIRY_PROPOSAL,
    data
  }
});

export const createLocationProposalApi = ({ enquiryId, ...data }) => ({
  url: API_URL.CORPORATE.ENQUIRY.UPDATE_LOCATION_PROPOSAL.replace(':enquiryId', enquiryId),
  method: REQUEST_METHOD.POST,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.CREATE_LOCATION_PROPOSAL],
    progressKey: ACTION_TYPES.CREATE_LOCATION_PROPOSAL,
    data
  }
});

export const updateLocationProposalApi = ({ enquiryId, ...data }) => ({
  url: API_URL.CORPORATE.ENQUIRY.UPDATE_LOCATION_PROPOSAL.replace(':enquiryId', enquiryId),
  method: REQUEST_METHOD.PUT,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.UPDATE_LOCATION_PROPOSAL],
    progressKey: ACTION_TYPES.UPDATE_LOCATION_PROPOSAL,
    data
  }
});

export const bulkUpdateProposalsApi = ({ enquiryId, proposals }) => ({
  url: API_URL.CORPORATE.ENQUIRY.BULK_UPDATE_PROPOSALS.replace(':enquiryId', enquiryId),
  method: REQUEST_METHOD.PUT,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.BULK_UPDATE_PROPOSALS],
    progressKey: ACTION_TYPES.BULK_UPDATE_PROPOSALS,
    data: proposals
  }
});

export const createCorporateProposalSendApi = ({ enquiryId, version, ...data }) => ({
  url: API_URL.CORPORATE.ENQUIRY.PROPOSAL_SEND_VERSION.replace(':enquiryId', enquiryId).replace(
    ':version',
    version ?? 1
  ),
  method: REQUEST_METHOD.POST,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.CREATE_CORPORATE_PROPOSAL_SEND],
    progressKey: ACTION_TYPES.CREATE_CORPORATE_PROPOSAL_SEND,
    data
  }
});

export const sendCorporateProposalApi = ({ enquiryId, version, ...data }) => ({
  url: API_URL.CORPORATE.ENQUIRY.PROPOSAL_SEND_VERSION.replace(':enquiryId', enquiryId).replace(':version', version),
  method: REQUEST_METHOD.PUT,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.SEND_CORPORATE_PROPOSAL],
    progressKey: ACTION_TYPES.SEND_CORPORATE_PROPOSAL,
    data
  }
});

export const fetchCorporateProposalSendApi = ({ enquiryId, version }) => ({
  url: version
    ? API_URL.CORPORATE.ENQUIRY.PROPOSAL_SEND_VERSION.replace(':enquiryId', enquiryId).replace(':version', version)
    : API_URL.CORPORATE.ENQUIRY.PROPOSAL_SEND.replace(':enquiryId', enquiryId),
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_CORPORATE_PROPOSAL_SEND],
    progressKey: ACTION_TYPES.FETCH_CORPORATE_PROPOSAL_SEND
  }
});

export const updateProposalStatusApi = ({ enquiryId, version, status, revisedProposalStatus = false }) => ({
  url: API_URL.CORPORATE.ENQUIRY.PROPOSAL_STATUS.replace(':enquiryId', enquiryId).replace(':version', version),
  method: REQUEST_METHOD.PATCH,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.UPDATE_PROPOSAL_STATUS],
    progressKey: ACTION_TYPES.UPDATE_PROPOSAL_STATUS,
    data: { status, revisedProposalStatus }
  }
});

export const fetchProposalSendPreviewApi = ({ enquiryId, version }) => ({
  url: API_URL.CORPORATE.ENQUIRY.PROPOSAL_SEND_PREVIEW.replace(':enquiryId', enquiryId),
  method: REQUEST_METHOD.POST,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_PROPOSAL_SEND_PREVIEW],
    progressKey: ACTION_TYPES.FETCH_PROPOSAL_SEND_PREVIEW,
    ...(version && { params: { version } })
  }
});

export const fetchProposalDispatchApi = ({ enquiryId }) => ({
  url: API_URL.CORPORATE.ENQUIRY.FETCH_PROPOSAL_DISPATCH.replace(':enquiryId', enquiryId),
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_PROPOSAL_DISPATCH],
    progressKey: ACTION_TYPES.FETCH_PROPOSAL_DISPATCH
  }
});

export const sendEmailProposalDispatchApi = ({ enquiryId, version, ...data }) => ({
  url: API_URL.CORPORATE.ENQUIRY.SEND_EMAIL_PROPOSAL_DISPATCH.replace(':enquiryId', enquiryId).replace(
    ':version',
    version
  ),
  method: REQUEST_METHOD.POST,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.SEND_EMAIL_PROPOSAL_DISPATCH],
    progressKey: ACTION_TYPES.SEND_EMAIL_PROPOSAL_DISPATCH,
    data
  }
});

export const sendDirectProposalDispatchApi = ({ enquiryId, version, ...data }) => ({
  url: API_URL.CORPORATE.ENQUIRY.SEND_DIRECT_PROPOSAL_DISPATCH.replace(':enquiryId', enquiryId).replace(
    ':version',
    version
  ),
  method: REQUEST_METHOD.POST,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.SEND_DIRECT_PROPOSAL_DISPATCH],
    progressKey: ACTION_TYPES.SEND_DIRECT_PROPOSAL_DISPATCH,
    data
  }
});

export const downloadCorporatePurchaseOrderListCsvApi = () => ({
  url: API_URL.CORPORATE.PROPOSALS.CREATE_PO.replace('save', 'download-csv'),
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.DOWNLOAD_CORPORATE_PURCHASE_ORDER_LIST_CSV],
    progressKey: ACTION_TYPES.DOWNLOAD_CORPORATE_PURCHASE_ORDER_LIST_CSV,
    isDocument: true,
    documentType: FILE_RESPONSE_TYPE.BLOB,
    fileName: 'corporate_purchase_orders.csv'
  }
});

export const fetchEnquirySummaryWithProposalsApi = (params) => ({
  url: API_URL.CORPORATE.PROPOSALS.FETCH_ENQUIRY_SUMMARY_WITH_PROPOSALS,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_ENQUIRY_SUMMARY_WITH_PROPOSALS],
    progressKey: ACTION_TYPES.FETCH_ENQUIRY_SUMMARY_WITH_PROPOSALS,
    params
  }
});

export const fetchProposalsByEnquiryApi = ({ enquiryId, ...params }) => ({
  url: API_URL.CORPORATE.PROPOSALS.FETCH_PROPOSALS_BY_ENQUIRY.replace(':enquiryId', enquiryId),
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_PROPOSALS_BY_ENQUIRY],
    progressKey: ACTION_TYPES.FETCH_PROPOSALS_BY_ENQUIRY,
    params
  }
});

export const fetchServiceCommissioningByEnquiryApi = ({ enquiryId, ...params }) => ({
  url: API_URL.CORPORATE.PROPOSALS.FETCH_SERVICE_COMMISSIONING_BY_ENQUIRY.replace(':enquiryId', enquiryId),
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_SERVICE_COMMISSIONING_BY_ENQUIRY],
    progressKey: ACTION_TYPES.FETCH_SERVICE_COMMISSIONING_BY_ENQUIRY,
    params
  }
});

export const fetchEnquirySummaryWithCircuitProvisioningApi = (params) => ({
  url: API_URL.CORPORATE.PROPOSALS.FETCH_ENQUIRY_SUMMARY_WITH_CIRCUIT_PROVISIONING,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_ENQUIRY_SUMMARY_WITH_CIRCUIT_PROVISIONING],
    progressKey: ACTION_TYPES.FETCH_ENQUIRY_SUMMARY_WITH_CIRCUIT_PROVISIONING,
    params
  }
});

export const fetchEnquirySummaryWithPoApi = (params) => ({
  url: API_URL.CORPORATE.PROPOSALS.FETCH_ENQUIRY_SUMMARY_WITH_PO,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_ENQUIRY_SUMMARY_WITH_PO],
    progressKey: ACTION_TYPES.FETCH_ENQUIRY_SUMMARY_WITH_PO,
    params
  }
});

export const fetchPoByEnquiryApi = ({ enquiryId, ...params }) => ({
  url: API_URL.CORPORATE.PROPOSALS.FETCH_PO_BY_ENQUIRY.replace(':enquiryId', enquiryId),
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_PO_BY_ENQUIRY],
    progressKey: ACTION_TYPES.FETCH_PO_BY_ENQUIRY,
    params
  }
});

export const fetchNextStepUsersApi = ({ enquiryId } = {}) => ({
  url: API_URL.CORPORATE.FORWARD.FETCH_NEXT_STEP_USERS.replace(':enquiryId', enquiryId),
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_NEXT_STEP_USERS],
    progressKey: ACTION_TYPES.FETCH_NEXT_STEP_USERS
  }
});

export const forwardNextStepApi = ({ enquiryId, ...data }) => ({
  url: API_URL.CORPORATE.FORWARD.FORWARD_NEXT_STEP.replace(':enquiryId', enquiryId),
  method: REQUEST_METHOD.POST,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FORWARD_NEXT_STEP],
    progressKey: ACTION_TYPES.FORWARD_NEXT_STEP,
    data
  }
});
