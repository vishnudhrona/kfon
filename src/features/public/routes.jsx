import { createRoute, redirect } from '@tanstack/react-router';
import { lazy } from 'react';

import { STORAGE_KEYS } from '@/constants';
import { rootRoute } from '@/routes/rootRoute';
import { getDataFromStorage } from '@/utils/encryptionUtils';
import { isTokenExpired } from '@/utils/jwtUtils';

import { enquiryRoutes } from './pages/enquiryForms/routes';
import { loginRoutes } from './pages/login/routes';

const Welcome = lazy(() => import('./pages/Welcome'));
const LandingPage = lazy(() => import('./pages/landingPage/components'));
const About = lazy(() => import('./pages/About'));

const redirectIfLoggedIn = () => {
  const token = getDataFromStorage(STORAGE_KEYS.AUTH_TOKEN, false);
  if (token && !isTokenExpired(token)) {
    throw redirect({ to: '/app' });
  }
};

const WelcomeRoute = createRoute({
  path: 'welcome',
  getParentRoute: () => rootRoute,
  beforeLoad: redirectIfLoggedIn,
  component: Welcome
});

const aboutRoute = createRoute({
  path: 'about',
  getParentRoute: () => rootRoute,
  beforeLoad: redirectIfLoggedIn,
  component: About
});

export const indexRoute = createRoute({
  path: '/',
  getParentRoute: () => rootRoute,
  beforeLoad: () => {
    const token = getDataFromStorage(STORAGE_KEYS.AUTH_TOKEN, false);
    if (token && !isTokenExpired(token)) {
      throw redirect({ to: '/app' });
    }
  },
  component: LandingPage
});

export const routes = [WelcomeRoute, aboutRoute, indexRoute, ...loginRoutes, ...enquiryRoutes];
