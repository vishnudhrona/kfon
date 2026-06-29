import { Box, Flex, Text } from '@kfonbss/bss-ui-components';
import { debounce } from 'lodash-es';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getRequest } from '@/app/axios';
import CommonFilter from '@/components/custom/CommonFilter';
import CsvDownloadBtn from '@/components/custom/CsvDownloadBtn';
import { STORAGE_KEYS } from '@/constants';
import { SERVER_SIDE_TABLE_KEYS } from '@/constants/server_table';
import { API_URL } from '@/constants/urls';
import ServerSidePagination from '@/features/others/Pagination/components/Pagination';
import { getServerSideFilterDetails } from '@/features/others/Pagination/selectors';
import { selectorWithKey } from '@/utils/commonUtils';
import { getDataFromStorage } from '@/utils/encryptionUtils';
import { downloadFileFromBlobResponse } from '@/utils/fileUtils';

import { fetchOnePlusOne } from '../action';
import { getOnePlusOne, getOnePlusOneMeta } from '../selector';

const TABLE_KEY = SERVER_SIDE_TABLE_KEYS.ONE_PLUS_ONE_TABLE;

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
  dark: '#5a1433',
  mid2: '#7a2147',
  border: '#f0e4ea',
  bg: '#fbf7f5',
  text: '#2b1a26',
  mid: '#6f5e6a',
  muted: '#a898a0'
};

const TABLE_COL = '105px 65px 90px 80px 90px 65px 65px 90px 120px 110px 90px minmax(160px,1fr) 140px minmax(160px,1fr) 110px 100px 140px';
const TABLE_MINW = '1950px';

const fmt = (v) => Number(v || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/* ── Sub-components ── */

const Wave = ({ fill, path }) => (
  <Box position="absolute" bottom="0" left="0" right="0" h="32px" opacity="0.5" pointerEvents="none">
    <svg viewBox="0 0 100 30" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
      <path d={path} fill={fill} />
    </svg>
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

const Na = () => <Text fontSize="11px" color="#c8b8c0" fontStyle="italic">—</Text>;

/* ── Main component ── */

const OnePlusOneReport = () => {
  const dispatch = useDispatch();
  const records = useSelector(getOnePlusOne);
  const meta = useSelector(getOnePlusOneMeta);
  const filterDetails = useSelector(getServerSideFilterDetails);

  const currentFilters = useMemo(() => selectorWithKey(filterDetails, TABLE_KEY) || {}, [filterDetails]);

  const [search, setSearch] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [pageSize, setPageSize] = useState(10);

  const getList = useCallback((params = {}) => {
    dispatch(fetchOnePlusOne({ ...params, key: TABLE_KEY }));
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

  const handleDownloadCsv = async () => {
    try {
      const token = getDataFromStorage(STORAGE_KEYS.AUTH_TOKEN, false);
      const baseURL = import.meta.env.VITE_API_BASE_URL;
      const params = {};
      if (currentFilters.month) params.month = currentFilters.month;
      if (currentFilters.partnerUuid) params.partnerUuid = currentFilters.partnerUuid;
      if (searchQuery.length >= 3) params.search = searchQuery;
      const response = await getRequest(API_URL.FINANCE.PARTNER_ACCOUNTS.EXPORT_ONE_PLUS_ONE_CSV, {
        baseURL,
        config: { headers: { Authorization: `Bearer ${token}` }, params, responseType: 'blob' }
      });
      if (response?.data) downloadFileFromBlobResponse(response.data, 'one-plus-one-report.csv');
    } catch (e) {
      console.error('CSV download failed', e);
    }
  };

  const tableData = records?.data || [];
  const totalRevenue = meta?.totalRevenue || 0;
  const totalKfc = meta?.totalKfc || 0;
  const totalGst = meta?.totalGst || 0;
  const totalElements = meta?.totalElements || 0;
  const displayMonth = meta?.month || currentFilters.month || '—';
  const displayPartner = currentFilters.partnerUuid || 'All Partners';

  return (
    <Box p="22px 26px 32px">

      {/* ── Page Header ── */}
      <Flex justify="space-between" align="flex-end" mb="20px" flexWrap="wrap" gap="14px">
        <Box>
          <Text fontSize="28px" color={C.dark} fontWeight="400" letterSpacing="-0.4px" mb="4px">
            1+1 Report ·{' '}
            <Text as="strong" fontWeight="700" color={C.primary}>{displayPartner}</Text>
            {displayMonth !== '—' && (
              <>
                {' '}for the month of{' '}
                <Text as="strong" fontWeight="700" color={C.primary}>{displayMonth}</Text>
              </>
            )}
          </Text>
          <Flex gap="20px" flexWrap="wrap">
            <Text fontSize="12.5px" color={C.mid}>
              Total Revenue —{' '}
              <Text as="strong" color="#1b6b3a" fontWeight="700">₹{fmt(totalRevenue)}</Text>
            </Text>
            <Text fontSize="12.5px" color={C.mid}>
              Total KFC —{' '}
              <Text as="strong" color="#9a7800" fontWeight="700">₹{fmt(totalKfc)}</Text>
            </Text>
          </Flex>
        </Box>
        <Flex gap="8px" align="center">
          <CsvDownloadBtn onClick={handleDownloadCsv} />
          <CommonFilter filterConfig={filterConfig} tableKey={TABLE_KEY} onApplyFilters={handleApplyFilter} />
        </Flex>
      </Flex>

      {/* ── Stat Cards ── */}
      <Box display="grid" gridTemplateColumns="repeat(4, 1fr)" gap="12px" mb="20px">
        <StatCard
          icBg="#5bbf95" badgeBg="#d9f0e5" badgeColor="#1b6b3a" badgeLabel="Revenue"
          label="Total Revenue" rp="₹" value={fmt(totalRevenue)} valColor="#1b6b3a"
          sub={`${displayMonth !== '—' ? displayMonth : 'All months'} · ${displayPartner}`}
          waveFill="#d9f0e5" wavePath="M0,22 Q15,8 30,16 T60,10 T100,6 L100,30 L0,30 Z"
          icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" /></svg>}
        />
        <StatCard
          icBg="#f5b93b" badgeBg="#fff0cf" badgeColor="#9a7800" badgeLabel="Cess"
          label="Total KFC" rp="₹" value={fmt(totalKfc)} valColor="#9a7800"
          sub="Kerala Flood Cess"
          waveFill="#fff0cf" wavePath="M0,22 Q25,14 50,18 T100,12 L100,30 L0,30 Z"
          icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>}
        />
        <StatCard
          icBg="#2fb8c6" badgeBg="#dde8f2" badgeColor="#2c6a96" badgeLabel="GST"
          label="Total GST" rp="₹" value={fmt(totalGst)}
          sub="CGST + SGST/UGST + IGST"
          waveFill="#d6f2f4" wavePath="M0,20 Q20,12 40,16 T80,8 T100,6 L100,30 L0,30 Z"
          icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" /></svg>}
        />
        <StatCard
          icBg="#8b7fd6" badgeBg="#e5e0fa" badgeColor="#4a3d8e" badgeLabel="Total"
          label="Total Records" value={totalElements}
          sub="1+1 plan transactions"
          waveFill="#e5e0fa" wavePath="M0,24 Q20,10 40,14 T80,12 T100,8 L100,30 L0,30 Z"
          icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" /></svg>}
        />
      </Box>

      {/* ── Section Label ── */}
      <Flex align="center" gap="10px" mb="14px" fontSize="11px" fontWeight="800"
        letterSpacing="1.2px" textTransform="uppercase" color={C.muted} flexWrap="wrap">
        <Text>Report Records</Text>
        <Box flex="1" h="1px" bg={C.border} minW="20px" />
        <Text fontSize="10.5px" fontWeight="600" textTransform="none" letterSpacing="0.3px">
          Showing{' '}
          <Text as="strong" color={C.primary} fontWeight="700">{tableData.length}</Text>
          {' '}of {totalElements} entries
        </Text>
      </Flex>

      {/* ── Filter Bar ── */}
      <Flex bg="white" border="1px solid" borderColor={C.border} borderRadius="12px"
        p="10px 14px" mb="14px" align="center" gap="10px" flexWrap="wrap">
        <Flex flex="1" minW="220px" maxW="360px" align="center" gap="6px"
          bg={C.bg} border="1px solid" borderColor={C.border} borderRadius="8px" px="12px" h="34px">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={C.mid} strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.3-4.3" />
          </svg>
          <input
            placeholder="Search by subscriber, partner, cause…"
            value={search}
            onChange={handleSearch}
            style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: '12.5px', color: C.text }}
          />
        </Flex>

        <Box flex="1" />

        <Flex align="center" gap="6px">
          <Text fontSize="11px" color={C.muted} fontWeight="600">Display</Text>
          <Box
            as="select"
            fontSize="11.5px" fontWeight="700" color={C.text}
            bg={C.bg} border="1px solid" borderColor={C.border}
            borderRadius="6px" px="8px" h="30px" cursor="pointer"
            onChange={(e) => setPageSize(Number(e.target.value))}
            value={pageSize}
          >
            <option>10</option>
            <option>25</option>
            <option>50</option>
            <option>100</option>
          </Box>
          <Text fontSize="11px" color={C.muted} fontWeight="600">records</Text>
        </Flex>
      </Flex>

      {/* ── Table ── */}
      <Box overflowX="auto" pb="4px">
        <Box display="grid" gridTemplateColumns={TABLE_COL} gap="10px" alignItems="center"
          px="18px" mb="8px" minW={TABLE_MINW}
          fontSize="9.5px" fontWeight="800" letterSpacing="0.8px"
          textTransform="uppercase" color={C.muted}>
          <Text>Date</Text>
          <Text>Group</Text>
          <Text textAlign="right">Amount</Text>
          <Text textAlign="right">CGST</Text>
          <Text textAlign="right">SGST/UGST</Text>
          <Text textAlign="right">IGST</Text>
          <Text textAlign="right">KFC</Text>
          <Text textAlign="right">Total GST</Text>
          <Text>Taxpayer Type</Text>
          <Text textAlign="right">Total Amount</Text>
          <Text>Status</Text>
          <Text>Cause</Text>
          <Text>Subscriber</Text>
          <Text>Partner</Text>
          <Text>Partner Id</Text>
          <Text>Subscriber Id</Text>
          <Text>GSTIN</Text>
        </Box>

        <Flex direction="column" gap="8px">
          {tableData.length === 0 ? (
            <Flex bg="white" border="1px solid" borderColor={C.border} borderRadius="10px"
              px="18px" py="24px" justify="center" align="center" minW={TABLE_MINW}>
              <Text fontSize="13px" color={C.muted} fontStyle="italic">No data available in table</Text>
            </Flex>
          ) : (
            tableData.map((r, i) => (
              <Box key={i}
                display="grid" gridTemplateColumns={TABLE_COL} gap="10px" alignItems="center"
                bg="white" border="1px solid" borderColor={C.border} borderRadius="10px"
                px="18px" py="12px" cursor="pointer" minW={TABLE_MINW}
                transition="transform 0.15s, border-color 0.15s, box-shadow 0.15s"
                _hover={{ borderColor: C.primary, boxShadow: '0 4px 14px -6px rgba(107,26,61,.15)', transform: 'translateY(-1px)' }}
              >
                <Text fontSize="11.5px" color={C.text} fontWeight="600">{r.date}</Text>
                <Text fontSize="12px" color={C.text} fontWeight="700">{r.group}</Text>
                <Text textAlign="right" fontSize="12.5px" color={C.text} letterSpacing="-0.2px">{fmt(r.amount)}</Text>
                <Text textAlign="right" fontSize="12px" color="#5b8cb8" letterSpacing="-0.1px">{fmt(r.cgst)}</Text>
                <Text textAlign="right" fontSize="12px" color="#5b8cb8" letterSpacing="-0.1px">{fmt(r.sgst)}</Text>
                {r.igst != null
                  ? <Text textAlign="right" fontSize="12px" color="#5b8cb8">{fmt(r.igst)}</Text>
                  : <Na />}
                <Text textAlign="right" fontSize="12px" color="#9a7800" fontWeight="600" letterSpacing="-0.1px">{fmt(r.kfc)}</Text>
                <Text textAlign="right" fontSize="12px" color="#5b8cb8" letterSpacing="-0.1px">{fmt(r.totalGst)}</Text>
                {r.taxpayerType
                  ? <Text fontSize="11px" color={C.text}>{r.taxpayerType}</Text>
                  : <Na />}
                <Text textAlign="right" fontSize="13.5px" fontWeight="700" color="#1b6b3a" letterSpacing="-0.3px">{fmt(r.totalAmount)}</Text>
                <Box>
                  <Box display="inline-flex" alignItems="center" justifyContent="center"
                    px="10px" py="3px" borderRadius="5px"
                    fontSize="10.5px" fontWeight="800" letterSpacing="0.4px"
                    bg={r.status === 'Disbursed' ? '#d9f0e5' : '#fff0cf'}
                    color={r.status === 'Disbursed' ? '#1b6b3a' : '#9a7800'}>
                    {r.status}
                  </Box>
                </Box>
                <Text fontSize="11.5px" color={C.dark} fontWeight="500">{r.cause}</Text>
                <Text fontSize="11px" color={C.text}>{r.subscriber}</Text>
                <Text fontSize="12px" fontWeight="600" color={C.text}>{r.partner}</Text>
                <Text fontSize="11px" color={C.text}>{r.partnerId}</Text>
                <Text fontSize="11px" color={C.text}>{r.subscriberId}</Text>
                {r.gstin
                  ? <Text fontSize="11px" color={C.text}>{r.gstin}</Text>
                  : <Na />}
              </Box>
            ))
          )}
        </Flex>
      </Box>

      {/* ── Pagination ── */}
      <Box mt="14px">
        <ServerSidePagination onPageChange={handlePageChange} tableKey={TABLE_KEY} />
      </Box>

    </Box>
  );
};

export default OnePlusOneReport;
