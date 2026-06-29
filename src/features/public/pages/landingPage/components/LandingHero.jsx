import { Box, Button, Grid, GridItem, HStack, Input, InputGroup, Text, VStack } from '@kfonbss/bss-ui-components';
import { useTranslation } from 'react-i18next';

import Carousal1 from '@/assets/carousal/1.png';
import Searchbg from '@/assets/landingPage/searchBg.png';
import { RadioGroup } from '@/components/custom';
import styles from '@/style/landing.module.css';

const Stat = ({ number, label }) => (
  <VStack spacing={1} align='flex-start' minW='140px'>
    <Text fontSize='32px' fontWeight='700' color='#690034'>
      {number}
    </Text>
    <Text fontSize='22px' fontWeight='500' color='#626262'>
      {label}
    </Text>
  </VStack>
);

const DividerLine = () => <Box h='45px' w='1px' bg='#D2D2D2' />;

const LandingHero = ({ onEnquiryClick }) => {
  const { t } = useTranslation();
  const payMethods = [
    { label: t('prepaid'), value: '1' },
    { label: t('postpaid'), value: '2' }
  ];
  return (
    <Box position='relative'>
      <Box className={styles.container}>
        <Button
          position='absolute'
          right={{ base: '-50px', '2xl': '-60px', xl: '-60px' }}
          top={{ base: '35%', '2xl': '50%', xl: '50%' }}
          zIndex='50'
          bg='#8D0247'
          color='white'
          borderRadius='30px 30px 0 0'
          px='35px'
          py='20px'
          fontWeight='600'
          transform='rotate(-90deg) translateX(50%)'
          transformOrigin='center'
          onClick={onEnquiryClick}
          letterSpacing={{ base: '3px', '2xl': '5px', xl: '5px' }}
          style={{
            textTransform: 'uppercase'
          }}
        >
          {t('enquiry')}
        </Button>

        <Grid templateColumns='1fr 1fr' alignItems='center' pt={5} className={styles.heroGrid}>
          <GridItem className={styles.heroContent}>
            <VStack alignItems='flex-start' justifyContent='center' h='100%' spacing={0}>
              <Text
                display={'flex'}
                justifyContent={'start'}
                alignItems={'center'}
                p={0}
                pb={{ base: '5px', xl: '20px' }}
                m={0}
                gap={'8px'}
                fontSize={{ base: '18px', '2xl': '30px', xl: '14px' }}
                lineHeight={{ '2xl': '16px', xl: '14px' }}
                fontWeight={500}
                // textTransform={'uppercase'}
                color='#292929'
              >
                <svg width='25' height='13' viewBox='0 0 25 13' fill='none' xmlns='http://www.w3.org/2000/svg'>
                  <rect x='5.5' y='0.5' width='19' height='12' rx='6' stroke='#8D0247' />
                  <rect width='19' height='13' rx='6.5' fill='#8D0247' />
                </svg>
                {t('bestInternetProvider')}
              </Text>
              <Text
                p={0}
                m={0}
                fontSize={{ base: '22px', '2xl': '82px', xl: '62px' }}
                lineHeight={{ base: '20px', '2xl': '80px', xl: '60px' }}
                fontWeight={700}
                letterSpacing='-1px'
                color='#8D0247'
              >
                {t('kfonKeralaOwn')} {t('internet')}
              </Text>
              {/* <Text
                p={0}
                m={0}
                pb={{ base: '5px', xl: '20px' }}
                fontSize={{ base: '20px', '2xl': '82px', xl: '62px' }}
                lineHeight={{ base: '20px', '2xl': '80px', xl: '60px' }}
                fontWeight={700}
                letterSpacing={{ base: '0px', '2xl': '-1', xl: '-1' }}
                // textTransform='uppercase'
                color='#292929'
              >
                {t('internet')}
              </Text> */}
              <Text
                p={0}
                m={0}
                fontSize={{ base: '12px', '2xl': '20px', xl: '15px' }}
                lineHeight={{ '2xl': '32px', xl: '22px' }}
                fontWeight={500}
                color='#292929'
                textWrap={{ base: 'wrap', '2xl': 'none', xl: 'none' }}
              >
                {t('kfonIntroLine1')}
                <br />
                {t('kfonIntroLine2')}
              </Text>

              <Box display={{ base: 'none', md: 'block' }} mt='20px' overflow='hidden' h='100px'>
                <VStack className={styles.statCarousel} spacing={0} w='100%' align='stretch'>
                  <HStack className='statBlock' justify='flex-start' align='center' gap='40px'>
                    <Stat number='30K+' label={t('govtInstitutions')} />
                    <DividerLine />
                    <Stat number='99.9%' label={t('networkUptime')} />
                    <DividerLine />
                    <Stat number='1Gbps' label={t('maxSpeed')} />
                  </HStack>
                  <HStack className='statBlock' justify='flex-start' align='center' gap='40px'>
                    <Stat number='45Mbps' label={t('highSpeed')} />
                    <DividerLine />
                    <Stat number='Unlimited' label={t('data')} />
                    <DividerLine />
                    <Stat number='444' label={t('startingPrice')} />
                  </HStack>
                  <HStack className='statBlock' justify='flex-start' align='center' gap='40px'>
                    <Stat number='20Mbps' label={t('startingSpeed')} />
                    <DividerLine />
                    <Stat number='1000Gb' label={t('dataIncluded')} />
                    <DividerLine />
                    <Stat number='24/7' label={t('support')} />
                  </HStack>
                </VStack>
              </Box>

              <HStack gap='20px' mt='32px' mb={{ base: '25px', '2xl': '0px', xl: '0px' }}>
                <Button
                  variant='outline'
                  color='#8D0247'
                  borderColor='#8D0247'
                  borderWidth='2px'
                  borderRadius='full'
                  height='55px'
                  size={{ base: 'md', '2xl': '2xl', xl: '2xl' }}
                >
                  {t('seePlans')} →
                </Button>

                <Button
                  bg='#8D0247'
                  color='white'
                  borderRadius='full'
                  height='55px'
                  size={{ base: 'md', '2xl': '2xl', xl: '2xl' }}
                  display='flex'
                  alignItems='center'
                  gap='8px'
                >
                  {t('getNewConnection')}
                  <svg width='18' height='18' viewBox='0 0 18 18' fill='white'>
                    <path d='M6 3l6 6-6 6' />
                  </svg>
                </Button>
              </HStack>
            </VStack>
          </GridItem>
          <GridItem display='flex' justifyContent='center' alignItems='center' className={styles.heroImage}>
            <Box
              className={styles.heroImageBox}
              h={{ '2xl': '750px', xl: '420px' }}
              overflow='visible'
              display='flex'
              alignItems='center'
              justifyContent='center'
            >
              <img src={Carousal1} className={styles.heroImg} />
            </Box>
          </GridItem>
        </Grid>
      </Box>

      {/* ✅ SEARCH BAR — MOVED INSIDE RELATIVE PARENT */}
      <Box
        position='absolute'
        left='50%'
        bottom='-65px'
        transform='translateX(-50%)'
        w='100%'
        maxW='1600px'
        h='115px'
        zIndex={999}
        borderRadius='120px'
        overflow='hidden'
        display={{ base: 'none', '2xl': 'flex', xl: 'flex' }}
        alignItems='center'
      >
        {/* background */}
        <Box pos='absolute' inset='0' borderRadius='120px' overflow='hidden'>
          <img
            src={Searchbg}
            alt='search-bg'
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        </Box>

        {/* content */}
        <Box
          position='relative'
          zIndex={2}
          w='100%'
          h='100%'
          px={{ xl: '80px', '2xl': '238px' }}
          display='flex'
          alignItems='center'
          justifyContent='space-between'
        >
          {/* LEFT : TEXT + RADIO (STACKED) */}
          <VStack align='flex-start' spacing='12px' maxW='520px'>
            <Text color='white' fontSize={{ xl: '28px', '2xl': '26px' }} fontWeight='600' lineHeight='1.2'>
              {t('payYourBill')}
            </Text>

            {/* RADIO WRAPPER */}
            <Box bg='#A8366E' px='18px' py='8px' borderRadius='20px'>
              <RadioGroup.Root defaultValue='1'>
                <HStack spacing='16px'>
                  {payMethods.map((item) => (
                    <RadioGroup.Item key={item.value} value={item.value}>
                      <RadioGroup.ItemIndicator />
                      <RadioGroup.ItemText color='white'>{item.label}</RadioGroup.ItemText>
                    </RadioGroup.Item>
                  ))}
                </HStack>
              </RadioGroup.Root>
            </Box>
          </VStack>

          <InputGroup
            endAddon={
              <Button h={{ '2xl': '44px', xl: '36px' }} pr={'6px'} bg={'#FFDE74'}>
                {' '}
                Pay Now{' '}
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
            startAddon={
              <svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20' fill='none'>
                {' '}
                <g clipPath='url(#clip0_3948_2031)'>
                  {' '}
                  <path
                    d='M19.8234 3.97266L13.7578 9.99918L19.8234 16.0257C19.933 15.7965 19.9996 15.5432 19.9996 15.2726V4.72574C19.9996 4.45516 19.933 4.20184 19.8234 3.97266Z'
                    fill='#737177'
                  />{' '}
                  <path
                    d='M18.2414 2.96875H1.75699C1.48641 2.96875 1.23309 3.03527 1.00391 3.14492L8.75637 10.8583C9.44184 11.5438 10.5565 11.5438 11.242 10.8583L18.9945 3.14492C18.7653 3.03527 18.512 2.96875 18.2414 2.96875Z'
                    fill='#737177'
                  />{' '}
                  <path
                    d='M0.176172 3.97266C0.0665234 4.20184 0 4.45516 0 4.72574V15.2726C0 15.5432 0.0665234 15.7966 0.176172 16.0257L6.24176 9.99918L0.176172 3.97266Z'
                    fill='#737177'
                  />{' '}
                  <path
                    d='M12.9289 10.8281L12.0705 11.6864C10.9284 12.8286 9.06992 12.8286 7.92777 11.6864L7.06949 10.8281L1.00391 16.8546C1.23309 16.9643 1.48641 17.0308 1.75699 17.0308H18.2414C18.512 17.0308 18.7653 16.9643 18.9945 16.8546L12.9289 10.8281Z'
                    fill='#737177'
                  />{' '}
                </g>{' '}
                <defs>
                  {' '}
                  <clipPath id='clip0_3948_2031'>
                    {' '}
                    <rect width='20' height='20' fill='white' />{' '}
                  </clipPath>{' '}
                </defs>{' '}
              </svg>
            }
            startAddonProps={{ padding: '0 0 0 16px', bg: 'transparent', border: 'none' }}
            bg={'white'}
            borderRadius={'full'}
            outline={'none'}
            border={'none'}
            h={{ '2xl': '48px', xl: '40px' }}
            w={{ '2xl': '600px', xl: '420px' }}
          >
            <>
              {' '}
              <Input
                bg={'white'}
                borderRadius={'full'}
                outline={'none'}
                border={'none'}
                h={{ '2xl': '48px', xl: '40px' }}
                placeholder='Mobile num / Username'
                _placeholder={{ fontSize: { '2xl': '16px', xl: '12px' } }}
              />{' '}
            </>
          </InputGroup>
        </Box>
      </Box>
    </Box>
  );
};

export default LandingHero;
