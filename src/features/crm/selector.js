import { flow } from 'lodash-es';

import { SERVER_SIDE_TABLE_KEYS } from '@/constants/server_table';
import { getServerSideData } from '@/features/others/Pagination/selectors';
import { selectorWithKey } from '@/utils/commonUtils';

import { STATE_REDUCER_KEY } from './constants';

const crmKey = (state) => state[STATE_REDUCER_KEY];

const priorities = (state) => state.priorities;
export const getPriorities = flow(crmKey, priorities);

const issueTypes = (state) => state.issueTypes;
export const getIssueTypes = flow(crmKey, issueTypes);

const customerTypes = (state) => state.customerTypes;
export const getCustomerTypes = flow(crmKey, customerTypes);

const customerSubTypes = (state) => state.customerSubTypes;
export const getCustomerSubTypes = flow(crmKey, customerSubTypes);

const submitTicket = (state) => state.submitTicket;
export const getSubmitTicket = flow(crmKey, submitTicket);

const attachment = (state) => state.attachment;
export const getAttachment = flow(crmKey, attachment);

const ticketList = (state) => state.ticketList.content;
export const getTicketList = flow(crmKey, ticketList);

const inboxTickets = (state) => state.inboxTickets.content;
export const getInboxTickets = flow(crmKey, inboxTickets);

const outboxTickets = (state) => state.outboxTickets.content;
export const getOutboxTickets = flow(crmKey, outboxTickets);

const visibilityPermission = (state) => state.visibilityPermission;
export const getVisibilityPermission = flow(crmKey, visibilityPermission);

const updateState = (state) => state.updateState;
export const getUpdateState = flow(crmKey, updateState);

const roleName = (state) => state.roleName;
export const getRoleName = flow(crmKey, roleName);

const subscriberList = (state) => state.subscriberList;
export const getSubscriberList = flow(crmKey, subscriberList);

const uploadedFiles = (state) => state.uploadedFiles;
export const getUploadedFiles = flow(crmKey, uploadedFiles);

export const getCrmTemplateList = (state) => {
  const data = selectorWithKey(getServerSideData(state), SERVER_SIDE_TABLE_KEYS.CRM_TEMPLATE_LIST_TABLE);
  return { data };
};

const govtCustomers = (state) => state.govtCustomers;
export const getGovtCustomers = flow(crmKey, govtCustomers);

const isFileUploading = (state) => state.isFileUploading;
export const getIsFileUploading = flow(crmKey, isFileUploading);

const roleByTicketId = (state) => state.roleByTicketId;
export const getRoleByTicketId = flow(crmKey, roleByTicketId);

const previousEmployee = (state) => state.previousEmployee;
export const getPreviousEmployee = flow(crmKey, previousEmployee);

const takeoverSearchData = (state) => state.takeoverSearchData;
export const getTakeoverSearchData = flow(crmKey, takeoverSearchData);

const takeoverSearchLoading = (state) => state.takeoverSearchLoading;
export const getTakeoverSearchLoading = flow(crmKey, takeoverSearchLoading);

const subscriberByNumber = (state) => state.subscriberByNumber;
export const getSubscriberByNumber = flow(crmKey, subscriberByNumber);

const dashboardTicketSummary = (state) => state.dashboardTicketSummary;
export const getDashboardTicketSummary = flow(crmKey, dashboardTicketSummary);

const customerTypeBreakdown = (state) => state.customerTypeBreakdown;
export const getCustomerTypeBreakdown = flow(crmKey, customerTypeBreakdown);

const top10Issues = (state) => state.top10Issues;
export const getTop10Issues = flow(crmKey, top10Issues);

const subjectTypeBreakdown = (state) => state.subjectTypeBreakdown;
export const getSubjectTypeBreakdown = flow(crmKey, subjectTypeBreakdown);

const districtWiseComplaints = (state) => state.districtWiseComplaints;
export const getDistrictWiseComplaints = flow(crmKey, districtWiseComplaints);

const performanceKpi = (state) => state.performanceKpi;
export const getPerformanceKpi = flow(crmKey, performanceKpi);

const resolutionPerformance = (state) => state.resolutionPerformance;
export const getResolutionPerformance = flow(crmKey, resolutionPerformance);

const monthlySummary = (state) => state.monthlySummary;
export const getMonthlySummary = flow(crmKey, monthlySummary);

const longPending = (state) => state.longPending;
export const getLongPending = flow(crmKey, longPending);

const longPendingSummary = (state) => state.longPendingSummary;
export const getLongPendingSummary = flow(crmKey, longPendingSummary);

const longPendingList = (state) => state.longPendingList;
export const getLongPendingList = flow(crmKey, longPendingList);

const allTicketsList = (state) => state.allTicketsList;
export const getAllTicketsList = flow(crmKey, allTicketsList);

const noCustodianTicketCount = (state) => state.noCustodianTicketCount
export const getNoCustodianTicketCount = flow(crmKey, noCustodianTicketCount);
