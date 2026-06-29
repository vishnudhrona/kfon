import { Box, Button, HStack, Text } from '@kfonbss/bss-ui-components';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { fetchLongPendingList, fetchLongPendingSummary } from '../../action';
import { getLongPendingList, getLongPendingSummary } from '../../selector';
import { GRADIENTS, PALETTE } from './data';
import { HeroGrid, PageHeader, PageShell, SectionBadge, SectionCard, StatusPill } from './shared';

const PendingTableRow = ({ t }) => {  
  const dc = t.days >= 7 ? '#C82020' : t.days >= 4 ? '#FF8C00' : '#4488FF';
  const db = t.days >= 7 ? '#FFD0D0' : t.days >= 4 ? '#FFE8C0' : '#D0E4FF';
  return (
    <Box as='tr' _hover={{ bg: '#f3f0fb' }}>
      <Box as='td' p='10px 13px' borderBottom='1px solid' borderColor={PALETTE.bdr}>
        <Text fontSize='11px' fontWeight='700' color={PALETTE.mar}>
          {t.id}
        </Text>
      </Box>
      <Box
        as='td'
        p='10px 13px'
        borderBottom='1px solid'
        borderColor={PALETTE.bdr}
        fontSize='12px'
        fontWeight='700'
        color={PALETTE.tx}
      >
        {t.subject}
      </Box>
      <Box as='td' p='10px 13px' borderBottom='1px solid' borderColor={PALETTE.bdr} fontSize='12px' color={PALETTE.tx}>
        {t.user}
      </Box>
      <Box as='td' p='10px 13px' borderBottom='1px solid' borderColor={PALETTE.bdr} fontSize='12px' color={PALETTE.tx}>
        {t.district}
      </Box>
      <Box as='td' p='10px 13px' borderBottom='1px solid' borderColor={PALETTE.bdr}>
        <Text
          as='span'
          display='inline-block'
          bg={db}
          color={dc}
          px='9px'
          py='3px'
          borderRadius='20px'
          fontSize='11px'
          fontWeight='800'
        >
          {t.days}d
        </Text>
      </Box>
      <Box as='td' p='10px 13px' borderBottom='1px solid' borderColor={PALETTE.bdr}>
        <StatusPill status={t.status} />
      </Box>
      <Box as='td' p='10px 13px' borderBottom='1px solid' borderColor={PALETTE.bdr}>
        <Button
          variant='outline'
          px='12px'
          py='4px'
          h='auto'
          minW='unset'
          borderRadius='6px'
          fontSize='11px'
          fontWeight='700'
          color={PALETTE.mar}
          borderColor={PALETTE.mar}
          bg='#fff'
          _hover={{ bg: '#FDF5F7' }}
          onClick={() => {}}
        >
          escalate
        </Button>
      </Box>
    </Box>
  );
};

const LongPending = () => {
  const [page, setPage] = useState(0);
  const size = 10;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchLongPendingSummary('THIS_MONTH'));
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchLongPendingList({ period: 'THIS_MONTH', page, size }));
  }, [dispatch, page]);

  const longPendingSummary = useSelector(getLongPendingSummary);
  const longPendingList = useSelector(getLongPendingList);

  const heroes = useMemo(() => {
    return [
      { label: 'Critical 7+ Days', value: longPendingSummary?.critical || 0, sub: 'Immediate action', gradient: GRADIENTS.red },
      { label: 'Warning 4-6 Days', value: longPendingSummary?.warning || 0, sub: 'Review needed', gradient: GRADIENTS.orange },
      { label: 'Watch 2-3 Days', value: longPendingSummary?.watch || 0, sub: 'Monitor closely', gradient: GRADIENTS.blue },
      { label: 'Total Pending', value: longPendingSummary?.totalPending || 0, sub: 'All pending items', gradient: GRADIENTS.purple }
    ];
  }, [longPendingSummary]);

  const tableRows = useMemo(() => {
    const list = longPendingList?.content || [];
    return list.map((p) => ({
      id: p.ticketNumber,
      subject: p.subject?.trim() === '-' ? '' : p.subject,
      user: p.customerType,
      days: p.daysPending,
      district: p.district?.trim() === '-' ? '' : p.district?.trim() || '',
      status: p.status
    }));
  }, [longPendingList]);

  const totalPages = longPendingList?.totalPages || 0;

  return (
    <PageShell>
      <PageHeader title='Long Pending' subtitle='Tickets requiring urgent escalation' />

      <HeroGrid items={heroes} />

      <SectionCard
        title='Pending Ticket Register'
        badge={<SectionBadge label='Escalation Required' bg='#FFF0F3' color='#C82020' />}
      >
        <Box overflowX='auto'>
          <Box as='table' w='100%' minW='720px' borderCollapse='collapse' fontSize='12px'>
            <Box as='thead'>
              <Box as='tr' bg={PALETTE.mar}>
                {['Ticket ID', 'Subject', 'User', 'District', 'Age', 'Status', 'Action'].map((h, i, arr) => (
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
              {tableRows.length === 0 ? (
                <Box as='tr'>
                  <Box as='td' colSpan={7} p='24px' textAlign='center' color={PALETTE.tx3} fontSize='12px'>
                    No pending tickets found.
                  </Box>
                </Box>
              ) : (
                tableRows.map((t) => (
                  <PendingTableRow key={t.id} t={t} />
                ))
              )}
            </Box>
          </Box>
        </Box>
        {totalPages > 1 && (
          <HStack justify='flex-end' mt='16px' gap='6px'>
            <Button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              isDisabled={page === 0}
              px='12px'
              py='5px'
              h='auto'
              minW='unset'
              borderRadius='6px'
              fontSize='11px'
              fontWeight='700'
              bg='transparent'
              border='1px solid'
              borderColor={PALETTE.bdr}
              color={PALETTE.tx2}
              _hover={{ bg: 'rgba(0,0,0,0.03)' }}
              _disabled={{ opacity: 0.4, cursor: 'not-allowed' }}
            >
              Previous
            </Button>
            <Text fontSize='11px' fontWeight='600' color={PALETTE.tx2}>
              Page {page + 1} of {totalPages}
            </Text>
            <Button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              isDisabled={page === totalPages - 1}
              px='12px'
              py='5px'
              h='auto'
              minW='unset'
              borderRadius='6px'
              fontSize='11px'
              fontWeight='700'
              bg='transparent'
              border='1px solid'
              borderColor={PALETTE.bdr}
              color={PALETTE.tx2}
              _hover={{ bg: 'rgba(0,0,0,0.03)' }}
              _disabled={{ opacity: 0.4, cursor: 'not-allowed' }}
            >
              Next
            </Button>
          </HStack>
        )}
      </SectionCard>
    </PageShell>
  );
};

export default LongPending;
