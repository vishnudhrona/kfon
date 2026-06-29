import { Box, Grid, GridItem, Text } from '@kfonbss/bss-ui-components';
import { useTranslation } from 'react-i18next';

import wave from '@/assets/landingPage/wave.png';
import { PartnerAgnp, PartnerBusiness, PartnerChannel, PartnerLnp } from '@/assets/svg';

import Carousel from './carousel';

const PartnerSection = () => {
  const { t } = useTranslation();
  const partnerData = [
    {
      svg: <PartnerLnp />,
      head: 'On Board As LNP',
      data: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,"
    },
    {
      svg: <PartnerAgnp />,
      head: 'On Board As AGNP',
      data: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,"
    },
    {
      svg: <PartnerChannel />,
      head: 'Onboard as Channel Partner',
      data: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,"
    },
    {
      svg: <PartnerBusiness />,
      head: 'Onboard as Business Partner',
      data: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,"
    }
  ];

  return (
    <Box w='100%' py={{ base: '60px', md: '80px', xl: '100px' }} pos='relative' overflow='hidden'>
      <Box pos='absolute' right='0' top={{ base: '150px', md: '140px', xl: '65px' }} pointerEvents='none'>
        <img
          src={wave}
          alt='wave'
          style={{
            width: '380px',
            height: 'auto'
          }}
        />
      </Box>

      <Box px={{ base: '20px', md: '40px', xl: '72px', '2xl': '100px' }} position='relative' zIndex={1}>
        <Text
          fontSize={{ base: '28px', md: '36px', xl: '40px', '2xl': '52px' }}
          fontWeight={600}
          lineHeight='1.2'
          mb={{ base: '40px', xl: '72px' }}
        >
          {t('wantToBecome')}{' '}
          <Text as='span' color='primary.500'>
            {t('kfonPartner')}
          </Text>
        </Text>

        <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={{ base: '48px', xl: '80px' }} alignItems='center'>
          <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={{ base: '40px', xl: '60px' }}>
            {partnerData.map(({ svg, head, data }) => (
              <GridItem key={head}>
                <Box mb='24px'>{svg}</Box>

                <Text fontSize={{ base: '18px', xl: '20px', '2xl': '26px' }} fontWeight={600} mb='16px'>
                  {head}
                </Text>

                <Text fontSize={{ base: '14px', '2xl': '16px' }} lineHeight='1.4'>
                  {data}
                </Text>
              </GridItem>
            ))}
          </Grid>
          <Box>
            <Carousel />
          </Box>
        </Grid>
      </Box>
    </Box>
  );
};

export default PartnerSection;
