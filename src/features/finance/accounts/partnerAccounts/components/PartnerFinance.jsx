import { Box, Flex, Text } from '@kfonbss/bss-ui-components';
import { debounce } from 'lodash-es';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import CommonFilter from '@/components/custom/CommonFilter';
import { SERVER_SIDE_TABLE_KEYS } from '@/constants/server_table';
import ServerSidePagination from '@/features/others/Pagination/components/Pagination';
import { getServerSideFilterDetails } from '@/features/others/Pagination/selectors';
import { selectorWithKey } from '@/utils/commonUtils';

import { fetchPartnerFinance } from '../action';
import { getPartnerFinance } from '../selector';

const TABLE_KEY = SERVER_SIDE_TABLE_KEYS.PARTNER_FINANCE_TABLE;

const generateMonthOptions = () => {
  const names = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const opts = [];
  const now = new Date();
  for (let i = 0; i < 24; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${names[d.getMonth()]}-${d.getFullYear()}`;
    opts.push({ id: key, name: key });
  }
  return opts;
};

const MONTH_OPTIONS = generateMonthOptions();

/* ── Design tokens ── */
const C = {
  primary: '#6b1a3d',
  dark:    '#5a1433',
  mid2:    '#7a2147',
  border:  '#f0e4ea',
  bg:      '#fbf7f5',
  text:    '#2b1a26',
  mid:     '#6f5e6a',
  muted:   '#a898a0'
};

const COL = '160px minmax(0,1.4fr) 120px minmax(0,1.2fr) 150px 110px 130px 130px';

const fmt = (v) => Math.abs(Number(v || 0)).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const fmtDate = (v) => {
  if (!v) return '—';
  try {
    const d = new Date(v);
    return d.toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false });
  } catch {
    return v;
  }
};

/* ── Sub-components ── */

const Wave = ({ fill, path }) => (
  <Box position="absolute" bottom="0" left="0" right="0" h="32px" opacity="0.5" pointerEvents="none">
    <svg viewBox="0 0 100 30" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
      <path d={path} fill={fill} />
    </svg>
  </Box>
);

const TopBtn = ({ children, isAmber }) => (
  <Box
    as="button"
    display="inline-flex" alignItems="center" gap="6px"
    px="16px" py="8px" borderRadius="100px"
    bg={isAmber ? '#fff0cf' : 'white'}
    border="1px solid"
    borderColor={isAmber ? '#f5dc99' : C.border}
    color={isAmber ? '#9a7800' : C.primary}
    fontSize="11.5px" fontWeight="700" cursor="pointer"
  >
    {children}
  </Box>
);

const StatCard = ({ icBg, badgeBg, badgeColor, badgeLabel, label, value, rp, valColor, sub, waveFill, wavePath, icon }) => (
  <Box
    bg="white" border="1px solid" borderColor={C.border} borderRadius="12px"
    p="14px 18px 12px" position="relative" overflow="hidden" minH="130px"
    display="flex" flexDirection="column" gap="8px"
    transition="transform 0.2s, box-shadow 0.2s"
    _hover={{ transform: 'translateY(-2px)', boxShadow: '0 6px 18px rgba(107,26,61,.08)' }}
  >
    <Flex justify="space-between" align="center">
      <Box w="36px" h="36px" borderRadius="9px" bg={icBg}
        display="flex" alignItems="center" justifyContent="center"
        color="white" boxShadow="0 3px 8px rgba(0,0,0,.1)">
        {icon}
      </Box>
      <Box bg={badgeBg} color={badgeColor} fontSize="9px" fontWeight="800"
        letterSpacing="0.5px" textTransform="uppercase" px="8px" py="3px" borderRadius="100px">
        {badgeLabel}
      </Box>
    </Flex>
    <Text fontSize="9.5px" fontWeight="800" letterSpacing="0.8px" textTransform="uppercase" color={C.muted}>
      {label}
    </Text>
    <Text fontSize="26px" letterSpacing="-0.6px" lineHeight="1" color={valColor || C.text}>
      {rp && <Text as="span" fontSize="16px" color={C.mid2} mr="2px" opacity="0.7">{rp}</Text>}
      {value}
    </Text>
    <Text fontSize="10.5px" color={C.mid} fontWeight="500">{sub}</Text>
    <Wave fill={waveFill} path={wavePath} />
  </Box>
);

/* ── Main component ── */

const PartnerFinance = () => {
  const dispatch = useDispatch();
  const records = useSelector(getPartnerFinance);
  const filterDetails = useSelector(getServerSideFilterDetails);

  const currentFilters = useMemo(() => selectorWithKey(filterDetails, TABLE_KEY) || {}, [filterDetails]);

  const [search, setSearch] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [pageSize, setPageSize] = useState(10);

  const getList = useCallback((params = {}) => {
    dispatch(fetchPartnerFinance({ ...params, key: TABLE_KEY }));
  }, [dispatch]);

  useEffect(() => {
    const fetchParams = { size: pageSize, ...currentFilters };
    if (searchQuery.length >= 3) {
      getList({ ...fetchParams, search: searchQuery });
    } else if (searchQuery.length === 0) {
      getList(fetchParams);
    }
  }, [searchQuery, getList, pageSize, currentFilters]);

  const debouncedSearch = useMemo(
    () => debounce((val) => { setSearchQuery(val); }, 500),
    []
  );

  const handleSearch = (e) => {
    setSearch(e.target.value);
    debouncedSearch(e.target.value);
  };

  const handlePageChange = useCallback(({ page, size }) => {
    const newSize = size || pageSize;
    if (size && size !== pageSize) setPageSize(size);
    const params = { page, size: newSize, ...currentFilters };
    if (searchQuery.length >= 3) params.search = searchQuery;
    getList({ key: TABLE_KEY, ...params });
  }, [pageSize, searchQuery, getList, currentFilters]);

  const handleApplyFilter = useCallback((filterValues) => {
    const params = { page: 0, size: pageSize, ...filterValues };
    if (searchQuery.length >= 3) params.search = searchQuery;
    getList({ key: TABLE_KEY, ...params });
  }, [pageSize, searchQuery, getList]);

  const filterConfig = useMemo(() => [
    { name: 'month', label: 'month', type: 'select', items: MONTH_OPTIONS },
    { name: 'partnerUuid', label: 'partnerUuid', type: 'text' }
  ], []);

  const tableData = records?.data || [];

  const pageCredits = tableData.filter((r) => r.amount > 0).reduce((s, r) => s + r.amount, 0);
  const pageDebits = Math.abs(tableData.filter((r) => r.amount < 0).reduce((s, r) => s + r.amount, 0));
  const latestClosingBalance = tableData[0]?.closingBalance ?? 0;

  const displayMonth = currentFilters.month || 'All';
  const displayPartner = currentFilters.partnerUuid || 'All Partners';

  return (
    <Box p="22px 26px 32px">

      {/* ── Page Header ── */}
      <Flex justify="space-between" align="flex-end" mb="20px" flexWrap="wrap" gap="14px">
        <Box>
          <Text fontSize="26px" color={C.dark} fontWeight="400" letterSpacing="-0.4px">
            Partner Finance Ledger ·{' '}
            <Text as="strong" fontWeight="700" color={C.primary}>{displayPartner}</Text>
            {displayMonth !== 'All' && (
              <>
                {' '}— {' '}
                <Text as="strong" fontWeight="700" color={C.primary}>{displayMonth}</Text>
              </>
            )}
          </Text>
        </Box>
        <Flex gap="8px" align="center">
          <TopBtn isAmber>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            Finance Status info...
          </TopBtn>
          <CommonFilter filterConfig={filterConfig} tableKey={TABLE_KEY} onApplyFilters={handleApplyFilter} />
        </Flex>
      </Flex>

      {/* ── Stat Cards ── */}
      <Box display="grid" gridTemplateColumns="repeat(4, 1fr)" gap="12px" mb="20px">
        <StatCard
          icBg="#5bbf95" badgeBg="#d9f0e5" badgeColor="#1b6b3a" badgeLabel="Credits"
          label="Total Credits" value={fmt(pageCredits)} rp="₹" valColor="#1b6b3a"
          sub="Sum of credits on this page"
          waveFill="#d9f0e5" wavePath="M0,22 Q15,8 30,16 T60,10 T100,6 L100,30 L0,30 Z"
          icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>}
        />
        <StatCard
          icBg="#e94e77" badgeBg="#ffe5ec" badgeColor="#a8284e" badgeLabel="Debits"
          label="Total Debits" value={fmt(pageDebits)} rp="₹" valColor="#e94e77"
          sub="Sum of debits on this page"
          waveFill="#ffe5ec" wavePath="M0,20 Q20,12 40,16 T80,8 T100,6 L100,30 L0,30 Z"
          icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><polyline points="22 17 13.5 8.5 8.5 13.5 2 7"/><polyline points="16 17 22 17 22 11"/></svg>}
        />
        <StatCard
          icBg="#8b7fd6" badgeBg="#e5e0fa" badgeColor="#4a3d8e" badgeLabel="Total"
          label="Total Transactions" value={tableData.length}
          sub="Ledger entries on this page"
          waveFill="#e5e0fa" wavePath="M0,24 Q20,10 40,14 T80,12 T100,8 L100,30 L0,30 Z"
          icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>}
        />
        <StatCard
          icBg="#2fb8c6" badgeBg="#d6f2f4" badgeColor="#0c5a63" badgeLabel="Balance"
          label="Latest Closing Balance" value={fmt(latestClosingBalance)} rp="₹"
          valColor={latestClosingBalance < 0 ? '#e94e77' : undefined}
          sub="Most recent ledger entry"
          waveFill="#d6f2f4" wavePath="M0,22 Q25,14 50,18 T100,12 L100,30 L0,30 Z"
          icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>}
        />
      </Box>

      {/* ── Section Label ── */}
      <Flex align="center" gap="10px" mb="14px" fontSize="11px" fontWeight="800"
        letterSpacing="1.2px" textTransform="uppercase" color={C.muted} flexWrap="wrap">
        <Text>Ledger Entries</Text>
        <Box flex="1" h="1px" bg={C.border} minW="20px" />
        <Text fontSize="10.5px" fontWeight="600" textTransform="none" letterSpacing="0.3px">
          Showing{' '}
          <Text as="strong" color={C.primary} fontWeight="700">{tableData.length}</Text>
          {' '}entries on this page
        </Text>
      </Flex>

      {/* ── Filter Bar ── */}
      <Flex bg="white" border="1px solid" borderColor={C.border} borderRadius="12px"
        p="10px 14px" mb="14px" align="center" gap="10px" flexWrap="wrap">
        <Flex flex="1" minW="220px" maxW="380px" align="center" gap="6px"
          bg={C.bg} border="1px solid" borderColor={C.border} borderRadius="8px" px="12px" h="34px">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={C.mid} strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.3-4.3"/>
          </svg>
          <input
            placeholder="Search by description, user or partner…"
            value={search}
            onChange={handleSearch}
            style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: '12.5px', color: C.text }}
          />
        </Flex>
        <Box flex="1" />
      </Flex>

      {/* ── Table Header ── */}
      <Box display="grid" gridTemplateColumns={COL} gap="12px" alignItems="center"
        px="18px" mb="8px" fontSize="9.5px" fontWeight="800" letterSpacing="0.8px"
        textTransform="uppercase" color={C.muted}>
        <Text>Date</Text>
        <Text>Description</Text>
        <Text>Partner ID</Text>
        <Text>Partner Name</Text>
        <Text>User Name</Text>
        <Text textAlign="right">Amount</Text>
        <Text textAlign="right">Opening Balance</Text>
        <Text textAlign="right">Closing Balance</Text>
      </Box>

      {/* ── Table Rows ── */}
      <Flex direction="column" gap="8px">
        {tableData.length === 0 ? (
          <Flex bg="white" border="1px solid" borderColor={C.border} borderRadius="10px"
            px="18px" py="24px" justify="center" align="center">
            <Text fontSize="13px" color={C.muted} fontStyle="italic">No data available in table</Text>
          </Flex>
        ) : (
          tableData.map((r, i) => {
            const isPos = r.amount > 0;
            const isNeg = r.amount < 0;
            return (
              <Box key={i}
                display="grid" gridTemplateColumns={COL} gap="12px" alignItems="center"
                bg="white" border="1px solid" borderColor={C.border} borderRadius="10px"
                px="18px" py="12px" cursor="pointer"
                transition="transform 0.15s, border-color 0.15s, box-shadow 0.15s"
                _hover={{ borderColor: C.primary, boxShadow: '0 4px 14px -6px rgba(107,26,61,.15)', transform: 'translateY(-1px)' }}
              >
                <Text fontSize="11px" color={C.text} fontWeight="600">{fmtDate(r.date)}</Text>
                <Text fontSize="12.5px" color={C.text} fontWeight="500">{r.description || '—'}</Text>
                <Text fontSize="12px" color={C.text} fontWeight="700">{r.partnerId || '—'}</Text>
                <Text fontSize="12.5px" color={C.text} fontWeight="600">{r.partnerName}</Text>
                <Text fontSize="11.5px" color={C.mid}>{r.userName || '—'}</Text>

                <Text textAlign="right" fontSize="13.5px" fontWeight="700" letterSpacing="-0.2px"
                  color={isPos ? '#1b6b3a' : isNeg ? '#e94e77' : C.muted}>
                  {r.amount !== 0 && (
                    <Text as="span" fontSize="11px" mr="1px" opacity="0.7">₹</Text>
                  )}
                  {isPos && fmt(r.amount)}
                  {isNeg && <>−{fmt(r.amount)}</>}
                  {!isPos && !isNeg && '—'}
                </Text>

                <Text textAlign="right" fontSize="12.5px"
                  color={r.openingBalance < 0 ? '#e94e77' : C.text} letterSpacing="-0.2px">
                  <Text as="span" fontSize="11px" color={C.mid} mr="1px" opacity="0.7">₹</Text>
                  {fmt(r.openingBalance)}
                </Text>

                <Text textAlign="right" fontSize="13px" fontWeight="600" letterSpacing="-0.2px"
                  color={r.closingBalance < 0 ? '#e94e77' : C.dark}>
                  <Text as="span" fontSize="11px" color={C.mid2} mr="1px" opacity="0.7">₹</Text>
                  {fmt(r.closingBalance)}
                </Text>
              </Box>
            );
          })
        )}
      </Flex>

      {/* ── Pagination ── */}
      <Box mt="14px">
        <ServerSidePagination onPageChange={handlePageChange} tableKey={TABLE_KEY} />
      </Box>

    </Box>
  );
};

export default PartnerFinance;
