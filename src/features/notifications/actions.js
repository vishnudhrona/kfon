import { createAction } from '@reduxjs/toolkit';

import { generateActionTypeVariants } from '@/utils/actionUtils';

import { STATE_REDUCER_KEY } from './constants';

export const API_ACTION_TYPES = {
  FETCH_NOTIFICATIONS: `${STATE_REDUCER_KEY}/FETCH_NOTIFICATIONS`
};

export const API_ACTION_TYPE_VARIANTS = generateActionTypeVariants(API_ACTION_TYPES);

export const fetchNotifications = createAction(API_ACTION_TYPES.FETCH_NOTIFICATIONS);
