import { Box, Flex, VStack } from '@kfonbss/bss-ui-components';
import { Outlet } from '@tanstack/react-router';
import { memo, useEffect, useRef, useState } from 'react';

import { SessionTimeoutModal } from '@/components/common/SessionTimeOut';
import LoaderProvider from '@/components/custom/LoaderProvider';
import VerticalMenu from '@/features/components/verticalMenu';
import styles from '@/style/layout.module.css';

// 30 minutes of inactivity before the session-expired modal appears
const IDLE_TIMEOUT_MS = 30 * 60 * 1000;
const ACTIVITY_EVENTS = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll', 'click'];

const Layout = memo(() => {
  const [showTimeout, setShowTimeout] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    const armTimer = () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setShowTimeout(true), IDLE_TIMEOUT_MS);
    };
    const onActivity = () => {
      if (showTimeout) return; // freeze timer once modal is open
      armTimer();
    };
    ACTIVITY_EVENTS.forEach((evt) => window.addEventListener(evt, onActivity, { passive: true }));
    armTimer();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      ACTIVITY_EVENTS.forEach((evt) => window.removeEventListener(evt, onActivity));
    };
  }, [showTimeout]);

  return (
    <>
      <Flex
        className={styles.contentContainer}
        direction={{ base: 'column', md: 'row' }}
        p={{ base: 5, md: '10px 32px 20px 32px' }}
        height={{ base: 'calc(100vh - 108px - 46px)', md: 'calc(100vh - 108px - 62px)' }}
        overflow={'auto'}
      >
        <Box display={{ base: 'none', md: 'block' }}>
          <VerticalMenu />
        </Box>
        <VStack
          bg='white'
          borderTopRightRadius='3xl'
          borderBottomRightRadius='3xl'
          borderTopLeftRadius={{ base: '3xl', md: 'none' }}
          borderBottomLeftRadius={{ base: '3xl', md: 'none' }}
          flex={1}
          alignItems='stretch'
          p='5'
          gap='5'
          h='full'
          minW={0}
          overflowY={'auto'}
          position='relative'
        >
          <LoaderProvider>
            <Outlet />
          </LoaderProvider>
        </VStack>
      </Flex>
      <SessionTimeoutModal isOpen={showTimeout} onClose={() => setShowTimeout(false)} />
    </>
  );
});

Layout.displayName = 'Layout';

export default Layout;
