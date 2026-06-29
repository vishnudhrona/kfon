import { useSearch } from '@tanstack/react-router';
import { lazy, Suspense } from 'react';

const StockDetailsList = lazy(() => import('./StockDetailsList'));
const StockPoDetails = lazy(() => import('./StockPoDetails'));

const StockListOrPoDetails = () => {
  const search = useSearch({ strict: false });
  return (
    <Suspense>
      {search.poNo ? <StockPoDetails /> : <StockDetailsList />}
    </Suspense>
  );
};

export default StockListOrPoDetails;
