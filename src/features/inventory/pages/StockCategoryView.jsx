import { useParams } from '@tanstack/react-router';

import InventoryDetailsList from '../components/InventoryDetailsList';
import { useStockManagement } from '../context/StockManagementContext';

const StockCategoryView = () => {
  const { typeName, categoryId } = useParams({ strict: false });
  const { searchQuery, filters } = useStockManagement();

  return (
    <InventoryDetailsList
      searchQuery={searchQuery}
      categoryId={categoryId}
      typeName={typeName}
      externalFilters={filters}
    />
  );
};

export default StockCategoryView;
