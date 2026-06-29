import { REQUEST_METHOD } from '@/constants/api';
import { FILE_RESPONSE_TYPE } from '@/constants/file';
import { API_URL } from '@/constants/urls';

import { ACTION_TYPES, API_ACTION_TYPE_VARIANTS } from './action';

export const fetchRoleMenuApi = () => ({
  url: API_URL.USER_ROLE.ROLE_CREATION_MENU_FETCH,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.ROLE_CREATION_MENU_FETCH],
    progressKey: ACTION_TYPES.ROLE_CREATION_MENU_FETCH
  }
});

export const fetchAllRoleApi = () => ({
  url: API_URL.USER_ROLE.FETCH_ALL_ROLE,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_ALL_ROLE],
    progressKey: ACTION_TYPES.FETCH_ALL_ROLE
  }
});

export const fetchBusinessUnitApi = (data = {}) => ({
  url: API_URL.USER_ROLE.FETCH_BUISINESS_UNIT.replace(':id', data?.id),
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_BUISINESS_UNIT],
    progressKey: ACTION_TYPES.FETCH_BUISINESS_UNIT
  }
});

export const createUserApi = (data = {}) => ({
  url: API_URL.USER_ROLE.CREATE_USER_SUBMIT,
  method: REQUEST_METHOD.POST,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.CREATE_USER_SUBMIT],
    data,
    progressKey: ACTION_TYPES.CREATE_USER_SUBMIT
  }
});

export const updateUserApi = (data = {}) => {
  const { id, ...rest } = data;
  return {
    url: `${API_URL.USER_ROLE.CREATE_USER_UPDATE}/${id}`,
    method: REQUEST_METHOD.PUT,
    payload: {
      types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.UPDATE_USER_SUBMIT],
      data: rest,
      progressKey: ACTION_TYPES.UPDATE_USER_SUBMIT
    }
  };
};

export const fetchUserListApi = (params = {}) => ({
  url: API_URL.USER_ROLE.USER_PAGINATION_FETCH_ALL,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.USER_LIST_FETCH],
    params,
    progressKey: ACTION_TYPES.USER_LIST_FETCH
  }
});

export const rolePermissionSubmitApi = (data = {}) => ({
  url: API_URL.USER_ROLE.ROLE_PERMISSION_SUBMIT,
  method: REQUEST_METHOD.POST,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.ROLE_PERMISSION_SUBMIT],
    data,
    progressKey: ACTION_TYPES.ROLE_PERMISSION_SUBMIT
  }
});

export const fetchUserRoleListApi = (params = {}) => ({
  url: API_URL.USER_ROLE.FETCH_ROLE_LIST,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_USER_ROLE_LIST],
    params,
    progressKey: ACTION_TYPES.FETCH_USER_ROLE_LIST
  }
});

export const fetchEditUserPermissionApi = (params = {}) => {
  return {
    url: API_URL.USER_ROLE.FETCH_EDIT_USER_PERMISSION.replace(':id', params),
    method: REQUEST_METHOD.GET,
    payload: {
      types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_EDIT_USER_PERMISSION],
      params,
      progressKey: ACTION_TYPES.FETCH_EDIT_USER_PERMISSION
    }
  };
};

export const downloadUserListCsvApi = () => ({
  url: API_URL.USER_ROLE.DOWNLOAD_USER_LIST_CSV,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.DOWNLOAD_USER_LIST_CSV],
    progressKey: ACTION_TYPES.DOWNLOAD_USER_LIST_CSV,
    isDocument: true,
    documentType: FILE_RESPONSE_TYPE.BLOB,
    fileName: 'user_list.csv'
  }
});

export const updateRolePermissionApi = (data = {}) => {
  const { id, ...rest } = data;
  return {
    url: API_URL.USER_ROLE.UPDATE_ROLE_PERMISSION.replace(':id', id),
    method: REQUEST_METHOD.PUT,
    payload: {
      types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.UPDATE_ROLE_PERMISSION],
      data: rest,
      progressKey: ACTION_TYPES.UPDATE_ROLE_PERMISSION
    }
  };
};

export const userMappingSubmitApi = (data = {}) => ({
  url: API_URL.USER_ROLE.USER_MAPPING_SUBMIT,
  method: REQUEST_METHOD.POST,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.USER_MAPPING_SUBMIT],
    data,
    progressKey: ACTION_TYPES.USER_MAPPING_SUBMIT
  }
});

export const createSeatSubmitApi = (data = {}) => ({
  url: API_URL.USER_ROLE.CREATE_SEAT_SUBMIT,
  method: REQUEST_METHOD.POST,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.CREATE_SEAT_SUBMIT],
    data,
    progressKey: ACTION_TYPES.CREATE_SEAT_SUBMIT
  }
});

export const updateSeatSubmitApi = (data = {}) => {
  const { id, ...rest } = data;
  return {
    url: API_URL.USER_ROLE.UPDATE_SEAT_SUBMIT.replace(':id', id),
    method: REQUEST_METHOD.PUT,
    payload: {
      types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.UPDATE_SEAT_SUBMIT],
      data: rest,
      progressKey: ACTION_TYPES.UPDATE_SEAT_SUBMIT
    }
  };
};

export const fetchOrganizationApi = () => ({
  url: API_URL.USER_ROLE.FETCH_ORGANIZATION,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_ORGANIZATION],
    progressKey: ACTION_TYPES.FETCH_ORGANIZATION
  }
});

export const fetchSeatListApi = (params = {}) => ({
  url: API_URL.USER_ROLE.FETCH_SEAT_LIST,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_SEAT_LIST],
    params,
    progressKey: ACTION_TYPES.FETCH_SEAT_LIST
  }
});

export const fetchRoleByUserApi = (params = {}) => ({
  url: API_URL.USER_ROLE.FETCH_ROLE_BY_USER,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_ROLE_BY_USER],
    params,
    progressKey: ACTION_TYPES.FETCH_ROLE_BY_USER
  }
});

export const linkUserApi = (data = {}) => ({
  url: API_URL.USER_ROLE.LINK_USER,
  method: REQUEST_METHOD.POST,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.LINK_USER],
    data,
    progressKey: ACTION_TYPES.LINK_USER
  }
});

export const fetchUnmappedUserApi = () => ({
  url: API_URL.USER_ROLE.FETCH_UNMAPPED_USER,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_UNMAPPED_USER],
    progressKey: ACTION_TYPES.FETCH_UNMAPPED_USER
  }
});

export const fetchZoneApi = () => ({
  url: API_URL.USER_ROLE.FETCH_ZONE,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_ZONE],
    progressKey: ACTION_TYPES.FETCH_ZONE
  }
});

export const fetchSeatPermissionApi = (data = {}) => ({
  url: API_URL.USER_ROLE.FETCH_SEAT_PERMISSION.replace(':seatId', data?.seatId),
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_SEAT_PERMISSION],
    progressKey: ACTION_TYPES.FETCH_SEAT_PERMISSION
  }
});

export const updateUserMappingApi = (data = {}) => ({
  url: API_URL.USER_ROLE.UPDATE_USER_MAPPING,
  method: REQUEST_METHOD.PUT,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.UPDATE_USER_MAPPING],
    data,
    progressKey: ACTION_TYPES.UPDATE_USER_MAPPING
  }
});

export const fetchPincodeByDistrictIdsApi = (data = {}) => {
  return {
    url: API_URL.USER_ROLE.FETCH_PINCODE_BY_DISTRICT_IDS,
    method: REQUEST_METHOD.POST,
    guestAccess: true,
    payload: {
      types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_PINCODE_BY_DISTRICT_IDS],
      data: data,
      progressKey: ACTION_TYPES.FETCH_PINCODE_BY_DISTRICT_IDS
    }
  };
};

export const submitPincodeMappingApi = (data = {}) => ({
  url: API_URL.USER_ROLE.SUBMIT_PINCODE_MAPPING.replace(':seatId', data?.seatId),
  method: REQUEST_METHOD.POST,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.SUBMIT_PINCODE_MAPPING],
    data: data?.pincode,
    progressKey: ACTION_TYPES.SUBMIT_PINCODE_MAPPING
  }
});

export const delinkUserApi = (data = {}) => ({
  url: API_URL.USER_ROLE.DELINK_USER.replace(':seatUserId', data),
  method: REQUEST_METHOD.PUT,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.DELINK_USER],
    progressKey: ACTION_TYPES.DELINK_USER
  }
});

export const submitTemplateApi = (data = {}) => ({
  url: API_URL.USER_ROLE.SUBMIT_TEMPLATE,
  method: REQUEST_METHOD.POST,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.SUBMIT_TEMPLATE],
    data: data,
    progressKey: ACTION_TYPES.SUBMIT_TEMPLATE
  }
});

export const fetchTemplateListApi = (params = {}) => ({
  url: API_URL.USER_ROLE.FETCH_TEMPLATE_LIST,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_TEMPLATE_LIST],
    params,
    progressKey: ACTION_TYPES.FETCH_TEMPLATE_LIST
  }
});

export const editTemplateApi = (data = {}) => {
  const { id, ...rest } = data;
  return {
    url: API_URL.USER_ROLE.EDIT_TEMPLATE.replace(':id', id),
    method: REQUEST_METHOD.PUT,
    payload: {
      types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.EDIT_TEMPLATE],
      data: rest,
      progressKey: ACTION_TYPES.EDIT_TEMPLATE
    }
  };
};

export const fetchDesignationApi = () => ({
  url: API_URL.USER_ROLE.FETCH_DESIGNATION,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_DESIGNATION],
    progressKey: ACTION_TYPES.FETCH_DESIGNATION
  }
});

export const fetchMappedDistApi = (data = {}) => {
  return {
    url: API_URL.USER_ROLE.FETCH_MAPPED_DIST.replace(':seatId', data?.seatId),
    method: REQUEST_METHOD.GET,
    payload: {
      types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_MAPPED_DIST],
      progressKey: ACTION_TYPES.FETCH_MAPPED_DIST
    }
  };
};

export const updatePincodeMappingApi = (data = {}) => ({
  url: API_URL.USER_ROLE.UPDATE_PINCODE_MAPPING.replace(':seatId', data?.seatId),
  method: REQUEST_METHOD.PUT,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.UPDATE_PINCODE_MAPPING],
    data: data?.pincode,
    progressKey: ACTION_TYPES.UPDATE_PINCODE_MAPPING
  }
});

export const downloadSeatListCsvApi = () => ({
  url: API_URL.USER_ROLE.DOWNLOAD_SEAT_LIST_CSV,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.DOWNLOAD_SEAT_LIST_CSV],
    progressKey: ACTION_TYPES.DOWNLOAD_SEAT_LIST_CSV,
    isDocument: true,
    documentType: FILE_RESPONSE_TYPE.BLOB,
    fileName: 'seat_list.csv'
  }
});

export const downloadRoleListCsvApi = () => ({
  url: API_URL.USER_ROLE.DOWNLOAD_ROLE_LIST_CSV,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.DOWNLOAD_ROLE_LIST_CSV],
    progressKey: ACTION_TYPES.DOWNLOAD_ROLE_LIST_CSV,
    isDocument: true,
    documentType: FILE_RESPONSE_TYPE.BLOB,
    fileName: 'roles.csv'
  }
});

export const fetchDesignationListApi = (params = {}) => ({
  url: API_URL.USER_ROLE.FETCH_DESIGNATION_LIST,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_DESIGNATION_LIST],
    params,
    progressKey: ACTION_TYPES.FETCH_DESIGNATION_LIST
  }
});

export const createDesignationSubmitApi = (data = {}) => ({
  url: API_URL.USER_ROLE.CREATE_DESIGNATION_SUBMIT,
  method: REQUEST_METHOD.POST,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.CREATE_DESIGNATION_SUBMIT],
    data,
    progressKey: ACTION_TYPES.CREATE_DESIGNATION_SUBMIT
  }
});

export const updateDesignationSubmitApi = (data = {}) => {
  const { id, ...rest } = data;
  return {
    url: API_URL.USER_ROLE.UPDATE_DESIGNATION_SUBMIT.replace(':id', id),
    method: REQUEST_METHOD.PUT,
    payload: {
      types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.UPDATE_DESIGNATION_SUBMIT],
      data: rest,
      progressKey: ACTION_TYPES.UPDATE_DESIGNATION_SUBMIT
    }
  };
};

export const updateRoleStatusApi = ({ id, active } = {}) => ({
  url: `${API_URL.USER_ROLE.UPDATE_ROLE_STATUS.replace(':id', id)}?active=${active}`,
  method: REQUEST_METHOD.PATCH,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.UPDATE_ROLE_STATUS],
    progressKey: ACTION_TYPES.UPDATE_ROLE_STATUS
  }
});

export const fetchWorkflowTypesApi = () => ({
  url: API_URL.USER_ROLE.FETCH_WORKFLOW_TYPES,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_WORKFLOW_TYPES],
    progressKey: ACTION_TYPES.FETCH_WORKFLOW_TYPES
  }
});

export const fetchWorkflowSubtypesApi = (data = {}) => ({
  url: API_URL.USER_ROLE.FETCH_WORKFLOW_SUBTYPES,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_WORKFLOW_SUBTYPES],
    params: { moduleId: data?.moduleId },
    progressKey: ACTION_TYPES.FETCH_WORKFLOW_SUBTYPES
  }
});

export const fetchSeatsByRolesApi = (data = {}) => ({
  url: API_URL.USER_ROLE.FETCH_SEAT_BY_ROLES,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_SEAT_BY_ROLES],
    params: { roleIds: data?.roleIds },
    progressKey: ACTION_TYPES.FETCH_SEAT_BY_ROLES
  }
});

export const saveStageConfigApi = (data = {}) => ({
  url: API_URL.USER_ROLE.SAVE_STAGE_CONFIG,
  method: REQUEST_METHOD.POST,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.SAVE_STAGE_CONFIG],
    data,
    progressKey: ACTION_TYPES.SAVE_STAGE_CONFIG
  }
});

export const fetchStageConfigApi = (data = {}) => ({
  url: API_URL.USER_ROLE.FETCH_STAGE_CONFIG.replace(':id', data?.id),
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_STAGE_CONFIG],
    progressKey: ACTION_TYPES.FETCH_STAGE_CONFIG
  }
});

export const updateStageConfigApi = (data = {}) => {
  const { id, ...rest } = data;
  return {
    url: API_URL.USER_ROLE.UPDATE_STAGE_CONFIG.replace(':id', id),
    method: REQUEST_METHOD.PUT,
    payload: {
      types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.UPDATE_STAGE_CONFIG],
      data: rest,
      progressKey: ACTION_TYPES.UPDATE_STAGE_CONFIG
    }
  };
};

export const deleteStageConfigApi = (data = {}) => ({
  url: API_URL.USER_ROLE.DELETE_STAGE_CONFIG.replace(':id', data?.id),
  method: REQUEST_METHOD.DELETE,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.DELETE_STAGE_CONFIG],
    progressKey: ACTION_TYPES.DELETE_STAGE_CONFIG
  }
});

export const createDivisionSubmitApi = (data = {}) => ({
  url: API_URL.USER_ROLE.CREATE_DIVISION_SUBMIT,
  method: REQUEST_METHOD.POST,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.CREATE_DIVISION_SUBMIT],
    data,
    progressKey: ACTION_TYPES.CREATE_DIVISION_SUBMIT
  }
});

export const fetchDivisionListApi = (params = {}) => ({
  url: API_URL.USER_ROLE.FETCH_DIVISION_LIST,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_DIVISION_LIST],
    params,
    progressKey: ACTION_TYPES.FETCH_DIVISION_LIST
  }
});

export const updateDivisionSubmitApi = (data = {}) => {
  const { id, ...rest } = data;
  return {
    url: API_URL.USER_ROLE.UPDATE_DIVISION_SUBMIT.replace(':id', id),
    method: REQUEST_METHOD.PUT,
    payload: {
      types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.UPDATE_DIVISION_SUBMIT],
      data: rest,
      progressKey: ACTION_TYPES.UPDATE_DIVISION_SUBMIT
    }
  };
};

export const fetchFeLnpFeUsersApi = (data = {}) => ({
  url: API_URL.USER_ROLE.FETCH_FE_LNP_FE_USERS,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_FE_LNP_FE_USERS],
    params: { districtId: data?.districtId, roleName: data?.roleName },
    progressKey: ACTION_TYPES.FETCH_FE_LNP_FE_USERS
  }
});

export const fetchFeLnpLnpUsersApi = (data = {}) => ({
  url: API_URL.USER_ROLE.FETCH_FE_LNP_LNP_USERS,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_FE_LNP_LNP_USERS],
    params: {
      districtId: data?.districtId,
      feUserId: data?.feUserId,
      status: data?.status ?? 'ALL',
      search: data?.search ?? '',
      page: data?.page ?? 0,
      size: data?.size ?? 500
    },
    progressKey: ACTION_TYPES.FETCH_FE_LNP_LNP_USERS
  }
});

export const attachFeLnpApi = (data = {}) => ({
  url: API_URL.USER_ROLE.ATTACH_FE_LNP,
  method: REQUEST_METHOD.POST,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.ATTACH_FE_LNP],
    data: { feUserId: data?.feUserId, lnpUserIds: data?.lnpUserIds },
    progressKey: ACTION_TYPES.ATTACH_FE_LNP
  }
});

export const detachFeLnpApi = (data = {}) => ({
  url: API_URL.USER_ROLE.DETACH_FE_LNP,
  method: REQUEST_METHOD.PATCH,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.DETACH_FE_LNP],
    data: { feUserId: data?.feUserId, lnpUserIds: data?.lnpUserIds },
    progressKey: ACTION_TYPES.DETACH_FE_LNP
  }
});

export const fetchDivisionByOrganizationApi = (data = {}) => ({
  url: API_URL.USER_ROLE.FETCH_DIVISION_BY_ORGANIZATION,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_DIVISION_BY_ORGANIZATION],
    params: { organizationId: data?.id },
    progressKey: ACTION_TYPES.FETCH_DIVISION_BY_ORGANIZATION
  }
});
