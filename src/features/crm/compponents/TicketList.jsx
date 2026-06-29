import { Box, Button, HStack, Icons, VStack } from '@kfonbss/bss-ui-components';
import { useNavigate, useSearch } from '@tanstack/react-router';
import dayjs from 'dayjs';
import { debounce } from 'lodash-es';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import PermissionGuard from '@/components/common/PermissionGuard';
import { CirclePlusIcon, FilterIcon } from '@/components/custom';
import CsvDownloadBtn from '@/components/custom/CsvDownloadBtn';
import ExpandButton from '@/components/custom/ExpandButton';
import IssueCard from '@/components/custom/IssueCard';
import SearchInput from '@/components/custom/SearchInput';
import { STORAGE_KEYS } from '@/constants';
import { MENU_KEYS, PERMISSIONS } from '@/constants/permissions';
import ServerSidePagination from '@/features/others/Pagination/components/Pagination';
import { useTicketSocket } from '@/hooks/useStompClient';
import { getDataFromStorage } from '@/utils/encryptionUtils';

import { downloadInboxCsv, downloadOutboxCsv, fetchInboxTickets, fetchNoCustodianTicketCount, fetchOutboxTickets, pinTicket } from '../action';
import { TABLE_KEY } from '../constants';
import FilterPopup from '../popup/FilterPopup';
import TakeOverPopup from '../popup/TakeOverPopupGen';
import { getInboxTickets, getNoCustodianTicketCount, getOutboxTickets } from '../selector';

const TicketList = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const search = useSearch({ strict: false });
  const viewType = search.viewType || 'inbox';
  const setViewType = (newType) => navigate({ search: (prev) => ({ ...prev, viewType: newType }) });
  const [isAllExpanded, setIsAllExpanded] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({});
  const [takeOverPopupOpen, setTakeOverPopupOpen] = useState(false);
  const navigate = useNavigate();

  const inboxTickets = useSelector(getInboxTickets);
  const outboxTickets = useSelector(getOutboxTickets);
  const noCustodianTicketCount = useSelector(getNoCustodianTicketCount);  
  
  const [wsClaimedIds, setWsClaimedIds] = useState(new Set());

  const { InboxIcon, OutboxIcon } = Icons;

  const token = getDataFromStorage(STORAGE_KEYS.AUTH_TOKEN);

  const { claimTicket } = useTicketSocket({
    token,
    onUpdate: ({ ticketId, action }) => {
      if (action === 'REMOVE') {
        setWsClaimedIds((prev) => new Set(prev).add(ticketId));
      } else if (action === 'NEW') {
        getList();
      }
    }
  });

  const getList = useCallback(
    (params = {}) => {
      const fetchAction = viewType === 'inbox' ? fetchInboxTickets : fetchOutboxTickets;
      console.log('[TicketList] Dispatching fetch:', { viewType, params, filters });
      dispatch(fetchAction({ ...params, ...filters, key: TABLE_KEY }));
    },
    [dispatch, viewType, filters]
  );

  const { pinnedTickets, regularTickets } = useMemo(() => {
    const list = viewType === 'inbox' ? (inboxTickets || []) : (outboxTickets || []);
    const visible = list.filter((item) => !wsClaimedIds.has(item.id));
    const pinned = visible.filter((item) => item.isClicked);
    const regular = visible.filter((item) => !item.isClicked);
    return { pinnedTickets: pinned, regularTickets: regular };
  }, [viewType, inboxTickets, outboxTickets, wsClaimedIds]);

  useEffect(() => {
    const fetchParams = { key: TABLE_KEY, size: pageSize };
    if (searchQuery.length >= 3) {
      getList({ ...fetchParams, search: searchQuery });
    } else if (searchQuery.length === 0) {
      getList(fetchParams);
    }
  }, [searchQuery, getList, pageSize, viewType]);

  useEffect(() => {
    dispatch(fetchNoCustodianTicketCount())
  }, [dispatch])

  const handleFilterSubmit = useCallback((data) => {
    const formattedFilters = { ...data };
    if (data.priority && data.priority.length > 0) formattedFilters.priority = data.priority.map(p => p.code).join(',');
    else delete formattedFilters.priority;
    if (data.status && data.status.length > 0) formattedFilters.status = data.status.map(s => s.label).join(',');
    else delete formattedFilters.status;
    if (data.customerType) formattedFilters.customerType = data.customerType.code;
    if (data.createdDateFrom) formattedFilters.createdDateFrom = dayjs(data.createdDateFrom).format('YYYY-MM-DD');
    if (data.createdDateTo) formattedFilters.createdDateTo = dayjs(data.createdDateTo).format('YYYY-MM-DD');
    setFilters(formattedFilters);
  }, []);

  const handleSearch = useMemo(
    () => debounce((e) => { setSearchQuery(e.target.value); }, 500),
    []
  );

  const handleOpenDetails = (ticket) => {
    navigate({
      to: `/app/crm/ticket-list/ticket-details/${ticket.id}`,
      search: { viewType }
    });
    dispatch(pinTicket({ ticketId: ticket.id }));
    claimTicket(ticket.id);
  };

  const handleDownloadCsv = useCallback(() => {
    const downloadAction = viewType === 'inbox' ? downloadInboxCsv : downloadOutboxCsv;
    const params = { ...filters };
    if (searchQuery.length >= 3) params.search = searchQuery;
    dispatch(downloadAction(params));
  }, [dispatch, viewType, searchQuery, filters]);

  const handlePageChange = useCallback(
    ({ page, size }) => {
      const newSize = size || pageSize;
      if (size && size !== pageSize) setPageSize(size);
      const params = { page, size: newSize, ...filters };
      if (searchQuery.length >= 3) params.search = searchQuery;
      getList({ key: TABLE_KEY, ...params });
    },
    [pageSize, searchQuery, getList, filters]
  );

  const activeFilterCount = useMemo(() => {
    return Object.keys(filters).filter(
      (key) => filters[key] !== '' && filters[key] !== null && filters[key] !== undefined
    ).length;
  }, [filters]);

  return (
    <>
      <VStack alignItems={'stretch'} h='full'>
        <HStack justifyContent='space-between' alignItems='center' p={2}>
          <Box display={'flex'} bg="gray.100" borderRadius="full" p={1}>
            <Button
              border="none"
              bg={viewType === 'inbox' ? '#FFDE74' : 'transparent'}
              color={viewType === 'inbox' ? '#000' : 'gray.500'}
              onClick={() => setViewType('inbox')}
              fontSize='16px'
              fontWeight='500'
              fontStyle='normal'
              height='40px'
              width={{ base: '50px', '2xl': '140px' }}
              px={{ base: 2, '2xl': 4 }}
              position="relative"
            >
              {noCustodianTicketCount?.total > 0 && (
                <Box
                  as='span'
                  position='absolute'
                  top='-5px'
                  left='-5px'
                  bg='primary.500'
                  color='white'
                  borderRadius='full'
                  minW='18px'
                  height='18px'
                  px={1}
                  fontSize='10px'
                  display='flex'
                  alignItems='center'
                  justifyContent='center'
                  fontWeight='bold'
                  lineHeight='1'
                >
                  {noCustodianTicketCount.total}
                </Box>
              )}
              <InboxIcon color={viewType === 'inbox' ? '#000' : 'gray.500'} />
              <Box as="span" ml={1} display={{ base: 'none', '2xl': 'inline' }}>
                {t('inbox')}
              </Box>
            </Button>

            <Button
              border="none"
              bg={viewType === 'outbox' ? '#FFDE74' : 'transparent'}
              color={viewType === 'outbox' ? '#000' : 'gray.500'}
              onClick={() => setViewType('outbox')}
              fontSize='16px'
              fontWeight='500'
              fontStyle='normal'
              height='40px'
              width={{ base: '50px', '2xl': '140px' }}
              px={{ base: 2, '2xl': 4 }}
            >
              <OutboxIcon color={viewType === 'outbox' ? '#000' : 'gray.500'} />
              <Box as="span" ml={1} display={{ base: 'none', '2xl': 'inline' }}>
                {t('outbox')}
              </Box>
            </Button>
          </Box>

          <PermissionGuard action={PERMISSIONS.TICKET.SEARCH} menuKey={MENU_KEYS.TICKET_LIST}>
            <Box flex={1} maxW='400px'>
              <SearchInput placeholder={t('search')} onChange={handleSearch} />
            </Box>
          </PermissionGuard>
          <HStack>
            <PermissionGuard action={PERMISSIONS.TICKET.FILTER} menuKey={MENU_KEYS.TICKET_LIST}>
              <Button
                height={'40px'}
                borderRadius='md'
                variant={'outline'}
                onClick={() => setIsOpen(true)}
                position='relative'
              >
                <FilterIcon />
                <Box as="span" ml={1} display={{ base: 'none', '2xl': 'inline' }}>
                  {t('filter')}
                </Box>
                {activeFilterCount > 0 && (
                  <Box
                    as='span'
                    position='absolute'
                    top='-4px'
                    right='-4px'
                    bg='primary.500'
                    color='white'
                    borderRadius='full'
                    width='18px'
                    height='18px'
                    fontSize='11px'
                    display='flex'
                    alignItems='center'
                    justifyContent='center'
                    fontWeight='bold'
                  >
                    {activeFilterCount}
                  </Box>
                )}
              </Button>
            </PermissionGuard>
            <PermissionGuard action={PERMISSIONS.TICKET.DOWNLOAD_CSV} menuKey={MENU_KEYS.TICKET_LIST}>
              <CsvDownloadBtn onClick={handleDownloadCsv} />
            </PermissionGuard>
            <PermissionGuard action={PERMISSIONS.TICKET.CREATE_TICKET} menuKey={MENU_KEYS.TICKET_LIST}>
              <Button
                height={'40px'}
                borderRadius='md'
                variant={'outline'}
                onClick={() => navigate({ to: '/app/crm/ticket-list/create-ticket' })}
              >
                <CirclePlusIcon />
                  {t('createTicket')}
              </Button>
            </PermissionGuard>
            <PermissionGuard action={PERMISSIONS.TICKET.TAKE_OVER} menuKey={MENU_KEYS.TICKET_LIST}>
              <Button
                  height={'40px'}
                  borderRadius='md'
                  variant={'outline'}
                  onClick={() => setTakeOverPopupOpen(true)}
                >
                  {t('takeOver')}
                </Button>
            </PermissionGuard>
            <ExpandButton isAllExpanded={isAllExpanded} setIsAllExpanded={setIsAllExpanded} />
          </HStack>
        </HStack>

        <Box
          flex='1'
          overflowY='auto'
          w='full'
          bg='#F9FAFB'
          borderRadius='lg'
          borderStyle='dashed'
          borderWidth='1px'
          borderColor='gray.200'
          p={4}
        >
          {pinnedTickets.length > 0 && (
            <Box mb={4} position="sticky" top={-4} zIndex={10} bg="#F9FAFB" pt={1}>
              <IssueCard
                data={pinnedTickets}
                onOpen={viewType === 'inbox' ? handleOpenDetails : undefined}
                allExpanded={isAllExpanded}
                viewType={viewType}
                isPinned={true}
              />
            </Box>
          )}
          <IssueCard
            data={regularTickets}
            onOpen={handleOpenDetails}
            allExpanded={isAllExpanded}
            viewType={viewType}
            pinnedCount={pinnedTickets.length}
          />
        </Box>

        <Box mt={'auto'}>
          <ServerSidePagination tableKey={TABLE_KEY} onPageChange={handlePageChange} />
        </Box>
      </VStack>

      <FilterPopup isOpen={isOpen} setIsOpen={setIsOpen} onSubmit={handleFilterSubmit} />
      <TakeOverPopup isOpen={takeOverPopupOpen} setIsOpen={setTakeOverPopupOpen} />
    </>
  );
};

export default TicketList;
