import { Box, Grid, Text } from '@kfonbss/bss-ui-components';
import { useTranslation } from 'react-i18next';

import {
  BoxPatternIcon,
  CoLocationServiceIcon,
  DarkFibreServiceIcon,
  HomeServiceIcon,
  InternetServiceIcon,
  MPLSServiceIcon,
  WifiServiceIcon
} from '@/assets/svg';
export const ServiceCard = ({ svg, label, description, color }) => {
  return (
    <Box
      position='relative'
      w={{ base: '100%', md: '420px', xl: '100%', '2xl': '514px' }}
      h={{ base: '280px', md: '300px', xl: '260px', '2xl': '323px' }}
      mx='auto'
      flexShrink={0}
      overflow='hidden'
      borderRadius='26px'
    >
      {/* <svg
        viewBox='0 0 514 323'
        preserveAspectRatio='none'
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          zIndex: 1
        }}
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <g filter='url(#filter0_d_8261_4074)'>
          <path
            d='M71 91.5565C85.3594 91.5565 97 79.9159 97 65.5565V26C97 11.6406 108.641 0 123 0H488C502.359 0 514 11.6406 514 26V297C514 311.359 502.359 323 488 323H26C11.6406 323 0 311.359 0 297V117.556C0 103.197 11.6406 91.5565 26 91.5565H71Z'
            fill='white'
          />
          <path
            d='M123 1H488C501.807 1 513 12.193 513 26V297C513 310.807 501.807 322 488 322H26C12.193 322 1 310.807 1 297V117.557C1 103.75 12.193 92.5566 26 92.5566H71C85.912 92.5566 98 80.4683 98 65.5566V26C98 12.1929 109.193 1 123 1Z'
            stroke={color}
            strokeOpacity='0.19'
            strokeWidth='2'
          />
        </g>
      </svg> */}

      <svg
        viewBox='0 0 514 323'
        preserveAspectRatio='none'
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          zIndex: 1
        }}
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <g>
          <path
            d='M71 91.5565C85.3594 91.5565 97 79.9159 97 65.5565V26C97 11.6406 108.641 0 123 0H488C502.359 0 514 11.6406 514 26V297C514 311.359 502.359 323 488 323H26C11.6406 323 0 311.359 0 297V117.556C0 103.197 11.6406 91.5565 26 91.5565H71Z'
            fill='white'
          />
          <path
            d='M123 1H488C501.807 1 513 12.193 513 26V297C513 310.807 501.807 322 488 322H26C12.193 322 1 310.807 1 297V117.557C1 103.75 12.193 92.5566 26 92.5566H71C85.912 92.5566 98 80.4683 98 65.5566V26C98 12.1929 109.193 1 123 1Z'
            stroke={color}
            strokeOpacity='0.19'
            strokeWidth='2'
          />
        </g>
      </svg>

      <Box
        position='absolute'
        top={{ base: '3px', xl: '3px' }}
        right={{ base: '3px', xl: '3px' }}
        zIndex={2}
        pointerEvents='none'
      >
        <BoxPatternIcon color={color} />
      </Box>
      <Box
        position='absolute'
        top={{ base: '8px', xl: '10px' }}
        left={{ base: '12px', xl: '17px' }}
        w={{ base: '56px', xl: '70px' }}
        h={{ base: '56px', xl: '70px' }}
        borderRadius='full'
        bg={`${color}22`}
        display='flex'
        alignItems='center'
        justifyContent='center'
        zIndex={3}
      >
        {svg}
      </Box>
      <Box
        position='absolute'
        inset={0}
        px={{ base: '24px', md: '40px', xl: '40px', '2xl': '56px' }}
        pt={{ base: '96px', xl: '96px', '2xl': '128px' }}
        zIndex={2}
      >
        <Text fontSize={{ base: '20px', md: '22px', xl: '26px' }} fontWeight='700' color={color}>
          {label}
        </Text>

        <Text
          mt='12px'
          fontSize={{ base: '14px', md: '16px', xl: '18px' }}
          lineHeight={{ base: '22px', xl: '26px' }}
          color='#272727'
        >
          {description}
        </Text>
      </Box>
    </Box>
  );
};

const ServiceListSection = () => {
  const { t } = useTranslation();
  const serviceList = [
    {
      label: t('homeBroadband'),
      description: t('homeBroadbandDesc'),
      svg: <HomeServiceIcon />,
      color: '#0DA65A'
    },
    {
      label: t('internetLeasedLine'),
      description: t('internetLeasedLineDesc'),
      svg: <InternetServiceIcon />,
      color: '#007BFF'
    },
    {
      label: t('mplsServices'),
      description: t('mplsServicesDesc'),
      svg: <MPLSServiceIcon />,
      color: '#F1A019'
    },
    {
      label: t('darkFibre'),
      description: t('darkFibreDesc'),
      svg: <DarkFibreServiceIcon />,
      color: '#A020F0'
    },
    {
      label: t('wifiHotspot'),
      description: t('wifiHotspotDesc'),
      svg: <WifiServiceIcon />,
      color: '#00A38E'
    },
    {
      label: t('coLocation'),
      description: t('coLocationDesc'),
      svg: <CoLocationServiceIcon />,
      color: '#E63946'
    }
  ];
  return (
    <Box w='100%' p={{ base: '48px 16px', md: '72px', xl: '96px' }} display='flex' justifyContent='center' overflow='visible'>
      <Box w='100%' overflow='visible'>
        <Text fontSize='52px' fontWeight='700' textAlign='center'>
          {t('offered')}{' '}
          <Text as='span' color='primary.500'>
            {t('servicesList')}
          </Text>
        </Text>

        <Text fontSize='18px' color='#000000' fontWeight='semibold' textAlign='center' mb='48px'>
          {t('servicesListSubtitle')}
        </Text>

        <Grid
          templateColumns={{
            base: '1fr',
            md: 'repeat(2, 1fr)',
            xl: 'repeat(3, 1fr)',
            '2xl': 'repeat(3, auto)'
          }}
          gap={{ base: '24px', md: '32px', xl: '48px' }}
          justifyContent='center'
          overflow='visible'
        >
          {serviceList?.map((item) => (
            <ServiceCard key={item.label} {...item} />
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default ServiceListSection;
