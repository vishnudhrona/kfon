import { Box, Flex, HStack, SimpleGrid, Text, VStack } from '@kfonbss/bss-ui-components';
import { useState } from 'react';

import { DIVS, GRADIENTS, MONTHLY, PALETTE, RES, SUBJECTS } from './data';
import { HeroGrid, PageHeader, PageShell, PeriodTabs, SectionBadge, SectionCard } from './shared';

const PERFORMANCE_HEROES = [
  { label: 'SLA Compliance', value: '68%', sub: 'Target: 80%', gradient: GRADIENTS.teal },
  { label: 'Avg Resolution', value: '18.4h', sub: 'First response: 2.1h', gradient: GRADIENTS.orange },
  { label: 'CSAT Score', value: '4.2/5', sub: 'Customer satisfaction', gradient: GRADIENTS.coral },
  { label: 'Tickets / L1', value: '38/day', sub: 'Average agent load', gradient: GRADIENTS.blue }
];

const ResCard = ({ r }) => (
  <HStack
    gap='12px'
    borderRadius='10px'
    p='13px 15px'
    bg={r.bg}
    border='1px solid'
    borderColor={`${r.c}25`}
  >
    <Flex
      w='50px'
      h='50px'
      borderRadius='50%'
      direction='column'
      align='center'
      justify='center'
      bg={`${r.c}20`}
      border='3px solid'
      borderColor={`${r.c}30`}
      flexShrink={0}
    >
      <Text fontSize='16px' fontWeight='900' lineHeight='1' color={r.c}>{r.pct}</Text>
      <Text fontSize='9px' fontWeight='700' opacity={0.75} color={r.c}>%</Text>
    </Flex>
    <Box>
      <Text fontSize='11px' fontWeight='700' color={PALETTE.tx}>{r.label}</Text>
      <Text fontSize='10px' color={PALETTE.tx3} mt='2px'>{r.desc}</Text>
    </Box>
  </HStack>
);

const ResStatsCols = ({ period }) => {
  const a = period === 'today' ? '14.2' : period === 'week' ? '16.8' : '18.4';
  const f = period === 'today' ? '1.8' : period === 'week' ? '2.0' : '2.1';
  const items = [
    { l: 'Avg Resolution', v: `${a}h`, c: '#FF6B00', bg: '#FFF6EE' },
    { l: 'First Response', v: `${f}h`, c: '#00C8A8', bg: '#EDFCF9' },
    { l: 'Reopened', v: '3.2%', c: '#FF5A7E', bg: '#FFF0F4' }
  ];
  return (
    <SimpleGrid columns={3} gap='8px' mt='8px'>
      {items.map((it) => (
        <Box
          key={it.l}
          bg={it.bg}
          borderRadius='8px'
          p='11px'
          textAlign='center'
          border='1px solid'
          borderColor={`${it.c}25`}
        >
          <Text fontSize='20px' fontWeight='900' color={it.c}>{it.v}</Text>
          <Text
            fontSize='10px'
            fontWeight='700'
            color={PALETTE.tx3}
            mt='3px'
            textTransform='uppercase'
            letterSpacing='0.4px'
          >
            {it.l}
          </Text>
        </Box>
      ))}
    </SimpleGrid>
  );
};

const SubjectRow = ({ subject, value, max, total }) => (
  <HStack
    gap='12px'
    p='11px 14px'
    borderRadius='10px'
    bg='#FFFFFF'
    border='1px solid #E8EAF2'
    _hover={{ bg: '#F2F6FF' }}
    transition='background 0.13s'
  >
    <Box w='8px' h='8px' borderRadius='50%' bg={subject.c} flexShrink={0} />
    <Text fontSize='12px' fontWeight='700' color={PALETTE.tx} flex='1'>
      {subject.label}
    </Text>
    <Text fontSize='10px' color={PALETTE.tx3} flex='1'>
      {subject.div}
    </Text>
    <Box flex='2' h='6px' bg='rgba(0,0,0,0.07)' borderRadius='3px' overflow='hidden'>
      <Box h='100%' w={`${Math.round((value / max) * 100)}%`} bg={subject.c} borderRadius='3px' />
    </Box>
    <Text fontSize='14px' fontWeight='800' w='36px' textAlign='right' color={subject.c}>
      {value}
    </Text>
    <Text fontSize='10px' fontWeight='700' color={PALETTE.tx3} w='32px' textAlign='right'>
      {Math.round((value / total) * 100)}%
    </Text>
  </HStack>
);

const MonthlyBox = ({ m }) => {
  const tot = m.closed + m.proc + m.open;
  const cr = Math.round((m.closed / tot) * 100);
  const crC = cr >= 70 ? '#27AE60' : cr >= 60 ? '#FF8C00' : '#C82020';
  const crBg = cr >= 70 ? '#D0F0DD' : cr >= 60 ? '#FFE8C0' : '#FFD0D0';
  const slaC = m.sla >= 75 ? '#27AE60' : m.sla >= 65 ? '#FF8C00' : '#C82020';
  const slaBg = m.sla >= 75 ? '#D0F0DD' : m.sla >= 65 ? '#FFE8C0' : '#FFD0D0';
  const rows = [
    { l: 'Total', v: tot, c: PALETTE.tx },
    { l: 'Closed', v: m.closed, c: '#27AE60' },
    { l: 'Processing', v: m.proc, c: '#FF8C00' },
    { l: 'Open', v: m.open, c: '#4488FF' }
  ];
  return (
    <Box
      borderRadius='10px'
      p='13px 10px'
      bg={PALETTE.card}
      border='1px solid'
      borderColor={PALETTE.bdr}
      boxShadow='0 2px 10px rgba(0,0,0,0.06)'
    >
      <Text
        fontSize='11px'
        fontWeight='800'
        color={PALETTE.mar}
        textTransform='uppercase'
        letterSpacing='0.4px'
        mb='10px'
        textAlign='center'
      >
        {m.m}
      </Text>
      {rows.map((r) => (
        <Flex key={r.l} justify='space-between' align='center' mb='5px'>
          <Text fontSize='10px' fontWeight='600' color={PALETTE.tx2}>{r.l}</Text>
          <Text fontSize='12px' fontWeight='800' color={r.c}>{r.v}</Text>
        </Flex>
      ))}
      <Box h='1px' bg={PALETTE.bdr} my='7px' />
      <Flex justify='space-between' align='center' mb='5px'>
        <Text fontSize='10px' fontWeight='600' color={PALETTE.tx2}>Close%</Text>
        <Text fontSize='10px' fontWeight='800' px='6px' py='2px' borderRadius='4px' bg={crBg} color={crC}>
          {cr}%
        </Text>
      </Flex>
      <Flex justify='space-between' align='center'>
        <Text fontSize='10px' fontWeight='600' color={PALETTE.tx2}>SLA</Text>
        <Text fontSize='10px' fontWeight='800' px='6px' py='2px' borderRadius='4px' bg={slaBg} color={slaC}>
          {m.sla}%
        </Text>
      </Flex>
    </Box>
  );
};

const DivisionSummaryTable = () => (
  <Box overflowX='auto'>
    <Box as='table' w='100%' borderCollapse='collapse' minW='680px'>
      <Box as='thead'>
        <Box as='tr' bg={PALETTE.mar}>
          {['Division', 'Subject Focus', 'Total', 'Closed', 'Pending', 'Close Rate'].map((h, i, arr) => (
            <Box
              as='th'
              key={h}
              p='9px 13px'
              textAlign='left'
              fontSize='10px'
              fontWeight='800'
              color='#fff'
              textTransform='uppercase'
              letterSpacing='0.6px'
              borderTopLeftRadius={i === 0 ? '8px' : undefined}
              borderTopRightRadius={i === arr.length - 1 ? '8px' : undefined}
            >
              {h}
            </Box>
          ))}
        </Box>
      </Box>
      <Box as='tbody'>
        {DIVS.map((d) => {
          const p = Math.round((d.closed / d.total) * 100);
          const pc = p >= 85 ? '#27AE60' : p >= 70 ? '#FF8C00' : '#C82020';
          const pb = p >= 85 ? '#D0F0DD' : p >= 70 ? '#FFE8C0' : '#FFD0D0';
          return (
            <Box as='tr' key={d.div} _hover={{ bg: '#f3f0fb' }}>
              <Box as='td' p='9px 13px' borderBottom='1px solid' borderColor={PALETTE.bdr} fontSize='12px' fontWeight='700' color={PALETTE.tx}>
                {d.div}
              </Box>
              <Box as='td' p='9px 13px' borderBottom='1px solid' borderColor={PALETTE.bdr} fontSize='12px' color={PALETTE.tx2}>
                {d.subj}
              </Box>
              <Box as='td' p='9px 13px' borderBottom='1px solid' borderColor={PALETTE.bdr} fontWeight='700' fontSize='12px' color={PALETTE.tx}>
                {d.total}
              </Box>
              <Box as='td' p='9px 13px' borderBottom='1px solid' borderColor={PALETTE.bdr} fontWeight='700' fontSize='12px' color='#27AE60'>
                {d.closed}
              </Box>
              <Box as='td' p='9px 13px' borderBottom='1px solid' borderColor={PALETTE.bdr} fontWeight='700' fontSize='12px' color='#C82020'>
                {d.total - d.closed}
              </Box>
              <Box as='td' p='9px 13px' borderBottom='1px solid' borderColor={PALETTE.bdr}>
                <Text
                  as='span'
                  display='inline-block'
                  bg={pb}
                  color={pc}
                  px='9px'
                  py='3px'
                  borderRadius='20px'
                  fontSize='11px'
                  fontWeight='800'
                >
                  {p}%
                </Text>
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  </Box>
);

const Performance = () => {
  const [period, setPeriod] = useState('month');
  const subjVals = SUBJECTS.map((s) => s.month);
  const subjMax = Math.max(...subjVals);
  const subjTot = subjVals.reduce((a, b) => a + b, 0);

  return (
    <PageShell>
      <PageHeader
        title='Performance Report'
        subtitle='SLA & resolution analytics'
        right={<PeriodTabs value={period} onChange={setPeriod} />}
      />

      <HeroGrid items={PERFORMANCE_HEROES} />

      <SimpleGrid columns={{ base: 1, lg: 2 }} gap='14px' mb='16px'>
        <SectionCard title='Resolution Time Tiers' mb='0'>
          <SimpleGrid columns={2} gap='9px'>
            {RES.map((r) => <ResCard key={r.label} r={r} />)}
          </SimpleGrid>
          <ResStatsCols period={period} />
        </SectionCard>
        <SectionCard title='Subject-wise Volume' mb='0'>
          <VStack align='stretch' gap='8px'>
            {SUBJECTS.map((s, i) => (
              <SubjectRow key={s.label} subject={s} value={subjVals[i]} max={subjMax} total={subjTot} />
            ))}
          </VStack>
        </SectionCard>
      </SimpleGrid>

      <SectionCard
        title='6-Month Performance Summary'
        badge={<SectionBadge label='Mar – Aug 2025' bg='#FFF8E6' color='#9A6F00' />}
      >
        <SimpleGrid columns={{ base: 2, md: 3, lg: 6 }} gap='9px'>
          {MONTHLY.map((m) => <MonthlyBox key={m.m} m={m} />)}
        </SimpleGrid>
      </SectionCard>

      <SectionCard title='Division Summary'>
        <DivisionSummaryTable />
      </SectionCard>
    </PageShell>
  );
};

export default Performance;
