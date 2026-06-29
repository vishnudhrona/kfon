import { REQUEST_METHOD } from '@/constants/api';
import { FILE_RESPONSE_TYPE } from '@/constants/file';
import { API_URL } from '@/constants/urls';
import { createCommonFetchApi } from '@/utils/apiUtils';

import { ACTION_TYPES, API_ACTION_TYPE_VARIANTS } from './action';

const commonFetchApi = createCommonFetchApi(API_ACTION_TYPE_VARIANTS);

export const submitPlanPackage = (data = {}) => ({
  url: API_URL.PLAN_PACKAGE.SUBMIT_PLAN_PACKAGE,
  method: REQUEST_METHOD.POST,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.SUBMIT_PLAN_PACKAGE],
    data,
    progressKey: ACTION_TYPES.SUBMIT_PLAN_PACKAGE
  }
});

export const updatePlanPackage = ({ id, ...data } = {}) => ({
  url: API_URL.PLAN_PACKAGE.UPDATE_PLAN_PACKAGE.replace(':id', id),
  method: REQUEST_METHOD.PUT,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.UPDATE_PLAN_PACKAGE],
    data,
    progressKey: ACTION_TYPES.UPDATE_PLAN_PACKAGE
  }
});

export const submitPlanSubPackage = (data = {}) => ({
  url: API_URL.PLAN_PACKAGE.SUBMIT_PLAN_SUB_PACKAGE,
  method: REQUEST_METHOD.POST,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.SUBMIT_PLAN_SUB_PACKAGE],
    data,
    progressKey: ACTION_TYPES.SUBMIT_PLAN_SUB_PACKAGE
  }
});

export const updatePlanSubPackage = ({ subPackageId, details } = {}) => ({
  url: API_URL.PLAN_PACKAGE.UPDATE_PLAN_SUB_PACKAGE.replace(':subPackageId', subPackageId),
  method: REQUEST_METHOD.PUT,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.UPDATE_PLAN_SUB_PACKAGE],
    data: details,
    progressKey: ACTION_TYPES.UPDATE_PLAN_SUB_PACKAGE
  }
});

export const updatePlanStatus = ({ id, status } = {}) => ({
  url: `${API_URL.PLAN_PACKAGE.UPDATE_PLAN_STATUS.replace(':id', id)}?active=${status}`,
  method: REQUEST_METHOD.PATCH,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.UPDATE_PLAN_STATUS],
    progressKey: ACTION_TYPES.UPDATE_PLAN_STATUS
  }
});

export const fetchPackageTypes = ({ id } = {}) => {
  return {
    url: API_URL.PLAN_PACKAGE.FETCH_PACKAGE_TYPE.replace(':id', id),
    method: REQUEST_METHOD.GET,
    payload: {
      types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_MASTER_PACKAGE_TYPE],
      progressKey: ACTION_TYPES.FETCH_MASTER_PACKAGE_TYPE
    }
  };
};

export const fetchPlanTypes = () => ({
  url: API_URL.PLAN_PACKAGE.FETCH_PLAN_TYPE,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_MASTER_PLAN_TYPE],
    progressKey: ACTION_TYPES.FETCH_MASTER_PLAN_TYPE
  }
});

export const fetchCategoryTypes = (data = {}) => ({
  url: API_URL.PLAN_PACKAGE.FETCH_CATEGORY_TYPE,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_MASTER_CATEGORY_TYPE],
    progressKey: ACTION_TYPES.FETCH_MASTER_CATEGORY_TYPE,
    data
  }
});

export const fetchPackagePlanTypes = () => ({
  url: API_URL.PLAN_PACKAGE.FETCH_PACKAGE_PLAN_TYPE,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_MASTER_PACKAGE_PLAN_TYPE],
    progressKey: ACTION_TYPES.FETCH_MASTER_PACKAGE_PLAN_TYPE
  }
});

export const fetchFallbackSpeed = () => ({
  url: API_URL.PLAN_PACKAGE.FETCH_FALLBACK_SPEED,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_MASTER_FALLBACK_SPEED],
    progressKey: ACTION_TYPES.FETCH_MASTER_FALLBACK_SPEED
  }
});

export const fetchSpeedProfile = () => ({
  url: API_URL.PLAN_PACKAGE.FETCH_SPEED_PROFILE,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_MASTER_SPEED_PROFILE],
    progressKey: ACTION_TYPES.FETCH_MASTER_SPEED_PROFILE
  }
});

export const fetchSubscriberProfile = () => ({
  url: API_URL.PLAN_PACKAGE.FETCH_SUBSCRIBER_PROFILE,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_MASTER_SUBSCRIBER_PROFILE],
    progressKey: ACTION_TYPES.FETCH_MASTER_SUBSCRIBER_PROFILE
  }
});

export const fetchFupList = (data = {}) => ({
  url: API_URL.PLAN_PACKAGE.FETCH_FUP_LIST,
  method: REQUEST_METHOD.GET,
  payload: {
    data,
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_FUP_LIST],
    progressKey: ACTION_TYPES.FETCH_FUP_LIST
  }
});

export const fetchSubpackagePlanList = (data = {}) => {
  return {
    url: API_URL.PLAN_SUB_PACKAGE.FETCH_SUB_PACKAGE_LIST,
    method: REQUEST_METHOD.GET,
    payload: {
      data,
      types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_SUB_PACKAGE_LIST],
      progressKey: ACTION_TYPES.FETCH_SUB_PACKAGE_LIST
    }
  };
};

export const fetchServiceTypeList = () =>
  commonFetchApi({
    url: API_URL.PLAN_SUB_PACKAGE.FETCH_SERVICE_TYPE_LIST,
    actionType: ACTION_TYPES.FETCH_SERVICE_TYPE_LIST
  });

export const fetchRevenueShareList = () =>
  commonFetchApi({
    url: API_URL.PLAN_SUB_PACKAGE.FETCH_REVENUE_SHARE_LIST,
    actionType: ACTION_TYPES.FETCH_REVENUE_SHARE_LIST
  });

export const fetchPackageDetailsById = ({ packageId }) =>
  commonFetchApi({
    url: API_URL.PLAN_PACKAGE.FETCH_PACKAGE_DETAILS_BY_ID.replace(':id', packageId),
    actionType: ACTION_TYPES.FETCH_PACKAGE_DETAILS_BY_ID
  });

export const downloadPlanCsvApi = ({ data = {}, fileName = 'file.txt' } = {}) => ({
  url: API_URL.PLAN_PACKAGE.DOWNLOAD_PLAN_PACKAGE_CSV,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.DOWNLOAD_PLAN_PACKAGE_CSV],
    progressKey: ACTION_TYPES.DOWNLOAD_PLAN_PACKAGE_CSV,
    isDocument: true,
    documentType: FILE_RESPONSE_TYPE.BLOB,
    fileName,
    data
  }
});

export const fetchCorporateServiceType = () =>
  commonFetchApi({
    url: API_URL.PLAN_PACKAGE.FETCH_CORPORATE_SERVICE_TYPE,
    actionType: ACTION_TYPES.FETCH_CORPORATE_SERVICE_TYPE
  });

export const fetchCorporateSubServiceType = ({ serviceId }) =>
  commonFetchApi({
    url: API_URL.PLAN_PACKAGE.FETCH_CORPORATE_SUB_SERVICE_TYPE.replace(':serviceId', serviceId),
    actionType: ACTION_TYPES.FETCH_CORPORATE_SUB_SERVICE_TYPE
  });

export const submitCorporatePackage = (data = {}) => ({
  url: API_URL.PLAN_PACKAGE.SUBMIT_CORPORATE_PACKAGE,
  method: REQUEST_METHOD.POST,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.SUBMIT_CORPORATE_PACKAGE],
    data,
    progressKey: ACTION_TYPES.SUBMIT_CORPORATE_PACKAGE
  }
});

export const updateCorporatePackage = ({ id, ...data }) => ({
  url: API_URL.PLAN_PACKAGE.UPDATE_CORPORATE_PACKAGE.replace(':id', id),
  method: REQUEST_METHOD.PUT,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.UPDATE_CORPORATE_PACKAGE],
    data,
    progressKey: ACTION_TYPES.UPDATE_CORPORATE_PACKAGE
  }
});

export const fetchCorporatePackageById = ({ id } = {}) =>
  commonFetchApi({
    url: API_URL.PLAN_PACKAGE.FETCH_CORPORATE_PACKAGE_BY_ID.replace(':id', id),
    actionType: ACTION_TYPES.FETCH_CORPORATE_PACKAGE_BY_ID
  });

export const fetchCorporatePackageList = (data = {}) => ({
  url: API_URL.PLAN_PACKAGE.FETCH_CORPORATE_PACKAGE_LIST,
  method: REQUEST_METHOD.GET,
  payload: {
    data,
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_CORPORATE_PACKAGE_LIST],
    progressKey: ACTION_TYPES.FETCH_CORPORATE_PACKAGE_LIST
  }
});

export const fetchRetailPackageList = (data = {}) => ({
  url: API_URL.PLAN_PACKAGE.FETCH_ALL_PACKAGES,
  method: REQUEST_METHOD.GET,
  payload: {
    data,
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_RETAIL_PACKAGE_LIST],
    progressKey: ACTION_TYPES.FETCH_RETAIL_PACKAGE_LIST
  }
});

export const fetchRetailServiceType = () =>
  commonFetchApi({
    url: API_URL.PLAN_PACKAGE.FETCH_RETAIL_SERVICE_TYPE,
    actionType: ACTION_TYPES.FETCH_RETAIL_SERVICE_TYPE
  });

export const fetchSubserviceTypes = (data = {}) => {
  return {
    url: API_URL.PLAN_PACKAGE.FETCH_SUB_SERVICE_TYPES,
    method: REQUEST_METHOD.GET,
    payload: {
      types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_SUB_SERVICE_TYPES],
      data: data,
      progressKey: ACTION_TYPES.FETCH_SUB_SERVICE_TYPES
    }
  };
};

export const fetchPartnerType = () =>
  commonFetchApi({
    url: API_URL.PLAN_PACKAGE.FETCH_PARTNER_TYPE,
    actionType: ACTION_TYPES.FETCH_PARTNER_TYPE
  });

export const fetchProvider = (data = {}) => {
  return {
    url: API_URL.PLAN_PACKAGE.FETCH_PROVIDER,
    method: REQUEST_METHOD.GET,
    payload: {
      types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_PROVIDER],
      data: data,
      progressKey: ACTION_TYPES.FETCH_PROVIDER
    }
  };
};
export const submitMainService = (data = {}) => ({
  url: API_URL.PLAN_PACKAGE.SUBMIT_MAIN_SERVICE,
  method: REQUEST_METHOD.POST,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.SUBMIT_MAIN_SERVICE],
    data,
    progressKey: ACTION_TYPES.SUBMIT_MAIN_SERVICE
  }
});

export const submitServiceMapping = (payload) => {
  return {
    url: API_URL.PLAN_PACKAGE.SUBMIT_SERVICE_MAPPING,
    method: REQUEST_METHOD.POST,
    payload: {
      types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.SUBMIT_SERVICE_MAPPING],
      data: payload,
      progressKey: ACTION_TYPES.SUBMIT_SERVICE_MAPPING
    }
  };
};

export const updateServiceMapping = (payload) => {
  const { id, subServiceCategoryIds } = payload;
  return {
    url: API_URL.PLAN_PACKAGE.UPDATE_SERVICE_MAPPING.replace(':id', id),
    method: REQUEST_METHOD.PUT,
    payload: {
      types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.UPDATE_SERVICE_MAPPING],
      data: subServiceCategoryIds,
      progressKey: ACTION_TYPES.UPDATE_SERVICE_MAPPING
    }
  };
};

export const fetchServiceMappings = (data = {}) => ({
  url: API_URL.PLAN_PACKAGE.FETCH_SERVICE_MAPPINGS,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_SERVICE_MAPPINGS],
    progressKey: ACTION_TYPES.FETCH_SERVICE_MAPPINGS,
    data
  }
});

export const updateMainService = ({ id, ...data }) => ({
  url: `${API_URL.PLAN_PACKAGE.UPDATE_MAIN_SERVICE}/${id}`,
  method: REQUEST_METHOD.PUT,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.UPDATE_MAIN_SERVICE],
    progressKey: ACTION_TYPES.UPDATE_MAIN_SERVICE,
    data
  }
});

export const fetchMainServices = (data = {}) => ({
  url: API_URL.PLAN_PACKAGE.FETCH_MAIN_SERVICES,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_MAIN_SERVICES],
    progressKey: ACTION_TYPES.FETCH_MAIN_SERVICES,
    data
  }
});

export const fetchDefaultPackageType = () => {
  return {
    url: API_URL.PLAN_PACKAGE.FETCH_DEFAULT_PACKAGE_TYPE,
    method: REQUEST_METHOD.GET,
    payload: {
      types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_DEFAULT_PACKAGE_TYPE],
      progressKey: ACTION_TYPES.FETCH_DEFAULT_PACKAGE_TYPE
    }
  };
};

export const fetchServiceCategoryLookup = (data = {}) => {
  return {
    url: API_URL.PLAN_PACKAGE.FETCH_SERVICE_CATEGORY_LOOKUP,
    method: REQUEST_METHOD.GET,
    payload: {
      types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_SERVICE_CATEGORY_LOOKUP],
      data: { type: data },
      progressKey: ACTION_TYPES.FETCH_SERVICE_CATEGORY_LOOKUP
    }
  };
};

export const fetchSubServiceCategoryLookup = () => {
  return {
    url: API_URL.PLAN_PACKAGE.FETCH_SUB_SERVICE_CATEGORY_LOOKUP,
    method: REQUEST_METHOD.GET,
    payload: {
      types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_SUB_SERVICE_CATEGORY_LOOKUP],
      progressKey: ACTION_TYPES.FETCH_SUB_SERVICE_CATEGORY_LOOKUP
    }
  };
};

export const fetchSubPackageTypeLookup = (data = {}) => {
  console.log(363, data);
  return {
    url: API_URL.PLAN_PACKAGE.FETCH_SUB_PACKAGE_TYPE_LOOKUP,
    method: REQUEST_METHOD.GET,
    payload: {
      types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_SUB_PACKAGE_TYPE_LOOKUP],
      data: data,
      progressKey: ACTION_TYPES.FETCH_SUB_PACKAGE_TYPE_LOOKUP
    }
  };
};

export const submitSubService = (data = {}) => {
  return {
    url: API_URL.PLAN_PACKAGE.SUBMIT_SUB_SERVICE_CATEGORY,
    method: REQUEST_METHOD.POST,
    payload: {
      types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.SUBMIT_SUB_SERVICE],
      progressKey: ACTION_TYPES.SUBMIT_SUB_SERVICE,
      data
    }
  };
};

export const updateSubService = (id, data = {}) => {
  return {
    url: `${API_URL.PLAN_PACKAGE.UPDATE_SUB_SERVICE_CATEGORY}/${id}`,
    method: REQUEST_METHOD.PUT,
    payload: {
      types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.UPDATE_SUB_SERVICE],
      progressKey: ACTION_TYPES.UPDATE_SUB_SERVICE,
      data
    }
  };
};

export const fetchSubServiceById = (id) => ({
  url: `${API_URL.PLAN_PACKAGE.FETCH_SUB_SERVICE_BY_ID}/${id}`,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_SUB_SERVICE_BY_ID],
    progressKey: ACTION_TYPES.FETCH_SUB_SERVICE_BY_ID
  }
});

export const fetchSubServices = (data = {}) => ({
  url: API_URL.PLAN_PACKAGE.FETCH_SUB_SERVICES,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_SUB_SERVICES],
    progressKey: ACTION_TYPES.FETCH_SUB_SERVICES,
    data
  }
});

export const fetchServiceCategoryById = ({ id }) => ({
  url: API_URL.PLAN_PACKAGE.FETCH_SERVICE_CATEGORY_BY_ID.replace(':id', id),
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_SERVICE_CATEGORY_BY_ID],
    progressKey: ACTION_TYPES.FETCH_SERVICE_CATEGORY_BY_ID
  }
});

export const fetchServiceTypesLookup = () => {
  return {
    url: API_URL.PLAN_PACKAGE.FETCH_SERVICE_TYPES_LOOKUP,
    method: REQUEST_METHOD.GET,
    payload: {
      types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_SERVICE_TYPES_LOOKUP],
      progressKey: ACTION_TYPES.FETCH_SERVICE_TYPES_LOOKUP
    }
  };
};
