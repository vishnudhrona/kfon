import { Box, Button, HStack, Text } from '@kfonbss/bss-ui-components';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import GenericCardPage from '@/components/custom/GenericCardPage';
import { PERMISSIONS } from '@/constants/permissions';
import { usePageActions } from '@/hooks/usePageActions';

import { downloadOemHandoverPdf, fetchMyStockList } from '../actions';
import { INVENTORY_KEYS, MY_STOCK_COLUMNS, UNMAPPABLE_DEVICE_TYPES } from '../constants';
import { useStockManagement } from '../context/StockManagementContext';
import { useMyStockModals } from '../hooks/useMyStockModals';
import { getTableData } from '../selectors';
import { mapStockItemToCard } from '../utils';
import DeviceDetailCard from './DeviceDetailCard';
import MyStockModals from './MyStockModals';

const MyStock = ({ searchQuery, filters }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { hasPermission } = usePageActions();
  const { lnpContext } = useStockManagement();

  const stockData = useSelector(getTableData(INVENTORY_KEYS.MY_STOCK_LIST));
  const allItems = useMemo(() => stockData?.data ?? [], [stockData]);

  const [selectedMap, setSelectedMap] = useState({});
  const transferableIds = useMemo(() => new Set(allItems.filter((i) => i.status !== 'IN_USE').map((i) => i.detailsId)), [allItems]);
  const sanitizedSelectedMap = useMemo(
    () => Object.fromEntries(Object.entries(selectedMap).filter(([id]) => transferableIds.has(id))),
    [selectedMap, transferableIds]
  );
  const selectedIds = useMemo(() => Object.keys(sanitizedSelectedMap), [sanitizedSelectedMap]);
  const { states: modalStates, actions: modalActions } = useMyStockModals(lnpContext);

  const maxSelect = lnpContext?.requestedCount ?? null;
  const canMultiSelect = hasPermission(PERMISSIONS.STOCK_MANAGEMENT.DEVICE_TRANSFER) || !!lnpContext;
  const transferableItems = useMemo(() => allItems.filter((i) => transferableIds.has(i.detailsId)), [allItems, transferableIds]);
  const allSelected =
    transferableItems.length > 0 &&
    selectedIds.length === (maxSelect ? Math.min(maxSelect, transferableItems.length) : transferableItems.length);
  const allSelectedFaulty =
    selectedIds.length > 0 &&
    selectedIds.every((id) => sanitizedSelectedMap[id]?.deviceCondition === 'FAULTY');

  const handleSelect = useCallback(
    (id) => {
      setSelectedMap((prev) => {
        if (prev[id]) {
          const next = { ...prev };
          delete next[id];
          return next;
        }
        if (!transferableIds.has(id)) return prev;
        if (maxSelect !== null && Object.keys(prev).length >= maxSelect) return prev;
        const item = allItems.find((i) => i.detailsId === id);
        if (!item) return prev;
        return { ...prev, [id]: item };
      });
    },
    [maxSelect, allItems, transferableIds]
  );

  const handleSelectAll = useCallback(() => {
    const limit = maxSelect ? Math.min(maxSelect, transferableItems.length) : transferableItems.length;
    const limited = transferableItems.slice(0, limit);
    setSelectedMap((prev) => {
      const currentTransferableSelected = Object.keys(prev).filter((id) => transferableIds.has(id));
      if (currentTransferableSelected.length === limited.length) return {};
      const next = { ...prev };
      limited.forEach((item) => { next[item.detailsId] = item; });
      return next;
    });
  }, [transferableItems, transferableIds, maxSelect]);

  const handleDownloadOemHandoverPdf = useCallback(() => {
    dispatch(downloadOemHandoverPdf({ deviceIds: selectedIds }));
  }, [dispatch, selectedIds]);

  const MyStockCard = useCallback(
    ({ data: item }) => {
      const mappedItem = mapStockItemToCard(item);

      const isSelected = !!sanitizedSelectedMap[mappedItem.detailsId];
      const checkboxDisabled =
        item.status === 'IN_USE' || (!isSelected && maxSelect !== null && selectedIds.length >= maxSelect);

      const actionItems = [
        {
          label: 'transfer',
          onClick: () => modalActions.handleOpenTransferModal(mappedItem),
          hidden: !(hasPermission(PERMISSIONS.STOCK_MANAGEMENT.DEVICE_TRANSFER) && item.status === 'IN_STOCK')
        },
        {
          label: 'condition',
          onClick: () => modalActions.handleOpenConditionModal(mappedItem),
          hidden: !(
            (hasPermission(PERMISSIONS.STOCK_MANAGEMENT.UPDATE_CONDITION) && item.status === 'IN_STOCK') ||
            item.status === 'IN_USE'
          )
        },
        {
          label: 'returnToOEM',
          onClick: () => modalActions.handleOpenReturnOemModal(mappedItem),
          hidden: !(
            hasPermission(PERMISSIONS.STOCK_MANAGEMENT.TRANSFER_TO_OEM) &&
            item.status === 'IN_STOCK' &&
            item.deviceCondition === 'FAULTY'
          )
        },
        {
          label: 'mapDevice',
          onClick: () => modalActions.handleOpenMapDeviceModal(mappedItem),
          hidden: !(
            hasPermission(PERMISSIONS.STOCK_MANAGEMENT.MAP_TO_LOCATION) &&
            item.status === 'IN_STOCK' &&
            item.deviceCondition === 'GOOD'
          )
        },
        {
          label: 'unmapDevice',
          onClick: () => modalActions.handleOpenUnmapDeviceModal(mappedItem),
          hidden: !hasPermission(PERMISSIONS.STOCK_MANAGEMENT.MAP_TO_LOCATION) || !mappedItem.mappedToLocation || !UNMAPPABLE_DEVICE_TYPES.has(mappedItem.deviceType)
        },
        {
          label: 'deviceReplacement',
          onClick: () => modalActions.handleOpenReplacementModal(mappedItem),
          hidden: !hasPermission(PERMISSIONS.STOCK_MANAGEMENT.DEVICE_REPLACEMENT) || item.deviceCondition === 'GOOD'
        },
        {
          label: 'updateDeviceDetails',
          onClick: () => modalActions.handleOpenUpdateDeviceModal(mappedItem),
          hidden: !hasPermission(PERMISSIONS.STOCK_MANAGEMENT.UPDATE_DEVICE_DETAILS)
        }
      ];

      return (
        <DeviceDetailCard
          item={mappedItem}
          isSelected={isSelected}
          isCheckboxDisabled={checkboxDisabled}
          handleSelect={handleSelect}
          actionItems={actionItems}
          onNotesClick={() => modalActions.handleOpenNotesModal(mappedItem)}
          isActionsDisabled={selectedIds.length > 0}
          showCheckbox={canMultiSelect}
        />
      );
    },
    [sanitizedSelectedMap, selectedIds, handleSelect, modalActions, hasPermission, maxSelect, canMultiSelect]
  );

  return (
    <>
      <GenericCardPage
        dataSelector={getTableData(INVENTORY_KEYS.MY_STOCK_LIST)}
        fetchAction={fetchMyStockList}
        tableKey={INVENTORY_KEYS.MY_STOCK_LIST}
        columns={MY_STOCK_COLUMNS}
        CardComponent={MyStockCard}
        isSearchEnabled={false}
        externalSearch={searchQuery}
        externalFilters={filters}
        actions={
          <HStack spacing={2}>
            {lnpContext && (
              <Box
                border='1px solid #E5E7EB'
                borderRadius='8px'
                px='12px'
                h='36px'
                display='flex'
                alignItems='center'
                gap='8px'
              >
                <Text fontSize='14px' color='gray.600'>
                  {t('company')}:
                </Text>
                <Text fontSize='14px' fontWeight='700' color='#232F50'>
                  {lnpContext.companyName}
                </Text>
                <Box w='1px' h='16px' bg='gray.300' />
                <Text fontSize='14px' color='gray.600'>
                  {t('deviceType')}:
                </Text>
                <Text fontSize='14px' fontWeight='700' color='#232F50'>
                  {lnpContext.deviceType}
                </Text>
                <Box w='1px' h='16px' bg='gray.300' />
                <Text fontSize='14px' color='gray.600'>
                  {t('category')}:
                </Text>
                <Text fontSize='14px' fontWeight='700' color='#232F50'>
                  {lnpContext.category}
                </Text>
                <Box w='1px' h='16px' bg='gray.300' />
                <Text fontSize='14px' color='gray.600'>
                  {t('requestedCount')}:
                </Text>
                <Text fontSize='14px' fontWeight='700' color='primary.500'>
                  {lnpContext.requestedCount}
                </Text>
              </Box>
            )}
            {canMultiSelect && (
              <Button variant='outline' borderRadius='8px' h='36px' px='16px' onClick={handleSelectAll}>
                {allSelected ? t('unselectAll') : lnpContext ? `${t('selectAll')} (${lnpContext.requestedCount})` : t('selectAll')}
                {selectedIds.length > 0 && ` · ${selectedIds.length} ${t('selected')}`}
              </Button>
            )}
            {selectedIds.length > 0 && hasPermission(PERMISSIONS.STOCK_MANAGEMENT.DEVICE_TRANSFER) && (
              <Button
                variant='outline'
                borderRadius='8px'
                h='36px'
                px='16px'
                onClick={() => {
                  const selectedItems = Object.values(sanitizedSelectedMap).map(mapStockItemToCard);
                  modalActions.handleOpenBulkTransferModal(selectedIds, selectedItems);
                }}
              >
                {t('transfer')}
              </Button>
            )}
            {allSelectedFaulty && (
              <Button variant='outline' borderRadius='8px' h='36px' px='16px' onClick={handleDownloadOemHandoverPdf}>
                {t('downloadOemHandoverForm')}
              </Button>
            )}
          </HStack>
        }
      />

      <MyStockModals states={modalStates} actions={modalActions} lnpContext={lnpContext} />
    </>
  );
};

export default MyStock;
