import { Suspense } from 'react';

import SplashLoader from './SplashLoader';

export default function LoaderProvider({ children }) {
  return <Suspense fallback={<SplashLoader />}>{children}</Suspense>;
}
