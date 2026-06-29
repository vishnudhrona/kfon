import { createRouter } from '@tanstack/react-router';

import { routeTree } from './RouteTree';

export const router = createRouter({ routeTree, scrollRestoration: 'top' });
