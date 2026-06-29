import { Box, Headline, HStack, Table, VStack } from '@kfonbss/bss-ui-components';
import { debounce } from 'lodash-es';
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
import { mapObjectValues, selectorWithKey } from '@/utils/commonUtils';

const GenericPageTable = ({
  pageTitle,
  dataSelector = () => { },
  data,
  fetchAction,
  columns,
  filters,
  filterConfig,
  actions,
  dashboard,
  tableKey,
  footerActions,
  onRowClick,
  searchable = true,
  params = {},
  staticParams = {},
  headerContent
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const listData = useSelector(dataSelector);
  const apiProgress = useSelector(getApiProgress);
  const isLoading = !!apiProgress?.[fetchAction?.type];
  const paginationDetails = useSelector(getServerSidePaginationDetails);
  const filterDetails = useSelector(getServerSideFilterDetails);
  const { page, size } = selectorWithKey(paginationDetails, tableKey) || {};

  const currentFilters = useMemo(() => {
    return selectorWithKey(filterDetails, tableKey) || {};
  }, [filterDetails, tableKey]);

  const [searchQuery, setSearchQuery] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const paramsRef = useRef(params);
  const staticParamsRef = useRef(staticParams);

  const mappedColumns = useMemo(() => {
    return mapObjectValues(columns, t, ['header']);
  }, [columns, t]);

  const getList = useCallback(
    (params = {}) => {
      if (fetchAction) {
        dispatch(fetchAction({ ...params, key: tableKey, ...staticParamsRef.current }));
      }
    },
    [dispatch, fetchAction, tableKey]
  );

  useEffect(() => {
    return () => {
      dispatch(paginationActions.resetFilter({ key: tableKey }));
      dispatch(paginationActions.resetPagination({ key: tableKey }));
    };
  }, [dispatch, tableKey]);

  useEffect(() => {
    const fetchParams = { key: tableKey, size: pageSize, ...paramsRef.current, ...currentFilters };

    if (searchQuery.length >= 3) {
      getList({ ...fetchParams, page: 0, size: pageSize, search: searchQuery });
    } else if (searchQuery.length === 0) {
      getList(fetchParams);
    }
  }, [searchQuery, getList, pageSize, tableKey, currentFilters]);

  const handlePageChange = useCallback(
    ({ page, size }) => {
      const newSize = size || pageSize;
      if (size && size !== pageSize) {
        setPageSize(size);
      }
      const params = { page, size: newSize, ...currentFilters };
      if (searchQuery.length >= 3) {
        params.search = searchQuery;
      }
      getList({ key: tableKey, ...params });
    },
    [pageSize, searchQuery, getList, tableKey, currentFilters]
  );

  const handleSearch = useMemo(
    () =>
      debounce((e) => {
        setSearchQuery(e.target.value);
      }, 500),
    []
  );

  const handleApplyFilters = useCallback(
    (filterValues) => {
      // Reset to first page when filters change
      const params = { page: 0, size: pageSize, ...filterValues };
      if (searchQuery.length >= 3) {
        params.search = searchQuery;
      }
      getList({ key: tableKey, ...params });
    },
    [pageSize, searchQuery, getList, tableKey]
  );

  return (
    <VStack alignItems={'stretch'} h='full' gap='2'>
      {pageTitle && <Headline headName={pageTitle} />}
      {headerContent}

      <HStack justifyContent={'space-between'} mt={2}>
        {searchable && <SearchInput placeholder={t('search')} onChange={handleSearch} />}
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
        <Box flex='1' overflow='hidden'>
          <Table
            headerColor='table_header.primary'
            data={listData?.data || data || []}
            columns={mappedColumns}
            page={page}
            size={size}
            onRowClick={onRowClick}
            emptyMessage={t('noRecordsFound')}
          />
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

export default GenericPageTable;
