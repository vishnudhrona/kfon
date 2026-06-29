import { Box, Flex, Text } from '@kfonbss/bss-ui-components';
import { useState } from 'react';

import CsvDownloadBtn from '@/components/custom/CsvDownloadBtn';

/* ─── Design tokens ─── */
const C = {
  primary: '#6b1a3d',
  dark: '#5a1433',
  mid2: '#7a2147',
  border: '#f0e4ea',
  bg: '#fbf7f5',
  text: '#2b1a26',
  mid: '#6f5e6a',
  muted: '#a898a0',
  yellow: '#ffd557',
  yBg: '#fff9e8',
  yBorder: '#fdf3c8'
};

/* ─── Static mock data ─── */
const REVENUE_SOURCES = [
  {
    id: 'retail',
    label: 'Retail',
    sub: 'Home Broadband',
    icColor: '#e94e77',
    chip: null,
    chipBg: null,
    chipColor: null,
    revenue: '42,18,750',
    gst: '7,59,375',
    period: 'Apr 26',
    wavePath: 'M0,22 Q15,8 30,16 T60,10 T100,6 L100,30 L0,30 Z',
    waveFill: '#ffe5ec',
    icon: (
      <svg viewBox='0 0 24 24' fill='none' stroke='white' strokeWidth='2' width='15' height='15'>
        <path d='M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z' />
        <path d='M3 6h18' />
        <path d='M16 10a4 4 0 01-8 0' />
      </svg>
    )
  },
  {
    id: 'ews',
    label: 'EWS',
    sub: 'Free / Subsidised',
    icColor: '#2fb8c6',
    chip: null,
    chipBg: null,
    chipColor: null,
    revenue: '18,64,200',
    gst: '3,35,556',
    period: 'Apr 26',
    wavePath: 'M0,20 Q20,12 40,16 T80,8 T100,6 L100,30 L0,30 Z',
    waveFill: '#d6f2f4',
    icon: (
      <svg viewBox='0 0 24 24' fill='none' stroke='white' strokeWidth='2' width='15' height='15'>
        <path d='M12 2L2 7l10 5 10-5-10-5z' />
        <path d='M2 17l10 5 10-5' />
        <path d='M2 12l10 5 10-5' />
      </svg>
    )
  },
  {
    id: 'bpl',
    label: 'BPL',
    sub: 'Below Poverty Line',
    icColor: '#5bbf95',
    chip: null,
    chipBg: null,
    chipColor: null,
    revenue: '8,92,400',
    gst: '1,60,632',
    period: 'Apr 26',
    wavePath: 'M0,22 Q25,14 50,18 T100,12 L100,30 L0,30 Z',
    waveFill: '#d9f0e5',
    icon: (
      <svg viewBox='0 0 24 24' fill='none' stroke='white' strokeWidth='2' width='15' height='15'>
        <path d='M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z' />
      </svg>
    )
  },
  {
    id: 'dark_fibre',
    label: 'Dark Fibre',
    sub: 'Leased capacity',
    icColor: '#5b6e8b',
    chip: null,
    chipBg: null,
    chipColor: null,
    revenue: '65,80,200',
    gst: '11,84,436',
    period: 'Apr 26',
    wavePath: 'M0,20 Q25,10 50,14 T100,8 L100,30 L0,30 Z',
    waveFill: '#dde3ed',
    icon: (
      <svg viewBox='0 0 24 24' fill='none' stroke='white' strokeWidth='2' width='15' height='15'>
        <path d='M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83' />
      </svg>
    )
  },
  {
    id: 'enterprise_govt',
    label: 'Enterprise',
    sub: 'Government clients',
    icColor: '#8b7fd6',
    chip: 'Govt',
    chipBg: '#e5e0fa',
    chipColor: '#4a3d8e',
    revenue: '78,42,300',
    gst: '14,11,614',
    period: 'Apr 26',
    wavePath: 'M0,20 Q25,12 50,16 T100,10 L100,30 L0,30 Z',
    waveFill: '#e5e0fa',
    icon: (
      <svg viewBox='0 0 24 24' fill='none' stroke='white' strokeWidth='2' width='15' height='15'>
        <path d='M3 21h18M5 21V7l7-4 7 4v14M9 9h1M9 13h1M9 17h1M14 9h1M14 13h1M14 17h1' />
      </svg>
    )
  },
  {
    id: 'enterprise_private',
    label: 'Enterprise',
    sub: 'Private clients',
    icColor: '#5b8cb8',
    chip: 'Private',
    chipBg: '#dde8f2',
    chipColor: '#2c6a96',
    revenue: '46,43,300',
    gst: '8,35,794',
    period: 'Apr 26',
    wavePath: 'M0,22 Q25,14 50,18 T100,12 L100,30 L0,30 Z',
    waveFill: '#dde8f2',
    icon: (
      <svg viewBox='0 0 24 24' fill='none' stroke='white' strokeWidth='2' width='15' height='15'>
        <path d='M3 21h18M5 21V7l7-4 7 4v14M9 9h1M9 13h1M9 17h1M14 9h1M14 13h1M14 17h1' />
      </svg>
    )
  },
  {
    id: 'events_govt',
    label: 'Special Events',
    sub: 'Government events',
    icColor: '#b85a8e',
    chip: 'Govt',
    chipBg: '#f5dae8',
    chipColor: '#7a2d5a',
    revenue: '22,15,600',
    gst: '3,98,808',
    period: 'Apr 26',
    wavePath: 'M0,24 Q20,10 40,14 T80,12 T100,8 L100,30 L0,30 Z',
    waveFill: '#f5dae8',
    icon: (
      <svg viewBox='0 0 24 24' fill='none' stroke='white' strokeWidth='2' width='15' height='15'>
        <rect x='3' y='4' width='18' height='18' rx='2' />
        <path d='M16 2v4M8 2v4M3 10h18' />
      </svg>
    )
  },
  {
    id: 'events_private',
    label: 'Special Events',
    sub: 'Private events',
    icColor: '#a8a03e',
    chip: 'Private',
    chipBg: '#f0ecc7',
    chipColor: '#6b6720',
    revenue: '12,57,300',
    gst: '2,26,314',
    period: 'Apr 26',
    wavePath: 'M0,22 Q25,10 50,14 T100,8 L100,30 L0,30 Z',
    waveFill: '#f0ecc7',
    icon: (
      <svg viewBox='0 0 24 24' fill='none' stroke='white' strokeWidth='2' width='15' height='15'>
        <rect x='3' y='4' width='18' height='18' rx='2' />
        <path d='M16 2v4M8 2v4M3 10h18' />
      </svg>
    )
  }
];

const PAYABLE_CARDS = [
  {
    id: 'dot',
    name: 'DoT Payable',
    sub: 'Dept of Telecom',
    icColor: '#f5b93b',
    paidPct: 72,
    pctColor: '#9a7800',
    pctBg: '#fff0cf',
    pctBorder: '#f5dc99',
    pctLabel: '72%',
    totalPayable: '1,86,420',
    paid: '1,34,222',
    pending: '52,198',
    isAlert: false,
    icon: (
      <svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='white' strokeWidth='2'>
        <rect x='3' y='3' width='18' height='18' rx='2' />
        <path d='M9 17V9M15 17V9' />
      </svg>
    )
  },
  {
    id: 'lnp',
    name: 'LNP Share',
    sub: 'Local Network Partners',
    icColor: '#8b7fd6',
    paidPct: 88,
    pctColor: '#1b6b3a',
    pctBg: '#d9f0e5',
    pctBorder: '#9ad5b8',
    pctLabel: '88%',
    totalPayable: '9,32,100',
    paid: '8,20,248',
    pending: '1,11,852',
    isAlert: false,
    icon: (
      <svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='white' strokeWidth='2'>
        <path d='M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2' />
        <circle cx='9' cy='7' r='4' />
        <path d='M23 21v-2a4 4 0 00-3-3.87' />
        <path d='M16 3.13a4 4 0 010 7.75' />
      </svg>
    )
  },
  {
    id: 'agnp',
    name: 'AGNP Share',
    sub: 'Aggregator Network · needs action',
    icColor: '#2fb8c6',
    paidPct: 45,
    pctColor: '#a8284e',
    pctBg: '#ffe5ec',
    pctBorder: '#f5b9cc',
    pctLabel: '45%',
    totalPayable: '3,72,840',
    paid: '1,67,778',
    pending: '2,05,062',
    isAlert: false,
    icon: (
      <svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='white' strokeWidth='2'>
        <path d='M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2' />
        <circle cx='8.5' cy='7' r='4' />
        <path d='M20 8v6M23 11h-6' />
      </svg>
    )
  },
  {
    id: 'msp',
    name: 'MSP Share',
    sub: 'Managed Service Providers',
    icColor: '#f76c7a',
    paidPct: 95,
    pctColor: '#1b6b3a',
    pctBg: '#d9f0e5',
    pctBorder: '#9ad5b8',
    pctLabel: '95%',
    totalPayable: '1,86,420',
    paid: '1,77,099',
    pending: '9,321',
    isAlert: false,
    icon: (
      <svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='white' strokeWidth='2'>
        <path d='M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z' />
      </svg>
    )
  }
];

const PARTNERS = [
  {
    type: 'LNP',
    typeBg: '#e5e0fa',
    typeColor: '#4a3d8e',
    prefix: 'LNP-',
    num: '3322519',
    name: 'SPUTNIC CABLE NETWORK',
    sub: 'FTTH · L2VPN specialist',
    dist: 'TVM',
    total: '4,24,335',
    dot: '58,420',
    agr: '12,800',
    ftth: '2,87,500',
    ill: null,
    l2vpn: '22,400',
    l3vpn: null,
    ott: '35,215',
    sip: '8,000'
  },
  {
    type: 'AGNP',
    typeBg: '#d6f2f4',
    typeColor: '#0c5a63',
    prefix: 'AGNP-',
    num: '1447912',
    name: 'SRIHARSHA LNP FT',
    sub: 'FTTH · ILL provider',
    dist: 'MPM',
    total: '1,44,479',
    dot: '24,200',
    agr: '6,800',
    ftth: '98,479',
    ill: '5,200',
    l2vpn: null,
    l3vpn: null,
    ott: '9,800',
    sip: null
  },
  {
    type: 'LNP',
    typeBg: '#e5e0fa',
    typeColor: '#4a3d8e',
    prefix: 'LNP-',
    num: '0950917',
    name: 'Jerico LNP Services',
    sub: 'FTTH · OTT bundle',
    dist: 'EKM',
    total: '95,091',
    dot: '14,400',
    agr: '4,200',
    ftth: '62,241',
    ill: null,
    l2vpn: '8,000',
    l3vpn: null,
    ott: '6,250',
    sip: null
  },
  {
    type: 'LNP',
    typeBg: '#e5e0fa',
    typeColor: '#4a3d8e',
    prefix: 'LNP-',
    num: '1497559',
    name: 'TESTLNP1 Enterprise',
    sub: 'FTTH · ILL · Static IP',
    dist: 'KKD',
    total: '87,560',
    dot: '11,800',
    agr: '3,400',
    ftth: '56,360',
    ill: '3,200',
    l2vpn: null,
    l3vpn: '8,400',
    ott: '4,400',
    sip: null
  },
  {
    type: 'AGNP',
    typeBg: '#d6f2f4',
    typeColor: '#0c5a63',
    prefix: 'AGNP-',
    num: '1132054',
    name: 'Vishnu Vardhan Networks',
    sub: 'FTTH · OTT · Static IP',
    dist: 'TSR',
    total: '72,132',
    dot: '9,200',
    agr: '2,800',
    ftth: '48,732',
    ill: null,
    l2vpn: null,
    l3vpn: null,
    ott: '7,400',
    sip: '4,000'
  },
  {
    type: 'MSP',
    typeBg: '#ffe2e4',
    typeColor: '#a3362f',
    prefix: 'MSP-',
    num: '2087432',
    name: 'Asia Web Solutions',
    sub: 'Full-stack services',
    dist: 'KLM',
    total: '65,440',
    dot: '8,400',
    agr: '2,200',
    ftth: '42,400',
    ill: '4,200',
    l2vpn: '5,200',
    l3vpn: null,
    ott: null,
    sip: '3,040'
  },
  {
    type: 'LNP',
    typeBg: '#e5e0fa',
    typeColor: '#4a3d8e',
    prefix: 'LNP-',
    num: '8823145',
    name: 'Palakkad Fibre Co.',
    sub: 'FTTH · L2VPN',
    dist: 'PKD',
    total: '58,200',
    dot: '7,600',
    agr: '2,100',
    ftth: '41,500',
    ill: null,
    l2vpn: '2,800',
    l3vpn: null,
    ott: '4,200',
    sip: null
  },
  {
    type: 'AGNP',
    typeBg: '#d6f2f4',
    typeColor: '#0c5a63',
    prefix: 'AGNP-',
    num: '6712834',
    name: 'Kannur Broadband Services',
    sub: 'FTTH · ILL',
    dist: 'KNR',
    total: '48,920',
    dot: '6,400',
    agr: '1,800',
    ftth: '35,020',
    ill: '1,700',
    l2vpn: null,
    l3vpn: null,
    ott: '4,000',
    sip: null
  },
  {
    type: 'DoT',
    typeBg: '#fff0cf',
    typeColor: '#9a7800',
    prefix: 'DoT-',
    num: '3401829',
    name: 'Backhaul Services Ltd',
    sub: 'DoT only',
    dist: 'ALP',
    total: '42,120',
    dot: '42,120',
    agr: null,
    ftth: null,
    ill: null,
    l2vpn: null,
    l3vpn: null,
    ott: null,
    sip: null
  },
  {
    type: 'MSP',
    typeBg: '#ffe2e4',
    typeColor: '#a3362f',
    prefix: 'MSP-',
    num: '9934421',
    name: 'Kottayam Smart Services',
    sub: 'Full-stack services',
    dist: 'KTM',
    total: '38,640',
    dot: '5,200',
    agr: '1,400',
    ftth: '27,240',
    ill: '1,200',
    l2vpn: '1,800',
    l3vpn: null,
    ott: '1,800',
    sip: null
  }
];

/* ─── Column templates ─── */
const COL_COMPACT = '90px 130px minmax(0,1.5fr) 70px 120px 80px';
const COL_EXPANDED = '90px 130px minmax(0,1.5fr) 70px 120px 90px 90px 100px 80px 90px 90px 80px 90px';

/* ─── Sub-components ─── */

const NumCell = ({ value, isTotal }) =>
  value ? (
    <Text
      textAlign='right'
      fontSize={isTotal ? '16px' : '14px'}
      color={isTotal ? '#e94e77' : C.text}
      letterSpacing='-0.1px'
    >
      {value}
    </Text>
  ) : (
    <Text textAlign='right' fontSize='13px' color={C.muted} fontWeight='600'>
      —
    </Text>
  );

const ExpandIcon = () => (
  <svg width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.5'>
    <path d='M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7' />
  </svg>
);

const ChevronDown = () => (
  <svg width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.5'>
    <polyline points='6 9 12 15 18 9' />
  </svg>
);

const SectionLabel = ({ badge, children }) => (
  <Flex
    align='center'
    gap='10px'
    mt='24px'
    mb='14px'
    fontSize='13px'
    fontWeight='800'
    letterSpacing='1.2px'
    textTransform='uppercase'
    color={C.mid}
    flexWrap='wrap'
  >
    <Box
      bg={C.primary}
      color={C.yellow}
      w='24px'
      h='24px'
      borderRadius='50%'
      display='flex'
      alignItems='center'
      justifyContent='center'
      fontSize='13px'
      letterSpacing='0'
      flexShrink='0'
    >
      {badge}
    </Box>
    {children}
  </Flex>
);

/* ─── Main Component ─── */

const RevenueShareDashboard = () => {
  const [activeSource, setActiveSource] = useState('ews');
  const [viewMode, setViewMode] = useState('compact');
  const [search, setSearch] = useState('');

  const activeLabel = activeSource ? (REVENUE_SOURCES.find((s) => s.id === activeSource)?.label ?? '') : null;

  const FilterTag = ({ onClick }) => (
    <Box
      as='button'
      display='inline-flex'
      alignItems='center'
      gap='5px'
      bg={C.yBg}
      border='1px solid'
      borderColor={C.yBorder}
      color={C.dark}
      px='9px'
      py='3px'
      borderRadius='100px'
      fontSize='12px'
      fontWeight='700'
      cursor='pointer'
      textTransform='none'
      letterSpacing='0.2px'
      onClick={onClick}
    >
      <svg width='9' height='9' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.5'>
        <polygon points='22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3' />
      </svg>
      {activeLabel}
      <Text as='span' opacity='0.6' fontWeight='800'>
        ×
      </Text>
    </Box>
  );

  return (
    <Box p='22px 26px 32px'>
      {/* ── Page Header ── */}
      <Flex justify='space-between' align='flex-end' mb='18px' flexWrap='wrap' gap='14px'>
        <Box>
          <Text fontSize='32px' mb='4px' color={C.dark} fontWeight='400' letterSpacing='-0.4px'>
            Revenue Share Dashboard
          </Text>
          <Text fontSize='14px' color={C.mid} lineHeight='1.4'>
            Click any source card — the payable splits and partner breakdown update to show only that source
          </Text>
        </Box>
        <Flex gap='8px' align='center'>
          {/* Period pill */}
          <Box
            as='button'
            display='inline-flex'
            alignItems='center'
            gap='8px'
            px='14px'
            py='7px'
            borderRadius='100px'
            bg={C.yBg}
            border='1px solid'
            borderColor={C.yBorder}
            color={C.dark}
            fontSize='13px'
            fontWeight='700'
            cursor='pointer'
          >
            <Box w='6px' h='6px' borderRadius='50%' bg='#5bbf95' flexShrink='0' />
            <Text as='span'>April 2026</Text>
            <ChevronDown />
          </Box>
          {/* Download CSV button */}
          <CsvDownloadBtn />
          {/* Disburse All button */}
          <Box
            as='button'
            display='inline-flex'
            alignItems='center'
            gap='6px'
            px='14px'
            py='8px'
            borderRadius='100px'
            bg={C.primary}
            border='1px solid'
            borderColor={C.primary}
            color='white'
            fontSize='13px'
            fontWeight='700'
            cursor='pointer'
            boxShadow='0 4px 12px rgba(107,26,61,.2)'
          >
            <svg width='11' height='11' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
              <path d='M22 11.08V12a10 10 0 11-5.93-9.14' />
              <polyline points='22 4 12 14.01 9 11.01' />
            </svg>
            Disburse All
          </Box>
        </Flex>
      </Flex>

      {/* ══ Section A — Revenue by Source ══ */}
      <SectionLabel badge='A'>
        Revenue by Source
        <Box flex='1' h='1px' bg={C.border} minW='20px' />
        <Text fontSize='12px' color={C.muted} fontWeight='600' letterSpacing='0.3px' textTransform='none'>
          8 sources + total · Click any card to filter B &amp; C
        </Text>
      </SectionLabel>

      {/* Layout: left 4×2 grid + right portrait total card */}
      <Box display='grid' gridTemplateColumns='minmax(0,1fr) 220px' gap='14px' alignItems='stretch'>
        {/* Left: 8 source cards in 4×2 */}
        <Box display='grid' gridTemplateColumns='repeat(4,1fr)' gap='10px'>
          {REVENUE_SOURCES.map((src) => {
            const isActive = activeSource === src.id;
            return (
              <Box
                key={src.id}
                bg='white'
                border='1px solid'
                borderColor={isActive ? C.primary : C.border}
                borderRadius='12px'
                p='12px 14px'
                position='relative'
                overflow='hidden'
                cursor='pointer'
                minH='126px'
                display='flex'
                flexDirection='column'
                gap='2px'
                boxShadow={isActive ? '0 8px 22px -8px rgba(107,26,61,.2)' : 'none'}
                transition='transform 0.2s, box-shadow 0.2s, border-color 0.2s'
                _hover={{ transform: 'translateY(-2px)', boxShadow: '0 6px 18px rgba(107,26,61,.08)' }}
                onClick={() => setActiveSource(src.id)}
              >
                {/* Active top bar */}
                {isActive && <Box position='absolute' top='0' left='0' right='0' h='3px' bg={C.primary} />}

                {/* Card top row */}
                <Flex align='center' gap='9px' position='relative' zIndex='2'>
                  <Box
                    w='30px'
                    h='30px'
                    borderRadius='8px'
                    bg={src.icColor}
                    display='flex'
                    alignItems='center'
                    justifyContent='center'
                    color='white'
                    boxShadow='0 3px 8px rgba(0,0,0,.1)'
                    flexShrink='0'
                  >
                    {src.icon}
                  </Box>
                  <Box flex='1' minW='0' display='flex' flexDirection='column' gap='2px'>
                    <Flex align='center' gap='5px' flexWrap='wrap'>
                      <Text
                        fontSize='11px'
                        fontWeight='800'
                        color={C.text}
                        letterSpacing='0.3px'
                        textTransform='uppercase'
                        lineHeight='1'
                      >
                        {src.label}
                      </Text>
                      {src.chip && (
                        <Box
                          bg={src.chipBg}
                          color={src.chipColor}
                          fontSize='8.5px'
                          fontWeight='800'
                          letterSpacing='0.4px'
                          textTransform='uppercase'
                          px='5px'
                          py='1px'
                          borderRadius='3px'
                          lineHeight='1'
                        >
                          {src.chip}
                        </Box>
                      )}
                    </Flex>
                    <Text fontSize='9.5px' color={C.mid} fontWeight='500' lineHeight='1'>
                      {src.sub}
                    </Text>
                  </Box>
                  <Text
                    fontSize='8px'
                    fontWeight='800'
                    letterSpacing='0.5px'
                    textTransform='uppercase'
                    whiteSpace='nowrap'
                    alignSelf='flex-start'
                    pt='2px'
                    color={isActive ? C.primary : C.muted}
                    bg={isActive ? C.yBg : 'transparent'}
                    border={isActive ? '1px solid' : 'none'}
                    borderColor={C.yBorder}
                    px={isActive ? '5px' : '0'}
                    py={isActive ? '2px' : '0'}
                    borderRadius={isActive ? '3px' : '0'}
                  >
                    {isActive ? 'Active' : src.period}
                  </Text>
                </Flex>

                {/* Value */}
                <Text fontSize='20px' fontWeight='400' color={C.text} letterSpacing='-0.6px' lineHeight='1' mt='6px'>
                  <Text as='span' fontSize='13px' color={C.mid2} mr='1px' opacity='0.75'>
                    ₹
                  </Text>
                  {src.revenue}
                </Text>

                {/* GST row */}
                <Flex align='center' gap='5px' mt='auto' pt='5px' fontSize='9.5px' color={C.mid}>
                  <Box
                    bg='#fff0cf'
                    color='#9a7800'
                    fontSize='8px'
                    fontWeight='800'
                    letterSpacing='0.4px'
                    px='5px'
                    py='2px'
                    borderRadius='3px'
                    textTransform='uppercase'
                    lineHeight='1'
                  >
                    GST 18%
                  </Box>
                  <Text as='strong' color='#9a7800' fontWeight='700'>
                    ₹{src.gst}
                  </Text>
                </Flex>

                {/* Wave */}
                <Box position='absolute' bottom='0' left='0' right='0' h='24px' opacity='0.45' pointerEvents='none'>
                  <svg viewBox='0 0 100 30' preserveAspectRatio='none' style={{ width: '100%', height: '100%' }}>
                    <path d={src.wavePath} fill={src.waveFill} />
                  </svg>
                </Box>
              </Box>
            );
          })}
        </Box>

        {/* Right: Portrait Total Card */}
        <Box
          background='radial-gradient(circle at 100% 0%, rgba(255,213,87,.32) 0%, transparent 55%), radial-gradient(circle at 0% 100%, rgba(255,213,87,.2) 0%, transparent 55%), linear-gradient(160deg, #fffbea 0%, #fff5d1 100%)'
          border='1px solid'
          borderColor={C.yBorder}
          boxShadow='0 6px 22px -10px rgba(255,213,87,.55)'
          borderRadius='14px'
          p='18px 16px'
          display='flex'
          flexDirection='column'
          position='relative'
          overflow='hidden'
          cursor='pointer'
          transition='transform 0.25s, box-shadow 0.25s'
          _hover={{ transform: 'translateY(-2px)', boxShadow: '0 10px 26px -8px rgba(255,213,87,.55)' }}
        >
          {/* Glow orb top */}
          <Box
            position='absolute'
            top='-40px'
            right='-30px'
            w='130px'
            h='130px'
            borderRadius='50%'
            pointerEvents='none'
            background='radial-gradient(circle, rgba(255,213,87,.4) 0%, transparent 70%)'
          />

          {/* Glow orb bottom */}
          <Box
            position='absolute'
            bottom='-30px'
            left='-20px'
            w='100px'
            h='100px'
            borderRadius='50%'
            pointerEvents='none'
            background='radial-gradient(circle, rgba(255,213,87,.25) 0%, transparent 70%)'
          />

          {/* Head */}
          <Flex
            align='center'
            gap='10px'
            pb='14px'
            borderBottom='1px solid'
            borderColor={C.yBorder}
            position='relative'
            zIndex='2'
          >
            <Box
              w='36px'
              h='36px'
              borderRadius='10px'
              flexShrink='0'
              background='linear-gradient(135deg, #ffd557, #f5b93b)'
              display='flex'
              alignItems='center'
              justifyContent='center'
              color={C.dark}
              boxShadow='0 4px 12px rgba(255,213,87,.4)'
            >
              <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.2' width='17' height='17'>
                <path d='M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6' />
              </svg>
            </Box>
            <Box flex='1' minW='0'>
              <Text
                fontSize='11.5px'
                fontWeight='800'
                color={C.dark}
                letterSpacing='0.4px'
                textTransform='uppercase'
                lineHeight='1'
              >
                Total
              </Text>
              <Text fontSize='9.5px' color={C.primary} fontWeight='600' mt='3px' letterSpacing='0.2px'>
                All 8 sources
              </Text>
            </Box>
          </Flex>

          {/* Middle */}
          <Flex
            direction='column'
            alignItems='center'
            justifyContent='center'
            flex='1'
            py='20px'
            position='relative'
            zIndex='2'
            textAlign='center'
          >
            <Text
              fontSize='9px'
              fontWeight='800'
              letterSpacing='1.4px'
              textTransform='uppercase'
              color='#9a7800'
              opacity='0.85'
              mb='10px'
            >
              Grand Total
            </Text>
            <Text fontSize='32px' fontWeight='400' color={C.dark} letterSpacing='-0.9px' lineHeight='1'>
              <Text as='span' fontSize='21px' color={C.mid2} mr='1px' opacity='0.75'>
                ₹
              </Text>
              2,95,14,050
            </Text>
            <Box
              as='span'
              display='inline-block'
              mt='12px'
              fontSize='9px'
              fontWeight='800'
              letterSpacing='0.8px'
              color='#9a7800'
              textTransform='uppercase'
              bg='rgba(255,255,255,.65)'
              px='9px'
              py='3px'
              borderRadius='100px'
              border='1px solid'
              borderColor={C.yBorder}
            >
              Apr 2026
            </Box>
          </Flex>

          {/* GST box */}
          <Box
            bg='rgba(255,255,255,.7)'
            p='11px 14px'
            borderRadius='10px'
            border='1px solid'
            borderColor={C.yBorder}
            display='flex'
            flexDirection='column'
            gap='3px'
            position='relative'
            zIndex='2'
          >
            <Text
              fontSize='9px'
              fontWeight='800'
              letterSpacing='0.8px'
              textTransform='uppercase'
              color='#9a7800'
              opacity='0.85'
            >
              GST Total · 18%
            </Text>
            <Text fontSize='18px' fontWeight='400' color='#9a7800' letterSpacing='-0.3px' lineHeight='1'>
              <Text as='span' fontSize='13px' color='#9a7800' mr='1px' opacity='0.75'>
                ₹
              </Text>
              53,12,529
            </Text>
          </Box>
        </Box>
      </Box>

      {/* ══ Section B — Payable vs Paid ══ */}
      <SectionLabel badge='B'>
        Payable vs Paid
        {activeLabel && <FilterTag onClick={() => setActiveSource(null)} />}
        <Box flex='1' h='1px' bg={C.border} minW='20px' />
        <Text fontSize='12px' color={C.muted} fontWeight='600' letterSpacing='0.3px' textTransform='none'>
          4 partner categories ·{' '}
          <Text as='strong' color={C.primary} fontWeight='700'>
            77% settled
          </Text>
        </Text>
      </SectionLabel>

      {/* Summary bar */}
      <Box
        bg='white'
        border='1px solid'
        borderColor={C.border}
        borderRadius='14px'
        p='14px 20px'
        mb='14px'
        display='grid'
        gridTemplateColumns='auto 1fr auto auto auto'
        alignItems='center'
        gap='20px'
      >
        <Box>
          <Text fontSize='11px' fontWeight='800' letterSpacing='1px' textTransform='uppercase' color={C.muted}>
            Total
          </Text>
          <Text fontSize='16px' color={C.dark} letterSpacing='-0.2px' lineHeight='1.2'>
            Partner{' '}
            <Text as='span' color='#e94e77'>
              Disbursement
            </Text>
            <Text as='span' display='block' fontSize='12px' color={C.mid} fontWeight='500' mt='2px'>
              All partner types combined · April 2026
            </Text>
          </Text>
        </Box>
        <Box />
        <Box display='flex' flexDirection='column' gap='2px' textAlign='right'>
          <Text fontSize='11px' fontWeight='800' letterSpacing='1px' textTransform='uppercase' color={C.muted}>
            Total Payable
          </Text>
          <Text fontSize='20px' color={C.dark} letterSpacing='-0.2px' lineHeight='1'>
            <Text as='span' fontSize='14px' color={C.mid2} mr='1px'>
              ₹
            </Text>
            16,77,780
          </Text>
        </Box>
        <Box h='6px' borderRadius='100px' bg='#f7ecf1' overflow='hidden' display='flex' w='180px'>
          <Box h='100%' w='77%' background='linear-gradient(90deg, #5bbf95, #3da070)' />
          <Box h='100%' w='23%' background='linear-gradient(90deg, #ff8fa5, #e94e77)' />
        </Box>
        <Flex gap='14px'>
          <Box display='flex' flexDirection='column' gap='2px' textAlign='right'>
            <Flex
              align='center'
              gap='5px'
              justifyContent='flex-end'
              fontSize='10.5px'
              fontWeight='800'
              letterSpacing='0.6px'
              textTransform='uppercase'
              color={C.mid}
            >
              <Box w='6px' h='6px' borderRadius='50%' bg='#5bbf95' />
              Paid 77%
            </Flex>
            <Text fontSize='19px' letterSpacing='-0.3px' lineHeight='1' color='#1b6b3a'>
              <Text as='span' fontSize='13px' color={C.mid} mr='1px' opacity='0.7'>
                ₹
              </Text>
              12,99,347
            </Text>
          </Box>
          <Box display='flex' flexDirection='column' gap='2px' textAlign='right'>
            <Flex
              align='center'
              gap='5px'
              justifyContent='flex-end'
              fontSize='10.5px'
              fontWeight='800'
              letterSpacing='0.6px'
              textTransform='uppercase'
              color={C.mid}
            >
              <Box w='6px' h='6px' borderRadius='50%' bg='#e94e77' />
              Pending 23%
            </Flex>
            <Text fontSize='19px' letterSpacing='-0.3px' lineHeight='1' color='#e94e77'>
              <Text as='span' fontSize='13px' color={C.mid} mr='1px' opacity='0.7'>
                ₹
              </Text>
              3,78,433
            </Text>
          </Box>
        </Flex>
      </Box>

      {/* Payable Cards */}
      <Box display='grid' gridTemplateColumns='repeat(4, 1fr)' gap='14px'>
        {PAYABLE_CARDS.map((card) => (
          <Box
            key={card.id}
            bg='white'
            border='1px solid'
            borderColor={card.isAlert ? '#e94e77' : C.border}
            borderRadius='14px'
            p='16px 18px 18px'
            position='relative'
            overflow='hidden'
            display='flex'
            flexDirection='column'
            gap='14px'
            minH='220px'
            boxShadow={card.isAlert ? '0 10px 28px -10px rgba(233,78,119,.25)' : 'none'}
            transition='transform 0.25s, box-shadow 0.25s'
            _hover={{ transform: 'translateY(-2px)', boxShadow: '0 8px 20px rgba(107,26,61,.08)' }}
          >
            {card.isAlert && (
              <Box
                position='absolute'
                top='0'
                left='0'
                right='0'
                h='3px'
                background='linear-gradient(90deg, #e94e77, #d63d64)'
              />
            )}

            {/* Top */}
            <Flex align='flex-start' justify='space-between' gap='10px'>
              <Box
                w='38px'
                h='38px'
                borderRadius='10px'
                bg={card.icColor}
                display='flex'
                alignItems='center'
                justifyContent='center'
                color='white'
                boxShadow='0 4px 10px rgba(0,0,0,.1)'
                flexShrink='0'
              >
                {card.icon}
              </Box>
              <Box flex='1' minW='0' pt='3px'>
                <Text
                  fontSize='14px'
                  fontWeight='800'
                  color={C.text}
                  letterSpacing='0.3px'
                  textTransform='uppercase'
                  lineHeight='1.1'
                >
                  {card.name}
                </Text>
                <Text fontSize='12px' color={C.mid} fontWeight='500' mt='3px'>
                  {card.sub}
                </Text>
              </Box>
              <Box
                px='10px'
                py='4px'
                borderRadius='100px'
                fontSize='17px'
                letterSpacing='-0.3px'
                lineHeight='1'
                border='1px solid'
                borderColor={card.pctBorder}
                color={card.pctColor}
                bg={card.pctBg}
              >
                {card.pctLabel}
              </Box>
            </Flex>

            {/* Hero amount */}
            <Box
              p='12px 14px'
              borderRadius='10px'
              bg={card.isAlert ? '#fff0f4' : C.bg}
              border='1px solid'
              borderColor={card.isAlert ? '#f5b9cc' : C.border}
            >
              <Text
                fontSize='11px'
                fontWeight='800'
                letterSpacing='0.6px'
                textTransform='uppercase'
                color={C.mid}
                mb='3px'
              >
                Total Payable
              </Text>
              <Text fontSize='29px' letterSpacing='-0.6px' lineHeight='1' color={C.dark}>
                <Text as='span' fontSize='19px' color={C.mid2} mr='1px' opacity='0.7'>
                  ₹
                </Text>
                {card.totalPayable}
              </Text>
            </Box>

            {/* Progress bar */}
            <Box h='8px' borderRadius='100px' bg='#f7ecf1' overflow='hidden' display='flex'>
              <Box
                h='100%'
                background='linear-gradient(90deg, #5bbf95, #3da070)'
                style={{ width: `${card.paidPct}%` }}
              />
              <Box
                h='100%'
                background={
                  card.isAlert ? 'linear-gradient(90deg, #e94e77, #d63d64)' : 'linear-gradient(90deg, #ff8fa5, #e94e77)'
                }
                style={{ width: `${100 - card.paidPct}%` }}
              />
            </Box>

            {/* Splits */}
            <Box
              display='grid'
              gridTemplateColumns='1fr 1fr'
              gap='12px'
              pt='12px'
              borderTop='1px dashed'
              borderColor={C.border}
              mt='auto'
            >
              <Box
                display='flex'
                flexDirection='column'
                gap='3px'
                pr='10px'
                borderRight='1px dashed'
                borderColor={C.border}
              >
                <Flex
                  align='center'
                  gap='5px'
                  fontSize='11px'
                  fontWeight='800'
                  letterSpacing='0.5px'
                  textTransform='uppercase'
                  color={C.mid}
                >
                  <Box w='7px' h='7px' borderRadius='50%' bg='#5bbf95' flexShrink='0' />
                  Paid
                </Flex>
                <Text fontSize='19px' letterSpacing='-0.3px' lineHeight='1' color='#1b6b3a'>
                  <Text as='span' fontSize='13px' color={C.mid} mr='1px' opacity='0.7'>
                    ₹
                  </Text>
                  {card.paid}
                </Text>
              </Box>
              <Box display='flex' flexDirection='column' gap='3px' pl='10px'>
                <Flex
                  align='center'
                  gap='5px'
                  fontSize='11px'
                  fontWeight='800'
                  letterSpacing='0.5px'
                  textTransform='uppercase'
                  color={C.mid}
                >
                  <Box w='7px' h='7px' borderRadius='50%' bg='#e94e77' flexShrink='0' />
                  Pending
                </Flex>
                <Text
                  fontSize='19px'
                  letterSpacing='-0.3px'
                  lineHeight='1'
                  color={card.isAlert ? '#a8284e' : '#e94e77'}
                >
                  <Text as='span' fontSize='13px' color={C.mid} mr='1px' opacity='0.7'>
                    ₹
                  </Text>
                  {card.pending}
                </Text>
              </Box>
            </Box>
          </Box>
        ))}
      </Box>

      {/* ══ Section C — Partner Revenue Share ══ */}
      <SectionLabel badge='C'>
        Partner Revenue Share
        {activeLabel && <FilterTag onClick={() => setActiveSource(null)} />}
        <Text ml='auto' fontSize='12px' color={C.muted} fontWeight='600' letterSpacing='0.3px' textTransform='none'>
          Service-level breakdown across partners
        </Text>
      </SectionLabel>

      {/* Filter Row */}
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
          h='34px'
        >
          <svg width='13' height='13' viewBox='0 0 24 24' fill='none' stroke={C.mid} strokeWidth='2'>
            <circle cx='11' cy='11' r='8' />
            <path d='M21 21l-4.3-4.3' />
          </svg>
          <input
            placeholder='Search by Partner ID or Name…'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              background: 'transparent',
              fontSize: '14px',
              color: C.text
            }}
          />
        </Flex>

        {/* Filter dropdowns */}
        {[
          { label: 'District', value: 'All 14', active: false, count: null },
          { label: 'Partner Type', value: 'LNP + AGNP', active: true, count: '2' },
          { label: 'Partner', value: 'All', active: false, count: null }
        ].map((fd) => (
          <Box
            key={fd.label}
            as='button'
            display='inline-flex'
            alignItems='center'
            gap='6px'
            bg={fd.active ? C.primary : 'white'}
            border='1px solid'
            borderColor={fd.active ? C.primary : C.border}
            borderRadius='8px'
            px='12px'
            h='34px'
            fontSize='13px'
            fontWeight='600'
            color={fd.active ? 'white' : C.primary}
            cursor='pointer'
            _hover={{ borderColor: fd.active ? C.primary : C.primary }}
          >
            <Text
              fontSize='11px'
              fontWeight='800'
              letterSpacing='0.4px'
              textTransform='uppercase'
              color={fd.active ? 'rgba(255,255,255,.7)' : C.muted}
            >
              {fd.label}
            </Text>
            <Text fontWeight='700'>{fd.value}</Text>
            {fd.count && (
              <Box
                bg={fd.active ? C.yellow : C.bg}
                color={C.dark}
                px='6px'
                py='1px'
                borderRadius='100px'
                fontSize='11px'
                fontWeight='800'
              >
                {fd.count}
              </Box>
            )}
            <ChevronDown />
          </Box>
        ))}

        <Box flex='1' />

        {/* View toggle */}
        <Flex align='center' gap='3px' bg={C.bg} border='1px solid' borderColor={C.border} borderRadius='8px' p='3px'>
          {[
            {
              mode: 'compact',
              label: 'Compact',
              icon: (
                <svg width='11' height='11' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
                  <line x1='8' y1='6' x2='21' y2='6' />
                  <line x1='8' y1='12' x2='21' y2='12' />
                  <line x1='8' y1='18' x2='21' y2='18' />
                  <line x1='3' y1='6' x2='3.01' y2='6' />
                  <line x1='3' y1='12' x2='3.01' y2='12' />
                  <line x1='3' y1='18' x2='3.01' y2='18' />
                </svg>
              )
            },
            {
              mode: 'expanded',
              label: 'Expanded',
              icon: (
                <svg width='11' height='11' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
                  <rect x='3' y='3' width='18' height='18' rx='2' />
                  <path d='M3 9h18M3 15h18M9 3v18M15 3v18' />
                </svg>
              )
            }
          ].map((v) => (
            <Box
              key={v.mode}
              as='button'
              bg={viewMode === v.mode ? 'white' : 'transparent'}
              border='none'
              px='12px'
              py='5px'
              borderRadius='5px'
              fontSize='12px'
              fontWeight='600'
              color={viewMode === v.mode ? C.primary : C.mid}
              cursor='pointer'
              display='inline-flex'
              alignItems='center'
              gap='5px'
              boxShadow={viewMode === v.mode ? '0 1px 3px rgba(74,15,42,.08)' : 'none'}
              onClick={() => setViewMode(v.mode)}
            >
              {v.icon}
              {v.label}
            </Box>
          ))}
        </Flex>
      </Flex>

      {/* Table Header */}
      <Box
        display='grid'
        gridTemplateColumns={viewMode === 'compact' ? COL_COMPACT : COL_EXPANDED}
        gap='10px'
        alignItems='center'
        px='18px'
        mb='8px'
        fontSize='11px'
        fontWeight='800'
        letterSpacing='0.8px'
        textTransform='uppercase'
        color={C.mid}
      >
        <Text>Type</Text>
        <Text>Partner ID</Text>
        <Text>Name</Text>
        <Text>Dist</Text>
        <Text textAlign='right'>Total Revenue</Text>
        {viewMode === 'compact' && <Text textAlign='center'>Details</Text>}
        {viewMode === 'expanded' && (
          <>
            <Text textAlign='right'>DoT</Text>
            <Text textAlign='right'>AGR</Text>
            <Text textAlign='right'>FTTH</Text>
            <Text textAlign='right'>ILL</Text>
            <Text textAlign='right'>L2VPN</Text>
            <Text textAlign='right'>L3VPN</Text>
            <Text textAlign='right'>OTT</Text>
            <Text textAlign='right'>Static IP</Text>
          </>
        )}
      </Box>

      {/* Table Rows */}
      <Flex direction='column' gap='8px'>
        {PARTNERS.filter(
          (p) =>
            !search ||
            p.name.toLowerCase().includes(search.toLowerCase()) ||
            `${p.prefix}${p.num}`.toLowerCase().includes(search.toLowerCase())
        ).map((p) => (
          <Box
            key={`${p.prefix}${p.num}`}
            display='grid'
            gridTemplateColumns={viewMode === 'compact' ? COL_COMPACT : COL_EXPANDED}
            gap='10px'
            alignItems='center'
            bg='white'
            border='1px solid'
            borderColor={C.border}
            borderRadius='10px'
            px='18px'
            py='12px'
            cursor='pointer'
            transition='transform 0.15s, border-color 0.15s, box-shadow 0.15s'
            _hover={{
              borderColor: C.primary,
              boxShadow: '0 4px 14px -6px rgba(107,26,61,.15)',
              transform: 'translateY(-1px)'
            }}
          >
            {/* Type chip */}
            <Box>
              <Box
                display='inline-flex'
                alignItems='center'
                justifyContent='center'
                px='9px'
                py='3px'
                borderRadius='5px'
                bg={p.typeBg}
                color={p.typeColor}
                fontSize='12px'
                fontWeight='800'
                letterSpacing='0.5px'
              >
                {p.type}
              </Box>
            </Box>

            {/* Partner ID */}
            <Text fontSize='13px' color={C.text} fontWeight='700'>
              <Text as='span' color={C.mid} fontWeight='500'>
                {p.prefix}
              </Text>
              {p.num}
            </Text>

            {/* Name */}
            <Box>
              <Text fontWeight='700' color={C.text} fontSize='14px' lineHeight='1.2' letterSpacing='-0.1px'>
                {p.name}
              </Text>
              <Text fontSize='12px' color={C.mid} mt='2px'>
                {p.sub}
              </Text>
            </Box>

            {/* District */}
            <Box>
              <Box
                display='inline-flex'
                alignItems='center'
                justifyContent='center'
                px='10px'
                py='4px'
                borderRadius='6px'
                bg={C.yBg}
                color={C.dark}
                fontSize='14px'
                letterSpacing='0.5px'
              >
                {p.dist}
              </Box>
            </Box>

            {/* Total */}
            <NumCell value={p.total} isTotal />

            {viewMode === 'compact' && (
              <Flex justify='center'>
                <Box
                  as='button'
                  w='28px'
                  h='28px'
                  borderRadius='7px'
                  bg={C.bg}
                  border='1px solid'
                  borderColor={C.border}
                  color={C.primary}
                  display='flex'
                  alignItems='center'
                  justifyContent='center'
                  cursor='pointer'
                  transition='background 0.15s, color 0.15s'
                  _hover={{ bg: C.primary, color: C.yellow, borderColor: C.primary }}
                  onClick={() => setViewMode('expanded')}
                >
                  <ExpandIcon />
                </Box>
              </Flex>
            )}

            {viewMode === 'expanded' && (
              <>
                <NumCell value={p.dot} />
                <NumCell value={p.agr} />
                <NumCell value={p.ftth} />
                <NumCell value={p.ill} />
                <NumCell value={p.l2vpn} />
                <NumCell value={p.l3vpn} />
                <NumCell value={p.ott} />
                <NumCell value={p.sip} />
              </>
            )}
          </Box>
        ))}
      </Flex>

      {/* Pagination */}
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
            1 – 10
          </Text>{' '}
          of 171 partners
        </Text>
        <Flex gap='4px'>
          {['«', '‹', '1', '2', '3', '…', '18', '›', '»'].map((n, i) => (
            <Box
              key={i}
              as='button'
              minW='32px'
              h='32px'
              borderRadius='7px'
              border='1px solid'
              borderColor={n === '1' ? C.primary : C.border}
              bg={n === '1' ? C.primary : 'white'}
              color={n === '1' ? C.yellow : C.text}
              fontSize='13px'
              fontWeight='600'
              cursor='pointer'
              display='flex'
              alignItems='center'
              justifyContent='center'
              _hover={{ borderColor: C.primary }}
            >
              {n}
            </Box>
          ))}
        </Flex>
      </Flex>
    </Box>
  );
};

export default RevenueShareDashboard;
