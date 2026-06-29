import { MULTI_PART_FORM_HEADER, REQUEST_METHOD } from '@/constants/api';
import { FILE_RESPONSE_TYPE } from '@/constants/file';
import { API_URL } from '@/constants/urls';

import { ACTION_TYPES, API_ACTION_TYPE_VARIANTS } from './action';

export const fetchPrioritiesApi = (data = {}) => ({
  url: API_URL.CRM.FETCH_PRIORITIES,
  method: REQUEST_METHOD.GET,
  guestAccess: true,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_PRIORITIES],
    data: data,
    progressKey: ACTION_TYPES.FETCH_PRIORITIES
  }
});

export const fetchIssueTypesApi = (data = {}) => {
  return {
    url: API_URL.CRM.FETCH_ISSUE_TYPES,
    method: REQUEST_METHOD.GET,
    guestAccess: true,
    payload: {
      types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_ISSUE_TYPES],
      data: typeof data === 'object' && data !== null ? data : { categoryId: data },
      progressKey: ACTION_TYPES.FETCH_ISSUE_TYPES
    }
  };
};

export const fetchCustomerTypesApi = () => ({
  url: API_URL.CRM.FETCH_CUSTOMER_TYPE,
  method: REQUEST_METHOD.GET,
  guestAccess: true,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_CUSTOMER_TYPES],
    progressKey: ACTION_TYPES.FETCH_CUSTOMER_TYPES
  }
});

export const fetchCustomerSubtypesApi = () => ({
  url: API_URL.CRM.FETCH_CUSTOMER_SUBTYPES,
  method: REQUEST_METHOD.GET,
  guestAccess: true,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_CUSTOMER_SUBTYPES],
    progressKey: ACTION_TYPES.FETCH_CUSTOMER_SUBTYPES
  }
});

export const submitTicketApi = (data) => {
  return {
    url: API_URL.CRM.SUBMIT_TICKET,
    method: REQUEST_METHOD.POST,
    guestAccess: true,
    payload: {
      types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.SUBMIT_TICKET],
      data: data,
      progressKey: ACTION_TYPES.SUBMIT_TICKET
    }
  };
};

export const uploadTicketDocumentApi = (data) => {
  const { file } = data;
  const formData = new FormData();

  const actualFile = file && typeof file === 'object' && 'length' in file ? file[0] : file;
  formData.append('file', actualFile);

  return {
    url: API_URL.CRM.UPLOAD_DOCUMENT,
    method: REQUEST_METHOD.POST,
    payload: {
      types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.UPLOAD_TICKET_DOCUMENT],
      data: formData,
      headers: MULTI_PART_FORM_HEADER,
      progressKey: ACTION_TYPES.UPLOAD_TICKET_DOCUMENT
    },
    guestAccess: true
  };
};

export const customerSubmitTicketApi = (data) => {
  return {
    url: API_URL.CRM.CUSTOMER_SUBMIT_TICKET,
    method: REQUEST_METHOD.POST,
    payload: {
      types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.CUSTOMER_SUBMIT_TICKET],
      data: data,
      progressKey: ACTION_TYPES.CUSTOMER_SUBMIT_TICKET
    },
    guestAccess: true
  };
};

export const fetchAttachmentApi = (data) => {
  return {
    url: API_URL.CRM.FETCH_ATTACHMENT.replace(':id', data),
    method: REQUEST_METHOD.GET,
    guestAccess: true,
    payload: {
      types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_ATTACHMENT],
      progressKey: ACTION_TYPES.FETCH_ATTACHMENT
    }
  };
};

export const deleteAttachmentApi = (id) => {
  return {
    url: API_URL.CRM.DELETE_ATTACHMENT.replace(':id', id),
    method: REQUEST_METHOD.DELETE,
    guestAccess: true,
    payload: {
      types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.DELETE_ATTACHMENT],
      progressKey: ACTION_TYPES.DELETE_ATTACHMENT
    }
  };
};

export const fetchInboxTicketsApi = (params = {}) => {
  return {
    url: API_URL.CRM.FETCH_INBOX_TICKETS,
    method: REQUEST_METHOD.GET,
    payload: {
      params,
      types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_INBOX_TICKETS],
      progressKey: ACTION_TYPES.FETCH_INBOX_TICKETS
    }
  };
};

export const fetchOutboxTicketsApi = (params = {}) => {
  return {
    url: API_URL.CRM.FETCH_OUTBOX_TICKETS,
    method: REQUEST_METHOD.GET,
    payload: {
      params,
      types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_OUTBOX_TICKETS],
      progressKey: ACTION_TYPES.FETCH_OUTBOX_TICKETS
    }
  };
};

export const fetchTicketListApi = (params = {}) => {
  return {
    url: API_URL.CRM.FETCH_TICKET_LIST,
    method: REQUEST_METHOD.GET,
    payload: {
      params,
      types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_TICKET_LIST],
      progressKey: ACTION_TYPES.FETCH_TICKET_LIST
    }
  };
};

export const fetchVisibilityPermissionApi = () => {
  return {
    url: API_URL.CRM.FETCH_VISIBILITY_PERMISSION,
    method: REQUEST_METHOD.GET,
    guestAccess: true,
    payload: {
      types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_VISIBILITY_PERMISSION],
      progressKey: ACTION_TYPES.FETCH_VISIBILITY_PERMISSION
    }
  };
};

export const submitCommentApi = (data) => {
  const { id, ...restData } = data;
  return {
    url: API_URL.CRM.SUBMIT_COMMENT.replace(':id', String(id).replace(/['"]+/g, '')),
    method: REQUEST_METHOD.POST,
    payload: {
      types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.SUBMIT_COMMENT],
      data: restData,
      progressKey: ACTION_TYPES.SUBMIT_COMMENT
    }
  };
};

export const fetchUpdateStateApi = () => {
  return {
    url: API_URL.CRM.FETCH_UPDATE_STATE,
    method: REQUEST_METHOD.GET,
    payload: {
      types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_UPDATE_STATE],
      progressKey: ACTION_TYPES.FETCH_UPDATE_STATE
    }
  };
};

export const fetchRoleNameApi = (data) => {
  return {
    url: API_URL.CRM.FETCH_ROLE_NAME,
    method: REQUEST_METHOD.GET,
    payload: {
      types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_ROLE_NAME],
      params: data,
      progressKey: ACTION_TYPES.FETCH_ROLE_NAME
    }
  };
};

export const forwardTicketApi = (data) => {
  return {
    url: API_URL.CRM.FORWARD_TICKET,
    method: REQUEST_METHOD.POST,
    payload: {
      types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FORWARD_TICKET],
      data: data,
      progressKey: ACTION_TYPES.FORWARD_TICKET
    }
  };
};

export const fetchFileUrlApi = (data) => ({
  url: API_URL.COMMON.FILE_URL.replace(':fileId', data),
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_FILE_URL],
    progressKey: ACTION_TYPES.FETCH_FILE_URL
  },
  guestAccess: true
});

export const fetchSubscriberListApi = () => ({
  url: API_URL.CRM.FETCH_SUBSCRIBER_LIST,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_SUBSCRIBER_LIST],
    progressKey: ACTION_TYPES.FETCH_SUBSCRIBER_LIST
  }
});

export const returnTicketApi = (data) => {
  return {
    url: API_URL.CRM.RETURN_TICKET,
    method: REQUEST_METHOD.POST,
    payload: {
      types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.RETURN_TICKET],
      data: data,
      progressKey: ACTION_TYPES.RETURN_TICKET
    }
  };
};

export const submitCrmMappingApi = (data) => {
  return {
    url: API_URL.CRM.SUBMIT_CRM_MAPPING,
    method: REQUEST_METHOD.POST,
    payload: {
      types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.SUBMIT_CRM_MAPPING],
      data: data,
      progressKey: ACTION_TYPES.SUBMIT_CRM_MAPPING
    }
  };
};

export const updateCrmMappingApi = (data) => {
  const { id, ...rest } = data;
  return {
    url: API_URL.CRM.UPDATE_CRM_MAPPING.replace(':id', id),
    method: REQUEST_METHOD.PUT,
    payload: {
      types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.UPDATE_CRM_MAPPING],
      data: rest,
      progressKey: ACTION_TYPES.UPDATE_CRM_MAPPING
    }
  };
};

export const fetchCrmTemplateApi = (params = {}) => {
  return {
    url: API_URL.CRM.FETCH_CRM_TEMPLATE,
    method: REQUEST_METHOD.GET,
    payload: {
      types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_CRM_TEMPLATE],
      params,
      progressKey: ACTION_TYPES.FETCH_CRM_TEMPLATE
    }
  };
};

export const pinTicketApi = (data) => {
  return {
    url: API_URL.CRM.PIN_TICKET,
    method: REQUEST_METHOD.PATCH,
    payload: {
      types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.PIN_TICKET],
      data: data,
      progressKey: ACTION_TYPES.PIN_TICKET
    }
  };
};

export const downloadInboxCsvApi = (params = {}) => {
  return {
    url: API_URL.CRM.DOWNLOAD_INBOX_CSV,
    method: REQUEST_METHOD.GET,
    payload: {
      params,
      types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.DOWNLOAD_INBOX_CSV],
      progressKey: ACTION_TYPES.DOWNLOAD_INBOX_CSV,
      isDocument: true,
      documentType: FILE_RESPONSE_TYPE.BLOB,
      fileName: 'Inbox.csv'
    }
  };
};

export const downloadOutboxCsvApi = (params = {}) => {
  return {
    url: API_URL.CRM.DOWNLOAD_OUTBOX_CSV,
    method: REQUEST_METHOD.GET,
    payload: {
      params,
      types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.DOWNLOAD_OUTBOX_CSV],
      progressKey: ACTION_TYPES.DOWNLOAD_OUTBOX_CSV,
      isDocument: true,
      documentType: FILE_RESPONSE_TYPE.BLOB,
      fileName: 'Outbox.csv'
    }
  };
};

export const returnToCustodianApi = (data) => {
  return {
    url: API_URL.CRM.RETURN_TO_CUSTODIAN,
    method: REQUEST_METHOD.POST,
    payload: {
      types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.RETURN_TO_CUSTODIAN],
      data: data,
      progressKey: ACTION_TYPES.RETURN_TO_CUSTODIAN
    }
  };
};

export const fetchGovtCustomersApi = (data) => {
  return {
    url: API_URL.CRM.FETCH_GOVT_CUSTOMERS,
    method: REQUEST_METHOD.GET,
    payload: {
      types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_GOVT_CUSTOMERS],
      data: { customerType: data },
      progressKey: ACTION_TYPES.FETCH_GOVT_CUSTOMERS
    }
  };
};

export const reopenTicketApi = (data) => {
  return {
    url: API_URL.CRM.REOPEN_TICKET,
    method: REQUEST_METHOD.POST,
    payload: {
      types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.REOPEN_TICKET],
      data: data,
      progressKey: ACTION_TYPES.REOPEN_TICKET
    }
  };
};

export const deleteCrmTemplateApi = (data) => {
  return {
    url: API_URL.CRM.DELETE_CRM_TEMPLATE.replace(':id', data),
    method: REQUEST_METHOD.DELETE,
    payload: {
      types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.DELETE_CRM_TEMPLATE],
      progressKey: ACTION_TYPES.DELETE_CRM_TEMPLATE
    }
  };
};

export const closedTicketNotificationApi = (data) => {
  return {
    url: API_URL.CRM.CLOSED_TICKET_NOTIFICATION.replace(':ticketId', data),
    method: REQUEST_METHOD.POST,
    payload: {
      types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.CLOSED_TICKET_NOTIFICATION],
      progressKey: ACTION_TYPES.CLOSED_TICKET_NOTIFICATION
    }
  };
};

export const fetchRoleByTicketIdApi = (data) => {
  return {
    url: API_URL.CRM.FETCH_ROLE_BY_TICKET_ID.replace(':ticketId', data?.ticketId),
    method: REQUEST_METHOD.GET,
    payload: {
      types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_ROLE_BY_TICKET_ID],
      progressKey: ACTION_TYPES.FETCH_ROLE_BY_TICKET_ID
    }
  };
};

export const fetchSubscriberByNumberApi = (data) => {
  return {
    url: API_URL.CRM.FETCH_SUBSCRIBER_BY_NUMBER,
    method: REQUEST_METHOD.GET,
    guestAccess: true,
    payload: {
      types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_SUBSCRIBER_BY_NUMBER],
      data: { mobileNumber: data },
      progressKey: ACTION_TYPES.FETCH_SUBSCRIBER_BY_NUMBER,
      isErrorToast: false
    }
  };
};

export const fetchPreviousEmployeeApi = (data) => {
  const { ticketId } = data;
  return {
    url: API_URL.CRM.FETCH_PREVIOUS_EMPLOYEE.replace(':ticketId', ticketId),
    method: REQUEST_METHOD.GET,
    payload: {
      types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_PREVIOUS_EMPLOYEE],
      progressKey: ACTION_TYPES.FETCH_PREVIOUS_EMPLOYEE
    }
  };
};

export const takeoverSearchApi = (data) => {
  return {
    url: API_URL.CRM.TAKEOVER_SEARCH,
    method: REQUEST_METHOD.GET,
    payload: {
      types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.TAKEOVER_SEARCH],
      data: data,
      progressKey: ACTION_TYPES.TAKEOVER_SEARCH
    }
  };
};

export const fetchDashboardTicketSummaryApi = (period) => {
  return {
    url: API_URL.CRM.FETCH_DASHBOARD_TICKET_SUMMARY,
    method: REQUEST_METHOD.GET,
    payload: {
      types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_DASHBOARD_TICKET_SUMMARY],
      params: { period },
      progressKey: ACTION_TYPES.FETCH_DASHBOARD_TICKET_SUMMARY
    }
  };
};

export const fetchCustomerTypeBreakdownApi = (period) => {
  return {
    url: API_URL.CRM.FETCH_CUSTOMER_TYPE_BREAKDOWN,
    method: REQUEST_METHOD.GET,
    payload: {
      types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_CUSTOMER_TYPE_BREAKDOWN],
      params: { period },
      progressKey: ACTION_TYPES.FETCH_CUSTOMER_TYPE_BREAKDOWN
    }
  };
};

export const fetchTop10IssuesApi = (period) => {
  return {
    url: API_URL.CRM.FETCH_TOP_10_ISSUES,
    method: REQUEST_METHOD.GET,
    payload: {
      types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_TOP_10_ISSUES],
      params: { period },
      progressKey: ACTION_TYPES.FETCH_TOP_10_ISSUES
    }
  };
};

export const fetchDistrictWiseComplaintsApi = (params) => {
  return {
    url: API_URL.CRM.FETCH_DISTRICT_WISE_COMPLAINTS,
    method: REQUEST_METHOD.GET,
    payload: {
      types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_DISTRICT_WISE_COMPLAINTS],
      params: params,
      progressKey: ACTION_TYPES.FETCH_DISTRICT_WISE_COMPLAINTS
    }
  };
};

export const fetchSubjectTypeBreakdownApi = (period) => {
  return {
    url: API_URL.CRM.FETCH_SUBJECT_TYPE_BREAKDOWN,
    method: REQUEST_METHOD.GET,
    payload: {
      types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_SUBJECT_TYPE_BREAKDOWN],
      params: { period },
      progressKey: ACTION_TYPES.FETCH_SUBJECT_TYPE_BREAKDOWN
    }
  };
};

export const fetchPerformanceKpiApi = (period) => {
  return {
    url: API_URL.CRM.FETCH_PERFORMANCE_KPI,
    method: REQUEST_METHOD.GET,
    payload: {
      types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_PERFORMANCE_KPI],
      params: { period },
      progressKey: ACTION_TYPES.FETCH_PERFORMANCE_KPI
    }
  };
};

export const fetchResolutionPerformanceApi = (period) => {
  return {
    url: API_URL.CRM.FETCH_RESOLUTION_PERFORMANCE,
    method: REQUEST_METHOD.GET,
    payload: {
      types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_RESOLUTION_PERFORMANCE],
      params: { period },
      progressKey: ACTION_TYPES.FETCH_RESOLUTION_PERFORMANCE
    }
  };
};

export const fetchMonthlySummaryApi = () => {
  return {
    url: API_URL.CRM.FETCH_MONTHLY_SUMMARY,
    method: REQUEST_METHOD.GET,
    payload: {
      types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_MONTHLY_SUMMARY],
      progressKey: ACTION_TYPES.FETCH_MONTHLY_SUMMARY
    }
  };
};

export const fetchLongPendingApi = (period) => {
  return {
    url: API_URL.CRM.FETCH_LONG_PENDING,
    method: REQUEST_METHOD.GET,
    payload: {
      types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_LONG_PENDING],
      params: { period },
      progressKey: ACTION_TYPES.FETCH_LONG_PENDING
    }
  };
};

export const fetchLongPendingSummaryApi = (period) => {
  return {
    url: API_URL.CRM.FETCH_LONG_PENDING_SUMMARY,
    method: REQUEST_METHOD.GET,
    payload: {
      types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_LONG_PENDING_SUMMARY],
      params: { period },
      progressKey: ACTION_TYPES.FETCH_LONG_PENDING_SUMMARY
    }
  };
};

export const fetchLongPendingListApi = (params) => {
  return {
    url: API_URL.CRM.FETCH_LONG_PENDING,
    method: REQUEST_METHOD.GET,
    payload: {
      types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_LONG_PENDING_LIST],
      params: params,
      progressKey: ACTION_TYPES.FETCH_LONG_PENDING_LIST
    }
  };
};

export const fetchAllTicketsListApi = (payload) => {
  return {
    url: API_URL.CRM.FETCH_ALL_TICKETS_LIST,
    method: REQUEST_METHOD.GET,
    payload: {
      types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_ALL_TICKETS_LIST],
      params: payload,
      progressKey: ACTION_TYPES.FETCH_ALL_TICKETS_LIST
    }
  };
};

export const fetchNoCustodianTicketCountApi = () => {
  return {
    url: API_URL.CRM.FETCH_NO_CUSTODIAN_TICKET_COUNT,
    method: REQUEST_METHOD.GET,
    payload: {
      types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_NO_CUSTODIAN_TICKET_COUNT],
      progressKey: ACTION_TYPES.FETCH_NO_CUSTODIAN_TICKET_COUNT
    }
  }
}
