import { Box, HStack, Text } from '@kfonbss/bss-ui-components';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { fetchAllTicketsList, fetchDashboardTicketSummary } from '../../action';
import { getAllTicketsList, getDashboardTicketSummary } from '../../selector';
import { PALETTE, TICKETS } from './data';
import { buildPeriodHeroes, HeroGrid, PageHeader, PageShell, PeriodTabs, SectionCard, StatusPill } from './shared';

const FilterSelect = ({ value, onChange, placeholder, options }) => (
  <Box
    as='select'
    value={value}
    onChange={(e) => onChange(e.target.value)}
    h='30px'
    px='9px'
    fontSize='11px'
    color={PALETTE.tx}
    bg='#fff'
    border='1.5px solid'
    borderColor={PALETTE.bdr}
    borderRadius='7px'
    outline='none'
    cursor='pointer'
    _focus={{ borderColor: PALETTE.mar }}
  >
    <option value=''>{placeholder}</option>
    {options.map((o) => <option key={o} value={o}>{o}</option>)}
  </Box>
);

const TicketRow = ({ t }) => (
  <Box as='tr' _hover={{ bg: '#f3f0fb' }}>
    <Box as='td' p='10px 13px' borderBottom='1px solid' borderColor={PALETTE.bdr}>
      <Text fontSize='11px' fontWeight='700' color={PALETTE.mar}>{t.id}</Text>
    </Box>
    <Box as='td' p='10px 13px' borderBottom='1px solid' borderColor={PALETTE.bdr}>
      <Text fontSize='11px' fontWeight='700' color={PALETTE.tx2}>{t.type}</Text>
    </Box>
    <Box
      as='td'
      p='10px 13px'
      borderBottom='1px solid'
      borderColor={PALETTE.bdr}
      maxW='220px'
      overflow='hidden'
      whiteSpace='nowrap'
      textOverflow='ellipsis'
      fontSize='12px'
      color={PALETTE.tx}
    >
      {t.subject}
    </Box>
    <Box as='td' p='10px 13px' borderBottom='1px solid' borderColor={PALETTE.bdr}>
      <StatusPill status={t.status} />
    </Box>
    <Box as='td' p='10px 13px' borderBottom='1px solid' borderColor={PALETTE.bdr} fontSize='12px' color={PALETTE.tx}>
      {t.user}
    </Box>
    <Box as='td' p='10px 13px' borderBottom='1px solid' borderColor={PALETTE.bdr} fontSize='12px' color={PALETTE.tx}>
      {t.district}
    </Box>
    <Box as='td' p='10px 13px' borderBottom='1px solid' borderColor={PALETTE.bdr}>
      <Text color={PALETTE.tx3} fontSize='11px'>{t.date}</Text>
    </Box>
  </Box>
);

const TicketTable = ({ rows }) => (
  <Box overflowX='auto'>
    <Box as='table' w='100%' minW='720px' borderCollapse='collapse' fontSize='12px'>
      <Box as='thead'>
        <Box as='tr' bg={PALETTE.mar}>
          {['Ticket ID', 'Type', 'Subject', 'Status', 'User', 'District', 'Date & Time'].map((h, i, arr) => (
            <Box
              as='th'
              key={h}
              p='10px 13px'
              textAlign='left'
              fontSize='10px'
              fontWeight='800'
              color='#fff'
              letterSpacing='0.7px'
              textTransform='uppercase'
              whiteSpace='nowrap'
              borderTopLeftRadius={i === 0 ? '8px' : undefined}
              borderTopRightRadius={i === arr.length - 1 ? '8px' : undefined}
            >
              {h}
            </Box>
          ))}
        </Box>
      </Box>
      <Box as='tbody'>
        {rows.length === 0 ? (
          <Box as='tr'>
            <Box as='td' colSpan={7} p='24px' textAlign='center' color={PALETTE.tx3} fontSize='12px'>
              No tickets match your filters.
            </Box>
          </Box>
        ) : (
          rows.map((t) => <TicketRow key={t.id} t={t} />)
        )}
      </Box>
    </Box>
  </Box>
);

const AllTickets = () => {
  const [period, setPeriod] = useState('today');
  const [status, setStatus] = useState('');
  const [type, setType] = useState('');
  const [user, setUser] = useState('');
  const dispatch = useDispatch();

  useEffect(() => {
    const apiPeriod = period === 'week' ? 'THIS_WEEK' : period === 'month' ? 'THIS_MONTH' : 'TODAY';
    dispatch(fetchDashboardTicketSummary(apiPeriod));
    dispatch(fetchAllTicketsList({ period: apiPeriod, page: 0, size: 100 }));
  }, [period, dispatch]);

  const apiSummary = useSelector(getDashboardTicketSummary);
  const apiListResponse = useSelector(getAllTicketsList);

  const filtered = useMemo(() => {
    let baseList = TICKETS;
    
    if (apiListResponse && Array.isArray(apiListResponse.content)) {
      baseList = apiListResponse.content.map(t => {
        const d = new Date(t.dateTime);
        const hours = d.getHours();
        const mins = d.getMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const formattedHours = hours % 12 || 12;
        const day = d.getDate().toString().padStart(2, '0');
        const month = d.toLocaleString('default', { month: 'short' });
        const year = d.getFullYear();
        const timeStr = `${day} ${month} ${year}, ${formattedHours}:${mins} ${ampm}`;
        
        return {
          id: t.ticketNumber,
          type: t.type,
          subject: t.subject?.trim() === '-' ? '' : t.subject,
          user: t.customerType,
          district: t.district?.trim() === '-' ? '' : (t.district?.trim() || ''),
          status: t.status,
          date: timeStr
        };
      });
    }

    return baseList.filter(
      (r) => (!status || r.status === status) && (!type || r.type === type) && (!user || r.user === user)
    );
  }, [apiListResponse, status, type, user]);

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

  return (
    <PageShell>
      <PageHeader
        title='All Tickets'
        subtitle='View and manage all tickets'
        right={<PeriodTabs value={period} onChange={setPeriod} />}
      />

      <HeroGrid items={heroes} />

      <SectionCard
        title='Ticket Register'
        badge={
          <HStack gap='7px' flexWrap='wrap'>
            <FilterSelect value={status} onChange={setStatus} placeholder='All Status' options={['Open', 'Processing', 'Closed', 'TAKEN_OVER']} />
            <FilterSelect value={type} onChange={setType} placeholder='All Types' options={['Complaints', 'Enquiry', 'Other']} />
            <FilterSelect value={user} onChange={setUser} placeholder='All Users' options={['Subscribers', 'LNP', 'AGNP', 'General Public', 'Officials']} />
          </HStack>
        }
      >
        <TicketTable rows={filtered} />
      </SectionCard>
    </PageShell>
  );
};

export default AllTickets;
