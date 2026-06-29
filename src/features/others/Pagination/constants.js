export const STATE_REDUCER_KEY = 'pagination-common';

export const ITEMS_PER_PAGE = [10, 25, 50, 100, 250, 500];

export const ORDER_BY = {
  ASC: 'ASC',
  DESC: 'DESC'
};
export const DEFAULT_VALUES = {
  PAGINATION: {
    page: 0,
    size: ITEMS_PER_PAGE[0]
  },
  SORT: {
    order: ORDER_BY.DESC,
    sort: 'createdAt'
  },
  RESPONSE: {
    totalElements: 0
  }
};
