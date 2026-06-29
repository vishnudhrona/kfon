import { REQUEST_METHOD } from "@/constants/api";

export const fetchDocument = ({
  data, url = '', method = REQUEST_METHOD.GET, types, isDocument = true, responseType, headers = {}
}) => {
  return {
    url,
    method,
    payload: {
      types,
      data,
      isDocument,
      documentType: responseType,
      headers
    }
  };
};
