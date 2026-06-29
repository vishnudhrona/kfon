import { all, call, put, select, takeLatest } from 'redux-saga/effects';

import { actions as permissionActions } from '@/features/others/common/permissionSlice';
import { handleAPIRequest } from '@/utils/httpUtils';
import { flattenPermissions } from '@/utils/permissionUtils';

import { ACTION_TYPES } from './action';
import * as api from './api';
import { getMenuTree } from './selector';

export function* fetchMainMenus() {
  const { error } = yield call(handleAPIRequest, api.mainMenusApi);
  if (error) return;
  // handleAPIRequest's success variant has already reduced the response into
  // menuTree. Derive permissionMap from that same tree so the two never
  // desync — appRoute.beforeLoad's fetchMenusDirectly only runs when menuTree
  // is empty, so without this the saga-driven menu fetch would leave
  // permissionMap stale and permission-gated menus would render empty.
  const menuTree = yield select(getMenuTree);
  if (!menuTree?.length) return;
  yield put(permissionActions.setPermissions(flattenPermissions(menuTree)));
}

export default function* mainMenuSaga() {
  yield all([takeLatest(ACTION_TYPES.FETCH_MAIN_MENUS, fetchMainMenus)]);
}
