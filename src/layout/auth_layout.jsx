import { FooterComponent } from '@kfonbss/bss-ui-components';
import { Outlet } from '@tanstack/react-router';

import LoginLayout from '@/layout/login_layout';

const AuthLayout = () => {
  return (
    <>
      <LoginLayout>
        <Outlet />
      </LoginLayout>
      <FooterComponent />
    </>
  );
};

export default AuthLayout;
