import { Box, Flex, Text } from '@kfonbss/bss-ui-components';
import { debounce } from 'lodash-es';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { MultiSelectDropdown } from '@/components/custom';
import { SERVER_SIDE_TABLE_KEYS } from '@/constants/server_table';
import { fetchDistrict } from '@/features/common/actions';
import { getDistrict } from '@/features/common/selectors';
import { SegmentedProgress } from '@/features/finance/common/components';
import { getServerSidePaginationResponse } from '@/features/others/Pagination/selectors';

import { exportLNPWalletCsv, fetchLNPWallet } from '../action';
import { getLNPWallet } from '../selector';

const C = {
  maroon: '#5c012e',
  maroon2: '#8d0247',
  yellow: '#ffd557',
  yellowBg: '#fff9e8',
  mint: '#5bbf95',
  mintSoft: '#d9f0e5',
  mintDeep: '#1b6b3a',
  amber: '#f5b93b',
  amberSoft: '#fff0cf',
  amberDeep: '#9a7800',
  coral: '#f76c7a',
  coralSoft: '#ffe2e4',
  coralDeep: '#a3362f',
  slate: '#5b6e8b',
  lavSoft: '#e5e0fa',
  lavDeep: '#4a3d8e',
  line: '#f0e4ea',
  paper: '#fbf7f5',
  ink: '#2b1a26',
  inkSoft: '#6f5e6a'
};

const TABLE_KEY = SERVER_SIDE_TABLE_KEYS.LNP_WALLET_REPORT_TABLE;
const PAGE_SIZE = 10;

const STATUS_OPTIONS = [
  { value: 'ACTIVE', label: 'ACTIVE' },
  { value: 'LOW', label: 'LOW' },
  { value: 'ZERO', label: 'ZERO' }
];

const BAL_COLOR = { high: C.mintDeep, mid: C.amberDeep, low: C.coralDeep, zero: C.inkSoft };
const STATUS_PILL = {
  ACTIVE: { bg: C.mintSoft, color: C.mintDeep },
  LOW: { bg: C.amberSoft, color: C.amberDeep },
  ZERO: { bg: C.coralSoft, color: C.coralDeep }
};

const getBalClass = (balance) => {
  const n = parseFloat(balance) || 0;
  if (n <= 0) return 'zero';
  if (n < 10000) return 'low';
  if (n < 200000) return 'mid';
  return 'high';
};

const formatBalance = (val) => {
  if (val === null || val === undefined) return '—';
  const n = parseFloat(val);
  if (isNaN(n)) return String(val);
  return n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const formatTotalBalance = (val) => {
  if (!val && val !== 0) return '—';
  const n = parseFloat(val);
  if (isNaN(n)) return String(val);
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`;
  if (n >= 100000) return `₹${(n / 100000).toFixed(2)} L`;
  return `₹${n.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
};

const Pill = ({ label, bg, color }) => (
  <Box
    display='inline-flex'
    alignItems='center'
    px='8px'
    py='2px'
    borderRadius='20px'
    bg={bg}
    color={color}
    fontSize='10px'
    fontWeight='800'
    letterSpacing='0.3px'
  >
    {label}
  </Box>
);

const PgBtn = ({ onClick, disabled, children }) => (
  <Box
    as='button'
    minW='32px'
    h='32px'
    borderRadius='7px'
    border='1px solid'
    borderColor={C.line}
    bg='white'
    color={C.ink}
    fontSize='13px'
    px='10px'
    fontWeight='600'
    cursor='pointer'
    display='flex'
    alignItems='center'
    justifyContent='center'
    onClick={onClick}
    opacity={disabled ? 0.4 : 1}
    style={{ pointerEvents: disabled ? 'none' : 'auto' }}
  >
    {children}
  </Box>
);

const LNPWalletReport = () => {
  const dispatch = useDispatch();
  const { content: records = [], summary = {} } = useSelector(getLNPWallet) || {};
  const paginationResp = useSelector(getServerSidePaginationResponse);
  const totalElements = paginationResp?.[TABLE_KEY]?.totalElements ?? 0;
  const districtList = useSelector(getDistrict);

  const [inputValue, setInputValue] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [selectedDistricts, setSelectedDistricts] = useState([]);
  const [selectedStatuses, setSelectedStatuses] = useState([]);

  const debouncedSetSearch = useRef(
    debounce((val) => {
      setSearch(val);
      setPage(0);
    }, 400)
  ).current;

  useEffect(() => () => debouncedSetSearch.cancel(), [debouncedSetSearch]);

  const districtOptions = useMemo(
    () => (districtList || []).map((d) => ({ value: d.name, label: d.name })),
    [districtList]
  );

  const queryPayload = useMemo(
    () => ({
      page,
      size: PAGE_SIZE,
      ...(search && { search }),
      ...(selectedDistricts.length > 0 && { district: selectedDistricts.map((d) => d.value).join(',') }),
      ...(selectedStatuses.length > 0 && { status: selectedStatuses.map((s) => s.value).join(',') })
    }),
    [page, search, selectedDistricts, selectedStatuses]
  );

  useEffect(() => {
    dispatch(fetchDistrict());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchLNPWallet(queryPayload));
  }, [dispatch, queryPayload]);

  const total = totalElements;
  const totalPages = Math.ceil(total / PAGE_SIZE) || 1;

  const pageNums = (() => {
    const nums = Array.from({ length: totalPages }, (_, i) => i);
    if (totalPages <= 7) return nums;
    if (page < 4) return [...nums.slice(0, 5), '…', totalPages - 1];
    if (page > totalPages - 5) return [0, '…', ...nums.slice(totalPages - 5)];
    return [0, '…', page - 1, page, page + 1, '…', totalPages - 1];
  })();

  const { totalPartners, fundedWallets, zeroBalance, totalBalance, fundedPct, p1LPlus, p1To10K, p10KTo1L } = summary;
  const totalCount = typeof totalPartners === 'number' ? totalPartners : 0;
  const fundedCount = typeof fundedWallets === 'number' ? fundedWallets : 0;
  const zeroCount = typeof zeroBalance === 'number' ? zeroBalance : 0;
  const fundedPctVal =
    typeof fundedPct === 'number' ? fundedPct : totalCount > 0 ? Math.round((fundedCount / totalCount) * 100) : 0;
  const zeroPctVal = 100 - fundedPctVal;

  const COL = '130px minmax(0,2fr) 60px 110px 150px minmax(0,1.2fr) 80px';

  const ranges = [
    {
      label: '₹1L+',
      count: p1LPlus,
      color: C.mint
    },
    {
      label: '₹10K–1L',
      count: p10KTo1L,
      color: C.yellow
    },
    {
      label: '₹1–10K',
      count: p1To10K,
      color: C.coral
    },
    {
      label: 'Zero',
      count: zeroCount,
      color: C.slate
    }
  ];

  return (
    <Box p='22px 26px 32px' bg={C.paper}>
      <Flex mb='18px' align='flex-end' justify='space-between'>
        <Box>
          <Text fontSize='28px' color={C.maroon} fontWeight='700' letterSpacing='-0.4px' mb='4px'>
            LNP Virtual Wallet Balance
          </Text>
          <Text fontSize='12px' color={C.inkSoft}>
            Local Network Partners
          </Text>
        </Box>
        <Flex gap='8px'>
          <Box
            as='button'
            px='14px'
            h='34px'
            border='1px solid'
            borderColor={C.line}
            borderRadius='8px'
            bg='white'
            fontSize='12px'
            fontWeight='600'
            color={C.ink}
            cursor='pointer'
            onClick={() => dispatch(fetchLNPWallet(queryPayload))}
          >
            ⟲ Refresh
          </Box>
          <Box
            as='button'
            px='14px'
            h='34px'
            border='1px solid'
            borderColor={C.yellow}
            borderRadius='8px'
            bg={C.yellow}
            fontSize='12px'
            fontWeight='700'
            color={C.maroon}
            cursor='pointer'
            onClick={() =>
              dispatch(
                exportLNPWalletCsv({
                  ...(search && { search }),
                  ...(selectedDistricts.length > 0 && { district: selectedDistricts.map((d) => d.value).join(',') })
                })
              )
            }
          >
            ↓ Download CSV
          </Box>
        </Flex>
      </Flex>

      {/* KPIs */}
      <Box display='grid' gridTemplateColumns='repeat(4,1fr)' gap='14px' mb='18px'>
        {[
          {
            icon: '◈',
            iBg: '#d6f2f4',
            iC: '#0c5a63',
            label: 'Total LNP Partners',
            val: totalCount ? totalCount.toLocaleString('en-IN') : '—',
            sub: 'Across all 14 districts'
          },
          {
            icon: '✓',
            iBg: C.mintSoft,
            iC: C.mintDeep,
            label: 'Funded Wallets',
            val: fundedCount ? fundedCount.toLocaleString('en-IN') : '—',
            sub: totalCount > 0 ? `${fundedPctVal}% of total partners` : '—'
          },
          {
            icon: '○',
            iBg: C.coralSoft,
            iC: C.coralDeep,
            label: 'Zero Balance',
            val: zeroCount ? zeroCount.toLocaleString('en-IN') : '—',
            sub: totalCount > 0 ? `${zeroPctVal}% require top-up` : '—'
          },
          {
            icon: '₹',
            iBg: C.yellow,
            iC: C.maroon,
            label: 'Total Balance',
            val: totalBalance !== undefined ? formatTotalBalance(totalBalance) : '—',
            sub: totalBalance !== undefined ? 'GST incl.' : '—'
          }
        ].map((k, i) => (
          <Box
            key={i}
            bg={'white'}
            border='1px solid'
            borderColor={C.line}
            borderRadius='14px'
            p='16px'
            position='relative'
            overflow='hidden'
          >
            <Box
              w='34px'
              h='34px'
              borderRadius='10px'
              bg={k.iBg}
              color={k.iC}
              display='flex'
              alignItems='center'
              justifyContent='center'
              fontSize='15px'
              mb='10px'
            >
              {k.icon}
            </Box>
            <Text
              fontSize='11px'
              color={C.inkSoft}
              textTransform='uppercase'
              letterSpacing='0.5px'
              fontWeight='600'
              mb='4px'
            >
              {k.label}
            </Text>
            <Text fontSize={'26px'} color={C.maroon} lineHeight='1' fontWeight='700'>
              {k.val}
            </Text>
            <Text fontSize='11px' color={C.inkSoft} mt='6px'>
              {k.sub}
            </Text>
          </Box>
        ))}
      </Box>

      {/* Balance Distribution */}
      {totalCount > 0 && (
        <Box bg='white' border='1px solid' borderColor={C.line} borderRadius='14px' p='14px 18px' mb='18px'>
          <SegmentedProgress items={ranges} title='Balance Distribution' />
        </Box>
      )}

      {/* Filter Bar */}
      <Flex
        bg='white'
        border='1px solid'
        borderColor={C.line}
        borderRadius='12px'
        justify='space-between'
        p='10px 14px'
        mb='14px'
        align='center'
        gap='10px'
        flexWrap='wrap'
      >
        <Flex
          flex='1'
          minW='240px'
          maxW='380px'
          align='center'
          gap='6px'
          bg={C.paper}
          border='1px solid'
          borderColor={C.line}
          borderRadius='8px'
          px='12px'
          h='36px'
        >
          <svg width='13' height='13' viewBox='0 0 24 24' fill='none' stroke={C.inkSoft} strokeWidth='2'>
            <circle cx='11' cy='11' r='8' />
            <path d='M21 21l-4.3-4.3' />
          </svg>
          <input
            placeholder='Search by Partner ID, Company Name, PAN…'
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              debouncedSetSearch(e.target.value);
            }}
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              background: 'transparent',
              fontSize: '12px',
              color: C.ink
            }}
          />
          {inputValue && (
            <Box
              as='button'
              border='none'
              bg='transparent'
              cursor='pointer'
              color={C.inkSoft}
              lineHeight='1'
              style={{ fontSize: '16px', padding: 0 }}
              onClick={() => {
                setInputValue('');
                debouncedSetSearch.cancel();
                setSearch('');
                setPage(0);
              }}
            >
              ×
            </Box>
          )}
        </Flex>

        <Flex gap='10px' align='center'>
          <MultiSelectDropdown
            options={districtOptions}
            value={selectedDistricts}
            onChange={(opts) => {
              setSelectedDistricts(opts);
              setPage(0);
            }}
            placeholder='District'
            icon='📍'
            menuWidth='280px'
          />

          <MultiSelectDropdown
            options={STATUS_OPTIONS}
            value={selectedStatuses}
            onChange={(opts) => {
              setSelectedStatuses(opts);
              setPage(0);
            }}
            placeholder='Status'
            searchable={false}
            menuWidth='200px'
          />
        </Flex>
      </Flex>

      {/* Table Header */}
      <Box
        display='grid'
        gridTemplateColumns={COL}
        gap='12px'
        alignItems='center'
        px='18px'
        mb='4px'
        fontSize='10px'
        fontWeight='700'
        letterSpacing='0.8px'
        textTransform='uppercase'
        color={C.inkSoft}
      >
        <Text>Partner ID</Text>
        <Text>Company Name</Text>
        <Text>Type</Text>
        <Text>PAN</Text>
        <Text>GSTIN</Text>
        <Text textAlign='right'>Wallet Balance</Text>
        <Text>Status</Text>
      </Box>

      {/* Rows */}
      <Flex direction='column' gap='10px'>
        {records.length === 0 ? (
          <Flex
            bg='white'
            border='1px solid'
            borderColor={C.line}
            borderRadius='12px'
            px='18px'
            py='24px'
            justify='center'
          >
            <Text fontSize='13px' color={C.inkSoft} fontStyle='italic'>
              No data available
            </Text>
          </Flex>
        ) : (
          records.map((r, i) => {
            const balClass = r.balClass || getBalClass(r.walletBalance ?? r.balance);
            const balanceDisplay = formatBalance(r.walletBalance ?? r.balance);
            const partnerStatus = r.walletStatus || r.status || '—';
            return (
              <Box
                key={r.partnerId || i}
                display='grid'
                gridTemplateColumns={COL}
                gap='12px'
                alignItems='center'
                bg='white'
                borderRadius='12px'
                px='18px'
                py='16px'
                boxShadow='0 1px 2px rgba(74,15,42,.04),0 0 0 1px #f0e4ea'
                transition='all 0.18s ease'
                _hover={{ boxShadow: '0 4px 14px rgba(74,15,42,.08),0 0 0 1px #ffd557' }}
              >
                <Text fontSize='13px' color={C.inkSoft}>
                  {r.partnerId}
                </Text>
                <Text fontSize='13px' fontWeight='600' color={C.maroon} noOfLines={1}>
                  {r.companyName || r.partnerName || '—'}
                </Text>
                <Pill label='LNP' bg={C.lavSoft} color={C.lavDeep} />
                <Text fontSize='13px' color={C.inkSoft}>
                  {r.panCardNo || r.pan || '—'}
                </Text>
                <Text fontSize='13px' color={C.inkSoft}>
                  {r.gstin || r.gstIn || r.gstNumber || '—'}
                </Text>
                <Text textAlign='right' fontSize='13px' fontWeight='700' color={BAL_COLOR[balClass] || C.ink}>
                  ₹{balanceDisplay}
                </Text>
                <Pill
                  label={partnerStatus}
                  bg={STATUS_PILL[partnerStatus]?.bg || C.line}
                  color={STATUS_PILL[partnerStatus]?.color || C.ink}
                />
              </Box>
            );
          })
        )}
      </Flex>

      {/* Pagination */}
      <Flex
        justify='space-between'
        align='center'
        bg={C.paper}
        border='1px solid'
        borderColor={C.line}
        borderRadius='12px'
        px='16px'
        py='12px'
        mt='10px'
        fontSize='12px'
        color={C.inkSoft}
      >
        <Text>
          Showing{' '}
          <Text as='strong' color={C.maroon} fontWeight='700'>
            {total === 0 ? 0 : page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, total)}
          </Text>{' '}
          of{' '}
          <Text as='strong' color={C.maroon} fontWeight='700'>
            {total.toLocaleString('en-IN')}
          </Text>{' '}
          partners
        </Text>
        <Flex gap='6px' align='center'>
          <PgBtn onClick={() => setPage(0)} disabled={page === 0}>
            «
          </PgBtn>
          <PgBtn onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0}>
            ‹ Prev
          </PgBtn>
          {pageNums.map((n, idx) =>
            n === '…' ? (
              <Text key={`e${idx}`} px='2px' color={C.inkSoft}>
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
                borderColor={n === page ? C.maroon : C.line}
                bg={n === page ? C.maroon : 'white'}
                color={n === page ? 'white' : C.ink}
                fontSize='12px'
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
          <PgBtn onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}>
            Next ›
          </PgBtn>
          <PgBtn onClick={() => setPage(totalPages - 1)} disabled={page >= totalPages - 1}>
            »
          </PgBtn>
        </Flex>
      </Flex>
    </Box>
  );
};

export default LNPWalletReport;
