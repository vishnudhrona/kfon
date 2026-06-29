import { Box, Flex, Text } from '@kfonbss/bss-ui-components';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import CsvDownloadBtn from '@/components/custom/CsvDownloadBtn';
import { SERVER_SIDE_TABLE_KEYS } from '@/constants/server_table';
import { getServerSidePaginationResponse } from '@/features/others/Pagination/selectors';

import { fetchSubscriberOnlineRecharge } from '../action';
import { getSubscriberOnlineRecharge } from '../selector';

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

const TABLE_COL =
  '120px 110px 90px minmax(110px,1fr) 100px minmax(150px,1fr) 105px 120px 130px minmax(120px,1fr) minmax(150px,1fr)';
const TABLE_MINW = '1550px';
const PAGE_SIZE = 10;
const TABLE_KEY = SERVER_SIDE_TABLE_KEYS.SUBSCRIBER_ONLINE_RECHARGE_TABLE;

const GATEWAYS = ['HDFC', 'IKM', 'ANP', 'IKON', 'BBPS'];

const fmt = (v) => Number(v).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const fmtDate = (v) => {
  if (!v) return null;
  const d = new Date(v);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
};

const statusStyle = (s) => {
  if (!s) return { bg: C.bg, color: C.muted };
  const u = s.toUpperCase();
  if (u === 'SUCCESS') return { bg: '#d9f0e5', color: '#1b6b3a' };
  if (u === 'FAILED' || u === 'TXN_FAILER' || u.includes('FAIL')) return { bg: '#ffe5ec', color: '#a8284e' };
  if (u === 'INITIATED' || u === 'PENDING') return { bg: '#fff0cf', color: '#9a7800' };
  return { bg: '#e5e0fa', color: '#4a3d8e' };
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
        fontSize='11px'
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
  <Text fontSize='13px' color='#c8b8c0' fontStyle='italic'>
    —
  </Text>
);

/* ── Main component ── */

const SubscriberOnlineRecharge = () => {
  const dispatch = useDispatch();
  const { data: records = [] } = useSelector(getSubscriberOnlineRecharge) || {};
  const paginationResp = useSelector(getServerSidePaginationResponse);
  const totalElements = paginationResp?.[TABLE_KEY]?.totalElements ?? 0;

  const [search, setSearch] = useState('');
  const [month, setMonth] = useState('');
  const [gateway, setGateway] = useState('');
  const [page, setPage] = useState(0);

  useEffect(() => {
    dispatch(
      fetchSubscriberOnlineRecharge({
        page,
        size: PAGE_SIZE,
        filterType: 'ORDERED',
        ...(search && { partnerUuid: search }),
        ...(month && { month }),
        ...(gateway && { gateway })
      })
    );
  }, [dispatch, page, search, month, gateway]);

  const totalPages = Math.ceil(totalElements / PAGE_SIZE) || 1;
  const successCount = records.filter((r) => r.billingStatus?.toUpperCase() === 'SUCCESS').length;
  const failedCount = records.filter((r) => {
    const s = r.billingStatus?.toUpperCase() || '';
    return s === 'FAILED' || s === 'TXN_FAILER' || s.includes('FAIL');
  }).length;
  const pageTotal = records.reduce((s, r) => s + (r.amount || 0), 0);

  const pageNums = (() => {
    const nums = Array.from({ length: totalPages }, (_, i) => i);
    if (totalPages <= 7) return nums;
    if (page < 4) return [...nums.slice(0, 5), '…', totalPages - 1];
    if (page > totalPages - 5) return [0, '…', ...nums.slice(totalPages - 5)];
    return [0, '…', page - 1, page, page + 1, '…', totalPages - 1];
  })();

  return (
    <Box p='22px 26px 32px'>
      {/* ── Page Header ── */}
      <Flex justify='space-between' align='flex-end' mb='20px' flexWrap='wrap' gap='14px'>
        <Box>
          <Text fontSize='28px' color={C.dark} fontWeight='400' letterSpacing='-0.4px' mb='4px'>
            Online Txn ·{' '}
            <Text as='strong' fontWeight='700' color={C.primary}>
              All Partners
            </Text>
          </Text>
          <Flex gap='20px' flexWrap='wrap'>
            <Text fontSize='15px' color={C.mid}>
              Total Amount Received —{' '}
              <Text as='strong' color='#1b6b3a' fontWeight='700'>
                ₹{fmt(pageTotal)}
              </Text>
            </Text>
            <Text fontSize='15px' color={C.mid}>
              Total Transactions —{' '}
              <Text as='strong' color={C.primary} fontWeight='700'>
                {totalElements}
              </Text>
            </Text>
          </Flex>
        </Box>
        <Flex gap='8px' align='center'>
          <CsvDownloadBtn />
        </Flex>
      </Flex>

      {/* ── Stat Cards ── */}
      <Box display='grid' gridTemplateColumns='repeat(4, 1fr)' gap='12px' mb='20px'>
        <StatCard
          icBg='#8b7fd6'
          badgeBg='#e5e0fa'
          badgeColor='#4a3d8e'
          badgeLabel='Total'
          label='Total Transactions'
          value={totalElements}
          sub='All online recharge records'
          waveFill='#e5e0fa'
          wavePath='M0,22 Q15,8 30,16 T60,10 T100,6 L100,30 L0,30 Z'
          icon={
            <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='white' strokeWidth='2'>
              <path d='M9 11l3 3L22 4' />
              <path d='M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11' />
            </svg>
          }
        />
        <StatCard
          icBg='#5bbf95'
          badgeBg='#d9f0e5'
          badgeColor='#1b6b3a'
          badgeLabel='Amount'
          label='Page Total Amount'
          rp='₹'
          value={fmt(pageTotal)}
          valColor='#1b6b3a'
          sub='Sum of current page'
          waveFill='#d9f0e5'
          wavePath='M0,20 Q20,12 40,16 T80,8 T100,6 L100,30 L0,30 Z'
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
          badgeLabel='Success'
          label='Successful'
          value={successCount}
          valColor='#1b6b3a'
          sub='Completed transactions'
          waveFill='#d6f2f4'
          wavePath='M0,24 Q20,10 40,14 T80,12 T100,8 L100,30 L0,30 Z'
          icon={
            <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='white' strokeWidth='2'>
              <polyline points='20 6 9 17 4 12' />
            </svg>
          }
        />
        <StatCard
          icBg='#e94e77'
          badgeBg='#ffe5ec'
          badgeColor='#a8284e'
          badgeLabel='Failed'
          label='Failed / Initiated'
          value={failedCount + (records.length - successCount - failedCount)}
          valColor='#e94e77'
          sub='Failed or pending transactions'
          waveFill='#ffe5ec'
          wavePath='M0,22 Q25,14 50,18 T100,12 L100,30 L0,30 Z'
          icon={
            <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='white' strokeWidth='2'>
              <circle cx='12' cy='12' r='10' />
              <line x1='15' y1='9' x2='9' y2='15' />
              <line x1='9' y1='9' x2='15' y2='15' />
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
        <Text>Transaction Records</Text>
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
        {/* Partner UUID search */}
        <Flex
          flex='1'
          minW='220px'
          maxW='340px'
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
            placeholder='Partner UUID…'
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
              onClick={() => {
                setSearch('');
                setPage(0);
              }}
              style={{ fontSize: '16px', padding: 0, lineHeight: 1 }}
            >
              ×
            </Box>
          )}
        </Flex>

        {/* Month input */}
        <Flex
          align='center'
          gap='6px'
          bg={C.bg}
          border='1px solid'
          borderColor={month ? C.primary : C.border}
          borderRadius='8px'
          px='12px'
          h='36px'
          minW='160px'
        >
          <svg
            width='12'
            height='12'
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
              flex: 1,
              border: 'none',
              outline: 'none',
              background: 'transparent',
              fontSize: '13px',
              color: month ? C.text : C.muted,
              cursor: 'pointer'
            }}
          />
        </Flex>

        {/* Gateway chips */}
        <Flex align='center' gap='4px'>
          <Text
            fontSize='11px'
            fontWeight='800'
            letterSpacing='0.6px'
            textTransform='uppercase'
            color={C.muted}
            mr='4px'
          >
            Gateway
          </Text>
          {['All', ...GATEWAYS].map((g) => {
            const active = g === 'All' ? !gateway : gateway === g;
            return (
              <Box
                key={g}
                as='button'
                px='10px'
                h='30px'
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
                  setGateway(g === 'All' ? '' : g);
                  setPage(0);
                }}
              >
                {g}
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

      {/* ── Table ── */}
      <Box overflowX='auto' pb='4px'>
        <Box
          display='grid'
          gridTemplateColumns={TABLE_COL}
          gap='10px'
          alignItems='center'
          px='18px'
          mb='8px'
          minW={TABLE_MINW}
          fontSize='12px'
          fontWeight='800'
          letterSpacing='0.8px'
          textTransform='uppercase'
          color={C.muted}
        >
          <Text>Order Time</Text>
          <Text>Partner Id</Text>
          <Text>Sub. Id</Text>
          <Text>Username</Text>
          <Text textAlign='right'>Order Amount</Text>
          <Text>Billing Reference</Text>
          <Text>Billing Status</Text>
          <Text>Txn. Date</Text>
          <Text>Txn. Reference</Text>
          <Text>Partner Name</Text>
          <Text>Billing Response</Text>
        </Box>

        <Flex direction='column' gap='8px'>
          {records.length === 0 ? (
            <Flex
              bg='white'
              border='1px solid'
              borderColor={C.border}
              borderRadius='10px'
              px='18px'
              py='24px'
              justify='center'
              minW={TABLE_MINW}
            >
              <Text fontSize='13px' color={C.muted} fontStyle='italic'>
                No data available
              </Text>
            </Flex>
          ) : (
            records.map((r, i) => {
              const ss = statusStyle(r.billingStatus);
              return (
                <Box
                  key={r.billingReference || i}
                  display='grid'
                  gridTemplateColumns={TABLE_COL}
                  gap='10px'
                  alignItems='center'
                  bg='white'
                  border='1px solid'
                  borderColor={C.border}
                  borderRadius='10px'
                  px='18px'
                  py='13px'
                  cursor='pointer'
                  minW={TABLE_MINW}
                  transition='transform 0.15s, border-color 0.15s, box-shadow 0.15s'
                  _hover={{
                    borderColor: C.primary,
                    boxShadow: '0 4px 14px -6px rgba(107,26,61,.15)',
                    transform: 'translateY(-1px)'
                  }}
                >
                  <Text fontSize='13px' color={C.text} fontWeight='600' letterSpacing='-0.1px'>
                    {fmtDate(r.orderTime) || <Na />}
                  </Text>

                  <Text fontSize='13px' color={C.text} fontWeight='700'>
                    {r.partnerId || '—'}
                  </Text>

                  <Text fontSize='13px' color={C.text} fontWeight='600'>
                    {r.subscriberId ?? '—'}
                  </Text>

                  <Text fontSize='13px' fontWeight='600' color={C.text}>
                    {r.username || '—'}
                  </Text>

                  <Text textAlign='right' fontSize='14px' fontWeight='700' color='#1b6b3a' letterSpacing='-0.3px'>
                    <Text as='span' fontSize='12px' mr='1px' color={C.mid2} opacity='0.7'>
                      ₹
                    </Text>
                    {fmt(r.amount)}
                  </Text>

                  <Text fontSize='12px' color={C.text} letterSpacing='0.2px'>
                    {r.billingReference || '—'}
                  </Text>

                  <Box>
                    <Box
                      display='inline-flex'
                      alignItems='center'
                      justifyContent='center'
                      px='10px'
                      py='3px'
                      borderRadius='5px'
                      bg={ss.bg}
                      color={ss.color}
                      fontSize='12px'
                      fontWeight='800'
                      letterSpacing='0.4px'
                    >
                      {r.billingStatus || '—'}
                    </Box>
                  </Box>

                  {r.txnDate ? (
                    <Text fontSize='13px' color={C.text} fontWeight='600'>
                      {fmtDate(r.txnDate)}
                    </Text>
                  ) : (
                    <Na />
                  )}

                  {r.txnReference ? (
                    <Text fontSize='13px' color={C.text}>
                      {r.txnReference}
                    </Text>
                  ) : (
                    <Na />
                  )}

                  <Text fontSize='13px' fontWeight='600' color={C.text}>
                    {r.partnerName || '—'}
                  </Text>

                  {r.billingResponse ? (
                    <Text fontSize='12px' color={C.mid} fontWeight='500'>
                      {r.billingResponse}
                    </Text>
                  ) : (
                    <Na />
                  )}
                </Box>
              );
            })
          )}
        </Flex>
      </Box>

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
          {pageNums.map((n, idx) =>
            n === '…' ? (
              <Text key={`e${idx}`} px='2px' color={C.muted}>
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

export default SubscriberOnlineRecharge;
