import { Box, Button, Flex, Icons } from '@kfonbss/bss-ui-components';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import GenericCardPage from '@/components/custom/GenericCardPage';
import SearchInput from '@/components/custom/SearchInput';

import { fetchOemRequestList } from '../actions';
import DeviceDetailCard from '../components/DeviceDetailCard';
import OemNotesModal from '../components/OemNotesModal';
import StockFilterModal from '../components/StockFilterModal';
import { INVENTORY_KEYS } from '../constants';
import { getTableData } from '../selectors';
import { mapStockItemToCard } from '../utils';

const OemRequestList = () => {
  const { t } = useTranslation();

  const [selectedDevice, setSelectedDevice] = useState(null);
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const { FilterIcon } = Icons;

  const handleOpenNotes = useCallback((device) => {
    setSelectedDevice(device);
    setIsNotesOpen(true);
  }, []);

  const OemDeviceCard = useCallback(
    ({ data: item }) => {
      const mappedItem = mapStockItemToCard(item);

      return (
        <DeviceDetailCard
          item={mappedItem}
          isSelected={false}
          handleSelect={() => {}}
          actionItems={[]}
          showCheckbox={false}
          onNotesClick={() => handleOpenNotes(mappedItem)}
        />
      );
    },
    [handleOpenNotes]
  );

  return (
    <Box p={4} display='flex' flexDirection='column' gap={4} h='full' overflow='hidden'>
      <Flex justify='space-between' align='center' mb={2}>
        <SearchInput
          placeholder={t('search')}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button variant='outline' borderRadius='md' height='40px' onClick={() => setIsFilterOpen(true)}>
          <FilterIcon />
          {t('filter')}
        </Button>
      </Flex>

      <Box flex='1' minH='0' display='flex' flexDirection='column'>
        <GenericCardPage
          dataSelector={getTableData(INVENTORY_KEYS.OEM_REQUEST_LIST)}
          fetchAction={fetchOemRequestList}
          tableKey={INVENTORY_KEYS.OEM_REQUEST_LIST}
          columns={[]}
          CardComponent={OemDeviceCard}
          isSearchEnabled={false}
          externalSearch={searchQuery}
        />
      </Box>

      {isNotesOpen && selectedDevice && (
        <OemNotesModal
          isOpen={isNotesOpen}
          onClose={() => {
            setIsNotesOpen(false);
            setSelectedDevice(null);
          }}
          device={selectedDevice}
          deviceId={selectedDevice.detailsId}
        />
      )}

      {isFilterOpen && (
        <StockFilterModal
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          onApply={() => setIsFilterOpen(false)}
        />
      )}
    </Box>
  );
};

export default OemRequestList;
