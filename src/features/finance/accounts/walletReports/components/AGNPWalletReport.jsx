import { Box, Flex, Text } from '@kfonbss/bss-ui-components';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { SERVER_SIDE_TABLE_KEYS } from '@/constants/server_table';
import { getServerSidePaginationResponse } from '@/features/others/Pagination/selectors';

import { fetchAGNPWallet } from '../action';
import { getAGNPWallet } from '../selector';

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
  plumSoft: '#f5dae8',
  plumDeep: '#7a2d5a',
  line: '#f0e4ea',
  paper: '#fbf7f5',
  ink: '#2b1a26',
  inkSoft: '#6f5e6a'
};
const TABLE_KEY = SERVER_SIDE_TABLE_KEYS.AGNP_WALLET_REPORT_TABLE;
const PAGE_SIZE = 10;

const DISTRICTS = [
  { name: 'Thiruvananthapuram', count: 412 },
  { name: 'Kollam', count: 287 },
  { name: 'Pathanamthitta', count: 196 },
  { name: 'Alappuzha', count: 264 },
  { name: 'Kottayam', count: 308 },
  { name: 'Idukki', count: 178 },
  { name: 'Ernakulam', count: 421 },
  { name: 'Thrissur', count: 389 },
  { name: 'Palakkad', count: 356 },
  { name: 'Malappuram', count: 402 },
  { name: 'Kozhikode', count: 378 },
  { name: 'Wayanad', count: 142 },
  { name: 'Kannur', count: 314 },
  { name: 'Kasaragod', count: 195 }
];

const DIST_LEGEND = [
  { label: '₹1L+ (92)', color: C.mint },
  { label: '₹10K–1L (518)', color: C.amber },
  { label: '₹1–10K (2,593)', color: C.coral },
  { label: 'Zero (1,139)', color: C.slate }
];
const DIST_SEGS = [
  { pct: 2, color: C.mint },
  { pct: 12, color: C.amber },
  { pct: 60, color: C.coral },
  { pct: 26, color: C.slate }
];

const DUMMY = [
  {
    partnerId: '3232695004',
    companyName: 'KFON',
    pan: 'KTPPJ9041',
    gstin: '32AAHCK2529G1ZS',
    balance: '18,43,41,554.88',
    balClass: 'high',
    status: 'ACTIVE'
  },
  {
    partnerId: '3229641010',
    companyName: 'SRIT INDIA PVT LTD',
    pan: 'AAECS6273N',
    gstin: '32AAECS6273N1ZZ',
    balance: '5,18,21,492.58',
    balClass: 'high',
    status: 'ACTIVE'
  },
  {
    partnerId: '2501245051',
    companyName: 'NEXT TRILLION TECHNOLOGIES PVT LTD',
    pan: 'AAJCP5669A',
    gstin: '27AAJCP5669A1Z9',
    balance: '10,57,481.11',
    balClass: 'high',
    status: 'ACTIVE'
  },
  {
    partnerId: '5030530100',
    companyName: 'WE ONE TEAM LLP',
    pan: 'AAFFW3766J',
    gstin: '32AAFFW3766J1ZW',
    balance: '2,05,195.27',
    balClass: 'high',
    status: 'ACTIVE'
  },
  {
    partnerId: '7089678759',
    companyName: 'SRIT INDIA PRIVATE LIMITED',
    pan: 'AAECS6273N',
    gstin: '32AAECS6273N1ZZ',
    balance: '1,60,614.55',
    balClass: 'mid',
    status: 'ACTIVE'
  },
  {
    partnerId: '1367514031',
    companyName: 'ROHINI CABLE VISION',
    pan: 'AJSPP5647D',
    gstin: '—',
    balance: '733.92',
    balClass: 'low',
    status: 'LOW'
  },
  {
    partnerId: '7989540753',
    companyName: 'NITHYA CABLES',
    pan: 'ASXPM0148E',
    gstin: '—',
    balance: '733.26',
    balClass: 'low',
    status: 'LOW'
  },
  {
    partnerId: '1215645477',
    companyName: 'GKMS CABLE TV NETWORK',
    pan: 'AMGPM0852L',
    gstin: '—',
    balance: '732.35',
    balClass: 'low',
    status: 'LOW'
  },
  {
    partnerId: '5509613299',
    companyName: 'PRIYAM CHANNELS',
    pan: 'BAWPK1679Q',
    gstin: '—',
    balance: '0.00',
    balClass: 'zero',
    status: 'ZERO'
  },
  {
    partnerId: '6038423691',
    companyName: 'CHOICE CABLE NETWORK',
    pan: 'APEPS4724A',
    gstin: '—',
    balance: '0.00',
    balClass: 'zero',
    status: 'ZERO'
  }
];

const BAL_COLOR = { high: C.mintDeep, mid: C.amberDeep, low: C.coralDeep, zero: C.inkSoft };
const STATUS_PILL = {
  ACTIVE: { bg: C.mintSoft, color: C.mintDeep },
  LOW: { bg: C.amberSoft, color: C.amberDeep },
  ZERO: { bg: C.coralSoft, color: C.coralDeep }
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

const AGNPWalletReport = () => {
  const dispatch = useDispatch();
  const { data: records = [] } = useSelector(getAGNPWallet) || {};
  const paginationResp = useSelector(getServerSidePaginationResponse);
  const totalElements = paginationResp?.[TABLE_KEY]?.totalElements ?? 0;

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);

  useEffect(() => {
    dispatch(fetchAGNPWallet({ page, size: PAGE_SIZE, ...(search && { search }) }));
  }, [dispatch, page, search]);

  const displayRecords = records.length > 0 ? records : DUMMY;
  const total = records.length > 0 ? totalElements : 4342;
  const totalPages = Math.ceil(total / PAGE_SIZE) || 1;

  const pageNums = (() => {
    const nums = Array.from({ length: totalPages }, (_, i) => i);
    if (totalPages <= 7) return nums;
    if (page < 4) return [...nums.slice(0, 5), '…', totalPages - 1];
    if (page > totalPages - 5) return [0, '…', ...nums.slice(totalPages - 5)];
    return [0, '…', page - 1, page, page + 1, '…', totalPages - 1];
  })();

  const COL = '130px minmax(0,2fr) 60px 110px 150px minmax(0,1.2fr) 80px';
  const filters = ['Funded', 'Zero Balance', 'High Value'];

  return (
    <Box p='22px 26px 32px' bg={C.paper} minH='100vh'>
      <Flex mb='18px' align='flex-end' justify='space-between'>
        <Box>
          <Text fontSize='28px' color={C.maroon} fontWeight='700' letterSpacing='-0.4px' mb='4px'>
            AGNP Virtual Wallet Balance
          </Text>
          <Text fontSize='12px' color={C.inkSoft}>
            Aggregator Network Partners · Last updated 24 Apr 2026, 14:32 IST
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
          >
            ↓ Download CSV
          </Box>
        </Flex>
      </Flex>

      {/* KPIs */}
      <Box display='grid' gridTemplateColumns='repeat(4,1fr)' gap='14px' mb='18px'>
        {[
          {
            icon: '◆',
            iBg: C.plumSoft,
            iC: C.plumDeep,
            label: 'Total AGNP Partners',
            val: '4,342',
            sub: 'Aggregator network'
          },
          {
            icon: '✓',
            iBg: C.mintSoft,
            iC: C.mintDeep,
            label: 'Funded Wallets',
            val: '3,203',
            sub: '73.8% of partners'
          },
          { icon: '○', iBg: C.coralSoft, iC: C.coralDeep, label: 'Zero Balance', val: '1,139', sub: 'Top-up required' },
          {
            icon: '₹',
            iBg: C.yellow,
            iC: C.maroon,
            label: 'Total Balance',
            val: '₹24,76,39,575',
            sub: 'GST incl. · ₹24.76 Cr',
            total: true
          }
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
            <Text fontSize={k.total ? '20px' : '26px'} fontWeight='700' color={C.maroon} lineHeight='1'>
              {k.val}
            </Text>
            <Text fontSize='11px' color={C.inkSoft} mt='6px'>
              {k.sub}
            </Text>
          </Box>
        ))}
      </Box>

      {/* Balance Distribution */}
      <Box bg='white' border='1px solid' borderColor={C.line} borderRadius='14px' p='14px 18px' mb='18px'>
        <Flex align='center' gap='20px'>
          <Text
            fontSize='12px'
            fontWeight='700'
            color={C.maroon2}
            textTransform='uppercase'
            letterSpacing='0.5px'
            whiteSpace='nowrap'
          >
            Balance Distribution
          </Text>
          <Flex flex='1' h='10px' borderRadius='6px' overflow='hidden'>
            {DIST_SEGS.map((s, i) => (
              <Box key={i} h='100%' w={`${s.pct}%`} bg={s.color} />
            ))}
          </Flex>
          <Flex gap='14px' fontSize='11px' color={C.inkSoft} flexShrink={0} flexWrap='wrap'>
            {DIST_LEGEND.map((d, i) => (
              <Flex key={i} align='center' gap='5px'>
                <Box w='8px' h='8px' borderRadius='50%' bg={d.color} flexShrink={0} />
                <Text>{d.label}</Text>
              </Flex>
            ))}
          </Flex>
        </Flex>
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
            placeholder='Search by Partner ID, Company Name, PAN…'
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
        {displayRecords.map((r, i) => (
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
              {r.companyName}
            </Text>
            <Pill label='AGNP' bg={C.plumSoft} color={C.plumDeep} />
            <Text fontSize='13px' color={C.inkSoft}>
              {r.pan}
            </Text>
            <Text fontSize='13px' color={C.inkSoft}>
              {r.gstin}
            </Text>
            <Text textAlign='right' fontSize='13px' fontWeight='700' color={BAL_COLOR[r.balClass] || C.ink}>
              ₹{r.balance}
            </Text>
            <Pill
              label={r.status}
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

export default AGNPWalletReport;
