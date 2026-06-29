import { routes } from '@/features/routes';

import { rootRoute } from './rootRoute';

export const routeTree = rootRoute.addChildren(routes);
