import { t } from 'i18next';
import { all, call, fork, put, select, take, takeLatest } from 'redux-saga/effects';

import { successToast } from '@/components/custom/Toast';
import { actions as apiProgressActions } from '@/features/others/ApiProgress/slice';
import { setCommonPaginationResponse } from '@/features/others/Pagination/saga';
import { getServerSidePaginationDetails } from '@/features/others/Pagination/selectors';
import { selectorWithKey } from '@/utils/commonUtils';
import { handleAPIRequest } from '@/utils/httpUtils';
import { commonListSaga } from '@/utils/sagaUtils';

import { API_ACTION_TYPE_VARIANTS, API_ACTION_TYPES } from './actions';
import * as api from './api';
import { INVENTORY_KEYS } from './constants';
import { actions as sliceActions } from './slice';

function* listSaga(action, apiFn) {
  const { type: actionType, payload: { key, isDropdown = false, ...data } = {} } = action;

  let payload = data;
  if (key && !isDropdown) {
    const paginationDetails = yield select(getServerSidePaginationDetails);
    const { page, size } = selectorWithKey(paginationDetails, key) || {};
    if (page !== undefined && size !== undefined) {
      payload = { page, size, ...payload };
    }
  }

  if (actionType) yield put(apiProgressActions.setProgress({ key: actionType, isLoading: true }));
  const { response } = yield call(handleAPIRequest, apiFn, payload);
  if (actionType) yield put(apiProgressActions.setProgress({ key: actionType, isLoading: false }));

  if (key && response) {
    if (!isDropdown) {
      yield call(setCommonPaginationResponse, key, response);
      yield put(sliceActions.setTableData({ tableKey: key, data: response?.data?.content }));
    } else {
      yield put(sliceActions.setDropdownData({ tableKey: key, data: response?.data || response }));
    }
  }
  return response;
}

function* createSaga(payload, apiFn, actionType, onSuccess) {
  yield fork(handleAPIRequest, apiFn, payload);

  const { payload: { message = '' } = {}, type } = yield take([
    API_ACTION_TYPE_VARIANTS[actionType][1],
    API_ACTION_TYPE_VARIANTS[actionType][2]
  ]);

  if (type === API_ACTION_TYPE_VARIANTS[actionType][1]) {
    yield call(successToast, { title: 'success', description: message || t('saveSuccess') });
    if (onSuccess) {
      yield call(onSuccess);
    }
    return true;
  }
}

function* fetchDeviceList(action) {
  const { payload } = action;
  yield* listSaga(
    { ...action, payload: { ...payload, key: INVENTORY_KEYS.DEVICE_LIST_TABLE } },
    api.fetchDeviceListApi,
    API_ACTION_TYPES.FETCH_DEVICE_LIST
  );
}

function* fetchTransferDeviceList(action) {
  const { payload } = action;
  yield* listSaga(
    { ...action, payload: { ...payload, key: INVENTORY_KEYS.TRANSFER_DEVICE_LIST } },
    api.fetchTransferDeviceListApi,
    API_ACTION_TYPES.FETCH_TRANSFER_DEVICE_LIST
  );
}

function* createDevice(action) {
  const { file, request, onSuccess } = action.payload;
  const isSuccess = yield* createSaga({ file, request }, api.createDeviceApi, API_ACTION_TYPES.CREATE_DEVICE);
  if (isSuccess && onSuccess) {
    onSuccess();
  }
}

function* fetchDeviceTypeList(action) {
  const { payload } = action;
  yield* listSaga(
    { ...action, payload: { ...payload, key: INVENTORY_KEYS.DEVICE_TYPE_LIST } },
    api.fetchDeviceTypeListApi,
    API_ACTION_TYPES.FETCH_DEVICE_TYPE_LIST
  );
}

function* fetchDeviceTypeListDropdown(action) {
  const { payload } = action;
  yield* listSaga(
    { ...action, payload: { ...payload, key: INVENTORY_KEYS.DEVICE_TYPE_LIST, isDropdown: true } },
    api.fetchDeviceTypeListDropdownApi,
    API_ACTION_TYPES.FETCH_DEVICE_TYPE_DROPDOWN
  );
}

function* createDeviceType(action) {
  const {
    payload: { source = 'none', onSuccess, ...formData }
  } = action;
  const isSuccess = yield* createSaga(formData, api.createDeviceTypeApi, API_ACTION_TYPES.CREATE_DEVICE_TYPE);
  if (isSuccess) {
    if (onSuccess) yield call(onSuccess);
    if (source === 'list') yield* fetchDeviceTypeList({ payload: {} });
    if (source === 'dropdown') yield* fetchDeviceTypeListDropdown({});
  }
}

function* fetchDeviceMakeList(action) {
  const { payload } = action;
  yield* listSaga(
    { ...action, payload: { ...payload, key: INVENTORY_KEYS.DEVICE_MAKE_LIST } },
    api.fetchDeviceMakeListApi,
    API_ACTION_TYPES.FETCH_DEVICE_MAKE_LIST
  );
}

function* fetchDeviceMakeListDropdown(action) {
  const { payload } = action;
  yield* listSaga(
    { ...action, payload: { ...payload, key: INVENTORY_KEYS.DEVICE_MAKE_LIST, isDropdown: true } },
    api.fetchDeviceMakeDropdownApi,
    API_ACTION_TYPES.FETCH_DEVICE_MAKE_DROPDOWN
  );
}

function* createDeviceMake(action) {
  const {
    payload: { source = 'none', onSuccess, ...formData }
  } = action;
  const isSuccess = yield* createSaga(formData, api.createDeviceMakeApi, API_ACTION_TYPES.CREATE_DEVICE_MAKE);
  if (isSuccess) {
    if (onSuccess) yield call(onSuccess);
    if (source === 'list') yield* fetchDeviceMakeList({ payload: {} });
    if (source === 'dropdown') yield* fetchDeviceMakeListDropdown({});
  }
}

function* fetchDeviceCategoryList(action) {
  const { payload } = action;
  yield* listSaga(
    { ...action, payload: { ...payload, key: INVENTORY_KEYS.DEVICE_CATEGORY_LIST } },
    api.fetchDeviceCategoryListApi,
    API_ACTION_TYPES.FETCH_DEVICE_CATEGORY_LIST
  );
}

function* fetchDeviceCategoryListDropdown(action) {
  const { payload } = action;
  yield* listSaga(
    { ...action, payload: { ...payload, key: INVENTORY_KEYS.DEVICE_CATEGORY_LIST, isDropdown: true } },
    api.fetchDeviceCategoryListDropdownApi,
    API_ACTION_TYPES.FETCH_DEVICE_CATEGORY_DROPDOWN
  );
}

function* createDeviceCategory(action) {
  const {
    payload: { source = 'none', deviceType, onSuccess, ...rest }
  } = action;
  const formData = { ...rest, typeId: deviceType?.id ?? deviceType };
  const isSuccess = yield* createSaga(formData, api.createDeviceCategoryApi, API_ACTION_TYPES.CREATE_DEVICE_CATEGORY);
  if (isSuccess) {
    if (onSuccess) yield call(onSuccess);
    if (source === 'list') yield* fetchDeviceCategoryList({ payload: {} });
    if (source === 'dropdown') yield* fetchDeviceCategoryListDropdown({});
  }
}

function* fetchDeviceModelList(action) {
  const { payload } = action;
  yield* listSaga(
    { ...action, payload: { ...payload, key: INVENTORY_KEYS.DEVICE_MODEL_LIST } },
    api.fetchDeviceModelListApi,
    API_ACTION_TYPES.FETCH_DEVICE_MODEL_LIST
  );
}

function* fetchDeviceModelListDropdown(action) {
  const { payload } = action;
  yield* listSaga(
    { ...action, payload: { ...payload, key: INVENTORY_KEYS.DEVICE_MODEL_LIST, isDropdown: true } },
    api.fetchDeviceModelListDropdownApi,
    API_ACTION_TYPES.FETCH_DEVICE_MODEL_DROPDOWN
  );
}

function* createDeviceModel(action) {
  const { onSuccess, ...payload } = action.payload;
  const isSelected = yield* createSaga(payload, api.createDeviceModelApi, API_ACTION_TYPES.CREATE_DEVICE_MODEL);
  if (isSelected && onSuccess) {
    onSuccess();
  }
}

function* fetchDeviceVendorList(action) {
  const { payload } = action;
  yield* listSaga(
    { ...action, payload: { ...payload, key: INVENTORY_KEYS.DEVICE_VENDOR_LIST } },
    api.fetchDeviceVendorListApi,
    API_ACTION_TYPES.FETCH_DEVICE_VENDOR_LIST
  );
}

function* fetchDeviceVendorListDropdown(action) {
  const { payload } = action;
  yield* listSaga(
    { ...action, payload: { ...payload, key: INVENTORY_KEYS.DEVICE_VENDOR_LIST, isDropdown: true } },
    api.fetchDeviceVendorListDropdownApi,
    API_ACTION_TYPES.FETCH_DEVICE_VENDOR_DROPDOWN
  );
}

function* fetchAssetTypesDropdown() {
  yield call(handleAPIRequest, api.fetchAssetTypesDropdownApi, {});
}

function* createDeviceVendor(action) {
  const onSuccess = yield* createSaga(action.payload, api.createDeviceVendorApi, API_ACTION_TYPES.CREATE_DEVICE_VENDOR);
  if (onSuccess) {
    yield* fetchDeviceVendorList({ payload: {} });
  }
}

function* updateDeviceVendor(action) {
  const onSuccess = yield* createSaga(action.payload, api.updateDeviceVendorApi, API_ACTION_TYPES.UPDATE_DEVICE_VENDOR);
  if (onSuccess) {
    yield* fetchDeviceVendorList({ payload: {} });
  }
}

function* fetchDeviceModelDetails(action) {
  const { payload } = action;
  yield call(handleAPIRequest, api.fetchDeviceModelById, payload);
}

function* fetchDeviceVendorDetails(action) {
  const { payload } = action;
  yield call(handleAPIRequest, api.fetchDeviceVendorById, payload);
}

function* downloadSampleDeviceCSV(action) {
  yield call(handleAPIRequest, api.downloadSampleDeviceCSVApi, action.payload);
}

function* downloadDeviceModelCsv(action) {
  yield call(handleAPIRequest, api.downloadDeviceModelCsvApi, action.payload);
}

function* downloadDeviceListCsv(action) {
  yield call(handleAPIRequest, api.downloadDeviceListCsvApi, action.payload);
}

function* fetchDeviceListDashboard(action) {
  const { payload } = action;
  yield* listSaga(
    { ...action, payload: { ...payload, key: INVENTORY_KEYS.DEVICE_LIST_DASHBOARD } },
    api.fetchDeviceListDashboardApi,
    API_ACTION_TYPES.FETCH_DEVICE_LIST_DASHBOARD
  );
}

function* fetchUserByRole(action) {
  const { payload: { roleName, ...params } = {} } = action;
  yield* listSaga(
    { ...action, payload: { ...params, roleName, key: `userList_${roleName}`, isDropdown: true } },
    api.fetchUserByRoleApi,
    API_ACTION_TYPES.FETCH_USER_BY_ROLE
  );
}

function* fetchAllRoles() {
  yield call(handleAPIRequest, api.fetchAllRolesApi);
}

function* fetchUsersByRoleId(action) {
  yield call(handleAPIRequest, api.fetchUsersByRoleIdApi, action.payload);
}

function* submitDeviceTransfer(action) {
  const onSuccess = yield* createSaga(
    action.payload,
    api.submitDeviceTransferApi,
    API_ACTION_TYPES.SUBMIT_DEVICE_TRANSFER
  );
  if (onSuccess) {
    yield* fetchTransferDeviceList({ payload: { key: INVENTORY_KEYS.TRANSFER_DEVICE_LIST } });
  }
}

function* submitMyStockTransfer(action) {
  const onSuccess = yield* createSaga(
    action.payload,
    api.submitMyStockTransferApi,
    API_ACTION_TYPES.SUBMIT_MY_STOCK_TRANSFER
  );
  if (onSuccess) {
    yield* fetchMyStockList({ payload: { key: INVENTORY_KEYS.MY_STOCK_LIST } });
    yield* fetchTransferredStockList({ payload: { key: INVENTORY_KEYS.TRANSFERRED_STOCK_LIST } });
  }
}

function* submitStockTransfer(action) {
  const { onSuccess: navigateOnSuccess, ...payload } = action.payload;
  const onSuccess = yield* createSaga(
    payload,
    api.submitStockTransferApi,
    API_ACTION_TYPES.SUBMIT_STOCK_TRANSFER,
    navigateOnSuccess
  );
  if (onSuccess) {
    yield* fetchMyStockList({ payload: { key: INVENTORY_KEYS.MY_STOCK_LIST } });
  }
}

function* submitDeviceConditionUpdate(action) {
  const onSuccess = yield* createSaga(
    action.payload,
    api.submitDeviceConditionUpdateApi,
    API_ACTION_TYPES.SUBMIT_DEVICE_CONDITION_UPDATE
  );
  if (onSuccess) {
    yield* fetchMyStockList({ payload: { key: INVENTORY_KEYS.MY_STOCK_LIST } });
  }
}

function* submitReturnToOem(action) {
  const onSuccess = yield* createSaga(action.payload, api.submitReturnToOemApi, API_ACTION_TYPES.SUBMIT_RETURN_TO_OEM);
  if (onSuccess) {
    yield* fetchMyStockList({ payload: { key: INVENTORY_KEYS.MY_STOCK_LIST } });
  }
}

function* fetchOemRequestList(action) {
  const { payload } = action;
  yield* listSaga(
    { ...action, payload: { ...payload, key: INVENTORY_KEYS.OEM_REQUEST_LIST } },
    api.fetchOemRequestListApi,
    API_ACTION_TYPES.FETCH_OEM_REQUEST_LIST
  );
}

function* submitOemRemark(action) {
  const { onSuccess, ...payload } = action.payload;
  const isSuccess = yield* createSaga(payload, api.submitOemRemarkApi, API_ACTION_TYPES.SUBMIT_OEM_REMARK, onSuccess);
  return isSuccess;
}

function* submitOemForward(action) {
  const { onSuccess, attachment, ...request } = action.payload;
  yield* createSaga(
    { file: attachment, request },
    api.submitOemForwardApi,
    API_ACTION_TYPES.SUBMIT_OEM_FORWARD,
    onSuccess
  );
}

function* fetchStockStatusDropdown(action) {
  yield* listSaga(
    { ...action, payload: { key: INVENTORY_KEYS.STOCK_STATUS_DROPDOWN, isDropdown: true } },
    api.fetchStockStatusDropdownApi,
    API_ACTION_TYPES.FETCH_STOCK_STATUS_DROPDOWN
  );
}

function* submitBulkDeviceTransfer(action) {
  const onSuccess = yield* createSaga(
    action.payload,
    api.submitBulkDeviceTransferApi,
    API_ACTION_TYPES.SUBMIT_BULK_DEVICE_TRANSFER
  );
  if (onSuccess) {
    yield* fetchTransferDeviceList({ payload: { key: INVENTORY_KEYS.TRANSFER_DEVICE_LIST } });
  }
}

function* fetchTransferDetailsList(action) {
  const { payload } = action;
  yield* listSaga(
    { ...action, payload: { ...payload, key: INVENTORY_KEYS.TRANSFER_DETAILS_LIST } },
    api.fetchTransferDetailsListApi,
    API_ACTION_TYPES.FETCH_TRANSFER_DETAILS_LIST
  );
}

function* fetchTransferDetails(action) {
  const { payload } = action;
  const key = INVENTORY_KEYS.TRANSFER_DETAILS_LIST;

  // Guard: Don't make API call if id is missing
  if (!payload?.id) {
    return;
  }

  // Get pagination details from the store
  const paginationDetails = yield select(getServerSidePaginationDetails);
  const paginationState = selectorWithKey(paginationDetails, key) || {};

  // Use pagination from store or defaults
  const currentPage = paginationState.page ?? 0;
  const currentSize = paginationState.size ?? 10;

  // Always add pagination params to the payload
  const apiPayload = {
    ...payload,
    page: currentPage,
    size: currentSize
  };

  // Call the API
  const { response } = yield call(handleAPIRequest, api.fetchTransferDetailsApi, apiPayload);

  if (response?.data) {
    // Store the full transfer details object for header and other components
    // This maintains backward compatibility with existing selectors
    yield put(
      sliceActions.setTableData({
        tableKey: INVENTORY_KEYS.TRANSFER_DETAILS,
        data: response.data
      })
    );

    // Handle deviceDetails array with pagination
    if (response.data.deviceDetails) {
      const deviceDetails = response.data.deviceDetails;

      // Check if API returns server-side pagination metadata
      const hasServerPagination = response.data.totalElements !== undefined && response.data.totalPages !== undefined;

      const paginatedResponse = {
        ...response,
        data: hasServerPagination
          ? {
              // Use server-side pagination data
              content: deviceDetails,
              totalElements: response.data.totalElements,
              totalPages: response.data.totalPages,
              number: response.data.page,
              size: response.data.size
            }
          : {
              // Fall back to client-side pagination
              content: deviceDetails,
              totalElements: deviceDetails.length,
              totalPages: Math.ceil(deviceDetails.length / currentSize),
              number: currentPage,
              size: currentSize
            }
      };

      // Update pagination state
      yield call(setCommonPaginationResponse, key, paginatedResponse);

      // Set the deviceDetails array to the table
      yield put(
        sliceActions.setTableData({
          tableKey: key,
          data: deviceDetails
        })
      );
    }
  }
}

function* fetchMspRequestDetails(action) {
  const {
    payload: { key, ...payload }
  } = action;

  // Guard: Don't make API call if id is missing
  if (!payload?.id) {
    return;
  }

  // Get pagination details from the store
  const paginationDetails = yield select(getServerSidePaginationDetails);
  const paginationState = selectorWithKey(paginationDetails, key) || {};

  // Use pagination from store or defaults
  const currentPage = paginationState.page ?? 0;
  const currentSize = paginationState.size ?? 10;

  // Always add pagination params to the payload
  const apiPayload = {
    ...payload,
    page: currentPage,
    size: currentSize
  };

  // Call the API
  const { response } = yield call(handleAPIRequest, api.fetchMspRequestDetailsApi, apiPayload);

  if (response?.data) {
    // Store the full response data for header and other components
    yield put(
      sliceActions.setTableData({
        tableKey: INVENTORY_KEYS.TRANSFER_DETAILS,
        data: response.data
      })
    );

    // The API already returns paginated data with devices array
    // Transform it to the expected format with content property
    if (response.data.devices) {
      const paginatedResponse = {
        ...response,
        data: {
          content: response.data.devices,
          totalElements: response.data.totalElements,
          totalPages: response.data.totalPages,
          number: response.data.page,
          size: response.data.size
        }
      };

      // Update pagination state
      yield call(setCommonPaginationResponse, key, paginatedResponse);

      // Set the devices array to the table
      yield put(
        sliceActions.setTableData({
          tableKey: key,
          data: response.data.devices
        })
      );
    }
  }
}

function* approveDeviceRequest(action) {
  const { onSuccess, id, ...payload } = action.payload;
  const isSuccess = yield* createSaga(payload, api.approveDeviceRequestApi, API_ACTION_TYPES.APPROVE_DEVICE_REQUEST);
  if (isSuccess) {
    if (onSuccess) onSuccess();
    yield* fetchMspRequestDetails({ payload: { id } });
  }
}

function* updateTransferStatus(action) {
  const onSuccess = yield* createSaga(
    action.payload,
    api.updateTransferStatusApi,
    API_ACTION_TYPES.UPDATE_TRANSFER_STATUS
  );
  if (onSuccess) {
    yield* fetchTransferDetails({ payload: { id: action.payload.transferId } });
  }
}

function* acknowledgeDeviceTransfer(action) {
  const onSuccess = yield* createSaga(
    action.payload,
    api.acknowledgeDeviceTransferApi,
    API_ACTION_TYPES.ACKNOWLEDGE_DEVICE_TRANSFER
  );
  if (onSuccess) {
    yield* fetchTransferDetails({ payload: { id: action.payload.transferId } });
  }
}

function* createDeviceRequests(action) {
  const { onSuccess, ...payload } = action.payload;
  const isSuccess = yield* createSaga(payload, api.createDeviceRequestsApi, API_ACTION_TYPES.CREATE_DEVICE_REQUESTS);
  if (isSuccess && onSuccess) {
    onSuccess();
    yield* fetchDeviceRequestsList({ payload: {} });
  }
}

function* acknowledgeDeviceRequest(action) {
  const onSuccess = yield* createSaga(
    action.payload,
    api.acknowledgeDeviceRequestApi,
    API_ACTION_TYPES.ACKNOWLEDGE_DEVICE_REQUEST
  );
  if (onSuccess) {
    yield* fetchMspRequestDetails({ payload: { id: action.payload.mspLnpRequestId } });
  }
}

function* fetchDeviceRequestsList(action) {
  const { payload } = action;
  yield* listSaga(
    { ...action, payload: { ...payload, key: INVENTORY_KEYS.DEVICE_REQUESTS_LIST } },
    api.fetchDeviceRequestsListApi,
    API_ACTION_TYPES.FETCH_DEVICE_REQUESTS_LIST
  );
}

function* fetchStockTypeCount(action) {
  const { payload } = action;
  yield call(handleAPIRequest, api.fetchStockTypeCountApi, payload);
}

function* fetchDeviceTypeCategory() {
  yield call(handleAPIRequest, api.fetchDeviceTypeCategoryApi);
}

function* fetchLnpRequests(action) {
  const { payload } = action;
  yield* listSaga(
    { ...action, payload: { ...payload, key: INVENTORY_KEYS.LNP_REQUESTS_LIST } },
    api.fetchLnpRequestsApi,
    API_ACTION_TYPES.FETCH_LNP_REQUESTS
  );
}

function* fetchCategoryCount(action) {
  const { payload } = action;
  yield call(handleAPIRequest, api.fetchCategoryCountApi, payload);
}

function* fetchInventoryDetailsList(action) {
  yield* commonListSaga(
    { ...action.payload, key: INVENTORY_KEYS.INVENTORY_DETAILS_LIST },
    api.fetchDeviceDetailsByCategoryApi,
    API_ACTION_TYPE_VARIANTS[API_ACTION_TYPES.FETCH_INVENTORY_DETAILS_LIST]
  );
}

function* submitStockRequest(action) {
  const { onSuccess, categoryId, typeName, ...payload } = action.payload;
  const isSuccess = yield* createSaga(payload, api.submitStockRequestApi, API_ACTION_TYPES.SUBMIT_STOCK_REQUEST);
  if (isSuccess) {
    yield* fetchInventoryDetailsList({ payload: { categoryId, typeName } });
    if (onSuccess) onSuccess();
  }
}

function* submitExternalRequest(action) {
  const { onSuccess, ...payload } = action.payload;
  const isSuccess = yield* createSaga(payload, api.submitExternalRequestApi, API_ACTION_TYPES.SUBMIT_EXTERNAL_REQUEST);
  if (isSuccess) {
    yield put({ type: API_ACTION_TYPES.FETCH_LNP_REQUESTS, payload: { requested: true } });
    if (onSuccess) yield call(onSuccess);
  }
}

function* fetchStockDetailsList(action) {
  const { payload } = action;
  yield* listSaga(
    { ...action, payload: { ...payload, key: INVENTORY_KEYS.STOCK_DETAILS_LIST } },
    api.fetchStockDetailsListApi,
    API_ACTION_TYPES.FETCH_STOCK_DETAILS_LIST
  );
}

function* fetchStockByPoNo(action) {
  const { payload: { poNo, onSuccess, ...data } = {} } = action;
  const { response, error } = yield call(handleAPIRequest, api.fetchStockByPoNoApi, { poNo, ...data });
  if (response && !error) {
    const stockData = response?.data || response;
    yield put(sliceActions.setStockByPoNo({ poNo, data: stockData }));
    if (onSuccess) yield call(onSuccess);
  }
}

function* approveOrRejectStock(action) {
  const { onSuccess, ...payload } = action.payload;
  const isSuccess = yield* createSaga(payload, api.approveOrRejectStockApi, API_ACTION_TYPES.APPROVE_OR_REJECT_STOCK);

  if (isSuccess && onSuccess) {
    yield call(onSuccess);
  }
}

function* fetchMyStockList(action) {
  const { payload } = action;
  yield* listSaga(
    { ...action, payload: { ...payload, key: INVENTORY_KEYS.MY_STOCK_LIST } },
    api.fetchMyStockListApi,
    API_ACTION_TYPES.FETCH_MY_STOCK_LIST
  );
}

function* fetchTransferredStockList(action) {
  const { payload } = action;
  yield* listSaga(
    { ...action, payload: { ...payload, key: INVENTORY_KEYS.TRANSFERRED_STOCK_LIST } },
    api.fetchTransferredStockListApi,
    API_ACTION_TYPES.FETCH_TRANSFERRED_STOCK_LIST
  );
}

function* submitStockReceive(action) {
  const onSuccess = yield* createSaga(action.payload, api.submitStockReceiveApi, API_ACTION_TYPES.SUBMIT_STOCK_RECEIVE);
  if (onSuccess) {
    yield put(sliceActions.setTableData({ tableKey: INVENTORY_KEYS.TRANSFERRED_STOCK_LIST, data: [] }));
    yield* fetchTransferredStockList({ payload: {} });
  }
}

function* submitRecallDevice(action) {
  const onSuccess = yield* createSaga(action.payload, api.submitRecallDeviceApi, API_ACTION_TYPES.SUBMIT_RECALL_DEVICE);
  if (onSuccess) {
    yield put(sliceActions.setTableData({ tableKey: INVENTORY_KEYS.TRANSFERRED_STOCK_LIST, data: [] }));
    yield* fetchTransferredStockList({ payload: {} });
  }
}

function* fetchSearchDevice(action) {
  const { payload } = action;
  yield call(handleAPIRequest, api.fetchSearchDeviceApi, payload);
}

function* submitMapDevice(action) {
  const onSuccess = yield* createSaga(action.payload, api.submitMapDeviceApi, API_ACTION_TYPES.SUBMIT_MAP_DEVICE);
  if (onSuccess) {
    yield* fetchMyStockList({ payload: { key: INVENTORY_KEYS.MY_STOCK_LIST } });
  }
}

function* submitUnmapDevice(action) {
  const onSuccess = yield* createSaga(action.payload, api.submitUnmapDeviceApi, API_ACTION_TYPES.SUBMIT_UNMAP_DEVICE);
  if (onSuccess) {
    yield* fetchMyStockList({ payload: { key: INVENTORY_KEYS.MY_STOCK_LIST } });
  }
}

function* fetchStockTrack(action) {
  yield call(handleAPIRequest, api.fetchStockTrackApi, {
    ...action.payload,
    progressKey: API_ACTION_TYPES.FETCH_STOCK_TRACK
  });
}

function* fetchDeviceMappedValues(action) {
  yield call(handleAPIRequest, api.fetchDeviceMappedValuesApi, action.payload);
}

function* fetchPopNameDropdown(action) {
  yield call(handleAPIRequest, api.fetchPopNameDropdownApi, action.payload);
}

function* fetchReplaceDeviceCondition() {
  yield call(handleAPIRequest, api.fetchReplaceDeviceConditionApi);
}

function* fetchDeviceConditionDropdown() {
  yield call(handleAPIRequest, api.fetchDeviceConditionDropdownApi);
}

function* fetchInventoryDetailsById(action) {
  const { payload } = action;
  yield call(handleAPIRequest, api.fetchInventoryDetailsByIdApi, payload);
}

function* downloadOemHandoverPdf(action) {
  yield call(handleAPIRequest, api.downloadOemHandoverPdfApi, action.payload);
}

function* submitReplaceDevice(action) {
  const onSuccess = yield* createSaga(
    action.payload,
    api.submitReplaceDeviceApi,
    API_ACTION_TYPES.SUBMIT_REPLACE_DEVICE
  );
  if (onSuccess) {
    yield* fetchMyStockList({ payload: { key: INVENTORY_KEYS.MY_STOCK_LIST } });
  }
}

function* submitUpdateDeviceDetails(action) {
  const onSuccess = yield* createSaga(
    action.payload,
    api.submitReplaceDeviceApi,
    API_ACTION_TYPES.SUBMIT_UPDATE_DEVICE_DETAILS
  );
  if (onSuccess) {
    yield* fetchMyStockList({ payload: { key: INVENTORY_KEYS.MY_STOCK_LIST } });
  }
}

function* fetchDeviceTypeFields() {
  yield call(handleAPIRequest, api.fetchDeviceTypeFieldsApi);
}

function* saveDeviceTypeFields({ payload }) {
  yield call(handleAPIRequest, api.saveDeviceTypeFieldsApi, payload);
}

export default function* inventorySaga() {
  yield all([
    takeLatest(API_ACTION_TYPES.FETCH_DEVICE_LIST, fetchDeviceList),
    takeLatest(API_ACTION_TYPES.FETCH_SEARCH_DEVICE, fetchSearchDevice),
    takeLatest(API_ACTION_TYPES.FETCH_TRANSFER_DEVICE_LIST, fetchTransferDeviceList),
    takeLatest(API_ACTION_TYPES.FETCH_DEVICE_LIST_DASHBOARD, fetchDeviceListDashboard),
    takeLatest(API_ACTION_TYPES.SUBMIT_DEVICE_TRANSFER, submitDeviceTransfer),
    takeLatest(API_ACTION_TYPES.SUBMIT_MY_STOCK_TRANSFER, submitMyStockTransfer),
    takeLatest(API_ACTION_TYPES.SUBMIT_STOCK_TRANSFER, submitStockTransfer),
    takeLatest(API_ACTION_TYPES.SUBMIT_DEVICE_CONDITION_UPDATE, submitDeviceConditionUpdate),
    takeLatest(API_ACTION_TYPES.SUBMIT_RETURN_TO_OEM, submitReturnToOem),
    takeLatest(API_ACTION_TYPES.SUBMIT_BULK_DEVICE_TRANSFER, submitBulkDeviceTransfer),
    takeLatest(API_ACTION_TYPES.SUBMIT_STOCK_RECEIVE, submitStockReceive),
    takeLatest(API_ACTION_TYPES.CREATE_DEVICE, createDevice),
    takeLatest(API_ACTION_TYPES.DOWNLOAD_DEVICE_LIST_CSV, downloadDeviceListCsv),

    takeLatest(API_ACTION_TYPES.FETCH_DEVICE_TYPE_LIST, fetchDeviceTypeList),
    takeLatest(API_ACTION_TYPES.FETCH_DEVICE_TYPE_DROPDOWN, fetchDeviceTypeListDropdown),
    takeLatest(API_ACTION_TYPES.CREATE_DEVICE_TYPE, createDeviceType),

    takeLatest(API_ACTION_TYPES.FETCH_DEVICE_MAKE_LIST, fetchDeviceMakeList),
    takeLatest(API_ACTION_TYPES.FETCH_DEVICE_MAKE_DROPDOWN, fetchDeviceMakeListDropdown),
    takeLatest(API_ACTION_TYPES.CREATE_DEVICE_MAKE, createDeviceMake),

    takeLatest(API_ACTION_TYPES.FETCH_DEVICE_CATEGORY_LIST, fetchDeviceCategoryList),
    takeLatest(API_ACTION_TYPES.FETCH_DEVICE_CATEGORY_DROPDOWN, fetchDeviceCategoryListDropdown),
    takeLatest(API_ACTION_TYPES.CREATE_DEVICE_CATEGORY, createDeviceCategory),

    takeLatest(API_ACTION_TYPES.FETCH_DEVICE_MODEL_LIST, fetchDeviceModelList),
    takeLatest(API_ACTION_TYPES.FETCH_DEVICE_MODEL_DROPDOWN, fetchDeviceModelListDropdown),
    takeLatest(API_ACTION_TYPES.FETCH_DEVICE_MODEL_DETAILS, fetchDeviceModelDetails),
    takeLatest(API_ACTION_TYPES.CREATE_DEVICE_MODEL, createDeviceModel),
    takeLatest(API_ACTION_TYPES.DOWNLOAD_DEVICE_MODEL_CSV, downloadDeviceModelCsv),

    takeLatest(API_ACTION_TYPES.FETCH_DEVICE_VENDOR_LIST, fetchDeviceVendorList),
    takeLatest(API_ACTION_TYPES.FETCH_DEVICE_VENDOR_DROPDOWN, fetchDeviceVendorListDropdown),
    takeLatest(API_ACTION_TYPES.FETCH_DEVICE_VENDOR_DETAILS, fetchDeviceVendorDetails),
    takeLatest(API_ACTION_TYPES.CREATE_DEVICE_VENDOR, createDeviceVendor),
    takeLatest(API_ACTION_TYPES.UPDATE_DEVICE_VENDOR, updateDeviceVendor),

    takeLatest(API_ACTION_TYPES.FETCH_ASSET_TYPE_DROPDOWN, fetchAssetTypesDropdown),
    takeLatest(API_ACTION_TYPES.FETCH_USER_BY_ROLE, fetchUserByRole),
    takeLatest(API_ACTION_TYPES.DOWNLOAD_SAMPLE_DEVICE_CSV, downloadSampleDeviceCSV),
    takeLatest(API_ACTION_TYPES.FETCH_TRANSFER_DETAILS, fetchTransferDetails),
    takeLatest(API_ACTION_TYPES.FETCH_MSP_REQUEST_DETAILS, fetchMspRequestDetails),
    takeLatest(API_ACTION_TYPES.APPROVE_DEVICE_REQUEST, approveDeviceRequest),
    takeLatest(API_ACTION_TYPES.FETCH_TRANSFER_DETAILS_LIST, fetchTransferDetailsList),
    takeLatest(API_ACTION_TYPES.UPDATE_TRANSFER_STATUS, updateTransferStatus),
    takeLatest(API_ACTION_TYPES.ACKNOWLEDGE_DEVICE_TRANSFER, acknowledgeDeviceTransfer),
    takeLatest(API_ACTION_TYPES.FETCH_DEVICE_REQUESTS_LIST, fetchDeviceRequestsList),
    takeLatest(API_ACTION_TYPES.CREATE_DEVICE_REQUESTS, createDeviceRequests),
    takeLatest(API_ACTION_TYPES.ACKNOWLEDGE_DEVICE_REQUEST, acknowledgeDeviceRequest),
    takeLatest(API_ACTION_TYPES.FETCH_STOCK_TYPE_COUNT, fetchStockTypeCount),
    takeLatest(API_ACTION_TYPES.FETCH_MY_STOCK_LIST, fetchMyStockList),
    takeLatest(API_ACTION_TYPES.FETCH_TRANSFERRED_STOCK_LIST, fetchTransferredStockList),
    takeLatest(API_ACTION_TYPES.FETCH_STOCK_DETAILS_LIST, fetchStockDetailsList),
    takeLatest(API_ACTION_TYPES.APPROVE_OR_REJECT_STOCK, approveOrRejectStock),
    takeLatest(API_ACTION_TYPES.FETCH_STOCK_BY_PONO, fetchStockByPoNo),
    takeLatest(API_ACTION_TYPES.FETCH_CATEGORY_COUNT, fetchCategoryCount),
    takeLatest(API_ACTION_TYPES.FETCH_DEVICE_TYPE_FIELDS, fetchDeviceTypeFields),
    takeLatest(API_ACTION_TYPES.SAVE_DEVICE_TYPE_FIELDS, saveDeviceTypeFields),
    takeLatest(API_ACTION_TYPES.FETCH_INVENTORY_DETAILS_LIST, fetchInventoryDetailsList),
    takeLatest(API_ACTION_TYPES.SUBMIT_STOCK_REQUEST, submitStockRequest),
    takeLatest(API_ACTION_TYPES.SUBMIT_MAP_DEVICE, submitMapDevice),
    takeLatest(API_ACTION_TYPES.SUBMIT_UNMAP_DEVICE, submitUnmapDevice),
    takeLatest(API_ACTION_TYPES.FETCH_STOCK_TRACK, fetchStockTrack),
    takeLatest(API_ACTION_TYPES.SUBMIT_RECALL_DEVICE, submitRecallDevice),
    takeLatest(API_ACTION_TYPES.FETCH_ALL_ROLES, fetchAllRoles),
    takeLatest(API_ACTION_TYPES.FETCH_USERS_BY_ROLE_ID, fetchUsersByRoleId),
    takeLatest(API_ACTION_TYPES.FETCH_DEVICE_MAPPED_VALUES, fetchDeviceMappedValues),
    takeLatest(API_ACTION_TYPES.FETCH_POP_NAME_DROPDOWN, fetchPopNameDropdown),
    takeLatest(API_ACTION_TYPES.FETCH_REPLACE_DEVICE_CONDITION, fetchReplaceDeviceCondition),
    takeLatest(API_ACTION_TYPES.SUBMIT_REPLACE_DEVICE, submitReplaceDevice),
    takeLatest(API_ACTION_TYPES.SUBMIT_UPDATE_DEVICE_DETAILS, submitUpdateDeviceDetails),
    takeLatest(API_ACTION_TYPES.FETCH_OEM_REQUEST_LIST, fetchOemRequestList),
    takeLatest(API_ACTION_TYPES.SUBMIT_OEM_REMARK, submitOemRemark),
    takeLatest(API_ACTION_TYPES.SUBMIT_OEM_FORWARD, submitOemForward),
    takeLatest(API_ACTION_TYPES.FETCH_STOCK_STATUS_DROPDOWN, fetchStockStatusDropdown),
    takeLatest(API_ACTION_TYPES.FETCH_DEVICE_CONDITION_DROPDOWN, fetchDeviceConditionDropdown),
    takeLatest(API_ACTION_TYPES.FETCH_INVENTORY_DETAILS_BY_ID, fetchInventoryDetailsById),
    takeLatest(API_ACTION_TYPES.DOWNLOAD_OEM_HANDOVER_PDF, downloadOemHandoverPdf),
    takeLatest(API_ACTION_TYPES.SUBMIT_EXTERNAL_REQUEST, submitExternalRequest),
    takeLatest(API_ACTION_TYPES.FETCH_DEVICE_TYPE_CATEGORY, fetchDeviceTypeCategory),
    takeLatest(API_ACTION_TYPES.FETCH_LNP_REQUESTS, fetchLnpRequests)
  ]);
}
