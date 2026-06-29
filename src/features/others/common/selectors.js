import { flow } from 'lodash-es';

import { STATE_REDUCER_KEY } from './constants';

const getCommonData = (state) => state[STATE_REDUCER_KEY];

const commonModalData = (state) => state.commonModal;
export const getCommonModalData = flow(getCommonData, commonModalData);

const showPopUp = (state) => state.showPopUp;
export const getShowPopUpMessage = flow(getCommonData, showPopUp);
