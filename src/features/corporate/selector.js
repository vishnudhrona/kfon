import { flow, get } from 'lodash-es';

import { SERVER_SIDE_TABLE_KEYS } from '@/constants/server_table';

import { STATE_REDUCER_KEY } from './constants';

const corporateKey = (state) => state[STATE_REDUCER_KEY];

const EMPTY_OBJ = {};
export const getTableData = (key) => flow(corporateKey, (state) => get(state, key, EMPTY_OBJ));
export const getDropdownData = (key) => flow(corporateKey, (state) => get(state, `${key}.dropdownData`, []));

const ticketTableDetails = (state) => state.ticket.tableData;
export const getTicketTableData = flow(corporateKey, ticketTableDetails);

const enquiryListDetails = (state) => state[SERVER_SIDE_TABLE_KEYS.ENQUIRY_LIST];
export const getEnquiryList = flow(corporateKey, enquiryListDetails);

const enquiryExpandedListDetails = (state) => state[SERVER_SIDE_TABLE_KEYS.ENQUIRY_EXPANDED_LIST];
export const getEnquiryExpandedList = flow(corporateKey, enquiryExpandedListDetails);

const locationListDetails = (state) => state.corpEnqLocationList;
export const getCorpEnquiryLocationList = flow(corporateKey, locationListDetails);

const industryListDetails = (state) => state.industryList;
export const getIndustryList = flow(corporateKey, industryListDetails);

const servicesListDetails = (state) => state.serviceTypeList;
export const getServicesList = flow(corporateKey, servicesListDetails);

const connectionTypeListDetails = (state) => state.connectionTypeList;
export const getConnectionTypeList = flow(corporateKey, connectionTypeListDetails);

const proposalRevisionsDetails = (state) => state.proposalRevisions;
export const getProposalRevisions = flow(corporateKey, proposalRevisionsDetails);

const proposalDetailsData = (state) => state.proposalDetails;
export const getProposalDetailsData = flow(corporateKey, proposalDetailsData);

const purchaseOrderDetailsData = (state) => state.purchaseOrderDetails;
export const getPurchaseOrderDetails = flow(corporateKey, purchaseOrderDetailsData);

const circuitProvisioningDetailsData = (state) => state.circuitProvisioningDetails;
export const getCircuitProvisioningDetails = flow(corporateKey, circuitProvisioningDetailsData);
const serviceProvisioningDetailsData = (state) => state.serviceProvisioningDetails;
export const getServiceProvisioningDetails = flow(corporateKey, serviceProvisioningDetailsData);
const circuitMulticastTypesData = (state) => state.circuitMulticastTypes;
export const getCircuitMulticastTypes = flow(corporateKey, circuitMulticastTypesData);
const circuitServiceProvidersData = (state) => state.circuitServiceProviders;
export const getCircuitServiceProviders = flow(corporateKey, circuitServiceProvidersData);

const enquiryDetailsData = (state) => state.enquiryDetails;
export const getEnquiryDetailsData = flow(corporateKey, enquiryDetailsData);

const meetingHistoryData = (state) => state.meetingHistory;
export const getMeetingHistory = flow(corporateKey, meetingHistoryData);

const forwardRolesData = (state) => state.forwardRoles;
export const getForwardRoles = flow(corporateKey, forwardRolesData);

const forwardRoleUsersData = (state) => state.forwardRoleUsers;
export const getForwardRoleUsers = flow(corporateKey, forwardRoleUsersData);

const enquiryNotesData = (state) => state.enquiryNotes;
export const getEnquiryNotes = flow(corporateKey, enquiryNotesData);

const dispositionListData = (state) => state.dispositionList;
export const getDispositionList = flow(corporateKey, dispositionListData);

const reasonListData = (state) => state.reasonList;
export const getReasonList = flow(corporateKey, reasonListData);

const feasibilityLnpListData = (state) => state.feasibilityLnpList;
export const getFeasibilityLnpList = flow(corporateKey, feasibilityLnpListData);

const feasibilityConnectedByListData = (state) => state.feasibilityConnectedByList;
export const getFeasibilityConnectedByList = flow(corporateKey, feasibilityConnectedByListData);

const nearestPopListData = (state) => state.nearestPopList;
export const getNearestPopList = flow(corporateKey, nearestPopListData);

const customerVerificationListData = (state) => state.customerVerificationList;
export const getCustomerVerificationList = flow(corporateKey, customerVerificationListData);

const kycCustomerData = (state) => state.kycCustomer;
export const getKycCustomer = flow(corporateKey, kycCustomerData);

const kycDetailsData = (state) => state.kycDetails;
export const getKycDetails = flow(corporateKey, kycDetailsData);

const gstSearchDetailsData = (state) => state.gstSearchDetails;
export const getGstSearchDetails = flow(corporateKey, gstSearchDetailsData);

const enquiryLocationsData = (state) => state.enquiryLocations;
export const getEnquiryLocations = flow(corporateKey, enquiryLocationsData);

const packageTypesListData = (state) => state.packageTypesList;
export const getPackageTypesList = flow(corporateKey, packageTypesListData);

const packagesListData = (state) => state.packagesList;
export const getPackagesList = flow(corporateKey, packagesListData);

const additionalServicesListData = (state) => state.additionalServicesList;
export const getAdditionalServicesList = flow(corporateKey, additionalServicesListData);

const enquiryLocationDetailsData = (state) => state.enquiryLocationDetails;
export const getEnquiryLocationDetails = flow(corporateKey, enquiryLocationDetailsData);

const kycDocumentData = (state) => state.kycDocument;
export const getKycDocument = flow(corporateKey, kycDocumentData);

const forwardEnquiryData = (state) => state.forwardEnquiry;
export const getForwardEnquiry = flow(corporateKey, forwardEnquiryData);

const nearestLocationData = (state) => state.nearestLocation;
export const getNearestLocation = flow(corporateKey, nearestLocationData);

const locationDispositionData = (state) => state.locationDisposition;
export const getLocationDisposition = flow(corporateKey, locationDispositionData);

const enquiryDispositionListData = (state) => state.enquiryDispositionList;
export const getEnquiryDispositionList = flow(corporateKey, enquiryDispositionListData);

const returnToInfoData = (state) => state.returnToInfo;
export const getReturnToInfo = flow(corporateKey, returnToInfoData);

const proposalParamsData = (state) => state.proposalParams;
export const getProposalParams = flow(corporateKey, proposalParamsData);

const proposalDispatchData = (state) => state.proposalDispatch;
export const getProposalDispatch = flow(corporateKey, proposalDispatchData);

const enquirySummaryWithProposalsData = (state) => state.enquirySummaryWithProposals;
export const getEnquirySummaryWithProposals = flow(corporateKey, enquirySummaryWithProposalsData);

const proposalsByEnquiryData = (state) => state.proposalsByEnquiry;
export const getProposalsByEnquiry = flow(corporateKey, proposalsByEnquiryData);

const enquirySummaryWithPoData = (state) => state.enquirySummaryWithPo;
export const getEnquirySummaryWithPo = flow(corporateKey, enquirySummaryWithPoData);

const poByEnquiryData = (state) => state.poByEnquiry;
export const getPoByEnquiry = flow(corporateKey, poByEnquiryData);

const enquirySummaryWithCircuitProvisioningData = (state) => state.enquirySummaryWithCircuitProvisioning;
export const getEnquirySummaryWithCircuitProvisioning = flow(corporateKey, enquirySummaryWithCircuitProvisioningData);

const serviceCommissioningByEnquiryData = (state) => state.serviceCommissioningByEnquiry;
export const getServiceCommissioningByEnquiry = flow(corporateKey, serviceCommissioningByEnquiryData);

const nextStepUsersData = (state) => state.nextStepUsers || { data: [], workflowTypeName: '' };
export const getNextStepUsers = flow(corporateKey, nextStepUsersData);
