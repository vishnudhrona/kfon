import { t } from 'i18next';
import { all, call, delay, put, takeLatest } from 'redux-saga/effects';

import { errorToast, successToast } from '@/components/custom/Toast';
import { STORAGE_KEYS } from '@/constants';
import { SERVER_SIDE_TABLE_KEYS } from '@/constants/server_table';
import { setCommonPaginationResponse } from '@/features/others/Pagination/saga';
import { ticketCreationNotification } from '@/features/public/pages/enquiryForms/action';
import { router } from '@/routes/routes';
import { getDataFromStorage } from '@/utils/encryptionUtils';
import { handleAPIRequest } from '@/utils/httpUtils';
import { commonListSaga } from '@/utils/sagaUtils';

import {
  ACTION_TYPES,
  API_ACTION_TYPE_VARIANTS,
  fetchAttachment,
  fetchCrmTemplate,
  fetchInboxTickets,
  fetchOutboxTickets
} from './action';
import * as api from './api';
import { TABLE_KEY } from './constants';
import { actions } from './slice';

export function* fetchPrioritiesSaga(action) {
  yield call(handleAPIRequest, api.fetchPrioritiesApi, action.payload);
}

export function* fetchIssueTypesSaga(action) {
  yield call(handleAPIRequest, api.fetchIssueTypesApi, action.payload);
}

export function* fetchCustomerTypesSaga() {
  yield call(handleAPIRequest, api.fetchCustomerTypesApi);
}

export function* fetchCustomerSubtypesSaga() {
  yield call(handleAPIRequest, api.fetchCustomerSubtypesApi);
}

export function* submitTicket(action) {
  const { ...payload } = action.payload || {};
  const { response, error } = yield call(handleAPIRequest, api.submitTicketApi, payload);
  if (response && !error) {
    yield call(successToast, { title: 'success', description: response?.message || t('saveSuccess') });
    yield put(actions.clearUploadedFiles());
    router.navigate({ to: '/app/crm/ticket-list' });
  }
}

export function* uploadTicketDocument(action) {
  yield put(actions.setIsFileUploading(true));
  try {
    const { ...payload } = action.payload || {};
    const { response, error } = yield call(handleAPIRequest, api.uploadTicketDocumentApi, payload);

    if (response && !error) {
      const fileId = response?.data?.fileId || response?.payload?.fileId;
      if (fileId) {
        const { response: urlResponse } = yield call(handleAPIRequest, api.fetchFileUrlApi, fileId);
        if (urlResponse?.data?.url) {
          yield put(
            actions.addUploadedFile({
              fileId: fileId,
              url: urlResponse.data.url,
              name: payload?.file?.name || 'Uploaded File'
            })
          );
        }
      }
    }
  } finally {
    yield put(actions.setIsFileUploading(false));
  }
}

export function* customerSubmitTicket(action) {
  const { onSuccess, ...payload } = action.payload || {};
  const { response, error } = yield call(handleAPIRequest, api.customerSubmitTicketApi, payload);
  if (response && !error) {
    yield call(successToast, { title: 'success', description: response?.message || t('saveSuccess') });
    yield put(actions.clearUploadedFiles());

    const ticketId = response?.data?.ticketId;

    if (ticketId) {
      yield put(ticketCreationNotification({ ticketId: ticketId }));
    }

    const token = getDataFromStorage(STORAGE_KEYS.AUTH_TOKEN);
    if (token) {
      router.navigate({ to: '/app/crm/ticket-list' });
    } else if (onSuccess) {
      yield call(onSuccess);
    }
  }
}

export function* fetchAttachmentSaga(action) {
  yield call(handleAPIRequest, api.fetchAttachmentApi, action.payload);
}

export function* fetchTicketListSaga(action) {
  const { key, ...params } = action.payload || {};

  const { response, error } = yield call(handleAPIRequest, api.fetchTicketListApi, params);

  if (response && !error && key) {
    yield call(setCommonPaginationResponse, key, response);
  }
}

export function* fetchInboxTicketsSaga(action) {
  const { key, ...params } = action.payload || {};
  const { response, error } = yield call(handleAPIRequest, api.fetchInboxTicketsApi, params);
  if (response && !error && key) {
    yield call(setCommonPaginationResponse, key, response);
  }
}

export function* fetchOutboxTicketsSaga(action) {
  const { key, ...params } = action.payload || {};
  const { response, error } = yield call(handleAPIRequest, api.fetchOutboxTicketsApi, params);
  if (response && !error && key) {
    yield call(setCommonPaginationResponse, key, response);
  }
}

export function* fetchVisibilityPermissionSaga(action) {
  yield call(handleAPIRequest, api.fetchVisibilityPermissionApi, action.payload);
}

export function* submitCommentSaga(action) {
  const { onSuccess, ...payload } = action.payload;
  const { response, error } = yield call(handleAPIRequest, api.submitCommentApi, payload);
  if (response && !error) {
    yield call(successToast, { title: 'success', description: response?.message || t('saveSuccess') });
    yield put(actions.clearUploadedFiles());
    yield delay(500);
    yield put(fetchAttachment(payload.id));
    if (onSuccess) {
      yield call(onSuccess);
    }
  }
}

export function* fetchUpdateStateSaga(action) {
  yield call(handleAPIRequest, api.fetchUpdateStateApi, action.payload);
}

export function* deleteAttachmentSaga(action) {
  const { response, error } = yield call(handleAPIRequest, api.deleteAttachmentApi, action.payload);
  if (response && !error) {
    yield call(successToast, { title: 'success', description: response?.message || t('deleteSuccess') });
    yield put(actions.removeUploadedFile(action.payload));
  }
}

export function* fetchRoleNameSaga(action) {
  yield call(handleAPIRequest, api.fetchRoleNameApi, action.payload);
}

export function* forwardTicketSaga(action) {
  const { onSuccess, ...payload } = action.payload;
  const { response, error } = yield call(handleAPIRequest, api.forwardTicketApi, payload);
  if (response && !error) {
    yield call(successToast, { title: 'success', description: response?.message || t('saveSuccess') });
    yield put(fetchAttachment(payload.ticketId));
    if (onSuccess) {
      onSuccess();
      yield put(fetchInboxTickets({ key: TABLE_KEY }));
      yield put(fetchOutboxTickets({ key: TABLE_KEY }));
      router.navigate({ to: '/app/crm/ticket-list' });
    }
  }
}

export function* fetchFileUrl(action) {
  const { response } = yield call(handleAPIRequest, api.fetchFileUrlApi, action.payload);
  if (response?.data?.url) {
    yield put(actions.updateAttachmentUrl({ fileId: action.payload, url: response.data.url }));
  }
}

export function* fetchSubscriberListSaga() {
  yield call(handleAPIRequest, api.fetchSubscriberListApi);
}

export function* returnTicketSaga(action) {
  const { onSuccess, ...payload } = action.payload;
  const { response, error } = yield call(handleAPIRequest, api.returnTicketApi, payload);
  if (response && !error) {
    yield call(successToast, { title: 'success', description: response?.message || t('saveSuccess') });
    if (onSuccess) {
      onSuccess();
      router.navigate({ to: '/app/crm/ticket-list' });
    }
  }
}

export function* submitCrmMappingSaga(action) {
  const { onSuccess, data, ...payload } = action.payload;
  const apiPayload = data || payload;
  const { response, error } = yield call(handleAPIRequest, api.submitCrmMappingApi, apiPayload);
  if (response && !error) {
    yield call(successToast, { title: t('success'), description: response?.message || t('savedSuccessfully') });
    yield put(fetchCrmTemplate({ key: SERVER_SIDE_TABLE_KEYS.CRM_TEMPLATE_LIST_TABLE, page: 0, size: 10 }));
    if (onSuccess) {
      onSuccess();
    }
  }
}

export function* updateCrmMappingSaga(action) {
  const { onSuccess, ...payload } = action.payload;
  const { response, error } = yield call(handleAPIRequest, api.updateCrmMappingApi, payload);
  if (response && !error) {
    yield call(successToast, { title: t('success'), description: response?.message || t('savedSuccessfully') });
    yield put(fetchCrmTemplate({ key: SERVER_SIDE_TABLE_KEYS.CRM_TEMPLATE_LIST_TABLE, page: 0, size: 10 }));
    if (onSuccess) {
      onSuccess();
    }
  }
}

export function* fetchCrmTemplateSaga({ payload = {} }) {
  yield* commonListSaga(payload, api.fetchCrmTemplateApi, API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_CRM_TEMPLATE]);
}

export function* downloadInboxCsvSaga(action) {
  yield call(handleAPIRequest, api.downloadInboxCsvApi, action.payload);
}

export function* downloadOutboxCsvSaga(action) {
  yield call(handleAPIRequest, api.downloadOutboxCsvApi, action.payload);
}

export function* pinTicketSaga(action) {
  const { response, error } = yield call(handleAPIRequest, api.pinTicketApi, action.payload);
  if (response && !error) {
    yield put(fetchInboxTickets({ key: TABLE_KEY }));
  }
}

export function* returnToCustodianSaga(action) {
  const { onSuccess, ...payload } = action.payload;
  const { response, error } = yield call(handleAPIRequest, api.returnToCustodianApi, payload);
  if (response && !error) {
    yield call(successToast, { title: t('success'), description: response?.message || t('savedSuccessfully') });
    if (onSuccess) {
      onSuccess();
      router.navigate({ to: '/app/crm/ticket-list' });
    }
  }
}

export function* fetchGovtCustomersSaga(action) {
  yield call(handleAPIRequest, api.fetchGovtCustomersApi, action.payload);
}

export function* reopenTicketSaga(action) {
  const { onSuccess, ...payload } = action.payload;
  const { response, error } = yield call(handleAPIRequest, api.reopenTicketApi, payload);
  if (response && !error) {
    yield call(successToast, { title: t('success'), description: response?.message || t('savedSuccessfully') });
    yield put(fetchInboxTickets({ key: TABLE_KEY }));
    if (onSuccess) {
      onSuccess();
      router.navigate({ to: '/app/crm/ticket-list' });
    }
  }
}

export function* deleteCrmTemplateSaga(action) {
  const { response, error } = yield call(handleAPIRequest, api.deleteCrmTemplateApi, action.payload);
  if (response && !error) {
    yield call(successToast, { title: t('success'), description: response?.message || t('savedSuccessfully') });
    yield put(fetchCrmTemplate({ key: SERVER_SIDE_TABLE_KEYS.CRM_TEMPLATE_LIST_TABLE, page: 0, size: 10 }));
  }
}

export function* closedTicketNotificationSaga(action) {
  const { response, error } = yield call(handleAPIRequest, api.closedTicketNotificationApi, action.payload);
  if (response && !error) {
    yield call(successToast, { title: t('success'), description: response?.message || t('savedSuccessfully') });
  }
}

export function* fetchRoleByTicketIdSaga(action) {
  yield call(handleAPIRequest, api.fetchRoleByTicketIdApi, action.payload);
}

export function* fetchSubscriberByNumberSaga(action) {
  const { onSuccess, mobile } = action.payload;
  const { response, error } = yield call(handleAPIRequest, api.fetchSubscriberByNumberApi, mobile);
  if (response && !error) {
    onSuccess();
  } else {
    yield call(errorToast, { description: t('enterRegisteredMobileNumber') })
  }
}

export function* fetchPreviousEmployeeSaga(action) {
  const { ticketId } = action.payload;
  yield call(handleAPIRequest, api.fetchPreviousEmployeeApi, { ticketId });
}

export function* takeoverSearchSaga(action) {
  yield call(handleAPIRequest, api.takeoverSearchApi, action.payload);
}

export function* fetchDashboardTicketSummarySaga(action) {
  yield call(handleAPIRequest, api.fetchDashboardTicketSummaryApi, action.payload);
}

export function* fetchCustomerTypeBreakdownSaga(action) {
  yield call(handleAPIRequest, api.fetchCustomerTypeBreakdownApi, action.payload);
}

export function* fetchTop10IssuesSaga(action) {
  yield call(handleAPIRequest, api.fetchTop10IssuesApi, action.payload);
}

export function* fetchSubjectTypeBreakdownSaga(action) {
  yield call(handleAPIRequest, api.fetchSubjectTypeBreakdownApi, action.payload);
}

export function* fetchDistrictWiseComplaintsSaga(action) {
  yield call(handleAPIRequest, api.fetchDistrictWiseComplaintsApi, action.payload);
}

export function* fetchPerformanceKpiSaga(action) {
  yield call(handleAPIRequest, api.fetchPerformanceKpiApi, action.payload);
}

export function* fetchResolutionPerformanceSaga(action) {
  yield call(handleAPIRequest, api.fetchResolutionPerformanceApi, action.payload);
}

export function* fetchMonthlySummarySaga(action) {
  yield call(handleAPIRequest, api.fetchMonthlySummaryApi, action.payload);
}

export function* fetchLongPendingSaga(action) {
  yield call(handleAPIRequest, api.fetchLongPendingApi, action.payload);
}

export function* fetchLongPendingSummarySaga(action) {
  yield call(handleAPIRequest, api.fetchLongPendingSummaryApi, action.payload);
}

export function* fetchLongPendingListSaga(action) {
  yield call(handleAPIRequest, api.fetchLongPendingListApi, action.payload);
}

export function* fetchAllTicketsListSaga(action) {
  yield call(handleAPIRequest, api.fetchAllTicketsListApi, action.payload);
}

export function* fetchNoCustodianTicketCountSaga() {
  yield call(handleAPIRequest, api.fetchNoCustodianTicketCountApi);
}

export default function* crmSaga() {
  yield all([
    takeLatest(ACTION_TYPES.FETCH_PRIORITIES, fetchPrioritiesSaga),
    takeLatest(ACTION_TYPES.FETCH_ISSUE_TYPES, fetchIssueTypesSaga),
    takeLatest(ACTION_TYPES.FETCH_CUSTOMER_TYPES, fetchCustomerTypesSaga),
    takeLatest(ACTION_TYPES.FETCH_CUSTOMER_SUBTYPES, fetchCustomerSubtypesSaga),
    takeLatest(ACTION_TYPES.SUBMIT_TICKET, submitTicket),
    takeLatest(ACTION_TYPES.UPLOAD_TICKET_DOCUMENT, uploadTicketDocument),
    takeLatest(ACTION_TYPES.CUSTOMER_SUBMIT_TICKET, customerSubmitTicket),
    takeLatest(ACTION_TYPES.FETCH_ATTACHMENT, fetchAttachmentSaga),
    takeLatest(ACTION_TYPES.FETCH_INBOX_TICKETS, fetchInboxTicketsSaga),
    takeLatest(ACTION_TYPES.FETCH_OUTBOX_TICKETS, fetchOutboxTicketsSaga),
    takeLatest(ACTION_TYPES.FETCH_TICKET_LIST, fetchTicketListSaga),
    takeLatest(ACTION_TYPES.FETCH_VISIBILITY_PERMISSION, fetchVisibilityPermissionSaga),
    takeLatest(ACTION_TYPES.SUBMIT_COMMENT, submitCommentSaga),
    takeLatest(ACTION_TYPES.FETCH_UPDATE_STATE, fetchUpdateStateSaga),
    takeLatest(ACTION_TYPES.DELETE_ATTACHMENT, deleteAttachmentSaga),
    takeLatest(ACTION_TYPES.FETCH_ROLE_NAME, fetchRoleNameSaga),
    takeLatest(ACTION_TYPES.FORWARD_TICKET, forwardTicketSaga),
    takeLatest(ACTION_TYPES.FETCH_FILE_URL, fetchFileUrl),
    takeLatest(ACTION_TYPES.FETCH_SUBSCRIBER_LIST, fetchSubscriberListSaga),
    takeLatest(ACTION_TYPES.RETURN_TICKET, returnTicketSaga),
    takeLatest(ACTION_TYPES.SUBMIT_CRM_MAPPING, submitCrmMappingSaga),
    takeLatest(ACTION_TYPES.UPDATE_CRM_MAPPING, updateCrmMappingSaga),
    takeLatest(ACTION_TYPES.FETCH_CRM_TEMPLATE, fetchCrmTemplateSaga),
    takeLatest(ACTION_TYPES.PIN_TICKET, pinTicketSaga),
    takeLatest(ACTION_TYPES.DOWNLOAD_INBOX_CSV, downloadInboxCsvSaga),
    takeLatest(ACTION_TYPES.DOWNLOAD_OUTBOX_CSV, downloadOutboxCsvSaga),
    takeLatest(ACTION_TYPES.RETURN_TO_CUSTODIAN, returnToCustodianSaga),
    takeLatest(ACTION_TYPES.FETCH_GOVT_CUSTOMERS, fetchGovtCustomersSaga),
    takeLatest(ACTION_TYPES.REOPEN_TICKET, reopenTicketSaga),
    takeLatest(ACTION_TYPES.DELETE_CRM_TEMPLATE, deleteCrmTemplateSaga),
    takeLatest(ACTION_TYPES.CLOSED_TICKET_NOTIFICATION, closedTicketNotificationSaga),
    takeLatest(ACTION_TYPES.FETCH_ROLE_BY_TICKET_ID, fetchRoleByTicketIdSaga),
    takeLatest(ACTION_TYPES.FETCH_SUBSCRIBER_BY_NUMBER, fetchSubscriberByNumberSaga),
    takeLatest(ACTION_TYPES.FETCH_PREVIOUS_EMPLOYEE, fetchPreviousEmployeeSaga),
    takeLatest(ACTION_TYPES.TAKEOVER_SEARCH, takeoverSearchSaga),
    takeLatest(ACTION_TYPES.FETCH_DASHBOARD_TICKET_SUMMARY, fetchDashboardTicketSummarySaga),
    takeLatest(ACTION_TYPES.FETCH_CUSTOMER_TYPE_BREAKDOWN, fetchCustomerTypeBreakdownSaga),
    takeLatest(ACTION_TYPES.FETCH_TOP_10_ISSUES, fetchTop10IssuesSaga),
    takeLatest(ACTION_TYPES.FETCH_SUBJECT_TYPE_BREAKDOWN, fetchSubjectTypeBreakdownSaga),
    takeLatest(ACTION_TYPES.FETCH_DISTRICT_WISE_COMPLAINTS, fetchDistrictWiseComplaintsSaga),
    takeLatest(ACTION_TYPES.FETCH_PERFORMANCE_KPI, fetchPerformanceKpiSaga),
    takeLatest(ACTION_TYPES.FETCH_RESOLUTION_PERFORMANCE, fetchResolutionPerformanceSaga),
    takeLatest(ACTION_TYPES.FETCH_MONTHLY_SUMMARY, fetchMonthlySummarySaga),
    takeLatest(ACTION_TYPES.FETCH_LONG_PENDING, fetchLongPendingSaga),
    takeLatest(ACTION_TYPES.FETCH_LONG_PENDING_SUMMARY, fetchLongPendingSummarySaga),
    takeLatest(ACTION_TYPES.FETCH_LONG_PENDING_LIST, fetchLongPendingListSaga),
    takeLatest(ACTION_TYPES.FETCH_ALL_TICKETS_LIST, fetchAllTicketsListSaga),
    takeLatest(ACTION_TYPES.FETCH_NO_CUSTODIAN_TICKET_COUNT, fetchNoCustodianTicketCountSaga)
  ]);
}
