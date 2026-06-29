import { Box, Button, Flex, Icons, Popup, Text } from '@kfonbss/bss-ui-components';
import { useDispatch } from 'react-redux';

import { STORAGE_KEYS } from '@/constants';
import { doLogout } from '@/features/others/common/actions';
import { router } from '@/routes/routes';

const { SessionTimeoutIcon } = Icons;
const TimeoutIcon = SessionTimeoutIcon ;

const SessionTimeoutModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();

  // Both actions terminate the session: clear storage, reset redux, then navigate.
  const clearSessionAndNavigate = (to) => {
    onClose?.();
    try {
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.TOKEN_EXPIRES_IN);
      localStorage.removeItem(STORAGE_KEYS.LOGIN_DETAILS);
      sessionStorage.clear();
    } catch {
      // no-op
    }
    dispatch(doLogout());
    setTimeout(() => router.navigate({ to }), 100);
  };

  const goToHome = () => clearSessionAndNavigate('/');
  const goToLogin = () => clearSessionAndNavigate('/auth/tenant-selection');

  return (
    <Popup
      isOpen={isOpen}
      onOpenChange={() => {}}
      size='lg'
      placement='center'
      title=''
      titleMain=''
      closeButton={false}
      closeOnInteractOutside={false}
      contentProps={{ maxW: { base: '92vw', md: '620px' }, mx: 'auto' }}
    >
      <Flex
        direction={{ base: 'column', md: 'row' }}
        align='center'
        gap={{ base: '16px', md: '32px' }}
        w='100%'
        p={{ base: '20px', md: '32px' }}
      >
        <Box
          flexShrink={0}
          display='flex'
          alignItems='center'
          justifyContent='center'
          w={{ base: '160px', md: '220px' }}
          h={{ base: '160px', md: '220px' }}
        >
          {TimeoutIcon ? (
            <TimeoutIcon width='100%' height='100%' w='100%' h='100%' />
          ) : null}
        </Box>

        <Box flex={1} textAlign={{ base: 'center', md: 'left' }}>
          <Text
            fontSize={{ base: '24px', md: '30px' }}
            fontWeight={700}
            color='#8D0247'
            mb='8px'
            lineHeight='1.2'
          >
            Session Expired
          </Text>
          <Text fontSize={{ base: '13px', md: '14px' }} color='#5F5F5F' mb='24px' lineHeight='1.5'>
            Your session has timed out for security reasons. Please log in again to continue.
          </Text>
          <Flex
            gap='12px'
            flexWrap='wrap'
            justify={{ base: 'center', md: 'flex-start' }}
          >
            <Button
              variant='outline'
              borderColor='#8D0247'
              color='#8D0247'
              borderRadius='full'
              h='44px'
              px='24px'
              minW='120px'
              _hover={{ bg: '#FDF2F8' }}
              _focus={{ boxShadow: 'none', outline: 'none' }}
              _focusVisible={{ boxShadow: 'none', outline: 'none' }}
              onClick={goToHome}
            >
              Home
            </Button>
            <Button
              variant='solid'
              bg='#8D0247'
              color='white'
              borderRadius='full'
              h='44px'
              px='24px'
              minW='120px'
              _hover={{ bg: '#700138' }}
              _focus={{ boxShadow: 'none', outline: 'none' }}
              _focusVisible={{ boxShadow: 'none', outline: 'none' }}
              onClick={goToLogin}
            >
              Login
            </Button>
          </Flex>
        </Box>
      </Flex>
    </Popup>
  );
};

export default SessionTimeoutModal;
