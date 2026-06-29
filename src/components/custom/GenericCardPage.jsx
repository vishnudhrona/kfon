import { Box, HStack, SimpleGrid, Text, VStack } from '@kfonbss/bss-ui-components';
import { debounce, get } from 'lodash-es';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import CommonFilter from '@/components/custom/CommonFilter';
import CustomLoaderProvider from '@/components/custom/CustomLoaderProvider';
import SearchInput from '@/components/custom/SearchInput';
import { getApiProgress } from '@/features/others/ApiProgress/selectors';
import ServerSidePagination from '@/features/others/Pagination/components/Pagination';
import { getServerSideFilterDetails, getServerSidePaginationDetails } from '@/features/others/Pagination/selectors';
import { actions as paginationActions } from '@/features/others/Pagination/slice';
import { selectorWithKey } from '@/utils/commonUtils';

const CardItem = ({ data, columns, index, onClick }) => {
  return (
    <Box
      w='full'
      p={4}
      border='1px solid'
      borderColor='gray.200'
      borderRadius='md'
      bg='white'
      boxShadow='sm'
      cursor={onClick ? 'pointer' : 'default'}
      onClick={() => onClick && onClick(data)}
      _hover={{ borderColor: 'primary.main', boxShadow: 'md' }}
      transition='all 0.2s'
    >
      <HStack align='start' spacing={4}>
        <Text fontWeight='bold' color='gray.400' minW='30px' fontSize='sm'>
          {String(index).padStart(2, '0')}
        </Text>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4} w='full'>
          {columns.map((col, idx) => {
            const value = get(data, col.accessor);
            return (
              <VStack key={idx} align='start' spacing={0}>
                <Text fontSize='xs' color='gray.500' textTransform='uppercase' fontWeight='bold'>
                  {col.header}
                </Text>
                <Text fontSize='sm' color='gray.700' wordBreak='break-word'>
                  {value !== null && value !== undefined ? String(value) : '-'}
                </Text>
              </VStack>
            );
          })}
        </SimpleGrid>
      </HStack>
    </Box>
  );
};

const GenericCardPage = ({
  dataSelector = () => {},
  data,
  fetchAction,
  columns = [],
  filters,
  filterConfig,
  actions,
  dashboard,
  tableKey,
  footerActions,
  onRowClick,
  params = {},
  staticParams = {},
  headerContent,
  isSearchEnabled = true,
  externalSearch,
  externalFilters,
  searchPrefix,
  afterSearch,
  CardComponent,
  expandAll
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const listData = useSelector(dataSelector);
  const apiProgress = useSelector(getApiProgress);
  const isLoading = !!apiProgress?.[fetchAction?.type];
  const paginationDetails = useSelector(getServerSidePaginationDetails);
  const { page } = selectorWithKey(paginationDetails, tableKey) || {};
  const filterDetails = useSelector(getServerSideFilterDetails);
  const filterDetailsRef = useRef(filterDetails);
  filterDetailsRef.current = filterDetails;

  const [internalSearch, setInternalSearch] = useState('');
  const searchQuery = externalSearch !== undefined ? externalSearch : internalSearch;
  const [pageSize, setPageSize] = useState(10);

  // Always-current refs — updated every render, safe to read inside callbacks/effects
  const staticParamsRef = useRef(staticParams);
  staticParamsRef.current = staticParams;
  const paramsRef = useRef(params);
  paramsRef.current = params;
  const externalFiltersRef = useRef(externalFilters);
  externalFiltersRef.current = externalFilters;
  const searchQueryRef = useRef(searchQuery);
  searchQueryRef.current = searchQuery;
  const pageSizeRef = useRef(pageSize);
  pageSizeRef.current = pageSize;

  // Dispatches fetchAction with all current params merged
  const fetchData = useCallback(
    (overrides = {}) => {
      const sq = searchQueryRef.current;
      const savedFilters = selectorWithKey(filterDetailsRef.current, tableKey) || {};
      const payload = {
        key: tableKey,
        size: pageSizeRef.current,
        page: 0,
        ...paramsRef.current,
        ...savedFilters,
        ...(externalFiltersRef.current ?? {}),
        ...(sq.length >= 3 ? { search: sq } : {}),
        ...overrides,
        ...staticParamsRef.current
      };
      dispatch(fetchAction(payload));
    },
    [dispatch, fetchAction, tableKey]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      dispatch(paginationActions.resetFilter({ key: tableKey }));
      dispatch(paginationActions.resetPagination({ key: tableKey }));
    };
  }, [dispatch, tableKey]);

  const prevSearchQuery = useRef(searchQuery);

  // Initial fetch on mount
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-fetch when search changes (skip 1-2 chars — wait for 3+); skip if value unchanged
  useEffect(() => {
    if (searchQuery === prevSearchQuery.current) return;
    prevSearchQuery.current = searchQuery;
    if (searchQuery.length > 0 && searchQuery.length < 3) return;
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  // Re-fetch when externalFilters change (StockFilterModal path)
  const prevExternalFiltersKey = useRef(JSON.stringify(externalFilters ?? null));
  useEffect(() => {
    const key = JSON.stringify(externalFilters ?? null);
    if (key === prevExternalFiltersKey.current) return;
    prevExternalFiltersKey.current = key;
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [externalFilters]);

  const handlePageChange = useCallback(
    ({ page, size }) => {
      const newSize = size ?? pageSizeRef.current;
      if (size && size !== pageSizeRef.current) setPageSize(size);
      fetchData({ page, size: newSize });
    },
    [fetchData]
  );

  const handleSearch = useMemo(
    () =>
      debounce((e) => {
        setInternalSearch(e.target.value);
      }, 500),
    []
  );

  // Called by CommonFilter — filter values come in directly, not from Redux state
  const handleApplyFilters = useCallback(
    (filterValues) => {
      fetchData({ page: 0, ...filterValues });
    },
    [fetchData]
  );

  const tableData = listData?.data || data || [];
  const isEmpty = !tableData || tableData.length === 0;

  const resolvedColumns = useMemo(() => {
    return columns.map((col) => ({
      ...col,
      header: t(col.header) || col.header
    }));
  }, [columns, t]);

  return (
    <VStack alignItems={'stretch'} h='full' minH='0' flex='1' w='full' gap='2'>
      {headerContent}

      <HStack justifyContent={'space-between'} mt={2}>
        {isSearchEnabled && (
          <HStack spacing={2}>
            {searchPrefix}
            <SearchInput placeholder={t('search')} onChange={handleSearch} />
            {afterSearch}
          </HStack>
        )}
        <HStack flex={'3'} justifyContent={'end'}>
          {filterConfig ? (
            <CommonFilter filterConfig={filterConfig} tableKey={tableKey} onApplyFilters={handleApplyFilters} />
          ) : (
            filters
          )}
          {actions}
        </HStack>
      </HStack>

      {dashboard && (
        <Box
          w='full'
          overflowX='auto'
          py='2'
          px='1'
          flexShrink={0}
          css={{
            '&::-webkit-scrollbar': {
              display: 'none'
            },
            '-ms-overflow-style': 'none',
            'scrollbar-width': 'none'
          }}
        >
          {dashboard}
        </Box>
      )}

      <CustomLoaderProvider
        isLoading={isLoading}
        flex='1'
        minH='0'
        display='flex'
        flexDirection='column'
        mt={2}
        w='full'
      >
        <Box
          flex='1'
          w='full'
          overflowY='auto'
          bg='white'
          borderRadius='lg'
        
          p={4}
        >
          {isEmpty ? (
            <VStack spacing={4} align='center' justify='center' h='200px'>
              <Text fontSize='lg' fontWeight='bold' color='gray.500'>
                {t('noRecordsFound')}
              </Text>
            </VStack>
          ) : (
            <VStack spacing={4} align='stretch' w='full'>
              {tableData.map((item, index) => {
                const RowComponent = CardComponent || CardItem;

                return (
                  <RowComponent
                    key={item.slNo ?? item.id ?? item.uuid ?? index}
                    data={item}
                    columns={resolvedColumns}
                    index={(page || 0) * (pageSize || 10) + index + 1}
                    onClick={onRowClick}
                    expandAll={expandAll}
                  />
                );
              })}
            </VStack>
          )}
        </Box>
      </CustomLoaderProvider>

      <Box mt={'auto'}>
        <ServerSidePagination onPageChange={handlePageChange} tableKey={tableKey} />
      </Box>
      {footerActions && (
        <HStack justify='flex-end' spacing='12px' mt='4'>
          {footerActions}
        </HStack>
      )}
    </VStack>
  );
};

export default GenericCardPage;
