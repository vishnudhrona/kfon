import { createRootRoute, Outlet } from '@tanstack/react-router';

import NotFound from '@/components/common/NotFound';

export const rootRoute = createRootRoute({
  component: Outlet,
  notFoundComponent: NotFound
});
