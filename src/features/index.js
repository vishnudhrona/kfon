import * as agnpModules from '@/features/agnp';
import commonModule from '@/features/common';
import menuModule from '@/features/components';
import corporateModule from '@/features/corporate';
import crmModule from '@/features/crm';
import darkfiberModule from '@/features/darkFiber';
import dashboardModule from '@/features/dashboard';
import inventoryDashboardModule from '@/features/dashboard/component/InventoryDashBoard';
import partnerDashboardModule from '@/features/dashboard/component/PartnerDashBoard';
import * as financeModules from '@/features/finance';
import inventoryModule from '@/features/inventory';
import notesModule from '@/features/notes';
import notificationsModule from '@/features/notifications';
import onboardingModule from '@/features/onboarding';
import * as otherModules from '@/features/others';
import permissionModule from '@/features/others/common/permissionIndex';
import packagePlansModule from '@/features/packagePlans';
import * as publicModules from '@/features/public';
import enquiryReportsModule from '@/features/reports/enquiryReports';
import onboardedSubscribersReportsModule from '@/features/reports/onboardedSubscribersReports';
import partnerRequestsModule from '@/features/reports/partnerReports';
import * as subscriberModules from '@/features/subscriber';
import ticketModule from '@/features/ticket';
import userRoleModule from '@/features/user-role';

export default {
  ...publicModules,
  ...otherModules,
  permissionModule,
  ...agnpModules,
  ...subscriberModules,
  dashboardModule,
  inventoryModule,
  inventoryDashboardModule,
  partnerDashboardModule,
  notesModule,
  notificationsModule,
  menuModule,
  packagePlansModule,
  commonModule,
  corporateModule,
  onboardingModule,
  userRoleModule,
  ticketModule,
  darkfiberModule,
  ...financeModules,
  crmModule,
  enquiryReportsModule,
  partnerRequestsModule,
  onboardedSubscribersReportsModule
};
