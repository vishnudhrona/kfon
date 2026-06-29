import { t } from 'i18next';
import { has, isEmpty } from 'lodash-es';
import { all, call, fork, put, select, take, takeEvery, takeLatest } from 'redux-saga/effects';

import { errorToast, successToast } from '@/components/custom/Toast';
import { actions as apiProgressActions } from '@/features/others/ApiProgress/slice';
import { getCommonFilterDetails, setCommonPaginationResponse } from '@/features/others/Pagination/saga';
import { getServerSidePaginationDetails } from '@/features/others/Pagination/selectors';
import { selectorWithKey } from '@/utils/commonUtils';
import { handleAPIRequest } from '@/utils/httpUtils';
import { commonListSaga } from '@/utils/sagaUtils';

import {
  API_ACTION_TYPE_VARIANTS,
  API_ACTION_TYPES,
  fetchDispositionHistoryList,
  fetchEnquiryCardData,
  fetchEnquirySummary,
  fetchMeetingList,
  fetchOntDevices as fetchOntDevicesAction,
  fetchSubscriberDetail
} from './actions';
import * as api from './api';
import { DROPDOWN_KEYS, ENQUIRY_TABLE_KEY, PACKAGE_LIST_TABLE_KEY, SUBSCRIBERS_LIST_TABLE_KEY } from './constants';
import { actions as sliceActions } from './slice';

// Generic saga for form submission
function* submitSaga(payload, apiFn, actionType, successMessage) {
  yield fork(handleAPIRequest, apiFn, payload);

  const { payload: { message = '', data } = {}, type } = yield take([
    API_ACTION_TYPE_VARIANTS[actionType][1],
    API_ACTION_TYPE_VARIANTS[actionType][2]
  ]);

  if (type === API_ACTION_TYPE_VARIANTS[actionType][1]) {
    yield call(successToast, {
      title: t('success'),
      description: message || successMessage || t('saveSuccess')
    });
    return { success: true, data };
  }
  return { success: false };
}

// Submit basic details (POST) - returns subscriber ID
function* submitBasicDetailsSaga(action) {
  const { payload } = action;
  const result = yield* submitSaga(
    payload,
    api.submitBasicDetailsApi,
    API_ACTION_TYPES.SUBMIT_BASIC_DETAILS,
    t('basicDetailsSubmittedSuccessfully')
  );

  if (result.success && result.data?.id) {
    yield put(sliceActions.setSubscriberId(result.data.id));
    yield put(sliceActions.markBasicDetailsCompleted());

    // Mark CAF as PARTIAL in sessionStorage so refresh-recovery fetches subscriber data
    try {
      const enquiryData = JSON.parse(sessionStorage.getItem('enquiryData') || 'null');
      if (enquiryData) {
        sessionStorage.setItem('enquiryData', JSON.stringify({ ...enquiryData, enquiryCafStatus: 'PARTIAL' }));
      }
    } catch {
      // ignore
    }

    if (payload.onSuccess && typeof payload.onSuccess === 'function') {
      payload.onSuccess(result.data);
    }
  }
}

// Update basic details (PATCH) — used when subscriber record already exists
function* updateBasicDetailsSaga(action) {
  const { payload } = action;
  const state = yield select((s) => s.applications);
  const subscriberId = state?.subscriberId || state?.prepopulatedData?.basicDetail?.id;

  if (!subscriberId) {
    console.error('No subscriber ID found');
    return;
  }

  const result = yield* submitSaga(
    { id: subscriberId, ...payload },
    api.updateBasicDetailsApi,
    API_ACTION_TYPES.UPDATE_BASIC_DETAILS,
    t('basicDetailsSubmittedSuccessfully')
  );

  if (result.success) {
    yield put(sliceActions.markBasicDetailsCompleted());
    if (payload.onSuccess && typeof payload.onSuccess === 'function') {
      payload.onSuccess(result.data);
    }
  }
}

// Update device details (PATCH)
function* updateDeviceDetailsSaga(action) {
  const { payload } = action;
  const state = yield select((s) => s.applications);
  const subscriberId =
    state?.subscriberId || state?.prepopulatedData?.basicDetail?.id || state?.prepopulatedData?.subscriberDetail?.id;

  if (!subscriberId) {
    console.error('No subscriber ID found');
    return;
  }

  const result = yield* submitSaga(
    { id: subscriberId, ...payload },
    api.updateDeviceDetailsApi,
    API_ACTION_TYPES.UPDATE_DEVICE_DETAILS,
    t('deviceDetailsUpdatedSuccessfully')
  );

  if (result.success && payload.onSuccess && typeof payload.onSuccess === 'function') {
    payload.onSuccess(result.data);
  }
}

// Update subscription details (PATCH)
function* updateSubscriptionDetailsSaga(action) {
  const { payload } = action;
  const state = yield select((s) => s.applications);
  const subscriberId =
    state?.subscriberId || state?.prepopulatedData?.basicDetail?.id || state?.prepopulatedData?.subscriberDetail?.id;

  if (!subscriberId) {
    console.error('No subscriber ID found');
    return;
  }

  const result = yield* submitSaga(
    { id: subscriberId, ...payload },
    api.updateSubscriptionDetailsApi,
    API_ACTION_TYPES.UPDATE_SUBSCRIPTION_DETAILS,
    t('subscriptionDetailsUpdatedSuccessfully')
  );

  if (result.success) {
    const currentState = yield select((s) => s.applications);
    const existing = currentState?.prepopulatedData || {};
    yield put(
      sliceActions.setPrepopulatedData({
        ...existing,
        subscriberDetail: {
          ...(existing.subscriberDetail || {}),
          packageId: payload.packageId,
          packageName: payload.packageName
        }
      })
    );
    yield put(fetchOntDevicesAction({ packageId: payload.packageId, lnpId: '' }));
    if (typeof payload.onSuccess === 'function') payload.onSuccess(result.data);
  }
}

// Update GST information (PATCH) and Upload Files (POST)
function* updateGstInformationSaga(action) {
  const { payload } = action;
  const state = yield select((s) => s.applications);
  const subscriberId =
    state?.subscriberId || state?.prepopulatedData?.basicDetail?.id || state?.prepopulatedData?.subscriberDetail?.id;

  if (!subscriberId) {
    console.error('No subscriber ID found');
    return;
  }

  // Extract files from payload
  const { gstInProofCopy, applicationFormCopy, lut, ...metaData } = payload;

  // 1. Update Metadata
  const result = yield* submitSaga(
    { id: subscriberId, ...metaData },
    api.updateGstInformationApi,
    API_ACTION_TYPES.UPDATE_GST_INFORMATION,
    null // Don't show success toast yet
  );

  if (!result.success) return;

  // 2. Upload Files
  try {
    const uploadTasks = [];
    if (gstInProofCopy) {
      uploadTasks.push(
        call(handleAPIRequest, api.uploadDocumentApi, {
          id: subscriberId,
          type: 'GSTIN_PROOF',
          file: gstInProofCopy
        })
      );
    }
    if (applicationFormCopy) {
      uploadTasks.push(
        call(handleAPIRequest, api.uploadDocumentApi, {
          id: subscriberId,
          type: 'APPLICATION_FORM',
          file: applicationFormCopy
        })
      );
    }
    if (lut) {
      uploadTasks.push(
        call(handleAPIRequest, api.uploadDocumentApi, {
          id: subscriberId,
          type: 'LUT_PROOF',
          file: lut
        })
      );
    }

    if (uploadTasks.length > 0) {
      yield all(uploadTasks);
    }

    yield call(successToast, {
      title: 'success',
      description: t('gstInformationUpdatedSuccessfully')
    });

    if (payload.onSuccess && typeof payload.onSuccess === 'function') {
      payload.onSuccess();
    }
  } catch (error) {
    console.error('GST file upload failed', error);
  }
}

// Update address details (PATCH)
function* updateAddressDetailsSaga(action) {
  const { payload } = action;
  const state = yield select((s) => s.applications);
  const subscriberId =
    state?.subscriberId || state?.prepopulatedData?.basicDetail?.id || state?.prepopulatedData?.subscriberDetail?.id;

  if (!subscriberId) {
    console.error('No subscriber ID found');
    return;
  }

  const result = yield* submitSaga(
    { id: subscriberId, ...payload },
    api.updateAddressDetailsApi,
    API_ACTION_TYPES.UPDATE_ADDRESS_DETAILS,
    t('addressDetailsUpdatedSuccessfully')
  );

  if (result.success) {
    yield put(
      sliceActions.markAddressCompleted({
        isPermanent: payload.isPermanent,
        isDifferentInstallationAddress: payload.isDifferentInstallationAddress
      })
    );
    const currentState = yield select((s) => s.applications);
    const existing = currentState?.prepopulatedData || {};
    const addressKey = payload.isPermanent ? 'permanentAddress' : 'installationAddress';
    // eslint-disable-next-line no-unused-vars
    const { onSuccess, isDifferentInstallationAddress, isPermanent, id, ...addressData } = payload;
    yield put(sliceActions.setPrepopulatedData({ ...existing, [addressKey]: addressData }));
    if (payload.onSuccess && typeof payload.onSuccess === 'function') {
      payload.onSuccess(result.data);
    }
  }
}

// Update supporting documents (PATCH) and Upload Files (POST)
function* updateSupportingDocumentsSaga(action) {
  const { payload } = action;
  const state = yield select((s) => s.applications);
  const subscriberId =
    state?.subscriberId || state?.prepopulatedData?.basicDetail?.id || state?.prepopulatedData?.subscriberDetail?.id;

  if (!subscriberId) {
    console.error('No subscriber ID found');
    return;
  }

  // extract files from payload
  const { applicationFormCopy, addressProofCopy, idProofCopy, ...metaData } = payload;

  // 1. Update Metadata
  const result = yield* submitSaga(
    { id: subscriberId, ...metaData },
    api.updateSupportingDocumentsApi,
    API_ACTION_TYPES.UPDATE_SUPPORTING_DOCUMENTS,
    null // Don't show success toast yet
  );

  if (!result.success) return;

  // 2. Upload Files
  try {
    const uploadTasks = [];
    if (applicationFormCopy) {
      uploadTasks.push(
        call(handleAPIRequest, api.uploadDocumentApi, {
          id: subscriberId,
          type: 'APPLICATION_FORM',
          file: applicationFormCopy
        })
      );
    }
    if (addressProofCopy) {
      uploadTasks.push(
        call(handleAPIRequest, api.uploadDocumentApi, {
          id: subscriberId,
          type: 'RESIDENCE_PROOF',
          file: addressProofCopy
        })
      );
    }
    if (idProofCopy) {
      uploadTasks.push(
        call(handleAPIRequest, api.uploadDocumentApi, {
          id: subscriberId,
          type: 'IDENTITY_PROOF',
          file: idProofCopy
        })
      );
    }

    if (uploadTasks.length > 0) {
      yield all(uploadTasks);
    }

    yield call(successToast, {
      title: 'success',
      description: t('supportingDocumentsUpdatedSuccessfully')
    });

    if (payload.onSuccess && typeof payload.onSuccess === 'function') {
      payload.onSuccess();
    }
  } catch (error) {
    console.error('File upload failed', error);
    // Optional: show error toast or warning
  }
}

function* fetchEnquiryListSaga(action) {
  const {
    payload: { key = ENQUIRY_TABLE_KEY, ...data }
  } = action;
  let payload = data;
  if (key) {
    const paginationDetails = yield select(getServerSidePaginationDetails);
    const { page, size } = selectorWithKey(paginationDetails, key) || {};
    if (page !== undefined && size !== undefined) {
      payload = { page, size, ...payload };
    }
  }
  const { response } = yield call(handleAPIRequest, api.fetchEnquiryListApi, payload);
  if (response) {
    yield call(setCommonPaginationResponse, key, response);
    yield put(
      sliceActions.setTableData({ tableKey: key, data: response?.data?.content || response?.data || response })
    );
  }
}

function* fetchPackageListSaga(action) {
  const {
    payload: { key = PACKAGE_LIST_TABLE_KEY, ...data }
  } = action;
  let payload = data;
  if (key) {
    const paginationDetails = yield select(getServerSidePaginationDetails);
    const { page, size } = selectorWithKey(paginationDetails, key) || {};
    if (page !== undefined && size !== undefined) {
      payload = { page, size, ...payload };
    }
  }
  const { response } = yield call(handleAPIRequest, api.fetchPackageListApi, payload);
  if (response) {
    yield call(setCommonPaginationResponse, key, response);
    yield put(
      sliceActions.setTableData({ tableKey: key, data: response?.data?.content || response?.data || response })
    );
  }
}

// Common saga for fetching dropdown data
function* fetchDropdownDataSaga(key, apiFn) {
  const { response } = yield call(handleAPIRequest, apiFn);
  if (response?.data) {
    yield put(sliceActions.setDropdownData({ key, data: response.data }));
  }
}

export function* fetchDeviceProvider() {
  yield call(fetchDropdownDataSaga, DROPDOWN_KEYS.DEVICE_PROVIDER_LIST, api.fetchDeviceProviderApi);
}

export function* fetchOntDevices({ payload } = {}) {
  yield call(fetchDropdownDataSaga, DROPDOWN_KEYS.DEVICE_LIST, () => api.fetchOntDevicesApi(payload));
}

export function* fetchDeviceType() {
  yield call(fetchDropdownDataSaga, DROPDOWN_KEYS.DEVICE_TYPE_LIST, api.fetchDeviceTypeApi);
}

export function* fetchOltType() {
  yield call(fetchDropdownDataSaga, DROPDOWN_KEYS.OLT_TYPE_LIST, api.fetchOltTypeApi);
}

export function* fetchOltDeviceList() {
  yield call(fetchDropdownDataSaga, DROPDOWN_KEYS.OLT_DEVICE_LIST, api.fetchOltDeviceListApi);
}

export function* fetchAvailablePonPorts(action) {
  const { payload } = action;
  yield call(fetchDropdownDataSaga, DROPDOWN_KEYS.PON_PORT_NUMBER_LIST, () => api.fetchAvailablePonPortsApi(payload));
}

export function* fetchPlanType() {
  yield call(fetchDropdownDataSaga, DROPDOWN_KEYS.PLAN_TYPE_LIST, api.fetchPlanTypeApi);
}

export function* fetchPackageType() {
  yield call(fetchDropdownDataSaga, DROPDOWN_KEYS.PACKAGE_TYPE_LIST, api.fetchPackageTypeApi);
}

export function* fetchEwsPackages() {
  yield call(fetchDropdownDataSaga, DROPDOWN_KEYS.EWS_PACKAGE_LIST, api.fetchEwsPackagesApi);
}

export function* fetchDistributorList() {
  yield call(fetchDropdownDataSaga, DROPDOWN_KEYS.DISTRIBUTOR_LIST, api.fetchDistributorListApi);
}

export function* fetchPartnerList() {
  const { response } = yield call(handleAPIRequest, api.fetchPartnerListApi);
  if (response?.data) {
    // Map LNP users to the { id, name } shape CustomSelect expects
    const data = (response.data || []).map((partner) => ({
      ...partner,
      // Backend will switch to lnpPartnerUuid; fall back to lnpPartnerId until then
      id: partner.lnpPartnerUuid ?? partner.lnpPartnerId,
      name: partner.companyName
    }));
    yield put(sliceActions.setDropdownData({ key: DROPDOWN_KEYS.PARTNER_LIST, data }));
  }
}

export function* fetchDeviceDetailsByIdSaga(action) {
  const { payload } = action;
  const id = typeof payload === 'object' ? payload.id : payload;
  const onSuccess = typeof payload === 'object' ? payload.onSuccess : null;

  const { response } = yield call(handleAPIRequest, api.fetchDeviceDetailsByIdApi, id);

  if (response && onSuccess) {
    onSuccess(response);
  }
}

export function* fetchOntNextPositionSaga(action) {
  const { payload } = action;
  const ponportMappingLnpId = typeof payload === 'object' ? payload.ponportMappingLnpId : payload;
  const onSuccess = typeof payload === 'object' ? payload.onSuccess : null;

  if (onSuccess) {
    yield fork(handleAPIRequest, api.fetchOntNextPositionApi, ponportMappingLnpId);

    const { payload: { data } = {}, type } = yield take([
      API_ACTION_TYPE_VARIANTS[API_ACTION_TYPES.FETCH_ONT_NEXT_POSITION][1],
      API_ACTION_TYPE_VARIANTS[API_ACTION_TYPES.FETCH_ONT_NEXT_POSITION][2]
    ]);

    if (type === API_ACTION_TYPE_VARIANTS[API_ACTION_TYPES.FETCH_ONT_NEXT_POSITION][1]) {
      yield call(onSuccess, data);
    }
  } else {
    yield call(handleAPIRequest, api.fetchOntNextPositionApi, payload);
  }
}

// CSV Download saga
function* downloadEnquiryCSVSaga() {
  const filters = yield call(getCommonFilterDetails, ENQUIRY_TABLE_KEY);
  const params = filters?.status ? { ...filters, status: filters.status.toUpperCase() } : filters;
  yield call(handleAPIRequest, api.downloadEnquiryCSVApi, params);
}

// Create enquiry saga
function* createCustomerEnquirySaga(action) {
  const { payload } = action;
  yield* submitSaga(
    payload,
    api.createCustomerEnquiryApi,
    API_ACTION_TYPES.CREATE_CUSTOMER_ENQUIRY,
    t('enquiryCreatedSuccessfully')
  );
}

// Assign to FE saga
function* assignEnquiryToFESaga(action) {
  const { payload } = action;
  const result = yield* submitSaga(
    payload,
    api.assignEnquiryToFEApi,
    API_ACTION_TYPES.ASSIGN_ENQUIRY_TO_FE,
    t('enquiryAssignedSuccessfully')
  );

  if (result.success) {
    yield put(fetchEnquirySummary({ key: ENQUIRY_TABLE_KEY }));
    yield put(fetchEnquiryCardData());
  }
}

// Assign to LNP saga
function* assignEnquiryToLNPSaga(action) {
  const { payload } = action;
  const result = yield* submitSaga(
    payload,
    api.assignEnquiryToLNPApi,
    API_ACTION_TYPES.ASSIGN_ENQUIRY_TO_LNP,
    t('enquiryAssignedSuccessfully')
  );

  if (result.success) {
    yield put(fetchEnquirySummary({ key: ENQUIRY_TABLE_KEY }));
    yield put(fetchEnquiryCardData());
  }
}

// Save meeting saga
function* saveMeetingSaga(action) {
  const { payload } = action;
  const result = yield* submitSaga(
    payload,
    api.saveMeetingApi,
    API_ACTION_TYPES.SAVE_MEETING,
    t('meetingSavedSuccessfully')
  );

  if (result.success) {
    yield put(fetchEnquirySummary({ key: ENQUIRY_TABLE_KEY }));
    yield put(fetchEnquiryCardData());
    if (payload?.customerEnquiryId) {
      yield put(fetchMeetingList({ customerEnquiryId: payload.customerEnquiryId }));
    }
  }
}

// Fetch meeting list saga
// Reads the data field out of handleAPIRequest's raw response, mirroring invokeApi's
// payload/data/raw extraction. Used by the per-card history sagas so each saga consumes
// its OWN response instead of a shared take() — which broke under concurrent expands.
const extractResponseData = (response) => {
  if (!response) return null;
  if (has(response, 'payload')) return response.payload;
  if (has(response, 'data')) return response.data;
  return response;
};

function* fetchMeetingListSaga(action) {
  const { payload } = action;
  const { customerEnquiryId, onSuccess } = typeof payload === 'object' ? payload : { customerEnquiryId: payload };

  const { response, error } = yield call(handleAPIRequest, api.fetchMeetingListApi, customerEnquiryId);
  if (error) return;

  const data = extractResponseData(response) || [];
  yield put(sliceActions.setMeetingHistory({ enquiryId: customerEnquiryId, data }));
  if (typeof onSuccess === 'function') {
    yield call(onSuccess, data);
  }
}

// Fetch FE list saga
function* fetchFEListSaga(action) {
  const { payload } = action;
  yield fork(handleAPIRequest, api.fetchFEListApi, payload);

  const { type, payload: responsePayload } = yield take([
    API_ACTION_TYPE_VARIANTS[API_ACTION_TYPES.FETCH_FE_LIST][1],
    API_ACTION_TYPE_VARIANTS[API_ACTION_TYPES.FETCH_FE_LIST][2]
  ]);

  if (type === API_ACTION_TYPE_VARIANTS[API_ACTION_TYPES.FETCH_FE_LIST][1]) {
    yield put(sliceActions.setDropdownData({ key: DROPDOWN_KEYS.FE_LIST, data: responsePayload?.data || [] }));
  }
}

// Fetch LNP list saga
function* fetchLNPListSaga(action) {
  const { payload } = action;
  yield fork(handleAPIRequest, api.fetchLNPListApi, payload);

  const { type, payload: responsePayload } = yield take([
    API_ACTION_TYPE_VARIANTS[API_ACTION_TYPES.FETCH_LNP_LIST][1],
    API_ACTION_TYPE_VARIANTS[API_ACTION_TYPES.FETCH_LNP_LIST][2]
  ]);

  if (type === API_ACTION_TYPE_VARIANTS[API_ACTION_TYPES.FETCH_LNP_LIST][1]) {
    yield put(sliceActions.setDropdownData({ key: DROPDOWN_KEYS.LNP_LIST, data: responsePayload?.data || [] }));
  }
}

function* fetchDispositionListSaga() {
  yield call(fetchDropdownDataSaga, DROPDOWN_KEYS.DISPOSITION_LIST, api.fetchDispositionListApi);
}

function* fetchReasonListSaga(action) {
  const { payload: disposition } = action;
  yield call(fetchDropdownDataSaga, DROPDOWN_KEYS.REASON_LIST, () => api.fetchReasonListApi(disposition));
}

function* fetchEnquiryStatusesSaga() {
  yield call(fetchDropdownDataSaga, DROPDOWN_KEYS.ENQUIRY_STATUS_LIST, api.fetchEnquiryStatusesApi);
}

// Submit disposition saga
function* submitDispositionSaga(action) {
  const { payload } = action;
  const result = yield* submitSaga(
    payload,
    api.submitDispositionApi,
    API_ACTION_TYPES.SUBMIT_DISPOSITION,
    t('dispositionSubmittedSuccessfully')
  );

  if (result.success) {
    yield put(fetchEnquirySummary({ key: ENQUIRY_TABLE_KEY }));
    yield put(fetchEnquiryCardData());
    // Refresh disposition history to update the badge real-time
    if (payload.enquiryId) {
      yield put(fetchDispositionHistoryList({ customerEnquiryId: payload.enquiryId }));
    }
  }
}

export function* fetchSubscriberListSaga() {
  yield call(handleAPIRequest, api.fetchSubscriberListApi);
}

function* fetchSubscribersPageSaga(action) {
  const { payload = {} } = action;
  yield commonListSaga(
    payload,
    api.fetchSubscribersPageApi,
    API_ACTION_TYPE_VARIANTS[API_ACTION_TYPES.FETCH_SUBSCRIBERS_PAGE]
  );
}

function* fetchEnquiryCardDataSaga(action) {
  const { payload } = action;
  const data = payload?.status ? { ...payload, status: payload.status.toUpperCase() } : payload;
  yield call(handleAPIRequest, api.fetchEnquiryCardDataApi, data);
}

function* fetchEnquirySummarySaga(action) {
  const { payload = {} } = action;
  const data = payload?.status ? { ...payload, status: payload.status.toUpperCase() } : payload;
  yield commonListSaga(
    data,
    api.fetchEnquirySummaryApi,
    API_ACTION_TYPE_VARIANTS[API_ACTION_TYPES.FETCH_ENQUIRY_SUMMARY]
  );
}

function* fetchEwsEnquiryListSaga(action) {
  const { payload = {} } = action;
  yield commonListSaga(
    payload,
    api.fetchEwsEnquiryListApi,
    API_ACTION_TYPE_VARIANTS[API_ACTION_TYPES.FETCH_EWS_ENQUIRY_LIST]
  );
}

function* fetchDispositionHistoryListSaga(action) {
  const { payload } = action;
  const { customerEnquiryId, onSuccess } = payload;

  const { response, error } = yield call(handleAPIRequest, api.fetchDispositionHistoryListApi, { customerEnquiryId });
  if (error) return;

  const data = extractResponseData(response) || [];
  yield put(sliceActions.setDispositionHistory({ enquiryId: customerEnquiryId, data }));
  if (typeof onSuccess === 'function') {
    yield call(onSuccess, data);
  }
}

function* fetchSubscriberByEnquiryIdSaga(action) {
  const { payload } = action;
  const { enquiryId, onSuccess, onError } = payload;

  yield fork(handleAPIRequest, api.fetchSubscriberByEnquiryIdApi, enquiryId);

  const { payload: { data } = {}, type } = yield take([
    API_ACTION_TYPE_VARIANTS[API_ACTION_TYPES.FETCH_SUBSCRIBER_BY_ENQUIRY_ID][1],
    API_ACTION_TYPE_VARIANTS[API_ACTION_TYPES.FETCH_SUBSCRIBER_BY_ENQUIRY_ID][2]
  ]);

  if (type === API_ACTION_TYPE_VARIANTS[API_ACTION_TYPES.FETCH_SUBSCRIBER_BY_ENQUIRY_ID][1]) {
    if (onSuccess && typeof onSuccess === 'function') {
      yield call(onSuccess, data);
    }
  } else {
    if (onError && typeof onError === 'function') {
      yield call(onError);
    }
  }
}

function* finalizeCafSaga(action) {
  const { payload } = action;
  const { id, enquiryId, onSuccess } = payload;
  const result = yield* submitSaga(
    { id, enquiryId },
    api.finalizeCafApi,
    API_ACTION_TYPES.FINALIZE_CAF,
    t('cafSubmittedSuccessfully')
  );

  if (result.success) {
    if (onSuccess && typeof onSuccess === 'function') {
      yield call(onSuccess, result.data);
    }
  }
}

function* fetchResidenceProofTypesSaga() {
  yield call(fetchDropdownDataSaga, DROPDOWN_KEYS.RESIDENCE_PROOF_TYPE_LIST, api.fetchResidenceProofTypesApi);
}

function* fetchIdentityProofTypesSaga() {
  yield call(fetchDropdownDataSaga, DROPDOWN_KEYS.IDENTITY_PROOF_TYPE_LIST, api.fetchIdentityProofTypesApi);
}

function* uploadSingleDocumentSaga(action) {
  const { fieldName, type, file, subscriberId: payloadSubscriberId, onSuccess, onError } = action?.payload || {};
  const progressKey = `${API_ACTION_TYPES.UPLOAD_SINGLE_DOCUMENT}_${fieldName}`;

  try {
    const subscriberId = payloadSubscriberId || (yield select((state) => state.applications?.subscriberId));

    if (!subscriberId || !file) return;

    yield put(apiProgressActions.setProgress({ key: progressKey, isLoading: true }));

    const { response, error } = yield call(handleAPIRequest, api.uploadSingleDocumentApi, {
      id: subscriberId,
      type,
      file
    });

    if (!error && response && isEmpty(response?.error)) {
      yield call(successToast, { title: 'success', description: response?.message || t('fileUploadedSuccess') });
      const appState = yield select((s) => s.applications);
      const enquiryId =
        appState?.prepopulatedData?.basicDetail?.appliedOnlineEnqId || sessionStorage.getItem('appliedOnlineEnqId');
      if (enquiryId) {
        yield call(fetchSubscriberByEnquiryIdSaga, { payload: { enquiryId } });
      }
      if (onSuccess) onSuccess(fieldName, response);
    } else {
      const errorMsg = error?.message || response?.error?.message || t('fileUploadFailed');
      yield call(errorToast, { description: errorMsg });
      if (onError) onError(fieldName);
    }
  } catch (error) {
    yield call(errorToast, { description: t('fileUploadFailed') });
    if (onError) onError(fieldName);
    console.log(error);
  } finally {
    yield put(apiProgressActions.setProgress({ key: progressKey, isLoading: false }));
  }
}

function* checkFeasibilitySaga(action) {
  const { payload } = action;
  const { latitude, longitude, onSuccess } = payload;

  yield put(sliceActions.setFeasibilityLoading(true));
  yield put(sliceActions.setFeasibilityData(null));

  yield fork(handleAPIRequest, api.checkFeasibilityApi, { latitude, longitude });

  const { type, payload: responsePayload } = yield take([
    API_ACTION_TYPE_VARIANTS[API_ACTION_TYPES.CHECK_FEASIBILITY][1],
    API_ACTION_TYPE_VARIANTS[API_ACTION_TYPES.CHECK_FEASIBILITY][2]
  ]);

  if (type === API_ACTION_TYPE_VARIANTS[API_ACTION_TYPES.CHECK_FEASIBILITY][1]) {
    const data = responsePayload?.data || responsePayload;
    yield put(sliceActions.setFeasibilityData({ ...data, selectedLocation: { latitude, longitude } }));
    if (onSuccess && typeof onSuccess === 'function') {
      yield call(onSuccess, data);
    }
  }

  yield put(sliceActions.setFeasibilityLoading(false));
}

function* getOntAcknowledgementSaga(action) {
  const { payload } = action;
  const { id, onSuccess } = payload;
  yield fork(handleAPIRequest, api.getOntAcknowledgementApi, { id });

  const { payload: responsePayload, type } = yield take([
    API_ACTION_TYPE_VARIANTS[API_ACTION_TYPES.GET_ONT_ACKNOWLEDGEMENT][1],
    API_ACTION_TYPE_VARIANTS[API_ACTION_TYPES.GET_ONT_ACKNOWLEDGEMENT][2]
  ]);

  if (type === API_ACTION_TYPE_VARIANTS[API_ACTION_TYPES.GET_ONT_ACKNOWLEDGEMENT][2]) {
    return;
  }

  yield call(successToast, { title: 'success', description: responsePayload?.message || t('otpSentSuccessfully') });
  if (onSuccess && typeof onSuccess === 'function') {
    yield call(onSuccess, responsePayload?.data);
  }
}

function* verifyOntAcknowledgementSaga(action) {
  const { payload } = action;
  const { id, otp, otpRefId, onSuccess } = payload;
  const result = yield* submitSaga(
    { id, otp, otpRefId },
    api.verifyOntAcknowledgementApi,
    API_ACTION_TYPES.VERIFY_ONT_ACKNOWLEDGEMENT,
    t('ontAcknowledgementVerifiedSuccessfully')
  );
  if (result.success && onSuccess && typeof onSuccess === 'function') {
    yield call(onSuccess, result.data);
  }
}

function* verifySubscriberSaga(action) {
  const { payload } = action;
  const { id, isApproved, reasonForRejection, onSuccess } = payload;
  const message = isApproved ? t('subscriberVerifiedSuccessfully') : t('subscriberRejectedSuccessfully');
  const result = yield* submitSaga(
    { id, isApproved, reasonForRejection },
    api.verifySubscriberApi,
    API_ACTION_TYPES.VERIFY_SUBSCRIBER,
    message
  );
  if (result.success && onSuccess && typeof onSuccess === 'function') {
    yield call(onSuccess, result.data);
  }
}

function* onboardSubscriberSaga(action) {
  const { payload } = action;
  const { id, onSuccess } = payload;
  const result = yield* submitSaga(
    { id },
    api.onboardSubscriberApi,
    API_ACTION_TYPES.ONBOARD_SUBSCRIBER,
    t('subscriberOnboardedSuccessfully')
  );
  if (result.success && onSuccess && typeof onSuccess === 'function') {
    yield call(onSuccess, result.data);
  }
}

function* updateEkycDetailsSaga(action) {
  const { payload } = action;
  const { id, ...data } = payload;
  yield* submitSaga(
    { id, ...data },
    api.updateEkycDetailsApi,
    API_ACTION_TYPES.UPDATE_EKYC_DETAILS,
    t('ekycDetailsSubmittedSuccessfully')
  );
}

function* submitEkycDetailsSaga(action) {
  const { payload } = action;
  const { onSuccess, clientId, aadharNumber, mobileNumber, email, status, ...putData } = payload;

  const postResult = yield* submitSaga(
    { clientId, aadharNumber, mobileNumber, email, status },
    api.submitEkycDetailsApi,
    API_ACTION_TYPES.SUBMIT_EKYC_DETAILS
  );

  if (!postResult.success) return;

  const ekycId = postResult.data?.ekycId;

  const putResult = yield* submitSaga(
    { id: ekycId, mobileNumber, ...putData },
    api.updateEkycDetailsApi,
    API_ACTION_TYPES.UPDATE_EKYC_DETAILS,
    t('ekycDetailsSubmittedSuccessfully')
  );

  if (putResult.success) {
    try {
      const enquiryData = JSON.parse(sessionStorage.getItem('enquiryData') || 'null');
      if (enquiryData) {
        sessionStorage.setItem('enquiryData', JSON.stringify({ ...enquiryData, enquiryCafStatus: 'PARTIAL' }));
      }
    } catch {
      // ignore
    }
    if (onSuccess) onSuccess();
  }
}

function* fetchSubscriberForwardUsersSaga() {
  yield fork(handleAPIRequest, api.fetchSubscriberForwardUsersApi);
}

function* assignSubscriberEnquirySaga(action) {
  const { payload } = action;
  const { onSuccess, forwardType, ...data } = payload || {};
  const result = yield* submitSaga(
    data,
    api.assignSubscriberEnquiryApi,
    API_ACTION_TYPES.ASSIGN_SUBSCRIBER_ENQUIRY,
    t('enquiryAssignedSuccessfully')
  );
  if (result.success) {
    yield put(fetchEnquirySummary({ key: ENQUIRY_TABLE_KEY, forwardType }));
    yield put(fetchEnquiryCardData());
    if (onSuccess) onSuccess();
  }
}

// --- Subscriber list/details actions (TEMP — wired to placeholder endpoints) ---

// Fetch a single subscriber's detail by id (populates slice; optional onSuccess)
function* fetchSubscriberDetailSaga(action) {
  const { payload } = action;
  const id = typeof payload === 'object' ? payload.id : payload;
  const onSuccess = typeof payload === 'object' ? payload.onSuccess : null;

  const { response } = yield call(handleAPIRequest, api.fetchSubscriberDetailApi, id);
  if (response && onSuccess && typeof onSuccess === 'function') {
    yield call(onSuccess, response);
  }
}

function* fetchSubscriberDataUsageSaga(action) {
  const { payload } = action;
  const id = typeof payload === 'object' ? payload.id : payload;
  yield call(handleAPIRequest, api.fetchSubscriberDataUsageApi, id);
}

function* fetchRadiusDetailsSaga(action) {
  const { payload } = action;
  const username = typeof payload === 'object' ? payload.username : payload;
  yield call(handleAPIRequest, api.fetchRadiusDetailsApi, username);
}

// Save edited subscriber detail; refresh detail on success
function* updateSubscriberDetailSaga(action) {
  const { payload } = action;
  const { onSuccess, ...data } = payload || {};
  const result = yield* submitSaga(
    data,
    api.updateSubscriberDetailApi,
    API_ACTION_TYPES.UPDATE_SUBSCRIBER_DETAIL,
    t('subscriberUpdatedSuccessfully')
  );
  if (result.success) {
    if (data.id) yield put(fetchSubscriberDetail(data.id));
    if (onSuccess && typeof onSuccess === 'function') yield call(onSuccess, result.data);
  }
}

// Send OTP to the NEW mobile number; returns otpRefId via onSuccess
function* sendMobileChangeOtpSaga(action) {
  const { payload } = action;
  const { id, newMobile, onSuccess } = payload;
  yield fork(handleAPIRequest, api.sendMobileChangeOtpApi, { id, newMobile });

  const { payload: responsePayload, type } = yield take([
    API_ACTION_TYPE_VARIANTS[API_ACTION_TYPES.SEND_MOBILE_CHANGE_OTP][1],
    API_ACTION_TYPE_VARIANTS[API_ACTION_TYPES.SEND_MOBILE_CHANGE_OTP][2]
  ]);

  if (type === API_ACTION_TYPE_VARIANTS[API_ACTION_TYPES.SEND_MOBILE_CHANGE_OTP][2]) {
    return;
  }

  yield call(successToast, { title: 'success', description: responsePayload?.message || t('otpSentSuccessfully') });
  if (onSuccess && typeof onSuccess === 'function') {
    yield call(onSuccess, responsePayload?.data);
  }
}

// Verify OTP for the mobile change
function* verifyMobileChangeOtpSaga(action) {
  const { payload } = action;
  const { id, otp, otpRefId, onSuccess } = payload;
  const result = yield* submitSaga(
    { id, otp, otpRefId },
    api.verifyMobileChangeOtpApi,
    API_ACTION_TYPES.VERIFY_MOBILE_CHANGE_OTP,
    t('mobileNumberVerifiedSuccessfully')
  );
  if (result.success && onSuccess && typeof onSuccess === 'function') {
    yield call(onSuccess, result.data);
  }
}

// Reset subscriber password (confirmation handled in UI)
function* resetSubscriberPasswordSaga(action) {
  const { payload } = action;
  const { id, onSuccess } = payload;
  const result = yield* submitSaga(
    { id },
    api.resetSubscriberPasswordApi,
    API_ACTION_TYPES.RESET_SUBSCRIBER_PASSWORD,
    t('passwordResetSuccessfully')
  );
  if (result.success && onSuccess && typeof onSuccess === 'function') {
    yield call(onSuccess, result.data);
  }
}

// Change subscriber username; refresh detail on success
function* changeUsernameSaga(action) {
  const { payload } = action;
  const { id, username, onSuccess } = payload;
  const result = yield* submitSaga(
    { id, username },
    api.changeUsernameApi,
    API_ACTION_TYPES.CHANGE_USERNAME,
    t('usernameChangedSuccessfully')
  );
  if (result.success) {
    if (id) yield put(fetchSubscriberDetail(id));
    if (onSuccess && typeof onSuccess === 'function') yield call(onSuccess, result.data);
  }
}

// CSV export of the current filtered subscriber list
function* downloadSubscribersCsvSaga() {
  const filters = yield call(getCommonFilterDetails, SUBSCRIBERS_LIST_TABLE_KEY);
  yield call(handleAPIRequest, api.downloadSubscribersCsvApi, filters);
}

export default function* applicationsSaga() {
  yield all([
    takeLatest(API_ACTION_TYPES.FETCH_ENQUIRY_LIST, fetchEnquiryListSaga),
    takeLatest(API_ACTION_TYPES.SUBMIT_BASIC_DETAILS, submitBasicDetailsSaga),
    takeLatest(API_ACTION_TYPES.UPDATE_BASIC_DETAILS, updateBasicDetailsSaga),
    takeLatest(API_ACTION_TYPES.UPDATE_SUBSCRIPTION_DETAILS, updateSubscriptionDetailsSaga),
    takeLatest(API_ACTION_TYPES.UPDATE_DEVICE_DETAILS, updateDeviceDetailsSaga),
    takeLatest(API_ACTION_TYPES.UPDATE_GST_INFORMATION, updateGstInformationSaga),
    takeLatest(API_ACTION_TYPES.UPDATE_ADDRESS_DETAILS, updateAddressDetailsSaga),
    takeLatest(API_ACTION_TYPES.UPDATE_SUPPORTING_DOCUMENTS, updateSupportingDocumentsSaga),
    takeLatest(API_ACTION_TYPES.FETCH_DEVICE_PROVIDER, fetchDeviceProvider),
    takeLatest(API_ACTION_TYPES.FETCH_ONT_DEVICES, fetchOntDevices),
    takeLatest(API_ACTION_TYPES.FETCH_DEVICE_TYPE, fetchDeviceType),
    takeLatest(API_ACTION_TYPES.FETCH_OLT_TYPE, fetchOltType),
    takeLatest(API_ACTION_TYPES.FETCH_OLT_DEVICE_LIST, fetchOltDeviceList),
    takeLatest(API_ACTION_TYPES.FETCH_AVAILABLE_PON_PORTS, fetchAvailablePonPorts),
    takeLatest(API_ACTION_TYPES.FETCH_PLAN_TYPE, fetchPlanType),
    takeLatest(API_ACTION_TYPES.FETCH_PACKAGE_TYPE, fetchPackageType),
    takeLatest(API_ACTION_TYPES.FETCH_PACKAGE_LIST, fetchPackageListSaga),
    takeLatest(API_ACTION_TYPES.FETCH_DISTRIBUTOR_LIST, fetchDistributorList),
    takeLatest(API_ACTION_TYPES.FETCH_PARTNER_LIST, fetchPartnerList),
    takeLatest(API_ACTION_TYPES.FETCH_DEVICE_DETAILS_BY_ID, fetchDeviceDetailsByIdSaga),
    takeLatest(API_ACTION_TYPES.FETCH_ENQUIRY_CARD_DATA, fetchEnquiryCardDataSaga),
    takeLatest(API_ACTION_TYPES.FETCH_ENQUIRY_SUMMARY, fetchEnquirySummarySaga),
    takeLatest(API_ACTION_TYPES.CREATE_CUSTOMER_ENQUIRY, createCustomerEnquirySaga),
    takeLatest(API_ACTION_TYPES.DOWNLOAD_ENQUIRY_CSV, downloadEnquiryCSVSaga),
    takeLatest(API_ACTION_TYPES.ASSIGN_ENQUIRY_TO_FE, assignEnquiryToFESaga),
    takeLatest(API_ACTION_TYPES.ASSIGN_ENQUIRY_TO_LNP, assignEnquiryToLNPSaga),
    takeLatest(API_ACTION_TYPES.SAVE_MEETING, saveMeetingSaga),
    takeEvery(API_ACTION_TYPES.FETCH_MEETING_LIST, fetchMeetingListSaga),
    takeLatest(API_ACTION_TYPES.FETCH_SUBSCRIBER_LIST, fetchSubscriberListSaga),
    takeLatest(API_ACTION_TYPES.SUBMIT_DISPOSITION, submitDispositionSaga),
    takeLatest(API_ACTION_TYPES.FETCH_FE_LIST, fetchFEListSaga),
    takeLatest(API_ACTION_TYPES.FETCH_LNP_LIST, fetchLNPListSaga),
    takeEvery(API_ACTION_TYPES.FETCH_DISPOSITION_HISTORY_LIST, fetchDispositionHistoryListSaga),
    takeLatest(API_ACTION_TYPES.FETCH_DISPOSITION_LIST, fetchDispositionListSaga),
    takeLatest(API_ACTION_TYPES.FETCH_REASON_LIST, fetchReasonListSaga),
    takeLatest(API_ACTION_TYPES.FETCH_ENQUIRY_STATUSES, fetchEnquiryStatusesSaga),
    takeLatest(API_ACTION_TYPES.FETCH_EWS_ENQUIRY_LIST, fetchEwsEnquiryListSaga),
    takeLatest(API_ACTION_TYPES.FETCH_SUBSCRIBER_BY_ENQUIRY_ID, fetchSubscriberByEnquiryIdSaga),
    takeLatest(API_ACTION_TYPES.FETCH_RESIDENCE_PROOF_TYPES, fetchResidenceProofTypesSaga),
    takeLatest(API_ACTION_TYPES.FETCH_IDENTITY_PROOF_TYPES, fetchIdentityProofTypesSaga),
    takeLatest(API_ACTION_TYPES.FINALIZE_CAF, finalizeCafSaga),
    takeLatest(API_ACTION_TYPES.UPLOAD_SINGLE_DOCUMENT, uploadSingleDocumentSaga),
    takeLatest(API_ACTION_TYPES.FETCH_ONT_NEXT_POSITION, fetchOntNextPositionSaga),
    takeLatest(API_ACTION_TYPES.UPDATE_EKYC_DETAILS, updateEkycDetailsSaga),
    takeLatest(API_ACTION_TYPES.SUBMIT_EKYC_DETAILS, submitEkycDetailsSaga),
    takeLatest(API_ACTION_TYPES.VERIFY_SUBSCRIBER, verifySubscriberSaga),
    takeLatest(API_ACTION_TYPES.ONBOARD_SUBSCRIBER, onboardSubscriberSaga),
    takeLatest(API_ACTION_TYPES.CHECK_FEASIBILITY, checkFeasibilitySaga),
    takeLatest(API_ACTION_TYPES.FETCH_SUBSCRIBERS_PAGE, fetchSubscribersPageSaga),
    takeLatest(API_ACTION_TYPES.FETCH_SUBSCRIBER_FORWARD_USERS, fetchSubscriberForwardUsersSaga),
    takeLatest(API_ACTION_TYPES.ASSIGN_SUBSCRIBER_ENQUIRY, assignSubscriberEnquirySaga),
    takeLatest(API_ACTION_TYPES.FETCH_EWS_PACKAGES, fetchEwsPackages),
    takeLatest(API_ACTION_TYPES.GET_ONT_ACKNOWLEDGEMENT, getOntAcknowledgementSaga),
    takeLatest(API_ACTION_TYPES.VERIFY_ONT_ACKNOWLEDGEMENT, verifyOntAcknowledgementSaga),
    takeLatest(API_ACTION_TYPES.FETCH_SUBSCRIBER_DETAIL, fetchSubscriberDetailSaga),
    takeLatest(API_ACTION_TYPES.FETCH_SUBSCRIBER_DATA_USAGE, fetchSubscriberDataUsageSaga),
    takeLatest(API_ACTION_TYPES.FETCH_RADIUS_DETAILS, fetchRadiusDetailsSaga),
    takeLatest(API_ACTION_TYPES.UPDATE_SUBSCRIBER_DETAIL, updateSubscriberDetailSaga),
    takeLatest(API_ACTION_TYPES.SEND_MOBILE_CHANGE_OTP, sendMobileChangeOtpSaga),
    takeLatest(API_ACTION_TYPES.VERIFY_MOBILE_CHANGE_OTP, verifyMobileChangeOtpSaga),
    takeLatest(API_ACTION_TYPES.RESET_SUBSCRIBER_PASSWORD, resetSubscriberPasswordSaga),
    takeLatest(API_ACTION_TYPES.CHANGE_USERNAME, changeUsernameSaga),
    takeLatest(API_ACTION_TYPES.DOWNLOAD_SUBSCRIBERS_CSV, downloadSubscribersCsvSaga)
  ]);
}
