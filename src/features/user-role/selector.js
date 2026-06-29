import { flow, get } from 'lodash-es';

import { SERVER_SIDE_TABLE_KEYS } from '@/constants/server_table';
import { getServerSideData } from '@/features/others/Pagination/selectors';
import { selectorWithKey } from '@/utils/commonUtils';

import { STATE_REDUCER_KEY } from './constants';

const roleKey = (state) => state[STATE_REDUCER_KEY];

export const getTableData = (key) => flow(roleKey, (state) => get(state, key, {}));

const userRoleDetails = (state) => get(state, 'role.userPermission', []);
export const getUserRoleDetails = flow(roleKey, userRoleDetails);

const allRole = (state) => get(state, 'role.allRole.data', []);
export const getAllRole = flow(roleKey, allRole);

const businessUnit = (state) => get(state, 'role.businessUnit.data', []);
export const getBusinessUnit = flow(roleKey, businessUnit);

const userList = (state) => get(state, 'role.userList', {});
export const getUserList = flow(roleKey, userList);

export const getUserRoleList = (state) => {
  const data = selectorWithKey(getServerSideData(state), SERVER_SIDE_TABLE_KEYS.USER_ROLE_LIST_TABLE);
  return { data };
};

const editUserPermissionData = (state) => get(state, 'role.editUserPermission.data', null);
export const getEditUserPermissionData = flow(roleKey, editUserPermissionData);

const organization = (state) => get(state, 'role.organization.data', []);
export const getOrganization = flow(roleKey, organization);

const seatList = (state) => get(state, 'seatList', {});
export const getSeatList = flow(roleKey, seatList);

const roleByUser = (state) => get(state, 'roleByUser', []);
export const getRoleByUser = flow(roleKey, roleByUser);

const unmappedUser = (state) => get(state, 'unmappedUser', []);
export const getUnmappedUser = flow(roleKey, unmappedUser);

const zone = (state) => get(state, 'zone', []);
export const getZone = flow(roleKey, zone);

const seatPermission = (state) => get(state, 'seatPermission', []);
export const getSeatPermission = flow(roleKey, seatPermission);

const pincodeByDistrict = (state) => get(state, 'pincodeByDistrict', []);
export const getPincodeByDistrict = flow(roleKey, pincodeByDistrict);

const templateList = (state) => get(state, 'templateList', {});
export const getTemplateList = flow(roleKey, templateList);

const designation = (state) => get(state, 'designation', []);
export const getDesignation = flow(roleKey, designation);

const mappedDist = (state) => get(state, 'mappedDist', []);
export const getMappedDist = flow(roleKey, mappedDist);

const designationList = (state) => get(state, 'designationList', {});
export const getDesignationList = flow(roleKey, designationList);

const workflowTypes = (state) => get(state, 'workflowTypes', []);
export const getWorkflowTypes = flow(roleKey, workflowTypes);

const workflowSubtypes = (state) => get(state, 'workflowSubtypes', []);
export const getWorkflowSubtypes = flow(roleKey, workflowSubtypes);

const seatsByRoles = (state) => get(state, 'seatsByRoles', []);
export const getSeatsByRoles = flow(roleKey, seatsByRoles);

const stageConfig = (state) => get(state, 'stageConfig', null);
export const getStageConfig = flow(roleKey, stageConfig);

const divisionList = (state) => get(state, 'divisionList', {});
export const getDivisionList = flow(roleKey, divisionList);

const divisionByOrganization = (state) => get(state, 'divisionByOrganization', []);
export const getDivisionByOrganization = flow(roleKey, divisionByOrganization);

const feLnpFeUsers = (state) => get(state, 'feLnpFeUsers', []);
export const getFeLnpFeUsers = flow(roleKey, feLnpFeUsers);

const feLnpLnpUsers = (state) => get(state, 'feLnpLnpUsers', { content: [] });
export const getFeLnpLnpUsers = flow(roleKey, feLnpLnpUsers);
