import { createRoute } from "@tanstack/react-router";
import { lazy } from "react";

import { appRoute } from "@/features/appRoute";

const RevenueShare = lazy(() => import('./components/Revenueshare'));

const revenueShareRoute = createRoute({
    path: 'finance/revenue-share',
    getParentRoute: () => appRoute
});

const revenueShareListRoute = createRoute({
    path: 'list',
    getParentRoute: () => revenueShareRoute,
    component: RevenueShare
});

export const revenueShareRoutes = [
    revenueShareRoute,
    revenueShareListRoute
];  