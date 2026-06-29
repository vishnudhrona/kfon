import './locale/i18n';
import './style/index';
import '@fontsource-variable/figtree';

window.addEventListener('vite:preloadError', () => {
  window.location.reload();
});

import { Toaster, UIProvider } from '@kfonbss/bss-ui-components';
import { RouterProvider } from '@tanstack/react-router';
import { StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider as ReduxProvider } from 'react-redux';

import { system } from '@/theme';

import { store } from './app/store';
import { router } from './routes/routes';
import { loadGoogleMaps } from './utils/loadGoogle';

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_KEY;
loadGoogleMaps(apiKey);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UIProvider value={system}>
      <Toaster />
      <ReduxProvider store={store}>
        <Suspense>
          <RouterProvider router={router} />
        </Suspense>
      </ReduxProvider>
    </UIProvider>
  </StrictMode>
);
