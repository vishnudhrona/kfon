import dayjs from 'dayjs';
import { useMemo } from 'react';

const STATUS_COLORS = {
  OPEN: '#4ADE80',
  PENDING: '#FBBF24',
  CLOSED: '#F472B6',
  CONNECTED: '#3B82F6',
  FEASIBLE: '#10B981',
  IN_PROGRESS: '#F59E0B',
  REJECTED: '#EF4444',
  SUBMITTED: '#8B5CF6',
  VERIFIED: '#06B6D4'
};

const makeFilterConfig = (defaultType, { statusItems, TYPE_ITEMS }) => [
  {
    name: 'enquiryType',
    label: 'type',
    type: 'chip',
    single: true,
    idKey: 'value',
    labelKey: 'label',
    items: TYPE_ITEMS,
    defaultValue: defaultType
  },
  {
    name: 'status',
    label: 'status',
    type: 'chip',
    items: statusItems,
    colors: STATUS_COLORS
  },
  {
    name: 'fromDate',
    label: 'fromDate',
    type: 'date',
    placeholder: 'selectFromDate',
    disablePortal: true
  },
  {
    name: 'toDate',
    label: 'toDate',
    type: 'date',
    placeholder: 'selectToDate',
    disablePortal: true,
    defaultValue: dayjs().toDate(),
    props: { disableFuture: true }
  },
  {
    name: 'pincode',
    label: 'pincode',
    type: 'text',
    placeholder: 'enterPincode'
  }
];

const useEnquiryFilterConfig = ({ statusItems, TYPE_ITEMS }) => {
  const retailFilterConfig = useMemo(
    () => makeFilterConfig('RETAIL', { statusItems, TYPE_ITEMS }),
    [statusItems, TYPE_ITEMS]
  );

  const ewsFilterConfig = useMemo(
    () => makeFilterConfig('EWS', { statusItems, TYPE_ITEMS }),
    [statusItems, TYPE_ITEMS]
  );

  return { retailFilterConfig, ewsFilterConfig };
};

export default useEnquiryFilterConfig;
