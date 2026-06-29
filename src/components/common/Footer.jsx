import { Box, Button, Flex, HStack, Input, InputGroup, Link, Text, VStack } from '@kfonbss/bss-ui-components';
import { useTranslation } from 'react-i18next';

import GOVT_SEAL_WHITE from '@/assets/govt_seal.svg';
import connector from '@/assets/landingPage/cable_connector.png';
import router from '@/assets/landingPage/router.png';
import LOGO from '@/assets/main_logo_white.png';
import { CallPhoneIcon } from '@/assets/svg';
import LanguageSelector from '@/components/custom/LanguageSelector';

const Footer = ({ govtSeal = false }) => {
  const { t } = useTranslation();

  return (
    <Box
      w='100%'
      bg='primary.500'
      px={{ base: '16px', md: '40px', xl: '110px' }}
      pt={{ base: '40px', xl: '60px' }}
      pos='relative'
      overflow='hidden'
    >
      <Box pos='absolute' left='0' bottom='0' display={{ base: 'none', xl: 'block' }}>
        <img src={connector} alt='connector' />
      </Box>

      <Flex direction={{ base: 'column', xl: 'row' }} justify='space-between' gap={{ base: '32px', xl: '0' }}>
        <HStack gap='36px'>
          <img width='112px' src={LOGO} alt='BSS logo' />
          {govtSeal && <img src={GOVT_SEAL_WHITE} alt='govt-seal' />}
        </HStack>

        <InputGroup
          endAddon={
            <Button h={{ '2xl': '44px', xl: '36px' }} pr='6px'>
              {t('subscribeNow')}
            </Button>
          }
          endAddonProps={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: 'white',
            borderRadius: '99px',
            padding: '0',
            h: { '2xl': '48px', xl: '40px' }
          }}
          bg='white'
          borderRadius='full'
          h={{ '2xl': '48px', xl: '40px' }}
          w={{ '2xl': '600px', xl: '420px' }}
        >
          <Input
            bg='white'
            borderRadius='full'
            border='none'
            placeholder={t('footerInputPlaceholder')}
            _placeholder={{ fontSize: { '2xl': '16px', xl: '12px' } }}
          />
        </InputGroup>

        <HStack gap='16px'>
          <CallPhoneIcon />
          <VStack alignItems='flex-start' spacing='4px'>
            <Text fontSize='14px' color='white'>
              {t('callEmergency')}
            </Text>
            <Text fontSize='20px' fontWeight='700' color='white'>
              {t('emergencyNumber')}
            </Text>
          </VStack>
        </HStack>
      </Flex>

      <Box h='1px' bg='white' my={{ base: '32px', xl: '60px' }} />

      <Flex wrap='wrap' justify='space-between' gap={{ base: '32px', xl: '0' }}>
        <VStack align='flex-start' color='white'>
          <Text fontSize='20px' fontWeight='700'>
            {t('aboutKfon')}
          </Text>
          <Text>{t('kfonCompanyName')}</Text>
          <Text>{t('companyAddressLine1')}</Text>
          <Text>{t('companyAddressLine2')}</Text>
          <Text>{t('companyPhone')}</Text>
        </VStack>

        <VStack align='flex-start' color='white'>
          <Text fontSize='20px' fontWeight='700'>
            {t('services')}
          </Text>
          {['broadband', 'internetLeasedLine', 'mplsServices', 'darkFiber', 'ottServices'].map((key) => (
            <Link key={key} color='white'>
              {t(key)}
            </Link>
          ))}
        </VStack>

        <VStack align='flex-start' color='white'>
          <Text fontSize='20px' fontWeight='700'>
            {t('support')}
          </Text>
          {['callUs', 'contactCustomerCare', 'findNearestLco', 'createComplaint', 'trackEnquiry'].map((key) => (
            <Link key={key} color='white'>
              {t(key)}
            </Link>
          ))}
        </VStack>

        <VStack align='flex-start' color='white'>
          <Text fontSize='20px' fontWeight='700'>
            {t('legalAndPrivacy')}
          </Text>
          {['privacyPolicy', 'termsAndConditions', 'cookiePolicy', 'sitemap'].map((key) => (
            <Link key={key} color='white'>
              {t(key)}
            </Link>
          ))}
        </VStack>
      </Flex>

      <Box h='1px' bg='white' my='20px' pos='relative'>
        <Box pos='absolute' right={{ base: '0', xl: '-100px' }} bottom='0'>
          <img src={router} alt='router' />
        </Box>
      </Box>

      <Flex justify='space-between' alignItems='center' pb='24px'>
        <Text fontSize='16px' color='white'>
          {t('footerCopyright')}
        </Text>
        <LanguageSelector variant='dark' />
      </Flex>
    </Box>
  );
};

export default Footer;
