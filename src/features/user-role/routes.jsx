import { createRoute, Outlet, redirect } from '@tanstack/react-router';
import { lazy } from 'react';

import { appRoute } from '../appRoute';
import UserRoleMapping from './components/UserRoleMapping';

const UserRolePermission = lazy(() => import('./components/UserRolePermission'));
const MenuList = lazy(() => import('./components/MenuList'));
const UserList = lazy(() => import('./components/UserList'));
const RoleList = lazy(() => import('./components/RoleList'));
const SeatList = lazy(() => import('./components/SeatList'));
const TemplateList = lazy(() => import('./components/TemplateList'));
const Designation = lazy(() => import('./components/Designation'));
const ModuleWorkFlow = lazy(() => import('./components/ModuleWorkFlow'));
const Division = lazy(() => import('./components/Division'));
const LnpAttachment = lazy(() => import('./components/LnpAttachment'));

const usersRoute = createRoute({
  path: 'users',
  getParentRoute: () => appRoute,
  component: () => <Outlet />
});

const usersIndexRoute = createRoute({
  path: '/',
  getParentRoute: () => usersRoute,
  beforeLoad: () => {
    throw redirect({ to: '/app/users/user-list' });
  }
});

const userListRoute = createRoute({
  path: 'user-list',
  getParentRoute: () => usersRoute,
  component: UserList
});

const rolesRoute = createRoute({
  path: 'roles',
  getParentRoute: () => usersRoute,
  component: () => <Outlet />
});

const rolesIndexRoute = createRoute({
  path: '/',
  getParentRoute: () => rolesRoute,
  component: RoleList
});

const templateListRoute = createRoute({
  path: 'template-list',
  getParentRoute: () => usersRoute,
  component: TemplateList
});

const seatListRoute = createRoute({
  path: 'seat-list',
  getParentRoute: () => usersRoute,
  component: Outlet
});

const moduleWorkFlowRoute = createRoute({
  path: 'module-workflow',
  getParentRoute: () => usersRoute,
  component: ModuleWorkFlow
});

const seatListIndexRoute = createRoute({
  path: '/',
  getParentRoute: () => seatListRoute,
  component: SeatList
});

const userPermissionRoute = createRoute({
  path: 'permission',
  getParentRoute: () => rolesRoute,
  component: UserRolePermission
});

const userRoleMappingRoute = createRoute({
  path: 'role-mapping',
  getParentRoute: () => seatListRoute,
  component: UserRoleMapping
});

const menuListRoute = createRoute({
  path: 'menu-list',
  getParentRoute: () => usersRoute,
  component: MenuList
});

const lnpMappingRoute = createRoute({
  path: 'lnp-mapping',
  getParentRoute: () => usersRoute,
  component: LnpAttachment
});

const masterRoute = createRoute({
  path: 'master',
  getParentRoute: () => appRoute,
  component: () => <Outlet />
});

const designationListRoute = createRoute({
  path: 'designation-list',
  getParentRoute: () => masterRoute,
  component: Designation
});

const divisionListRoute = createRoute({
  path: 'division-list',
  getParentRoute: () => masterRoute,
  component: Division
});

export const userRoleRoutes = [
  usersRoute,
  usersIndexRoute,
  userListRoute,
  rolesRoute,
  rolesIndexRoute,
  seatListRoute,
  seatListIndexRoute,
  userPermissionRoute,
  userRoleMappingRoute,
  menuListRoute,
  templateListRoute,
  moduleWorkFlowRoute,
  lnpMappingRoute,
  masterRoute,
  designationListRoute,
  divisionListRoute
];
