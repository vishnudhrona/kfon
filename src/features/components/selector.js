import { flow } from 'lodash-es';

import { STATE_REDUCER_KEY } from './constants';

const menuState = (state) => state[STATE_REDUCER_KEY];

export const getMenuTree = flow(menuState, (state) => state?.menuTree);
export const getCurrentSideMenu = flow(menuState, (state) => state?.currentSideMenu);
export const getActiveSideMenuKey = flow(menuState, (state) => state?.activeSideMenuKey);
export const getActiveTopMenuKey = flow(menuState, (state) => state?.activeTopMenuKey);
