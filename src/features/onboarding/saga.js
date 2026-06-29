import { t } from 'i18next';
import { isEmpty } from 'lodash-es';
import { all, call, put, select, takeLatest } from 'redux-saga/effects';

import { successToast } from '@/components/custom/Toast';
import { SERVER_SIDE_TABLE_KEYS } from '@/constants/server_table';
import { actions as apiProgressActions } from '@/features/others/ApiProgress/slice';
import { setCommonPaginationResponse } from '@/features/others/Pagination/saga';
import { getServerSideFilterDetails, getServerSidePaginationDetails } from '@/features/others/Pagination/selectors';
import { router } from '@/routes/routes';
import { selectorWithKey } from '@/utils/commonUtils';
import { handleAPIRequest } from '@/utils/httpUtils';
import { commonListSaga } from '@/utils/sagaUtils';

import { ACTION_TYPES, API_ACTION_TYPE_VARIANTS } from './action';
import * as api from './api';
import { DOCUMENT_TYPE_MAP } from './constants';
import { getBasicDetailsResponse, getonboardingFormDetails } from './selector';
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
  const { response, error } = yield call(handleAPIRequest, apiFn, payload);
  if (actionType) yield put(apiProgressActions.setProgress({ key: actionType, isLoading: false }));

  if (error) {
    console.error('API Error:', error);
    return { error };
  }

  if (key && response) {
    if (!isDropdown) {
      yield call(setCommonPaginationResponse, key, response);
      yield put(
        sliceActions.setTableData({ tableKey: key, data: response?.data?.content || response?.data || response })
      );
    }
  }

  return response;
}

export function* submitOnboardingBasicDetails(action) {
  try {
    const { id, onSuccess } = action?.payload || {};
    const apiCall = id ? api.updateOnboardingBasicDetailsApi : api.onboardingBasicDetailsApi;
    const { response, error } = yield call(handleAPIRequest, apiCall, action?.payload);

    if (response && !error && isEmpty(response?.error)) {
      yield call(successToast, { title: 'success', description: response?.message || t('saveSuccess') });
      if (onSuccess) onSuccess();
    }
  } catch (error) {
    console.log(error);
  }
}

export function* submitOnboardingAgreementDetails(action) {
  try {
    const { onSuccess, id } = action?.payload || {};
    const { response, error } = yield call(handleAPIRequest, api.onboardingAgreementDetailsApi, action?.payload);

    if (response && !error && isEmpty(response?.error)) {
      yield call(successToast, { title: 'success', description: response?.message || t('saveSuccess') });
      if (id) {
        yield call(fetchOnboardingDetails, { payload: { id } });
      }
      if (onSuccess) {
        onSuccess();
      }
    }
  } catch (error) {
    console.log(error);
  }
}

export function* submitOnboardingBankDetails(action) {
  try {
    const { onSuccess, ...data } = action?.payload || {};
    const { response, error } = yield call(handleAPIRequest, api.onboardingBankDetailsApi, action?.payload);

    if (response && !error && isEmpty(response?.error)) {
      yield put(sliceActions.setOnboardingFormDetails(data));
      yield call(successToast, { title: 'success', description: response?.message || t('saveSuccess') });
      if (onSuccess) onSuccess();
    }
  } catch (error) {
    console.log(error);
  }
}

export function* submitOnboardingKycGstDetails(action) {
  try {
    const { onSuccess, ...data } = action?.payload || {};
    const { response, error } = yield call(handleAPIRequest, api.onboardingKycGstDetailsApi, data);

    if (response && !error && isEmpty(response?.error)) {
      yield put(sliceActions.setOnboardingFormDetails(data));
      yield call(successToast, { title: 'success', description: response?.message || t('saveSuccess') });
      if (onSuccess) onSuccess();
    }
  } catch (error) {
    console.log(error);
  }
}

export function* submitOnboardingSupportingDocuments(action) {
  const progressKey = ACTION_TYPES.ONBOARDING_SUPPORTING_DOCUMENTS_SUBMIT;
  try {
    const {
      data: { id }
    } = yield select(getBasicDetailsResponse);
    const { agreementType } = yield select(getonboardingFormDetails);

    const { files } = action?.payload || {};
    if (!id) return;

    yield put(apiProgressActions.setProgress({ key: progressKey, isLoading: true }));

    const storageKey = `onboarding_uploads_${id}`;
    const uploadStatus = JSON.parse(localStorage.getItem(storageKey) || '{}');

    let allProcessedSuccessfully = true;
    let anyNewUploads = false;

    for (const key in files) {
      if (files[key] && DOCUMENT_TYPE_MAP[key]) {
        if (uploadStatus[key]) {
          console.log(`Skipping already uploaded file: ${key}`);
          continue;
        }

        anyNewUploads = true;
        const payload = {
          id,
          type: DOCUMENT_TYPE_MAP[key],
          file: files[key]
        };

        const { response, error } = yield call(handleAPIRequest, api.onboardingDocumentUploadApi, payload);

        if (!error && response && isEmpty(response?.error)) {
          uploadStatus[key] = true;
          localStorage.setItem(storageKey, JSON.stringify(uploadStatus));
        } else {
          allProcessedSuccessfully = false;
          console.error(`Failed to upload ${key}`, error || response?.error);
        }
      }
    }

    if (!anyNewUploads) {
      yield call(successToast, { title: t('information'), description: 'All files are already uploaded.' });
    } else if (allProcessedSuccessfully) {
      yield call(successToast, { title: 'success', description: t('saveSuccess') });
      if (agreementType === 'AGNP') {
        router.navigate({ to: '/app/agnp-list' });
      } else {
        router.navigate({ to: '/app/lnp-list' });
      }
    } else {
      console.warn('Some files failed to upload. They will be retried on next submission.');
    }
  } catch (error) {
    console.log(error);
  } finally {
    yield put(apiProgressActions.setProgress({ key: progressKey, isLoading: false }));
  }
}

export function* submitOnboardingSingleDocument(action) {
  const { files, fieldName, id: payloadId, onSuccess: onUploadSuccess } = action?.payload || {};
  const progressKey = `${ACTION_TYPES.ONBOARDING_SUPPORTING_DOCUMENTS_SUBMIT}_${fieldName}`;

  try {
    const basicDetails = yield select(getBasicDetailsResponse);
    const formDetails = yield select(getonboardingFormDetails);

    const id = payloadId || basicDetails?.data?.id || formDetails?.id;

    if (!id || !files || !files[fieldName]) return;

    yield put(apiProgressActions.setProgress({ key: progressKey, isLoading: true }));

    const payload = {
      id,
      type: DOCUMENT_TYPE_MAP[fieldName],
      file: files[fieldName]
    };

    const { response, error } = yield call(handleAPIRequest, api.onboardingDocumentUploadApi, payload);

    if (!error && response && isEmpty(response?.error)) {
      const uploadedFileId = response?.data?.documentUrl || response?.data?.fileId;
      if (uploadedFileId) {
        yield put(
          sliceActions.setOnboardingFormDetails({
            supportingDocuments: {
              ...(formDetails?.supportingDocuments || {}),
              [fieldName]: uploadedFileId
            }
          })
        );
      }
      yield call(successToast, { title: 'success', description: response?.message || t('fileUploadedSuccess') });
      if (onUploadSuccess) {
        onUploadSuccess(response?.data);
      }
    } else {
      console.error(`Failed to upload ${fieldName}`, error || response?.error);
    }
  } catch (error) {
    console.log(error);
  } finally {
    yield put(apiProgressActions.setProgress({ key: progressKey, isLoading: false }));
  }
}

export function* fetchDistributorField() {
  try {
    yield call(handleAPIRequest, api.fetchDistributorFieldApi);
  } catch (error) {
    console.error(error);
  }
}

export function* searchOnboardingGstDetails(action) {
  try {
    yield call(handleAPIRequest, api.searchOnboardingGstDetailsApi, action?.payload);
  } catch (error) {
    console.error(error);
  }
}

export function* fetchOnboardingPopName() {
  try {
    yield call(handleAPIRequest, api.fetchOnboardingPopNameApi);
  } catch (error) {
    console.error(error);
  }
}

export function* fetchOnboardingPincode() {
  try {
    yield call(handleAPIRequest, api.fetchOnboardingPincodeApi);
  } catch (error) {
    console.error(error);
  }
}

export function* fetchOnboardingPostoffice(action) {
  try {
    const { onSuccess } = action?.payload || {};
    const { response, error } = yield call(handleAPIRequest, api.fetchOnboardingPostofficeApi, action?.payload);
    if (onSuccess) {
      if (response && !error) {
        onSuccess(response?.data || []);
      } else {
        // Call onSuccess with empty array if 404 or other error occurs,
        // allowing the component to show the "Proper Kerala PIN code" error.
        onSuccess([]);
      }
    }
  } catch (error) {
    console.error(error);
  }
}

export function* fetchOnboardingIfscDetails(action) {
  try {
    yield call(handleAPIRequest, api.fetchOnboardingIfscDetailsApi, action?.payload);
  } catch (error) {
    console.error(error);
  }
}

export function* fetchOnboardingCompanyNature(action) {
  try {
    yield call(handleAPIRequest, api.fetchOnboardingCompanyNatureApi, action?.payload);
  } catch (error) {
    console.error(error);
  }
}

export function* fetchOnboardingBankAccountType(action) {
  try {
    yield call(handleAPIRequest, api.fetchOnboardingBankAccountTypeApi, action?.payload);
  } catch (error) {
    console.error(error);
  }
}

export function* fetchOnboardingSharePlan(action) {
  try {
    yield call(handleAPIRequest, api.fetchOnboardingSharePlanApi, action?.payload);
  } catch (error) {
    console.error(error);
  }
}

export function* fetchLnpPartnersList({ payload = {} }) {
  yield* commonListSaga(
    payload,
    api.fetchLnpPartnersListApi,
    API_ACTION_TYPE_VARIANTS[ACTION_TYPES.LNP_PARTNERS_LIST_FETCH]
  );
}

export function* fetchPartnersAll({ payload = {} }) {
  yield* commonListSaga(payload, api.fetchPartnersAllApi, API_ACTION_TYPE_VARIANTS[ACTION_TYPES.PARTNERS_FETCH_ALL]);
}

export function* fetchLnpPartnerStatusDropdown(action) {
  try {
    yield call(handleAPIRequest, api.fetchLnpPartnerStatusDropdownApi, action?.payload);
  } catch (error) {
    console.error(error);
  }
}

export function* updateLnpPartner(action) {
  try {
    const { onSuccess, ...payloadData } = action?.payload || {};
    const { response, error } = yield call(handleAPIRequest, api.updateLnpPartnerApi, payloadData);

    if (response && !error && isEmpty(response?.error)) {
      yield call(successToast, { title: 'success', description: response?.message || t('updateSuccess') });

      const filterDetails = yield select(getServerSideFilterDetails);
      const currentFilters = selectorWithKey(filterDetails, SERVER_SIDE_TABLE_KEYS.LNP_PARTNERS_LIST_TABLE) || {};
      const payload = { type: 'lnp', ...currentFilters, key: SERVER_SIDE_TABLE_KEYS.LNP_PARTNERS_LIST_TABLE };
      yield put({ type: ACTION_TYPES.LNP_PARTNERS_LIST_FETCH, payload });

      if (onSuccess) {
        onSuccess();
      }
    }
  } catch (error) {
    console.log(error);
  }
}

export function* fetchAgnpPartnersList({ payload = {} }) {
  yield* commonListSaga(
    payload,
    api.fetchAgnpPartnersListApi,
    API_ACTION_TYPE_VARIANTS[ACTION_TYPES.AGNP_PARTNERS_LIST_FETCH]
  );
}

export function* updateAgnpPartner(action) {
  try {
    const { onSuccess, ...payloadData } = action?.payload || {};
    const { response, error } = yield call(handleAPIRequest, api.updateAgnpPartnerApi, payloadData);

    if (response && !error && isEmpty(response?.error)) {
      yield call(successToast, { title: 'success', description: response?.message || t('updateSuccess') });

      const filterDetails = yield select(getServerSideFilterDetails);
      const currentFilters = selectorWithKey(filterDetails, SERVER_SIDE_TABLE_KEYS.AGNP_PARTNERS_LIST_TABLE) || {};
      const payload = { type: 'agnp', ...currentFilters, key: SERVER_SIDE_TABLE_KEYS.AGNP_PARTNERS_LIST_TABLE };
      yield put({ type: ACTION_TYPES.AGNP_PARTNERS_LIST_FETCH, payload });

      if (onSuccess) {
        onSuccess();
      }
    }
  } catch (error) {
    console.log(error);
  }
}

export function* fetchVlanMappingData(action) {
  const { payload } = action;
  yield* listSaga(
    { ...action, payload: { ...payload, key: SERVER_SIDE_TABLE_KEYS.VLAN_ASSOCIATION_TABLE } },
    api.fetchVlanMappingDataApi
  );
}

export function* fetchVlanRequestData(action) {
  const { payload } = action;
  yield* listSaga(
    { ...action, payload: { ...payload, key: SERVER_SIDE_TABLE_KEYS.VLAN_REQUEST_TABLE } },
    api.fetchVlanRequestDataApi
  );
}

export function* submitVlanRequest(action) {
  try {
    const { onSuccess, ...data } = action?.payload || {};

    const { response, error } = yield call(handleAPIRequest, api.submitVlanRequestApi, data);

    if (response && !error && isEmpty(response?.error)) {
      yield call(successToast, { title: 'success', description: response?.message || t('saveSuccess') });

      if (onSuccess) {
        onSuccess();
      }

      yield call(fetchVlanRequestData, { payload: { key: SERVER_SIDE_TABLE_KEYS.VLAN_REQUEST_TABLE } });
    }
  } catch (error) {
    console.log(error);
  }
}

export function* submitVlanMapping(action) {
  try {
    const { onSuccess, ...data } = action?.payload || {};
    const { response, error } = yield call(handleAPIRequest, api.submitVlanMappingApi, data);

    if (response && !error && isEmpty(response?.error)) {
      yield call(successToast, { title: 'success', description: response?.message || t('saveSuccess') });

      if (onSuccess) {
        onSuccess();
      }

      yield call(fetchVlanMappingData, { payload: { key: SERVER_SIDE_TABLE_KEYS.VLAN_ASSOCIATION_TABLE } });
    }
  } catch (error) {
    console.log(error);
  }
}

export function* updateVlanMapping(action) {
  try {
    const { onSuccess, ...data } = action?.payload || {};
    const { response, error } = yield call(handleAPIRequest, api.updateVlanMappingApi, data);

    if (response && !error && isEmpty(response?.error)) {
      yield call(successToast, { title: 'success', description: response?.message || t('saveSuccess') });

      if (onSuccess) {
        onSuccess();
      }

      yield call(fetchVlanMappingData, { payload: { key: SERVER_SIDE_TABLE_KEYS.VLAN_ASSOCIATION_TABLE } });
    }
  } catch (error) {
    console.log(error);
  }
}

export function* fetchVlanTypeList() {
  yield call(handleAPIRequest, api.fetchVlanTypeListApi);
}

export function* fetchVlanPartnerList(action) {
  yield call(handleAPIRequest, api.fetchPartnerListApi, action?.payload);
}

export function* fetchOnboardingDetails(action) {
  try {
    const { response, error } = yield call(handleAPIRequest, api.fetchOnboardingDetailsApi, action?.payload);
    if (response && !error && isEmpty(response?.error)) {
      yield put(sliceActions.setOnboardingFormDetails(response?.data));
    }
  } catch (error) {
    console.error(error);
  }
}

export function* fetchPartnerEnquiry(action) {
  try {
    const { response, error } = yield call(handleAPIRequest, api.fetchPartnerEnquiryApi, action?.payload);
    if (response && !error && isEmpty(response?.error)) {
      const { partnerOnboardId } = response?.data || {};
      if (partnerOnboardId) {
        yield call(fetchOnboardingDetails, { payload: { id: partnerOnboardId } });
      } else {
        let data = response?.data;
        const { type } = action?.payload || {};

        if (type === 'agnp' || data?.agnpId) {
          data = {
            ...data,
            companyName: data?.agnpName,
            keyContactName: data?.agnpContactName,
            email: data?.agnpEmail,
            keyContactNumber: data?.agnpMobileNumber,
            alternatePhone: data?.agnpAltrContactNumber,
            addressLine1: data?.agnpAddress,
            pinCode: data?.agnpPincode,
            postOffice: data?.agnpPostoffice,
            district: data?.agnpDistrict,
            city: data?.agnpLocation,
            agreementType: 'AGNP'
          };
        }
        yield put(sliceActions.setOnboardingFormDetails(data));
      }
    }
  } catch (error) {
    console.error(error);
  }
}

export function* fetchSingleOnboardingData(action) {
  const { response } = yield call(handleAPIRequest, api.singleOnboardingDataApi, action.payload);
  yield put(sliceActions.setSingleOnboardingData(response?.data));
}

export function* resetPassword(action) {
  const { response, error } = yield call(handleAPIRequest, api.resetPasswordApi, action.payload);

  if (response && !error && isEmpty(response?.error)) {
    yield call(successToast, { title: 'success', description: response?.message || t('saveSuccess') });
  }
}

export function* downloadAgnpListCsv(action) {
  yield call(handleAPIRequest, api.downloadAgnpListCsvApi, action.payload);
}

export function* downloadPartnerListCsv(action) {
  yield call(handleAPIRequest, api.downloadPartnerListCsvApi, action.payload);
}

export const downloadPartnerEnquiryCsv = function* (action) {
  yield call(handleAPIRequest, api.downloadPartnerEnquiryCsvApi, action.payload);
};

export const downloadVlanMappingsCsv = function* (action) {
  yield call(handleAPIRequest, api.downloadVlanMappingsCsvApi, action.payload);
};

export function* addServiceArea(action) {
  const { id, onSuccess, postOffices } = action?.payload || {};
  const { response, error } = yield call(handleAPIRequest, api.addServiceAreaApi, { id, postOffices });

  if (response && !error && (!response?.error || Object.keys(response.error).length === 0)) {
    yield call(successToast, { title: 'success', description: response?.message || t('saveSuccess') });
    yield call(fetchPartnerDetailsByIdSaga, { payload: id });
    if (onSuccess) {
      yield call(onSuccess);
    }
  }
}

export function* fetchOltDeviceList(action) {
  yield call(handleAPIRequest, api.fetchOltDeviceListApi, action.payload);
}

export function* fetchPartnerDetailsByIdSaga(action) {
  const { response } = yield call(handleAPIRequest, api.fetchPartnerDetailsByIdApi, action.payload);
  yield put(sliceActions.setPartnerDetails(response?.data || null));
}

export function* updatePartnerDetailsSaga(action) {
  try {
    const { onSuccess, ...payloadData } = action?.payload || {};
    const { response, error } = yield call(handleAPIRequest, api.updatePartnerDetailsApi, payloadData);

    if (response && !error && isEmpty(response?.error)) {
      yield call(successToast, { title: 'success', description: response?.message || t('updateSuccess') });
      yield call(fetchPartnerDetailsByIdSaga, { payload: payloadData.id });
      if (onSuccess) onSuccess();
    }
  } catch (error) {
    console.log(error);
  }
}

export function* updateOnboardingPopSaga(action) {
  try {
    const { onSuccess, ...payloadData } = action?.payload || {};
    const { response, error } = yield call(handleAPIRequest, api.updateOnboardingPopApi, payloadData);

    if (response && !error && isEmpty(response?.error)) {
      yield call(successToast, { title: 'success', description: response?.message || t('updateSuccess') });
      yield call(fetchPartnerDetailsByIdSaga, { payload: payloadData.id });
      if (onSuccess) onSuccess();
    }
  } catch (error) {
    console.log(error);
  }
}

export function* fetchLinkTypeOptionsSaga() {
  yield call(handleAPIRequest, api.fetchLinkTypeOptionsApi);
}

export function* fetchLinkEstablishmentStatusOptionsSaga() {
  yield call(handleAPIRequest, api.fetchLinkEstablishmentStatusOptionsApi);
}

export function* fetchFrcReceivedOptionsSaga() {
  yield call(handleAPIRequest, api.fetchFrcReceivedOptionsApi);
}

export function* submitOnboardingSaga(action) {
  try {
    const { onSuccess, onError, ...payloadData } = action?.payload || {};
    const { response, error } = yield call(handleAPIRequest, api.submitOnboardingApi, payloadData);

    if (response && !error && isEmpty(response?.error)) {
      yield call(successToast, {
        title: 'success',
        description: response?.message || t('onboardingSubmittedSuccessfully')
      });
      if (onSuccess) onSuccess();
      router.navigate({ to: '/app/partners/list' });
    } else {
      if (onError) onError();
    }
  } catch (error) {
    const { onError } = action?.payload || {};
    if (onError) onError();
    console.log(error);
  }
}

export function* fileStorageUploadSaga(action) {
  const { file, module, entityId, fieldName, onSuccess, onError } = action?.payload || {};
  const progressKey = `${ACTION_TYPES.FILE_STORAGE_UPLOAD}_${fieldName}`;

  try {
    yield put(apiProgressActions.setProgress({ key: progressKey, isLoading: true }));
    const { response, error } = yield call(handleAPIRequest, api.fileStorageUploadApi, {
      file,
      module,
      entityId
    });

    if (!error && response?.data?.fileId) {
      yield call(successToast, { title: 'success', description: t('fileUploadedSuccess') });
      if (onSuccess) onSuccess(response.data.fileId);
    } else {
      if (onError) onError();
    }
  } catch (err) {
    console.error(err);
    if (onError) onError();
  } finally {
    yield put(apiProgressActions.setProgress({ key: progressKey, isLoading: false }));
  }
}

export function* fileStorageDeleteSaga(action) {
  const { fileId, fieldName, onSuccess, onError } = action?.payload || {};
  const progressKey = `${ACTION_TYPES.FILE_STORAGE_DELETE}_${fieldName}`;

  try {
    yield put(apiProgressActions.setProgress({ key: progressKey, isLoading: true }));
    const { response, error } = yield call(handleAPIRequest, api.fileStorageDeleteApi, fileId);

    if (!error && isEmpty(response?.error)) {
      if (onSuccess) onSuccess();
    } else {
      if (onError) onError();
    }
  } catch (err) {
    console.error(err);
    if (onError) onError();
  } finally {
    yield put(apiProgressActions.setProgress({ key: progressKey, isLoading: false }));
  }
}

export function* fileStorageViewUrlSaga(action) {
  const { fileId, onSuccess, onError } = action?.payload || {};

  try {
    const { response, error } = yield call(handleAPIRequest, api.fileStorageViewUrlApi, fileId);

    if (!error && response?.data?.url) {
      if (onSuccess) onSuccess({ url: response.data.url, contentType: response.data.contentType });
    } else {
      if (onError) onError();
    }
  } catch (err) {
    console.error(err);
    if (onError) onError();
  }
}

export function* deleteOnboardingDocumentSaga(action) {
  const { fileId, documentType, fieldName, onSuccess, onError } = action?.payload || {};
  const progressKey = `${ACTION_TYPES.ONBOARDING_DOCUMENT_DELETE}_${fieldName}`;

  try {
    yield put(apiProgressActions.setProgress({ key: progressKey, isLoading: true }));
    const { response, error } = yield call(handleAPIRequest, api.deleteOnboardingDocumentApi, { fileId, documentType });

    if (!error && isEmpty(response?.error)) {
      if (onSuccess) onSuccess();
    } else {
      if (onError) onError();
    }
  } catch (err) {
    console.error(err);
    if (onError) onError();
  } finally {
    yield put(apiProgressActions.setProgress({ key: progressKey, isLoading: false }));
  }
}

export function* fetchPartnerForwardUsers(action) {
  try {
    yield call(handleAPIRequest, api.fetchPartnerForwardUsersApi, action.payload);
  } catch (error) {
    console.error(error);
  }
}

export function* forwardPartnerEnquiry(action) {
  try {
    const { onSuccess, ...payloadData } = action?.payload || {};
    const { response, error } = yield call(handleAPIRequest, api.forwardPartnerEnquiryApi, payloadData);

    if (response && !error && isEmpty(response?.error)) {
      yield call(successToast, { title: 'success', description: response?.message || t('updateSuccess') });

      const filterDetails = yield select(getServerSideFilterDetails);
      const currentFilters = selectorWithKey(filterDetails, SERVER_SIDE_TABLE_KEYS.LNP_PARTNERS_LIST_TABLE) || {};
      const payload = {
        type: 'lnp',
        forwardType: payloadData.forwardType,
        ...currentFilters,
        key: SERVER_SIDE_TABLE_KEYS.LNP_PARTNERS_LIST_TABLE
      };
      yield put({ type: ACTION_TYPES.LNP_PARTNERS_LIST_FETCH, payload });

      if (onSuccess) onSuccess();
    }
  } catch (error) {
    console.log(error);
  }
}

export function* forwardAgnpEnquiry(action) {
  try {
    const { onSuccess, ...payloadData } = action?.payload || {};
    const { response, error } = yield call(handleAPIRequest, api.forwardAgnpEnquiryApi, payloadData);

    if (response && !error && isEmpty(response?.error)) {
      yield call(successToast, { title: 'success', description: response?.message || t('updateSuccess') });

      const filterDetails = yield select(getServerSideFilterDetails);
      const currentFilters = selectorWithKey(filterDetails, SERVER_SIDE_TABLE_KEYS.AGNP_PARTNERS_LIST_TABLE) || {};
      const payload = {
        type: 'agnp',
        forwardType: payloadData.forwardType,
        ...currentFilters,
        key: SERVER_SIDE_TABLE_KEYS.AGNP_PARTNERS_LIST_TABLE
      };
      yield put({ type: ACTION_TYPES.AGNP_PARTNERS_LIST_FETCH, payload });

      if (onSuccess) onSuccess();
    }
  } catch (error) {
    console.log(error);
  }
}

export function* assignEnquiry(action) {
  try {
    const { onSuccess, ...payloadData } = action?.payload || {};
    const { response, error } = yield call(handleAPIRequest, api.assignEnquiryApi, payloadData);

    if (response && !error && isEmpty(response?.error)) {
      yield call(successToast, { title: 'success', description: response?.message || t('updateSuccess') });
      if (onSuccess) onSuccess();
      const isAgnp = payloadData.type === 'AGNP';
      const tableKey = isAgnp
        ? SERVER_SIDE_TABLE_KEYS.AGNP_PARTNERS_LIST_TABLE
        : SERVER_SIDE_TABLE_KEYS.LNP_PARTNERS_LIST_TABLE;
      const filterDetails = yield select(getServerSideFilterDetails);
      const currentFilters = selectorWithKey(filterDetails, tableKey) || {};
      const listPayload = {
        type: isAgnp ? 'agnp' : 'lnp',
        forwardType: 'inbox',
        ...currentFilters,
        key: tableKey
      };
      const listActionType = isAgnp ? ACTION_TYPES.AGNP_PARTNERS_LIST_FETCH : ACTION_TYPES.LNP_PARTNERS_LIST_FETCH;
      yield put({ type: listActionType, payload: listPayload });
    }
  } catch (error) {
    console.log(error);
  }
}

export function* assignEnquiryToPreviousUser(action) {
  try {
    const { onSuccess, forwardType, ...payloadData } = action?.payload || {};
    const { response, error } = yield call(handleAPIRequest, api.assignEnquiryToPreviousUserApi, {
      enquiryId: payloadData.enquiryId,
      type: payloadData.type
    });

    if (response && !error && isEmpty(response?.error)) {
      yield call(successToast, { title: 'success', description: response?.message || t('updateSuccess') });
      if (onSuccess) onSuccess();

      const isAgnp = payloadData.type === 'AGNP';
      const tableKey = isAgnp
        ? SERVER_SIDE_TABLE_KEYS.AGNP_PARTNERS_LIST_TABLE
        : SERVER_SIDE_TABLE_KEYS.LNP_PARTNERS_LIST_TABLE;
      const filterDetails = yield select(getServerSideFilterDetails);
      const currentFilters = selectorWithKey(filterDetails, tableKey) || {};
      const listPayload = {
        type: isAgnp ? 'agnp' : 'lnp',
        forwardType: forwardType || 'inbox',
        ...currentFilters,
        key: tableKey
      };
      const listActionType = isAgnp ? ACTION_TYPES.AGNP_PARTNERS_LIST_FETCH : ACTION_TYPES.LNP_PARTNERS_LIST_FETCH;
      yield put({ type: listActionType, payload: listPayload });
    }
  } catch (error) {
    console.log(error);
  }
}

export default function* onboardingSaga() {
  yield all([
    takeLatest(ACTION_TYPES.FETCH_ONBOARDING_DETAILS, fetchOnboardingDetails),
    takeLatest(ACTION_TYPES.ONBOARDING_BASIC_DETAILS_SUBMIT, submitOnboardingBasicDetails),
    takeLatest(ACTION_TYPES.ONBOARDING_AGREEMENT_DETAILS_SUBMIT, submitOnboardingAgreementDetails),
    takeLatest(ACTION_TYPES.ONBOARDING_BANK_DETAILS_SUBMIT, submitOnboardingBankDetails),
    takeLatest(ACTION_TYPES.DISTRIBUTOR_FIELD_FETCH, fetchDistributorField),
    takeLatest(ACTION_TYPES.ONBOARDING_KYC_GST_DETAILS_SUBMIT, submitOnboardingKycGstDetails),
    takeLatest(ACTION_TYPES.ONBOARDING_SUPPORTING_DOCUMENTS_SUBMIT, submitOnboardingSupportingDocuments),
    takeLatest(ACTION_TYPES.ONBOARDING_SINGLE_DOCUMENT_SUBMIT, submitOnboardingSingleDocument),
    takeLatest(ACTION_TYPES.ONBOARDING_GST_DETAILS_SEARCH, searchOnboardingGstDetails),
    takeLatest(ACTION_TYPES.LNP_PARTNERS_LIST_FETCH, fetchLnpPartnersList),
    takeLatest(ACTION_TYPES.LNP_PARTNER_STATUS_DROPDOWN_FETCH, fetchLnpPartnerStatusDropdown),
    takeLatest(ACTION_TYPES.LNP_PARTNER_UPDATE, updateLnpPartner),
    takeLatest(ACTION_TYPES.AGNP_PARTNERS_LIST_FETCH, fetchAgnpPartnersList),
    takeLatest(ACTION_TYPES.AGNP_PARTNER_UPDATE, updateAgnpPartner),
    takeLatest(ACTION_TYPES.ONBOARDING_POP_NAME_FETCH, fetchOnboardingPopName),
    takeLatest(ACTION_TYPES.ONBOARDING_PINCODE_FETCH, fetchOnboardingPincode),
    takeLatest(ACTION_TYPES.ONBOARDING_POSTOFFICE_FETCH, fetchOnboardingPostoffice),
    takeLatest(ACTION_TYPES.ONBOARDING_IFSC_DETAILS_FETCH, fetchOnboardingIfscDetails),
    takeLatest(ACTION_TYPES.ONBOARDING_COMPANY_NATURE_FETCH, fetchOnboardingCompanyNature),
    takeLatest(ACTION_TYPES.ONBOARDING_BANK_ACCOUNT_TYPE_FETCH, fetchOnboardingBankAccountType),
    takeLatest(ACTION_TYPES.ONBOARDING_SHARE_PLAN_FETCH, fetchOnboardingSharePlan),
    takeLatest(ACTION_TYPES.ONBOARDING_VLAN_MAPPING_DATA_FETCH, fetchVlanMappingData),
    takeLatest(ACTION_TYPES.ONBOARDING_VLAN_MAPPING_SUBMIT, submitVlanMapping),
    takeLatest(ACTION_TYPES.ONBOARDING_VLAN_MAPPING_UPDATE, updateVlanMapping),
    takeLatest(ACTION_TYPES.ONBOARDING_VLAN_REQUEST_DATA_FETCH, fetchVlanRequestData),
    takeLatest(ACTION_TYPES.ONBOARDING_VLAN_REQUEST_SUBMIT, submitVlanRequest),
    takeLatest(ACTION_TYPES.FETCH_VLAN_TYPE_LIST, fetchVlanTypeList),
    takeLatest(ACTION_TYPES.FETCH_VLAN_PARTNER_LIST, fetchVlanPartnerList),
    takeLatest(ACTION_TYPES.FETCH_PARTNER_ENQUIRY, fetchPartnerEnquiry),
    takeLatest(ACTION_TYPES.ONBOARDING_FINAL_SUBMIT, submitOnboardingSaga),
    takeLatest(ACTION_TYPES.FETCH_SINGLE_ONBOARDING_DATA, fetchSingleOnboardingData),
    takeLatest(ACTION_TYPES.RESET_PASSWORD, resetPassword),
    takeLatest(ACTION_TYPES.DOWNLOAD_AGNP_LIST_CSV, downloadAgnpListCsv),
    takeLatest(ACTION_TYPES.DOWNLOAD_PARTNER_LIST_CSV, downloadPartnerListCsv),
    takeLatest(ACTION_TYPES.DOWNLOAD_PARTNER_ENQUIRY_CSV, downloadPartnerEnquiryCsv),
    takeLatest(ACTION_TYPES.DOWNLOAD_VLAN_MAPPINGS_CSV, downloadVlanMappingsCsv),
    takeLatest(ACTION_TYPES.ADD_SERVICE_AREA, addServiceArea),
    takeLatest(ACTION_TYPES.FETCH_OLT_DEVICE_LIST, fetchOltDeviceList),
    takeLatest(ACTION_TYPES.FILE_STORAGE_UPLOAD, fileStorageUploadSaga),
    takeLatest(ACTION_TYPES.FILE_STORAGE_DELETE, fileStorageDeleteSaga),
    takeLatest(ACTION_TYPES.FILE_STORAGE_VIEW_URL, fileStorageViewUrlSaga),
    takeLatest(ACTION_TYPES.ONBOARDING_DOCUMENT_DELETE, deleteOnboardingDocumentSaga),
    takeLatest(ACTION_TYPES.PARTNERS_FETCH_ALL, fetchPartnersAll),
    takeLatest(ACTION_TYPES.FETCH_PARTNER_DETAILS_BY_ID, fetchPartnerDetailsByIdSaga),
    takeLatest(ACTION_TYPES.UPDATE_PARTNER_DETAILS, updatePartnerDetailsSaga),
    takeLatest(ACTION_TYPES.FETCH_LINK_TYPE_OPTIONS, fetchLinkTypeOptionsSaga),
    takeLatest(ACTION_TYPES.FETCH_LINK_ESTABLISHMENT_STATUS_OPTIONS, fetchLinkEstablishmentStatusOptionsSaga),
    takeLatest(ACTION_TYPES.FETCH_FRC_RECEIVED_OPTIONS, fetchFrcReceivedOptionsSaga),
    takeLatest(ACTION_TYPES.FETCH_PARTNER_FORWARD_USERS, fetchPartnerForwardUsers),
    takeLatest(ACTION_TYPES.FORWARD_PARTNER_ENQUIRY, forwardPartnerEnquiry),
    takeLatest(ACTION_TYPES.FORWARD_AGNP_ENQUIRY, forwardAgnpEnquiry),
    takeLatest(ACTION_TYPES.ASSIGN_ENQUIRY, assignEnquiry),
    takeLatest(ACTION_TYPES.ASSIGN_ENQUIRY_TO_PREVIOUS_USER, assignEnquiryToPreviousUser),
    takeLatest(ACTION_TYPES.ONBOARDING_POP_UPDATE, updateOnboardingPopSaga)
  ]);
}
