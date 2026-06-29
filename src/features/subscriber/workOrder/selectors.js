import { STATE_REDUCER_KEY, WORK_ORDER_TABLE_KEY } from './constants';

export const getWorkOrderList = (state) => state[STATE_REDUCER_KEY][WORK_ORDER_TABLE_KEY];
export const getEwsPackages = (state) => state[STATE_REDUCER_KEY].ewsPackages;
export const getEwsWorkOrderOptions = (state) => state[STATE_REDUCER_KEY].ewsWorkOrderOptions;
