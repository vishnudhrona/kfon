import { createAction } from '@reduxjs/toolkit';

import { generateActionTypeVariants } from '@/utils/actionUtils';

import { STATE_REDUCER_KEY } from './constants';

const API_ACTION_TYPES = {
  FETCH_MAIN_MENUS: `${STATE_REDUCER_KEY}/FETCH_MAIN_MENUS`
};

export const ACTION_TYPES = {
  ...API_ACTION_TYPES
};

export const API_ACTION_TYPE_VARIANTS = generateActionTypeVariants(API_ACTION_TYPES);

export const fetchMainMenus = createAction(ACTION_TYPES.FETCH_MAIN_MENUS);
