import { MULTI_PART_FORM_HEADER, REQUEST_METHOD } from '@/constants/api';
import { FILE_RESPONSE_TYPE } from '@/constants/file';
import { API_URL } from '@/constants/urls';
import { buildMultipartFormData } from '@/utils/fileUtils';

import { API_ACTION_TYPE_VARIANTS, API_ACTION_TYPES as ACTION_TYPES } from './actions';

export const fetchDeviceListApi = (data = {}) => {
  return {
    url: API_URL.INVENTORY.DASHBOARD.LIST,
    method: REQUEST_METHOD.GET,
    payload: {
      types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_DEVICE_LIST],
      data,
      progressKey: ACTION_TYPES.FETCH_DEVICE_LIST
    }
  };
};

export const fetchSearchDeviceApi = (data = {}) => {
  return {
    url: API_URL.INVENTORY.DETAILS.SEARCH_DEVICE,
    method: REQUEST_METHOD.GET,
    payload: {
      types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_SEARCH_DEVICE],
      data,
      progressKey: ACTION_TYPES.FETCH_SEARCH_DEVICE
    }
  };
};

export const fetchTransferDeviceListApi = (data = {}) => ({
  url: API_URL.INVENTORY.DEVICE_TRANSFER.LIST,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_TRANSFER_DEVICE_LIST],
    data,
    progressKey: ACTION_TYPES.FETCH_TRANSFER_DEVICE_LIST
  }
});

export const fetchDeviceListDashboardApi = () => ({
  url: API_URL.INVENTORY.DASHBOARD.FETCH,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_DEVICE_LIST_DASHBOARD],
    progressKey: ACTION_TYPES.FETCH_DEVICE_LIST_DASHBOARD
  }
});

export const downloadDeviceListCsvApi = () => ({
  url: API_URL.INVENTORY.DEVICE.DOWNLOAD_CSV,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.DOWNLOAD_DEVICE_LIST_CSV],
    progressKey: ACTION_TYPES.DOWNLOAD_DEVICE_LIST_CSV,
    isDocument: true,
    documentType: FILE_RESPONSE_TYPE.BLOB,
    fileName: 'device_list.csv'
  }
});

export const createDeviceApi = ({ file, request } = {}) => ({
  url: API_URL.INVENTORY.DEVICE.CREATE,
  method: REQUEST_METHOD.POST,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.CREATE_DEVICE],
    data: buildMultipartFormData({ request }, file),
    headers: MULTI_PART_FORM_HEADER,
    progressKey: ACTION_TYPES.CREATE_DEVICE
  }
});

export const fetchDeviceTypeListApi = (data = {}) => ({
  url: API_URL.INVENTORY.DEVICE_TYPE.LIST,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_DEVICE_TYPE_LIST],
    data,
    progressKey: ACTION_TYPES.FETCH_DEVICE_TYPE_LIST
  }
});

export const fetchDeviceTypeListDropdownApi = (data = {}) => ({
  url: API_URL.INVENTORY.DEVICE_TYPE.DROPDOWN,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_DEVICE_TYPE_DROPDOWN],
    data,
    progressKey: ACTION_TYPES.FETCH_DEVICE_TYPE_DROPDOWN
  }
});

export const createDeviceTypeApi = (data = {}) => ({
  url: API_URL.INVENTORY.DEVICE_TYPE.CREATE,
  method: REQUEST_METHOD.POST,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.CREATE_DEVICE_TYPE],
    data,
    progressKey: ACTION_TYPES.CREATE_DEVICE_TYPE
  }
});

export const fetchDeviceMakeListApi = (data = {}) => ({
  url: API_URL.INVENTORY.DEVICE_MAKE.LIST,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_DEVICE_MAKE_LIST],
    data,
    progressKey: ACTION_TYPES.FETCH_DEVICE_MAKE_LIST
  }
});

export const fetchDeviceMakeDropdownApi = (data = {}) => ({
  url: API_URL.INVENTORY.DEVICE_MAKE.DROPDOWN,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_DEVICE_MAKE_DROPDOWN],
    data,
    progressKey: ACTION_TYPES.FETCH_DEVICE_MAKE_DROPDOWN
  }
});

export const createDeviceMakeApi = (data = {}) => ({
  url: API_URL.INVENTORY.DEVICE_MAKE.CREATE,
  method: REQUEST_METHOD.POST,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.CREATE_DEVICE_MAKE],
    data,
    progressKey: ACTION_TYPES.CREATE_DEVICE_MAKE
  }
});

export const fetchDeviceCategoryListApi = (data = {}) => ({
  url: API_URL.INVENTORY.DEVICE_CATEGORY.LIST,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_DEVICE_CATEGORY_LIST],
    data,
    progressKey: ACTION_TYPES.FETCH_DEVICE_CATEGORY_LIST
  }
});

export const fetchDeviceCategoryListDropdownApi = (data = {}) => ({
  url: API_URL.INVENTORY.DEVICE_CATEGORY.DROPDOWN,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_DEVICE_CATEGORY_DROPDOWN],
    data,
    progressKey: ACTION_TYPES.FETCH_DEVICE_CATEGORY_DROPDOWN
  }
});

export const fetchDeviceDetailsByCategoryApi = (data = {}) => ({
  url: API_URL.INVENTORY.DETAILS.AVAILABLE_STOCK,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_INVENTORY_DETAILS_LIST],
    data,
    progressKey: ACTION_TYPES.FETCH_INVENTORY_DETAILS_LIST
  }
});
export const createDeviceCategoryApi = (data = {}) => ({
  url: API_URL.INVENTORY.DEVICE_CATEGORY.CREATE,
  method: REQUEST_METHOD.POST,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.CREATE_DEVICE_CATEGORY],
    data,
    progressKey: ACTION_TYPES.CREATE_DEVICE_CATEGORY
  }
});

export const fetchCategoryCountApi = (data = {}) => ({
  url: API_URL.INVENTORY.DEVICE_CATEGORY.CATEGORY_COUNT.replace(':typeName', data.typeName),
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_CATEGORY_COUNT],
    progressKey: ACTION_TYPES.FETCH_CATEGORY_COUNT
  }
});

export const fetchDeviceModelListApi = (data = {}) => ({
  url: API_URL.INVENTORY.DEVICE_MODEL.LIST,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_DEVICE_MODEL_LIST],
    data,
    progressKey: ACTION_TYPES.FETCH_DEVICE_MODEL_LIST
  }
});

export const fetchDeviceModelListDropdownApi = (data = {}) => ({
  url: API_URL.INVENTORY.DEVICE_MODEL.DROPDOWN,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_DEVICE_MODEL_DROPDOWN],
    data,
    progressKey: ACTION_TYPES.FETCH_DEVICE_MODEL_DROPDOWN
  }
});

export const fetchDeviceModelById = (id) => ({
  url: API_URL.INVENTORY.DEVICE_MODEL.DETAILS.replace(':id', id),
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_DEVICE_MODEL_DETAILS],
    progressKey: ACTION_TYPES.FETCH_DEVICE_MODEL_DETAILS
  }
});

export const createDeviceModelApi = (data = {}) => ({
  url: API_URL.INVENTORY.DEVICE_MODEL.CREATE,
  method: REQUEST_METHOD.POST,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.CREATE_DEVICE_MODEL],
    data,
    progressKey: ACTION_TYPES.CREATE_DEVICE_MODEL
  }
});

export const downloadDeviceModelCsvApi = () => ({
  url: API_URL.INVENTORY.DEVICE_MODEL.DOWNLOAD_CSV,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.DOWNLOAD_DEVICE_MODEL_CSV],
    progressKey: ACTION_TYPES.DOWNLOAD_DEVICE_MODEL_CSV,
    isDocument: true,
    documentType: FILE_RESPONSE_TYPE.BLOB,
    fileName: 'device_models.csv'
  }
});

export const fetchDeviceVendorListApi = (data = {}) => ({
  url: API_URL.INVENTORY.DEVICE_VENDOR.LIST,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_DEVICE_VENDOR_LIST],
    data,
    progressKey: ACTION_TYPES.FETCH_DEVICE_VENDOR_LIST
  }
});
export const fetchDeviceVendorListDropdownApi = (data = {}) => ({
  url: API_URL.INVENTORY.DEVICE_VENDOR.DROPDOWN,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_DEVICE_VENDOR_DROPDOWN],
    data,
    progressKey: ACTION_TYPES.FETCH_DEVICE_VENDOR_DROPDOWN
  }
});
export const fetchDeviceVendorById = (id) => ({
  url: API_URL.INVENTORY.DEVICE_VENDOR.DETAILS.replace(':id', id),
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_DEVICE_VENDOR_DETAILS],
    progressKey: ACTION_TYPES.FETCH_DEVICE_VENDOR_DETAILS
  }
});
export const createDeviceVendorApi = (data = {}) => ({
  url: API_URL.INVENTORY.DEVICE_VENDOR.CREATE,
  method: REQUEST_METHOD.POST,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.CREATE_DEVICE_VENDOR],
    data,
    progressKey: ACTION_TYPES.CREATE_DEVICE_VENDOR
  }
});

export const updateDeviceVendorApi = (data = {}) => {
  const { id } = data;
  return {
    url: API_URL.INVENTORY.DEVICE_VENDOR.UPDATE.replace(':vendorId', id),
    method: REQUEST_METHOD.PUT,
    payload: {
      types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.UPDATE_DEVICE_VENDOR],
      data,
      progressKey: ACTION_TYPES.UPDATE_DEVICE_VENDOR
    }
  };
};

export const fetchAssetTypesDropdownApi = (data = {}) => ({
  url: API_URL.INVENTORY.DETAILS.ASSET_TYPES,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_ASSET_TYPE_DROPDOWN],
    data,
    progressKey: ACTION_TYPES.FETCH_ASSET_TYPE_DROPDOWN
  }
});

export const downloadSampleDeviceCSVApi = ({ deviceType } = {}) => ({
  url: API_URL.INVENTORY.DETAILS.DOWNLOAD_CSV.replace(':deviceType', deviceType),
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.DOWNLOAD_SAMPLE_DEVICE_CSV],
    progressKey: ACTION_TYPES.DOWNLOAD_SAMPLE_DEVICE_CSV,
    isDocument: true,
    documentType: FILE_RESPONSE_TYPE.BLOB,
    fileName: 'sample_device.csv'
  }
});

export const fetchUserByRoleApi = (data = {}) => ({
  url: API_URL.INVENTORY.DEVICE_TRANSFER.USER_BY_ROLE,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_USER_BY_ROLE],
    data,
    progressKey: ACTION_TYPES.FETCH_USER_BY_ROLE
  }
});

export const fetchAllRolesApi = () => ({
  url: API_URL.COMMON.FETCH_ALL_ROLES,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_ALL_ROLES],
    progressKey: ACTION_TYPES.FETCH_ALL_ROLES
  }
});

export const fetchUsersByRoleIdApi = (data = {}) => ({
  url: API_URL.CORPORATE.ENQUIRY.ROLE_USERS,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_USERS_BY_ROLE_ID],
    params: { roleId: data?.roleId },
    progressKey: ACTION_TYPES.FETCH_USERS_BY_ROLE_ID
  }
});

export const submitDeviceTransferApi = (data = {}) => ({
  url: API_URL.INVENTORY.DEVICE_TRANSFER.SUBMIT,
  method: REQUEST_METHOD.POST,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.SUBMIT_DEVICE_TRANSFER],
    data,
    progressKey: ACTION_TYPES.SUBMIT_DEVICE_TRANSFER
  }
});

export const submitMyStockTransferApi = (data = {}) => ({
  url: API_URL.INVENTORY.MY_STOCK.STOCK_HANDOVER,
  method: REQUEST_METHOD.POST,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.SUBMIT_MY_STOCK_TRANSFER],
    data,
    progressKey: ACTION_TYPES.SUBMIT_MY_STOCK_TRANSFER
  }
});

export const submitDeviceConditionUpdateApi = (data = {}) => ({
  url: API_URL.INVENTORY.DETAILS.DEVICE_CONDITION_UPDATE,
  method: REQUEST_METHOD.POST,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.SUBMIT_DEVICE_CONDITION_UPDATE],
    data,
    progressKey: ACTION_TYPES.SUBMIT_DEVICE_CONDITION_UPDATE
  }
});

export const submitReturnToOemApi = ({ file, request } = {}) => ({
  url: API_URL.INVENTORY.DETAILS.RETURN_TO_OEM,
  method: REQUEST_METHOD.POST,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.SUBMIT_RETURN_TO_OEM],
    data: buildMultipartFormData({ request }, file),
    headers: MULTI_PART_FORM_HEADER,
    progressKey: ACTION_TYPES.SUBMIT_RETURN_TO_OEM
  }
});

export const submitBulkDeviceTransferApi = (data = {}) => ({
  url: API_URL.INVENTORY.DEVICE_TRANSFER.SUBMIT_BULK,
  method: REQUEST_METHOD.POST,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.SUBMIT_BULK_DEVICE_TRANSFER],
    data,
    headers: MULTI_PART_FORM_HEADER,
    progressKey: ACTION_TYPES.SUBMIT_BULK_DEVICE_TRANSFER
  }
});

export const fetchTransferDetailsListApi = (data = {}) => ({
  url: API_URL.INVENTORY.DEVICE_TRANSFER.LIST, // Assuming reusing similar endpoint or will need adjustment
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_TRANSFER_DETAILS],
    data,
    progressKey: ACTION_TYPES.FETCH_TRANSFER_DETAILS
  }
});

export const fetchTransferDetailsApi = (data = {}) => ({
  url: API_URL.INVENTORY.DEVICE_TRANSFER.TRANSFER_DETAILS.replace(':id', data.id), // Assuming reusing similar endpoint or will need adjustment
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_TRANSFER_DETAILS],
    data,
    progressKey: ACTION_TYPES.FETCH_TRANSFER_DETAILS
  }
});

export const updateTransferStatusApi = (data = {}) => ({
  url: API_URL.INVENTORY.DEVICE_TRANSFER.DGM_APPROVAL,
  method: REQUEST_METHOD.POST,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.UPDATE_TRANSFER_STATUS],
    data,
    progressKey: ACTION_TYPES.UPDATE_TRANSFER_STATUS
  }
});

export const acknowledgeDeviceTransferApi = (data = {}) => ({
  url: API_URL.INVENTORY.DEVICE_TRANSFER.DC_ACKNOWLEDGE,
  method: REQUEST_METHOD.POST,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.ACKNOWLEDGE_DEVICE_TRANSFER],
    data,
    progressKey: ACTION_TYPES.ACKNOWLEDGE_DEVICE_TRANSFER
  }
});

export const fetchDeviceRequestsListApi = (data = {}) => ({
  url: API_URL.INVENTORY.DEVICE_TRANSFER.FETCH_REQUEST,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_DEVICE_REQUESTS_LIST],
    data,
    progressKey: ACTION_TYPES.FETCH_DEVICE_REQUESTS_LIST
  }
});

export const createDeviceRequestsApi = (data = {}) => ({
  url: API_URL.INVENTORY.DEVICE_TRANSFER.CREATE_REQUEST,
  method: REQUEST_METHOD.POST,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.CREATE_DEVICE_REQUESTS],
    data,
    progressKey: ACTION_TYPES.CREATE_DEVICE_REQUESTS
  }
});

export const submitStockRequestApi = (data = {}) => ({
  url: API_URL.INVENTORY.DEVICE_TRANSFER.STOCK_REQUEST,
  method: REQUEST_METHOD.POST,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.SUBMIT_STOCK_REQUEST],
    data,
    progressKey: ACTION_TYPES.SUBMIT_STOCK_REQUEST
  }
});

export const submitExternalRequestApi = (data = {}) => ({
  url: API_URL.INVENTORY.DEVICE_TRANSFER.EXTERNAL_REQUEST,
  method: REQUEST_METHOD.POST,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.SUBMIT_EXTERNAL_REQUEST],
    data,
    progressKey: ACTION_TYPES.SUBMIT_EXTERNAL_REQUEST
  }
});

export const fetchMspRequestDetailsApi = ({ id, ...data }) => ({
  url: API_URL.INVENTORY.DEVICE_TRANSFER.FETCH_MSP_REQUEST_DETAILS.replace(':id', id),
  method: REQUEST_METHOD.GET,
  payload: {
    data,
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_MSP_REQUEST_DETAILS],
    progressKey: ACTION_TYPES.FETCH_MSP_REQUEST_DETAILS
  }
});

export const approveDeviceRequestApi = (data = {}) => ({
  url: API_URL.INVENTORY.DEVICE_TRANSFER.APPROVE_REJECT,
  method: REQUEST_METHOD.POST,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.APPROVE_DEVICE_REQUEST],
    data,
    progressKey: ACTION_TYPES.APPROVE_DEVICE_REQUEST
  }
});

export const acknowledgeDeviceRequestApi = (data = {}) => ({
  url: API_URL.INVENTORY.DEVICE_TRANSFER.ACKNOWLEDGE_REQUEST,
  method: REQUEST_METHOD.POST,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.ACKNOWLEDGE_DEVICE_REQUEST],
    data,
    progressKey: ACTION_TYPES.ACKNOWLEDGE_DEVICE_REQUEST
  }
});

export const fetchStockDetailsListApi = (data = {}) => ({
  url: API_URL.INVENTORY.DETAILS.STOCK_LIST,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_STOCK_DETAILS_LIST],
    data,
    progressKey: ACTION_TYPES.FETCH_STOCK_DETAILS_LIST
  }
});

export const fetchStockByPoNoApi = (data = {}) => ({
  url: API_URL.INVENTORY.DETAILS.STOCK_BY_PONO,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_STOCK_BY_PONO],
    data,
    progressKey: ACTION_TYPES.FETCH_STOCK_BY_PONO
  }
});

export const approveOrRejectStockApi = (data = {}) => ({
  url: API_URL.INVENTORY.DETAILS.APPROVE_OR_REJECT_STOCK,
  method: REQUEST_METHOD.POST,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.APPROVE_OR_REJECT_STOCK],
    data,
    progressKey: ACTION_TYPES.APPROVE_OR_REJECT_STOCK
  }
});

export const submitStockReceiveApi = (data = {}) => ({
  url: API_URL.INVENTORY.DEVICE_TRANSFER.STOCK_RECEIVE,
  method: REQUEST_METHOD.POST,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.SUBMIT_STOCK_RECEIVE],
    data,
    progressKey: ACTION_TYPES.SUBMIT_STOCK_RECEIVE
  }
});

export const fetchStockTypeCountApi = () => ({
  url: API_URL.INVENTORY.DASHBOARD.STOCK_TYPE_COUNT,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_STOCK_TYPE_COUNT],
    progressKey: ACTION_TYPES.FETCH_STOCK_TYPE_COUNT
  }
});

export const fetchDeviceTypeCategoryApi = () => ({
  url: API_URL.INVENTORY.DASHBOARD.DEVICE_TYPE_CATEGORY,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_DEVICE_TYPE_CATEGORY],
    progressKey: ACTION_TYPES.FETCH_DEVICE_TYPE_CATEGORY
  }
});

export const fetchMyStockListApi = (data = {}) => ({
  url: API_URL.INVENTORY.MY_STOCK.LIST,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_MY_STOCK_LIST],
    data,
    progressKey: ACTION_TYPES.FETCH_MY_STOCK_LIST
  }
});

export const fetchTransferredStockListApi = (data = {}) => ({
  url: API_URL.INVENTORY.MY_STOCK.TRANSFERRED_LIST,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_TRANSFERRED_STOCK_LIST],
    data,
    progressKey: ACTION_TYPES.FETCH_TRANSFERRED_STOCK_LIST
  }
});

export const downloadOemHandoverPdfApi = (data = {}) => ({
  url: API_URL.INVENTORY.MY_STOCK.OEM_HANDOVER_PDF,
  method: REQUEST_METHOD.POST,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.DOWNLOAD_OEM_HANDOVER_PDF],
    data,
    progressKey: ACTION_TYPES.DOWNLOAD_OEM_HANDOVER_PDF,
    isDocument: true,
    documentType: FILE_RESPONSE_TYPE.BLOB,
    fileName: 'oem-handover.pdf'
  }
});

export const submitMapDeviceApi = (data = {}) => ({
  url: API_URL.INVENTORY.DETAILS.MAP_DEVICE,
  method: REQUEST_METHOD.POST,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.SUBMIT_MAP_DEVICE],
    data,
    progressKey: ACTION_TYPES.SUBMIT_MAP_DEVICE
  }
});

export const submitUnmapDeviceApi = ({ detailsId } = {}) => ({
  url: API_URL.INVENTORY.DETAILS.UNMAP_DEVICE,
  method: REQUEST_METHOD.POST,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.SUBMIT_UNMAP_DEVICE],
    params: { detailsId },
    progressKey: ACTION_TYPES.SUBMIT_UNMAP_DEVICE
  }
});

export const submitRecallDeviceApi = ({ transferId, deviceId, type } = {}) => ({
  url: API_URL.INVENTORY.DEVICE_TRANSFER.RECALL,
  method: REQUEST_METHOD.PUT,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.SUBMIT_RECALL_DEVICE],
    params: { transferId, deviceId, type },
    progressKey: ACTION_TYPES.SUBMIT_RECALL_DEVICE
  }
});

export const fetchStockTrackApi = ({ deviceId } = {}) => ({
  url: API_URL.INVENTORY.DETAILS.STOCK_TRACK.replace(':deviceId', deviceId),
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_STOCK_TRACK],
    progressKey: ACTION_TYPES.FETCH_STOCK_TRACK
  }
});

export const fetchDeviceMappedValuesApi = (data = {}) => ({
  url: API_URL.INVENTORY.DETAILS.DEVICE_MAPPED_VALUES,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_DEVICE_MAPPED_VALUES],
    data,
    progressKey: ACTION_TYPES.FETCH_DEVICE_MAPPED_VALUES
  }
});

export const fetchPopNameDropdownApi = (data = {}) => ({
  url: API_URL.INVENTORY.DETAILS.POP_NAME_DROPDOWN,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_POP_NAME_DROPDOWN],
    data,
    progressKey: ACTION_TYPES.FETCH_POP_NAME_DROPDOWN
  }
});

export const fetchReplaceDeviceConditionApi = () => ({
  url: API_URL.INVENTORY.DETAILS.REPLACE_DEVICE_CONDITION,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_REPLACE_DEVICE_CONDITION],
    progressKey: ACTION_TYPES.FETCH_REPLACE_DEVICE_CONDITION
  }
});

export const submitReplaceDeviceApi = (data = {}) => ({
  url: API_URL.INVENTORY.DETAILS.REPLACE_DEVICE,
  method: REQUEST_METHOD.POST,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.SUBMIT_REPLACE_DEVICE],
    data,
    progressKey: ACTION_TYPES.SUBMIT_REPLACE_DEVICE
  }
});

export const fetchInventoryDetailsByIdApi = ({ detailsId } = {}) => ({
  url: API_URL.INVENTORY.DETAILS.FETCH_BY_ID.replace(':detailsId', detailsId),
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_INVENTORY_DETAILS_BY_ID],
    progressKey: ACTION_TYPES.FETCH_INVENTORY_DETAILS_BY_ID
  }
});

export const fetchOemRequestListApi = (data = {}) => ({
  url: API_URL.INVENTORY.DETAILS.OEM_REQUEST_LIST,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_OEM_REQUEST_LIST],
    data,
    progressKey: ACTION_TYPES.FETCH_OEM_REQUEST_LIST
  }
});

export const submitOemRemarkApi = (data = {}) => ({
  url: API_URL.INVENTORY.DETAILS.OEM_REMARK,
  method: REQUEST_METHOD.POST,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.SUBMIT_OEM_REMARK],
    data,
    progressKey: ACTION_TYPES.SUBMIT_OEM_REMARK
  }
});

export const submitStockTransferApi = (data = {}) => ({
  url: API_URL.INVENTORY.DEVICE_TRANSFER.STOCK_TRANSFER,
  method: REQUEST_METHOD.POST,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.SUBMIT_STOCK_TRANSFER],
    data,
    progressKey: ACTION_TYPES.SUBMIT_STOCK_TRANSFER
  }
});

export const fetchStockStatusDropdownApi = () => ({
  url: API_URL.INVENTORY.DETAILS.STOCK_STATUS_DROPDOWN,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_STOCK_STATUS_DROPDOWN],
    progressKey: ACTION_TYPES.FETCH_STOCK_STATUS_DROPDOWN
  }
});

export const fetchDeviceConditionDropdownApi = () => ({
  url: API_URL.INVENTORY.DETAILS.DEVICE_CONDITION_DROPDOWN,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_DEVICE_CONDITION_DROPDOWN],
    progressKey: ACTION_TYPES.FETCH_DEVICE_CONDITION_DROPDOWN
  }
});

export const submitOemForwardApi = ({ file, request } = {}) => {
  const { moduleId, moduleName, subModule, note, forwardedUserId, status, visibility } = request || {};
  const params = new URLSearchParams();
  if (moduleId) params.append('moduleId', moduleId);
  if (moduleName) params.append('moduleName', moduleName);
  if (subModule) params.append('subModule', subModule);
  if (note) params.append('note', note);
  if (forwardedUserId) params.append('forwardedUserId', forwardedUserId);
  if (status) params.append('status', status);
  if (visibility) params.append('visibility', visibility);
  const formData = new FormData();
  if (file) formData.append('file', file);
  return {
    url: `${API_URL.INVENTORY.DETAILS.OEM_FORWARD}?${params.toString()}`,
    method: REQUEST_METHOD.POST,
    payload: {
      types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.SUBMIT_OEM_FORWARD],
      data: formData,
      headers: MULTI_PART_FORM_HEADER,
      progressKey: ACTION_TYPES.SUBMIT_OEM_FORWARD
    }
  };
};

export const fetchDeviceTypeFieldsApi = () => ({
  url: API_URL.INVENTORY.DETAILS.DEVICE_TYPE_FIELDS,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_DEVICE_TYPE_FIELDS],
    progressKey: ACTION_TYPES.FETCH_DEVICE_TYPE_FIELDS
  }
});

export const saveDeviceTypeFieldsApi = (payload) => ({
  url: API_URL.INVENTORY.DETAILS.DEVICE_TYPE_FIELDS,
  method: REQUEST_METHOD.POST,
  payload: {
    data: payload,
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.SAVE_DEVICE_TYPE_FIELDS],
    progressKey: ACTION_TYPES.SAVE_DEVICE_TYPE_FIELDS
  }
});

export const fetchLnpRequestsApi = (data = {}) => ({
  url: API_URL.INVENTORY.DEVICE_TRANSFER.FETCH_LNP_REQUESTS,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_LNP_REQUESTS],
    data,
    progressKey: ACTION_TYPES.FETCH_LNP_REQUESTS
  }
});
