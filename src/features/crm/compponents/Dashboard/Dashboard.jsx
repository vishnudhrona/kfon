import { Box, Flex, HStack, SimpleGrid, Text, VStack } from '@kfonbss/bss-ui-components';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  fetchCustomerTypeBreakdown,
  fetchDashboardTicketSummary,
  fetchDistrictWiseComplaints,
  fetchLongPending,
  fetchMonthlySummary,
  fetchPerformanceKpi,
  fetchResolutionPerformance,
  fetchSubjectTypeBreakdown,
  fetchTop10Issues
} from '../../action';
import {
  getCustomerTypeBreakdown,
  getDashboardTicketSummary,
  getDistrictWiseComplaints,
  getLongPending,
  getMonthlySummary,
  getPerformanceKpi,
  getResolutionPerformance,
  getSubjectTypeBreakdown,
  getTop10Issues
} from '../../selector';
import { DISTRICTS, DIVS, KPIS, MONTHLY, PALETTE, PENDING, RES, SUBJECTS, TOP10, TOP10_COLORS, USERS } from './data';
import {
  buildPeriodHeroes,
  HeroGrid,
  PageHeader,
  PageShell,
  PeriodTabs,
  SectionBadge,
  SectionCard,
  StatusPill
} from './shared';

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

const UserRow = ({ user, index, value, max, total }) => (
  <HStack gap='10px' p='10px 14px' borderRadius='10px' bg='#FFFFFF' border='1px solid #E8EAF2'>
    <Text fontSize='10px' fontWeight='800' w='18px' textAlign='center' color={user.c}>
      {index + 1}
    </Text>
    <Text fontSize='12px' fontWeight='700' color={PALETTE.tx} flex='1'>
      {user.label}
    </Text>
    <Box flex='2' h='6px' bg='rgba(0,0,0,0.07)' borderRadius='3px' overflow='hidden'>
      <Box h='100%' w={`${Math.round((value / max) * 100)}%`} bg={user.c} borderRadius='3px' />
    </Box>
    <Text fontSize='14px' fontWeight='800' w='34px' textAlign='right' color={PALETTE.tx}>
      {value}
    </Text>
    <Text
      as='span'
      fontSize='10px'
      fontWeight='800'
      px='7px'
      py='2px'
      borderRadius='20px'
      bg={`${user.c}18`}
      color={user.c}
    >
      {Math.round((value / total) * 100)}%
    </Text>
  </HStack>
);

const Top10Row = ({ row, rank, max, color }) => (
  <HStack gap='10px' p='9px 12px' borderRadius='10px' bg='#FFFFFF' border='1px solid #E8EAF2'>
    <Flex
      w='22px'
      h='22px'
      borderRadius='6px'
      fontSize='10px'
      fontWeight='800'
      align='center'
      justify='center'
      bg={`${color}18`}
      color={color}
      flexShrink={0}
    >
      {rank + 1}
    </Flex>
    <Text fontSize='12px' fontWeight='600' color={PALETTE.tx} flex='1'>
      {row.issue}
    </Text>
    <Box flex='1' h='5px' bg='rgba(0,0,0,0.07)' borderRadius='3px' overflow='hidden'>
      <Box h='100%' w={`${Math.round((row.count / max) * 100)}%`} bg={color} borderRadius='3px' />
    </Box>
    <Text fontSize='13px' fontWeight='800' w='28px' textAlign='right' color={color}>
      {row.count}
    </Text>
  </HStack>
);

const DivPerfCard = ({ d }) => {
  const p = Math.round((d.closed / d.total) * 100);
  return (
    <Box borderRadius='10px' p='14px 16px' bg='#FFFFFF' border='1px solid #E8EAF2'>
      <Flex justify='space-between' align='center' mb='10px'>
        <Box>
          <Text fontSize='13px' fontWeight='800' color={PALETTE.tx}>
            {d.div}
          </Text>
          <Text fontSize='10px' color={PALETTE.tx3} mt='2px'>
            {d.subj}
          </Text>
        </Box>
        <Text fontSize='22px' fontWeight='900' color={d.c}>
          {p}%
        </Text>
      </Flex>
      <SimpleGrid columns={3} gap='6px' mb='8px'>
        {[
          { v: d.closed, l: 'Closed', c: d.c },
          { v: d.total - d.closed, l: 'Pending', c: PALETTE.tx2 },
          { v: d.total, l: 'Total', c: PALETTE.tx }
        ].map((s) => (
          <Box
            key={s.l}
            bg={PALETTE.card}
            border='1px solid'
            borderColor={PALETTE.bdr}
            borderRadius='6px'
            p='6px 8px'
            textAlign='center'
          >
            <Text fontSize='16px' fontWeight='900' lineHeight='1' color={s.c}>
              {s.v}
            </Text>
            <Text fontSize='9px' textTransform='uppercase' letterSpacing='0.5px' color={PALETTE.tx3} mt='2px'>
              {s.l}
            </Text>
          </Box>
        ))}
      </SimpleGrid>
      <Box h='7px' bg='rgba(0,0,0,0.07)' borderRadius='4px' overflow='hidden'>
        <Box h='100%' w={`${p}%`} background={`linear-gradient(90deg,${d.c}99,${d.c})`} borderRadius='4px' />
      </Box>
    </Box>
  );
};

const districtTone = (p) => {
  if (p >= 75)
    return { dot: '#639922', rowBg: '#F4F9EC', pBg: '#C0DD97', pC: '#27500A', bar: '#639922', sC: '#27500A' };
  if (p >= 40)
    return { dot: '#BA7517', rowBg: '#FDF5E6', pBg: '#FAC775', pC: '#412402', bar: '#BA7517', sC: '#633806' };
  return { dot: '#A32D2D', rowBg: '#FDF0F0', pBg: '#F7C1C1', pC: '#501313', bar: '#A32D2D', sC: '#791F1F' };
};

const DistrictHeader = () => (
  <HStack
    pb='8px'
    mb='8px'
    borderBottom='1.5px solid #E8E0F0'
    fontSize='9px'
    fontWeight='700'
    color='#9A90A8'
    letterSpacing='0.7px'
    textTransform='uppercase'
  >
    <Box flex='1.4'>District</Box>
    <Box flex='1' textAlign='right'>
      Total
    </Box>
    <Box flex='1' textAlign='right'>
      Solved
    </Box>
    <Box flex='1' textAlign='right'>
      Open
    </Box>
    <Box flex='1.2' textAlign='center'>
      Rate
    </Box>
    <Box flex='0.8' textAlign='right'>
      %
    </Box>
  </HStack>
);

const DistrictRow = ({ d }) => {
  const p = Math.round((d.resolved / d.tickets) * 100);
  const o = d.tickets - d.resolved;
  const c = districtTone(p);
  return (
    <HStack bg={c.rowBg} borderRadius='50px' px='14px' py='7px' mb='7px'>
      <HStack flex='1.4' gap='7px'>
        <Box w='7px' h='7px' borderRadius='50%' bg={c.dot} flexShrink={0} />
        <Text fontSize='13px' fontWeight='700' color='#1A1030'>
          {d.name}
        </Text>
      </HStack>
      <Text flex='1' textAlign='right' fontSize='12px' fontWeight='500' color='#3B2E6E'>
        {d.tickets}
      </Text>
      <Text flex='1' textAlign='right' fontSize='12px' fontWeight='600' color={c.sC}>
        {d.resolved}
      </Text>
      <Text flex='1' textAlign='right' fontSize='12px' fontWeight='600' color='#A32D2D'>
        {o}
      </Text>
      <Flex flex='1.2' justify='center'>
        <Box h='5px' bg='rgba(0,0,0,0.1)' borderRadius='3px' w='56px' overflow='hidden'>
          <Box h='5px' w={`${p}%`} bg={c.bar} borderRadius='3px' />
        </Box>
      </Flex>
      <Box flex='0.8' textAlign='right'>
        <Text
          as='span'
          display='inline-block'
          px='9px'
          py='2px'
          borderRadius='20px'
          fontSize='11px'
          fontWeight='700'
          bg={c.pBg}
          color={c.pC}
        >
          {p}%
        </Text>
      </Box>
    </HStack>
  );
};

const DistrictLegend = () => (
  <HStack
    gap='18px'
    mb='14px'
    px='14px'
    py='8px'
    bg='#F7F8FC'
    borderRadius='8px'
    border='1px solid #EEE8F4'
    flexWrap='wrap'
  >
    <Text fontSize='10px' fontWeight='700' color='#9A90A8' letterSpacing='0.3px'>
      Resolution:
    </Text>
    {[
      { c: '#639922', tc: '#27500A', label: '≥ 75% — Good' },
      { c: '#BA7517', tc: '#412402', label: '40–74% — Average' },
      { c: '#A32D2D', tc: '#501313', label: '< 40% — Critical' }
    ].map((l) => (
      <HStack key={l.label} gap='6px' fontSize='11px' fontWeight='600' color={l.tc}>
        <Box w='8px' h='8px' borderRadius='50%' bg={l.c} />
        <Text>{l.label}</Text>
      </HStack>
    ))}
  </HStack>
);

const ResCard = ({ r }) => (
  <HStack gap='12px' borderRadius='10px' p='13px 15px' bg={r.bg} border='1px solid' borderColor={`${r.c}25`}>
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
      <Text fontSize='16px' fontWeight='900' lineHeight='1' color={r.c}>
        {r.pct}
      </Text>
      <Text fontSize='9px' fontWeight='700' opacity={0.75} color={r.c}>
        %
      </Text>
    </Flex>
    <Box>
      <Text fontSize='11px' fontWeight='700' color={PALETTE.tx}>
        {r.label}
      </Text>
      <Text fontSize='10px' color={PALETTE.tx3} mt='2px'>
        {r.desc}
      </Text>
    </Box>
  </HStack>
);

const ResStatsCols = ({ period, data }) => {
  const a = data?.avgResolutionHours ?? (period === 'today' ? '14.2' : period === 'week' ? '16.8' : '18.4');
  const f = data?.avgFirstResponseHours ?? (period === 'today' ? '1.8' : period === 'week' ? '2.0' : '2.1');
  const reopened = data?.reopenedPct ?? '3.2';

  const items = [
    { l: 'Avg Resolution', v: `${a}h`, c: '#FF6B00', bg: '#FFF6EE' },
    { l: 'First Response', v: `${f}h`, c: '#00C8A8', bg: '#EDFCF9' },
    { l: 'Reopened', v: `${reopened}%`, c: '#FF5A7E', bg: '#FFF0F4' }
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
          <Text fontSize='20px' fontWeight='900' color={it.c}>
            {it.v}
          </Text>
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

const PendingRow = ({ t }) => {
  const dc = t.days >= 7 ? '#C82020' : t.days >= 4 ? '#FF8C00' : '#4488FF';
  const db = t.days >= 7 ? '#FFF0F4' : t.days >= 4 ? '#FFF6EE' : '#EFF5FF';
  return (
    <HStack gap='12px' p='10px 14px' borderRadius='10px' bg='#FFFFFF' border='1px solid #E8EAF2'>
      <Flex
        w='44px'
        h='44px'
        borderRadius='9px'
        direction='column'
        align='center'
        justify='center'
        bg={db}
        flexShrink={0}
      >
        <Text fontSize='18px' fontWeight='900' lineHeight='1' color={dc}>
          {t.days}
        </Text>
        <Text fontSize='9px' fontWeight='700' opacity={0.8} color={dc}>
          days
        </Text>
      </Flex>
      <Box flex='1' minW='0'>
        <Text fontSize='10px' fontWeight='600' color={dc} mb='2px'>
          {t.id}
        </Text>
        <Text
          fontSize='12px'
          fontWeight='700'
          color={PALETTE.tx}
          whiteSpace='nowrap'
          overflow='hidden'
          textOverflow='ellipsis'
        >
          {t.subject}
        </Text>
        <Text fontSize='10px' color={PALETTE.tx3} mt='2px'>
          {t.user} · {t.district}
        </Text>
      </Box>
      <StatusPill status={t.status} />
    </HStack>
  );
};

const KpiBox = ({ k }) => (
  <HStack
    gap='14px'
    borderRadius='10px'
    p='16px'
    bg={PALETTE.card}
    border='1px solid'
    borderColor={PALETTE.bdr}
    boxShadow='0 2px 10px rgba(0,0,0,0.06)'
  >
    <Flex w='46px' h='46px' borderRadius='10px' align='center' justify='center' bg={k.bg} flexShrink={0}>
      <Text fontSize='22px' fontWeight='900' color={k.c}>
        {String(k.v).charAt(0)}
      </Text>
    </Flex>
    <Box>
      <Text fontSize='22px' fontWeight='900' letterSpacing='-0.5px' lineHeight='1' color={k.c}>
        {k.v}
      </Text>
      <Text
        fontSize='10px'
        fontWeight='700'
        color={PALETTE.tx2}
        textTransform='uppercase'
        letterSpacing='0.5px'
        mt='3px'
      >
        {k.l}
      </Text>
      {k.n && (
        <Text fontSize='10px' color={PALETTE.tx3} mt='2px'>
          {k.n}
        </Text>
      )}
    </Box>
  </HStack>
);

const MonthlyBox = ({ m }) => {
  const tot = m.total ?? (m.closed || 0) + (m.processing || m.proc || 0) + (m.open || 0);
  const cr = m.closePct ?? (tot ? Math.round(((m.closed || 0) / tot) * 100) : 0);
  const crC = cr >= 70 ? '#27AE60' : cr >= 60 ? '#FF8C00' : '#C82020';
  const crBg = cr >= 70 ? '#D0F0DD' : cr >= 60 ? '#FFE8C0' : '#FFD0D0';

  const sla = m.slaPct ?? m.sla ?? 0;
  const slaC = sla >= 75 ? '#27AE60' : sla >= 65 ? '#FF8C00' : '#C82020';
  const slaBg = sla >= 75 ? '#D0F0DD' : sla >= 65 ? '#FFE8C0' : '#FFD0D0';

  const rows = [
    { l: 'Total', v: tot, c: PALETTE.tx },
    { l: 'Closed', v: m.closed || 0, c: '#27AE60' },
    { l: 'Processing', v: m.processing || m.proc || 0, c: '#FF8C00' },
    { l: 'Open', v: m.open || 0, c: '#4488FF' }
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
          <Text fontSize='10px' fontWeight='600' color={PALETTE.tx2}>
            {r.l}
          </Text>
          <Text fontSize='12px' fontWeight='800' color={r.c}>
            {r.v}
          </Text>
        </Flex>
      ))}
      <Box h='1px' bg={PALETTE.bdr} my='7px' />
      <Flex justify='space-between' align='center' mb='5px'>
        <Text fontSize='10px' fontWeight='600' color={PALETTE.tx2}>
          Close%
        </Text>
        <Text fontSize='10px' fontWeight='800' px='6px' py='2px' borderRadius='4px' bg={crBg} color={crC}>
          {cr}%
        </Text>
      </Flex>
      <Flex justify='space-between' align='center'>
        <Text fontSize='10px' fontWeight='600' color={PALETTE.tx2}>
          SLA
        </Text>
        <Text fontSize='10px' fontWeight='800' px='6px' py='2px' borderRadius='4px' bg={slaBg} color={slaC}>
          {sla}%
        </Text>
      </Flex>
    </Box>
  );
};

const Dashboard = () => {
  const [period, setPeriod] = useState('today');
  const dispatch = useDispatch();

  useEffect(() => {
    const apiPeriod = period === 'week' ? 'THIS_WEEK' : period === 'month' ? 'THIS_MONTH' : 'TODAY';
    dispatch(fetchDashboardTicketSummary(apiPeriod));
    dispatch(fetchCustomerTypeBreakdown(apiPeriod));
    dispatch(fetchSubjectTypeBreakdown(apiPeriod));
    dispatch(fetchTop10Issues(apiPeriod));
    dispatch(fetchDistrictWiseComplaints({ period: apiPeriod, page: 0, size: 14 }));
    dispatch(fetchPerformanceKpi(apiPeriod));
    dispatch(fetchResolutionPerformance(apiPeriod));
    dispatch(fetchLongPending(apiPeriod));
  }, [period, dispatch]);

  useEffect(() => {
    dispatch(fetchMonthlySummary());
  }, [dispatch]);

  const apiSummary = useSelector(getDashboardTicketSummary);
  const customerTypeBreakdown = useSelector(getCustomerTypeBreakdown);
  const subjectTypeBreakdown = useSelector(getSubjectTypeBreakdown);
  const top10Issues = useSelector(getTop10Issues);
  const districtWiseComplaints = useSelector(getDistrictWiseComplaints);
  const performanceKpi = useSelector(getPerformanceKpi);
  const resolutionPerformance = useSelector(getResolutionPerformance);
  const monthlySummary = useSelector(getMonthlySummary);
  const longPending = useSelector(getLongPending);

  const heroes = useMemo(() => {
    const periodData = {
      total: apiSummary?.total || 0,
      open: apiSummary?.open || 0,
      processing: apiSummary?.processing || 0,
      closed: apiSummary?.closed || 0,
      esc: 0,
      avg: '0h',
      sla: 100
    };
    return buildPeriodHeroes(periodData);
  }, [apiSummary]);
  const subjectList = useMemo(() => {
    if (!subjectTypeBreakdown || subjectTypeBreakdown.length === 0) {
      return SUBJECTS.map((s) => ({ ...s, value: 0 }));
    }
    return subjectTypeBreakdown.map((item, index) => {
      const match = SUBJECTS.find((s) => s.label === item.subjectType);
      return {
        label: item.subjectType,
        div: item.team || '',
        c: match ? match.c : SUBJECTS[index % SUBJECTS.length]?.c || PALETTE.tx,
        value: item.count || 0
      };
    });
  }, [subjectTypeBreakdown]);

  const subjMax = Math.max(...subjectList.map((s) => s.value), 1);
  const subjTot = subjectList.reduce((a, b) => a + b.value, 0);

  const userVals = useMemo(() => {
    if (!customerTypeBreakdown || customerTypeBreakdown.length === 0) {
      return USERS.map((u) => ({ ...u, value: 0 }));
    }
    return customerTypeBreakdown.map((item, index) => {
      // Find a matching color from USERS if possible, or fallback
      const match = USERS.find((u) => u.label === item.customerType);
      return {
        label: item.customerType,
        c: match ? match.c : USERS[index % USERS.length]?.c || PALETTE.tx,
        value: item.count || 0
      };
    });
  }, [customerTypeBreakdown]);

  const userMax = Math.max(...userVals.map((u) => u.value), 1);
  const userTot = userVals.reduce((a, b) => a + b.value, 0);

  const top10List = useMemo(() => {
    if (!top10Issues || top10Issues.length === 0) return TOP10;
    return top10Issues;
  }, [top10Issues]);

  const top10Max = Math.max(...top10List.map((t) => t.count), 1);

  const sortedDistricts = useMemo(() => {
    let districts = DISTRICTS;
    if (districtWiseComplaints && districtWiseComplaints.length > 0) {
      districts = districtWiseComplaints.map((d) => ({
        name: d.district.trim(),
        tickets: d.total,
        resolved: d.solved
      }));
    }
    return [...districts].sort((a, b) => b.tickets - a.tickets);
  }, [districtWiseComplaints]);
  const distLeft = sortedDistricts.slice(0, 7);
  const distRight = sortedDistricts.slice(7, 14);

  const kpiData = useMemo(() => {
    if (!performanceKpi) return KPIS;

    // Capitalize period for display
    const formattedPeriod = period.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase());

    return [
      { l: `Total ${formattedPeriod}`, v: String(performanceKpi.total), n: '', c: '#FF6B00', bg: '#FFF6EE' },
      {
        l: 'Resolved',
        v: String(performanceKpi.resolved),
        n: `${performanceKpi.closeRatePct}% close rate`,
        c: '#27AE60',
        bg: '#F0FAF4'
      },
      { l: 'SLA Compliance', v: `${performanceKpi.slaCompliancePct}%`, n: 'Target: 80%', c: '#FF8C00', bg: '#FFF8E6' },
      { l: 'CSAT Score', v: `${performanceKpi.csatScore}/5`, n: 'Satisfaction', c: '#00C8A8', bg: '#EDFCF9' },
      {
        l: 'Tickets / Agent',
        v: `${performanceKpi.ticketsPerAgentPerDay}/day`,
        n: 'Avg agent load',
        c: '#4488FF',
        bg: '#EFF5FF'
      },
      {
        l: 'Escalation Rate',
        v: `${performanceKpi.escalationRatePct}%`,
        n: 'Escalated to L2',
        c: '#9B59B6',
        bg: '#F5F0FF'
      }
    ];
  }, [performanceKpi, period]);

  const resData = useMemo(() => {
    if (!resolutionPerformance) return RES;
    return [
      {
        label: 'Within SLA ≤24h',
        pct: resolutionPerformance.withinSlaPct,
        desc: `${resolutionPerformance.withinSlaPct}% of all tickets`,
        c: '#27AE60',
        bg: '#F0FAF4'
      },
      {
        label: '24 – 48 hours',
        pct: resolutionPerformance.delayed24to48Pct,
        desc: 'Slightly delayed',
        c: '#FF8C00',
        bg: '#FFF6EE'
      },
      {
        label: '48 – 72 hours',
        pct: resolutionPerformance.breached48to72Pct,
        desc: 'Breached SLA',
        c: '#FF5A7E',
        bg: '#FFF0F4'
      },
      {
        label: 'Over 72 hours',
        pct: resolutionPerformance.critical72plusPct,
        desc: 'Critical breach',
        c: '#7A1C2E',
        bg: '#FDF5F7'
      }
    ];
  }, [resolutionPerformance]);

  const monthlyList = useMemo(() => {
    if (!monthlySummary || monthlySummary.length === 0) return MONTHLY;
    return monthlySummary.map((m) => ({ ...m, m: m.month }));
  }, [monthlySummary]);

  const pendingList = useMemo(() => {
    const list = Array.isArray(longPending) ? longPending : longPending?.content || [];
    if (!list || list.length === 0) return PENDING;

    return list.map((p) => ({
      id: p.ticketNumber,
      subject: p.subject,
      user: p.customerType,
      days: p.daysPending,
      district: p.district?.trim() === '-' ? '' : p.district?.trim() || '',
      status: p.status
    }));
  }, [longPending]);

  return (
    <PageShell>
      <PageHeader
        title='Dashboard'
        subtitle='Support operations at a glance'
        right={<PeriodTabs value={period} onChange={setPeriod} />}
      />

      <HeroGrid items={heroes} />

      <SimpleGrid columns={{ base: 1, lg: 2 }} gap='14px' mb='16px'>
        <SectionCard title='Subject Type' mb='0'>
          <VStack align='stretch' gap='8px'>
            {subjectList.map((s) => (
              <SubjectRow key={s.label} subject={s} value={s.value} max={subjMax} total={subjTot} />
            ))}
          </VStack>
        </SectionCard>
        <SectionCard title='Customer Type' mb='0'>
          <VStack align='stretch' gap='8px'>
            {userVals.map((u, i) => (
              <UserRow key={u.label} user={u} index={i} value={u.value} max={userMax} total={userTot} />
            ))}
          </VStack>
        </SectionCard>
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, lg: 2 }} gap='14px' mb='16px'>
        <SectionCard title='Top 10 Issues' mb='0'>
          <VStack align='stretch' gap='7px'>
            {top10List.map((t, i) => (
              <Top10Row
                key={t.issue}
                row={t}
                rank={i}
                max={top10Max}
                color={TOP10_COLORS[i % TOP10_COLORS.length] || PALETTE.tx}
              />
            ))}
          </VStack>
        </SectionCard>
        <SectionCard title='Division Performance' mb='0'>
          <VStack align='stretch' gap='10px'>
            {DIVS.map((d) => (
              <DivPerfCard key={d.div} d={d} />
            ))}
          </VStack>
        </SectionCard>
      </SimpleGrid>

      <SectionCard
        title='Kerala District-wise Complaints'
        badge={<SectionBadge label='14 Districts' bg='#FDE9A0' color='#9A6F00' />}
      >
        <DistrictLegend />
        <SimpleGrid columns={{ base: 1, md: 2 }} gap='0 28px'>
          <Box>
            <DistrictHeader />
            {distLeft.map((d) => (
              <DistrictRow key={d.name} d={d} />
            ))}
          </Box>
          <Box>
            <DistrictHeader />
            {distRight.map((d) => (
              <DistrictRow key={d.name} d={d} />
            ))}
          </Box>
        </SimpleGrid>
      </SectionCard>

      <SimpleGrid columns={{ base: 1, lg: 2 }} gap='14px' mb='16px'>
        <SectionCard title='Resolution Performance' mb='0'>
          <SimpleGrid columns={2} gap='9px' mb='10px'>
            {resData.map((r) => (
              <ResCard key={r.label} r={r} />
            ))}
          </SimpleGrid>
          <ResStatsCols period={period} data={resolutionPerformance} />
        </SectionCard>
        <SectionCard
          title='Long Pending'
          mb='0'
          badge={<SectionBadge label='Action Needed' bg='#FFF0F3' color='#C82020' />}
        >
          <Box
            overflowY='auto'
            maxH='240px'
            pr='4px'
            sx={{
              '&::-webkit-scrollbar': { width: '4px' },
              '&::-webkit-scrollbar-track': { width: '4px' },
              '&::-webkit-scrollbar-thumb': { background: '#D1D5DB', borderRadius: '4px' }
            }}
          >
            <VStack align='stretch' gap='8px'>
              {pendingList.map((p) => (
                <PendingRow key={p.id} t={p} />
              ))}
            </VStack>
          </Box>
        </SectionCard>
      </SimpleGrid>

      <SectionCard
        title='Overall Performance KPIs'
        badge={<SectionBadge label={period.replace('_', ' ').toUpperCase()} bg='#FFF8E6' color='#9A6F00' />}
      >
        <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} gap='10px'>
          {kpiData.map((k) => (
            <KpiBox key={k.l} k={k} />
          ))}
        </SimpleGrid>
      </SectionCard>

      <SectionCard title='6-Month Summary'>
        <SimpleGrid columns={{ base: 2, md: 3, lg: 6 }} gap='9px'>
          {monthlyList.map((m) => (
            <MonthlyBox key={m.m} m={m} />
          ))}
        </SimpleGrid>
      </SectionCard>
    </PageShell>
  );
};

export default Dashboard;
