import { createSelector } from '@reduxjs/toolkit';
import { get } from 'lodash-es';

import { STATE_REDUCER_KEY } from './constants';

const notificationsState = (state) => state[STATE_REDUCER_KEY];

export const getNotificationsList = createSelector([notificationsState], (state) =>
  get(state, 'notificationsList', [])
);

export const getUnreadNotificationsCount = createSelector([getNotificationsList], (list) =>
  list.filter((n) => !n.viewed).length
);

export const getNotificationsLoading = createSelector([notificationsState], (state) =>
  get(state, 'loading', false)
);
