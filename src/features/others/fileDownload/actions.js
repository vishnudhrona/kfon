import { createAction } from '@reduxjs/toolkit';

import { STATE_REDUCER_KEY } from './constants';

export const ACTION_TYPES = {
  FETCH_DOCUMENT: `${STATE_REDUCER_KEY}/FETCH_DOCUMENT`,
  DOWNLOAD_DOCUMENT: `${STATE_REDUCER_KEY}/DOWNLOAD_DOCUMENT`,
  DOWNLOAD_DOCUMENT_FROM_URL: `${STATE_REDUCER_KEY}/DOWNLOAD_DOCUMENT_FROM_URL`
};

export const fetchDocument = createAction(ACTION_TYPES.FETCH_DOCUMENT);

export const downloadDocument = createAction(ACTION_TYPES.DOWNLOAD_DOCUMENT);

export const downloadDocumentFromLocalUrl = createAction(ACTION_TYPES.DOWNLOAD_DOCUMENT_FROM_URL);
