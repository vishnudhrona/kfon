import { FILE_HEX_SIGNATURE } from '@/constants/file';

export const getFileDetailsFromStream = (stream) => {
  try {
    const blob = new Blob([stream]);
    const localURL = URL.createObjectURL(blob);
    const uintArray = new Uint8Array(stream);
    let header = '';
    for (let i = 0; i < uintArray.length && i < 4; i += 1) {
      header += uintArray[i].toString(16);
    }
    const { ext = 'jpeg', type = 'application/octet-stream' } = FILE_HEX_SIGNATURE[header];
    return {
      url: localURL,
      type,
      size: blob.size,
      ext
    };
    // eslint-disable-next-line no-unused-vars
  } catch (error) {
    return {
      url: '',
      type: 'invalid/invalid',
      size: 0,
      ext: 'invalid'
    };
  }
};

export const getFileDetailsFromBlob = (blob) => {
  try {
    const { type = 'application/pdf', size = 0 } = blob;

    return {
      url: window.URL.createObjectURL(blob),
      type,
      size,
      ext: type.split('/').length === 2 ? type.split('/')[1] : 'pdf'
    };
    // eslint-disable-next-line no-unused-vars
  } catch (error) {
    return {
      url: '',
      type: 'invalid/invalid',
      size: 0,
      ext: 'invalid'
    };
  }
};

function b64toBlob(b64Data, contentType = '', sliceSize = 512) {
  const byteCharacters = atob(b64Data);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);
    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i += 1) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }
  return new File(byteArrays, 'download', { type: contentType });
}

export const generateLocalURLFromBlob = (response, type = 'image/jpeg') => {
  try {
    const blob = b64toBlob(response, type);
    const url1 = window.URL.createObjectURL(blob);
    return {
      url: url1,
      size: blob.size,
      type,
      ext: type.split('/').length === 2 ? type.split('/')[1] : 'jpeg'
    };
    // eslint-disable-next-line no-unused-vars
  } catch (fileResponseError) {
    return {
      url: '',
      type: 'invalid/invalid',
      size: 0,
      ext: 'invalid'
    };
  }
};

export const downloadFileFromBlobResponse = (response, fileName = 'download.csv') => {
  if (response) {
    const url = window.URL.createObjectURL(new Blob([response]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
  }
};

/**
 * Builds a multipart/form-data payload.
 *
 * @param {Object} fields - Key-value pairs to append. Object values are JSON-stringified; others are appended as-is.
 * @param {File|null} file - Optional file to append.
 * @param {string} fileKey - Form field name for the file (default: 'file').
 * @returns {FormData}
 *
 * @example
 * // With file
 * buildMultipartFormData({ request: { csv: true, vendorId: '...' } }, csvFile);
 *
 * @example
 * // Without file
 * buildMultipartFormData({ request: { csv: false, devices: [...] } });
 */
export const buildMultipartFormData = (fields = {}, file = null, fileKey = 'file') => {
  const formData = new FormData();
  if (file) {
    formData.append(fileKey, file);
  }
  Object.entries(fields).forEach(([key, value]) => {
    formData.append(key, typeof value === 'object' ? JSON.stringify(value) : value);
  });
  return formData;
};

export const getFileNameFromHeaders = (headers, defaultName = 'download.xlsx') => {
  if (headers && headers['content-disposition']) {
    const contentDisposition = headers['content-disposition'];
    const fileNameMatch = contentDisposition.match(/filename=(.+)/);
    if (fileNameMatch && fileNameMatch.length > 1) {
      return fileNameMatch[1].replace(/['"]/g, '');
    }
  }
  return defaultName;
};
