import { createRoute, Outlet } from '@tanstack/react-router';
import { lazy } from 'react';

import { MENU_KEYS } from '@/constants/permissions';

import { appRoute } from '../appRoute';

const TicketList = lazy(() => import('../crm/compponents/TicketList'));

const supportRoute = createRoute({
  path: 'support',
  getParentRoute: () => appRoute,
  component: Outlet
});

const ticketsRoute = createRoute({
  path: 'tickets',
  getParentRoute: () => supportRoute,
  component: TicketList,
  context: () => ({ menuKey: MENU_KEYS.TICKET_LIST })
});

export const ticketRoutes = [supportRoute, ticketsRoute];
