'use client';
import { IconButton, Icons } from '@kfonbss/bss-ui-components';
import { useRouter, useRouterState, useSearch } from '@tanstack/react-router';

import { HStack } from '@/components/custom';
import LanguageSelector from '@/components/custom/LanguageSelector';

import DynamicBreadcrumb from './BreadCrumb';

export default function NavBar() {
  const router = useRouter();
  const routerState = useRouterState();
  const matches = routerState.matches;
  const search = useSearch({ strict: false });
  const { BackIcon } = Icons;
  const breadcrumbMatches = matches.filter((m) => {
    const route = m.route;
    const hasBreadcrumb = route?.options?.breadcrumb || route?.options?.title;
    const notRoot = m.pathname !== '/' && m.pathname.trim() !== '';
    const notIndexRoute = route?.path !== '/';
    return (hasBreadcrumb || notRoot) && notIndexRoute;
  });

  const extraCrumbs = [];
  if (search.poNo) {
    extraCrumbs.push({ label: search.poNo });
  }

  const handleBack = () => {
    router.history.back();
  };

  return (
    <HStack
      display={{ base: 'none', md: 'flex' }}
      as='navbar'
      bgGradient='transparent'
      borderBottom='none'
      px={'40px'}
      marginTop={'10px'}
      py={4}
      m={0}
      h={'56px'}
      gap={'32px'}
    >
      <IconButton variant='ghost' onClick={handleBack} aria-label='Go back'>
        <BackIcon size='md' />
      </IconButton>

      <DynamicBreadcrumb breadcrumbMatches={breadcrumbMatches} extraCrumbs={extraCrumbs} />
      <LanguageSelector />
    </HStack>
  );
}
