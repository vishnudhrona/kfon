import { Box, Button, Flex, HStack, Input, InputGroup, Link, Text, VStack } from '@kfonbss/bss-ui-components';
import { useTranslation } from 'react-i18next';

import GOVT_SEAL_WHITE from '@/assets/govt_seal.svg';
import connector from '@/assets/landingPage/cable_connector.png';
import router from '@/assets/landingPage/router.png';
import LOGO from '@/assets/main_logo_white.png';
import { CallPhoneIcon, FbIcon, InstagramSvg, MailIcon, PhoneRingIcon, TwitterSvg, YouTubeSvg } from '@/assets/svg';

const SubPageFooter = ({ govtSeal = false }) => {
  const { t } = useTranslation();

  return (
    <>
      <Flex
        w='100%'
        bg='#F2F2F2'
        px={{ base: '16px', md: '40px', xl: '100px' }}
        h={{ base: 'auto', md: '56px' }}
        py={{ base: '12px', md: '0' }}
        justify='space-between'
        align='center'
        wrap='wrap'
        gap={{ base: '12px', md: '0' }}
      >
        <Flex gap='16px' wrap='wrap'>
          <Link display='flex' alignItems='center' gap='8px'>
            <PhoneRingIcon />
            {t('phoneNumber')}
          </Link>
          <Link display='flex' alignItems='center' gap='8px'>
            <MailIcon />
            {t('email')}
          </Link>
        </Flex>

        <Flex gap='10px'>
          <Link>
            <FbIcon />
          </Link>
          <Link>
            <TwitterSvg />
          </Link>
          <Link>
            <InstagramSvg />
          </Link>
          <Link>
            <YouTubeSvg />
          </Link>
        </Flex>
      </Flex>
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
            endAddon={<Button>{t('subscribeNow')}</Button>}
            endAddonProps={{
              display: 'flex',
              alignItems: 'center',
              background: 'white',
              borderRadius: '99px'
            }}
            bg='white'
            borderRadius='full'
            w={{ base: '100%', md: '420px' }}
          >
            <Input placeholder={t('footerInputPlaceholder')} border='none' />
          </InputGroup>

          <HStack gap='16px'>
            <CallPhoneIcon />
            <VStack alignItems='flex-start' spacing='4px'>
              <Text color='white'>{t('callEmergency')}</Text>
              <Text fontSize='20px' fontWeight='700' color='white'>
                {t('emergencyNumber')}
              </Text>
            </VStack>
          </HStack>
        </Flex>

        <Box h='1px' bg='white' my={{ base: '32px', xl: '60px' }} />

        {/* LINK SECTIONS */}
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
            {['privacyPolicy', 'termsAndConditions', 'cookiePolicy', 'dataProtection', 'sitemap'].map((key) => (
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

        <Flex justify='center' pb='24px'>
          <Text color='white'>{t('footerCopyright')}</Text>
        </Flex>
      </Box>
    </>
  );
};

export default SubPageFooter;
