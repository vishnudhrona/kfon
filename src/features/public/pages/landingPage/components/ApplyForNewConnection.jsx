import { Box, HStack, Text } from '@kfonbss/bss-ui-components';
import { useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

import serviceImg1 from '@/assets/landingPage/serviceImg1.png';
import serviceImg2 from '@/assets/landingPage/serviceImg2.png';
import serviceImg3 from '@/assets/landingPage/serviceImg3.png';
import serviceImg4 from '@/assets/landingPage/serviceImg4.png';
import serviceImg6 from '@/assets/landingPage/serviceImg6.png';
import {
  BplConnectionSvg,
  CorporateConnectionSvg,
  DarkFiberConnectionSvg,
  OttConnectionSvg,
  RetailConnectionSvg
} from '@/assets/svg';

const ApplyForNewConnection = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const newConnectionList = [
    {
      svg: <RetailConnectionSvg />,
      label: (
        <>
          {t('home')} <br />
          {t('connection')}
        </>
      ),
      img: serviceImg1,
      link: 'enquiry/home'
    },
    {
      svg: <BplConnectionSvg />,
      label: (
        <>
          {t('bplEws')} <br />
          {t('connection')}
        </>
      ),
      img: serviceImg3,
      link: 'enquiry/bpl'
    },
    {
      svg: <CorporateConnectionSvg />,
      label: t('corporateConnection'),
      img: serviceImg2,
      link: 'enquiry/corporate'
    },

    {
      svg: <DarkFiberConnectionSvg />,
      label: t('darkFiberConnection'),
      img: serviceImg4,
      link: '/enquiry/dark-fibre'
    },
    {
      svg: <OttConnectionSvg />,
      label: (
        <>
          {t('partner')} {t('enquiry')}
        </>
      ),
      img: serviceImg6,
      link: 'enquiry/partner'
    }
  ];

  return (
    <Box
      w='100%'
      px={{ base: '20px', md: '40px', xl: '70px', '2xl': '140px' }}
      py={{ base: '40px', md: '60px', '2xl': '100px' }}
      display='flex'
      flexDir='column'
      alignItems='center'
    >
      <Text
        fontSize={{ base: '28px', md: '36px', xl: '44px', '2xl': '56px' }}
        fontWeight={600}
        lineHeight='1.2'
        mb='16px'
      >
        {t('applyForA')}&nbsp;
        <Text as='span' color='primary.500'>
          {t('newConnection')}
        </Text>
      </Text>

      <Text fontSize={{ base: '14px', md: '16px', '2xl': '18px' }} color='rgba(0,0,0,0.7)' mb='60px' textAlign='center'>
        {t('chooseConnectionType')}
      </Text>
      <HStack
        w='100%'
        justifyContent='center'
        gap={{ base: '24px', md: '28px', xl: '32px' }}
        flexWrap={{ base: 'wrap', xl: 'nowrap' }}
      >
        {newConnectionList.map(({ svg, label, img, link }) => (
          <Box
            key={label}
            bg='white'
            boxShadow='0 0 30px rgba(0,0,0,0.15)'
            p='8px'
            cursor='pointer'
            borderRadius='25px'
            width={{ base: '100%', sm: '280px', xl: '280px', '2xl': '300px' }}
            aspectRatio={{ base: 'auto', md: '0.85 / 1' }}
            transition='transform 0.3s ease, box-shadow 0.3s ease'
            _hover={{
              transform: 'scale(1.05)',
              boxShadow: '0 12px 40px rgba(0,0,0,0.25)'
            }}
            onClick={() => navigate({ to: link })}
          >
            <Box
              position='relative'
              h={{ base: '180px', md: 'auto' }}
              borderTopLeftRadius='25px'
              borderTopRightRadius='25px'
              pb='36px'
            >
              <img
                src={img}
                alt={label}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderTopLeftRadius: '25px',
                  borderTopRightRadius: '25px'
                }}
              />
              <Box position='absolute' top='63%' left='50%' transform='translate(-50%, calc(-50% + 28px))' zIndex={2}>
                {svg}
              </Box>
            </Box>

            <Box
              w='100%'
              h={{ base: '80px', md: '90px' }}
              display='flex'
              justifyContent='center'
              alignItems='center'
              textAlign='center'
            >
              <Text
                w='85%'
                pt='16px'
                fontSize={{ base: '16px', md: '17px', xl: '18px', '2xl': '20px' }}
                lineHeight='24px'
                fontWeight={600}
              >
                {label}
              </Text>
            </Box>
          </Box>
        ))}
      </HStack>
    </Box>
  );
};

export default ApplyForNewConnection;
