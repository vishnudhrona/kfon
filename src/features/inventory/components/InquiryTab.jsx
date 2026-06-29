import { Box, Button, Flex, Icons, Text } from '@kfonbss/bss-ui-components';
import { useNavigate } from '@tanstack/react-router';
import { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { SERVER_SIDE_TABLE_KEYS } from '@/constants/server_table';
import ServerSidePagination from '@/features/others/Pagination/components/Pagination';
import { getServerSidePaginationDetails } from '@/features/others/Pagination/selectors';
import { actions as paginationActions } from '@/features/others/Pagination/slice';
import { selectorWithKey } from '@/utils/commonUtils';

import { fetchLnpRequests } from '../actions';
import { useStockManagement } from '../context/StockManagementContext';
import { getLnpRequestsList } from '../selectors';

const TABLE_KEY = SERVER_SIDE_TABLE_KEYS.LNP_INQUIRY_TABLE;

const InquiryRow = ({ item, index, onProcess, requested }) => {
  const { t } = useTranslation();

  return (
    <Flex
      align='center'
      justify='space-between'
      p='4'
      bg='white'
      borderRadius='md'
      border='1px solid'
      borderColor='gray.200'
      boxShadow='sm'
    >
      <Flex align='center' gap='3'>
        <Box
          bg='#FCECB8'
          px='3'
          py='1'
          borderRadius='md'
          fontSize='sm'
          fontWeight='bold'
          color='gray.800'
          minW='36px'
          textAlign='center'
        >
          {String(index + 1).padStart(2, '0')}
        </Box>
        <Box color='primary.500'>
          <Icons.DirectionalArrowIcon boxSize='18px' color='primary.500' />
        </Box>
        <Flex align='center' gap='0'>
          <Text fontSize='sm' color='gray.600' mr='1'>
            {t('lnp')}:
          </Text>
          <Text fontSize='sm' fontWeight='semibold' color='primary.600' mr='3'>
            {item.companyName || '-'}
          </Text>
        </Flex>
        <Box w='1px' h='18px' bg='gray.300' />
        <Text fontSize='sm' fontWeight='semibold' color='gray.700' mx='3'>
          {item.type || '-'}
        </Text>
        <Box w='1px' h='18px' bg='gray.300' />
        <Text fontSize='sm' fontWeight='bold' color='gray.900' ml='3'>
          {item.categoryName || '-'}
        </Text>
      </Flex>

      <Flex align='center' gap='3'>
        <Box
          border='1px solid'
          borderColor='gray.200'
          borderRadius='md'
          px='3'
          py='1.5'
          fontSize='sm'
          bg='white'
          color='gray.700'
          whiteSpace='nowrap'
        >
          {t('requestNos')}:{' '}
          <Text as='span' fontWeight='bold' color='gray.900'>
            {String(item.count ?? 0).padStart(2, '0')}
          </Text>
        </Box>
        <Box
          border='1px solid'
          borderColor='green.200'
          borderRadius='md'
          px='3'
          py='1.5'
          fontSize='sm'
          bg='green.50'
          color='green.700'
          whiteSpace='nowrap'
        >
          {t('approved')}:{' '}
          <Text as='span' fontWeight='bold' color='green.800'>
            {String(item.appDevCount ?? 0).padStart(2, '0')}
          </Text>
        </Box>
        {!requested && (
          <Button
            bg='primary.500'
            color='white'
            borderRadius='md'
            px='4'
            h='36px'
            fontSize='sm'
            fontWeight='500'
            _hover={{ bg: 'primary.600' }}
            display='flex'
            alignItems='center'
            gap='6px'
            onClick={() => onProcess(item)}
            disabled={!!item.appDevCount}
          >
            {t('process')}
            <Icons.BsArrowRightCircle boxSize='4' />
          </Button>
        )}
      </Flex>
    </Flex>
  );
};

const InquiryTab = ({ requested = false, searchQuery = '', filters = null }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { setFilters, setLnpContext } = useStockManagement();
  const lnpRequests = useSelector(getLnpRequestsList);
  const { page = 0, size = 10 } = selectorWithKey(useSelector(getServerSidePaginationDetails), TABLE_KEY) || {};

  const buildParams = useCallback(
    (overrides = {}) => ({
      key: TABLE_KEY,
      ...(requested ? { requested: true } : {}),
      ...(filters ?? {}),
      ...(searchQuery && searchQuery.length >= 3 ? { search: searchQuery } : {}),
      ...overrides
    }),
    [requested, filters, searchQuery]
  );

  useEffect(() => {
    dispatch(fetchLnpRequests(buildParams()));
  }, [dispatch, buildParams]);

  useEffect(() => {
    return () => {
      dispatch(paginationActions.resetPagination({ key: TABLE_KEY }));
      dispatch(paginationActions.resetPaginationResponse({ key: TABLE_KEY }));
    };
  }, [dispatch]);

  const handleProcess = (item) => {
    setFilters({
      deviceType: item.type,
      stockStatus: 'IN_STOCK'
    });
    setLnpContext({
      companyName: item.companyName,
      requestedCount: item.count,
      userId: item.userId,
      requestId: item.lnpRequestId,
      userName: item.userName,
      deviceType: item.type,
      category: item.categoryName
    });
    navigate({
      to: '/app/inventory/stock-management',
      search: { tab: 'myStock' }
    });
  };

  return (
    <Flex direction='column' h='full' minH='0' flex='1' w='100%' mt={requested ? 4 : 0} gap='3'>
      {requested && (
        <Text fontSize='md' fontWeight='semibold' color='gray.700' flexShrink={0}>
          {t('previousRequests')}
        </Text>
      )}
      <Box flex='1' minH='0' overflowY='auto'>
        <Flex direction='column' gap='3'>
          {lnpRequests.length > 0 ? (
            lnpRequests.map((item, index) => (
              <InquiryRow
                key={item.id ?? item.requestId ?? item.lnpRequestId ?? index}
                item={item}
                index={page * size + index}
                onProcess={handleProcess}
                requested={requested}
              />
            ))
          ) : (
            <Text color='gray.500'>{t('noRecordsFound')}</Text>
          )}
        </Flex>
      </Box>
      <Box mt='auto' flexShrink={0}>
        <ServerSidePagination
          tableKey={TABLE_KEY}
          onPageChange={({ page, size }) => dispatch(fetchLnpRequests(buildParams({ page, size })))}
        />
      </Box>
    </Flex>
  );
};

export default InquiryTab;
