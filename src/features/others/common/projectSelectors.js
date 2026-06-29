import { flow } from 'lodash-es';

import { STATE_REDUCER_KEY } from './constants';

const getCommonData = (state) => state[STATE_REDUCER_KEY];

const commonConfig = (state) => state.commonConfig;
export const getCommonConfigSelector = flow(getCommonData, commonConfig);

const userProfile = (state) => state.userProfile || {};
export const getUserProfile = flow(getCommonData, userProfile);

const layoutColumns = (state) => state?.layout.columns || {};
export const getLayoutColumns = flow(getCommonData, layoutColumns);
