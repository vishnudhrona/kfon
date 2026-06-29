import { Box, Button, Flex, Text } from '@kfonbss/bss-ui-components';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getRequest } from '@/app/axios';
import { STORAGE_KEYS } from '@/constants';
import { SERVER_SIDE_TABLE_KEYS } from '@/constants/server_table';
import { API_URL } from '@/constants/urls';
import { getServerSidePaginationResponse } from '@/features/others/Pagination/selectors';
import { getDataFromStorage } from '@/utils/encryptionUtils';
import { downloadFileFromBlobResponse } from '@/utils/fileUtils';

import { fetchPartnerAccountDisbursement } from '../action';
import { getPartnerAccountDisbursement, getPartnerDisbursementMeta } from '../selector';

/* ── Design tokens ── */
const C = {
  primary: '#6b1a3d',
  dark: '#5a1433',
  mid2: '#7a2147',
  border: '#f0e4ea',
  bg: '#fbf7f5',
  text: '#2b1a26',
  mid: '#6f5e6a',
  muted: '#a898a0'
};

const TABLE_KEY = SERVER_SIDE_TABLE_KEYS.PARTNER_ACCOUNT_DISBURSEMENT_TABLE;
const PAGE_SIZE = 10;

const COMPACT_COL = '105px 100px minmax(0,1.4fr) 90px 100px 120px 100px';
const EXPANDED_COL =
  '105px 100px 65px 90px 80px 90px 65px 90px 110px 120px 100px minmax(190px,1fr) 140px minmax(160px,1fr) 110px 90px 140px';
const EXPANDED_MINW = '1900px';

const fmt = (v) => Number(v || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/* convert input[type=month] "YYYY-MM" → "Apr-2026" for API */
const toApiMonth = (v) => {
  if (!v) return '';
  const [y, m] = v.split('-');
  const names = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${names[parseInt(m, 10) - 1]}-${y}`;
};

/* ── Sub-components ── */

const Wave = ({ fill, path }) => (
  <Box position='absolute' bottom='0' left='0' right='0' h='32px' opacity='0.5' pointerEvents='none'>
    <svg viewBox='0 0 100 30' preserveAspectRatio='none' style={{ width: '100%', height: '100%' }}>
      <path d={path} fill={fill} />
    </svg>
  </Box>
);

const StatCard = ({
  icBg,
  badgeBg,
  badgeColor,
  badgeLabel,
  label,
  value,
  rp,
  valColor,
  sub,
  waveFill,
  wavePath,
  icon
}) => (
  <Box
    bg='white'
    border='1px solid'
    borderColor={C.border}
    borderRadius='12px'
    p='14px 18px 12px'
    position='relative'
    overflow='hidden'
    minH='130px'
    display='flex'
    flexDirection='column'
    gap='8px'
    transition='transform 0.2s, box-shadow 0.2s'
    _hover={{ transform: 'translateY(-2px)', boxShadow: '0 6px 18px rgba(107,26,61,.08)' }}
  >
    <Flex justify='space-between' align='center'>
      <Box
        w='36px'
        h='36px'
        borderRadius='9px'
        bg={icBg}
        display='flex'
        alignItems='center'
        justifyContent='center'
        color='white'
        boxShadow='0 3px 8px rgba(0,0,0,.1)'
      >
        {icon}
      </Box>
      <Box
        bg={badgeBg}
        color={badgeColor}
        fontSize='10px'
        fontWeight='800'
        letterSpacing='0.5px'
        textTransform='uppercase'
        px='8px'
        py='3px'
        borderRadius='100px'
      >
        {badgeLabel}
      </Box>
    </Flex>
    <Text fontSize='11px' fontWeight='800' letterSpacing='0.8px' textTransform='uppercase' color={C.muted}>
      {label}
    </Text>
    <Text fontSize='26px' letterSpacing='-0.6px' lineHeight='1' color={valColor || C.text}>
      {rp && (
        <Text as='span' fontSize='16px' color={C.mid2} mr='2px' opacity='0.7'>
          {rp}
        </Text>
      )}
      {value}
    </Text>
    <Text fontSize='13px' color={C.mid} fontWeight='500'>
      {sub}
    </Text>
    <Wave fill={waveFill} path={wavePath} />
  </Box>
);

const Na = () => (
  <Text fontSize='12px' color='#c8b8c0' fontStyle='italic'>
    —
  </Text>
);

/* ── Main component ── */

const PartnerAccountDisbursement = () => {
  const dispatch = useDispatch();
  const { data: records = [] } = useSelector(getPartnerAccountDisbursement) || {};
  const meta = useSelector(getPartnerDisbursementMeta) || {};
  const paginationResp = useSelector(getServerSidePaginationResponse);

  const [search, setSearch] = useState('');
  const [month, setMonth] = useState('');
  const [page, setPage] = useState(0);
  const [viewMode, setViewMode] = useState('compact');
  const [isDownloading, setIsDownloading] = useState(false);

  const totalElements = paginationResp?.[TABLE_KEY]?.totalElements ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalElements / PAGE_SIZE));

  useEffect(() => {
    dispatch(
      fetchPartnerAccountDisbursement({
        page,
        size: PAGE_SIZE,
        ...(search && { search }),
        ...(month && { month: toApiMonth(month) })
      })
    );
  }, [dispatch, page, search, month]);

  const pageNums = (() => {
    const nums = Array.from({ length: totalPages }, (_, i) => i);
    if (totalPages <= 7) return nums;
    if (page < 4) return [...nums.slice(0, 5), '…', totalPages - 1];
    if (page > totalPages - 5) return [0, '…', ...nums.slice(totalPages - 5)];
    return [0, '…', page - 1, page, page + 1, '…', totalPages - 1];
  })();

  const handleDownloadCsv = async () => {
    setIsDownloading(true);
    try {
      const token = getDataFromStorage(STORAGE_KEYS.AUTH_TOKEN, false);
      const baseURL = import.meta.env.VITE_API_BASE_URL;
      const params = {};
      if (month) params.month = toApiMonth(month);
      if (search) params.search = search;

      const response = await getRequest(API_URL.FINANCE.PARTNER_ACCOUNTS.EXPORT_DISBURSEMENT_CSV, {
        baseURL,
        config: {
          headers: { Authorization: `Bearer ${token}` },
          params,
          responseType: 'blob'
        }
      });
      if (response?.data) {
        downloadFileFromBlobResponse(response.data, 'partner-disbursement.csv');
      }
    } catch (e) {
      console.error('CSV download failed', e);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Box p='22px 26px 32px'>
      {/* ── Page Header ── */}
      <Flex justify='space-between' align='flex-end' mb='20px' flexWrap='wrap' gap='14px'>
        <Box>
          <Text fontSize='28px' color={C.dark} fontWeight='400' letterSpacing='-0.4px' mb='4px'>
            Partner Revenue Disbursement
            {meta.month && (
              <>
                {' '}
                ·{' '}
                <Text as='strong' fontWeight='700' color={C.primary}>
                  {meta.month}
                </Text>
              </>
            )}
          </Text>
          <Flex gap='20px' flexWrap='wrap'>
            <Text fontSize='14px' color={C.mid}>
              Total Disbursed Revenue —{' '}
              <Text as='strong' color='#1b6b3a' fontWeight='700'>
                ₹{fmt(meta.totalDisbursedRevenue)}
              </Text>
            </Text>
            <Text fontSize='14px' color={C.mid}>
              Revenue Generated (As per Bill) —{' '}
              <Text as='strong' color={meta.revenueGeneratedAsBill < 0 ? '#e94e77' : '#1b6b3a'} fontWeight='700'>
                {meta.revenueGeneratedAsBill < 0 ? '−' : ''}₹{fmt(meta.revenueGeneratedAsBill)}
              </Text>
            </Text>
          </Flex>
        </Box>
        <Button variant='outline' borderRadius='md' height='40px' isLoading={isDownloading} onClick={handleDownloadCsv}>
          Download CSV
        </Button>
      </Flex>

      {/* ── Stat Cards ── */}
      <Box display='grid' gridTemplateColumns='repeat(4, 1fr)' gap='12px' mb='20px'>
        <StatCard
          icBg='#5bbf95'
          badgeBg='#d9f0e5'
          badgeColor='#1b6b3a'
          badgeLabel='Disbursed'
          label='Total Disbursed Revenue'
          rp='₹'
          value={fmt(meta.totalDisbursedRevenue)}
          valColor='#1b6b3a'
          sub={meta.month || 'Current month'}
          waveFill='#d9f0e5'
          wavePath='M0,22 Q15,8 30,16 T60,10 T100,6 L100,30 L0,30 Z'
          icon={
            <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='white' strokeWidth='2'>
              <path d='M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6' />
            </svg>
          }
        />
        <StatCard
          icBg='#2fb8c6'
          badgeBg='#dde8f2'
          badgeColor='#2c6a96'
          badgeLabel='As per Bill'
          label='Revenue Generated'
          rp='₹'
          value={fmt(meta.revenueGeneratedAsBill)}
          sub='Revenue generated as per bill'
          waveFill='#d6f2f4'
          wavePath='M0,20 Q20,12 40,16 T80,8 T100,6 L100,30 L0,30 Z'
          icon={
            <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='white' strokeWidth='2'>
              <rect x='2' y='3' width='20' height='14' rx='2' />
              <path d='M8 21h8M12 17v4' />
            </svg>
          }
        />
        <StatCard
          icBg='#8b7fd6'
          badgeBg='#e5e0fa'
          badgeColor='#4a3d8e'
          badgeLabel='Total'
          label='Total Records'
          value={totalElements.toLocaleString('en-IN')}
          sub='All disbursement transactions'
          waveFill='#e5e0fa'
          wavePath='M0,24 Q20,10 40,14 T80,12 T100,8 L100,30 L0,30 Z'
          icon={
            <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='white' strokeWidth='2'>
              <path d='M9 11l3 3L22 4' />
              <path d='M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11' />
            </svg>
          }
        />
        <StatCard
          icBg='#f5b93b'
          badgeBg='#fff0cf'
          badgeColor='#9a7800'
          badgeLabel='Page'
          label='Records on Page'
          value={records.length}
          sub={`Page ${page + 1} of ${totalPages}`}
          waveFill='#fff0cf'
          wavePath='M0,22 Q25,14 50,18 T100,12 L100,30 L0,30 Z'
          icon={
            <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='white' strokeWidth='2'>
              <polyline points='22 7 13.5 15.5 8.5 10.5 2 17' />
              <polyline points='16 7 22 7 22 13' />
            </svg>
          }
        />
      </Box>

      {/* ── Section Label ── */}
      <Flex
        align='center'
        gap='10px'
        mb='14px'
        fontSize='12px'
        fontWeight='800'
        letterSpacing='1.2px'
        textTransform='uppercase'
        color={C.muted}
        flexWrap='wrap'
      >
        <Text>Disbursement Records</Text>
        <Box flex='1' h='1px' bg={C.border} minW='20px' />
        <Text fontSize='12px' fontWeight='600' textTransform='none' letterSpacing='0.3px'>
          Showing{' '}
          <Text as='strong' color={C.primary} fontWeight='700'>
            {records.length}
          </Text>{' '}
          of {totalElements} entries
        </Text>
      </Flex>

      {/* ── Filter Bar ── */}
      <Flex
        bg='white'
        border='1px solid'
        borderColor={C.border}
        borderRadius='12px'
        p='10px 14px'
        mb='14px'
        align='center'
        gap='10px'
        flexWrap='wrap'
      >
        {/* Search */}
        <Flex
          flex='1'
          minW='220px'
          maxW='360px'
          align='center'
          gap='6px'
          bg={C.bg}
          border='1px solid'
          borderColor={C.border}
          borderRadius='8px'
          px='12px'
          h='36px'
        >
          <svg width='13' height='13' viewBox='0 0 24 24' fill='none' stroke={C.mid} strokeWidth='2'>
            <circle cx='11' cy='11' r='8' />
            <path d='M21 21l-4.3-4.3' />
          </svg>
          <input
            placeholder='Search by subscriber, partner, cause…'
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              background: 'transparent',
              fontSize: '13px',
              color: C.text
            }}
          />
          {search && (
            <Box
              as='button'
              border='none'
              bg='transparent'
              cursor='pointer'
              color={C.muted}
              lineHeight='1'
              style={{ fontSize: '16px', padding: 0 }}
              onClick={() => {
                setSearch('');
                setPage(0);
              }}
            >
              ×
            </Box>
          )}
        </Flex>

        {/* Month */}
        <Flex
          align='center'
          gap='6px'
          bg={C.bg}
          border='1px solid'
          borderColor={month ? C.primary : C.border}
          borderRadius='8px'
          px='12px'
          h='36px'
        >
          <svg
            width='11'
            height='11'
            viewBox='0 0 24 24'
            fill='none'
            stroke={month ? C.primary : C.mid}
            strokeWidth='2'
          >
            <rect x='3' y='4' width='18' height='18' rx='2' />
            <line x1='16' y1='2' x2='16' y2='6' />
            <line x1='8' y1='2' x2='8' y2='6' />
            <line x1='3' y1='10' x2='21' y2='10' />
          </svg>
          <input
            type='month'
            value={month}
            onChange={(e) => {
              setMonth(e.target.value);
              setPage(0);
            }}
            style={{
              border: 'none',
              outline: 'none',
              background: 'transparent',
              fontSize: '13px',
              color: month ? C.primary : C.mid,
              cursor: 'pointer'
            }}
          />
        </Flex>

        <Box flex='1' />

        {/* View Toggle */}
        <Flex align='center' gap='3px' bg={C.bg} border='1px solid' borderColor={C.border} borderRadius='8px' p='3px'>
          {['compact', 'expanded'].map((mode) => {
            const on = viewMode === mode;
            return (
              <Box
                key={mode}
                as='button'
                bg={on ? 'white' : 'transparent'}
                border='none'
                px='12px'
                py='5px'
                borderRadius='5px'
                fontSize='12px'
                fontWeight='600'
                color={on ? C.primary : C.mid}
                boxShadow={on ? '0 1px 3px rgba(74,15,42,.08)' : 'none'}
                cursor='pointer'
                display='inline-flex'
                alignItems='center'
                gap='5px'
                onClick={() => setViewMode(mode)}
              >
                {mode === 'compact' ? (
                  <svg width='11' height='11' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
                    <line x1='8' y1='6' x2='21' y2='6' />
                    <line x1='8' y1='12' x2='21' y2='12' />
                    <line x1='8' y1='18' x2='21' y2='18' />
                    <line x1='3' y1='6' x2='3.01' y2='6' />
                    <line x1='3' y1='12' x2='3.01' y2='12' />
                    <line x1='3' y1='18' x2='3.01' y2='18' />
                  </svg>
                ) : (
                  <svg width='11' height='11' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
                    <rect x='3' y='3' width='18' height='18' rx='2' />
                    <path d='M3 9h18M3 15h18M9 3v18M15 3v18' />
                  </svg>
                )}
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </Box>
            );
          })}
        </Flex>
      </Flex>

      {/* ── Compact Table ── */}
      {viewMode === 'compact' && (
        <>
          <Box
            display='grid'
            gridTemplateColumns={COMPACT_COL}
            gap='10px'
            alignItems='center'
            px='18px'
            mb='8px'
            fontSize='12px'
            fontWeight='800'
            letterSpacing='0.8px'
            textTransform='uppercase'
            color={C.muted}
          >
            <Text>Date</Text>
            <Text>Category</Text>
            <Text>Subscriber</Text>
            <Text textAlign='right'>Amount</Text>
            <Text textAlign='right'>Total GST</Text>
            <Text textAlign='right'>Total Amount</Text>
            <Text>Status</Text>
          </Box>
          <Flex direction='column' gap='8px'>
            {records.length === 0 ? (
              <Box
                bg='white'
                border='1px solid'
                borderColor={C.border}
                borderRadius='10px'
                px='18px'
                py='24px'
                textAlign='center'
              >
                <Text fontSize='13px' color={C.muted}>
                  No disbursement records found.
                </Text>
              </Box>
            ) : (
              records.map((r, i) => (
                <Box
                  key={i}
                  display='grid'
                  gridTemplateColumns={COMPACT_COL}
                  gap='10px'
                  alignItems='center'
                  bg='white'
                  border='1px solid'
                  borderColor={C.border}
                  borderRadius='10px'
                  px='18px'
                  py='13px'
                  transition='transform 0.15s, border-color 0.15s, box-shadow 0.15s'
                  _hover={{
                    borderColor: C.primary,
                    boxShadow: '0 4px 14px -6px rgba(107,26,61,.15)',
                    transform: 'translateY(-1px)'
                  }}
                >
                  <Text fontSize='13px' color={C.text} fontWeight='600'>
                    {r.date || <Na />}
                  </Text>
                  <Box>
                    {r.subscriberCategory ? (
                      <Box
                        display='inline-flex'
                        px='9px'
                        py='3px'
                        borderRadius='5px'
                        bg='#e5e0fa'
                        color='#4a3d8e'
                        fontSize='12px'
                        fontWeight='700'
                      >
                        {r.subscriberCategory}
                      </Box>
                    ) : (
                      <Na />
                    )}
                  </Box>
                  <Text fontSize='13px' fontWeight='600' color={C.text}>
                    {r.subscriber || <Na />}
                  </Text>
                  <Text textAlign='right' fontSize='13px' color={C.text} letterSpacing='-0.2px'>
                    {fmt(r.amount)}
                  </Text>
                  <Text textAlign='right' fontSize='13px' color='#5b8cb8' letterSpacing='-0.1px'>
                    {fmt(r.totalGst)}
                  </Text>
                  <Text textAlign='right' fontSize='14px' fontWeight='700' color='#1b6b3a' letterSpacing='-0.3px'>
                    {fmt(r.totalAmount)}
                  </Text>
                  <Box>
                    <Box
                      display='inline-flex'
                      px='10px'
                      py='3px'
                      borderRadius='5px'
                      fontSize='12px'
                      fontWeight='800'
                      letterSpacing='0.4px'
                      bg={r.status === 'Disbursed' ? '#d9f0e5' : r.status === 'Pending' ? '#fff0cf' : '#f0f0f5'}
                      color={r.status === 'Disbursed' ? '#1b6b3a' : r.status === 'Pending' ? '#9a7800' : C.mid}
                    >
                      {r.status || 'Unknown'}
                    </Box>
                  </Box>
                </Box>
              ))
            )}
          </Flex>
        </>
      )}

      {/* ── Expanded Table ── */}
      {viewMode === 'expanded' && (
        <Box overflowX='auto' pb='4px'>
          <Box
            display='grid'
            gridTemplateColumns={EXPANDED_COL}
            gap='10px'
            alignItems='center'
            px='18px'
            mb='8px'
            minW={EXPANDED_MINW}
            fontSize='12px'
            fontWeight='800'
            letterSpacing='0.8px'
            textTransform='uppercase'
            color={C.muted}
          >
            <Text>Date</Text>
            <Text>Category</Text>
            <Text>Group</Text>
            <Text textAlign='right'>Amount</Text>
            <Text textAlign='right'>CGST</Text>
            <Text textAlign='right'>SGST/UGST</Text>
            <Text textAlign='right'>IGST</Text>
            <Text textAlign='right'>Total GST</Text>
            <Text>Taxpayer Type</Text>
            <Text textAlign='right'>Total Amount</Text>
            <Text>Status</Text>
            <Text>Cause</Text>
            <Text>Subscriber</Text>
            <Text>Partner</Text>
            <Text>Partner Id</Text>
            <Text>Subscriber Id</Text>
            <Text>GSTIN</Text>
          </Box>
          <Flex direction='column' gap='8px'>
            {records.length === 0 ? (
              <Box
                bg='white'
                border='1px solid'
                borderColor={C.border}
                borderRadius='10px'
                px='18px'
                py='24px'
                textAlign='center'
                minW={EXPANDED_MINW}
              >
                <Text fontSize='13px' color={C.muted}>
                  No disbursement records found.
                </Text>
              </Box>
            ) : (
              records.map((r, i) => (
                <Box
                  key={i}
                  display='grid'
                  gridTemplateColumns={EXPANDED_COL}
                  gap='10px'
                  alignItems='center'
                  bg='white'
                  border='1px solid'
                  borderColor={C.border}
                  borderRadius='10px'
                  px='18px'
                  py='13px'
                  minW={EXPANDED_MINW}
                  transition='transform 0.15s, border-color 0.15s, box-shadow 0.15s'
                  _hover={{
                    borderColor: C.primary,
                    boxShadow: '0 4px 14px -6px rgba(107,26,61,.15)',
                    transform: 'translateY(-1px)'
                  }}
                >
                  <Text fontSize='13px' color={C.text} fontWeight='600'>
                    {r.date || <Na />}
                  </Text>
                  <Box>
                    {r.subscriberCategory ? (
                      <Box
                        display='inline-flex'
                        px='9px'
                        py='3px'
                        borderRadius='5px'
                        bg='#e5e0fa'
                        color='#4a3d8e'
                        fontSize='12px'
                        fontWeight='700'
                      >
                        {r.subscriberCategory}
                      </Box>
                    ) : (
                      <Na />
                    )}
                  </Box>
                  {r.group != null ? (
                    <Text fontSize='13px' color={C.text} fontWeight='700'>
                      {r.group}
                    </Text>
                  ) : (
                    <Na />
                  )}
                  <Text textAlign='right' fontSize='13px' color={C.text} letterSpacing='-0.2px'>
                    {fmt(r.amount)}
                  </Text>
                  <Text textAlign='right' fontSize='13px' color='#5b8cb8' letterSpacing='-0.1px'>
                    {fmt(r.cgst)}
                  </Text>
                  <Text textAlign='right' fontSize='13px' color='#5b8cb8' letterSpacing='-0.1px'>
                    {fmt(r.sgst)}
                  </Text>
                  <Text textAlign='right' fontSize='13px' color='#5b8cb8' letterSpacing='-0.1px'>
                    {fmt(r.igst)}
                  </Text>
                  <Text textAlign='right' fontSize='13px' color='#5b8cb8' letterSpacing='-0.1px'>
                    {fmt(r.totalGst)}
                  </Text>
                  {r.taxpayerType ? (
                    <Text fontSize='12px' color={C.text}>
                      {r.taxpayerType}
                    </Text>
                  ) : (
                    <Na />
                  )}
                  <Text textAlign='right' fontSize='14px' fontWeight='700' color='#1b6b3a' letterSpacing='-0.3px'>
                    {fmt(r.totalAmount)}
                  </Text>
                  <Box>
                    <Box
                      display='inline-flex'
                      px='10px'
                      py='3px'
                      borderRadius='5px'
                      fontSize='12px'
                      fontWeight='800'
                      letterSpacing='0.4px'
                      bg={r.status === 'Disbursed' ? '#d9f0e5' : r.status === 'Pending' ? '#fff0cf' : '#f0f0f5'}
                      color={r.status === 'Disbursed' ? '#1b6b3a' : r.status === 'Pending' ? '#9a7800' : C.mid}
                    >
                      {r.status || 'Unknown'}
                    </Box>
                  </Box>
                  <Text fontSize='13px' color={C.dark}>
                    {r.cause || <Na />}
                  </Text>
                  <Text fontSize='13px' color={C.text}>
                    {r.subscriber || <Na />}
                  </Text>
                  <Text fontSize='13px' fontWeight='600' color={C.text}>
                    {r.partner || <Na />}
                  </Text>
                  {r.partnerId ? (
                    <Text fontSize='12px' color={C.text}>
                      {r.partnerId}
                    </Text>
                  ) : (
                    <Na />
                  )}
                  {r.subscriberId ? (
                    <Text fontSize='12px' color={C.text}>
                      {r.subscriberId}
                    </Text>
                  ) : (
                    <Na />
                  )}
                  {r.gstin ? (
                    <Text fontSize='12px' color={C.text}>
                      {r.gstin}
                    </Text>
                  ) : (
                    <Na />
                  )}
                </Box>
              ))
            )}
          </Flex>
        </Box>
      )}

      {/* ── Pagination ── */}
      <Flex
        justify='space-between'
        align='center'
        bg='white'
        border='1px solid'
        borderColor={C.border}
        borderRadius='12px'
        px='18px'
        py='12px'
        mt='14px'
        fontSize='13px'
        color={C.mid}
        flexWrap='wrap'
        gap='8px'
      >
        <Text>
          Page{' '}
          <Text as='strong' color={C.dark} fontWeight='700'>
            {page + 1}
          </Text>{' '}
          of {totalPages} · {totalElements} entries
        </Text>
        <Flex gap='4px' flexWrap='wrap'>
          <Box
            as='button'
            minW='32px'
            h='32px'
            borderRadius='7px'
            border='1px solid'
            borderColor={C.border}
            bg='white'
            color={C.text}
            fontSize='14px'
            fontWeight='700'
            cursor={page === 0 ? 'default' : 'pointer'}
            display='flex'
            alignItems='center'
            justifyContent='center'
            opacity={page === 0 ? 0.35 : 1}
            onClick={() => page > 0 && setPage(0)}
          >
            «
          </Box>
          <Box
            as='button'
            minW='32px'
            h='32px'
            borderRadius='7px'
            border='1px solid'
            borderColor={C.border}
            bg='white'
            color={C.text}
            fontSize='14px'
            fontWeight='700'
            cursor={page === 0 ? 'default' : 'pointer'}
            display='flex'
            alignItems='center'
            justifyContent='center'
            opacity={page === 0 ? 0.35 : 1}
            onClick={() => page > 0 && setPage((p) => p - 1)}
          >
            ‹
          </Box>

          {pageNums.map((n, idx) =>
            n === '…' ? (
              <Text key={`e${idx}`} fontSize='12px' color={C.muted} px='2px' lineHeight='32px'>
                …
              </Text>
            ) : (
              <Box
                key={n}
                as='button'
                minW='32px'
                h='32px'
                borderRadius='7px'
                border='1px solid'
                borderColor={n === page ? C.primary : C.border}
                bg={n === page ? C.primary : 'white'}
                color={n === page ? '#ffd557' : C.text}
                fontSize='13px'
                fontWeight='600'
                cursor='pointer'
                display='flex'
                alignItems='center'
                justifyContent='center'
                onClick={() => setPage(n)}
              >
                {n + 1}
              </Box>
            )
          )}

          <Box
            as='button'
            minW='32px'
            h='32px'
            borderRadius='7px'
            border='1px solid'
            borderColor={C.border}
            bg='white'
            color={C.text}
            fontSize='14px'
            fontWeight='700'
            cursor={page >= totalPages - 1 ? 'default' : 'pointer'}
            display='flex'
            alignItems='center'
            justifyContent='center'
            opacity={page >= totalPages - 1 ? 0.35 : 1}
            onClick={() => page < totalPages - 1 && setPage((p) => p + 1)}
          >
            ›
          </Box>
          <Box
            as='button'
            minW='32px'
            h='32px'
            borderRadius='7px'
            border='1px solid'
            borderColor={C.border}
            bg='white'
            color={C.text}
            fontSize='14px'
            fontWeight='700'
            cursor={page >= totalPages - 1 ? 'default' : 'pointer'}
            display='flex'
            alignItems='center'
            justifyContent='center'
            opacity={page >= totalPages - 1 ? 0.35 : 1}
            onClick={() => page < totalPages - 1 && setPage(totalPages - 1)}
          >
            »
          </Box>
        </Flex>
      </Flex>
    </Box>
  );
};

export default PartnerAccountDisbursement;
