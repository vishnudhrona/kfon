import dayjs from 'dayjs';

export const fmtDate = (v) => (v ? dayjs(v).format('DD-MM-YYYY') : '—');
