import { Box, HStack, Icons, Text, VStack } from '@kfonbss/bss-ui-components';
import { useParams } from '@tanstack/react-router';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { DATE_FORMAT } from '@/constants/date';
import { formatDisplayDate } from '@/utils/dateUtils';

import { fetchRadiusDetails } from '../actions';
import { getRadiusDetails } from '../selectors';

const DASH = '—';
const dash = (v) => (v === null || v === undefined || v === '' ? DASH : v);
const dateTime = (v) => formatDisplayDate(v, DATE_FORMAT.DATE_TIME) || DASH;

// Column config per section: { key (response field), label (i18n key), format? }
const CHECK_COLUMNS = [
  { key: 'attribute', label: 'attribute' },
  { key: 'op', label: 'operator' },
  { key: 'value', label: 'value' },
  { key: 'startDay', label: 'startDay', format: dateTime },
  { key: 'endDay', label: 'endDay', format: dateTime },
  { key: 'bssCircle', label: 'circle' },
  { key: 'bssAnp', label: 'anp' },
  { key: 'userType', label: 'userType' },
  { key: 'usermac', label: 'macAddress' },
  { key: 'allottedVol', label: 'allottedVolume' },
  { key: 'allottedConsumed', label: 'allottedConsumed' },
  { key: 'fallbackspeed', label: 'fallbackSpeed' },
  { key: 'lastUpdateTime', label: 'lastUpdated', format: dateTime }
];

const REPLY_COLUMNS = [
  { key: 'attribute', label: 'attribute' },
  { key: 'op', label: 'operator' },
  { key: 'value', label: 'value' }
];

const GROUP_COLUMNS = [
  { key: 'groupname', label: 'groupName' },
  { key: 'priority', label: 'priority' }
];

const SectionTitle = ({ title }) => (
  <HStack w='full' spacing={3} mb={4} align='center'>
    <Text fontSize='md' fontWeight='semibold' color='#060606' flexShrink={0}>
      {title}
    </Text>
    <Box flex={1} h='1px' bg='gray.200' />
  </HStack>
);

const DataTable = ({ columns, rows }) => {
  const { t } = useTranslation();
  const cellProps = { flex: 1, minW: '120px', px: 4, py: 3, fontSize: 'sm' };
  const minW = `${columns.length * 130}px`;

  if (!rows?.length) {
    return (
      <Box w='full' border='1px solid' borderColor='gray.100' borderRadius='8px' py={6} textAlign='center'>
        <Text fontSize='sm' color='#9ca3af'>
          {t('noRecordsFound')}
        </Text>
      </Box>
    );
  }

  return (
    <Box w='full' overflowX='auto' border='1px solid' borderColor='gray.100' borderRadius='8px'>
      <HStack spacing={0} bg='#f9fafb' minW={minW}>
        {columns.map((col) => (
          <Box key={col.key} {...cellProps}>
            <Text fontSize='xs' color='#4b5563' textTransform='uppercase' letterSpacing='0.3px'>
              {t(col.label)}
            </Text>
          </Box>
        ))}
      </HStack>
      {rows.map((row, idx) => (
        <HStack key={row.id ?? idx} spacing={0} bg='rgba(254,252,232,0.4)' borderTop='1px solid' borderColor='gray.100' minW={minW}>
          {columns.map((col) => (
            <Box key={col.key} {...cellProps}>
              <Text color='#4b5563'>{dash(col.format ? col.format(row[col.key]) : row[col.key])}</Text>
            </Box>
          ))}
        </HStack>
      ))}
    </Box>
  );
};

const RadiusDetails = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { username } = useParams({ strict: false });
  const radius = useSelector(getRadiusDetails) || {};

  useEffect(() => {
    if (username) dispatch(fetchRadiusDetails(username));
  }, [dispatch, username]);

  return (
    <Box display='flex' flexDirection='column' h='calc(100vh - 120px)' overflow='hidden'>
      <Box flex={1} overflow='auto' p={6}>
        {/* Yellow header bar */}
        <HStack justify='space-between' bg='#FFFAEB' px={6} py={3.5} borderRadius='12px' mb={6}>
          <Text fontSize='lg' fontWeight='semibold' color='font_color.primary'>
            {t('radiusDetails')}
          </Text>
          <HStack spacing={2}>
            <Icons.ProfileIcon boxSize={4} color='gray.600' />
            <Text fontSize='sm' fontWeight='semibold' color='#333'>
              {dash(username)}
            </Text>
          </HStack>
        </HStack>

        <Box bg='white' border='1px solid' borderColor='gray.200' borderRadius='12px' p={6}>
          <VStack align='stretch' spacing={8}>
            <Box>
              <SectionTitle title={t('radiusChecks')} />
              <DataTable columns={CHECK_COLUMNS} rows={radius.radChecks} />
            </Box>

            <Box>
              <SectionTitle title={t('radiusReplies')} />
              <DataTable columns={REPLY_COLUMNS} rows={radius.radReplies} />
            </Box>

            <Box>
              <SectionTitle title={t('radiusUserGroups')} />
              <DataTable columns={GROUP_COLUMNS} rows={radius.radUserGroups} />
            </Box>
          </VStack>
        </Box>
      </Box>
    </Box>
  );
};

export default RadiusDetails;
