import { Box, Flex, Text } from '@kfonbss/bss-ui-components';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { SERVER_SIDE_TABLE_KEYS } from '@/constants/server_table';
import { getServerSidePaginationResponse } from '@/features/others/Pagination/selectors';

import { fetchGSTR1Report } from '../action';
import { getGSTR1Report } from '../selector';

const C = {
  maroon: '#5c012e',
  maroon2: '#8d0247',
  yellow: '#ffd557',
  yellowBg: '#fff9e8',
  mint: '#5bbf95',
  mintSoft: '#d9f0e5',
  mintDeep: '#1b6b3a',
  lavSoft: '#e5e0fa',
  lavDeep: '#4a3d8e',
  line: '#f0e4ea',
  paper: '#fbf7f5',
  ink: '#2b1a26',
  inkSoft: '#6f5e6a'
};
const TABLE_KEY = SERVER_SIDE_TABLE_KEYS.GSTR1_REPORT_TABLE;
const PAGE_SIZE = 8;

const MONTHS = [
  { label: 'Mar 2026', count: 418 },
  { label: 'Feb 2026', count: 402 },
  { label: 'Jan 2026', count: 395 },
  { label: 'Dec 2025', count: 387 },
  { label: 'Nov 2025', count: 372 },
  { label: 'Oct 2025', count: 361 }
];

const DUMMY = [
  {
    month: 'Mar-26',
    category: 'B2B',
    gstin: '32AABCY7102R1Z2',
    docNo: 'KFON03/26/000137',
    docDate: '01-03-26',
    taxable: '399.00',
    cgst: '35.91',
    sgst: '35.91',
    totalGst: '71.82',
    docValue: '470.82',
    type: 'REGULAR'
  },
  {
    month: 'Mar-26',
    category: 'B2B',
    gstin: '32AAKCK0778J1ZB',
    docNo: 'KFON03/26/000809',
    docDate: '01-03-26',
    taxable: '499.00',
    cgst: '44.91',
    sgst: '44.91',
    totalGst: '89.82',
    docValue: '588.82',
    type: 'REGULAR'
  },
  {
    month: 'Mar-26',
    category: 'B2B',
    gstin: '32DZFPS4600M1Z8',
    docNo: 'KFON03/26/001047',
    docDate: '01-03-26',
    taxable: '299.00',
    cgst: '26.91',
    sgst: '26.91',
    totalGst: '53.82',
    docValue: '352.82',
    type: 'REGULAR'
  },
  {
    month: 'Mar-26',
    category: 'B2B',
    gstin: '32BLWPV8355D1ZH',
    docNo: 'KFON03/26/001234',
    docDate: '01-03-26',
    taxable: '599.00',
    cgst: '53.91',
    sgst: '53.91',
    totalGst: '107.82',
    docValue: '706.82',
    type: 'REGULAR'
  },
  {
    month: 'Mar-26',
    category: 'B2B',
    gstin: '32AAMPH3758C1ZY',
    docNo: 'KFON03/26/001458',
    docDate: '01-03-26',
    taxable: '449.00',
    cgst: '40.41',
    sgst: '40.41',
    totalGst: '80.82',
    docValue: '529.82',
    type: 'REGULAR'
  },
  {
    month: 'Mar-26',
    category: 'B2B',
    gstin: '32QFJPK4287R1ZB',
    docNo: 'KFON03/26/001507',
    docDate: '01-03-26',
    taxable: '349.00',
    cgst: '31.41',
    sgst: '31.41',
    totalGst: '62.82',
    docValue: '411.82',
    type: 'REGULAR'
  },
  {
    month: 'Mar-26',
    category: 'B2B',
    gstin: '32AMAPC0258J1ZM',
    docNo: 'KFON03/26/002900',
    docDate: '02-03-26',
    taxable: '999.00',
    cgst: '89.91',
    sgst: '89.91',
    totalGst: '179.82',
    docValue: '1,178.82',
    type: 'REGULAR'
  },
  {
    month: 'Mar-26',
    category: 'B2B',
    gstin: '32GUPPK3573K1Z3',
    docNo: 'KFON03/26/003368',
    docDate: '02-03-26',
    taxable: '299.00',
    cgst: '26.91',
    sgst: '26.91',
    totalGst: '53.82',
    docValue: '352.82',
    type: 'REGULAR'
  }
];

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

const MonthDropdown = ({ months }) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(['Mar 2026']);
  const [q, setQ] = useState('');
  const ref = useRef(null);

  useEffect(() => {
    const h = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const filtered = months.filter((m) => m.label.toLowerCase().includes(q.toLowerCase()));
  const toggle = (label) => setSelected((s) => (s.includes(label) ? s.filter((x) => x !== label) : [...s, label]));
  const btnLabel =
    selected.length === 0
      ? '📅 Month: All'
      : selected.length === 1
        ? `📅 ${selected[0]}`
        : `📅 Month (${selected.length})`;

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
          <Box
            as='input'
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder='Search month…'
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
          <Box maxH='200px' overflowY='auto'>
            {filtered.map((m) => (
              <Flex
                key={m.label}
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
                  checked={selected.includes(m.label)}
                  onChange={() => toggle(m.label)}
                  style={{ accentColor: C.maroon, cursor: 'pointer' }}
                />
                <Text flex='1'>{m.label}</Text>
                <Text fontSize='10px' color={C.inkSoft} fontWeight='600'>
                  {m.count}
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

const GSTR1Report = () => {
  const dispatch = useDispatch();
  const { data: records = [] } = useSelector(getGSTR1Report) || {};
  const paginationResp = useSelector(getServerSidePaginationResponse);
  const totalElements = paginationResp?.[TABLE_KEY]?.totalElements ?? 0;

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);

  useEffect(() => {
    dispatch(fetchGSTR1Report({ page, size: PAGE_SIZE, ...(search && { search }) }));
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

  const COL = '70px 70px 150px 150px 90px 90px 80px 80px 90px 100px 80px';
  const filters = ['B2B', 'B2C', 'Home Subscriber'];

  return (
    <Box p='22px 26px 32px' bg={C.paper} minH='100vh'>
      <Box mb='18px'>
        <Text fontSize='28px' color={C.maroon} fontWeight='700' letterSpacing='-0.4px' mb='4px'>
          GSTR-1 Outward Supply Report
        </Text>
        <Text fontSize='12px' color={C.inkSoft}>
          Monthly outward supplies · B2B invoices filed with GSTN
        </Text>
      </Box>

      {/* KPIs */}
      <Box display='grid' gridTemplateColumns='repeat(4,1fr)' gap='14px' mb='18px'>
        {[
          { label: 'Total Invoices', val: '418', sub: 'March 2026' },
          { label: 'Taxable Value', val: '₹2,14,850', sub: 'Pre-GST amount' },
          { label: 'IRN Generated', val: '418', valColor: C.mintDeep, sub: '100% e-invoiced' },
          { label: 'Total GST Collected', val: '₹38,673', sub: 'CGST + SGST · Intra-state', total: true }
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
            placeholder='Search by Doc No, GSTIN, User Name, IRN…'
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
        <MonthDropdown months={MONTHS} />
        <FilterDropdown options={filters} label='Type' />
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

      {/* Scrollable table */}
      <Box overflowX='auto'>
        {/* Header */}
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
          minW='1100px'
        >
          <Text>Month</Text>
          <Text>Category</Text>
          <Text>GSTIN</Text>
          <Text>Doc No.</Text>
          <Text>Doc Date</Text>
          <Text textAlign='right'>Taxable (₹)</Text>
          <Text textAlign='right'>CGST (₹)</Text>
          <Text textAlign='right'>SGST (₹)</Text>
          <Text textAlign='right'>Total GST (₹)</Text>
          <Text textAlign='right'>Doc Value (₹)</Text>
          <Text>Type</Text>
        </Box>

        {/* Rows */}
        <Flex direction='column' gap='10px' minW='1100px'>
          {displayRecords.map((r, i) => (
            <Box
              key={r.docNo || i}
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
                {r.month}
              </Text>
              <Pill label={r.category} bg={C.lavSoft} color={C.lavDeep} />
              <Text fontSize='13px' color={C.inkSoft} noOfLines={1}>
                {r.gstin}
              </Text>
              <Text fontSize='13px' color={C.inkSoft}>
                {r.docNo}
              </Text>
              <Text fontSize='13px' color={C.inkSoft}>
                {r.docDate}
              </Text>
              <Text textAlign='right' fontSize='12px' fontWeight='600' color={C.ink}>
                {r.taxable}
              </Text>
              <Text textAlign='right' fontSize='12px' color={C.ink}>
                {r.cgst}
              </Text>
              <Text textAlign='right' fontSize='12px' color={C.ink}>
                {r.sgst}
              </Text>
              <Text textAlign='right' fontSize='12px' fontWeight='600' color={C.ink}>
                {r.totalGst}
              </Text>
              <Text textAlign='right' fontSize='12px' fontWeight='700' color={C.mintDeep}>
                {r.docValue}
              </Text>
              <Pill label={r.type} bg={C.mintSoft} color={C.mintDeep} />
            </Box>
          ))}
        </Flex>
      </Box>

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
          invoices · Place of Supply: Kerala
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

export default GSTR1Report;
