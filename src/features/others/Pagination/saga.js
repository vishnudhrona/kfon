import { get } from 'lodash-es';
import { all, put, select } from 'redux-saga/effects';

import { ITEMS_PER_PAGE } from './constants';
import { getServerSideFilterDetails, getServerSidePaginationDetails, getServerSideSortDetails } from './selectors';
import { actions as sliceActions } from './slice';

export function* getCommonPaginationDetails(tableKey) {
  const paginationDetails = yield select(getServerSidePaginationDetails);
  const currentPagination = get(paginationDetails, tableKey, {});
  return currentPagination;
}

export function* getCommonSortDetails(tableKey) {
  const sortDetails = yield select(getServerSideSortDetails);
  const currentPagination = get(sortDetails, tableKey, {});
  return currentPagination;
}

export function* setCommonPaginationResponse(key, data) {
  const responseData = data?.payload || data?.data || data || {};
  const { totalElements , content=[]} = responseData;
  const { pageNumber = 0, pageSize = ITEMS_PER_PAGE[0] } = responseData?.pageable || {};

  yield put(sliceActions.setTableData({ tableKey: key, data: content }));
  yield put(sliceActions.setPagination({ key, data: { page: pageNumber, size: pageSize } }));
  yield put(sliceActions.setPaginationResponse({ key, data: { totalElements } }));
}

export function* getCommonFilterDetails(tableKey) {
  const filterDetails = yield select(getServerSideFilterDetails);
  const currentFilterDetails = get(filterDetails, tableKey, {});
  return currentFilterDetails;
}

export default function* commonPaginationSaga() {
  yield all([]);
}
