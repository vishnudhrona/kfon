import { Box, HStack, Icons, SimpleGrid, Stack, Text, VStack } from '@kfonbss/bss-ui-components';
import { useParams } from '@tanstack/react-router';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { DATE_FORMAT } from '@/constants/date';
import { formatDisplayDate } from '@/utils/dateUtils';

import { fetchSubscriberDataUsage } from '../actions';
import { DATA_USAGE_SESSION_COLUMNS } from '../constants';
import { getSubscriberDataUsage } from '../selectors';

const formatDateTime = (value) => formatDisplayDate(value, DATE_FORMAT.DATE_TIME) || '—';

// Flatten a session object onto the DATA_USAGE_SESSION_COLUMNS order
const toSessionRow = (s) => [
  formatDateTime(s?.startTime),
  formatDateTime(s?.endTime),
  s?.sessionDuration ?? '—',
  s?.uploadMb ?? '—',
  s?.downloadMb ?? '—',
  s?.totalMb ?? '—',
  s?.networkDetails?.mac ?? '—',
  s?.networkDetails?.framedIp ?? '—',
  s?.networkDetails?.framedIpv6Prefix ?? '—',
  s?.networkDetails?.framedIpv6Delegated ?? '—'
];

// Maps the /subscriber-detail/{id}/data-usage response onto this page's view model
const mapUsage = (data) => {
  const d = data || {};
  const sessions = [d.activeSession, ...(d.sessionHistory || [])].filter(Boolean);
  const sumBy = (key) => sessions.reduce((acc, s) => acc + (Number(s?.[key]) || 0), 0);
  return {
    name: d.name,
    partner: d.partnerName,
    username: d.username,
    subscriberId: d.subscriberId,
    subscriptionExpiry: formatDisplayDate(d.subscriptionExpiry),
    subscriptionType: d.subscriptionType,
    packageName: d.packageName,
    bandwidthProfile: d.currentBandwidthProfile,
    remarks: d.remarks,
    stats: [
      { key: 'packageData', value: d.packageData ?? '—', unit: 'MB' },
      { key: 'dataUsed', value: d.dataUsed ?? '—', unit: 'MB' },
      { key: 'addOnData', value: d.addonData ?? '—', unit: 'MB' },
      { key: 'addOnUsed', value: d.addonUsed ?? '—', unit: 'MB' }
    ],
    remaining: { value: d.remainingVolume ?? '—', unit: 'MB' },
    session: sessions.length
      ? {
          rows: sessions.map(toSessionRow),
          totalRow: [sumBy('uploadMb'), sumBy('downloadMb'), sumBy('totalMb'), '-', '-', '-', '-']
        }
      : undefined
  };
};

const STAT_ICONS = {
  packageData: Icons.PackageDataIcon,
  dataUsed: Icons.DataUsedIcon,
  addOnData: Icons.AddOnDataIcon,
  addOnUsed: Icons.AddOnUsedIcon
};

const InfoRow = ({ label, value }) => (
  <HStack justify='space-between' w='full' py={2.5} borderBottom='1px solid' borderColor='gray.100' align='start'>
    <Text fontSize='sm' fontWeight='medium' color='#6d6d6d' flexShrink={0}>
      {label}
    </Text>
    <Text fontSize='sm' fontWeight='semibold' color='#333' textAlign='right'>
      {value ?? '—'}
    </Text>
  </HStack>
);

const SectionTitle = ({ title }) => (
  <HStack w='full' spacing={3} mb={4} align='center'>
    <Text fontSize='md' fontWeight='semibold' color='#060606' flexShrink={0}>
      {title}
    </Text>
    <Box flex={1} h='1px' bg='gray.200' />
  </HStack>
);

/* White stat card with pink border */
const StatCard = ({ icon: Icon, label, value, unit }) => (
  <VStack align='start' spacing={1} bg='white' border='1px solid' borderColor='primary.500' borderRadius='8px' p={3}>
    <HStack spacing={2}>
      {Icon && <Icon boxSize='14px' color='primary.500' />}
      <Text fontSize='sm' fontWeight='medium' color='primary.500'>
        {label}
      </Text>
    </HStack>
    <HStack spacing={1} align='baseline'>
      <Text fontSize='lg' fontWeight='semibold' color='#333'>
        {value}
      </Text>
      {unit && (
        <Text fontSize='sm' color='#4b5563'>
          {unit}
        </Text>
      )}
    </HStack>
  </VStack>
);

const SessionTable = ({ session }) => {
  const { t } = useTranslation();
  const cellProps = { flex: 1, minW: '110px', px: 4, py: 3, fontSize: 'sm' };
  return (
    <Box w='full' overflowX='auto' border='1px solid' borderColor='gray.100' borderRadius='8px'>
      {/* Header */}
      <HStack spacing={0} bg='#f9fafb' minW='1100px'>
        {DATA_USAGE_SESSION_COLUMNS.map((col) => (
          <Box key={col} {...cellProps}>
            <Text fontSize='xs' color='#4b5563' textTransform='uppercase' letterSpacing='0.3px'>
              {t(col)}
            </Text>
          </Box>
        ))}
      </HStack>
      {/* Data rows */}
      {session?.rows?.map((row, idx) => (
        <HStack key={idx} spacing={0} bg='rgba(254,252,232,0.4)' borderTop='1px solid' borderColor='gray.100' minW='1100px'>
          {row.map((val, i) => (
            <Box key={i} {...cellProps}>
              <Text color='#4b5563'>{val}</Text>
            </Box>
          ))}
        </HStack>
      ))}
      {/* Total row */}
      <HStack spacing={0} bg='rgba(254,252,232,0.6)' borderTop='1px solid' borderColor='gray.100' minW='1100px'>
        <Box flex={3} minW='330px' px={4} py={3} textAlign='right'>
          <Text fontSize='md' fontWeight='semibold' color='#5b1a3d'>
            {t('total')} (MB)
          </Text>
        </Box>
        {session?.totalRow?.map((val, i) => (
          <Box key={i} flex={1} minW='110px' px={4} py={3} textAlign='center'>
            <Text fontSize='sm' fontWeight='semibold' color='#111827'>
              {val}
            </Text>
          </Box>
        ))}
      </HStack>
    </Box>
  );
};

const ViewDataUsage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { subscriberId } = useParams({ strict: false });
  const usageData = useSelector(getSubscriberDataUsage);
  const usage = useMemo(() => mapUsage(usageData), [usageData]);

  useEffect(() => {
    if (subscriberId) dispatch(fetchSubscriberDataUsage(subscriberId));
  }, [dispatch, subscriberId]);

  return (
    <Box display='flex' flexDirection='column' h='calc(100vh - 120px)' overflow='hidden'>
      <Box flex={1} overflow='auto' p={6}>
        {/* Yellow header bar */}
        <HStack justify='space-between' bg='#FFFAEB' px={6} py={3.5} borderRadius='12px' mb={6}>
          <Text fontSize='lg' fontWeight='semibold' color='font_color.primary'>
            {t('subscriberDetails')}
          </Text>
          <Box
            as='button'
            w='30px'
            h='30px'
            borderRadius='full'
            bg='#ebebeb'
            display='flex'
            alignItems='center'
            justifyContent='center'
          >
            <Icons.PenIcon boxSize={4} color='gray.600' />
          </Box>
        </HStack>

        <Box bg='white' border='1px solid' borderColor='gray.200' borderRadius='12px' p={6}>
          {/* Basic Details */}
          <SectionTitle title={t('basicDetails')} />
          <Stack direction={{ base: 'column', lg: 'row' }} gap={16} mb={6}>
            <VStack flex={1} align='stretch' spacing={0}>
              <InfoRow label={t('name')} value={usage.name} />
            </VStack>
            <VStack flex={1} align='stretch' spacing={0}>
              <InfoRow label={t('partner')} value={usage.partner} />
            </VStack>
          </Stack>

          {/* Subscription Data summary */}
          <SectionTitle title={t('subscriptionData')} />
          <Stack direction={{ base: 'column', lg: 'row' }} gap={16} mb={8}>
            <VStack flex={1} align='stretch' spacing={0}>
              <InfoRow label={t('username')} value={usage.username} />
              <InfoRow label={t('subscriptionExpiry')} value={usage.subscriptionExpiry} />
              <InfoRow label={t('package')} value={usage.packageName} />
            </VStack>
            <VStack flex={1} align='stretch' spacing={0}>
              <InfoRow label={t('subscriberId')} value={usage.subscriberId} />
              <InfoRow label={t('subscriptionType')} value={usage.subscriptionType} />
            </VStack>
          </Stack>

          {/* Usage card */}
          <HStack spacing={2} mb={3}>
            <Icons.PackageDataIcon boxSize='16px' color='#5b1a3d' />
            <Text fontSize='md' fontWeight='semibold' color='#1f2937'>
              {t('subscriptionData')}
            </Text>
          </HStack>

          <Box
            border='1px solid'
            borderColor='gray.200'
            borderRadius='8px'
            overflow='hidden'
            bg='linear-gradient(to right, #fefce8, #ffffff)'
          >
            {/* Top stats */}
            <SimpleGrid columns={{ base: 2, md: 3, lg: 5 }} gap={4} p={5}>
              {usage.stats?.map((stat) => (
                <StatCard
                  key={stat.key}
                  icon={STAT_ICONS[stat.key]}
                  label={t(stat.key)}
                  value={stat.value}
                  unit={stat.unit}
                />
              ))}
              {/* Remaining volume — magenta gradient */}
              <VStack align='start' spacing={1} borderRadius='8px' p={3} bg='linear-gradient(to bottom right, #5b1a3d, #7a234f)'>
                <Text fontSize='sm' color='#fef08a'>
                  {t('remainingVolume')}
                </Text>
                <HStack spacing={1} align='baseline'>
                  <Text fontSize='lg' fontWeight='bold' color='white'>
                    {usage.remaining?.value}
                  </Text>
                  <Text fontSize='sm' color='#fef9c3'>
                    {usage.remaining?.unit}
                  </Text>
                </HStack>
              </VStack>
            </SimpleGrid>

            <Box h='1px' bg='#f3f4f6' />

            {/* Bandwidth & Remarks */}
            <Stack
              direction={{ base: 'column', md: 'row' }}
              justify='space-between'
              align={{ base: 'start', md: 'center' }}
              px={5}
              py={3}
              spacing={3}
            >
              <HStack spacing={2}>
                <Icons.BandwidthIcon boxSize='14px' color='primary.500' />
                <Text fontSize='sm' color='#374151'>
                  {t('currentBandwidthProfile')}:
                </Text>
                <Box bg='#FFDE74' px={2} py={1} borderRadius='6px'>
                  <Text fontSize='xs' fontWeight='bold' color='#5b1a3d'>
                    {usage.bandwidthProfile}
                  </Text>
                </Box>
              </HStack>
              <HStack spacing={2}>
                <Text fontSize='sm' color='#4b5563'>
                  {t('remarks')}:
                </Text>
                <Text fontSize='sm' fontStyle='italic' color='black'>
                  {usage.remarks}
                </Text>
              </HStack>
            </Stack>

            <Box h='1px' bg='#f3f4f6' />

            {/* Session Details */}
            <Box bg='rgba(254,252,232,0.5)' px={5} py={3}>
              <HStack spacing={2}>
                <Icons.PackageDataIcon boxSize='14px' color='#5b1a3d' />
                <Text fontSize='md' fontWeight='semibold' color='#1f2937'>
                  {t('sessionDetails')}
                </Text>
              </HStack>
            </Box>

            <Box p={5}>
              <SessionTable session={usage.session} />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ViewDataUsage;
