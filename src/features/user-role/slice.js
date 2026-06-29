import { createSlice } from '@reduxjs/toolkit';
import { set } from 'lodash-es';

import { ACTION_TYPES, API_ACTION_TYPE_VARIANTS } from './action';
import { STATE_REDUCER_KEY } from './constants';

const initialState = {
  role: {
    userPermission: [],
    roleFormDetails: null,
    allRole: [],
    businessUnit: [],
    editUserPermission: null,
    organization: []
  },
  userList: {
    data: []
  },
  seatList: {
    data: []
  },
  templateList: {
    data: []
  },
  roleByUser: [],
  unmappedUser: [],
  zone: [],
  seatPermission: [],
  pincodeByDistrict: [],
  designation: [],
  mappedDist: [],
  designationList: {
    data: []
  },
  workflowTypes: [],
  workflowSubtypes: [],
  seatsByRoles: [],
  stageConfig: null,
  divisionList: {
    data: []
  },
  divisionByOrganization: [],
  feLnpFeUsers: [],
  feLnpLnpUsers: {
    content: [],
    allCount: 0,
    attachedCount: 0,
    unassignedCount: 0,
    totalPages: 0,
    totalElements: 0
  }
};

const slice = createSlice({
  initialState,
  name: STATE_REDUCER_KEY,

  extraReducers: (builder) => {
    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.ROLE_CREATION_MENU_FETCH][1], (state, { payload }) => {
      set(state, 'role.userPermission', payload);
    });

    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_ALL_ROLE][1], (state, { payload }) => {
      set(state, 'role.allRole', payload);
    });

    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_BUISINESS_UNIT][1], (state, { payload }) => {
      set(state, 'role.businessUnit', payload);
    });

    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.USER_LIST_FETCH][1], (state, { payload }) => {
      set(state, 'userList.data', payload.data.content);
    });

    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_EDIT_USER_PERMISSION][1], (state, { payload }) => {
      set(state, 'role.editUserPermission', payload);
    });

    builder.addCase(ACTION_TYPES.CLEAR_EDIT_USER_PERMISSION, (state) => {
      set(state, 'role.editUserPermission', null);
    });

    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_ORGANIZATION][1], (state, { payload }) => {
      set(state, 'role.organization', payload);
    });

    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_SEAT_LIST][1], (state, { payload }) => {
      set(state, 'seatList.data', payload?.data?.content ?? []);
    });

    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_ROLE_BY_USER][1], (state, { payload }) => {
      set(state, 'roleByUser', payload ?? []);
    });

    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_UNMAPPED_USER][1], (state, { payload }) => {
      set(state, 'unmappedUser', payload?.data ?? []);
    });

    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_ZONE][1], (state, { payload }) => {
      set(state, 'zone', payload);
    });

    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_SEAT_PERMISSION][1], (state, { payload }) => {
      set(state, 'seatPermission', payload?.data ?? []);
    });

    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_PINCODE_BY_DISTRICT_IDS][1], (state, { payload }) => {
      set(state, 'pincodeByDistrict', payload?.data ?? []);
    });

    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_TEMPLATE_LIST][1], (state, { payload }) => {
      set(state, 'templateList.data', payload?.data?.content ?? []);
    });

    builder.addCase(ACTION_TYPES.RESET_USER_ROLE_FORM, (state) => {
      set(state, 'role.businessUnit', []);
      set(state, 'pincodeByDistrict', []);
    });

    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_DESIGNATION][1], (state, { payload }) => {
      set(state, 'designation', payload?.data);
    });

    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_MAPPED_DIST][1], (state, { payload }) => {
      set(state, 'mappedDist', payload?.data);
    });

    builder.addCase(ACTION_TYPES.RESET_MAPPED_DIST, (state) => {
      set(state, 'mappedDist', []);
    });

    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_DESIGNATION_LIST][1], (state, { payload }) => {
      set(state, 'designationList.data', payload?.data?.content || payload?.data || []);
    });

    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_WORKFLOW_TYPES][1], (state, { payload }) => {
      set(state, 'workflowTypes', payload?.data ?? payload ?? []);
    });

    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_WORKFLOW_SUBTYPES][1], (state, { payload }) => {
      set(state, 'workflowSubtypes', payload?.data ?? payload ?? []);
    });

    builder.addCase(ACTION_TYPES.CLEAR_WORKFLOW_SUBTYPES, (state) => {
      set(state, 'workflowSubtypes', []);
    });

    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_SEAT_BY_ROLES][1], (state, { payload }) => {
      set(state, 'seatsByRoles', payload?.data ?? payload ?? []);
    });

    builder.addCase(ACTION_TYPES.CLEAR_SEAT_BY_ROLES, (state) => {
      set(state, 'seatsByRoles', []);
    });

    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_STAGE_CONFIG][1], (state, { payload }) => {
      set(state, 'stageConfig', payload?.data ?? payload ?? null);
    });

    builder.addCase(ACTION_TYPES.CLEAR_STAGE_CONFIG, (state) => {
      set(state, 'stageConfig', null);
    });

    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_DIVISION_LIST][1], (state, { payload }) => {
      set(state, 'divisionList.data', payload?.data?.content || payload?.data || []);
    });

    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_DIVISION_BY_ORGANIZATION][1], (state, { payload }) => {
      set(state, 'divisionByOrganization', payload?.data || payload || []);
    });

    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_FE_LNP_FE_USERS][1], (state, { payload }) => {
      set(state, 'feLnpFeUsers', payload?.data ?? []);
    });

    builder.addCase(ACTION_TYPES.CLEAR_FE_LNP_FE_USERS, (state) => {
      set(state, 'feLnpFeUsers', []);
    });

    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_FE_LNP_LNP_USERS][1], (state, { payload }) => {
      const data = payload?.data ?? {};
      set(state, 'feLnpLnpUsers', {
        content: data?.lnpUsers?.content ?? [],
        allCount: data?.allCount ?? 0,
        attachedCount: data?.attachedCount ?? 0,
        unassignedCount: data?.unassignedCount ?? 0,
        totalPages: data?.lnpUsers?.totalPages ?? 0,
        totalElements: data?.lnpUsers?.totalElements ?? 0
      });
    });

    builder.addCase(ACTION_TYPES.CLEAR_FE_LNP_LNP_USERS, (state) => {
      set(state, 'feLnpLnpUsers', {
        content: [],
        allCount: 0,
        attachedCount: 0,
        unassignedCount: 0,
        totalPages: 0,
        totalElements: 0
      });
    });
  }
});

export const { actions, reducer } = slice;
