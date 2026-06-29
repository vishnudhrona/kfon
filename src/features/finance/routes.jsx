import { expenseReportsRoutes } from './accounts/expenseReports/routes';
import { gstReportsRoutes } from './accounts/gstReports/routes';
import { partnerAccountsRoutes } from './accounts/partnerAccounts/routes';
import { rechargeReportsRoutes } from './accounts/rechargeReports/routes';
import { subscriberAccountsRoutes } from './accounts/subscriberAccounts/routes';
import { walletReportsRoutes } from './accounts/walletReports/routes';
import { financeCommonRoutes } from './common/routes';
import { revenueShareDashboardRoutes } from './dashboard/revenueShare/routes';
import { invoiceDetailsRoutes } from './invoice/invoiceDetails/routes';
import { invoiceReportsRoutes } from './invoice/reports/routes';
import { revenueReportRoutes } from './invoice/revenueReport/routes';
import { myFinanceCorporateRoutes } from './myFinance/corporate/routes';
import { myFinanceAccountsRoutes } from './myFinance/myAccounts/routes';
import { revenueShareRoutes } from './revenueShare/routes';
import { statutoryRoutes } from './statutory/routes';

export const financeRoutes = [
  ...subscriberAccountsRoutes,
  ...partnerAccountsRoutes,
  ...walletReportsRoutes,
  ...expenseReportsRoutes,
  ...gstReportsRoutes,
  ...rechargeReportsRoutes,
  ...invoiceDetailsRoutes,
  ...invoiceReportsRoutes,
  ...revenueReportRoutes,
  ...statutoryRoutes,
  ...myFinanceAccountsRoutes,
  ...myFinanceCorporateRoutes,
  ...revenueShareRoutes,
  ...revenueShareDashboardRoutes,
  ...financeCommonRoutes
];
