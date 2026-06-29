import { Box, Flex, HStack, Text, VStack } from '@kfonbss/bss-ui-components';
import { useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { INVENTORY_DASHBOARD_ACTIONS } from '@/constants/permissions';
import { usePageActions } from '@/hooks/usePageActions';

import {
  fetchInventoryDeviceList,
  fetchInventoryDistrictBreakdown,
  fetchInventoryRecentActivity,
  fetchInventoryRequestPipeline,
  fetchInventoryStockTypeCount,
  fetchInventorySummaryCards,
  fetchInventoryWarrantyAlerts
} from './action';
import { DEVICE_TYPES, INVENTORY_DASHBOARD_SCOPES } from './constants';
import {
  getInventoryDistrictBreakdown,
  getInventoryRecentActivity,
  getInventoryRequestPipeline,
  getInventorySummaryCards,
  getInventoryWarrantyAlerts
} from './selector';

const C = {
  bg: '#F4F6FB',
  card: '#ffffff',
  border: '#E6EEF8',
  primary: '#8D0247',
  primaryBg: '#FFEDF6',
  ink: '#111827',
  inkMid: '#374151',
  inkSoft: '#6B7280',
  line: '#E6EEF8',
  green: '#028D20',
  greenBg: '#DEFFF1',
  amber: '#C58C10',
  amberBg: '#FDF8DC',
  red: '#D72D2E',
  redBg: '#FFF5F5',
  shadow: '0 2px 8px rgba(0,0,0,0.06)',
  shadowHover: '0 6px 20px rgba(0,0,0,0.11)'
};

const ACTIVITY_ICONS = {
  Transfer: '🚚',
  'OEM Send': '📤',
  'Stock Received': '📦',
  Mapped: '🔗',
  'Condition Change': '🔧',
  Replaced: '🔄'
};

const SectionHeader = ({ title }) => (
  <HStack gap='10px' mb='16px'>
    <Box w='4px' h='20px' borderRadius='2px' bg={C.primary} flexShrink={0} />
    <Text fontSize='18px' fontWeight='700' color={C.ink} letterSpacing='-0.2px'>
      {title}
    </Text>
  </HStack>
);

const TypeBreakdownRow = ({ label, value, total, accent }) => {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <Box mb='6px'>
      <HStack justify='space-between' mb='3px'>
        <Text fontSize='12px' fontWeight='600' color={C.inkSoft}>{label}</Text>
        <HStack gap='6px'>
          <Text fontSize='12px' fontWeight='700' color={C.inkMid}>{value.toLocaleString()}</Text>
          <Text fontSize='11px' color={C.inkSoft}>({pct}%)</Text>
        </HStack>
      </HStack>
      <Box h='4px' borderRadius='100px' bg={C.line} overflow='hidden'>
        <Box h='100%' w={`${pct}%`} bg={accent} borderRadius='100px' />
      </Box>
    </Box>
  );
};

const MetricCard = ({ card }) => {
  const [expanded, setExpanded] = useState(false);
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleClick = () => {
    if (card.route) navigate({ to: card.route });
    else if (card.byType) setExpanded((p) => !p);
  };

  return (
    <Box
      bg={C.card}
      border={`1.5px solid ${card.alert ? card.accent : C.border}`}
      borderRadius='16px'
      overflow='hidden'
      boxShadow={C.shadow}
      cursor={card.byType || card.route ? 'pointer' : 'default'}
      transition='all 0.18s'
      _hover={{ boxShadow: C.shadowHover, transform: 'translateY(-2px)' }}
      onClick={handleClick}
      position='relative'
    >
      {card.alert && <Box h='3px' bg={`linear-gradient(90deg, ${card.accent}, #f97316)`} />}
      <Box p='16px 18px'>
        <HStack justify='space-between' align='flex-start' mb='10px'>
          <Box w='40px' h='40px' borderRadius='12px' bg={card.accentBg} display='flex' alignItems='center' justifyContent='center' fontSize='20px' flexShrink={0}>
            {card.icon}
          </Box>
          {card.byType && (
            <Box fontSize='10px' fontWeight='700' letterSpacing='0.5px' px='8px' py='3px' borderRadius='100px' bg={C.line} color={C.inkSoft} textTransform='uppercase'>
              {expanded ? t('collapse') : t('byType')}
            </Box>
          )}
        </HStack>
        <Text fontSize='12px' fontWeight='700' letterSpacing='0.4px' textTransform='uppercase' color={C.inkSoft} mb='4px'>
          {t(card.labelKey)}
        </Text>
        <Text fontSize='32px' fontWeight='800' letterSpacing='-1px' lineHeight='1' color={card.accent}>
          {card.value.toLocaleString()}
        </Text>
        <Box maxH={expanded ? '260px' : '0'} overflow='hidden' opacity={expanded ? 1 : 0} transition='all 0.22s ease' mt={expanded ? '12px' : '0'} pt={expanded ? '10px' : '0'} borderTop={expanded ? `1px solid ${C.line}` : 'none'}>
          {card.byType && Object.entries(card.byType).map(([type, val]) => (
            <TypeBreakdownRow key={type} label={type} value={val} total={card.value} accent={card.accent} />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

const StatusBar = ({ summaryCards }) => {
  const { t } = useTranslation();
  const total = summaryCards.find((c) => c.id === 'total_devices')?.value ?? 0;
  const inUse = summaryCards.find((c) => c.id === 'devices_in_use')?.value ?? 0;
  const notInUse = summaryCards.find((c) => c.id === 'devices_not_in_use')?.value ?? 0;
  const faulty = summaryCards.find((c) => c.id === 'faulty_devices')?.value ?? 0;

  const segments = [
    { label: t('devicesInUse'), val: inUse, pct: total > 0 ? Math.round((inUse / total) * 100) : 0, color: C.green },
    { label: t('devicesNotInUse'), val: notInUse, pct: total > 0 ? Math.round((notInUse / total) * 100) : 0, color: C.amber },
    { label: t('faultyDevices'), val: faulty, pct: total > 0 ? Math.round((faulty / total) * 100) : 0, color: C.red }
  ];

  return (
    <Box bg={C.card} border={`1.5px solid ${C.border}`} borderRadius='16px' p='20px 24px' boxShadow={C.shadow}>
      <HStack justify='space-between' align='center' mb='14px'>
        <Text fontSize='15px' fontWeight='700' color={C.ink}>{t('deviceStatusOverview')}</Text>
        <Text fontSize='13px' color={C.inkSoft} fontWeight='600'>
          {t('totalDevices')}: <Text as='span' color={C.primary} fontWeight='800'>{total.toLocaleString()}</Text>
        </Text>
      </HStack>
      <Box h='10px' borderRadius='100px' overflow='hidden' display='flex' mb='14px'>
        {segments.map((s) => <Box key={s.label} h='100%' w={`${s.pct}%`} bg={s.color} />)}
      </Box>
      <HStack gap='20px' flexWrap='wrap'>
        {segments.map((s) => (
          <HStack key={s.label} gap='7px' align='center'>
            <Box w='10px' h='10px' borderRadius='50%' bg={s.color} flexShrink={0} />
            <Text fontSize='13px' color={C.inkSoft} fontWeight='500'>{s.label}</Text>
            <Text fontSize='13px' fontWeight='800' color={C.inkMid}>{s.val.toLocaleString()}</Text>
            <Text fontSize='12px' color={C.inkSoft}>({s.pct}%)</Text>
          </HStack>
        ))}
      </HStack>
    </Box>
  );
};

const QuickStatChip = ({ label, value, accent, accentBg }) => (
  <Box bg={accentBg} border={`1.5px solid ${accent}22`} borderRadius='12px' p='12px 16px' flex='1' minW='120px'>
    <Text fontSize='11px' fontWeight='700' letterSpacing='0.4px' textTransform='uppercase' color={accent} mb='4px'>{label}</Text>
    <Text fontSize='22px' fontWeight='800' color={accent} letterSpacing='-0.5px'>
      {typeof value === 'number' ? value.toLocaleString() : value}
    </Text>
  </Box>
);

const TableHead = ({ children, color = 'rgba(255,255,255,0.9)' }) => (
  <Box as='th' p='10px 14px' textAlign='left' fontSize='11.5px' fontWeight='800' letterSpacing='0.5px' textTransform='uppercase' color={color} whiteSpace='nowrap'>
    {children}
  </Box>
);

const TableCell = ({ children, color = C.ink, ...rest }) => (
  <Box as='td' p='11px 14px' {...rest}>
    <Text fontSize='14px' fontWeight='600' color={color}>{children}</Text>
  </Box>
);

const DistrictTable = ({ districtBreakdown }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <Box bg={C.card} border={`1.5px solid ${C.border}`} borderRadius='16px' overflow='hidden' boxShadow={C.shadow}>
      <Box overflowX='auto'>
        <Box as='table' w='full' style={{ borderCollapse: 'collapse' }}>
          <Box as='thead'>
            <Box as='tr' bg={C.primary}>
              {[t('district'), t('totalDevices'), t('devicesInUse'), t('faultyDevices'), t('devicesInTransit'), t('requestsPending')].map((h) => (
                <TableHead key={h}>{h}</TableHead>
              ))}
            </Box>
          </Box>
          <Box as='tbody'>
            {districtBreakdown.map((row, i) => {
              const isFaultyHigh = row.faulty > 10;
              return (
                <Box
                  as='tr'
                  key={row.district}
                  bg={i % 2 === 0 ? C.card : '#F9FAFB'}
                  style={{ borderBottom: `1px solid ${C.line}` }}
                  _hover={{ bg: C.primaryBg }}
                  cursor='pointer'
                  onClick={() => navigate({ to: '/app/inventory/device-list', search: { district: row.district } })}
                >
                  <TableCell color={C.primary} fontWeight='700'>{row.district}</TableCell>
                  <TableCell color='#8D0247' fontWeight='800'>{row.total.toLocaleString()}</TableCell>
                  <TableCell color={C.green}>{row.inUse.toLocaleString()}</TableCell>
                  <TableCell color={isFaultyHigh ? C.red : C.inkMid}>{row.faulty.toLocaleString()}</TableCell>
                  <TableCell color='#5E36EF'>{row.inTransit.toLocaleString()}</TableCell>
                  <TableCell color={C.amber}>{row.requestsPending.toLocaleString()}</TableCell>
                </Box>
              );
            })}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

const WarrantyAlerts = ({ warrantyAlerts }) => {
  const { t } = useTranslation();
  const { expiringSoon = [], expired = [], safeCount = 0 } = warrantyAlerts;

  const chips = [
    { label: t('expiringSoon'), count: expiringSoon.length, color: C.amber, bg: C.amberBg },
    { label: t('expired'), count: expired.length, color: C.red, bg: C.redBg },
    { label: t('underWarranty'), count: safeCount, color: C.green, bg: C.greenBg }
  ];

  const atRiskDevices = [...expiringSoon, ...expired].sort((a, b) => new Date(a.warrantyEndDate) - new Date(b.warrantyEndDate));

  return (
    <Box bg={C.card} border={`1.5px solid ${C.border}`} borderRadius='16px' p='20px 24px' boxShadow={C.shadow}>
      <HStack gap='12px' mb='16px' flexWrap='wrap'>
        {chips.map((chip) => (
          <Box key={chip.label} bg={chip.bg} border={`1.5px solid ${chip.color}33`} borderRadius='10px' px='16px' py='10px' display='flex' alignItems='center' gap='10px'>
            <Text fontSize='22px' fontWeight='800' color={chip.color}>{chip.count.toLocaleString()}</Text>
            <Text fontSize='12px' fontWeight='700' color={chip.color} textTransform='uppercase' letterSpacing='0.4px'>{chip.label}</Text>
          </Box>
        ))}
      </HStack>
      {atRiskDevices.length > 0 && (
        <Box overflowX='auto'>
          <Box as='table' w='full' style={{ borderCollapse: 'collapse' }}>
            <Box as='thead'>
              <Box as='tr' bg='#F3F4F6'>
                {[t('serialNo'), t('deviceType'), t('deviceModel'), t('warrantyEndDate'), t('location')].map((h) => (
                  <Box key={h} as='th' p='9px 14px' textAlign='left' fontSize='11.5px' fontWeight='800' letterSpacing='0.5px' textTransform='uppercase' color={C.inkSoft} whiteSpace='nowrap'>{h}</Box>
                ))}
              </Box>
            </Box>
            <Box as='tbody'>
              {atRiskDevices.map((dev, i) => {
                const isExpired = expired.some((e) => e.serialNo === dev.serialNo);
                return (
                  <Box as='tr' key={dev.serialNo} bg={i % 2 === 0 ? C.card : '#F9FAFB'} style={{ borderBottom: `1px solid ${C.line}` }}>
                    <TableCell color={C.inkMid} fontWeight='700'>{dev.serialNo}</TableCell>
                    <TableCell>{dev.type}</TableCell>
                    <TableCell>{dev.model}</TableCell>
                    <TableCell color={isExpired ? C.red : C.amber}>{dev.warrantyEndDate}</TableCell>
                    <TableCell>{dev.location}</TableCell>
                  </Box>
                );
              })}
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};

const RequestPipeline = ({ requestPipeline }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const stages = [
    { key: 'raised',          label: t('raised'),          value: requestPipeline.raised,         color: '#5E36EF', bg: '#F3EFFF', status: 'RAISED' },
    { key: 'pendingApproval', label: t('pendingApproval'), value: requestPipeline.pendingApproval, color: C.amber,   bg: C.amberBg, status: 'PENDING' },
    { key: 'approved',        label: t('approved'),        value: requestPipeline.approved,        color: C.green,   bg: C.greenBg, status: 'APPROVED' },
    { key: 'rejected',        label: t('rejected'),        value: requestPipeline.rejected,        color: C.red,     bg: C.redBg,   status: 'REJECTED' }
  ];

  return (
    <Box bg={C.card} border={`1.5px solid ${C.border}`} borderRadius='16px' p='20px 24px' boxShadow={C.shadow}>
      <HStack gap='0' align='stretch'>
        {stages.map((stage, i) => (
          <Box key={stage.key} flex='1' position='relative'>
            <Box
              bg={stage.bg}
              border={`1.5px solid ${stage.color}33`}
              borderRadius={i === 0 ? '10px 0 0 10px' : i === stages.length - 1 ? '0 10px 10px 0' : '0'}
              borderLeft={i > 0 ? 'none' : undefined}
              p='16px 20px'
              cursor='pointer'
              transition='all 0.18s'
              _hover={{ transform: 'translateY(-2px)', boxShadow: C.shadowHover }}
              onClick={() => navigate({ to: '/app/inventory/device-list', search: { requestStatus: stage.status } })}
            >
              <Text fontSize='11px' fontWeight='800' letterSpacing='0.5px' textTransform='uppercase' color={stage.color} mb='6px'>{stage.label}</Text>
              <Text fontSize='28px' fontWeight='800' color={stage.color} letterSpacing='-0.5px'>{stage.value.toLocaleString()}</Text>
            </Box>
            {i < stages.length - 1 && (
              <Box position='absolute' right='-10px' top='50%' transform='translateY(-50%)' zIndex={1} fontSize='16px' color={C.inkSoft}>→</Box>
            )}
          </Box>
        ))}
      </HStack>
    </Box>
  );
};

const RecentActivity = ({ recentActivity }) => {
  const { t } = useTranslation();

  if (!recentActivity.length) {
    return (
      <Box bg={C.card} border={`1.5px solid ${C.border}`} borderRadius='16px' p='20px 24px' boxShadow={C.shadow}>
        <Text color={C.inkSoft} fontSize='14px'>{t('noActivity')}</Text>
      </Box>
    );
  }

  return (
    <Box bg={C.card} border={`1.5px solid ${C.border}`} borderRadius='16px' overflow='hidden' boxShadow={C.shadow}>
      <VStack align='stretch' gap='0'>
        {recentActivity.map((item, i) => (
          <HStack
            key={item.id}
            p='12px 20px'
            gap='14px'
            align='center'
            bg={i % 2 === 0 ? C.card : '#F9FAFB'}
            style={{ borderBottom: i < recentActivity.length - 1 ? `1px solid ${C.line}` : 'none' }}
          >
            <Box w='36px' h='36px' borderRadius='10px' bg={C.primaryBg} display='flex' alignItems='center' justifyContent='center' fontSize='18px' flexShrink={0}>
              {ACTIVITY_ICONS[item.action] ?? '📋'}
            </Box>
            <Box flex='1' minW='0'>
              <HStack gap='8px' flexWrap='wrap'>
                <Text fontSize='13.5px' fontWeight='700' color={C.ink}>{item.action}</Text>
                <Text fontSize='13px' color={C.primary} fontWeight='600'>{item.deviceSerial}</Text>
              </HStack>
              <Text fontSize='12px' color={C.inkSoft} mt='2px'>{item.actor}</Text>
            </Box>
            <Text fontSize='12px' color={C.inkSoft} flexShrink={0}>
              {new Date(item.timestamp).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
            </Text>
          </HStack>
        ))}
      </VStack>
    </Box>
  );
};

const InventoryDashboard = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const summaryCards = useSelector(getInventorySummaryCards);
  const districtBreakdown = useSelector(getInventoryDistrictBreakdown);
  const warrantyAlerts = useSelector(getInventoryWarrantyAlerts);
  const requestPipeline = useSelector(getInventoryRequestPipeline);
  const recentActivity = useSelector(getInventoryRecentActivity);

  const { hasPermission } = usePageActions();
  const scope = hasPermission(INVENTORY_DASHBOARD_ACTIONS.DISTRICT_ACCESS)
    ? INVENTORY_DASHBOARD_SCOPES.DISTRICT_LEVEL
    : hasPermission(INVENTORY_DASHBOARD_ACTIONS.INDIVIDUAL_ACCESS)
      ? INVENTORY_DASHBOARD_SCOPES.OWNED
      : INVENTORY_DASHBOARD_SCOPES.STATE_LEVEL;

  const isStateLevel = scope === INVENTORY_DASHBOARD_SCOPES.STATE_LEVEL;
  const isOwned = scope === INVENTORY_DASHBOARD_SCOPES.OWNED;

  useEffect(() => {
    dispatch(fetchInventorySummaryCards());
    dispatch(fetchInventoryStockTypeCount());
    dispatch(fetchInventoryDeviceList());
    dispatch(fetchInventoryWarrantyAlerts({ scope }));
    dispatch(fetchInventoryRecentActivity({ scope }));
    if (!isOwned) dispatch(fetchInventoryRequestPipeline({ scope }));
    if (isStateLevel) dispatch(fetchInventoryDistrictBreakdown({ scope }));
  }, [dispatch, scope, isStateLevel, isOwned]);

  const getCard = (id) => summaryCards.find((c) => c.id === id);
  const alertCards = summaryCards.filter((c) => c.alert);

  return (
    <Box bg={C.bg} p='24px' minH='100vh'>
      <Flex justify='space-between' align='center' mb='24px'>
        <Box>
          <Text fontSize='28px' fontWeight='800' color={C.ink} letterSpacing='-0.5px' lineHeight='1.1'>
            {t('inventoryDashboard')}
          </Text>
          <Text fontSize='14px' color={C.inkSoft} mt='4px' fontWeight='500'>
            {t('inventoryDashboardSubtitle')}
          </Text>
        </Box>
      </Flex>

      <VStack align='stretch' gap='24px'>

        <HStack gap='12px' flexWrap='wrap'>
          <QuickStatChip label={t('totalDevices')} value={getCard('total_devices')?.value ?? 0} accent='#8D0247' accentBg='#FFEDF6' />
          <QuickStatChip label={t('devicesInUse')} value={getCard('devices_in_use')?.value ?? 0} accent={C.green} accentBg={C.greenBg} />
          <QuickStatChip label={t('devicesNotInUse')} value={getCard('devices_not_in_use')?.value ?? 0} accent={C.amber} accentBg={C.amberBg} />
          <QuickStatChip label={t('faultyDevices')} value={getCard('faulty_devices')?.value ?? 0} accent={C.red} accentBg={C.redBg} />
          <QuickStatChip label={t('devicesInTransit')} value={getCard('devices_in_transit')?.value ?? 0} accent='#5E36EF' accentBg='#F3EFFF' />
        </HStack>

        <StatusBar summaryCards={summaryCards} />

        <Box>
          <SectionHeader title={t('attentionRequired')} />
          <Box display='grid' gridTemplateColumns='repeat(2, 1fr)' gap='14px'>
            {alertCards.map((card) => <MetricCard key={card.id} card={card} />)}
          </Box>
        </Box>

        <Box>
          <SectionHeader title={t('deviceMetrics')} />
          <Box display='grid' gridTemplateColumns='repeat(3, 1fr)' gap='14px'>
            {summaryCards.filter((c) => !c.alert).map((card) => <MetricCard key={card.id} card={card} />)}
          </Box>
        </Box>

        {!isOwned && (
          <Box>
            <SectionHeader title={t('deviceTypeBreakdown')} />
            <Box bg={C.card} border={`1.5px solid ${C.border}`} borderRadius='16px' overflow='hidden' boxShadow={C.shadow}>
              <Box overflowX='auto'>
                <Box as='table' w='full' style={{ borderCollapse: 'collapse' }}>
                  <Box as='thead'>
                    <Box as='tr' bg={C.primary}>
                      {[t('deviceType'), t('totalDevices'), t('devicesInUse'), t('devicesNotInUse'), t('faultyDevices'), t('devicesInTransit'), t('sentToOem'), t('refurbishedDevices')].map((h) => (
                        <TableHead key={h}>{h}</TableHead>
                      ))}
                    </Box>
                  </Box>
                  <Box as='tbody'>
                    {DEVICE_TYPES.map((type, i) => {
                      const get = (id) => getCard(id)?.byType?.[type] ?? 0;
                      return (
                        <Box as='tr' key={type} bg={i % 2 === 0 ? C.card : '#F9FAFB'} style={{ borderBottom: `1px solid ${C.line}` }} _hover={{ bg: '#FFEDF6' }}>
                          <TableCell color={C.ink} fontWeight='700'>{type}</TableCell>
                          <TableCell color='#8D0247' fontWeight='800'>{get('total_devices').toLocaleString()}</TableCell>
                          <TableCell color={C.green}>{get('devices_in_use').toLocaleString()}</TableCell>
                          <TableCell color={C.amber}>{get('devices_not_in_use').toLocaleString()}</TableCell>
                          <TableCell color={C.red}>{get('faulty_devices').toLocaleString()}</TableCell>
                          <TableCell color='#5E36EF'>{get('devices_in_transit').toLocaleString()}</TableCell>
                          <TableCell color='#02748D'>{get('sent_to_oem').toLocaleString()}</TableCell>
                          <TableCell color='#F5612A'>{get('refurbished_devices').toLocaleString()}</TableCell>
                        </Box>
                      );
                    })}
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        )}

        {isStateLevel && (
          <Box>
            <SectionHeader title={t('districtBreakdown')} />
            <DistrictTable districtBreakdown={districtBreakdown} />
          </Box>
        )}

        <Box>
          <SectionHeader title={t('warrantyAlerts')} />
          <WarrantyAlerts warrantyAlerts={warrantyAlerts} />
        </Box>

        {!isOwned && (
          <Box>
            <SectionHeader title={t('stockRequestPipeline')} />
            <RequestPipeline requestPipeline={requestPipeline} />
          </Box>
        )}

        <Box>
          <SectionHeader title={t('recentActivity')} />
          <RecentActivity recentActivity={recentActivity} />
        </Box>

      </VStack>
    </Box>
  );
};

export default InventoryDashboard;
