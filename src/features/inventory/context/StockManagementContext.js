import { createContext, useContext } from 'react';

export const StockManagementContext = createContext({
  searchQuery: '',
  filters: null,
  setFilters: () => {},
  lnpContext: null,
  setLnpContext: () => {}
});

export const useStockManagement = () => useContext(StockManagementContext);
