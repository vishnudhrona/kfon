import { createRoute, redirect } from '@tanstack/react-router';

import { STORAGE_KEYS } from '@/constants';
import AuthLayout from '@/layout/auth_layout';
import { rootRoute } from '@/routes/rootRoute';
import { getDataFromStorage } from '@/utils/encryptionUtils';
import { isTokenExpired } from '@/utils/jwtUtils';

import ForgotPassword from './components/ForgotPassword';
import Login from './components/index';
import LoginOtp from './components/LoginOtp';
import EnterNewPassword from './components/NewPassword';
import TenantSelection from './components/TenantSelection';

const authRoute = createRoute({
  path: 'auth',
  getParentRoute: () => rootRoute,
  component: AuthLayout,
  beforeLoad: () => {
    const token = getDataFromStorage(STORAGE_KEYS.AUTH_TOKEN, false);
    if (token && !isTokenExpired(token)) {
      throw redirect({ to: '/app' });
    }
  }
});

export const loginRoute = createRoute({
  path: 'login',
  getParentRoute: () => authRoute,
  component: Login,
  beforeLoad: () => {
    const tenant = getDataFromStorage(STORAGE_KEYS.SELECTED_TENANT, true, null);
    if (!tenant) {
      throw redirect({ to: '/auth/tenant-selection' });
    }
  }
});

const LoginOtpRoute = createRoute({
  path: 'login-otp',
  getParentRoute: () => authRoute,
  component: LoginOtp,
  beforeLoad: () => {
    const tenant = getDataFromStorage(STORAGE_KEYS.SELECTED_TENANT, true, null);
    if (!tenant) {
      throw redirect({ to: '/auth/tenant-selection' });
    }
  }
});

const TenantSelectionRoute = createRoute({
  path: 'tenant-selection',
  getParentRoute: () => authRoute,
  component: TenantSelection
});

const ForgetPasswordRoute = createRoute({
  path: 'forgot-password',
  getParentRoute: () => authRoute,
  component: ForgotPassword
});

const EnterNewPasswordRoute = createRoute({
  path: 'enter-new-password',
  getParentRoute: () => authRoute,
  component: EnterNewPassword
});

export const loginRoutes = [authRoute, loginRoute, LoginOtpRoute, TenantSelectionRoute, ForgetPasswordRoute, EnterNewPasswordRoute];
