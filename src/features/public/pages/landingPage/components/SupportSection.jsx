import { Box, Flex, Text, VStack } from '@kfonbss/bss-ui-components';
import { useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

import wave from '@/assets/landingPage/wave.png';
import waveleft from '@/assets/landingPage/waveleft.png';
import {
  SupportCallUs,
  SupportCreateComplaint,
  SupportCustomerCare,
  SupportNearestLco,
  SupportTrackEnquiry
} from '@/assets/svg';
import styles from '@/style/landing.module.css';

const SupportSection = ({ isMobileOrTablet }) => {
  const { t } = useTranslation();

  const navigate = useNavigate();

  const contactOption = [
    {
      label: 'CALL US',
      icon: <SupportCallUs />,
      color: '#e65ba8'
    },
    {
      label: 'CONTACT CUSTOMER CARE',
      icon: <SupportCustomerCare />,
      color: '#f9a13b'
    },
    {
      label: 'FIND NEAREST LCO',
      icon: <SupportNearestLco />,
      color: '#2b8dc5'
    },
    {
      label: 'CREATE COMPLAINT',
      icon: <SupportCreateComplaint />,
      color: '#f9a13b',
      link: 'enquiry/complaint'
    },
    {
      label: 'TRACK ENQUIRY',
      icon: <SupportTrackEnquiry />,
      color: '#e65ba8'
    }
  ];

  return (
    <Box
      w='100%'
      position='relative'
      py={{ base: '120px', md: '96px', xl: '160px' }}
      overflow='hidden'
    >
      <Box position='absolute' right='0' bottom='0'>
        <img
          src={wave}
          alt='wave-right'
          style={{
            width: isMobileOrTablet ? '180px' : '420px'
          }}
        />
      </Box>

      <Box position='absolute' left='0' top='0' overflow='hidden' w='420px'>
        <img
          src={waveleft}
          alt='wave-left'
          style={{
            width: isMobileOrTablet ? '180px' : '420px',
            transform: 'translateX(0)'
          }}
        />
      </Box>

      <VStack w='100%' spacing={{ base: '56px', md: '72px', xl: '188px' }} gap={10} position='relative'>
        <Text fontSize={{ base: '28px', md: '36px', xl: '44px' }} fontWeight={600} textAlign='center'>
          {t('need')}{' '}
          <Text as='span' color='primary.500'>
            {t('needSupport')}
          </Text>
        </Text>

        <Flex w='100%' wrap='wrap' justify='center' gap={{ base: '32px', md: '40px', xl: '120px' }}>
          {contactOption.map((opt, index) => (
            <VStack key={index} spacing='14px'>
              <Box
                className={styles.card}
                w={{ base: '96px', md: '110px', xl: '120px' }}
                h={{ base: '96px', md: '110px', xl: '120px' }}
                borderRadius='full'
                border='2px solid rgba(16,16,16,0.1)'
                display='flex'
                alignItems='center'
                justifyContent='center'
                bg='white'
                cursor='pointer'
                transition='all 0.25s ease'
                position='relative'
                _hover={{
                  transform: 'scale(1.05)',
                  boxShadow: `0 8px 16px ${opt.color}33`
                }}
                onClick={() => navigate({ to: opt.link })}
              >
                <Box
                  position='absolute'
                  inset='-2px'
                  borderTop={`3px solid ${opt.color}`}
                  borderBottom={`3px solid ${opt.color}`}
                  borderRadius='full'
                />
                <Box transform='scale(0.75)' display='flex' alignItems='center' justifyContent='center'>
                  {opt.icon}
                </Box>
              </Box>
              <Text
                textAlign='center'
                fontWeight={600}
                fontSize={{ base: '13px', md: '14px' }}
                lineHeight='1.2'
                maxW='120px'
              >
                {opt.label}
              </Text>
            </VStack>
          ))}
        </Flex>
      </VStack>
    </Box>
  );
};

export default SupportSection;
