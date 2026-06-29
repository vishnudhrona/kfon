import { Box, Button, Flex } from '@kfonbss/bss-ui-components';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import GenericCardPage from '@/components/custom/GenericCardPage';
import { SERVER_SIDE_TABLE_KEYS } from '@/constants/server_table';
import { getServerSideData } from '@/features/others/Pagination/selectors';
import { selectorWithKey } from '@/utils/commonUtils';

import { fetchInventoryDetailsList } from '../actions';
import { INVENTORY_KEYS } from '../constants';
import { mapStockItemToCard } from '../utils';
import DeviceDetailCard from './DeviceDetailCard';
import RequestForPopup from './RequestForPopup';

const BUTTON_PROPS = {
  variant: 'outline',
  height: '40px',
  px: '12px',
  borderRadius: '8px',
  border: '1px solid',
  borderColor: 'primary.500',
  color: 'primary.500',
  bg: 'transparent',
  _hover: { bg: 'primary.50' }
};

const INVENTORY_COLUMNS = [
  { header: 'category', accessor: 'categoryName' },
  { header: 'model', accessor: 'modelName' },
  { header: 'equipmentId', accessor: 'detailsId' },
  { header: 'custodian', accessor: 'custodianName' },
  { header: 'status', accessor: 'status' },
  { header: 'condition', accessor: 'deviceCondition' },
  { header: 'serialNumber', accessor: 'serialNumber' },
  { header: 'macAddress', accessor: 'macAddress' }
];

const InventoryDetailsList = ({ searchQuery, categoryId, typeName, externalFilters }) => {
  const { t } = useTranslation();
  const tableData = selectorWithKey(useSelector(getServerSideData), SERVER_SIDE_TABLE_KEYS.INVENTORY_DETAILS_LIST);
  const [selectedIds, setSelectedIds] = useState([]);
  const [requestForItems, setRequestForItems] = useState([]);

  const itemsArray = useMemo(() => (Array.isArray(tableData) ? tableData : []), [tableData]);

  const handleSelect = useCallback((id) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]));
  }, []);

  const isAllSelected = useMemo(() => {
    return itemsArray.length > 0 && itemsArray.every((item) => selectedIds.includes(item.detailsId));
  }, [itemsArray, selectedIds]);

  const handleSelectAll = useCallback(() => {
    const currentIds = itemsArray.map((item) => item.detailsId);
    if (isAllSelected) {
      setSelectedIds((prev) => prev.filter((id) => !currentIds.includes(id)));
    } else {
      setSelectedIds((prev) => Array.from(new Set([...prev, ...currentIds])));
    }
  }, [isAllSelected, itemsArray]);

  const InventoryCard = useCallback(
    ({ data: item }) => {
      const mappedItem = mapStockItemToCard(item);
      const isSelected = selectedIds.includes(item.detailsId);

      const actionItems = [{ label: 'request', onClick: () => setRequestForItems([mappedItem]) }];

      return (
        <DeviceDetailCard
          item={mappedItem}
          isSelected={isSelected}
          handleSelect={handleSelect}
          actionItems={actionItems}
        />
      );
    },
    [selectedIds, handleSelect]
  );

  const selectedItems = useMemo(
    () =>
      selectedIds
        .map((id) => {
          const item = itemsArray.find((i) => i.detailsId === id);
          return item ? mapStockItemToCard(item) : null;
        })
        .filter(Boolean),
    [selectedIds, itemsArray]
  );

  const headerActions = useMemo(
    () => (
      <Flex justify='flex-end' gap='8px'>
        {selectedIds.length > 0 && (
          <>
            <Button {...BUTTON_PROPS} onClick={handleSelectAll}>
              {isAllSelected ? t('unselectAll', 'Unselect All') : t('selectAll', 'Select All')}
            </Button>
            <Button {...BUTTON_PROPS} onClick={() => setRequestForItems(selectedItems)}>
              {t('request')}
            </Button>
          </>
        )}
      </Flex>
    ),
    [selectedIds.length, isAllSelected, handleSelectAll, selectedItems, t]
  );

  const staticParams = useMemo(() => {
    const p = {};
    if (categoryId) p.categoryId = categoryId;
    if (typeName) p.typeName = typeName;
    return p;
  }, [categoryId, typeName]);

  return (
    <Box h='full' flex='1' display='flex' flexDirection='column'>
      <GenericCardPage
        fetchAction={fetchInventoryDetailsList}
        data={tableData}
        tableKey={INVENTORY_KEYS.INVENTORY_DETAILS_LIST}
        columns={INVENTORY_COLUMNS}
        CardComponent={InventoryCard}
        headerContent={headerActions}
        isSearchEnabled={false}
        externalSearch={searchQuery}
        externalFilters={externalFilters}
        staticParams={staticParams}
      />

      <RequestForPopup
        isOpen={requestForItems.length > 0}
        onClose={() => setRequestForItems([])}
        items={requestForItems}
        categoryId={categoryId}
        typeName={typeName}
      />
    </Box>
  );
};

export default InventoryDetailsList;
