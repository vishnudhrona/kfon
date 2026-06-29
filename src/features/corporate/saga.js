import { t } from 'i18next';
import { isEmpty } from 'lodash-es';
import { all, call, fork, put, select, take, takeEvery, takeLatest } from 'redux-saga/effects';

import { successToast } from '@/components/custom/Toast';
import { STORAGE_KEYS } from '@/constants';
import { SERVER_SIDE_TABLE_KEYS } from '@/constants/server_table';
import { actions as apiProgressActions } from '@/features/others/ApiProgress/slice';
import { setCommonPaginationResponse } from '@/features/others/Pagination/saga';
import { getServerSidePaginationDetails } from '@/features/others/Pagination/selectors';
import { fetchDispositionHistoryList } from '@/features/subscriber/applications/actions';
import { selectorWithKey } from '@/utils/commonUtils';
import { getTokenData } from '@/utils/encryptionUtils';
import { handleAPIRequest } from '@/utils/httpUtils';

import { ACTION_TYPES, API_ACTION_TYPE_VARIANTS } from './action';
import * as api from './api';
import {
  CORPORATE_KEYS,
  DUMMY_CORPORATE_CUSTOMER_DATA,
  DUMMY_PROPOSAL_DATA,
  DUMMY_PROPOSAL_DETAILS_DATA,
  DUMMY_PURCHASE_ORDER_DATA,
  DUMMY_REVISED_PROPOSAL_DATA
} from './constants';
import { formatDispositionPayload, formatNearestConnectionPayload } from './helper';
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
  yield call(setCommonPaginationResponse, key, { payload });
  if (actionType) yield put(apiProgressActions.setProgress({ key: actionType, isLoading: true }));
  const { response } = yield call(handleAPIRequest, apiFn, payload);
  if (actionType) yield put(apiProgressActions.setProgress({ key: actionType, isLoading: false }));

  if (key && response) {
    if (!isDropdown) {
      yield call(setCommonPaginationResponse, key, { ...response });
      yield put(sliceActions.setTableData({ tableKey: key, data: response?.data?.content || [] }));
    } else {
      yield put(sliceActions.setDropdownData({ tableKey: key, data: response?.data || [] }));
    }
  }
  return response;
}

function* createSaga(payload, apiFn, actionType) {
  yield fork(handleAPIRequest, apiFn, payload);

  const { payload: { message = '' } = {}, type } = yield take([
    API_ACTION_TYPE_VARIANTS[actionType][1],
    API_ACTION_TYPE_VARIANTS[actionType][2]
  ]);

  if (type === API_ACTION_TYPE_VARIANTS[actionType][1]) {
    yield call(successToast, { title: 'success', description: message || t('saveSuccess') });
    return true;
  }
}

function* fetchCorporateCustomerList(action) {
  const response = yield* listSaga(
    {
      ...action,
      payload: {
        ...(action?.payload || {}),
        key: CORPORATE_KEYS.CORPORATE_CUSTOMER_LIST
      }
    },
    api.corporateCustomerListApi
  );

  if (!response?.data?.content?.length) {
    yield put(
      sliceActions.setTableData({
        tableKey: CORPORATE_KEYS.CORPORATE_CUSTOMER_LIST,
        data: DUMMY_CORPORATE_CUSTOMER_DATA.data
      })
    );
  }
}

export function* fetchTicketTableData() {
  yield call(handleAPIRequest, api.ticketTableDataApi);
}

function* fetchCorporateEnquiryList(action) {
  yield* listSaga(
    {
      ...action,
      payload: {
        ...action.payload,
        key: CORPORATE_KEYS.ENQUIRY_LIST
      }
    },
    api.corporateEnquiryListApi
  );
}

function* fetchCorporateEnquiryExpandedList(action) {
  const response = yield* listSaga(
    {
      ...action,
      payload: {
        ...action.payload,
        key: CORPORATE_KEYS.ENQUIRY_EXPANDED_LIST
      }
    },
    api.corporateEnquiryListApi
  );
  const expandedItems = response?.data?.content || [];
  if (expandedItems.length > 0) {
    yield put(sliceActions.mergeEnquiryExpandedData(expandedItems));
  }
}

function* fetchCorporateEnquirySummaryListSaga(action) {
  const tokenData = getTokenData(STORAGE_KEYS.AUTH_TOKEN);
  const seatId = tokenData?.seatId ?? null;
  yield* listSaga(
    {
      ...action,
      payload: {
        ...action.payload,
        key: CORPORATE_KEYS.ENQUIRY_LIST,
        ...(seatId && { seatId })
      }
    },
    api.fetchCorporateEnquirySummaryListApi
  );
}

function* fetchCorporateEnquiryOutboxSaga(action) {
  const tokenData = getTokenData(STORAGE_KEYS.AUTH_TOKEN);
  const seatId = tokenData?.seatId ?? null;
  yield* listSaga(
    {
      ...action,
      payload: {
        ...action.payload,
        key: CORPORATE_KEYS.ENQUIRY_LIST,
        ...(seatId && { seatId })
      }
    },
    api.fetchCorporateEnquiryOutboxApi
  );
}

function* fetchCorpEnquiryLocationList(action) {
  yield* listSaga(
    {
      ...action,
      payload: {
        key: CORPORATE_KEYS.ENQUIRY_LOCATION_LIST
      }
    },
    api.corporateEnquiryLocationsListApi
  );
}

function* createCorporateEnquiry(action) {
  yield createSaga(action.payload, api.createCorporateEnquiryApi, ACTION_TYPES.CREATE_CORPORATE_ENQUIRY);
}

function* downloadEnquiryListCsv(action) {
  yield call(handleAPIRequest, api.downloadEnquiryListCsvApi, action.payload);
}

function* fetchLocationDetailsSaga(action) {
  yield createSaga(action.payload, api.fetchLocationDetailsApi, ACTION_TYPES.FETCH_LOCATION_DETAILS);
}

function* downloadLocationListCsv(action) {
  yield call(handleAPIRequest, api.downloadLocationListApi, action.payload);
}

function* downloadLocationReportCsv(action) {
  yield call(handleAPIRequest, api.downloadLocationReportApi, action.payload);
}

function* downloadLocationSampleCsv(action) {
  yield call(handleAPIRequest, api.downloadLocationSampleCsvApi, action.payload);
}

function* downloadLocationCsvTemplateSaga(action) {
  yield call(handleAPIRequest, api.downloadLocationCsvTemplateApi, action.payload);
}

function* submitLocationData(action) {
  yield createSaga(action.payload, api.submitLocationDataApi, ACTION_TYPES.SUBMIT_LOCATION_DATA);
}

function* locationForwardToFE(action) {
  yield createSaga(action.payload, api.locationForwardToFEApi, ACTION_TYPES.LOCATION_FORWARD_TO_FE);
}

function* locationForwardToLNP(action) {
  yield createSaga(action.payload, api.locationForwardToLNPApi, ACTION_TYPES.LOCATION_FORWARD_TO_LNP);
}

function* fetchCustomerDetails(action) {
  yield createSaga(action.payload, api.fetchCustomerDetailsApi, ACTION_TYPES.FETCH_CUSTOMER_DETAILS);
}

function* handleCreateCorporateCustomer(action) {
  const { onSuccess, ...payload } = action.payload;
  const isSuccess = yield createSaga(payload, api.createCorporateCustomerApi, ACTION_TYPES.CREATE_CORPORATE_CUSTOMER);
  if (isSuccess && onSuccess) {
    onSuccess();
  }
}

function* fetchServicesList(action) {
  yield* listSaga(
    {
      ...action,
      payload: {
        ...action.payload,
        key: CORPORATE_KEYS.SERVICES_LIST,
        isDropdown: true
      }
    },
    api.fetchServicesListApi
  );
}

function* fetchEnquiryList(action) {
  yield* listSaga(
    {
      ...action,
      payload: {
        ...action.payload,
        key: CORPORATE_KEYS.ENQUIRY_LIST,
        isDropdown: false
      }
    },
    api.fetchEnquiryListApi
  );
}

function* fetchCompanyTypeList(action) {
  yield* listSaga(
    {
      ...action,
      payload: {
        ...action.payload,
        key: CORPORATE_KEYS.COMPANY_TYPE_LIST,
        isDropdown: true
      }
    },
    api.fetchCompanyTypeListApi
  );
}

function* fetchCorporatePackageList(action) {
  yield* listSaga(
    {
      ...action,
      payload: {
        key: CORPORATE_KEYS.CORPORATE_PACKAGES
      }
    },
    api.corporatePackageListApi
  );
}

function* downloadPackageListCsv(action) {
  yield call(handleAPIRequest, api.downloadPackageListCsvApi, action.payload);
}

function* createCorporatePackage(action) {
  yield call(handleAPIRequest, api.createCorporatePackageApi, action.payload);
}

function* fetchServiceTypes(action) {
  yield* listSaga(
    {
      ...action,
      payload: {
        ...action.payload,
        key: CORPORATE_KEYS.SERVICE_TYPES_LIST,
        isDropdown: true
      }
    },
    api.fetchServiceTypesApi
  );
}

function* fetchSubServiceTypes(action) {
  yield* listSaga(
    {
      ...action,
      payload: {
        ...action.payload,
        key: CORPORATE_KEYS.SUB_SERVICE_TYPES_LIST,
        isDropdown: true
      }
    },
    api.fetchSubServiceTypesApi
  );
}

function* fetchPlanTypes(action) {
  yield* listSaga(
    {
      ...action,
      payload: {
        ...action.payload,
        key: CORPORATE_KEYS.PLAN_TYPES_LIST,
        isDropdown: true
      }
    },
    api.fetchPlanTypesApi
  );
}

function* fetchCorporateProposalList(action) {
  try {
    yield* listSaga(
      {
        ...action,
        payload: {
          key: CORPORATE_KEYS.CORPORATE_PROPOSAL_LIST
        }
      },
      api.corporateProposalListApi
    );
  } catch {
    yield put(
      sliceActions.setTableData({
        tableKey: CORPORATE_KEYS.CORPORATE_PROPOSAL_LIST,
        data: DUMMY_PROPOSAL_DATA.data
      })
    );
  }
}

function* downloadProposalListCsv(action) {
  yield call(handleAPIRequest, api.downloadProposalListCsvApi, action.payload);
}

function* createCorporateProposal(action) {
  yield call(handleAPIRequest, api.createCorporateProposalApi, action.payload);
}

function* fetchProposalRevisions() {
  yield put(
    sliceActions.setTableData({
      tableKey: CORPORATE_KEYS.PROPOSAL_REVISIONS,
      data: DUMMY_REVISED_PROPOSAL_DATA.data
    })
  );
}

function* fetchProposalDetails(action) {
  try {
    const { payload } = yield call(handleAPIRequest, api.fetchProposalDetailsApi, action.payload);
    yield put(sliceActions.setProposalDetails(payload));
  } catch {
    // Show dummy data on failure as per user request
    yield put(sliceActions.setProposalDetails(DUMMY_PROPOSAL_DETAILS_DATA));
  }
}

function* fetchEnquiryDetails(action) {
  yield put(sliceActions.setEnquiryDetails({}));
  const { response } = yield call(handleAPIRequest, api.fetchEnquiryDetailsApi, action.payload);
  const data = response?.data ?? response;
  yield put(sliceActions.setEnquiryDetails(data));
}

function* fetchMeetingHistory(action) {
  yield put(sliceActions.setMeetingHistoryLoading(true));
  const { response } = yield call(handleAPIRequest, api.fetchMeetingHistoryApi, action.payload);
  const data = response?.data?.content ?? response?.data ?? [];
  yield put(sliceActions.setMeetingHistory(data));
}

function* fetchForwardRoles() {
  yield put(sliceActions.setForwardRolesLoading(true));
  const { response } = yield call(handleAPIRequest, api.fetchForwardRolesApi);
  const data = response?.data?.content ?? response?.data ?? [];
  yield put(sliceActions.setForwardRoles(data));
}

function* fetchRoleUsers(action) {
  yield put(sliceActions.setForwardRoleUsersLoading(true));
  const { response } = yield call(handleAPIRequest, api.fetchRoleUsersApi, action.payload);
  const data = response?.data?.content ?? response?.data ?? [];
  yield put(sliceActions.setForwardRoleUsers(data));
}

function* fetchEnquiryNotes(action) {
  yield put(sliceActions.setEnquiryNotesLoading(true));
  const { response } = yield call(handleAPIRequest, api.fetchEnquiryNotesApi, action.payload);
  const data = response?.data?.content ?? response?.data ?? [];
  yield put(sliceActions.setEnquiryNotes(data));
}

function* forwardEnquiry(action) {
  const { onSuccess, ...payload } = action.payload;
  yield put(sliceActions.setForwardEnquiryLoading(true));
  const isSuccess = yield createSaga(payload, api.forwardEnquiryApi, ACTION_TYPES.FORWARD_ENQUIRY);
  yield put(sliceActions.setForwardEnquiryLoading(false));
  if (isSuccess) {
    const tokenData = getTokenData(STORAGE_KEYS.AUTH_TOKEN);
    const seatId = tokenData?.seatId ?? null;
    yield put({ type: ACTION_TYPES.FETCH_CORPORATE_ENQUIRY_LIST, payload: { ...(seatId && { seatId }) } });
    if (onSuccess) onSuccess();
  }
}

function* saveMeeting(action) {
  const { onSuccess, ...payload } = action.payload;
  const isSuccess = yield createSaga(payload, api.saveMeetingApi, ACTION_TYPES.SAVE_MEETING);
  if (isSuccess && onSuccess) {
    onSuccess();
  }
}

function* fetchDispositionList() {
  yield put(sliceActions.setDispositionListLoading(true));
  const { response } = yield call(handleAPIRequest, api.fetchDispositionListApi);
  const data = response?.data?.content ?? response?.data ?? [];
  yield put(sliceActions.setDispositionList(data));
}

function* fetchReasonList(action) {
  yield put(sliceActions.setReasonListLoading(true));
  const { response } = yield call(handleAPIRequest, api.fetchReasonListApi, action.payload);
  const data = response?.data?.content ?? response?.data ?? [];
  yield put(sliceActions.setReasonList(data));
}

function* saveDisposition(action) {
  const { onSuccess, enquiryId, locationId, ...formData } = action.payload;
  const payload = { enquiryId, locationId, ...formatDispositionPayload(formData) };
  const isSuccess = yield createSaga(payload, api.saveDispositionApi, ACTION_TYPES.SAVE_DISPOSITION);
  if (isSuccess) {
    yield put(fetchDispositionHistoryList({ customerEnquiryId: enquiryId }));
    yield put({ type: ACTION_TYPES.FETCH_ENQUIRY_LOCATIONS_SUMMARY, payload: { enquiryId } });
    if (onSuccess) onSuccess();
  }
}

function* updateDisposition(action) {
  const { onSuccess, enquiryId, locationId, ...formData } = action.payload;
  const payload = { enquiryId, locationId, ...formatDispositionPayload(formData) };
  const isSuccess = yield createSaga(payload, api.updateDispositionApi, ACTION_TYPES.UPDATE_DISPOSITION);
  if (isSuccess) {
    yield put(fetchDispositionHistoryList({ customerEnquiryId: enquiryId }));
    yield put({ type: ACTION_TYPES.FETCH_ENQUIRY_LOCATIONS_SUMMARY, payload: { enquiryId } });
    if (onSuccess) onSuccess();
  }
}

function* fetchLocationDisposition(action) {
  yield put(sliceActions.setLocationDispositionLoading(true));
  const { response } = yield call(handleAPIRequest, api.fetchLocationDispositionApi, action.payload);
  yield put(sliceActions.setLocationDisposition(response?.data ?? null));
}

function* fetchEnquiryDispositionList(action) {
  yield put(sliceActions.setEnquiryDispositionListLoading(true));
  const { response } = yield call(handleAPIRequest, api.fetchEnquiryDispositionListApi, action.payload);
  const data = response?.data?.content ?? response?.data ?? [];
  yield put(sliceActions.setEnquiryDispositionList(Array.isArray(data) ? data : []));
}

function* fetchReturnToInfo(action) {
  yield put(sliceActions.setReturnToInfoLoading(true));
  const { response } = yield call(handleAPIRequest, api.fetchReturnToInfoApi, action.payload);
  const data = response?.data?.content ?? response?.data ?? null;
  yield put(sliceActions.setReturnToInfo(data));
  yield put(sliceActions.setReturnToInfoLoading(false));
}

function* assignEnquiry(action) {
  const { onSuccess, ...payload } = action.payload;
  const isSuccess = yield createSaga(payload, api.assignEnquiryApi, ACTION_TYPES.ASSIGN_ENQUIRY);
  if (isSuccess) {
    const tokenData = getTokenData(STORAGE_KEYS.AUTH_TOKEN);
    const seatId = tokenData?.seatId ?? null;
    yield put({ type: ACTION_TYPES.FETCH_CORPORATE_ENQUIRY_LIST, payload: { ...(seatId && { seatId }) } });
    if (onSuccess) onSuccess();
  }
}

function* assignEnquiryMultiple(action) {
  const { onSuccess, ...payload } = action.payload;
  const isSuccess = yield createSaga(payload, api.assignEnquiryMultipleApi, ACTION_TYPES.ASSIGN_ENQUIRY_MULTIPLE);
  if (isSuccess) {
    const tokenData = getTokenData(STORAGE_KEYS.AUTH_TOKEN);
    const seatId = tokenData?.seatId ?? null;
    yield put({ type: ACTION_TYPES.FETCH_CORPORATE_ENQUIRY_LIST, payload: { ...(seatId && { seatId }) } });
    if (onSuccess) onSuccess();
  }
}

function* returnToEnquiry(action) {
  const { onSuccess, ...payload } = action.payload;
  const isSuccess = yield createSaga(payload, api.returnToEnquiryApi, ACTION_TYPES.RETURN_TO_ENQUIRY);
  if (isSuccess) {
    const tokenData = getTokenData(STORAGE_KEYS.AUTH_TOKEN);
    const seatId = tokenData?.seatId ?? null;
    yield put({ type: ACTION_TYPES.FETCH_CORPORATE_ENQUIRY_LIST, payload: { ...(seatId && { seatId }) } });
    if (onSuccess) onSuccess();
  }
}

function* saveNote(action) {
  const { onSuccess, ...payload } = action.payload;
  const isSuccess = yield createSaga(payload, api.saveNoteApi, ACTION_TYPES.SAVE_NOTE);
  if (isSuccess && onSuccess) {
    onSuccess();
  }
}

function* updateCorporateEnquirySaga(action) {
  const { onSuccess, ...payload } = action.payload;
  const isSuccess = yield createSaga(payload, api.updateCorporateEnquiryApi, ACTION_TYPES.UPDATE_CORPORATE_ENQUIRY);
  if (isSuccess && onSuccess) {
    onSuccess();
  }
}

function* fetchFeasibilityLnpList() {
  yield put(sliceActions.setFeasibilityLnpListLoading(true));
  const { response } = yield call(handleAPIRequest, api.fetchFeasibilityLnpListApi);
  const data = response?.data?.content ?? response?.data ?? [];
  yield put(sliceActions.setFeasibilityLnpList(data));
}

function* fetchFeasibilityConnectedByList() {
  yield put(sliceActions.setFeasibilityConnectedByListLoading(true));
  const { response } = yield call(handleAPIRequest, api.fetchFeasibilityConnectedByListApi);
  const data = response?.data?.content ?? response?.data ?? [];
  yield put(sliceActions.setFeasibilityConnectedByList(data));
}

function* fetchNearestPop() {
  yield put(sliceActions.setNearestPopListLoading(true));
  const { response } = yield call(handleAPIRequest, api.fetchNearestPopApi);
  const data = response?.data?.content ?? response?.data ?? [];
  yield put(sliceActions.setNearestPopList(data));
}

function* saveFeasibility(action) {
  const { onSuccess, ...payload } = action.payload;
  const isSuccess = yield createSaga(payload, api.saveFeasibilityApi, ACTION_TYPES.SAVE_FEASIBILITY);
  if (isSuccess && onSuccess) {
    onSuccess();
  }
}

function* fetchNearestLocation(action) {
  yield put(sliceActions.setNearestLocationLoading(true));
  const { response } = yield call(handleAPIRequest, api.fetchNearestLocationApi, action.payload);
  const data = response?.data ?? null;
  yield put(sliceActions.setNearestLocation(data));
}

function* saveNearestLocation(action) {
  const { onSuccess, enquiryId, locationId, ...formData } = action.payload;
  const payload = { enquiryId, locationId, ...formatNearestConnectionPayload(formData) };
  const isSuccess = yield createSaga(payload, api.saveNearestLocationApi, ACTION_TYPES.SAVE_NEAREST_LOCATION);
  if (isSuccess && onSuccess) {
    onSuccess();
  }
}

function* updateNearestLocation(action) {
  const { onSuccess, enquiryId, locationId, ...formData } = action.payload;
  const payload = { enquiryId, locationId, ...formatNearestConnectionPayload(formData) };
  const isSuccess = yield createSaga(payload, api.updateNearestLocationApi, ACTION_TYPES.UPDATE_NEAREST_LOCATION);
  if (isSuccess && onSuccess) {
    onSuccess();
  }
}

function* fetchKycDetailsSaga(action) {
  yield put(sliceActions.setKycDetailsLoading(true));
  const { response } = yield call(handleAPIRequest, api.fetchKycDetailsApi, action.payload);
  const kycData = response?.data ?? null;
  yield put(sliceActions.setKycDetails(kycData));
  if (kycData?.cusId) yield put(sliceActions.setKycCusId(kycData.cusId));
}

function* fetchKycDocumentSaga(action) {
  const { onSuccess, ...payload } = action.payload;
  yield put(sliceActions.setKycDocumentLoading(true));
  const { response } = yield call(handleAPIRequest, api.fetchKycDocumentApi, payload);
  const data = response?.data ?? null;
  yield put(sliceActions.setKycDocument(data));
  const viewUrl = data?.viewUrl || data?.url;
  if (viewUrl) {
    if (onSuccess) {
      onSuccess({ viewUrl, contentType: data?.contentType });
    } else {
      window.open(viewUrl, '_blank');
    }
  }
}

function* deleteKycDocumentSaga(action) {
  const { onSuccess, cusId, docType } = action.payload;
  const isSuccess = yield createSaga({ cusId, docType }, api.deleteKycDocumentApi, ACTION_TYPES.DELETE_KYC_DOCUMENT);
  if (isSuccess) {
    yield put(sliceActions.clearKycDocumentPath(docType));
    if (onSuccess) onSuccess();
  }
}

function* verifyCustomer(action) {
  yield put(sliceActions.setCustomerVerificationLoading(true));
  const { response } = yield call(handleAPIRequest, api.verifyCustomerApi, action.payload);
  const data = response?.data ?? [];
  yield put(sliceActions.setCustomerVerificationList(data));
}

function* delinkCorporateCustomer(action) {
  const { onSuccess, ...payload } = action.payload;
  const isSuccess = yield createSaga(payload, api.delinkCorporateCustomerApi, ACTION_TYPES.DELINK_CORPORATE_CUSTOMER);
  if (isSuccess && onSuccess) {
    onSuccess();
  }
}

function* fetchEnquiryLocationDetailsSaga(action) {
  yield put(sliceActions.setEnquiryLocationDetailsLoading(true));
  const { response } = yield call(handleAPIRequest, api.fetchEnquiryLocationDetailsApi, action.payload);
  const data = response?.data ?? null;
  yield put(sliceActions.setEnquiryLocationDetails(data));
}

function* fetchEnquiryLocationsSaga(action) {
  yield put(sliceActions.setEnquiryLocationsLoading(true));
  const { response } = yield call(handleAPIRequest, api.fetchEnquiryLocationsApi, action.payload);
  const raw = response?.data?.locations ?? response?.data?.content ?? response?.data;
  const data = Array.isArray(raw) ? raw : [];
  if (action.payload?.locationId) {
    yield put(sliceActions.mergeEnquiryLocation(data[0] ?? null));
  } else {
    yield put(sliceActions.setEnquiryLocations(data));
  }
}

function* fetchLocationsBySeatSaga(action) {
  yield put(sliceActions.setEnquiryLocationsLoading(true));
  const { response } = yield call(handleAPIRequest, api.fetchLocationsBySeatApi, action.payload);
  const raw = response?.data?.locations ?? response?.data?.content ?? response?.data;
  const data = Array.isArray(raw) ? raw : [];
  yield put(sliceActions.setEnquiryLocations(data));
}

function* fetchPackageTypesListSaga(action) {
  yield put(sliceActions.setPackageTypesListLoading(true));
  const { response } = yield call(handleAPIRequest, api.fetchPackageTypesListApi, action.payload);
  const raw = response?.data?.content ?? response?.data;
  const data = Array.isArray(raw) ? raw : [];
  yield put(sliceActions.setPackageTypesList(data));
}

function* fetchPackagesListSaga(action) {
  yield put(sliceActions.setPackagesListLoading(true));
  const { response } = yield call(handleAPIRequest, api.fetchPackagesListApi, action.payload);
  const raw = response?.data?.content ?? response?.data;
  const data = Array.isArray(raw) ? raw : [];
  yield put(sliceActions.setPackagesList(data));
}

function* fetchAdditionalServicesListSaga(action) {
  yield put(sliceActions.setAdditionalServicesListLoading(true));
  const { response } = yield call(handleAPIRequest, api.fetchAdditionalServicesListApi, action.payload);
  const raw = response?.data?.content ?? response?.data;
  const data = Array.isArray(raw) ? raw : [];
  yield put(sliceActions.setAdditionalServicesList(data));
}

function* submitEnquiryLocation(action) {
  const { onSuccess, ...payload } = action.payload;
  const isSuccess = yield createSaga(payload, api.submitEnquiryLocationApi, ACTION_TYPES.SUBMIT_ENQUIRY_LOCATION);
  if (isSuccess) {
    yield put({ type: ACTION_TYPES.FETCH_ENQUIRY_LOCATIONS, payload: { enquiryId: payload.enquiryId } });
    if (onSuccess) onSuccess();
  }
}

function* updateEnquiryLocationSaga(action) {
  const { onSuccess, ...payload } = action.payload;
  const isSuccess = yield createSaga(payload, api.updateEnquiryLocationApi, ACTION_TYPES.UPDATE_ENQUIRY_LOCATION);
  if (isSuccess) {
    yield put({ type: ACTION_TYPES.FETCH_ENQUIRY_LOCATIONS, payload: { enquiryId: payload.enquiryId } });
    if (onSuccess) onSuccess();
  }
}

function* linkCorporateCustomer(action) {
  const { onSuccess, ...payload } = action.payload;
  const isSuccess = yield createSaga(payload, api.linkCorporateCustomerApi, ACTION_TYPES.LINK_CORPORATE_CUSTOMER);
  if (isSuccess) {
    const tokenData = getTokenData(STORAGE_KEYS.AUTH_TOKEN);
    const seatId = tokenData?.seatId ?? null;
    yield put({ type: ACTION_TYPES.FETCH_CORPORATE_ENQUIRY_SUMMARY, payload: { ...(seatId && { seatId }) } });
    if (onSuccess) onSuccess();
  }
}

function* saveCustomerBasicDetailsSaga(action) {
  const { onSuccess, ...payload } = action.payload;
  yield fork(handleAPIRequest, api.saveCustomerBasicDetailsApi, payload);
  const { payload: responsePayload, type } = yield take([
    API_ACTION_TYPE_VARIANTS[ACTION_TYPES.SAVE_CUSTOMER_BASIC_DETAILS][1],
    API_ACTION_TYPE_VARIANTS[ACTION_TYPES.SAVE_CUSTOMER_BASIC_DETAILS][2]
  ]);
  if (type === API_ACTION_TYPE_VARIANTS[ACTION_TYPES.SAVE_CUSTOMER_BASIC_DETAILS][1]) {
    yield call(successToast, { title: 'success', description: responsePayload?.message || t('saveSuccess') });
    const cusId = responsePayload?.data?.cusId || responsePayload?.data?.id;
    if (cusId) {
      yield put(sliceActions.setKycCusId(cusId));
    }
    if (onSuccess) onSuccess(cusId);
  }
}

function* updateCustomerBasicDetailsSaga(action) {
  const { onSuccess, ...payload } = action.payload;
  const isSuccess = yield createSaga(
    payload,
    api.updateCustomerBasicDetailsApi,
    ACTION_TYPES.UPDATE_CUSTOMER_BASIC_DETAILS
  );
  if (isSuccess && onSuccess) onSuccess();
}

function* searchCorporateGstDetailsSaga(action) {
  yield call(handleAPIRequest, api.searchCorporateGstDetailsApi, action.payload);
}

function* uploadKycDocumentSaga(action) {
  const { cusId, docType, file } = action.payload;
  const formData = new FormData();
  formData.append('file', file);
  yield createSaga({ cusId, docType, formData }, api.uploadKycDocumentApi, ACTION_TYPES.UPLOAD_KYC_DOCUMENT);
}

function* corporateLocationUploadSaga(action) {
  const { enquiryId, file, onSuccess } = action.payload;
  const formData = new FormData();
  formData.append('file', file);
  const isSuccess = yield createSaga(
    { enquiryId, formData },
    api.corporateLocationUploadApi,
    ACTION_TYPES.CORPORATE_LOCATION_UPLOAD
  );
  if (isSuccess && onSuccess) onSuccess();
}

function* updateCustomerGSTDetailsSaga(action) {
  // eslint-disable-next-line no-unused-vars
  const { onSuccess, cusId, gstDocument, supportingDocument, lutDocument, ...rest } = action.payload;
  const isSuccess = yield createSaga(
    { cusId, ...rest },
    api.updateCustomerGSTDetailsApi,
    ACTION_TYPES.UPDATE_CUSTOMER_GST_DETAILS
  );
  if (isSuccess && onSuccess) onSuccess();
}

function* updateCustomerPANDetailsSaga(action) {
  const { onSuccess, cusId, panNumber } = action.payload;

  const isSuccess = yield createSaga(
    { cusId, pan: panNumber },
    api.updateCustomerPANDetailsApi,
    ACTION_TYPES.UPDATE_CUSTOMER_PAN_DETAILS
  );
  if (cusId) yield put({ type: ACTION_TYPES.FETCH_KYC_DETAILS, payload: { customerId: cusId } });
  if (isSuccess && onSuccess) onSuccess();
}

function* updateCorporateProposal(action) {
  yield createSaga(action.payload, api.updateCorporateProposalApi, ACTION_TYPES.UPDATE_CORPORATE_PROPOSAL);
}

function* createPurchaseOrder(action) {
  const { onSuccess, ...payload } = action.payload || {};
  const isSuccess = yield createSaga(payload, api.createPurchaseOrderApi, ACTION_TYPES.CREATE_PURCHASE_ORDER);
  if (isSuccess && onSuccess) onSuccess();
}

function* fetchPurchaseOrderDetailsSaga(action) {
  const { response } = yield call(handleAPIRequest, api.fetchPurchaseOrderDetailsApi, action.payload);
  if (response?.data) {
    yield put(sliceActions.setPurchaseOrderDetails(response.data));
  }
}

function* updatePurchaseOrderSaga(action) {
  const { onSuccess, ...payload } = action.payload || {};
  const isSuccess = yield createSaga(payload, api.updatePurchaseOrderApi, ACTION_TYPES.UPDATE_PURCHASE_ORDER);
  if (isSuccess && onSuccess) onSuccess();
}

function* generatePoPdfSaga(action) {
  const { onSuccess } = action.payload ?? {};
  const { response } = yield call(handleAPIRequest, api.generatePoPdfApi, action.payload);
  if (response?.data && onSuccess) {
    onSuccess(response.data);
  }
}

function* deletePurchaseOrderDocumentSaga(action) {
  const { onSuccess, enquiryId, version, fileId } = action.payload;
  const isSuccess = yield createSaga(
    { enquiryId, version, fileId },
    api.deletePurchaseOrderDocumentApi,
    ACTION_TYPES.DELETE_PO_DOCUMENT
  );
  if (isSuccess && onSuccess) onSuccess();
}

function* fetchCircuitProvisioningSaga(action) {
  const { response } = yield call(handleAPIRequest, api.fetchCircuitProvisioningApi, action.payload);
  if (response?.data) {
    yield put(sliceActions.setCircuitProvisioningDetails(response.data));
  }
}

function* createCircuitProvisioningSaga(action) {
  const { onSuccess, ...payload } = action.payload || {};
  const isSuccess = yield createSaga(
    payload,
    api.createCircuitProvisioningApi,
    ACTION_TYPES.CREATE_CIRCUIT_PROVISIONING
  );
  if (isSuccess && onSuccess) onSuccess();
}

function* updateCircuitProvisioningSaga(action) {
  const { onSuccess, ...payload } = action.payload || {};
  const isSuccess = yield createSaga(
    payload,
    api.updateCircuitProvisioningApi,
    ACTION_TYPES.UPDATE_CIRCUIT_PROVISIONING
  );
  if (isSuccess && onSuccess) onSuccess();
}

function* fetchServiceProvisioningSaga(action) {
  const { response } = yield call(handleAPIRequest, api.fetchServiceProvisioningApi, action.payload);
  if (response?.data) {
    yield put(sliceActions.setServiceProvisioningDetails(response.data?.data ?? response.data));
  }
}

function* createServiceProvisioningSaga(action) {
  const { onSuccess, ...payload } = action.payload || {};
  const isSuccess = yield createSaga(
    payload,
    api.createServiceProvisioningApi,
    ACTION_TYPES.CREATE_SERVICE_PROVISIONING
  );
  if (isSuccess && onSuccess) onSuccess();
}

function* updateServiceProvisioningSaga(action) {
  const { onSuccess, ...payload } = action.payload || {};
  const isSuccess = yield createSaga(
    payload,
    api.updateServiceProvisioningApi,
    ACTION_TYPES.UPDATE_SERVICE_PROVISIONING
  );
  if (isSuccess && onSuccess) onSuccess();
}

function* approveServiceProvisioningSaga(action) {
  const { onSuccess, enquiryId, locationId, ...rest } = action.payload || {};
  const isSuccess = yield createSaga(
    { enquiryId, locationId, ...rest },
    api.approveServiceProvisioningApi,
    ACTION_TYPES.APPROVE_SERVICE_PROVISIONING
  );
  if (isSuccess) {
    yield put({ type: ACTION_TYPES.FETCH_SERVICE_PROVISIONING, payload: { enquiryId, locationId } });
    if (onSuccess) onSuccess();
  }
}

function* generateServiceCommissioningInvoiceSaga(action) {
  const { onSuccess, enquiryId, locationId } = action.payload || {};
  const isSuccess = yield createSaga(
    { enquiryId, locationId },
    api.generateServiceCommissioningInvoiceApi,
    ACTION_TYPES.GENERATE_SERVICE_COMMISSIONING_INVOICE
  );
  if (isSuccess) {
    yield put({ type: ACTION_TYPES.FETCH_SERVICE_PROVISIONING, payload: { enquiryId, locationId } });
    if (onSuccess) onSuccess();
  }
}

function* fetchServiceCommissioningInvoiceSaga(action) {
  const { onSuccess, enquiryId, locationId } = action.payload || {};
  const { response } = yield call(handleAPIRequest, api.fetchServiceCommissioningInvoiceApi, { enquiryId, locationId });
  if (response?.data && onSuccess) onSuccess(response.data);
}

function* fetchCircuitMulticastTypesSaga() {
  const { response } = yield call(handleAPIRequest, api.fetchCircuitMulticastTypesApi);
  const data = response?.data ?? [];
  yield put(sliceActions.setCircuitMulticastTypes(Array.isArray(data) ? data : []));
}

function* fetchCircuitServiceProvidersSaga() {
  const { response } = yield call(handleAPIRequest, api.fetchCircuitServiceProvidersApi);
  const data = response?.data ?? [];
  yield put(sliceActions.setCircuitServiceProviders(Array.isArray(data) ? data : []));
}

function* fetchEnquiryLocationsSummarySaga(action) {
  yield put(sliceActions.setEnquiryLocationsLoading(true));
  const { response } = yield call(handleAPIRequest, api.fetchEnquiryLocationsSummaryApi, action.payload);
  const raw = response?.data;
  const data = Array.isArray(raw) ? raw : [];
  yield put(sliceActions.setEnquiryLocations(data));
}

function* fetchEnquiryProposalsSaga(action) {
  const { payload: { key, ...data } = {} } = action;
  const { response } = yield call(handleAPIRequest, api.fetchEnquiryProposalsApi, data);
  if (key && response) {
    yield put(sliceActions.setTableData({ tableKey: key, data: response?.data }));
  }
}

function* saveEnquiryProposalSaga(action) {
  const { onSuccess, ...payload } = action.payload;
  const isSuccess = yield createSaga(payload, api.saveEnquiryProposalApi, ACTION_TYPES.SAVE_ENQUIRY_PROPOSAL);
  if (isSuccess && onSuccess) onSuccess();
}

function* createLocationProposalSaga(action) {
  const { onSuccess, ...payload } = action.payload;
  const isSuccess = yield createSaga(payload, api.createLocationProposalApi, ACTION_TYPES.CREATE_LOCATION_PROPOSAL);
  if (isSuccess && onSuccess) onSuccess();
}

function* updateLocationProposalSaga(action) {
  const { onSuccess, ...payload } = action.payload;
  const isSuccess = yield createSaga(payload, api.updateLocationProposalApi, ACTION_TYPES.UPDATE_LOCATION_PROPOSAL);
  if (isSuccess && onSuccess) onSuccess();
}

function* bulkUpdateProposalsSaga(action) {
  const { onSuccess, ...payload } = action.payload;
  const isSuccess = yield createSaga(payload, api.bulkUpdateProposalsApi, ACTION_TYPES.BULK_UPDATE_PROPOSALS);
  if (isSuccess && onSuccess) onSuccess();
}

function* createCorporateProposalSendSaga(action) {
  const { onSuccess, enquiryId, version, ...payload } = action.payload;
  const isSuccess = yield createSaga(
    { enquiryId, version, ...payload },
    api.createCorporateProposalSendApi,
    ACTION_TYPES.CREATE_CORPORATE_PROPOSAL_SEND
  );
  if (isSuccess) {
    const { response } = yield call(handleAPIRequest, api.fetchCorporateProposalSendApi, { enquiryId, version });
    if (response?.data) yield put(sliceActions.setProposalDetails(response.data));
    if (onSuccess) onSuccess();
  }
}

function* sendCorporateProposalSaga(action) {
  const { onSuccess, enquiryId, version, ...payload } = action.payload;
  const isSuccess = yield createSaga(
    { enquiryId, version, ...payload },
    api.sendCorporateProposalApi,
    ACTION_TYPES.SEND_CORPORATE_PROPOSAL
  );
  if (isSuccess) {
    const { response } = yield call(handleAPIRequest, api.fetchCorporateProposalSendApi, { enquiryId, version });
    if (response?.data) yield put(sliceActions.setProposalDetails(response.data));
    if (onSuccess) onSuccess();
  }
}

function* fetchCorporateProposalSendSaga(action) {
  const { onSuccess } = action.payload ?? {};
  const { response } = yield call(handleAPIRequest, api.fetchCorporateProposalSendApi, action.payload);
  if (response?.data) {
    yield put(sliceActions.setProposalDetails(response.data));
  }
  if (response) {
    onSuccess?.();
  }
}

function* fetchProposalSendPreviewSaga(action) {
  const { onSuccess } = action.payload;
  const { response } = yield call(handleAPIRequest, api.fetchProposalSendPreviewApi, action.payload);
  if (response?.data && onSuccess) {
    onSuccess(response.data);
  }
}

function* updateProposalStatusSaga(action) {
  const { onSuccess, ...payload } = action.payload;
  const isSuccess = yield createSaga(payload, api.updateProposalStatusApi, ACTION_TYPES.UPDATE_PROPOSAL_STATUS);
  if (isSuccess && onSuccess) onSuccess();
}

function* fetchProposalDispatchSaga(action) {
  yield put(sliceActions.setProposalDispatchLoading(true));
  const { response } = yield call(handleAPIRequest, api.fetchProposalDispatchApi, action.payload);
  const data = response?.data ?? null;
  yield put(sliceActions.setProposalDispatch(data));
}

function* sendEmailProposalDispatchSaga(action) {
  const { onSuccess, ...payload } = action.payload;
  const isSuccess = yield createSaga(
    payload,
    api.sendEmailProposalDispatchApi,
    ACTION_TYPES.SEND_EMAIL_PROPOSAL_DISPATCH
  );
  if (isSuccess && onSuccess) onSuccess();
}

function* sendDirectProposalDispatchSaga(action) {
  const { onSuccess, ...payload } = action.payload;
  const isSuccess = yield createSaga(
    payload,
    api.sendDirectProposalDispatchApi,
    ACTION_TYPES.SEND_DIRECT_PROPOSAL_DISPATCH
  );
  if (isSuccess && onSuccess) onSuccess();
}

function* fetchTicketTableDataSaga() {
  // const { page = 1, size = 10 } = payload;
  // const data = yield call(api.fetchTicketTableDataApi, payload);
  // yield put(actions.setTableData({ tableKey: SERVER_SIDE_TABLE_KEYS.TICKET_LIST_TABLE, data }));
}

function* fetchCorporatePurchaseOrderListSaga() {
  yield put(
    sliceActions.setTableData({
      tableKey: SERVER_SIDE_TABLE_KEYS.CORPORATE_PURCHASE_ORDER_LIST,
      data: DUMMY_PURCHASE_ORDER_DATA.data
    })
  );
}

function* downloadCorporatePurchaseOrderListCsv(action) {
  yield call(handleAPIRequest, api.downloadCorporatePurchaseOrderListCsvApi, action.payload);
}

export default function* agnpInventorySaga() {
  yield all([
    takeLatest(ACTION_TYPES.FETCH_TICKET_TABLE_DATA, fetchTicketTableDataSaga),
    takeLatest(ACTION_TYPES.FETCH_CORPORATE_CUSTOMER_LIST, fetchCorporateCustomerList),
    takeLatest(ACTION_TYPES.FETCH_CORPORATE_ENQUIRY_LIST, fetchCorporateEnquiryList),
    takeLatest(ACTION_TYPES.FETCH_CORPORATE_ENQUIRY_EXPANDED_LIST, fetchCorporateEnquiryExpandedList),
    takeLatest(ACTION_TYPES.FETCH_CORPORATE_ENQUIRY_SUMMARY, fetchCorporateEnquirySummaryListSaga),
    takeLatest(ACTION_TYPES.FETCH_CORPORATE_ENQUIRY_OUTBOX, fetchCorporateEnquiryOutboxSaga),
    takeLatest(ACTION_TYPES.CREATE_CORPORATE_ENQUIRY, createCorporateEnquiry),
    takeLatest(ACTION_TYPES.FETCH_CORP_ENQUIRY_LOCATION_LIST, fetchCorpEnquiryLocationList),
    takeLatest(ACTION_TYPES.DOWNLOAD_ENQUIRY_LIST_CSV, downloadEnquiryListCsv),
    takeLatest(ACTION_TYPES.DOWNLOAD_LOCATION_LIST_CSV, downloadLocationListCsv),
    takeLatest(ACTION_TYPES.DOWNLOAD_LOCATION_REPORT_CSV, downloadLocationReportCsv),
    takeLatest(ACTION_TYPES.DOWNLOAD_LOCATION_SAMPLE_CSV, downloadLocationSampleCsv),
    takeLatest(ACTION_TYPES.LOCATION_FORWARD_TO_FE, locationForwardToFE),
    takeLatest(ACTION_TYPES.LOCATION_FORWARD_TO_LNP, locationForwardToLNP),
    takeLatest(ACTION_TYPES.FETCH_LOCATION_DETAILS, fetchLocationDetailsSaga),
    takeLatest(ACTION_TYPES.SUBMIT_LOCATION_DATA, submitLocationData),
    takeLatest(ACTION_TYPES.FETCH_CUSTOMER_DETAILS, fetchCustomerDetails),
    takeLatest(ACTION_TYPES.CREATE_CORPORATE_CUSTOMER, handleCreateCorporateCustomer),
    takeLatest(ACTION_TYPES.FETCH_SERVICES_LIST, fetchServicesList),
    takeLatest(ACTION_TYPES.FETCH_ENQUIRY_LIST, fetchEnquiryList),
    takeLatest(ACTION_TYPES.FETCH_COMPANY_TYPE_LIST, fetchCompanyTypeList),
    takeLatest(ACTION_TYPES.FETCH_CORPORATE_PACKAGE_LIST, fetchCorporatePackageList),
    takeLatest(ACTION_TYPES.DOWNLOAD_PACKAGE_LIST_CSV, downloadPackageListCsv),
    takeLatest(ACTION_TYPES.CREATE_CORPORATE_PACKAGE, createCorporatePackage),
    takeLatest(ACTION_TYPES.FETCH_SERVICE_TYPES, fetchServiceTypes),
    takeLatest(ACTION_TYPES.FETCH_SUB_SERVICE_TYPES, fetchSubServiceTypes),
    takeLatest(ACTION_TYPES.FETCH_PLAN_TYPES, fetchPlanTypes),
    takeLatest(ACTION_TYPES.FETCH_CORPORATE_PROPOSAL_LIST, fetchCorporateProposalList),
    takeLatest(ACTION_TYPES.DOWNLOAD_PROPOSAL_LIST_CSV, downloadProposalListCsv),
    takeLatest(ACTION_TYPES.CREATE_CORPORATE_PROPOSAL, createCorporateProposal),
    takeLatest(ACTION_TYPES.FETCH_PROPOSAL_REVISIONS, fetchProposalRevisions),
    takeLatest(ACTION_TYPES.FETCH_PROPOSAL_DETAILS, fetchProposalDetails),
    takeLatest(ACTION_TYPES.FETCH_ENQUIRY_DETAILS, fetchEnquiryDetails),
    takeLatest(ACTION_TYPES.FETCH_MEETING_HISTORY, fetchMeetingHistory),
    takeLatest(ACTION_TYPES.FETCH_FORWARD_ROLES, fetchForwardRoles),
    takeLatest(ACTION_TYPES.FETCH_ROLE_USERS, fetchRoleUsers),
    takeLatest(ACTION_TYPES.FETCH_ENQUIRY_NOTES, fetchEnquiryNotes),
    takeLatest(ACTION_TYPES.FORWARD_ENQUIRY, forwardEnquiry),
    takeLatest(ACTION_TYPES.SAVE_MEETING, saveMeeting),
    takeLatest(ACTION_TYPES.FETCH_DISPOSITION_LIST, fetchDispositionList),
    takeLatest(ACTION_TYPES.FETCH_REASON_LIST, fetchReasonList),
    takeLatest(ACTION_TYPES.SAVE_DISPOSITION, saveDisposition),
    takeLatest(ACTION_TYPES.UPDATE_DISPOSITION, updateDisposition),
    takeLatest(ACTION_TYPES.FETCH_LOCATION_DISPOSITION, fetchLocationDisposition),
    takeLatest(ACTION_TYPES.SAVE_NOTE, saveNote),
    takeLatest(ACTION_TYPES.UPDATE_CORPORATE_ENQUIRY, updateCorporateEnquirySaga),
    takeLatest(ACTION_TYPES.FETCH_FEASIBILITY_LNP_LIST, fetchFeasibilityLnpList),
    takeLatest(ACTION_TYPES.FETCH_FEASIBILITY_CONNECTED_BY_LIST, fetchFeasibilityConnectedByList),
    takeLatest(ACTION_TYPES.FETCH_NEAREST_POP, fetchNearestPop),
    takeLatest(ACTION_TYPES.SAVE_FEASIBILITY, saveFeasibility),
    takeLatest(ACTION_TYPES.FETCH_NEAREST_LOCATION, fetchNearestLocation),
    takeLatest(ACTION_TYPES.SAVE_NEAREST_LOCATION, saveNearestLocation),
    takeLatest(ACTION_TYPES.UPDATE_NEAREST_LOCATION, updateNearestLocation),
    takeLatest(ACTION_TYPES.FETCH_KYC_DETAILS, fetchKycDetailsSaga),
    takeLatest(ACTION_TYPES.VERIFY_CUSTOMER, verifyCustomer),
    takeLatest(ACTION_TYPES.SAVE_CUSTOMER_BASIC_DETAILS, saveCustomerBasicDetailsSaga),
    takeLatest(ACTION_TYPES.UPDATE_CUSTOMER_BASIC_DETAILS, updateCustomerBasicDetailsSaga),
    takeLatest(ACTION_TYPES.UPDATE_CUSTOMER_PAN_DETAILS, updateCustomerPANDetailsSaga),
    takeLatest(ACTION_TYPES.UPDATE_CUSTOMER_GST_DETAILS, updateCustomerGSTDetailsSaga),
    takeLatest(ACTION_TYPES.SEARCH_CORPORATE_GST_DETAILS, searchCorporateGstDetailsSaga),
    takeLatest(ACTION_TYPES.UPDATE_CORPORATE_PROPOSAL, updateCorporateProposal),
    takeLatest(ACTION_TYPES.CREATE_PURCHASE_ORDER, createPurchaseOrder),
    takeLatest(ACTION_TYPES.FETCH_PO_DETAILS, fetchPurchaseOrderDetailsSaga),
    takeLatest(ACTION_TYPES.UPDATE_PURCHASE_ORDER, updatePurchaseOrderSaga),
    takeLatest(ACTION_TYPES.GENERATE_PO_PDF, generatePoPdfSaga),
    takeLatest(ACTION_TYPES.DELETE_PO_DOCUMENT, deletePurchaseOrderDocumentSaga),
    takeLatest(ACTION_TYPES.FETCH_CIRCUIT_PROVISIONING, fetchCircuitProvisioningSaga),
    takeLatest(ACTION_TYPES.CREATE_CIRCUIT_PROVISIONING, createCircuitProvisioningSaga),
    takeLatest(ACTION_TYPES.UPDATE_CIRCUIT_PROVISIONING, updateCircuitProvisioningSaga),
    takeLatest(ACTION_TYPES.FETCH_CIRCUIT_MULTICAST_TYPES, fetchCircuitMulticastTypesSaga),
    takeLatest(ACTION_TYPES.FETCH_CIRCUIT_SERVICE_PROVIDERS, fetchCircuitServiceProvidersSaga),
    takeLatest(ACTION_TYPES.FETCH_SERVICE_PROVISIONING, fetchServiceProvisioningSaga),
    takeLatest(ACTION_TYPES.CREATE_SERVICE_PROVISIONING, createServiceProvisioningSaga),
    takeLatest(ACTION_TYPES.UPDATE_SERVICE_PROVISIONING, updateServiceProvisioningSaga),
    takeLatest(ACTION_TYPES.APPROVE_SERVICE_PROVISIONING, approveServiceProvisioningSaga),
    takeLatest(ACTION_TYPES.GENERATE_SERVICE_COMMISSIONING_INVOICE, generateServiceCommissioningInvoiceSaga),
    takeLatest(ACTION_TYPES.FETCH_SERVICE_COMMISSIONING_INVOICE, fetchServiceCommissioningInvoiceSaga),
    takeLatest(ACTION_TYPES.FETCH_CORPORATE_PURCHASE_ORDER_LIST, fetchCorporatePurchaseOrderListSaga),
    takeLatest(ACTION_TYPES.DOWNLOAD_CORPORATE_PURCHASE_ORDER_LIST_CSV, downloadCorporatePurchaseOrderListCsv),
    takeLatest(ACTION_TYPES.DELINK_CORPORATE_CUSTOMER, delinkCorporateCustomer),
    takeLatest(ACTION_TYPES.LINK_CORPORATE_CUSTOMER, linkCorporateCustomer),
    takeLatest(ACTION_TYPES.SUBMIT_ENQUIRY_LOCATION, submitEnquiryLocation),
    takeLatest(ACTION_TYPES.UPDATE_ENQUIRY_LOCATION, updateEnquiryLocationSaga),
    takeLatest(ACTION_TYPES.FETCH_ENQUIRY_LOCATION_DETAILS, fetchEnquiryLocationDetailsSaga),
    takeLatest(ACTION_TYPES.FETCH_ENQUIRY_LOCATIONS, fetchEnquiryLocationsSaga),
    takeLatest(ACTION_TYPES.FETCH_LOCATIONS_BY_SEAT, fetchLocationsBySeatSaga),
    takeLatest(ACTION_TYPES.FETCH_PACKAGE_TYPES_LIST, fetchPackageTypesListSaga),
    takeLatest(ACTION_TYPES.FETCH_PACKAGES_LIST, fetchPackagesListSaga),
    takeLatest(ACTION_TYPES.FETCH_ADDITIONAL_SERVICES_LIST, fetchAdditionalServicesListSaga),
    takeEvery(ACTION_TYPES.FETCH_KYC_DOCUMENT, fetchKycDocumentSaga),
    takeEvery(ACTION_TYPES.UPLOAD_KYC_DOCUMENT, uploadKycDocumentSaga),
    takeLatest(ACTION_TYPES.DELETE_KYC_DOCUMENT, deleteKycDocumentSaga),
    takeLatest(ACTION_TYPES.FETCH_ENQUIRY_DISPOSITION_LIST, fetchEnquiryDispositionList),
    takeLatest(ACTION_TYPES.FETCH_RETURN_TO_INFO, fetchReturnToInfo),
    takeLatest(ACTION_TYPES.RETURN_TO_ENQUIRY, returnToEnquiry),
    takeLatest(ACTION_TYPES.ASSIGN_ENQUIRY, assignEnquiry),
    takeLatest(ACTION_TYPES.ASSIGN_ENQUIRY_MULTIPLE, assignEnquiryMultiple),
    takeLatest(ACTION_TYPES.FETCH_ENQUIRY_LOCATIONS_SUMMARY, fetchEnquiryLocationsSummarySaga),
    takeLatest(ACTION_TYPES.FETCH_ENQUIRY_PROPOSALS, fetchEnquiryProposalsSaga),
    takeLatest(ACTION_TYPES.SAVE_ENQUIRY_PROPOSAL, saveEnquiryProposalSaga),
    takeLatest(ACTION_TYPES.CREATE_LOCATION_PROPOSAL, createLocationProposalSaga),
    takeLatest(ACTION_TYPES.UPDATE_LOCATION_PROPOSAL, updateLocationProposalSaga),
    takeLatest(ACTION_TYPES.BULK_UPDATE_PROPOSALS, bulkUpdateProposalsSaga),
    takeLatest(ACTION_TYPES.CREATE_CORPORATE_PROPOSAL_SEND, createCorporateProposalSendSaga),
    takeLatest(ACTION_TYPES.SEND_CORPORATE_PROPOSAL, sendCorporateProposalSaga),
    takeLatest(ACTION_TYPES.FETCH_CORPORATE_PROPOSAL_SEND, fetchCorporateProposalSendSaga),
    takeLatest(ACTION_TYPES.FETCH_PROPOSAL_SEND_PREVIEW, fetchProposalSendPreviewSaga),
    takeLatest(ACTION_TYPES.UPDATE_PROPOSAL_STATUS, updateProposalStatusSaga),
    takeLatest(ACTION_TYPES.FETCH_PROPOSAL_DISPATCH, fetchProposalDispatchSaga),
    takeLatest(ACTION_TYPES.SEND_EMAIL_PROPOSAL_DISPATCH, sendEmailProposalDispatchSaga),
    takeLatest(ACTION_TYPES.SEND_DIRECT_PROPOSAL_DISPATCH, sendDirectProposalDispatchSaga),
    takeLatest(ACTION_TYPES.CORPORATE_LOCATION_UPLOAD, corporateLocationUploadSaga),
    takeLatest(ACTION_TYPES.DOWNLOAD_LOCATION_CSV_TEMPLATE, downloadLocationCsvTemplateSaga),
    takeLatest(ACTION_TYPES.FETCH_ENQUIRY_SUMMARY_WITH_PROPOSALS, fetchEnquirySummaryWithProposalsSaga),
    takeLatest(ACTION_TYPES.FETCH_PROPOSALS_BY_ENQUIRY, fetchProposalsByEnquirySaga),
    takeLatest(ACTION_TYPES.FETCH_ENQUIRY_SUMMARY_WITH_PO, fetchEnquirySummaryWithPoSaga),
    takeLatest(ACTION_TYPES.FETCH_PO_BY_ENQUIRY, fetchPoByEnquirySaga),
    takeLatest(
      ACTION_TYPES.FETCH_ENQUIRY_SUMMARY_WITH_CIRCUIT_PROVISIONING,
      fetchEnquirySummaryWithCircuitProvisioningSaga
    ),
    takeLatest(ACTION_TYPES.FETCH_SERVICE_COMMISSIONING_BY_ENQUIRY, fetchServiceCommissioningByEnquirySaga),
    takeLatest(ACTION_TYPES.FETCH_NEXT_STEP_USERS, fetchNextStepUsersSaga),
    takeLatest(ACTION_TYPES.FORWARD_NEXT_STEP, forwardNextStepSaga)
  ]);
}

function* fetchNextStepUsersSaga(action) {
  try {
    const { onSuccess, ...payload } = action?.payload || {};
    const { response, error } = yield call(handleAPIRequest, api.fetchNextStepUsersApi, payload);
    if (response && !error && isEmpty(response?.error)) {
      if (onSuccess) onSuccess(response?.data);
    }
  } catch (error) {
    console.error(error);
  }
}

function* forwardNextStepSaga(action) {
  const { onSuccess, ...payload } = action.payload;
  yield put(sliceActions.setForwardEnquiryLoading(true));
  try {
    const { response, error } = yield call(handleAPIRequest, api.forwardNextStepApi, payload);
    if (response && !error && isEmpty(response?.error)) {
      yield call(successToast, { title: 'success', description: response?.message || t('saveSuccess') });
      const tokenData = getTokenData(STORAGE_KEYS.AUTH_TOKEN);
      const seatId = tokenData?.seatId ?? null;
      yield put({ type: ACTION_TYPES.FETCH_CORPORATE_ENQUIRY_LIST, payload: { ...(seatId && { seatId }) } });
      if (onSuccess) onSuccess();
    }
  } catch (e) {
    console.error(e);
  } finally {
    yield put(sliceActions.setForwardEnquiryLoading(false));
  }
}

function* fetchEnquirySummaryWithProposalsSaga(action) {
  yield put(sliceActions.setEnquirySummaryWithProposalsLoading(true));
  const { response } = yield call(handleAPIRequest, api.fetchEnquirySummaryWithProposalsApi, action.payload || {});
  if (response?.data) {
    const list = Array.isArray(response.data) ? response.data : (response.data?.content ?? response.data?.data ?? []);
    yield put(sliceActions.setEnquirySummaryWithProposals(list));
  } else {
    yield put(sliceActions.setEnquirySummaryWithProposalsLoading(false));
  }
}

function* fetchEnquirySummaryWithPoSaga(action) {
  yield put(sliceActions.setEnquirySummaryWithPoLoading(true));
  const { response } = yield call(handleAPIRequest, api.fetchEnquirySummaryWithPoApi, action.payload || {});
  if (response?.data) {
    const list = Array.isArray(response.data) ? response.data : (response.data?.content ?? response.data?.data ?? []);
    yield put(sliceActions.setEnquirySummaryWithPo(list));
  } else {
    yield put(sliceActions.setEnquirySummaryWithPoLoading(false));
  }
}

function* fetchEnquirySummaryWithCircuitProvisioningSaga(action) {
  yield put(sliceActions.setEnquirySummaryWithCircuitProvisioningLoading(true));
  const { response } = yield call(
    handleAPIRequest,
    api.fetchEnquirySummaryWithCircuitProvisioningApi,
    action.payload || {}
  );
  if (response?.data) {
    const list = Array.isArray(response.data) ? response.data : (response.data?.content ?? response.data?.data ?? []);
    yield put(sliceActions.setEnquirySummaryWithCircuitProvisioning(list));
  } else {
    yield put(sliceActions.setEnquirySummaryWithCircuitProvisioningLoading(false));
  }
}

function* fetchServiceCommissioningByEnquirySaga(action) {
  yield put(sliceActions.setServiceCommissioningByEnquiryLoading(true));
  const { payload: { enquiryId, ...rest } = {} } = action;
  const { response } = yield call(handleAPIRequest, api.fetchServiceCommissioningByEnquiryApi, { enquiryId, ...rest });
  if (response?.data) {
    const list = Array.isArray(response.data) ? response.data : (response.data?.content ?? response.data?.data ?? []);
    yield put(sliceActions.setServiceCommissioningByEnquiry(list));
  } else {
    yield put(sliceActions.setServiceCommissioningByEnquiryLoading(false));
  }
}

function* fetchProposalsByEnquirySaga(action) {
  const { payload: { key, ...data } = {} } = action;
  let payload = data;
  if (key) {
    const paginationDetails = yield select(getServerSidePaginationDetails);
    const { page = 0, size = 10 } = selectorWithKey(paginationDetails, key) || {};
    payload = { page, size, ...payload };
  }
  yield call(setCommonPaginationResponse, key, { payload });
  const { response } = yield call(handleAPIRequest, api.fetchProposalsByEnquiryApi, payload);
  if (key && response) {
    yield call(setCommonPaginationResponse, key, { ...response });
    const content = response?.data?.content || [];
    const page = payload.page || 0;
    const size = payload.size || 10;
    yield put(
      sliceActions.setTableData({
        tableKey: key,
        data: content.map((item, idx) => ({ ...item, slNo: page * size + idx + 1 }))
      })
    );
  }
}

function* fetchPoByEnquirySaga(action) {
  const { payload: { key, ...data } = {} } = action;
  let payload = data;
  if (key) {
    const paginationDetails = yield select(getServerSidePaginationDetails);
    const { page = 0, size = 10 } = selectorWithKey(paginationDetails, key) || {};
    payload = { page, size, ...payload };
  }
  yield call(setCommonPaginationResponse, key, { payload });
  const { response } = yield call(handleAPIRequest, api.fetchPoByEnquiryApi, payload);
  if (key && response) {
    yield call(setCommonPaginationResponse, key, { ...response });
    const content = response?.data?.content || [];
    const page = payload.page || 0;
    const size = payload.size || 10;
    yield put(
      sliceActions.setTableData({
        tableKey: key,
        data: content.map((item, idx) => ({ ...item, slNo: page * size + idx + 1 }))
      })
    );
  }
}
