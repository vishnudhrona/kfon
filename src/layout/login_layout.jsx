import { useTranslation } from 'react-i18next';

// import GOVT_SEAL from '@/assets/govt_seal_black.svg';
import LOGO from '@/assets/main_logo.png';
import { Box, HStack, Text } from '@/components/custom';
import styles from '@/style/loginLayout.module.css';

const LoginLayout = ({ children }) => {
  const { t } = useTranslation();
  return (
    <Box className={styles.mainContainer}>
      <Box className={styles.leftContainer}>
        <Box className={styles.leftTopContainer}>
          <HStack gap={'36px'}>
            <img className='logo' src={LOGO} alt='logo-kfon' />
            {/* <img className='seal' src={GOVT_SEAL} alt='govt-seal' /> */}
          </HStack>
          <Text
            fontSize={'48px'}
            width={'480px'}
            lineHeight={'48px'}
            fontWeight={500}
            p={0}
            m={'24px 0 0'}
            color={'primary.500'}
          >
            {t('getConnectedToday')}
          </Text>
          <Text
            fontSize={'16px'}
            lineHeight={'22px'}
            width={'480px'}
            fontWeight={400}
            p={0}
            m={'16px 0 0'}
            color={'black'}
          >
            {t('welcomeSubtitle')}
          </Text>
        </Box>
      </Box>
      <Box className={styles.rightContainer}>
        <Box className={styles.rightInsideContainer}>{children}</Box>
      </Box>
    </Box>
  );
};

export default LoginLayout;
