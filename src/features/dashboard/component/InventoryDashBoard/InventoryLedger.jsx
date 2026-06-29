import { Box, Flex, HStack, Icons, Text, VStack } from '@kfonbss/bss-ui-components';
import { useNavigate } from '@tanstack/react-router';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { INVENTORY_DASHBOARD_ACTIONS } from '@/constants/permissions';
import { fetchDistrict } from '@/features/common/actions';
import { getDistrict } from '@/features/common/selectors';
import { fetchDeviceTypeDropdown } from '@/features/inventory/actions';
import { INVENTORY_KEYS } from '@/features/inventory/constants';
import { getDropdownData } from '@/features/inventory/selectors';
import { usePageActions } from '@/hooks/usePageActions';

import {
  fetchInventoryDistrictBreakdown,
  fetchInventoryRecentActivity,
  fetchInventoryRequestPipeline,
  fetchInventoryStockTypeCount,
  fetchInventorySummaryCards,
  fetchInventoryWarrantyAlerts
} from './action';
import FilterModal from './components/FilterModal';
import KeralaTreemap from './components/KeralaTreemap';
import LiveOperations from './components/LiveOperations';
import RecentStockEntries from './components/RecentStockEntries';
import StockAvailability from './components/StockAvailability';
import StockCensus from './components/StockCensus';
import { T } from './components/tokens';
import TransferReport from './components/TransferReport';
import VendorProductDetails from './components/VendorProductDetails';
import { INVENTORY_DASHBOARD_SCOPES } from './constants'; // kept for param values
import {
  getInventoryActiveRoutes,
  getInventoryAssetValue,
  getInventoryDistrictBreakdown,
  getInventoryRequestPipeline,
  getInventoryRequestQueue,
  getInventoryStockEntries,
  getInventoryStockTypeCount,
  getInventorySummaryCards,
  getInventoryTransferList,
  getInventoryVendorStock
} from './selector';

const EMPTY_FILTERS = {
  districts: [],
  term: null,
  fromDate: '',
  toDate: '',
  deviceTypes: [],
  vendors: [],
  statuses: [],
  custodianRole: null,
  custodianPerson: null
};

function countActiveFilters(f) {
  return [
    (f.districts   || []).length > 0,
    !!f.term,
    !!(f.fromDate),
    !!(f.toDate),
    (f.deviceTypes || []).length > 0,
    (f.vendors     || []).length > 0,
    (f.statuses    || []).length > 0,
    !!f.custodianRole,
    !!f.custodianPerson
  ].filter(Boolean).length;
}

const InventoryLedger = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { hasPermission } = usePageActions();
  const scope = hasPermission(INVENTORY_DASHBOARD_ACTIONS.DISTRICT_ACCESS)
    ? INVENTORY_DASHBOARD_SCOPES.DISTRICT_LEVEL
    : hasPermission(INVENTORY_DASHBOARD_ACTIONS.INDIVIDUAL_ACCESS)
      ? INVENTORY_DASHBOARD_SCOPES.OWNED
      : INVENTORY_DASHBOARD_SCOPES.STATE_LEVEL;

  const [filterOpen, setFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState(EMPTY_FILTERS);

  const summaryCards = useSelector(getInventorySummaryCards);
  const stockTypeCount = useSelector(getInventoryStockTypeCount);
  const districtBreakdown = useSelector(getInventoryDistrictBreakdown);
  const requestPipeline = useSelector(getInventoryRequestPipeline);
  const transferList = useSelector(getInventoryTransferList);
  const requestQueue = useSelector(getInventoryRequestQueue);
  const activeRoutes = useSelector(getInventoryActiveRoutes);
  const vendorStock = useSelector(getInventoryVendorStock);
  const stockEntries = useSelector(getInventoryStockEntries);
  const assetValue = useSelector(getInventoryAssetValue);
  const districtList = useSelector(getDistrict);
  const deviceTypes = useSelector(getDropdownData(INVENTORY_KEYS.DEVICE_TYPE_LIST));

  const fetchAll = useCallback(
    (filters) => {
      const { custodianRole, custodianPerson, ...rest } = filters;
      const params = {
        scope,
        ...rest,
        ...(custodianRole?.id && { roleId: custodianRole.id }),
        ...(custodianPerson?.id && { custodianId: custodianPerson.id })
      };
      dispatch(fetchInventorySummaryCards(params));
      dispatch(fetchInventoryStockTypeCount(params));
      dispatch(fetchInventoryWarrantyAlerts(params));
      dispatch(fetchInventoryRequestPipeline(params));
      dispatch(fetchInventoryDistrictBreakdown(params));
      dispatch(fetchInventoryRecentActivity(params));
    },
    [dispatch, scope]
  );

  useEffect(() => {
    fetchAll(EMPTY_FILTERS);
    dispatch(fetchDistrict());
    dispatch(fetchDeviceTypeDropdown());
  }, [fetchAll, dispatch, scope]);

  const handleApplyFilters = (filters) => {
    setActiveFilters(filters);
    fetchAll(filters);
  };

  const handleStockAvailabilityFilter = useCallback(
    ({ districtId, typeId }) => {
      const { custodianRole, custodianPerson, ...rest } = activeFilters;
      const params = {
        scope,
        ...rest,
        ...(custodianRole?.id && { roleId: custodianRole.id }),
        ...(custodianPerson?.id && { custodianId: custodianPerson.id }),
        ...(districtId && { districtId }),
        ...(typeId && { typeId })
      };
      dispatch(fetchInventoryDistrictBreakdown(params));
    },
    [dispatch, scope, activeFilters]
  );

  const activeCount = countActiveFilters(activeFilters);

  return (
    <Box minH='100vh'>
      <Flex justify='space-between' align='flex-end' mb='18px' flexWrap='wrap' gap='14px'>
        <Box>
          <Text
            fontSize='30px'
            fontWeight='400'
            color={T.maroon800}
            letterSpacing='-0.4px'
            lineHeight='1'
            mb='4px'
          >
            {t('inventoryLedger')}
          </Text>
          <Text fontSize='13px' color={T.inkSoft} lineHeight='1.4' fontWeight='500'>
            {t('inventoryLedgerSubtitle')}
          </Text>
        </Box>
        <HStack gap='8px'>
          <HStack
            as='button'
            gap='8px'
            px='14px'
            py='7px'
            borderRadius='100px'
            bg={T.yellowBg}
            border={`1px solid ${T.yellowWarm}`}
            color={T.maroon800}
            fontSize='11.5px'
            fontWeight='700'
            cursor='pointer'
          >
            <Box w='6px' h='6px' borderRadius='50%' bg={T.mint} style={{ animation: 'pulse 2s infinite' }} />
            <Text>{assetValue?.period ?? '—'}</Text>
            <Icons.ChevronDownIcon w='10px' h='10px' />
          </HStack>

          {/* Filter button with active-count badge */}
          <Box position='relative'>
            <HStack
              as='button'
              gap='6px'
              px='14px'
              py='8px'
              borderRadius='100px'
              bg={activeCount > 0 ? '#FFF5F9' : T.card}
              border={`1px solid ${activeCount > 0 ? T.maroon700 : T.line}`}
              color={T.maroon700}
              fontSize='11.5px'
              fontWeight='700'
              cursor='pointer'
              _hover={{ borderColor: T.maroon700 }}
              onClick={() => setFilterOpen(true)}
            >
              <Icons.FilterIcon w='11px' h='11px' />
              <Text>{t('filter')}</Text>
            </HStack>
            {activeCount > 0 && (
              <Box
                position='absolute'
                top='-5px'
                right='-5px'
                w='16px'
                h='16px'
                borderRadius='50%'
                bg={T.maroon700}
                color='white'
                fontSize='9px'
                fontWeight='800'
                display='flex'
                alignItems='center'
                justifyContent='center'
                border='2px solid white'
              >
                {activeCount}
              </Box>
            )}
          </Box>

          <HStack
            as='button'
            gap='6px'
            px='14px'
            py='8px'
            borderRadius='100px'
            bg={T.card}
            border={`1px solid ${T.line}`}
            color={T.maroon700}
            fontSize='11.5px'
            fontWeight='700'
            cursor='pointer'
            _hover={{ borderColor: T.maroon700 }}
          >
            <Icons.DownloadDataIcon w='11px' h='11px' />
            <Text>{t('export')}</Text>
          </HStack>
          <HStack
            as='button'
            gap='6px'
            px='14px'
            py='8px'
            borderRadius='100px'
            bg={T.maroon700}
            border={`1px solid ${T.maroon700}`}
            color='white'
            fontSize='11.5px'
            fontWeight='700'
            cursor='pointer'
            boxShadow='0 4px 12px rgba(107,26,61,0.2)'
            onClick={() => navigate({ to: '/app/inventory/add-device' })}
          >
            <Icons.Plus w='11px' h='11px' />
            <Text>{t('addStock')}</Text>
          </HStack>
        </HStack>
      </Flex>

      <VStack align='stretch' gap='0'>
        <StockCensus
          summaryCards={summaryCards}
          stockTypeCount={stockTypeCount}
          vendorStock={vendorStock}
          assetValue={assetValue}
        />
        <StockAvailability
          districtBreakdown={districtBreakdown}
          districtList={districtList}
          deviceTypes={deviceTypes}
          onFilterChange={handleStockAvailabilityFilter}
        />
        <VendorProductDetails vendorStock={vendorStock} />
        <TransferReport transferList={transferList} />
        <LiveOperations requestQueue={requestQueue} activeRoutes={activeRoutes} requestPipeline={requestPipeline} />
        <KeralaTreemap districtBreakdown={districtBreakdown} />
        <RecentStockEntries stockEntries={stockEntries} />
      </VStack>

      <FilterModal
        isOpen={filterOpen}
        onClose={() => setFilterOpen(false)}
        onApply={handleApplyFilters}
      />

      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        @keyframes shimmer { 0% { left: -25%; } 100% { left: 100%; } }
      `}</style>
    </Box>
  );
};

export default InventoryLedger;
