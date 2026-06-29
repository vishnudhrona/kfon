import { Box } from '@kfonbss/bss-ui-components';
import { useSearch } from '@tanstack/react-router';

import AvailableStock from '../components/AvailableStock';
import ExternalRequest from '../components/ExternalRequest';
import InquiryTab from '../components/InquiryTab';
import MyStock from '../components/MyStock';
import TransferredStock from '../components/TransferredStock';
import { useStockManagement } from '../context/StockManagementContext';

const StockManagementIndex = () => {
  const { searchQuery, filters } = useStockManagement();
  const search = useSearch({ strict: false });
  const selectedTab = search.tab || 'myStock';

  return (
    <Box overflowY='auto' h='100%' p={1}>
      {selectedTab === 'inquiry' && <InquiryTab searchQuery={searchQuery} filters={filters} />}
      {selectedTab === 'externalRequest' && <ExternalRequest />}
      {selectedTab === 'externalRequest' && <InquiryTab requested={true} searchQuery={searchQuery} filters={filters} />}
      {selectedTab === 'availableStock' && <AvailableStock filters={filters} />}
      {selectedTab === 'myStock' && <MyStock searchQuery={searchQuery} filters={filters} />}
      {selectedTab === 'transferredList' && <TransferredStock searchQuery={searchQuery} filters={filters} />}
    </Box>
  );
};

export default StockManagementIndex;
