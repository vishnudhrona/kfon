import { Flex } from '@kfonbss/bss-ui-components';
import { Outlet } from '@tanstack/react-router';

import SubPageFooter from '@/features/public/pages/landingPage/components/SubPageFooter';
import SubPageHeader from '@/features/public/pages/landingPage/components/SubPageHeader';
import styles from '@/style/layout.module.css';

const EnquiryLayout = () => {
  return (
    <>
      <SubPageHeader />
      <Flex justifyContent={'center'} w={'100%'} className={styles.enquiryLayoutContent}>
        <Outlet />
      </Flex>
      <SubPageFooter />
    </>
  );
};

export default EnquiryLayout;
