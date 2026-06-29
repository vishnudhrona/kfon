import { createSelector } from '@reduxjs/toolkit';
import { get } from 'lodash-es';

import { STATE_REDUCER_KEY } from './constants';

const notes = (state) => state[STATE_REDUCER_KEY];

export const getNotesList = createSelector([notes], (state) => get(state, 'notesList', []));

export const getAllRoles = createSelector([notes], (state) => get(state, 'allRoles', []));

export const getUsersByRoleId = createSelector([notes], (state) => get(state, 'usersByRoleId', []));

export const getFileViewUrl = createSelector([notes], (state) => get(state, 'fileViewUrl', null));

export const getForwardedNotes = createSelector([notes], (state) => get(state, 'forwardedNotes', []));

export const getUnreadForwardedCount = createSelector([getForwardedNotes], (list) =>
  list.filter((n) => !n.viewed).length
);
