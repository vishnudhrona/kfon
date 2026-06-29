import { createAction } from "@reduxjs/toolkit";

import { generateActionTypeVariants } from '@/utils/actionUtils'

import { STATE_REDUCER_KEY } from './constants'

const API_ACTION_TYPES = {
    FETCH_DEVICELIST_TABLE_DATA: `${STATE_REDUCER_KEY}/FETCH_DEVICELIST_TABLE_DATA`,
    FETCH_DEVICE_PARTNER_TABLE_DATA: `${STATE_REDUCER_KEY}/FETCH_DEVICE_PARTNER_TABLE_DATA`
}

export const ACTION_TYPES = {
    ...API_ACTION_TYPES
}

export const API_ACTION_TYPE_VARIANTS = generateActionTypeVariants(API_ACTION_TYPES);

export const fetchDevicelistTableData = createAction(ACTION_TYPES.FETCH_DEVICELIST_TABLE_DATA)
export const fetchDevicePartnerTableData = createAction(ACTION_TYPES.FETCH_DEVICE_PARTNER_TABLE_DATA)