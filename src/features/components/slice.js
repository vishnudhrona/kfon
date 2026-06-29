import { createSlice } from '@reduxjs/toolkit';

import { ACTION_TYPES, API_ACTION_TYPE_VARIANTS } from './action';
import { STATE_REDUCER_KEY } from './constants';

const initialState = {
  menuTree: [],
  currentSideMenu: [],
  activeSideMenuKey: null,
  activeTopMenuKey: null
};

const slice = createSlice({
  initialState,
  name: STATE_REDUCER_KEY,
  reducers: {
    setCurrentSideMenu: (state, action) => {
      state.currentSideMenu = action.payload;
    },
    setActiveSideMenuKey: (state, action) => {
      state.activeSideMenuKey = action.payload;
    },
    setActiveTopMenuKey: (state, action) => {
      state.activeTopMenuKey = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_MAIN_MENUS][1], (state, { payload }) => {
      state.menuTree = Array.isArray(payload.data) ? payload.data : [];
    });
  }
});

export const { actions, reducer } = slice;
