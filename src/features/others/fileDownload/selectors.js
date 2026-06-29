import { flow } from 'lodash-es';

import { STATE_REDUCER_KEY } from './constants';

const fileDownload = (state) => state[STATE_REDUCER_KEY];

const downloads = (state) => state.downloads;
export const getDownloads = flow(fileDownload, downloads);

const status = (state) => state.status;
export const getDownloadStatus = flow(fileDownload, status);
