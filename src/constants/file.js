export const FILE_RESPONSE_TYPE = {
  STREAM: 'FILE_STREAM',
  BLOB: 'BLOB'
};

export const FILE_CONTENT_TYPE = {
  JSON: 'application/json',
  PDF: 'application/pdf',
  ZIP: 'application/zip',
  WEBM:'video/webm',
  MP4:'video/mp4',
  MPEG:'video/mpeg',
  JPEG:'image/jpeg',
  JPG:'image/jpg',
  GIF:'image/gif',
  PNG:'image/png'
};

export const FILE_HEX_SIGNATURE = {
  '1A45DFA3': { type: FILE_CONTENT_TYPE.WEBM, ext: 'webm' },
  '66747970': { type: FILE_CONTENT_TYPE.MP4, ext: 'mp4' },
  '000001BA': { type:FILE_CONTENT_TYPE.MPEG, ext: 'mpeg' },
  '000001B3': { type:FILE_CONTENT_TYPE.MPEG, ext: 'mpeg' },
  FFD8FFE0: { type: FILE_CONTENT_TYPE.JPG, ext: 'jpg' },
  FFD8FFDB: { type: FILE_CONTENT_TYPE.JPEG, ext: 'jpeg' },
  FFD8FFEE: { type: FILE_CONTENT_TYPE.JPEG, ext: 'jpeg' },
  FFD8FFE1: { type: FILE_CONTENT_TYPE.JPEG, ext: 'jpeg' },
  '47494638': { type: FILE_CONTENT_TYPE.GIF, ext: 'gif' },
  '89504e47': { type: FILE_CONTENT_TYPE.PNG, ext: 'png' },
  '25504446': { type: FILE_CONTENT_TYPE.PDF, ext: 'pdf' }
};