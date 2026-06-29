import { Box, Flex, Text } from '@kfonbss/bss-ui-components';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { SERVER_SIDE_TABLE_KEYS } from '@/constants/server_table';
import { getServerSidePaginationResponse } from '@/features/others/Pagination/selectors';

import { fetchPartnerRecharge } from '../action';
import { getPartnerRecharge } from '../selector';

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
  roseSoft: '#ffe5ec',
  roseDeep: '#a8284e',
  lavSoft: '#e5e0fa',
  lavDeep: '#4a3d8e',
  line: '#f0e4ea',
  paper: '#fbf7f5',
  ink: '#2b1a26',
  inkSoft: '#6f5e6a'
};
const TABLE_KEY = SERVER_SIDE_TABLE_KEYS.PARTNER_RECHARGE_REPORT_TABLE;
const PAGE_SIZE = 4;

const DISTRICTS = [
  { name: 'Thiruvananthapuram', count: 32 },
  { name: 'Kollam', count: 24 },
  { name: 'Pathanamthitta', count: 18 },
  { name: 'Alappuzha', count: 26 },
  { name: 'Kottayam', count: 28 },
  { name: 'Idukki', count: 17 },
  { name: 'Ernakulam', count: 38 },
  { name: 'Thrissur', count: 31 },
  { name: 'Palakkad', count: 29 },
  { name: 'Malappuram', count: 30 },
  { name: 'Kozhikode', count: 27 },
  { name: 'Wayanad', count: 12 },
  { name: 'Kannur', count: 22 },
  { name: 'Kasaragod', count: 8 }
];

const DUMMY = [
  {
    partnerId: '8197334772',
    partnerName: 'DAS CABLE NETWORK',
    district: 'Alappuzha',
    initiated: '22-04-26 17:23',
    orderId: 'UVE57AXA364172338',
    gateway: 'HDFC',
    pgRef: '—',
    amount: '400.00',
    status: 'PENDING'
  },
  {
    partnerId: '6599696847',
    partnerName: 'SUN SHINE CABLE NETWORK',
    district: 'Idukki',
    initiated: '22-04-26 17:23',
    orderId: 'BYW70ZA2186172335',
    gateway: 'HDFC',
    pgRef: '—',
    amount: '200.00',
    status: 'PENDING'
  },
  {
    partnerId: '2306213782',
    partnerName: 'ORBIT 2 CABLE TV NETWORK',
    district: 'Alappuzha',
    initiated: '22-04-26 17:19',
    orderId: '2E3202UW636171927',
    gateway: 'HDFC',
    pgRef: '1.14E+11',
    amount: '1,000.00',
    status: 'SUCCESS'
  },
  {
    partnerId: '4715194728',
    partnerName: 'MOONSTAR CABLE VISION',
    district: 'Kollam',
    initiated: '22-04-26 17:16',
    orderId: 'BUV382UV816171557',
    gateway: 'IKM',
    pgRef: 'PG100242604225177',
    amount: '1,000.00',
    status: 'SUCCESS'
  }
];

const GW_PILL = {
  HDFC: { bg: C.roseSoft, color: C.roseDeep },
  IKM: { bg: C.lavSoft, color: C.lavDeep }
};
const STATUS_PILL = {
  SUCCESS: { bg: C.mintSoft, color: C.mintDeep },
  PENDING: { bg: C.amberSoft, color: C.amberDeep }
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
    whiteSpace='nowrap'
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

const DistrictDropdown = ({ districts }) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState([]);
  const [q, setQ] = useState('');
  const ref = useRef(null);

  useEffect(() => {
    const h = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const filtered = districts.filter((d) => d.name.toLowerCase().includes(q.toLowerCase()));
  const toggle = (name) => setSelected((s) => (s.includes(name) ? s.filter((x) => x !== name) : [...s, name]));
  const label =
    selected.length === 0
      ? '📍 District: All'
      : selected.length === 1
        ? `📍 ${selected[0]}`
        : `📍 District (${selected.length})`;

  return (
    <Box ref={ref} position='relative'>
      <Box
        as='button'
        onClick={() => setOpen((o) => !o)}
        fontSize='12px'
        fontWeight='600'
        px='12px'
        h='36px'
        border='1px solid'
        borderColor={open ? C.maroon : C.line}
        borderRadius='8px'
        bg={open ? C.maroon : 'white'}
        color={open ? 'white' : C.ink}
        display='flex'
        alignItems='center'
        gap='6px'
        cursor='pointer'
      >
        {label}{' '}
        <Text as='span' opacity={0.5} fontSize='10px'>
          ▾
        </Text>
      </Box>
      {open && (
        <Box
          position='absolute'
          top='calc(100% + 6px)'
          left='0'
          bg='white'
          border='1px solid'
          borderColor={C.line}
          borderRadius='10px'
          zIndex={30}
          p='10px'
          w='260px'
          boxShadow='0 8px 24px rgba(74,15,42,.12)'
        >
          <Box
            as='input'
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder='Search district…'
            fontSize='12px'
            w='100%'
            px='10px'
            py='7px'
            border='1px solid'
            borderColor={C.line}
            borderRadius='6px'
            bg={C.paper}
            mb='8px'
            display='block'
            outline='none'
          />
          <Box maxH='240px' overflowY='auto'>
            {filtered.map((d) => (
              <Flex
                key={d.name}
                as='label'
                align='center'
                gap='9px'
                px='10px'
                py='7px'
                borderRadius='6px'
                fontSize='12px'
                cursor='pointer'
                color={C.ink}
                _hover={{ bg: C.yellowBg }}
              >
                <input
                  type='checkbox'
                  checked={selected.includes(d.name)}
                  onChange={() => toggle(d.name)}
                  style={{ accentColor: C.maroon, cursor: 'pointer' }}
                />
                <Text flex='1'>{d.name}</Text>
                <Text fontSize='10px' color={C.inkSoft} fontWeight='600'>
                  {d.count}
                </Text>
              </Flex>
            ))}
          </Box>
          <Flex justify='space-between' pt='8px' mt='6px' borderTop='1px solid' borderColor={C.line} fontSize='11px'>
            <Text
              as='button'
              border='none'
              bg='transparent'
              color={C.maroon2}
              fontWeight='700'
              cursor='pointer'
              onClick={() => setSelected([])}
            >
              Clear all
            </Text>
            <Text
              as='button'
              border='none'
              bg='transparent'
              color={C.maroon2}
              fontWeight='700'
              cursor='pointer'
              onClick={() => setOpen(false)}
            >
              Apply
            </Text>
          </Flex>
        </Box>
      )}
    </Box>
  );
};

const FilterDropdown = ({ options, label }) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState([]);
  const ref = useRef(null);

  useEffect(() => {
    const h = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const toggle = (val) => setSelected((s) => (s.includes(val) ? s.filter((x) => x !== val) : [...s, val]));
  const btnLabel =
    selected.length === 0
      ? `⊟ ${label}: All`
      : selected.length === 1
        ? `⊟ ${selected[0]}`
        : `⊟ ${label} (${selected.length})`;

  return (
    <Box ref={ref} position='relative'>
      <Box
        as='button'
        onClick={() => setOpen((o) => !o)}
        fontSize='12px'
        fontWeight='600'
        px='12px'
        h='36px'
        border='1px solid'
        borderColor={open ? C.maroon : C.line}
        borderRadius='8px'
        bg={open ? C.maroon : 'white'}
        color={open ? 'white' : C.ink}
        display='flex'
        alignItems='center'
        gap='6px'
        cursor='pointer'
      >
        {btnLabel}{' '}
        <Text as='span' opacity={0.5} fontSize='10px'>
          ▾
        </Text>
      </Box>
      {open && (
        <Box
          position='absolute'
          top='calc(100% + 6px)'
          left='0'
          bg='white'
          border='1px solid'
          borderColor={C.line}
          borderRadius='10px'
          zIndex={30}
          p='10px'
          w='220px'
          boxShadow='0 8px 24px rgba(74,15,42,.12)'
        >
          <Box maxH='240px' overflowY='auto'>
            {options.map((opt) => (
              <Flex
                key={opt}
                as='label'
                align='center'
                gap='9px'
                px='10px'
                py='7px'
                borderRadius='6px'
                fontSize='12px'
                cursor='pointer'
                color={C.ink}
                _hover={{ bg: C.yellowBg }}
              >
                <input
                  type='checkbox'
                  checked={selected.includes(opt)}
                  onChange={() => toggle(opt)}
                  style={{ accentColor: C.maroon, cursor: 'pointer' }}
                />
                <Text flex='1'>{opt}</Text>
              </Flex>
            ))}
          </Box>
          <Flex justify='space-between' pt='8px' mt='6px' borderTop='1px solid' borderColor={C.line} fontSize='11px'>
            <Text
              as='button'
              border='none'
              bg='transparent'
              color={C.maroon2}
              fontWeight='700'
              cursor='pointer'
              onClick={() => setSelected([])}
            >
              Clear all
            </Text>
            <Text
              as='button'
              border='none'
              bg='transparent'
              color={C.maroon2}
              fontWeight='700'
              cursor='pointer'
              onClick={() => setOpen(false)}
            >
              Apply
            </Text>
          </Flex>
        </Box>
      )}
    </Box>
  );
};

const PartnerRechargeReport = () => {
  const dispatch = useDispatch();
  const { data: records = [] } = useSelector(getPartnerRecharge) || {};
  const paginationResp = useSelector(getServerSidePaginationResponse);
  const totalElements = paginationResp?.[TABLE_KEY]?.totalElements ?? 0;

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [activeRange, setActiveRange] = useState('Today');

  useEffect(() => {
    dispatch(fetchPartnerRecharge({ page, size: PAGE_SIZE, ...(search && { search }) }));
  }, [dispatch, page, search]);

  const displayRecords = records.length > 0 ? records : DUMMY;
  const total = records.length > 0 ? totalElements : 342;
  const totalPages = Math.ceil(total / PAGE_SIZE) || 1;

  const pageNums = (() => {
    const nums = Array.from({ length: totalPages }, (_, i) => i);
    if (totalPages <= 7) return nums;
    if (page < 4) return [...nums.slice(0, 5), '…', totalPages - 1];
    if (page > totalPages - 5) return [0, '…', ...nums.slice(totalPages - 5)];
    return [0, '…', page - 1, page, page + 1, '…', totalPages - 1];
  })();

  const COL = '100px minmax(0,1.8fr) 120px 130px minmax(0,1.6fr) 70px minmax(0,1.2fr) 90px 90px';
  const ranges = ['Today', 'This Week', 'This Month', 'This Year'];
  const filters = ['Success', 'Pending', 'HDFC', 'IKM'];

  return (
    <Box p='22px 26px 32px' bg={C.paper} minH='100vh'>
      <Box mb='18px'>
        <Text fontSize='28px' color={C.maroon} fontWeight='700' letterSpacing='-0.4px' mb='4px'>
          Partner Wallet Recharge
        </Text>
        <Text fontSize='12px' color={C.inkSoft}>
          LNP/AGNP partner wallet top-up transactions · Payment gateway logs
        </Text>
      </Box>

      {/* KPIs */}
      <Box display='grid' gridTemplateColumns='repeat(4,1fr)' gap='14px' mb='18px'>
        {[
          { label: 'Total Transactions', val: '342', sub: 'Last 24 hours' },
          { label: 'Successful', val: '268', valColor: C.mintDeep, sub: '78.4% success rate' },
          { label: 'Pending', val: '74', valColor: C.amberDeep, sub: 'Awaiting gateway confirm' },
          { label: 'Total Recharged', val: '₹3,84,600', sub: 'Successful top-ups only', total: true }
        ].map((k, i) => (
          <Box
            key={i}
            bg={k.total ? C.yellowBg : 'white'}
            border='1px solid'
            borderColor={k.total ? C.yellow : C.line}
            borderRadius='14px'
            p='16px'
            position='relative'
            overflow='hidden'
          >
            {k.total && (
              <Box
                position='absolute'
                top='-20px'
                right='-20px'
                w='80px'
                h='80px'
                borderRadius='50%'
                style={{ background: 'radial-gradient(circle,rgba(255,213,87,.4),transparent 70%)' }}
                pointerEvents='none'
              />
            )}
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
            <Text fontSize={k.total ? '22px' : '26px'} fontWeight='700' color={k.valColor || C.maroon} lineHeight='1'>
              {k.val}
            </Text>
            <Text fontSize='11px' color={C.inkSoft} mt='6px'>
              {k.sub}
            </Text>
          </Box>
        ))}
      </Box>

      {/* Filter Bar */}
      <Flex
        bg='white'
        border='1px solid'
        borderColor={C.line}
        borderRadius='12px'
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
            placeholder='Search by Partner ID, Name, Order ID, PG Ref…'
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
              fontSize: '12px',
              color: C.ink
            }}
          />
          {search && (
            <Box
              as='button'
              border='none'
              bg='transparent'
              cursor='pointer'
              color={C.inkSoft}
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
        {/* Date range pills */}
        <Flex border='1px solid' borderColor={C.line} borderRadius='8px' bg='white' p='3px' gap='2px'>
          {ranges.map((r) => (
            <Box
              key={r}
              as='button'
              px='11px'
              h='30px'
              borderRadius='6px'
              border='none'
              bg={activeRange === r ? C.maroon : 'transparent'}
              color={activeRange === r ? 'white' : C.inkSoft}
              fontSize='11px'
              fontWeight='600'
              cursor='pointer'
              onClick={() => setActiveRange(r)}
            >
              {r}
            </Box>
          ))}
        </Flex>
        <DistrictDropdown districts={DISTRICTS} />
        <FilterDropdown options={filters} label='Status' />
        <Box flex='1' />
        <Box
          as='button'
          px='12px'
          h='32px'
          borderRadius='8px'
          border='1px solid'
          borderColor={C.yellow}
          bg={C.yellow}
          color={C.maroon}
          fontSize='11px'
          fontWeight='700'
          cursor='pointer'
        >
          ⎙ Export
        </Box>
      </Flex>

      {/* Table Header */}
      <Box
        display='grid'
        gridTemplateColumns={COL}
        gap='10px'
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
        <Text>Partner Name</Text>
        <Text>District</Text>
        <Text>Initiated</Text>
        <Text>BSS Order ID</Text>
        <Text>Gateway</Text>
        <Text>PG Ref No.</Text>
        <Text textAlign='right'>Amount (₹)</Text>
        <Text>Status</Text>
      </Box>

      {/* Rows */}
      <Flex direction='column' gap='10px'>
        {displayRecords.map((r, i) => (
          <Box
            key={r.partnerId || i}
            display='grid'
            gridTemplateColumns={COL}
            gap='10px'
            alignItems='center'
            bg='white'
            borderRadius='12px'
            px='18px'
            py='14px'
            boxShadow='0 1px 2px rgba(74,15,42,.04),0 0 0 1px #f0e4ea'
            transition='all 0.18s ease'
            _hover={{ boxShadow: '0 4px 14px rgba(74,15,42,.08),0 0 0 1px #ffd557' }}
          >
            <Text fontSize='13px' color={C.inkSoft}>
              {r.partnerId}
            </Text>
            <Text fontSize='12px' fontWeight='600' color={C.maroon} noOfLines={1}>
              {r.partnerName}
            </Text>
            <Text fontSize='12px' color={C.ink}>
              {r.district}
            </Text>
            <Text fontSize='13px' color={C.inkSoft}>
              {r.initiated}
            </Text>
            <Text fontSize='13px' color={C.inkSoft} noOfLines={1}>
              {r.orderId}
            </Text>
            <Pill label={r.gateway} bg={GW_PILL[r.gateway]?.bg || C.line} color={GW_PILL[r.gateway]?.color || C.ink} />
            <Text fontSize='13px' color={C.inkSoft} noOfLines={1}>
              {r.pgRef}
            </Text>
            <Text
              textAlign='right'
              fontSize='13px'
              fontWeight='700'
              color={r.status === 'SUCCESS' ? C.mintDeep : C.ink}
            >
              {r.amount}
            </Text>
            <Pill
              label={r.status === 'SUCCESS' ? '✓ SUCCESS' : '● PENDING'}
              bg={STATUS_PILL[r.status]?.bg || C.line}
              color={STATUS_PILL[r.status]?.color || C.ink}
            />
          </Box>
        ))}
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
            1–{displayRecords.length}
          </Text>{' '}
          of{' '}
          <Text as='strong' color={C.maroon} fontWeight='700'>
            {total}
          </Text>{' '}
          transactions
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

export default PartnerRechargeReport;
