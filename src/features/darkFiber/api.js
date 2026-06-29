import { REQUEST_METHOD } from '@/constants/api';
import { FILE_RESPONSE_TYPE } from '@/constants/file';
import { API_URL } from '@/constants/urls';

import { ACTION_TYPES, API_ACTION_TYPE_VARIANTS } from './action';

export const fetchEnquiryListApi = (data = {}) => ({
  url: API_URL.DARK_FIBER.ENQUIRY_LIST,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_ENQUIRY_LIST],
    params: data,
    progressKey: ACTION_TYPES.FETCH_ENQUIRY_LIST
  }
});

export const assignEnquiryApi = (data) => ({
  url: API_URL.DARK_FIBER.ASSIGN,
  method: REQUEST_METHOD.POST,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.ASSIGN_ENQUIRY],
    data,
    progressKey: ACTION_TYPES.ASSIGN_ENQUIRY
  }
});

export const createDarkFiberDetailsApi = (data) => ({
  url: API_URL.DARK_FIBER.DETAILS,
  method: REQUEST_METHOD.POST,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.CREATE_DARK_FIBER_DETAILS],
    data,
    isUpload: true,
    progressKey: ACTION_TYPES.CREATE_DARK_FIBER_DETAILS
  }
});

export const fetchAssignToUsersApi = (data = {}) => ({
  url: API_URL.DARK_FIBER.USERS_DROPDOWN,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_ASSIGN_TO_USERS],
    params: data,
    progressKey: ACTION_TYPES.FETCH_ASSIGN_TO_USERS
  }
});

export const fetchPopListApi = (data = {}) => ({
  url: API_URL.DARK_FIBER.POP_DROPDOWN,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_POP_LIST],
    params: data,
    progressKey: ACTION_TYPES.FETCH_POP_LIST
  }
});

export const createDarkFiberProposalApi = (data) => ({
  url: API_URL.DARK_FIBER.CREATE_PROPOSAL,
  method: REQUEST_METHOD.POST,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.CREATE_DARK_FIBER_PROPOSAL],
    data,
    progressKey: ACTION_TYPES.CREATE_DARK_FIBER_PROPOSAL
  }
});

export const fetchProposalListApi = (data = {}) => ({
  url: API_URL.DARK_FIBER.PROPOSAL_LIST,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_PROPOSAL_LIST],
    params: data,
    progressKey: ACTION_TYPES.FETCH_PROPOSAL_LIST
  }
});

export const fetchDarkFiberEnquiryDetailsApi = (id) => ({
  url: API_URL.ENQUIRY.DETAILS.replace(':enquiryId', id),
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_DARK_FIBER_ENQUIRY_DETAILS],
    progressKey: ACTION_TYPES.FETCH_DARK_FIBER_ENQUIRY_DETAILS
  }
});
export const uploadCompanyProfileApi = (data) => ({
  url: API_URL.DARK_FIBER.KYC_UPLOAD,
  method: REQUEST_METHOD.POST,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.UPLOAD_COMPANY_PROFILE],
    data,
    isUpload: true,
    progressKey: ACTION_TYPES.UPLOAD_COMPANY_PROFILE
  }
});

export const downloadEnquiryListCsvApi = (data = {}) => ({
  url: API_URL.DARK_FIBER.DOWNLOAD_CSV,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.DOWNLOAD_ENQUIRY_LIST_CSV],
    params: data,
    isDocument: true,
    documentType: FILE_RESPONSE_TYPE.BLOB,
    fileName: 'dark_fiber_enquiry_list.csv',
    progressKey: ACTION_TYPES.DOWNLOAD_ENQUIRY_LIST_CSV
  }
});
