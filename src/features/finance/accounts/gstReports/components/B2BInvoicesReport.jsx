import { Box, Flex, Text } from '@kfonbss/bss-ui-components';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { SERVER_SIDE_TABLE_KEYS } from '@/constants/server_table';
import { getServerSidePaginationResponse } from '@/features/others/Pagination/selectors';

import { fetchB2BInvoices } from '../action';
import { getB2BInvoices } from '../selector';

const C = {
  maroon: '#5c012e',
  maroon2: '#8d0247',
  yellow: '#ffd557',
  yellowBg: '#fff9e8',
  mint: '#5bbf95',
  mintSoft: '#d9f0e5',
  mintDeep: '#1b6b3a',
  tealSoft: '#d6f2f4',
  tealDeep: '#0c5a63',
  roseSoft: '#ffe5ec',
  roseDeep: '#a8284e',
  lavSoft: '#e5e0fa',
  lavDeep: '#4a3d8e',
  line: '#f0e4ea',
  paper: '#fbf7f5',
  ink: '#2b1a26',
  inkSoft: '#6f5e6a'
};
const TABLE_KEY = SERVER_SIDE_TABLE_KEYS.B2B_INVOICES_TABLE;
const PAGE_SIZE = 3;

const DISTRICTS = [
  { name: 'Thiruvananthapuram', count: 46 },
  { name: 'Kollam', count: 32 },
  { name: 'Pathanamthitta', count: 21 },
  { name: 'Alappuzha', count: 28 },
  { name: 'Kottayam', count: 34 },
  { name: 'Idukki', count: 18 },
  { name: 'Ernakulam', count: 52 },
  { name: 'Thrissur', count: 41 },
  { name: 'Palakkad', count: 36 },
  { name: 'Malappuram', count: 39 },
  { name: 'Kozhikode', count: 33 },
  { name: 'Wayanad', count: 14 },
  { name: 'Kannur', count: 27 },
  { name: 'Kasaragod', count: 17 }
];

const DUMMY = [
  {
    invDate: '01-Mar-26',
    invoiceNo: 'KFON03/26/001458',
    userId: 'kfon.hussainkutty',
    packageName: 'Pulse-MT · 3500 GB · 50 Mbps',
    partner: 'SDV COMMUNICATIONS',
    mode: 'LNP',
    fee: '449.00',
    gst: '80.82',
    total: '529.82',
    totalClass: 'mid'
  },
  {
    invDate: '01-Mar-26',
    invoiceNo: 'KFON03/26/001507',
    userId: 'kfon.ratheeshkk2982',
    packageName: 'Basic Plus · 3000 GB · 30 Mbps',
    partner: 'AKSHAYA CABLE VISION',
    mode: 'IKM',
    fee: '349.00',
    gst: '62.82',
    total: '411.82',
    totalClass: ''
  },
  {
    invDate: '01-Mar-26',
    invoiceNo: 'KFON03/26/001234',
    userId: 'kfon.techmotors',
    packageName: 'Turbo-MT · 4000 GB · 100 Mbps',
    partner: 'SRUTHI CABLE NETWORK',
    mode: 'HDFC',
    fee: '599.00',
    gst: '107.82',
    total: '706.82',
    totalClass: 'high'
  }
];

const MODE_PILL = {
  LNP: { bg: C.tealSoft, color: C.tealDeep },
  IKM: { bg: C.lavSoft, color: C.lavDeep },
  HDFC: { bg: C.roseSoft, color: C.roseDeep }
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

const B2BInvoicesReport = () => {
  const dispatch = useDispatch();
  const { data: records = [] } = useSelector(getB2BInvoices) || {};
  const paginationResp = useSelector(getServerSidePaginationResponse);
  const totalElements = paginationResp?.[TABLE_KEY]?.totalElements ?? 0;

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);

  useEffect(() => {
    dispatch(fetchB2BInvoices({ page, size: PAGE_SIZE, ...(search && { search }) }));
  }, [dispatch, page, search]);

  const displayRecords = records.length > 0 ? records : DUMMY;
  const total = records.length > 0 ? totalElements : 418;
  const totalPages = Math.ceil(total / PAGE_SIZE) || 1;

  const pageNums = (() => {
    const nums = Array.from({ length: totalPages }, (_, i) => i);
    if (totalPages <= 7) return nums;
    if (page < 4) return [...nums.slice(0, 5), '…', totalPages - 1];
    if (page > totalPages - 5) return [0, '…', ...nums.slice(totalPages - 5)];
    return [0, '…', page - 1, page, page + 1, '…', totalPages - 1];
  })();

  const COL = '90px 160px minmax(0,1.2fr) minmax(0,2fr) minmax(0,1.4fr) 70px 90px 90px 100px';
  const filters = ['LNP', 'IKM', 'HDFC'];

  return (
    <Box p='22px 26px 32px' bg={C.paper} minH='100vh'>
      <Box mb='18px'>
        <Text fontSize='28px' color={C.maroon} fontWeight='700' letterSpacing='-0.4px' mb='4px'>
          B2B Invoice Report
        </Text>
        <Text fontSize='12px' color={C.inkSoft}>
          Business-to-business subscriber invoices · Partner channel
        </Text>
      </Box>

      {/* KPIs */}
      <Box display='grid' gridTemplateColumns='repeat(4,1fr)' gap='14px' mb='18px'>
        {[
          { label: 'Total Invoices', val: '418', sub: 'March 2026' },
          { label: 'Package Fees', val: '₹1,397', sub: 'Pre-tax subtotal' },
          { label: 'GST Collected', val: '₹251.46', valColor: C.tealDeep, sub: 'CGST ₹125.73 · SGST ₹125.73' },
          { label: 'Total Invoice Amount', val: '₹1,648.46', sub: 'Incl. GST · All recharge modes', total: true }
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
            placeholder='Search by Invoice No, User ID, Partner ID…'
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
        <FilterDropdown options={filters} label='Mode' />
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
        <Text>Inv Date</Text>
        <Text>Invoice No.</Text>
        <Text>User ID</Text>
        <Text>Package</Text>
        <Text>Partner</Text>
        <Text>Mode</Text>
        <Text textAlign='right'>Fee (₹)</Text>
        <Text textAlign='right'>GST (₹)</Text>
        <Text textAlign='right'>Total (₹)</Text>
      </Box>

      {/* Rows */}
      <Flex direction='column' gap='10px'>
        {displayRecords.map((r, i) => (
          <Box
            key={r.invoiceNo || i}
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
              {r.invDate}
            </Text>
            <Text fontSize='13px' color={C.inkSoft}>
              {r.invoiceNo}
            </Text>
            <Text fontSize='12px' fontWeight='600' color={C.maroon} noOfLines={1}>
              {r.userId}
            </Text>
            <Text fontSize='12px' color={C.ink} noOfLines={1}>
              {r.packageName}
            </Text>
            <Text fontSize='13px' color={C.inkSoft} noOfLines={1}>
              {r.partner}
            </Text>
            <Pill label={r.mode} bg={MODE_PILL[r.mode]?.bg || C.line} color={MODE_PILL[r.mode]?.color || C.ink} />
            <Text textAlign='right' fontSize='12px' color={C.ink}>
              {r.fee}
            </Text>
            <Text textAlign='right' fontSize='12px' color={C.ink}>
              {r.gst}
            </Text>
            <Text
              textAlign='right'
              fontSize='13px'
              fontWeight='700'
              color={r.totalClass === 'high' ? C.mintDeep : r.totalClass === 'mid' ? '#9a7800' : C.ink}
            >
              {r.total}
            </Text>
          </Box>
        ))}
        {/* Footer total */}
        <Box
          display='grid'
          gridTemplateColumns={COL}
          gap='10px'
          alignItems='center'
          bg={C.yellowBg}
          border='1px dashed'
          borderColor={C.yellow}
          borderRadius='12px'
          px='18px'
          py='14px'
        >
          <Text gridColumn='1 / span 6' fontSize='12px' fontWeight='700' color={C.maroon}>
            Overall Total
          </Text>
          <Text textAlign='right' fontSize='12px' fontWeight='700' color={C.maroon}>
            1,397.00
          </Text>
          <Text textAlign='right' fontSize='12px' fontWeight='700' color={C.maroon}>
            251.46
          </Text>
          <Text textAlign='right' fontSize='13px' fontWeight='800' color={C.maroon}>
            1,648.46
          </Text>
        </Box>
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
          B2B invoices
        </Text>
        <Flex gap='6px' align='center'>
          <PgBtn onClick={() => setPage(0)} disabled={page === 0}>
            «
          </PgBtn>
          <PgBtn onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0}>
            ‹
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
            ›
          </PgBtn>
          <PgBtn onClick={() => setPage(totalPages - 1)} disabled={page >= totalPages - 1}>
            »
          </PgBtn>
        </Flex>
      </Flex>
    </Box>
  );
};

export default B2BInvoicesReport;
