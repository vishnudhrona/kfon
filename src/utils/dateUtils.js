import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import duration from 'dayjs/plugin/duration';
import utc from 'dayjs/plugin/utc';

import { DATE_FORMAT } from '@/constants/date';

dayjs.extend(customParseFormat);
dayjs.extend(duration);
dayjs.extend(utc);

export { dayjs };

export const dateDifference = (from = dayjs(), to = dayjs(), unit = 'day') => dayjs(from).diff(dayjs(to), unit);

export const getDurationSince = (dateStr) => {
  if (!dateStr) return '';
  const now = dayjs();
  const past = dayjs(dateStr);
  const diffMs = now.diff(past);
  const dur = dayjs.duration(diffMs);

  const days = Math.floor(dur.asDays());
  const hrs = dur.hours();
  const mins = dur.minutes();

  return `${days} Days, ${hrs} Hrs, ${mins} Min`;
};

export const getTimeAgoParts = (dateStr) => {
  if (!dateStr) return null;
  const diffMs = dayjs().diff(dayjs(dateStr));
  if (diffMs < 0) return null;
  const dur = dayjs.duration(diffMs);
  const days = Math.floor(dur.asDays());
  const hrs = Math.floor(dur.asHours());
  const mins = Math.floor(dur.asMinutes());
  if (days >= 1) return { count: days, unit: days === 1 ? 'day' : 'days' };
  if (hrs >= 1) return { count: hrs, unit: hrs === 1 ? 'hour' : 'hours' };
  if (mins >= 1) return { count: mins, unit: mins === 1 ? 'minute' : 'minutes' };
  return { count: 0, unit: 'justNow' };
};

export const dateTimeNow = () => dayjs().utc('z').format(DATE_FORMAT.DATE_NOW);

export const convertToUTC = (date) => {
  const parsedDate = dayjs(date, {
    format: DATE_FORMAT.DATE_TIME_GMT
  });
  return parsedDate.utc();
};

export const formatDate = (date, format = DATE_FORMAT.DATE_LOCAL) => {
  const parsedDate = dayjs(date, {
    format: DATE_FORMAT.DATE_TIME_GMT
  });
  return parsedDate.format(format);
};

export const parseDate = (dateStr, format = DATE_FORMAT.DATE_LOCAL) => {
  const parsed = dayjs(dateStr, format);
  return parsed.isValid() ? parsed.toDate() : null;
};

export const normalizeDateToISO = (dateStr) => {
  if (!dateStr) return null;
  const parsed = dayjs(dateStr, DATE_FORMAT.DATE_LOCAL, true);
  if (parsed.isValid()) return parsed.format(DATE_FORMAT.DATE_YYYYMMDD);
  return dateStr;
};

export const formatDisplayDate = (dateStr, format = DATE_FORMAT.DATE) => {
  if (!dateStr) return dateStr;
  const parsed = dayjs(dateStr);
  return parsed.isValid() ? parsed.format(format) : dateStr;
};

export const formatDisplayTime = (dateStr, format = 'hh:mm A') => {
  if (!dateStr) return dateStr;
  const parsed = dayjs(dateStr);
  return parsed.isValid() ? parsed.format(format) : dateStr;
};

export const formatDayMonth = (dateStr) => formatDisplayDate(dateStr, DATE_FORMAT.DAY_MONTH);
export const formatYearTime = (dateStr) => formatDisplayDate(dateStr, DATE_FORMAT.YEAR_TIME);
export const formatFullDisplayDate = (dateStr) => formatDisplayDate(dateStr, DATE_FORMAT.FULL_DISPLAY_DATE);

export const getFileNameWithTimestamp = (baseName, extension = 'csv') => {
  const timestamp = dayjs().format('DD-MM-YYYY_HH-mm-ss');
  return `${baseName}_${timestamp}.${extension}`;
};
