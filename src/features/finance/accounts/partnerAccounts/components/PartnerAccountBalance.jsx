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

import { fetchPartnerAccountBalance } from '../action';
import { getPartnerAccountBalance } from '../selector';

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

const COL = '140px minmax(0,1.8fr) 140px 130px 140px minmax(0,1fr)';
const PAGE_SIZE = 10;
const TABLE_KEY = SERVER_SIDE_TABLE_KEYS.PARTNER_ACCOUNT_BALANCE_TABLE;

const fmt = (v) => Math.abs(Number(v)).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

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
    <Text fontSize='13.5px' color={C.mid} fontWeight='500'>
      {sub}
    </Text>
    <Wave fill={waveFill} path={wavePath} />
  </Box>
);

/* ── Main component ── */

const PartnerAccountBalance = () => {
  const dispatch = useDispatch();
  const { data: partners = [] } = useSelector(getPartnerAccountBalance) || {};
  const paginationResp = useSelector(getServerSidePaginationResponse);
  const totalElements = paginationResp?.[TABLE_KEY]?.totalElements ?? 0;

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [page, setPage] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    dispatch(
      fetchPartnerAccountBalance({
        page,
        size: PAGE_SIZE,
        ...(search && { search }),
        ...(typeFilter && { partnerType: typeFilter })
      })
    );
  }, [dispatch, page, search, typeFilter]);

  const totalPages = Math.ceil(totalElements / PAGE_SIZE) || 1;
  const positiveCount = partners.filter((p) => p.balance > 0).length;
  const negativeCount = partners.filter((p) => p.balance < 0).length;
  const pageBalance = partners.reduce((s, p) => s + (p.balance || 0), 0);

  const typeColor = (t) =>
    t === 'ISP'
      ? { bg: '#dde8f2', color: '#2c6a96' }
      : t === 'AGNP'
        ? { bg: '#d9f0e5', color: '#1b6b3a' }
        : t === 'LNP'
          ? { bg: '#e5e0fa', color: '#4a3d8e' }
          : { bg: '#fff0cf', color: '#9a7800' };

  const balColor = (v) => (v > 0 ? '#1b6b3a' : v < 0 ? '#e94e77' : C.muted);

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
      if (typeFilter) params.partnerType = typeFilter;
      if (search) params.search = search;

      const response = await getRequest(API_URL.FINANCE.PARTNER_ACCOUNTS.EXPORT_ACCOUNT_BALANCE_CSV, {
        baseURL,
        config: {
          headers: { Authorization: `Bearer ${token}` },
          params,
          responseType: 'blob'
        }
      });

      if (response?.data) {
        downloadFileFromBlobResponse(response.data, 'partner-account-balance.csv');
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
            Partner Account Balance
          </Text>
          <Text fontSize='15px' color={C.mid}>
            Account balances across all registered partner accounts
          </Text>
        </Box>
        <Button variant='outline' borderRadius='md' height='40px' isLoading={isDownloading} onClick={handleDownloadCsv}>
          Download CSV
        </Button>
      </Flex>

      {/* ── Stat Cards ── */}
      <Box display='grid' gridTemplateColumns='repeat(4, 1fr)' gap='12px' mb='20px'>
        <StatCard
          icBg='#8b7fd6'
          badgeBg='#fff0cf'
          badgeColor='#9a7800'
          badgeLabel='Total'
          label='Total Partners'
          value={totalElements}
          sub='All registered partner accounts'
          waveFill='#e5e0fa'
          wavePath='M0,22 Q15,8 30,16 T60,10 T100,6 L100,30 L0,30 Z'
          icon={
            <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='white' strokeWidth='2'>
              <path d='M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2' />
              <circle cx='9' cy='7' r='4' />
              <path d='M23 21v-2a4 4 0 00-3-3.87' />
              <path d='M16 3.13a4 4 0 010 7.75' />
            </svg>
          }
        />
        <StatCard
          icBg='#2fb8c6'
          badgeBg='#dde8f2'
          badgeColor='#2c6a96'
          badgeLabel='Balance'
          label='Page Balance'
          rp={pageBalance !== 0 ? '₹' : undefined}
          value={pageBalance !== 0 ? fmt(pageBalance) : '0.00'}
          sub='Sum of current page balances'
          waveFill='#d6f2f4'
          wavePath='M0,20 Q20,12 40,16 T80,8 T100,6 L100,30 L0,30 Z'
          icon={
            <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='white' strokeWidth='2'>
              <path d='M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6' />
            </svg>
          }
        />
        <StatCard
          icBg='#5bbf95'
          badgeBg='#d9f0e5'
          badgeColor='#1b6b3a'
          badgeLabel='Active'
          label='Positive Balance'
          value={positiveCount}
          valColor='#1b6b3a'
          sub='Accounts with outstanding credit'
          waveFill='#d9f0e5'
          wavePath='M0,24 Q20,10 40,14 T80,12 T100,8 L100,30 L0,30 Z'
          icon={
            <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='white' strokeWidth='2'>
              <polyline points='22 7 13.5 15.5 8.5 10.5 2 17' />
              <polyline points='16 7 22 7 22 13' />
            </svg>
          }
        />
        <StatCard
          icBg='#e94e77'
          badgeBg='#ffe5ec'
          badgeColor='#a8284e'
          badgeLabel='Alert'
          label='Negative Balance'
          value={negativeCount}
          valColor='#e94e77'
          sub='Accounts requiring top-up'
          waveFill='#ffe5ec'
          wavePath='M0,22 Q25,14 50,18 T100,12 L100,30 L0,30 Z'
          icon={
            <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='white' strokeWidth='2'>
              <circle cx='12' cy='12' r='10' />
              <line x1='12' y1='8' x2='12' y2='12' />
              <line x1='12' y1='16' x2='12.01' y2='16' />
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
        <Text>Partner Ledger</Text>
        <Box flex='1' h='1px' bg={C.border} minW='20px' />
        <Text fontSize='12px' fontWeight='600' textTransform='none' letterSpacing='0.3px'>
          Showing{' '}
          <Text as='strong' color={C.primary} fontWeight='700'>
            {partners.length}
          </Text>{' '}
          of {totalElements} partners
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
          minW='240px'
          maxW='380px'
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
            placeholder='Search by Partner ID, Name or PAN…'
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
              onClick={() => {
                setSearch('');
                setPage(0);
              }}
              style={{ fontSize: '16px', padding: 0 }}
            >
              ×
            </Box>
          )}
        </Flex>

        {/* Partner Type chips */}
        <Flex align='center' gap='4px'>
          <Text
            fontSize='11px'
            fontWeight='800'
            letterSpacing='0.6px'
            textTransform='uppercase'
            color={C.muted}
            mr='4px'
          >
            Type
          </Text>
          {['All', 'LNP', 'AGNP', 'ISP'].map((t) => {
            const active = t === 'All' ? !typeFilter : typeFilter === t;
            return (
              <Box
                key={t}
                as='button'
                px='12px'
                h='32px'
                borderRadius='6px'
                border='1px solid'
                borderColor={active ? C.primary : C.border}
                bg={active ? C.primary : 'white'}
                color={active ? 'white' : C.mid}
                fontSize='12px'
                fontWeight={active ? '700' : '600'}
                cursor='pointer'
                transition='all 0.15s'
                onClick={() => {
                  setTypeFilter(t === 'All' ? '' : t);
                  setPage(0);
                }}
              >
                {t}
              </Box>
            );
          })}
        </Flex>

        <Box flex='1' />
        <Text fontSize='12px' color={C.muted} fontWeight='600' whiteSpace='nowrap'>
          Display{' '}
          <Text as='strong' color={C.dark} fontWeight='700'>
            {PAGE_SIZE}
          </Text>{' '}
          records
        </Text>
      </Flex>

      {/* ── Table Header ── */}
      <Box
        display='grid'
        gridTemplateColumns={COL}
        gap='12px'
        alignItems='center'
        px='18px'
        mb='8px'
        fontSize='13px'
        fontWeight='800'
        letterSpacing='0.8px'
        textTransform='uppercase'
        color={C.muted}
      >
        <Text>Partner ID</Text>
        <Text>Company Name</Text>
        <Text textAlign='right'>A/c. Balance</Text>
        <Text>Type</Text>
        <Text>PAN-Card No.</Text>
        <Text>GSTIN</Text>
      </Box>

      {/* ── Table Rows ── */}
      <Flex direction='column' gap='8px'>
        {partners.length === 0 ? (
          <Flex
            bg='white'
            border='1px solid'
            borderColor={C.border}
            borderRadius='10px'
            px='18px'
            py='24px'
            justify='center'
          >
            <Text fontSize='13px' color={C.muted} fontStyle='italic'>
              No data available
            </Text>
          </Flex>
        ) : (
          partners.map((p, i) => {
            const tc = typeColor(p.partnerType);
            return (
              <Box
                key={p.partnerId || i}
                display='grid'
                gridTemplateColumns={COL}
                gap='12px'
                alignItems='center'
                bg='white'
                border='1px solid'
                borderColor={C.border}
                borderRadius='10px'
                px='18px'
                py='13px'
                cursor='pointer'
                transition='transform 0.15s, border-color 0.15s, box-shadow 0.15s'
                _hover={{
                  borderColor: C.primary,
                  boxShadow: '0 4px 14px -6px rgba(107,26,61,.15)',
                  transform: 'translateY(-1px)'
                }}
              >
                <Text fontSize='14px' color={C.text} fontWeight='700' letterSpacing='0.3px'>
                  {p.partnerId || '—'}
                </Text>

                <Text fontSize='15px' fontWeight='700' color={C.text}>
                  {p.companyName}
                </Text>

                <Text
                  textAlign='right'
                  fontSize='15px'
                  fontWeight='700'
                  letterSpacing='-0.2px'
                  color={balColor(p.balance)}
                >
                  {p.balance !== 0 && (
                    <Text as='span' fontSize='13px' mr='1px' opacity='0.7'>
                      ₹
                    </Text>
                  )}
                  {p.balance > 0 && fmt(p.balance)}
                  {p.balance < 0 && <>−{fmt(p.balance)}</>}
                  {(!p.balance || p.balance === 0) && '0.00'}
                </Text>

                <Box>
                  <Box
                    display='inline-flex'
                    alignItems='center'
                    justifyContent='center'
                    px='10px'
                    py='4px'
                    borderRadius='5px'
                    bg={tc.bg}
                    color={tc.color}
                    fontSize='13px'
                    fontWeight='800'
                    letterSpacing='0.4px'
                  >
                    {p.partnerType}
                  </Box>
                </Box>

                <Text fontSize='14px' color={C.text} letterSpacing='0.3px'>
                  {p.panCardNo || '—'}
                </Text>

                {p.gstin ? (
                  <Text fontSize='14px' color={C.text} letterSpacing='0.3px'>
                    {p.gstin}
                  </Text>
                ) : (
                  <Text fontSize='13px' color='#c8b8c0' fontStyle='italic'>
                    —
                  </Text>
                )}
              </Box>
            );
          })
        )}
      </Flex>

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
        fontSize='12.5px'
        color={C.mid}
      >
        <Text>
          Showing{' '}
          <Text as='strong' color={C.dark} fontWeight='700'>
            {totalElements === 0 ? 0 : page * PAGE_SIZE + 1} – {Math.min((page + 1) * PAGE_SIZE, totalElements)}
          </Text>{' '}
          of {totalElements} entries
        </Text>
        <Flex gap='4px' align='center'>
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
            fontWeight='600'
            cursor='pointer'
            display='flex'
            alignItems='center'
            justifyContent='center'
            onClick={() => setPage(0)}
            opacity={page === 0 ? 0.4 : 1}
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
            fontWeight='600'
            cursor='pointer'
            display='flex'
            alignItems='center'
            justifyContent='center'
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            opacity={page === 0 ? 0.4 : 1}
          >
            ‹
          </Box>

          {pageNums.map((n, i) =>
            n === '…' ? (
              <Text key={`e${i}`} px='2px' color={C.muted}>
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
                fontSize='12.5px'
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
            fontWeight='600'
            cursor='pointer'
            display='flex'
            alignItems='center'
            justifyContent='center'
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            opacity={page >= totalPages - 1 ? 0.4 : 1}
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
            fontWeight='600'
            cursor='pointer'
            display='flex'
            alignItems='center'
            justifyContent='center'
            onClick={() => setPage(totalPages - 1)}
            opacity={page >= totalPages - 1 ? 0.4 : 1}
          >
            »
          </Box>
        </Flex>
      </Flex>
    </Box>
  );
};

export default PartnerAccountBalance;
