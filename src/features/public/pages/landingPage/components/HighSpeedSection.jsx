import { Box, Button, Flex, Text } from '@kfonbss/bss-ui-components';
import { useTranslation } from 'react-i18next';

import highSpeedImg from '@/assets/landingPage/img3.png';
import { RightRoundedArrowIcon } from '@/assets/svg';
import styles from '@/style/landing.module.css';

const HighSpeedSection = () => {
  const { t } = useTranslation();

  return (
    <Box className={styles.highSpeedContainer} h={{ '2xl': '887px', xl: '635px', base: 'auto' }} py={10}>
      <Flex
        h='100%'
        align='center'
        justify='space-between'
        px={{ '2xl': '160px', xl: '100px', md: '48px', base: '16px' }}
        direction={{ base: 'column', md: 'column', xl: 'row' }}
        gap={{ base: '32px', md: '48px', xl: '0' }}
      >
        <Box flex={{ xl: '0 0 45%' }} w={{ base: '100%', xl: '45%' }} display='flex' justifyContent='center'>
          <img src={highSpeedImg} alt={t('highSpeedAlt')} style={{ maxWidth: '100%', height: 'auto' }} />
        </Box>
        <Box flex={{ xl: '0 0 50%' }} w={{ base: '100%', xl: '50%' }} textAlign={{ base: 'center', xl: 'left' }}>
          <Text
            fontSize={{ base: '28px', md: '36px', xl: '40px', '2xl': '60px' }}
            fontWeight={600}
            lineHeight={{ base: '36px', md: '44px', xl: '40px', '2xl': '60px' }}
            mb='32px'
            color='#101010'
          >
            {t('findYour')}{' '}
            <Text as='span' color='#8D0247'>
              {t('ultimateHigh')}
            </Text>{' '}
            -
            <br />
            {t('speedNetwork')}
          </Text>

          <Text fontSize={{ base: '14px', md: '16px', xl: '18px' }} mb='48px' color='#000000E5'>
            {t('highSpeedDesc1')}
            <br />
            <br />
            {t('highSpeedDesc2')}
            <br />
            <br />
            {t('highSpeedDesc3')}
          </Text>

          <Flex justify={{ base: 'center', xl: 'flex-start' }}>
            <Button
              size='2xl'
              h={{ '2xl': '54px', xl: '44px' }}
              bg='#8D0247'
              color='white'
              borderRadius='full'
              display='flex'
              alignItems='center'
              gap='12px'
            >
              {t('discoverMore')}
              <Box
                w='36px'
                h='36px'
                bg='white'
                borderRadius='full'
                display='flex'
                alignItems='center'
                justifyContent='center'
                flexShrink={0}
              >
                <RightRoundedArrowIcon />
              </Box>
            </Button>
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
};

export default HighSpeedSection;
