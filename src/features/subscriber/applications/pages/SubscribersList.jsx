import { Box, Button, HStack, Text } from '@kfonbss/bss-ui-components';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { CsvDownloadBtn } from '@/components/custom';
import ExpandButton from '@/components/custom/ExpandButton';
import GenericCardPage from '@/components/custom/GenericCardPage';
import { getApiProgress } from '@/features/others/ApiProgress/selectors';
import { formatDisplayDate } from '@/utils/dateUtils';
import { PINCODE_LENGTH } from '@/utils/validationUtils';

import { API_ACTION_TYPES, downloadSubscribersCsv, fetchSubscribersPage } from '../actions';
import { CONNECTION_TYPES } from '../components/common/constants';
import SubscriberCard from '../components/SubscriberCard';
import { SUBSCRIBER_STATUS_FILTER, SUBSCRIBERS_LIST_TABLE_KEY } from '../constants';
import { getSubscribersPage } from '../selectors';

// Maps the flat /subscriber-detail/list response onto the card view model
const mapSubscriberToCard = (subscribers) => {
  return subscribers.map((subscriber) => ({
    subscriberUuid: subscriber?.subscriberUuid,
    subscriberId: subscriber?.subscriberId,
    name: subscriber?.name,
    username: subscriber?.username,
    mobile: subscriber?.mobileNo,
    email: subscriber?.email,
    status: subscriber?.subscriptionStatus,
    partnerUuid: subscriber?.partnerUuid,
    franchisee: subscriber?.partnerName,
    packageUuid: subscriber?.packageUuid,
    packageName: subscriber?.packageName,
    speed: subscriber?.speed,
    expiryDate: formatDisplayDate(subscriber?.expiryDate),
    registrationDate: formatDisplayDate(subscriber?.registrationDate),
    daysLeft: subscriber?.daysLeft
  }));
};

// TODO(temp): align field names/values with the real subscriber-list filter API when available
const useSubscriberFilterConfig = () => {
  const { t } = useTranslation();
  return useMemo(
    () => [
      {
        name: 'status',
        label: 'status',
        type: 'select',
        items: SUBSCRIBER_STATUS_FILTER.map(({ id, label }) => ({ id, name: t(label) }))
      },
      {
        name: 'connectionType',
        label: 'connectionType',
        type: 'select',
        items: [
          { id: CONNECTION_TYPES.HOME_CONNECTION, name: t('homeConnection') },
          { id: CONNECTION_TYPES.SME_CONNECTION, name: t('smeConnection') }
        ]
      },
      { name: 'district', label: 'district', type: 'text' },
      { name: 'pincode', label: 'pincode', type: 'text', props: { maxLength: PINCODE_LENGTH, inputMode: 'numeric' } },
      { name: 'fromDate', label: 'fromDate', type: 'date' },
      { name: 'toDate', label: 'toDate', type: 'date' }
    ],
    [t]
  );
};

// Bulk-action bar — rendered only when showBulkActions is enabled
const BulkActionBar = ({ selectedCount, onExport, onClear, isExporting }) => {
  const { t } = useTranslation();
  if (!selectedCount) return null;
  return (
    <HStack
      justify='space-between'
      bg='primary.50'
      border='1px solid'
      borderColor='primary.100'
      borderRadius='10px'
      px={4}
      py={2}
    >
      <Text fontSize='sm' fontWeight='medium' color='primary.600'>
        {t('itemsSelected', { 0: selectedCount })}
      </Text>
      <HStack spacing={3}>
        <Button size='sm' variant='outline' onClick={onClear}>
          {t('clearSelection')}
        </Button>
        <Button size='sm' variant='solid' onClick={onExport} loading={isExporting}>
          {t('exportSelected')}
        </Button>
      </HStack>
    </HStack>
  );
};

const SubscribersList = ({ showBulkActions = false }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const listData = useSelector(getSubscribersPage);
  const displayData = mapSubscriberToCard(listData);
  const [expandAll, setExpandAll] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const filterConfig = useSubscriberFilterConfig();

  const isExporting = useSelector((s) => !!getApiProgress(s)[API_ACTION_TYPES.DOWNLOAD_SUBSCRIBERS_CSV]);

  const handleDownloadCsv = () => dispatch(downloadSubscribersCsv());
  const handleBulkExport = () => dispatch(downloadSubscribersCsv({ subscriberIds: selectedIds.join(',') }));

  const toolbarActions = (
    <HStack spacing={3}>
      <CsvDownloadBtn onClick={handleDownloadCsv} label={t('downloadCsv')} />
      <ExpandButton isAllExpanded={expandAll} setIsAllExpanded={setExpandAll} />
    </HStack>
  );

  return (
    <Box display='flex' flexDirection='column' h='calc(100vh - 120px)' overflow='hidden'>
      {showBulkActions && (
        <BulkActionBar
          selectedCount={selectedIds.length}
          onExport={handleBulkExport}
          onClear={() => setSelectedIds([])}
          isExporting={isExporting}
        />
      )}
      <GenericCardPage
        pageTitle={t('subscribersList')}
        data={displayData}
        fetchAction={fetchSubscribersPage}
        tableKey={SUBSCRIBERS_LIST_TABLE_KEY}
        CardComponent={SubscriberCard}
        filterConfig={filterConfig}
        actions={toolbarActions}
        expandAll={expandAll}
      />
    </Box>
  );
};

export default SubscribersList;
