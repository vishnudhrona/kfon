import { Box, FooterComponent, HeaderComponent } from '@kfonbss/bss-ui-components';
import { useNavigate } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { get, isEmpty } from 'lodash-es';
import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import mainLogo from '@/assets/main_logo.png';
import BreadCrumb from '@/components/custom/breadcrumb';
import { useMenu } from '@/components/custom/useMenu';
import { STORAGE_KEYS } from '@/constants';
import { getActiveTopMenuKey } from '@/features/components/selector';
import NotificationsPopup from '@/features/notifications/components/NotificationsPopup';
import { getUnreadNotificationsCount } from '@/features/notifications/selectors';
import { doLogout } from '@/features/others/common/actions';
import ForceResetPassword from '@/features/public/pages/login/components/ForceResetPassword';
import { STATE_REDUCER_KEY } from '@/features/public/pages/login/constants';
import { loginRoute } from '@/features/public/pages/login/routes';
import Content from '@/layout/portal_layout';
import styles from '@/style/layout.module.css';
import { getDataFromStorage, parseJwtToken } from '@/utils/encryptionUtils';
import { getFirstPermittedLeafPath } from '@/utils/menuUtils';

const getDisplayNameFromToken = (token) => {
  if (!token) return null;
  const payload = parseJwtToken(token);
  if (!payload) return null;
  if (payload.partnerName) return payload.partnerName;
  const title = payload.employeeTitle ?? '';
  const name = payload.employeeName ?? '';
  return [title, name].filter(Boolean).join(' ') || null;
};

const MainLayout = () => {
  const navigate = useNavigate();
  const { topMenus, handleTopMenuClick } = useMenu('topMenu');
  const loginData = useSelector((state) => get(state[STATE_REDUCER_KEY], 'loginDetails.data'));
  const activeItem = useSelector(getActiveTopMenuKey);

  const token = useMemo(() => getDataFromStorage(STORAGE_KEYS.AUTH_TOKEN), []);

  const user = useMemo(() => {
    if (isEmpty(loginData)) return null;
    const displayName = getDisplayNameFromToken(token);
    return {
      username: displayName || loginData.username,
      role: loginData.roleNames?.[0] ?? ''
    };
  }, [loginData, token]);
  const permissionMap = useSelector((state) => state?.permissions?.permissionMap ?? {});
  const notificationCount = useSelector(getUnreadNotificationsCount);

  const dispatch = useDispatch();
  const handleItemSelect = (item) => {
    const submenu = handleTopMenuClick(item);
    const targetPath = getFirstPermittedLeafPath(submenu, permissionMap) ?? item.path;
    if (targetPath) {
      navigate({ to: targetPath });
    }
  };
  const handleLogout = () => {
    dispatch(doLogout());
    navigate({ to: loginRoute.to });
  };

  return (
    <Box className={styles.mainContainer} position='relative'>
      <HeaderComponent
        item={topMenus}
        user={user}
        onItemSelect={handleItemSelect}
        logo={mainLogo}
        onLogout={handleLogout}
        activeItem={activeItem}
        notificationCount={notificationCount}
        notificationContent={<NotificationsPopup />}
      />
      <BreadCrumb />
      <Content />
      <TanStackRouterDevtools />
      <FooterComponent />
      <ForceResetPassword isOpen={!!loginData?.isFirstLogin} />
    </Box>
  );
};

export default MainLayout;
