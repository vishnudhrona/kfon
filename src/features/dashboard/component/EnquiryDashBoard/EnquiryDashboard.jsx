import { Box, Button, HStack, Text, VStack } from '@kfonbss/bss-ui-components';
import { useMemo, useState } from 'react';

const COLORS = {
  m9: '#4a0f2a',
  m8: '#5a1433',
  m7: '#6b1a3d',
  m6: '#7a2147',
  yellow: '#ffd557',
  ybg: '#fff9e8',
  rose: '#e94e77',
  rsoft: '#ffe5ec',
  rbg: '#fff0f4',
  rdeep: '#a8284e',
  teal: '#2fb8c6',
  tsoft: '#d6f2f4',
  tdeep: '#0c5a63',
  coral: '#f76c7a',
  csoft: '#ffe2e4',
  cdeep: '#a3362f',
  amber: '#f5b93b',
  asoft: '#fff0cf',
  adeep: '#9a7800',
  mint: '#5bbf95',
  msoft: '#d9f0e5',
  mdeep: '#1b6b3a',
  lav: '#8b7fd6',
  lsoft: '#e5e0fa',
  ldeep: '#4a3d8e',
  info: '#5b8cb8',
  isoft: '#dde8f2',
  ideep: '#2c6a96',
  plum: '#b85a8e',
  psoft: '#f5dae8',
  pdeep: '#7a2d5a',
  ink: '#2b1a26',
  inks: '#6f5e6a',
  inkf: '#a898a0',
  line: '#f0e4ea',
  lines: '#f7ecf1',
  paper: '#fbf7f5',
  card: '#ffffff',
  blue: '#3B82F6'
};

const PERIOD_DATA = {
  today: {
    enq: '48',
    con: '12',
    rate: '25%',
    wenq: '312',
    wcon: '148',
    wrate: '47%',
    menq: '1,536',
    mcon: '964',
    mrate: '62.8%',
    yenq: '14,280',
    ycon: '8,960',
    yrate: '62.7%'
  },
  week: {
    enq: '312',
    con: '148',
    rate: '47%',
    wenq: '1,248',
    wcon: '740',
    wrate: '59.3%',
    menq: '1,536',
    mcon: '964',
    mrate: '62.8%',
    yenq: '14,280',
    ycon: '8,960',
    yrate: '62.7%'
  },
  month: {
    enq: '1,536',
    con: '964',
    rate: '62.8%',
    wenq: '6,240',
    wcon: '3,920',
    wrate: '62.8%',
    menq: '1,536',
    mcon: '964',
    mrate: '62.8%',
    yenq: '14,280',
    ycon: '8,960',
    yrate: '62.7%'
  },
  year: {
    enq: '14,280',
    con: '8,960',
    rate: '62.7%',
    wenq: '54,800',
    wcon: '34,400',
    wrate: '62.8%',
    menq: '1,190',
    mcon: '747',
    mrate: '62.8%',
    yenq: '14,280',
    ycon: '8,960',
    yrate: '62.7%'
  }
};

const DISTRICTS = [
  { name: 'Thiruvananthapuram', enq: 210, feas: 190, nf: 20, act: 155, conn: 148 },
  { name: 'Ernakulam', enq: 198, feas: 178, nf: 20, act: 145, conn: 138 },
  { name: 'Kozhikode', enq: 175, feas: 158, nf: 17, act: 130, conn: 124 },
  { name: 'Thrissur', enq: 152, feas: 138, nf: 14, act: 112, conn: 107 },
  { name: 'Malappuram', enq: 148, feas: 130, nf: 18, act: 105, conn: 99 },
  { name: 'Kannur', enq: 130, feas: 118, nf: 12, act: 96, conn: 92 },
  { name: 'Palakkad', enq: 120, feas: 108, nf: 12, act: 90, conn: 86 },
  { name: 'Kottayam', enq: 98, feas: 88, nf: 10, act: 74, conn: 70 },
  { name: 'Kasaragod', enq: 88, feas: 80, nf: 8, act: 66, conn: 62 },
  { name: 'Alappuzha', enq: 78, feas: 70, nf: 8, act: 58, conn: 55 },
  { name: 'Kollam', enq: 72, feas: 64, nf: 8, act: 52, conn: 50 },
  { name: 'Idukki', enq: 52, feas: 46, nf: 6, act: 36, conn: 34 },
  { name: 'Wayanad', enq: 48, feas: 42, nf: 6, act: 32, conn: 30 },
  { name: 'Pathanamthitta', enq: 44, feas: 38, nf: 6, act: 28, conn: 26 }
];

const LNP_BY_DISTRICT = {
  Thiruvananthapuram: [
    ['Vishnu Networks', 'Star AGNP TVM', 62, 56, 6, 44, 71, 42, 68],
    ['Bright Fiber TVM', 'Star AGNP TVM', 58, 52, 6, 40, 69, 38, 66],
    ['ConnectSouth', 'Alpha AGNP TVM', 50, 44, 6, 38, 76, 35, 70],
    ['SkyLink TVM', 'Alpha AGNP TVM', 40, 38, 2, 33, 83, 33, 83]
  ],
  Ernakulam: [
    ['FastNet EKM', 'Prime AGNP EKM', 60, 54, 6, 44, 73, 42, 70],
    ['DataLink EKM', 'Prime AGNP EKM', 55, 50, 5, 40, 73, 38, 69],
    ['NetWorld EKM', 'Vision AGNP EKM', 48, 42, 6, 36, 75, 34, 71],
    ['QuickFiber EKM', 'Vision AGNP EKM', 35, 32, 3, 25, 71, 24, 69]
  ],
  Kozhikode: [
    ['Kerala Net KZD', 'North AGNP KZD', 55, 50, 5, 38, 69, 36, 65],
    ['CaliCon KZD', 'North AGNP KZD', 48, 42, 6, 34, 71, 32, 67],
    ['FiberCity KZD', 'West AGNP KZD', 40, 36, 4, 30, 75, 28, 70],
    ['SpeedNet KZD', 'West AGNP KZD', 32, 30, 2, 28, 88, 28, 88]
  ]
};

const FE_LIST = [
  {
    code: 'FETVM01',
    name: 'Rajeev Kumar',
    dist: 'Thiruvananthapuram',
    dc: 'Suresh Nair',
    enq: 62,
    feas: 56,
    nf: 6,
    act: 44,
    conn: 42
  },
  {
    code: 'FETVM02',
    name: 'Priya Menon',
    dist: 'Thiruvananthapuram',
    dc: 'Suresh Nair',
    enq: 58,
    feas: 52,
    nf: 6,
    act: 40,
    conn: 38
  },
  {
    code: 'FEEKM01',
    name: 'Arun Pillai',
    dist: 'Ernakulam',
    dc: 'Sreejith KP',
    enq: 60,
    feas: 54,
    nf: 6,
    act: 44,
    conn: 42
  },
  {
    code: 'FEEKM02',
    name: 'Lekshmi S',
    dist: 'Ernakulam',
    dc: 'Sreejith KP',
    enq: 55,
    feas: 50,
    nf: 5,
    act: 40,
    conn: 38
  },
  {
    code: 'FEKZD01',
    name: 'Nasrin TK',
    dist: 'Kozhikode',
    dc: 'Anvar Ali',
    enq: 52,
    feas: 46,
    nf: 6,
    act: 38,
    conn: 36
  },
  {
    code: 'FEKZD02',
    name: 'Mohammed Shan',
    dist: 'Kozhikode',
    dc: 'Anvar Ali',
    enq: 48,
    feas: 42,
    nf: 6,
    act: 34,
    conn: 32
  },
  {
    code: 'FETSRR01',
    name: 'Aishwarya Raj',
    dist: 'Thrissur',
    dc: 'Biju Thomas',
    enq: 50,
    feas: 46,
    nf: 4,
    act: 36,
    conn: 34
  },
  {
    code: 'FEMLP01',
    name: 'Shahina K',
    dist: 'Malappuram',
    dc: 'Firoz PT',
    enq: 48,
    feas: 42,
    nf: 6,
    act: 36,
    conn: 34
  }
];

const STATUS_CARDS = [
  {
    key: 'enq',
    name: 'Enquiry',
    val: '1,536',
    pct: '100%',
    tone: 'rose',
    bg: 'linear-gradient(135deg,#ffffff 0%,#fff0f4 55%,#ffe5ec 100%)',
    breakdown: [
      { lbl: '🆕 New / Awaiting', val: 226, color: '#e94e77' },
      { lbl: '⏳ L1 In Progress', val: 148 },
      { lbl: '➡ Moved to FE', val: 1162 }
    ]
  },
  {
    key: 'feas',
    name: 'Feasible',
    val: '1,280',
    pct: '83%',
    tone: 'info',
    bg: 'linear-gradient(135deg,#ffffff 0%,#eef4fb 55%,#dde8f2 100%)',
    breakdown: [
      { lbl: '✅ Confirmed', val: 1280, color: '#5b8cb8' },
      { lbl: '⏳ FE Visit Pending', val: 56 },
      { lbl: '📋 CAF to Issue', val: 140 }
    ]
  },
  {
    key: 'nf',
    name: 'Not Feasible',
    val: '200',
    pct: '13%',
    tone: 'coral',
    accent: true,
    bg: 'linear-gradient(135deg,#ffffff 0%,#fff5f5 55%,#ffe2e4 100%)',
    valColor: COLORS.rose,
    breakdown: [
      { lbl: '🏠 Out of Station', val: 48, color: '#f76c7a' },
      { lbl: '📵 Not Reachable', val: 38, color: '#f76c7a' },
      { lbl: '🙅 Not Interested', val: 52 },
      { lbl: '🕐 Not Required Now', val: 42 },
      { lbl: '⚙️ Technical Block', val: 20 }
    ]
  },
  {
    key: 'caf',
    name: 'CAF',
    val: '1,140',
    pct: '74%',
    tone: 'lav',
    bg: 'linear-gradient(135deg,#ffffff 0%,#f2f0fd 55%,#e5e0fa 100%)',
    breakdown: [
      { lbl: '✅ Completed', val: 1044, color: COLORS.ldeep },
      { lbl: '🔄 Partial', val: 62, color: COLORS.adeep },
      { lbl: '⏳ Pending', val: 34, color: COLORS.coral }
    ]
  },
  {
    key: 'kyc',
    name: 'KYC',
    val: '1,044',
    pct: '68%',
    tone: 'amber',
    bg: 'linear-gradient(135deg,#ffffff 0%,#fffbf0 55%,#fff0cf 100%)',
    breakdown: [
      { lbl: '✅ Verified', val: 1010, color: COLORS.mdeep },
      { lbl: '📂 Docs Pending', val: 34, color: COLORS.coral }
    ]
  },
  {
    key: 'act',
    name: 'Activated',
    val: '998',
    pct: '65%',
    tone: 'teal',
    bg: 'linear-gradient(135deg,#ffffff 0%,#edfbfc 55%,#d6f2f4 100%)',
    breakdown: [
      { lbl: '🟢 LNP Active', val: 998, color: COLORS.tdeep },
      { lbl: '💳 Awaiting Recharge', val: 34, color: COLORS.adeep },
      { lbl: '🔧 Device Pending', val: 12 }
    ]
  }
];

const TIMELINE = [
  {
    name: 'Within 24 Hrs',
    sub: 'Flash connect',
    tone: 'mint',
    pct: '8.9%',
    val: 86,
    paid: 100,
    pend: 0,
    status: 'good'
  },
  {
    name: 'Within 48 Hrs',
    sub: 'Fast connect',
    tone: 'teal',
    pct: '15.4%',
    val: 148,
    paid: 100,
    pend: 0,
    status: 'good'
  },
  { name: 'Within 72 Hrs', sub: 'Standard', tone: 'info', pct: '20.3%', val: 196, paid: 100, pend: 0, status: 'good' },
  {
    name: 'Within 1 Week',
    sub: 'Normal pace',
    tone: 'lav',
    pct: '32.4%',
    val: 312,
    paid: 100,
    pend: 0,
    status: 'warn'
  },
  { name: 'Within 2 Weeks', sub: 'Delayed', tone: 'amber', pct: '15.4%', val: 148, paid: 63, pend: 37, status: 'warn' },
  {
    name: 'Above 2 Weeks',
    sub: 'Needs action',
    tone: 'coral',
    pct: '7.7%',
    val: 74,
    paid: 10,
    pend: 90,
    status: 'bad',
    alert: true
  }
];

const STAGE_DIST = [
  { lbl: 'Enquiry Pending', val: 88, pct: 57, c: COLORS.rose },
  { lbl: 'Feasibility Pending', val: 72, pct: 47, c: COLORS.info },
  { lbl: 'CAF In Progress', val: 60, pct: 39, c: COLORS.lav },
  { lbl: 'KYC Verification', val: 58, pct: 38, c: COLORS.amber },
  { lbl: 'Awaiting Activation', val: 56, pct: 36, c: COLORS.teal },
  { lbl: 'Recharge Pending', val: 38, pct: 25, c: COLORS.mint }
];

const AGE_BUCKETS = [
  { lbl: '0 – 3 days', val: 128, pct: 34, c: COLORS.mint, color: COLORS.mdeep },
  { lbl: '4 – 7 days', val: 116, pct: 31, c: COLORS.info, color: COLORS.ideep },
  { lbl: '8 – 14 days', val: 85, pct: 23, c: COLORS.amber, color: COLORS.adeep },
  { lbl: '15 – 21 days', val: 28, pct: 8, c: COLORS.coral, color: COLORS.cdeep },
  { lbl: '21+ days', val: 15, pct: 4, c: COLORS.rose, color: COLORS.rdeep }
];

const PEND_REASONS = [
  { lbl: '📄 Document Pending', val: 88, color: COLORS.adeep },
  { lbl: '📵 Customer Not Reachable', val: 74, color: COLORS.rose },
  { lbl: '👤 FE Not Assigned', val: 58, color: COLORS.amber },
  { lbl: '🔒 LNP Capacity Full', val: 46, color: COLORS.ldeep },
  { lbl: '⚙️ Technical Issue', val: 36, color: COLORS.ideep },
  { lbl: '💳 Payment Pending', val: 28, color: COLORS.tdeep },
  { lbl: '🔁 Other / Follow-up', val: 42, color: COLORS.inkf }
];

const ICON_BG = {
  rose: COLORS.rose,
  info: COLORS.info,
  coral: COLORS.coral,
  lav: COLORS.lav,
  amber: COLORS.amber,
  teal: COLORS.teal,
  mint: COLORS.mint
};

const SectionHeader = ({ title, sub, right }) => (
  <HStack justify='space-between' align='center' mb='12px'>
    <HStack gap='9px'>
      <Box w='4px' h='18px' borderRadius='2px' bg={COLORS.m7} />
      <Box>
        <Text fontSize='22px' fontWeight='400' letterSpacing='-0.3px' color={COLORS.m8}>
          {title}
        </Text>
        <Text fontSize='12.5px' color={COLORS.inkf} mt='2px'>
          {sub}
        </Text>
      </Box>
    </HStack>
    {right && <HStack gap='7px'>{right}</HStack>}
  </HStack>
);

const PVCCard = ({ tone, chip, label, big, sub, c1, c2, l1, l2, rate, gradient }) => (
  <Box
    borderRadius='16px'
    position='relative'
    overflow='hidden'
    minH='160px'
    display='flex'
    flexDirection='column'
    boxShadow='0 8px 28px rgba(0,0,0,0.15)'
    cursor='pointer'
    transition='all 0.2s'
    bg={gradient}
    _hover={{ transform: 'translateY(-4px)', boxShadow: '0 16px 36px rgba(0,0,0,0.2)' }}
  >
    <Box
      position='absolute'
      right='-28px'
      top='-28px'
      w='110px'
      h='110px'
      borderRadius='50%'
      bg='rgba(255,255,255,0.12)'
      pointerEvents='none'
    />
    <Box
      position='absolute'
      left='16px'
      bottom='-32px'
      w='80px'
      h='80px'
      borderRadius='50%'
      bg='rgba(255,255,255,0.07)'
      pointerEvents='none'
    />
    <Box p='18px 20px 16px' position='relative' zIndex={1} h='100%' display='flex' flexDirection='column'>
      <HStack justify='space-between' align='flex-start' mb='10px'>
        <Box
          w='36px'
          h='36px'
          borderRadius='10px'
          bg='rgba(255,255,255,0.18)'
          border='1px solid rgba(255,255,255,0.25)'
          display='flex'
          alignItems='center'
          justifyContent='center'
          fontSize='18px'
          color='#fff'
        >
          {tone === 'today' ? '📅' : tone === 'week' ? '⚡' : tone === 'month' ? '📊' : '⏱'}
        </Box>
        <Box
          fontSize='10.5px'
          fontWeight='800'
          letterSpacing='0.8px'
          textTransform='uppercase'
          px='9px'
          py='3px'
          borderRadius='100px'
          bg='rgba(255,255,255,0.18)'
          border='1px solid rgba(255,255,255,0.25)'
          color='rgba(255,255,255,0.9)'
        >
          {chip}
        </Box>
      </HStack>
      <Text
        fontSize='11px'
        fontWeight='800'
        letterSpacing='1px'
        textTransform='uppercase'
        color='rgba(255,255,255,0.65)'
        mb='4px'
      >
        {label}
      </Text>
      <Text fontSize='40px' lineHeight='1' letterSpacing='-1px' color='#fff' mb='3px'>
        {big}
      </Text>
      <Text fontSize='12px' color='rgba(255,255,255,0.6)' fontWeight='500' mb='10px'>
        {sub}
      </Text>
      <Box borderTop='1px solid rgba(255,255,255,0.2)' my='8px' />
      <Box display='grid' gridTemplateColumns='1fr 1fr'>
        <Box textAlign='center' px='6px' borderRight='1px solid rgba(255,255,255,0.2)'>
          <Text fontSize='26px' lineHeight='1' color='#fff' mb='3px'>
            {c1}
          </Text>
          <Text
            fontSize='11px'
            fontWeight='700'
            color='rgba(255,255,255,0.65)'
            textTransform='uppercase'
            letterSpacing='0.4px'
          >
            {l1}
          </Text>
        </Box>
        <Box textAlign='center' px='6px'>
          <Text fontSize='26px' lineHeight='1' color='#fff' mb='3px'>
            {c2}
          </Text>
          <Text
            fontSize='11px'
            fontWeight='700'
            color='rgba(255,255,255,0.65)'
            textTransform='uppercase'
            letterSpacing='0.4px'
          >
            {l2}
          </Text>
        </Box>
      </Box>
      <HStack justify='space-between' mt='auto' pt='10px' borderTop='1px solid rgba(255,255,255,0.18)'>
        <Text fontSize='11.5px' fontWeight='600' color='rgba(255,255,255,0.65)'>
          Conversion rate
        </Text>
        <Text
          fontSize='13px'
          fontWeight='800'
          px='10px'
          py='2px'
          borderRadius='100px'
          bg='rgba(255,255,255,0.18)'
          border='1px solid rgba(255,255,255,0.25)'
          color='#fff'
        >
          {rate}
        </Text>
      </HStack>
    </Box>
  </Box>
);

const PctBadge = ({ status, children }) => {
  const map = {
    good: { bg: COLORS.msoft, color: COLORS.mdeep, border: '#9ad5b8' },
    warn: { bg: COLORS.asoft, color: COLORS.adeep, border: '#f5dc99' },
    bad: { bg: COLORS.rsoft, color: COLORS.rdeep, border: '#f5b9cc' }
  };
  const s = map[status] || map.good;
  return (
    <Box
      fontSize='13px'
      fontWeight='800'
      px='9px'
      py='3px'
      borderRadius='100px'
      border={`1.5px solid ${s.border}`}
      bg={s.bg}
      color={s.color}
      whiteSpace='nowrap'
      flexShrink={0}
    >
      {children}
    </Box>
  );
};

const StatusCard = ({ card, isHovered, onMouseEnter, onMouseLeave }) => {
  const iconBg = ICON_BG[card.tone] || COLORS.rose;
  return (
    <Box
      bg={card.bg}
      border={card.accent ? `1.5px solid ${COLORS.rose}` : `1.5px solid ${COLORS.line}`}
      borderRadius='14px'
      p='14px 14px 13px'
      display='flex'
      flexDirection='column'
      gap='11px'
      position='relative'
      overflow='hidden'
      boxShadow='0 2px 8px rgba(74,15,42,0.04)'
      transition='all 0.18s'
      cursor='default'
      _hover={{ transform: 'translateY(-2px)', boxShadow: '0 6px 18px rgba(107,26,61,0.09)' }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {card.accent && (
        <Box
          position='absolute'
          top='0'
          left='0'
          right='0'
          h='3px'
          bgGradient={`linear(90deg, ${COLORS.rose}, ${COLORS.coral})`}
          bg={`linear-gradient(90deg, ${COLORS.rose}, ${COLORS.coral})`}
          borderTopRadius='14px'
        />
      )}
      <HStack gap='8px' align='center'>
        <Box
          w='28px'
          h='28px'
          borderRadius='8px'
          bg={iconBg}
          display='flex'
          alignItems='center'
          justifyContent='center'
          color='#fff'
          flexShrink={0}
          boxShadow='0 2px 6px rgba(0,0,0,0.12)'
          fontSize='15px'
        >
          ●
        </Box>
        <Text
          fontSize='13px'
          fontWeight='800'
          letterSpacing='0.3px'
          textTransform='uppercase'
          color={COLORS.inks}
          lineHeight='1'
        >
          {card.name}
        </Text>
      </HStack>
      <HStack justify='space-between' align='baseline'>
        <Text fontSize='32px' letterSpacing='-0.8px' lineHeight='1' color={card.valColor || COLORS.ink}>
          {card.val}
        </Text>
        <PctBadge status={card.tone === 'coral' ? 'bad' : 'good'}>{card.pct}</PctBadge>
      </HStack>
      <Box
        display='flex'
        flexDirection='column'
        gap='4px'
        maxH={isHovered ? '160px' : '0'}
        overflow={isHovered ? 'auto' : 'hidden'}
        opacity={isHovered ? 1 : 0}
        transition='all 0.2s ease'
        borderTop={isHovered ? `1px solid ${COLORS.line}` : 'none'}
        pt={isHovered ? '8px' : '0'}
        mt={isHovered ? '4px' : '0'}
      >
        {card.breakdown.map((b) => (
          <HStack
            key={b.lbl}
            justify='space-between'
            align='center'
            p='4px 8px'
            borderRadius='6px'
            bg={COLORS.lines}
            fontSize='13px'
          >
            <Text color={COLORS.inks} fontWeight='500' fontSize='12.5px'>
              {b.lbl}
            </Text>
            <Text fontWeight='700' fontSize='13px' color={b.color || COLORS.ink}>
              {b.val}
            </Text>
          </HStack>
        ))}
      </Box>
    </Box>
  );
};

const TimelineCard = ({ tone, name, sub, pct, val, paid, pend, status, alert }) => {
  const iconBg = ICON_BG[tone] || COLORS.mint;
  const pctColor = status === 'good' ? COLORS.mdeep : status === 'warn' ? COLORS.adeep : COLORS.rdeep;
  return (
    <Box
      bg={COLORS.card}
      border={alert ? `1.5px solid ${COLORS.rose}` : `1.5px solid ${COLORS.line}`}
      borderRadius='14px'
      p='16px 18px 14px'
      position='relative'
      overflow='hidden'
      boxShadow={alert ? '0 6px 18px -6px rgba(233,78,119,0.2)' : '0 2px 8px rgba(74,15,42,0.04)'}
      transition='all 0.2s'
      _hover={{ transform: 'translateY(-2px)', boxShadow: '0 6px 18px rgba(107,26,61,0.08)' }}
    >
      {alert && (
        <Box
          position='absolute'
          top='0'
          left='0'
          right='0'
          h='3px'
          bg={`linear-gradient(90deg, ${COLORS.rose}, ${COLORS.coral})`}
          borderTopRadius='14px'
        />
      )}
      <HStack gap='9px' align='flex-start' mb='12px'>
        <Box
          w='32px'
          h='32px'
          borderRadius='9px'
          bg={iconBg}
          color='#fff'
          display='flex'
          alignItems='center'
          justifyContent='center'
          flexShrink={0}
          boxShadow='0 2px 7px rgba(0,0,0,0.12)'
          fontSize='16px'
        >
          ●
        </Box>
        <Box>
          <Text
            fontSize='13.5px'
            fontWeight='800'
            color={COLORS.ink}
            letterSpacing='0.3px'
            textTransform='uppercase'
            lineHeight='1.2'
          >
            {name}
          </Text>
          <Text fontSize='11.5px' color={COLORS.inks} mt='2px'>
            {sub}
          </Text>
        </Box>
      </HStack>
      <Box
        bg={alert ? COLORS.rbg : COLORS.paper}
        border={alert ? `1px solid #f5b9cc` : `1px solid ${COLORS.line}`}
        borderRadius='10px'
        p='11px 14px'
        mb='12px'
      >
        <Text
          fontSize='11px'
          fontWeight='800'
          letterSpacing='0.9px'
          textTransform='uppercase'
          color={COLORS.inkf}
          mb='5px'
        >
          Connected
        </Text>
        <HStack align='baseline' gap='8px' mt='2px'>
          <Text fontSize='30px' letterSpacing='-0.7px' lineHeight='1' color={COLORS.m8}>
            {val}
          </Text>
          <Text fontSize='15px' fontWeight='800' letterSpacing='0.2px' color={pctColor}>
            {pct}
          </Text>
        </HStack>
      </Box>
      <Box h='7px' borderRadius='100px' bg={COLORS.lines} overflow='hidden' display='flex'>
        <Box bg={`linear-gradient(90deg, ${COLORS.mint}, #3da070)`} h='100%' w={`${paid}%`} />
        <Box
          bg={
            alert
              ? `linear-gradient(90deg, ${COLORS.rose}, #d63d64)`
              : `linear-gradient(90deg, #ff8fa5, ${COLORS.rose})`
          }
          h='100%'
          w={`${pend}%`}
        />
      </Box>
    </Box>
  );
};

const Th = ({ children }) => (
  <Box
    as='th'
    p='9px 12px'
    textAlign='left'
    fontSize='11.5px'
    fontWeight='800'
    letterSpacing='0.6px'
    textTransform='uppercase'
    color='rgba(255,255,255,0.85)'
    bg={COLORS.m7}
    whiteSpace='nowrap'
  >
    {children}
  </Box>
);

const Td = ({ children, ...rest }) => (
  <Box as='td' p='10px 12px' fontSize='14.5px' color={COLORS.ink} verticalAlign='middle' {...rest}>
    {children}
  </Box>
);

const PctBar = ({ pct, color }) => (
  <HStack gap='5px' align='center'>
    <Box w='60px' h='5px' borderRadius='100px' bg={COLORS.lines} overflow='hidden' display='inline-block'>
      <Box h='100%' w={`${pct}%`} bg={color} borderRadius='100px' />
    </Box>
    <Text fontSize='13px' color={color}>
      {pct}%
    </Text>
  </HStack>
);

const RateBadge = ({ pct }) => {
  const ok = pct >= 65;
  return (
    <Box
      display='inline-flex'
      alignItems='center'
      gap='3px'
      px='9px'
      py='3px'
      borderRadius='100px'
      fontSize='12px'
      fontWeight='800'
      bg={ok ? COLORS.msoft : COLORS.asoft}
      color={ok ? COLORS.mdeep : COLORS.adeep}
    >
      {pct.toFixed(1)}%
    </Box>
  );
};

const PendingRow = ({ lbl, val, pct, c, color }) => (
  <Box mb='7px'>
    <HStack justify='space-between' mb='4px'>
      <Text fontSize='14px' fontWeight='600' color={color || COLORS.ink}>
        {lbl}
      </Text>
      <Text fontWeight='700' fontSize='14px' color={color || c}>
        {val}
      </Text>
    </HStack>
    <Box h='6px' borderRadius='100px' bg={COLORS.lines} overflow='hidden'>
      <Box h='100%' w={`${pct}%`} bg={c} borderRadius='100px' />
    </Box>
  </Box>
);

const EnquiryDashboard = () => {
  const [period, setPeriod] = useState('today');
  const [hoveredCard, setHoveredCard] = useState(null);
  const [districtFilter, setDistrictFilter] = useState('');
  const [feFilter, setFeFilter] = useState('');
  const [drillDistrict, setDrillDistrict] = useState(null);

  const pd = PERIOD_DATA[period];

  const filteredDistricts = useMemo(() => {
    if (!districtFilter) return DISTRICTS;
    return DISTRICTS.filter((d) => d.name === districtFilter);
  }, [districtFilter]);

  const filteredFE = useMemo(() => {
    if (!feFilter || feFilter === 'All Districts') return FE_LIST;
    return FE_LIST.filter((f) => f.dist === feFilter);
  }, [feFilter]);

  const drillRows = drillDistrict ? LNP_BY_DISTRICT[drillDistrict] || [] : [];

  return (
    <Box
      bg={COLORS.paper}
      p='20px 24px 36px'
      minH='100vh'
      color={COLORS.ink}
      fontSize='15px'
    >
      {/* PERIOD TABS */}
      <HStack justify='flex-end' mb='22px' gap='6px'>
        <HStack bg='rgba(0,0,0,0.06)' borderRadius='8px' p='3px' gap='1px'>
          {['today', 'week', 'month', 'year'].map((p) => (
            <Box
              key={p}
              as='button'
              onClick={() => setPeriod(p)}
              px='12px'
              py='5px'
              borderRadius='6px'
              fontSize='13px'
              fontWeight={period === p ? '700' : '600'}
              color={period === p ? COLORS.m8 : 'rgba(0,0,0,0.55)'}
              bg={period === p ? '#fff' : 'transparent'}
              boxShadow={period === p ? '0 1px 4px rgba(0,0,0,0.12)' : 'none'}
              cursor='pointer'
              border='none'
              textTransform='capitalize'
            >
              {p}
            </Box>
          ))}
        </HStack>
      </HStack>

      <VStack align='stretch' gap='22px'>
        {/* SECTION A — VIBRANT CARDS */}
        <Box>
          <SectionHeader
            title='Section A — Total Enquiries vs Connected'
            sub='Period snapshot — enquiry received vs successfully connected'
          />
          <Box display='grid' gridTemplateColumns='repeat(4, 1fr)' gap='14px'>
            <PVCCard
              tone='today'
              chip='Today'
              label='Enquiries Received'
              big={pd.enq}
              sub='Received today · 04-May-2026'
              c1={pd.con}
              l1='Connected'
              c2='36'
              l2='In Progress'
              rate={pd.rate}
              gradient={`linear-gradient(135deg, ${COLORS.rose}, #f97316)`}
            />
            <PVCCard
              tone='week'
              chip='This Week'
              label='Enquiries Received'
              big={pd.wenq}
              sub='28-Apr — 04-May 2026'
              c1={pd.wcon}
              l1='Connected'
              c2='164'
              l2='Pending'
              rate={pd.wrate}
              gradient={`linear-gradient(135deg, ${COLORS.lav}, ${COLORS.blue})`}
            />
            <PVCCard
              tone='month'
              chip='This Month'
              label='Enquiries Received'
              big={pd.menq}
              sub='May 2026 · 14 Districts'
              c1={pd.mcon}
              l1='Connected'
              c2='200'
              l2='Not Feasible'
              rate={pd.mrate}
              gradient={`linear-gradient(135deg, ${COLORS.teal}, ${COLORS.mint})`}
            />
            <PVCCard
              tone='year'
              chip='This Year'
              label='Enquiries Received'
              big={pd.yenq}
              sub='2026 · All Kerala'
              c1={pd.ycon}
              l1='Connected'
              c2='5,320'
              l2='Pending/NF'
              rate={pd.yrate}
              gradient={`linear-gradient(135deg, ${COLORS.m7}, ${COLORS.rose})`}
            />
          </Box>
        </Box>

        {/* SECTION C — STATUS DISTRIBUTION */}
        <Box>
          <SectionHeader
            title='Section C — Status-wise Distribution'
            sub='Count & % always visible · hover any card to reveal sub-status breakdown'
          />
          <Box display='grid' gridTemplateColumns='1fr 1fr 1fr 192px' gridTemplateRows='auto auto' gap='10px'>
            {/* Row 1: Enquiry, Feasible, Not Feasible | Connected (spans 2 rows) */}
            {STATUS_CARDS.slice(0, 3).map((c) => (
              <StatusCard
                key={c.key}
                card={c}
                isHovered={hoveredCard === c.key}
                onMouseEnter={() => setHoveredCard(c.key)}
                onMouseLeave={() => setHoveredCard(null)}
              />
            ))}
            {/* Connected card (taller, spans both rows) */}
            <Box gridColumn={4} gridRow='1 / 3' display='flex' flexDirection='column'>
              <Box
                flex={1}
                bg={`linear-gradient(160deg, ${COLORS.msoft}, #f0fdf9)`}
                border={`1.5px solid #9ad5b8`}
                borderRadius='14px'
                p='14px'
                display='flex'
                flexDirection='column'
                gap='10px'
                boxShadow='0 2px 8px rgba(74,15,42,0.04)'
              >
                <HStack gap='8px' align='center'>
                  <Box
                    w='28px'
                    h='28px'
                    borderRadius='8px'
                    bg={COLORS.mint}
                    color='#fff'
                    display='flex'
                    alignItems='center'
                    justifyContent='center'
                    flexShrink={0}
                    boxShadow='0 2px 6px rgba(0,0,0,0.12)'
                    fontSize='15px'
                  >
                    ✓
                  </Box>
                  <Text
                    fontSize='13px'
                    fontWeight='800'
                    letterSpacing='0.3px'
                    textTransform='uppercase'
                    color={COLORS.mdeep}
                    lineHeight='1'
                  >
                    Connected
                  </Text>
                </HStack>
                <HStack justify='space-between' align='baseline'>
                  <Text fontSize='38px' letterSpacing='-0.8px' lineHeight='1' color={COLORS.mdeep}>
                    964
                  </Text>
                  <PctBadge status='good'>62.8%</PctBadge>
                </HStack>
                <Text fontSize='12px' color={COLORS.mdeep} opacity={0.7} fontWeight='500' mt='-4px'>
                  Active · Recharged · Live
                </Text>
                <Box h='5px' borderRadius='100px' bg='rgba(0,0,0,0.06)' overflow='hidden' mt='-2px'>
                  <Box h='100%' w='63%' bg={COLORS.mint} borderRadius='100px' />
                </Box>
                <VStack align='stretch' gap='4px' mt='2px'>
                  <HStack justify='space-between'>
                    <Text fontSize='13px' color={COLORS.inks}>
                      Home Basic
                    </Text>
                    <Text fontWeight='700' fontSize='13px'>
                      412
                    </Text>
                  </HStack>
                  <HStack justify='space-between'>
                    <Text fontSize='13px' color={COLORS.inks}>
                      Home Plus
                    </Text>
                    <Text fontWeight='700' fontSize='13px'>
                      318
                    </Text>
                  </HStack>
                  <HStack justify='space-between'>
                    <Text fontSize='13px' color={COLORS.inks}>
                      Home Ultra
                    </Text>
                    <Text fontWeight='700' fontSize='13px'>
                      234
                    </Text>
                  </HStack>
                  <HStack justify='space-between' pt='8px' mt='4px' borderTop='1px dashed #9ad5b8'>
                    <Text fontSize='13px' fontWeight='800' color={COLORS.mdeep}>
                      Monthly Revenue
                    </Text>
                    <Text fontWeight='700' fontSize='13px' color={COLORS.mdeep}>
                      ₹29.5L
                    </Text>
                  </HStack>
                </VStack>
              </Box>
            </Box>
            {/* Row 2: CAF, KYC, Activated */}
            {STATUS_CARDS.slice(3).map((c) => (
              <StatusCard
                key={c.key}
                card={c}
                isHovered={hoveredCard === c.key}
                onMouseEnter={() => setHoveredCard(c.key)}
                onMouseLeave={() => setHoveredCard(null)}
              />
            ))}
          </Box>
        </Box>

        {/* SECTION D — TIMELINE */}
        <Box>
          <SectionHeader
            title='Section D — Enquiry to Connection Timeline'
            sub='How fast are we connecting? — 964 active subscribers'
          />
          <Box display='grid' gridTemplateColumns='repeat(6, 1fr)' gap='12px'>
            {TIMELINE.map((t) => (
              <TimelineCard key={t.name} {...t} />
            ))}
          </Box>
        </Box>

        {/* SECTION E — DISTRICT TABLE */}
        <Box>
          <SectionHeader
            title='Section E — District-wise Report'
            sub='Click any district row to drill down to LNP / AGNP details'
            right={
              <>
                <Box
                  as='select'
                  px='12px'
                  py='6px'
                  border={`1px solid ${COLORS.line}`}
                  borderRadius='100px'
                  fontSize='13.5px'
                  fontWeight='600'
                  color={COLORS.m7}
                  bg={COLORS.card}
                  cursor='pointer'
                  outline='none'
                  value={districtFilter}
                  onChange={(e) => setDistrictFilter(e.target.value)}
                >
                  <option value=''>All Districts</option>
                  {DISTRICTS.map((d) => (
                    <option key={d.name} value={d.name}>
                      {d.name}
                    </option>
                  ))}
                </Box>
                <Button
                  px='13px'
                  py='6px'
                  borderRadius='100px'
                  border={`1px solid ${COLORS.line}`}
                  bg={COLORS.card}
                  color={COLORS.m7}
                  fontSize='13.5px'
                  fontWeight='600'
                  h='auto'
                >
                  ⬇ CSV
                </Button>
              </>
            }
          />
          <Box
            bg={COLORS.card}
            border={`1.5px solid ${COLORS.line}`}
            borderRadius='14px'
            overflow='hidden'
            boxShadow='0 2px 8px rgba(74,15,42,0.04)'
          >
            <Box overflowX='auto'>
              <Box as='table' w='full' borderCollapse='collapse' minW='580px'>
                <Box as='thead'>
                  <Box as='tr'>
                    <Th>#</Th>
                    <Th>District</Th>
                    <Th>Total Enq.</Th>
                    <Th>Feasible</Th>
                    <Th>Not Feasible</Th>
                    <Th>Activated</Th>
                    <Th>Act %</Th>
                    <Th>Connected</Th>
                    <Th>Conn %</Th>
                    <Th>Conv. Rate</Th>
                  </Box>
                </Box>
                <Box as='tbody'>
                  {filteredDistricts.map((d, i) => {
                    const ap = (d.act / d.enq) * 100;
                    const cp = (d.conn / d.enq) * 100;
                    const ac = ap >= 70 ? COLORS.mdeep : COLORS.adeep;
                    const cc = cp >= 65 ? COLORS.mdeep : COLORS.adeep;
                    return (
                      <Box
                        as='tr'
                        key={d.name}
                        borderBottom={`1px solid ${COLORS.lines}`}
                        cursor='pointer'
                        _hover={{ bg: COLORS.ybg }}
                        onClick={() => setDrillDistrict(d.name)}
                      >
                        <Td>
                          <Text fontSize='13px' color={COLORS.inkf}>
                            {String(i + 1).padStart(2, '0')}
                          </Text>
                        </Td>
                        <Td>
                          <Text fontWeight='600' color={COLORS.m7} textDecoration='underline'>
                            {d.name}
                          </Text>
                        </Td>
                        <Td>
                          <Text fontWeight='600' fontSize='14px' color={COLORS.rose}>
                            {d.enq}
                          </Text>
                        </Td>
                        <Td>
                          <Text fontWeight='600' fontSize='14px' color={COLORS.info}>
                            {d.feas}
                          </Text>
                        </Td>
                        <Td>
                          <Text fontWeight='600' fontSize='14px' color={COLORS.rose}>
                            {d.nf}
                          </Text>
                        </Td>
                        <Td>
                          <Text fontWeight='600' fontSize='14px' color={COLORS.teal}>
                            {d.act}
                          </Text>
                        </Td>
                        <Td>
                          <PctBar pct={Math.round(ap)} color={ac} />
                        </Td>
                        <Td>
                          <Text fontWeight='700' fontSize='14px' color={COLORS.mdeep}>
                            {d.conn}
                          </Text>
                        </Td>
                        <Td>
                          <PctBar pct={Math.round(cp)} color={cc} />
                        </Td>
                        <Td>
                          <RateBadge pct={cp} />
                        </Td>
                      </Box>
                    );
                  })}
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* SECTION F — FE PERFORMANCE */}
        <Box>
          <SectionHeader
            title='Section F — FE-wise Performance Report'
            sub='Field Engineer feasibility marking & connection performance'
            right={
              <>
                <Box
                  as='select'
                  px='12px'
                  py='6px'
                  border={`1px solid ${COLORS.line}`}
                  borderRadius='100px'
                  fontSize='13.5px'
                  fontWeight='600'
                  color={COLORS.m7}
                  bg={COLORS.card}
                  cursor='pointer'
                  outline='none'
                  value={feFilter}
                  onChange={(e) => setFeFilter(e.target.value)}
                >
                  <option value=''>All Districts</option>
                  <option value='Thiruvananthapuram'>Thiruvananthapuram</option>
                  <option value='Ernakulam'>Ernakulam</option>
                  <option value='Kozhikode'>Kozhikode</option>
                  <option value='Thrissur'>Thrissur</option>
                  <option value='Malappuram'>Malappuram</option>
                </Box>
                <Button
                  px='13px'
                  py='6px'
                  borderRadius='100px'
                  border={`1px solid ${COLORS.line}`}
                  bg={COLORS.card}
                  color={COLORS.m7}
                  fontSize='13.5px'
                  fontWeight='600'
                  h='auto'
                >
                  ⬇ CSV
                </Button>
              </>
            }
          />
          <Box
            bg={COLORS.card}
            border={`1.5px solid ${COLORS.line}`}
            borderRadius='14px'
            overflow='hidden'
            boxShadow='0 2px 8px rgba(74,15,42,0.04)'
          >
            <Box overflowX='auto'>
              <Box as='table' w='full' borderCollapse='collapse' minW='580px'>
                <Box as='thead'>
                  <Box as='tr'>
                    <Th>#</Th>
                    <Th>FE Code</Th>
                    <Th>FE Name</Th>
                    <Th>District</Th>
                    <Th>District Coordinator</Th>
                    <Th>Total Enq.</Th>
                    <Th>Feasible</Th>
                    <Th>Not Feasible</Th>
                    <Th>Activated</Th>
                    <Th>Act %</Th>
                    <Th>Connected</Th>
                    <Th>Conn %</Th>
                  </Box>
                </Box>
                <Box as='tbody'>
                  {filteredFE.map((f, i) => {
                    const ap = (f.act / f.enq) * 100;
                    const cp = (f.conn / f.enq) * 100;
                    const ac = ap >= 70 ? COLORS.mdeep : COLORS.adeep;
                    const cc = cp >= 65 ? COLORS.mdeep : COLORS.adeep;
                    return (
                      <Box
                        as='tr'
                        key={f.code}
                        borderBottom={`1px solid ${COLORS.lines}`}
                        cursor='pointer'
                        _hover={{ bg: COLORS.ybg }}
                      >
                        <Td>
                          <Text fontSize='13px' color={COLORS.inkf}>
                            {String(i + 1).padStart(2, '0')}
                          </Text>
                        </Td>
                        <Td>
                          <Text fontWeight='600' color={COLORS.m7}>
                            {f.code}
                          </Text>
                        </Td>
                        <Td>
                          <Text fontWeight='600'>{f.name}</Text>
                        </Td>
                        <Td>{f.dist}</Td>
                        <Td>
                          <Text color={COLORS.inks}>{f.dc}</Text>
                        </Td>
                        <Td>
                          <Text fontWeight='600' fontSize='14px' color={COLORS.rose}>
                            {f.enq}
                          </Text>
                        </Td>
                        <Td>
                          <Text fontWeight='600' fontSize='14px' color={COLORS.info}>
                            {f.feas}
                          </Text>
                        </Td>
                        <Td>
                          <Text fontWeight='600' fontSize='14px' color={COLORS.coral}>
                            {f.nf}
                          </Text>
                        </Td>
                        <Td>
                          <Text fontWeight='600' fontSize='14px' color={COLORS.teal}>
                            {f.act}
                          </Text>
                        </Td>
                        <Td>
                          <PctBar pct={Math.round(ap)} color={ac} />
                        </Td>
                        <Td>
                          <Text fontWeight='700' fontSize='14px' color={COLORS.mdeep}>
                            {f.conn}
                          </Text>
                        </Td>
                        <Td>
                          <PctBar pct={Math.round(cp)} color={cc} />
                        </Td>
                      </Box>
                    );
                  })}
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* SECTION G — PENDING ANALYSIS */}
        <Box>
          <SectionHeader
            title='Section G — Pending Analysis'
            sub='372 subscribers currently in pipeline — stage, age & reason'
          />
          <Box display='grid' gridTemplateColumns='1fr 1fr 1fr' gap='14px'>
            {/* Stage Distribution */}
            <Box
              bg={COLORS.card}
              border={`1.5px solid ${COLORS.line}`}
              borderRadius='14px'
              p='18px 20px'
              boxShadow='0 2px 8px rgba(74,15,42,0.04)'
            >
              <Text
                fontSize='13px'
                fontWeight='800'
                letterSpacing='0.6px'
                textTransform='uppercase'
                color={COLORS.inkf}
                mb='14px'
              >
                Stage Distribution
              </Text>
              {STAGE_DIST.map((row) => (
                <PendingRow key={row.lbl} {...row} />
              ))}
            </Box>
            {/* Age */}
            <Box
              bg={COLORS.card}
              border={`1.5px solid ${COLORS.line}`}
              borderRadius='14px'
              p='18px 20px'
              boxShadow='0 2px 8px rgba(74,15,42,0.04)'
            >
              <Text
                fontSize='13px'
                fontWeight='800'
                letterSpacing='0.6px'
                textTransform='uppercase'
                color={COLORS.inkf}
                mb='14px'
              >
                Age of Pending (Days)
              </Text>
              {AGE_BUCKETS.map((row) => (
                <Box key={row.lbl} mb='7px'>
                  <HStack justify='space-between' mb='4px'>
                    <Text fontSize='14px' fontWeight='600' color={row.color}>
                      {row.lbl}
                    </Text>
                    <Text fontWeight='700' fontSize='14px' color={row.color}>
                      {row.val}{' '}
                      <Box as='small' fontWeight='400' color={COLORS.inkf}>
                        ({row.pct}%)
                      </Box>
                    </Text>
                  </HStack>
                  <Box h='6px' borderRadius='100px' bg={COLORS.lines} overflow='hidden'>
                    <Box h='100%' w={`${row.pct}%`} bg={row.c} borderRadius='100px' />
                  </Box>
                </Box>
              ))}
              <HStack justify='space-between' pt='10px' mt='6px' borderTop={`1px dashed ${COLORS.line}`}>
                <Text fontWeight='700' fontSize='14.5px'>
                  Total Pending
                </Text>
                <Text fontWeight='700' color={COLORS.adeep}>
                  372
                </Text>
              </HStack>
            </Box>
            {/* Reasons */}
            <Box
              bg={COLORS.card}
              border={`1.5px solid ${COLORS.line}`}
              borderRadius='14px'
              p='18px 20px'
              boxShadow='0 2px 8px rgba(74,15,42,0.04)'
            >
              <Text
                fontSize='13px'
                fontWeight='800'
                letterSpacing='0.6px'
                textTransform='uppercase'
                color={COLORS.inkf}
                mb='14px'
              >
                Reason for Pending
              </Text>
              <VStack align='stretch' gap='5px'>
                {PEND_REASONS.map((r) => (
                  <HStack
                    key={r.lbl}
                    justify='space-between'
                    align='center'
                    p='5px 9px'
                    borderRadius='7px'
                    bg={COLORS.lines}
                  >
                    <Text fontSize='13px' color={COLORS.inks} fontWeight='500'>
                      {r.lbl}
                    </Text>
                    <Text fontWeight='700' fontSize='13.5px' color={r.color}>
                      {r.val}
                    </Text>
                  </HStack>
                ))}
              </VStack>
            </Box>
          </Box>
        </Box>
      </VStack>

      {/* DRILL-DOWN MODAL */}
      {drillDistrict && (
        <Box
          position='fixed'
          inset='0'
          bg='rgba(0,0,0,0.45)'
          zIndex={400}
          display='flex'
          alignItems='center'
          justifyContent='center'
          onClick={() => setDrillDistrict(null)}
        >
          <Box
            bg={COLORS.card}
            borderRadius='16px'
            w='820px'
            maxW='95vw'
            maxH='85vh'
            overflow='hidden'
            display='flex'
            flexDirection='column'
            boxShadow='0 20px 60px rgba(0,0,0,0.25)'
            onClick={(e) => e.stopPropagation()}
          >
            <HStack p='16px 20px' borderBottom={`1px solid ${COLORS.line}`} justify='space-between' align='center'>
              <Box>
                <Text fontSize='19px' color={COLORS.m8}>
                  LNP / AGNP Report — {drillDistrict}
                </Text>
                <Text fontSize='13px' color={COLORS.inkf} mt='2px'>
                  Drill-down: {drillRows.length} LNPs in {drillDistrict}
                </Text>
              </Box>
              <Box
                as='button'
                onClick={() => setDrillDistrict(null)}
                w='28px'
                h='28px'
                borderRadius='7px'
                border={`1.5px solid ${COLORS.line}`}
                bg={COLORS.card}
                cursor='pointer'
                display='flex'
                alignItems='center'
                justifyContent='center'
                color={COLORS.inkf}
                _hover={{ borderColor: COLORS.m7, color: COLORS.m7 }}
                fontSize='16px'
              >
                ✕
              </Box>
            </HStack>
            <Box overflowY='auto' p='16px 20px' flex={1}>
              <Box overflowX='auto'>
                <Box as='table' w='full' borderCollapse='collapse' minW='580px'>
                  <Box as='thead'>
                    <Box as='tr'>
                      <Th>#</Th>
                      <Th>LNP Name</Th>
                      <Th>AGNP Name</Th>
                      <Th>Total Enq.</Th>
                      <Th>Feasible</Th>
                      <Th>Not Feasible</Th>
                      <Th>Activated</Th>
                      <Th>Act %</Th>
                      <Th>Connected</Th>
                      <Th>Conn %</Th>
                    </Box>
                  </Box>
                  <Box as='tbody'>
                    {drillRows.length === 0 ? (
                      <Box as='tr'>
                        <Td colSpan={10} style={{ textAlign: 'center', padding: '20px', color: COLORS.inkf }}>
                          No LNP data available
                        </Td>
                      </Box>
                    ) : (
                      drillRows.map((r, i) => (
                        <Box as='tr' key={i} borderBottom={`1px solid ${COLORS.lines}`}>
                          <Td>
                            <Text color={COLORS.inkf}>{i + 1}</Text>
                          </Td>
                          <Td>
                            <Text fontWeight='600'>{r[0]}</Text>
                          </Td>
                          <Td>
                            <Text color={COLORS.inks}>{r[1]}</Text>
                          </Td>
                          <Td>
                            <Text fontWeight='600' color={COLORS.rose}>
                              {r[2]}
                            </Text>
                          </Td>
                          <Td>
                            <Text fontWeight='600' color={COLORS.info}>
                              {r[3]}
                            </Text>
                          </Td>
                          <Td>
                            <Text fontWeight='600' color={COLORS.coral}>
                              {r[4]}
                            </Text>
                          </Td>
                          <Td>
                            <Text fontWeight='600' color={COLORS.teal}>
                              {r[5]}
                            </Text>
                          </Td>
                          <Td>
                            <RateBadge pct={r[6]} />
                          </Td>
                          <Td>
                            <Text fontWeight='700' color={COLORS.mdeep}>
                              {r[7]}
                            </Text>
                          </Td>
                          <Td>
                            <RateBadge pct={r[8]} />
                          </Td>
                        </Box>
                      ))
                    )}
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default EnquiryDashboard;
