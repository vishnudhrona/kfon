import { Breadcrumb, Icons } from '@kfonbss/bss-ui-components';
import { Link, useLocation } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

import { ROUTES } from '@/features/components/routeConfig';

const findRouteByPath = (pathname) => Object.values(ROUTES).find((route) => route.path === pathname);

/**
 * extraCrumbs: array of { label: string, to?: string, search?: object }
 * Appended after route-derived crumbs. Use for search-param-based or
 * context-driven segments that have no dedicated route (e.g. ?poNo=, ?tab=).
 */
function DynamicBreadcrumb({ breadcrumbMatches, extraCrumbs = [] }) {
  const { t } = useTranslation();
  const location = useLocation();

  const routeCrumbs = breadcrumbMatches
    .map((match) => {
      const matchedRoute = findRouteByPath(match.pathname);
      const pathSegment = match.pathname.split('/').pop();
      const hasNumber = /\d/.test(pathSegment);
      const label = matchedRoute?.breadcrumbLabel || matchedRoute?.label || (hasNumber ? 'Details' : pathSegment);

      if (!label || label.trim() === '') return null;

      return { match, matchedRoute, label, virtual: false };
    })
    .filter(Boolean);

  const virtualCrumbs = extraCrumbs.map((c) => ({
    match: null,
    matchedRoute: null,
    label: c.label,
    to: c.to,
    search: c.search,
    virtual: true
  }));

  const validBreadcrumbs = [...routeCrumbs, ...virtualCrumbs];

  return (
    <Breadcrumb.Root gap={3}>
      <Breadcrumb.List>
        {validBreadcrumbs.map((item, i) => {
          const { match, matchedRoute, label: rawLabel, virtual, to, search } = item;
          const isLast = i === validBreadcrumbs.length - 1;

          let label = rawLabel;
          if (!virtual) {
            const trackingId = location.state?.trackingId;
            const headerTitle = match.context?.headerTitle || location.state?.headerTitle;

            if (isLast && trackingId && headerTitle) {
              label = `${t(headerTitle)} ( ${t('trackingId')} : ${trackingId} )`;
            } else if (isLast && trackingId) {
              label = `${t('trackingId')} : ${trackingId}`;
            } else if (isLast && headerTitle) {
              label = t(headerTitle);
            } else {
              label = t(label);
            }
          }

          const Icon = Icons[matchedRoute?.icon];
          const linkTo = virtual ? to : match.pathname;
          const linkSearch = virtual ? search : undefined;

          return (
            <div key={virtual ? `virtual-${rawLabel}` : match.id} style={{ display: 'contents' }}>
              <Breadcrumb.Item isCurrentPage={isLast} gap={3}>
                {!isLast && linkTo ? (
                  <Breadcrumb.Link
                    as={Link}
                    to={linkTo}
                    search={linkSearch}
                    fontSize='14px'
                    lineHeight='14px'
                    fontWeight={600}
                    color='#333333'
                    display='flex'
                    gap='6px'
                    alignItems='center'
                    textTransform='capitalize'
                  >
                    {Icon && <Icon size='sm' color='grey' />}
                    {label}
                  </Breadcrumb.Link>
                ) : (
                  <Breadcrumb.Link
                    as='span'
                    fontSize='14px'
                    lineHeight='14px'
                    fontWeight={600}
                    color='primary.500'
                    display='flex'
                    gap='6px'
                    alignItems='center'
                    textTransform='capitalize'
                  >
                    {Icon && <Icon size='sm' />}
                    {label}
                  </Breadcrumb.Link>
                )}
              </Breadcrumb.Item>
              {!isLast && <Breadcrumb.Separator />}
            </div>
          );
        })}
      </Breadcrumb.List>
    </Breadcrumb.Root>
  );
}

export default DynamicBreadcrumb;
