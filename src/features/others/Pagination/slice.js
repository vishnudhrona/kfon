import { createSlice } from '@reduxjs/toolkit';
import { get, keys, set } from 'lodash-es';

import { SERVER_SIDE_TABLE_KEYS } from '@/constants/server_table';

import { DEFAULT_VALUES, STATE_REDUCER_KEY } from './constants';

const getInitialState = () => {
  const response = {};
  keys(SERVER_SIDE_TABLE_KEYS).forEach((itemKey) => {
    set(response, `pagination.${SERVER_SIDE_TABLE_KEYS[itemKey]}`, DEFAULT_VALUES.PAGINATION);
    set(response, `sort.${SERVER_SIDE_TABLE_KEYS[itemKey]}`, {});
    set(response, `otherProps.${SERVER_SIDE_TABLE_KEYS[itemKey]}`, {});
    set(response, `paginationResponse.${SERVER_SIDE_TABLE_KEYS[itemKey]}`, DEFAULT_VALUES.RESPONSE);
    set(response, `filter.${SERVER_SIDE_TABLE_KEYS[itemKey]}`, {});
    set(response, `data.${SERVER_SIDE_TABLE_KEYS[itemKey]}`, []);
    set(response, `dropdownData.${SERVER_SIDE_TABLE_KEYS[itemKey]}`, []);
  });

  return response;
};

const initialState = getInitialState();

const slice = createSlice({
  initialState,
  name: STATE_REDUCER_KEY,
  reducers: {
    resetAll: () => initialState,
    resetPagination: (state, { payload: { key = SERVER_SIDE_TABLE_KEYS.DEFAULT_TABLE } = {} }) => {
      set(state, `pagination.${key}`, get(initialState, `pagination.${key}`, {}));
    },
    resetSort: (state, { payload: { key = SERVER_SIDE_TABLE_KEYS.DEFAULT_TABLE } = {} }) => {
      set(state, `sort.${key}`, get(initialState, `sort.${key}`, {}));
    },
    resetOtherProps: (state, { payload: { key = SERVER_SIDE_TABLE_KEYS.DEFAULT_TABLE } = {} }) => {
      set(state, `otherProps.${key}`, get(initialState, `otherProps.${key}`, {}));
    },
    resetPaginationResponse: (state, { payload: { key = SERVER_SIDE_TABLE_KEYS.DEFAULT_TABLE } = {} }) => {
      set(state, `paginationResponse.${key}`, get(initialState, `paginationResponse.${key}`, {}));
    },
    setPagination: (state, { payload: { key = SERVER_SIDE_TABLE_KEYS.DEFAULT_TABLE, data = {} } = {} }) => {
      set(state, `pagination.${key}`, { ...get(initialState, `pagination.${key}`, {}), ...data });
    },
    setSort: (state, { payload: { key = SERVER_SIDE_TABLE_KEYS.DEFAULT_TABLE, data = {} } = {} }) => {
      set(state, `sort.${key}`, { ...get(initialState, `sort.${key}`, {}), ...data });
    },
    setOtherProps: (state, { payload: { key = SERVER_SIDE_TABLE_KEYS.DEFAULT_TABLE, data = {} } = {} }) => {
      set(state, `otherProps.${key}`, { ...get(initialState, `otherProps.${key}`, {}), ...data });
    },
    setPaginationResponse: (state, { payload: { key = SERVER_SIDE_TABLE_KEYS.DEFAULT_TABLE, data = {} } = {} }) => {
      set(state, `paginationResponse.${key}`, { ...get(initialState, `paginationResponse.${key}`, {}), ...data });
    },
    setFilter: (state, { payload: { key = SERVER_SIDE_TABLE_KEYS.DEFAULT_TABLE, data = {} } = {} }) => {
      set(state, `filter.${key}`, { ...get(initialState, `filter.${key}`, {}), ...data });
    },
    resetFilter: (state, { payload: { key = SERVER_SIDE_TABLE_KEYS.DEFAULT_TABLE } = {} }) => {
      set(state, `filter.${key}`, get(initialState, `filter.${key}`, {}));
    },
    setTableData: (state, { payload: { tableKey = SERVER_SIDE_TABLE_KEYS.DEFAULT_TABLE, data = [] } = {} }) => {
      set(state, `data.${tableKey}`, data);
    },
    setDropdownData: (state, { payload: { tableKey = SERVER_SIDE_TABLE_KEYS.DEFAULT_TABLE, data = [] } = {} }) => {
      set(state, `dropdownData.${tableKey}`, data);
    },
    clearTableData: (state, { payload: { tableKey = SERVER_SIDE_TABLE_KEYS.DEFAULT_TABLE } = {} }) => {
      set(state, `data.${tableKey}`, null);
      set(state, `dropdownData.${tableKey}`, []);
    }
  }
});

export const { actions, reducer } = slice;
