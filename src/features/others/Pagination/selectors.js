import { flow } from 'lodash-es';

import { STATE_REDUCER_KEY } from './constants';

const paginationDetails = (state) => state[STATE_REDUCER_KEY];

const pagination = (state) => state.pagination;
export const getServerSidePaginationDetails = flow(paginationDetails, pagination);

const sort = (state) => state.sort;
export const getServerSideSortDetails = flow(paginationDetails, sort);

const otherProps = (state) => state.otherProps;
export const getServerSideOtherProps = flow(paginationDetails, otherProps);

const paginationResponse = (state) => state.paginationResponse;
export const getServerSidePaginationResponse = flow(paginationDetails, paginationResponse);

const filter = (state) => state.filter;
export const getServerSideFilterDetails = flow(paginationDetails, filter);

const data = (state) => state.data;
export const getServerSideData = flow(paginationDetails, data);

//Hack: Dropdown data selector , to be removed later or fixed properly
const dropdownData = (state) => state.dropdownData;
export const getServerSideDropdownData = flow(paginationDetails, dropdownData);