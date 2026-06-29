import { createRoute, Outlet } from '@tanstack/react-router';
import { lazy } from 'react';

import { appRoute } from '@/features/appRoute';

const ExpenseReports = lazy(() => import('./components/ExpenseReports'));

const expenseReports = createRoute({
  path: 'finance/accounts/expense-reports',
  getParentRoute: () => appRoute,
  component: () => <Outlet />
});

const expenseReportsIndex = createRoute({
  path: '/',
  getParentRoute: () => expenseReports,
  component: ExpenseReports
});

const expenseReportsDetail = createRoute({
  path: '$reportId',
  getParentRoute: () => expenseReports,
  component: ExpenseReports
});

export const expenseReportsRoutes = [expenseReports, expenseReportsIndex, expenseReportsDetail];
