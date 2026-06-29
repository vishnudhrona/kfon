import { REQUEST_METHOD } from "@/constants/api";
import { FILE_RESPONSE_TYPE } from "@/constants/file";
import { API_URL } from "@/constants/urls";

export const STATE_REDUCER_KEY = 'download-file';

export const DEFAULT_DOCUMENT_FETCH_DETAILS = {
  url: API_URL.DOCUMENT.FETCH_COMMON_DOCUMENT,
  method: REQUEST_METHOD.GET,
  data: {},
  responseType: FILE_RESPONSE_TYPE.STREAM,
  enableCache: true
};
