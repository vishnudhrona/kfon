import { Badge, Box, Button, Flex, Icons, Tab } from '@kfonbss/bss-ui-components';
import { Outlet, useNavigate, useParams, useSearch } from '@tanstack/react-router';
import { debounce } from 'lodash-es';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import SearchInput from '@/components/custom/SearchInput';
import { getServerSidePaginationResponse } from '@/features/others/Pagination/selectors';
import { usePageActions } from '@/hooks/usePageActions';
import { selectorWithKey } from '@/utils/commonUtils';

import { fetchTransferredStockList } from '../actions';
import StockFilterModal from '../components/StockFilterModal';
import { INVENTORY_KEYS } from '../constants';
import { StockManagementContext } from '../context/StockManagementContext';

const StockManagement = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const search = useSearch({ strict: false });
  const { typeName } = useParams({ strict: false });
  const selectedTab = search.tab || (typeName ? 'availableStock' : 'inquiry');

  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filters, setFilters] = useState(null);
  const [filterFormValues, setFilterFormValues] = useState(null);
  const [lnpContext, setLnpContext] = useState(null);

  const { hasPermission } = usePageActions();

  const paginationResponse = useSelector(getServerSidePaginationResponse);
  const { totalElements: transferredCount = 0 } =
    selectorWithKey(paginationResponse, INVENTORY_KEYS.TRANSFERRED_STOCK_LIST) || {};

  useEffect(() => {
    dispatch(fetchTransferredStockList({ key: INVENTORY_KEYS.TRANSFERRED_STOCK_LIST }));
  }, [dispatch]);

  useEffect(() => {
    setSearchQuery('');
  }, [selectedTab]);

  const handleSearch = useMemo(
    () =>
      debounce((e) => {
        setSearchQuery(e.target.value);
      }, 500),
    []
  );

  const allTabItems = [
    { label: t('inquiry'), value: 'inquiry', action: 'external_request_list' },
    { label: t('externalRequest'), value: 'externalRequest', action: 'external_request' },
    { label: t('availableStock'), value: 'availableStock', action: 'available_stock_list' },
    { label: t('myStock'), value: 'myStock', action: null },
    { label: t('transferList'), value: 'transferredList', action: null }
  ];

  const tabItems = allTabItems
    .filter(({ action }) => action === null || hasPermission(action))
    .map(({ label, value }) => ({ label, value }));

  useEffect(() => {
    if (!search.tab && !typeName && tabItems.length > 0) {
      navigate({
        to: '/app/inventory/stock-management',
        search: { tab: tabItems[0].value },
        replace: true
      });
    }
  }, [search.tab, typeName, tabItems.length, navigate, tabItems]);

  const handleTabChange = (value) => {
    setFilters(null);
    setFilterFormValues(null);
    setLnpContext(null);
    setSearchQuery('');
    navigate({
      to: '/app/inventory/stock-management',
      search: { tab: value }
    });
  };

  const { FilterIcon } = Icons;

  const activeFilterCount = filters ? Object.values(filters).filter(Boolean).length : 0;

  return (
    <Box p={4} display='flex' flexDirection='column' gap={4} h='full' overflow='hidden'>
      <Flex justify='space-between' align='center' mb={4}>
        <SearchInput key={selectedTab} placeholder={t('search')} onChange={handleSearch} />

        <Box position='relative'>
          <Tab
            hilightColor='table_header.primary'
            fontColor='font_color.primary'
            backgroundColor='background.light_gray'
            value={selectedTab}
            items={tabItems}
            onChange={handleTabChange}
          />
          {transferredCount > 0 && (
            <Badge
              position='absolute'
              top='-1'
              right='-1'
              w='5'
              h='5'
              borderRadius='full'
              bg='primary.500'
              color='white'
              fontSize='10px'
              fontWeight='500'
              display='flex'
              alignItems='center'
              justifyContent='center'
              p='0'
            >
              {transferredCount}
            </Badge>
          )}
        </Box>

        <Box position='relative'>
          <Button variant='outline' borderRadius='md' height='40px' onClick={() => setIsFilterModalOpen(true)}>
            <FilterIcon />
            {t('filter')}
          </Button>
          {activeFilterCount > 0 && (
            <Badge
              position='absolute'
              top='-1'
              right='-1'
              w='5'
              h='5'
              borderRadius='full'
              bg='primary.500'
              color='white'
              fontSize='10px'
              fontWeight='500'
              display='flex'
              alignItems='center'
              justifyContent='center'
              p='0'
            >
              {activeFilterCount}
            </Badge>
          )}
        </Box>
      </Flex>

      <Box flex='1' minH='0' display='flex' flexDirection='column'>
        <StockManagementContext.Provider value={{ searchQuery, filters, setFilters, lnpContext, setLnpContext }}>
          <Outlet />
        </StockManagementContext.Provider>
      </Box>

      <StockFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        defaultValues={filterFormValues}
        allowedFields={selectedTab === 'inquiry' || selectedTab === 'externalRequest' ? ['deviceType'] : undefined}
        onApply={(appliedFilters, formValues) => {
          setFilters(appliedFilters);
          setFilterFormValues(formValues);
        }}
      />
    </Box>
  );
};

export default StockManagement;
