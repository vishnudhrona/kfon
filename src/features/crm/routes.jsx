import { createRoute, Outlet } from '@tanstack/react-router';
import { lazy } from 'react';

import { appRoute } from '../appRoute';

const TicketList = lazy(() => import('./compponents/TicketList'));
const FirstForm = lazy(() => import('./compponents/FirstForm'));
const TicketDetails = lazy(() => import('./compponents/TicketDetails'));
const IssueMapping = lazy(() => import('./compponents/IssueMapping'));

const SubscriberDetails = lazy(() => import('../subscriber/applications/pages/SubscriberDetails'));
const ViewDataUsage = lazy(() => import('../subscriber/applications/pages/ViewDataUsage'));
const RadiusDetails = lazy(() => import('../subscriber/applications/pages/RadiusDetails'));

const Dashboard = lazy(() => import('./compponents/Dashboard/Dashboard'));
const AllTickets = lazy(() => import('./compponents/Dashboard/AllTickets'));
const LongPending = lazy(() => import('./compponents/Dashboard/LongPending'));
const Performance = lazy(() => import('./compponents/Dashboard/Performance'));
const Divisions = lazy(() => import('./compponents/Dashboard/Divisions'));

const crmRoute = createRoute({
    path: 'crm',
    getParentRoute: () => appRoute,
    component: Outlet
});

const crmIssueMappingRoute = createRoute({
    path: 'issue-mapping',
    getParentRoute: () => crmRoute,
    component: IssueMapping
});

const crmTicketListRoute = createRoute({
    path: 'ticket-list',
    getParentRoute: () => crmRoute,
    component: Outlet
});

const crmTicketDetailsRoute = createRoute({
    path: 'ticket-details/$ticketId',
    getParentRoute: () => crmTicketListRoute,
    component: TicketDetails
});

const crmTicketListIndexRoute = createRoute({
    path: '/',
    getParentRoute: () => crmTicketListRoute,
    component: TicketList,
    validateSearch: (search) => ({
        viewType: search.viewType || 'inbox'
    })
})

const crmCreateTicketRoute = createRoute({
    path: 'create-ticket',
    getParentRoute: () => crmTicketListRoute,
    component: FirstForm
});

const crmSubscriberDetailsRoute = createRoute({
    path: 'subscriber-details/$subscriberId',
    getParentRoute: () => crmTicketListRoute,
    component: SubscriberDetails,
    validateSearch: (search) => ({ id: search.id || undefined })
});

const crmSubscriberDataUsageRoute = createRoute({
    path: 'subscriber-data-usage/$subscriberId',
    getParentRoute: () => crmTicketListRoute,
    component: ViewDataUsage,
    validateSearch: (search) => ({ id: search.id || undefined })
});

const crmSubscriberRadiusRoute = createRoute({
    path: 'subscriber-radius-details/$username',
    getParentRoute: () => crmTicketListRoute,
    component: RadiusDetails,
    validateSearch: (search) => ({ id: search.id || undefined })
});

const crmDashboardRoute = createRoute({
    path: 'dashboard',
    getParentRoute: () => crmRoute,
    component: Outlet
});

const crmDashboardOverviewRoute = createRoute({
    path: 'overview',
    getParentRoute: () => crmDashboardRoute,
    component: Dashboard
});

const crmDashboardAllTicketsRoute = createRoute({
    path: 'all-tickets',
    getParentRoute: () => crmDashboardRoute,
    component: AllTickets
});

const crmDashboardLongPendingRoute = createRoute({
    path: 'long-pending',
    getParentRoute: () => crmDashboardRoute,
    component: LongPending
});

const crmDashboardPerformanceRoute = createRoute({
    path: 'performance',
    getParentRoute: () => crmDashboardRoute,
    component: Performance
});

const crmDashboardDivisionsRoute = createRoute({
    path: 'divisions',
    getParentRoute: () => crmDashboardRoute,
    component: Divisions
});

export const crmRoutes = [
    crmRoute,
    crmIssueMappingRoute,
    crmTicketListRoute,
    crmTicketDetailsRoute,
    crmTicketListIndexRoute,
    crmCreateTicketRoute,
    crmSubscriberDetailsRoute,
    crmSubscriberDataUsageRoute,
    crmSubscriberRadiusRoute,
    crmDashboardRoute,
    crmDashboardOverviewRoute,
    crmDashboardAllTicketsRoute,
    crmDashboardLongPendingRoute,
    crmDashboardPerformanceRoute,
    crmDashboardDivisionsRoute
];