import { Box, Button, Flex, Text, VStack } from '@kfonbss/bss-ui-components';
import { useTranslation } from 'react-i18next';

import new_img from '@/assets/landingPage/new_img.png';

const LatestNewsSection = () => {
  const { t } = useTranslation();
  const newsList = [
    {
      img: new_img,
      head: 'Onboard as Channel Partner',
      content:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text.the industry's standard dummy text."
    },
    {
      img: new_img,
      head: 'Onboard as Channel Partner',
      content:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text.the industry's standard dummy text."
    },
    {
      img: new_img,
      head: 'Onboard as Channel Partner',
      content:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text.the industry's standard dummy text."
    },
    {
      img: new_img,
      head: 'Onboard as Channel Partner',
      content:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text.the industry's standard dummy text."
    },
    {
      img: new_img,
      head: 'Onboard as Channel Partner',
      content:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text.the industry's standard dummy text."
    }
  ];
  const [featured, ...others] = newsList;

  return (
    <Box
      bg='#EFF3F8'
      w='100%'
      px={{ base: '20px', md: '40px', xl: '80px', '2xl': '120px' }}
      py={{ base: '60px', xl: '100px' }}
    >
      <Flex justify='space-between' align='center' mb={{ base: '32px', xl: '64px' }}>
        <Text fontSize={{ base: '28px', md: '36px', xl: '40px', '2xl': '52px' }} fontWeight={600}>
          {t('latest')}{' '}
          <Text as='span' color='primary.500'>
            {t('news')}
          </Text>
        </Text>
        <Flex gap='8px'>
          <Button w='40px' h='40px' p={0} borderRadius='12px' bg='rgba(62,50,50,0.05)'>
            ‹
          </Button>
          <Button w='40px' h='40px' p={0} borderRadius='12px' bg='rgba(62,50,50,0.05)'>
            ›
          </Button>
        </Flex>
      </Flex>

      <Flex gap={{ base: '32px', xl: '48px' }} direction={{ base: 'column', lg: 'row' }} align='stretch'>
        <Box
          flex='1.2'
          position='relative'
          borderRadius='24px'
          overflow='hidden'
          minH={{ base: '260px', md: '320px', xl: '520px' }}
        >
          <img src={featured.img} alt={featured.head} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <Box
            position='absolute'
            top='50%'
            left='50%'
            transform='translate(-50%, -50%)'
            bg='rgba(255,255,255,0.85)'
            borderRadius='full'
            w='56px'
            h='56px'
            display='flex'
            alignItems='center'
            justifyContent='center'
          >
            ▶
          </Box>
          <Box position='absolute' bottom='0' w='100%' p='24px' bg='linear-gradient(transparent, rgba(0,0,0,0.7))'>
            <Text color='white' fontSize='20px' fontWeight={600} mb='8px'>
              {featured.head}
            </Text>
            <Text color='white' fontSize='14px' lineHeight='1.4'>
              {featured.content}
            </Text>
          </Box>
        </Box>
        <VStack flex='1' spacing={{ base: '20px', xl: '24px' }} align='stretch'>
          {others.slice(0, 4).map(({ img, head, content }) => (
            <Flex
              bg='white'
              borderRadius='20px'
              p={{ base: '16px', xl: '20px' }}
              align='center'
              justify='space-between'
              gap={{ base: '20px', xl: '24px' }}
              minH={{ base: '110px', xl: '130px' }}
              position='relative'
            >
              <Flex gap={{ base: '16px', xl: '20px' }} align='center' flex='1'>
                <Box
                  w={{ base: '100px', xl: '120px' }}
                  h={{ base: '70px', xl: '84px' }}
                  borderRadius='14px'
                  overflow='hidden'
                  flexShrink={0}
                >
                  <img
                    src={img}
                    alt={head}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                </Box>
                <Box>
                  <Text fontSize={{ base: '16px', xl: '18px' }} fontWeight={600} mb='6px' lineHeight='1.3'>
                    {head}
                  </Text>

                  <Text fontSize={{ base: '14px', xl: '15px' }} color='#666' lineHeight='1.4' noOfLines={2}>
                    {content}
                  </Text>
                </Box>
              </Flex>
              <Box
                position='absolute'
                bottom='0'
                right='0'
                w={{ base: '44px', xl: '50px' }}
                h={{ base: '44px', xl: '41px' }}
                bg='#FFDE74'
                borderRadius='0px 0 20px 0'
                borderTopLeftRadius='42px'
                display='flex'
                alignItems='center'
                justifyContent='center'
                fontSize='18px'
                fontWeight={700}
                cursor='pointer'
              >
                →
              </Box>
            </Flex>
          ))}
        </VStack>
      </Flex>
    </Box>
  );
};

export default LatestNewsSection;
