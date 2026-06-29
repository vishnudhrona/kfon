import { all,call, takeLatest } from 'redux-saga/effects';

import { handleAPIRequest } from '@/utils/httpUtils';

import { ACTION_TYPES } from './action';
import * as api from './api'

export function* fetchDevicelistTableData() {
    yield call(handleAPIRequest, api.devicelistTableDataApi);
}

export function* fetchDevicePartnerTableData() {
    yield call(handleAPIRequest, api.devicePartnerTableDataApi)
}

export default function* agnpInventorySaga() {
    yield all([
        takeLatest(ACTION_TYPES.FETCH_DEVICELIST_TABLE_DATA, fetchDevicelistTableData),
        takeLatest(ACTION_TYPES.FETCH_DEVICE_PARTNER_TABLE_DATA, fetchDevicePartnerTableData)
    ])
}