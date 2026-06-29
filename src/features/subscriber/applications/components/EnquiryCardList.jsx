import { Box, HStack, Stack, Text, VStack } from '@kfonbss/bss-ui-components';
import dayjs from 'dayjs';
import { debounce } from 'lodash-es';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import CommonFilter from '@/components/custom/CommonFilter';
import CustomLoaderProvider from '@/components/custom/CustomLoaderProvider';
import SearchInput from '@/components/custom/SearchInput';
import { DATE_FORMAT } from '@/constants/date';
import { getApiProgress } from '@/features/others/ApiProgress/selectors';
import ServerSidePagination from '@/features/others/Pagination/components/Pagination';
import { getServerSideFilterDetails, getServerSidePaginationDetails } from '@/features/others/Pagination/selectors';
import { actions as paginationActions } from '@/features/others/Pagination/slice';
import { selectorWithKey } from '@/utils/commonUtils';

import GenericCard from './GenericCard';

// Helper to map enquiry data to card props
const mapEnquiryToCard = (enquiry) => {
  // Format: DD-MM-YYYY hh:mm AM/PM (e.g., "02-01-2026 10:05 AM")
  const enquiryDate = enquiry.createdAt ? dayjs(enquiry.createdAt).format(DATE_FORMAT.DATE_TIME) : 'N/A';

  return {
    ...enquiry,
    id: enquiry.trackingId,
    enquiryId: enquiry.id,
    customerName: enquiry.name,
    location: enquiry.address,
    enquiryDate,
    daysPassed: enquiry.days ?? '-',
    source: enquiry.source || '-',
    status: enquiry.status || 'RECEIVED',
    addressLine1: enquiry.address || '',
    addressLine2: '',
    pincode: enquiry.pincode || '-',
    district: enquiry.district || '-',
    mobile: enquiry.mobile,
    alternateMobile: enquiry.alternateMobile,
    email: enquiry.email,
    lnp: enquiry.lnpName || '-',
    fe: enquiry.feName || 'Not Assigned',
    latitude: enquiry.latitude || '8.507667',
    longitude: enquiry.longitude || '76.962146',
    planCode: enquiry.planCode || ''
  };
};

const EnquiryCardList = ({
  dataSelector,
  fetchAction,
  tableKey,
  params = {},
  staticParams = {},
  filterConfig,
  filters,
  actions,
  expandAll,
  searchPrefix,
  CardComponent = GenericCard,
  mapData = mapEnquiryToCard,
  onApplyFilters: onApplyFiltersProp,
  isOutbox = false
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const listData = useSelector(dataSelector);
  const apiProgress = useSelector(getApiProgress);
  const isLoading = !!apiProgress[fetchAction.type];
  const paginationDetails = useSelector(getServerSidePaginationDetails);
  const filterDetails = useSelector(getServerSideFilterDetails);
  const { page = 0 } = selectorWithKey(paginationDetails, tableKey) || {};

  const currentFilters = useMemo(() => {
    return selectorWithKey(filterDetails, tableKey) || {};
  }, [filterDetails, tableKey]);

  const [searchQuery, setSearchQuery] = useState('');
  const [pageSize, setPageSize] = useState(10);

  const paramsRef = useRef(params);
  const staticParamsRef = useRef(staticParams);

  useEffect(() => {
    paramsRef.current = params;
  }, [params]);

  useEffect(() => {
    staticParamsRef.current = staticParams;
  }, [staticParams]);

  const data = useMemo(() => {
    if (Array.isArray(listData)) return listData;
    return listData?.data || [];
  }, [listData]);
  const mappedData = useMemo(() => data.map(mapData), [data, mapData]);
  const isEmpty = !data || data.length === 0;

  const getList = useCallback(
    (params = {}) => {
      dispatch(fetchAction({ ...params, key: tableKey, ...staticParamsRef.current }));
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
      getList({ ...fetchParams, search: searchQuery });
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
      const params = { page, size: newSize, ...paramsRef.current, ...currentFilters };
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
      if (onApplyFiltersProp) {
        onApplyFiltersProp(filterValues, ({ filteredValues }) => {
          const params = { page: 0, size: pageSize, ...paramsRef.current, ...filteredValues };
          if (searchQuery.length >= 3) params.search = searchQuery;
          getList({ key: tableKey, ...params });
        });
        return;
      }
      const params = { page: 0, size: pageSize, ...paramsRef.current, ...filterValues };
      if (searchQuery.length >= 3) {
        params.search = searchQuery;
      }
      getList({ key: tableKey, ...params });
    },
    [onApplyFiltersProp, pageSize, searchQuery, getList, tableKey]
  );

  return (
    <>
      <Box
        w='full'
        flex={1}
        minH={0}
        borderRadius='lg'
        border='none'
        display='flex'
        flexDirection='column'
        overflow='hidden'
        px='4'
        pb='4'
      >
        {/* Fixed Header Section */}
        <Box pt={4} pb={3}>
          <Stack direction={{ base: 'column', md: 'row' }} justify='space-between' spacing={4}>
            <Stack direction={{ base: 'column', lg: 'row' }} spacing={4} flex={1} w='full'>
              {searchPrefix}
              <Box w={{ base: 'full', md: '300px' }}>
                <SearchInput placeholder={t('search')} onChange={handleSearch} bg='white' />
              </Box>
            </Stack>
            <HStack spacing={4} alignSelf={{ base: 'flex-start', md: 'center' }}>
              {filterConfig ? (
                <CommonFilter filterConfig={filterConfig} tableKey={tableKey} onApplyFilters={handleApplyFilters} />
              ) : (
                filters
              )}
              {actions?.component || actions}
            </HStack>
          </Stack>
        </Box>

        {/* Scrollable Content Area */}
        <CustomLoaderProvider isLoading={isLoading} flex={1} minH={0} display='flex' flexDirection='column'>
          <Box flex={1} minH={0} overflowY='auto' position='relative'>
            {isEmpty ? (
              <VStack spacing={4} align='center' justify='center' h='300px'>
                <Text fontSize='lg' fontWeight='bold' color='gray.500'>
                  {t('noRecordsFound')}
                </Text>
              </VStack>
            ) : (
              <VStack spacing={4} align='stretch' w='full'>
                {mappedData.map((item, index) => (
                  <CardComponent
                    key={item.id || item.enquiryId || index}
                    data={item}
                    index={index + 1 + page * pageSize}
                    onAction={actions?.onRowAction}
                    expandAll={expandAll}
                    isOutbox={isOutbox}
                  />
                ))}
              </VStack>
            )}
          </Box>
        </CustomLoaderProvider>
      </Box>
      {/* Fixed Footer for Pagination */}
      <Box px={4} pt='2' borderColor='gray.200' bg='white'>
        <ServerSidePagination onPageChange={handlePageChange} tableKey={tableKey} />
      </Box>
    </>
  );
};

export default EnquiryCardList;
