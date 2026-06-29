import { Box, Button, Grid, HStack, Tabs, Text, VStack } from '@kfonbss/bss-ui-components';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { PatternLine, RightArrowIcon, TickNewIcon, WifiSpeedIcon } from '@/assets/svg';

export default function PlanSelector() {
  const [selected, setSelected] = useState(null);
  const [hovered, setHovered] = useState(null);
  const { t } = useTranslation();
  const plans = [
    {
      id: 1,
      speed: '20 Mbps',
      price: '₹499',
      title: 'BSS Budget Pack',
      description: 'Power your day with ultra-fast, uninterrupted connectivity.',
      features: ['Data : 100 GB @ 100 Mbps', 'Fallback : 2 Mbps', 'Validity : 30 Days', 'Home Broadband']
    },
    {
      id: 2,
      speed: '20 Mbps',
      price: '₹499',
      title: 'BSS Budget Pack',
      description: 'Power your day with ultra-fast, uninterrupted connectivity.',
      features: ['Data : 100 GB @ 100 Mbps', 'Fallback : 2 Mbps', 'Validity : 30 Days', 'Home Broadband']
    },
    {
      id: 3,
      speed: '20 Mbps',
      price: '₹499',
      title: 'BSS Budget Pack',
      description: 'Power your day with ultra-fast, uninterrupted connectivity.',
      features: ['Data : 100 GB @ 100 Mbps', 'Fallback : 2 Mbps', 'Validity : 30 Days', 'Home Broadband']
    },
    {
      id: 4,
      speed: '20 Mbps',
      price: '₹499',
      title: 'BSS Budget Pack',
      description: 'Power your day with ultra-fast, uninterrupted connectivity.',
      features: ['Data : 100 GB @ 100 Mbps', 'Fallback : 2 Mbps', 'Validity : 30 Days', 'Home Broadband']
    }
  ];

  return (
    <Box
      bg='#F4F6FA'
      p={{ '2xl': '63px', xl: '72px' }}
      display='flex'
      justifyContent='center'
      alignItems='center'
      flexDirection='column'
      gap={{ '2xl': '24px', xl: '26px' }}
      w='100vw'
      padding={'20px'}
    >
      <Text fontSize={{ '6xl': '52px', xl: '58px' }} fontWeight={600} display='flex'>
        {t('chooseLanding')}&nbsp;
        <Text as='span' color='primary.500'>
          {t('yourPlan')}
        </Text>
      </Text>

      <Tabs.Root defaultValue='prepaid' variant='plain' w='full'>
        <Tabs.List
          pos='relative'
          rounded='full'
          bg='white'
          boxShadow='0px 4px 16px rgba(0,0,0,0.06)'
          display='flex'
          mx='auto'
          w='fit-content'
          h='70px'
          p='6px'
        >
          <Tabs.Trigger
            value='prepaid'
            w='180px'
            h='58px'
            display='flex'
            justifyContent='center'
            alignItems='center'
            fontWeight='600'
            fontSize='20px'
            background='white'
            borderRadius='full'
            border='1.4px solid transparent'
            _selected={{ border: '1.4px solid #8D0247', color: '#8D0247' }}
          >
            {t('prepaid')}
          </Tabs.Trigger>

          <Tabs.Trigger
            value='postpaid'
            w='180px'
            h='58px'
            display='flex'
            justifyContent='center'
            alignItems='center'
            fontWeight='600'
            fontSize='20px'
            background='white'
            borderRadius='full'
            border='1.4px solid transparent'
            _selected={{ border: '1.4px solid #8D0247', color: '#8D0247' }}
          >
            {t('postpaid')}
          </Tabs.Trigger>

          <Tabs.Indicator
            rounded='full'
            bg='#8D0247'
            opacity={0.1}
            border='1.4px solid #8D0247'
            transition='all 0.25s ease'
          />
        </Tabs.List>

        <Tabs.Content value='prepaid' mt='40px'>
          <Box
            w='100%'
            bg='white'
            borderRadius='40px'
            p={{ base: '24px', xl: '48px' }}
            boxShadow='0px 4px 20px rgba(0,0,0,0.06)'
          >
            <Grid
              templateColumns={{
                base: '1fr',
                md: '1fr 1fr',
                xl: 'repeat(4, 1fr)'
              }}
              gap={{ base: '24px', xl: '40px' }}
            >
              {plans.map((plan) => {
                const isSelected = selected === plan.id;
                const isHovering = hovered === plan.id;
                const active = isSelected || isHovering;

                return (
                  <Box
                    key={plan.id}
                    p='32px'
                    borderRadius='32px'
                    bg={active ? '#8D0247' : 'white'}
                    // border={active ? 'none' : '1px solid #D5D5D5'}
                    border='none'
                    cursor='pointer'
                    transition='0.3s'
                    position='relative'
                    overflow='hidden'
                    onClick={() => setSelected(plan.id)}
                    onMouseEnter={() => !isSelected && setHovered(plan.id)}
                    onMouseLeave={() => !isSelected && setHovered(null)}
                  >
                    {!isSelected && (
                      <Box
                        position='absolute'
                        inset='0'
                        opacity={isHovering ? 0.6 : 0.4}
                        transition='0.3s'
                        pointerEvents='none'
                        display='flex'
                        justifyContent='flex-end'
                        alignItems='center'
                      >
                        <PatternLine
                          style={{
                            height: '100%',
                            width: 'auto',
                            opacity: 1,
                            marginLeft: 'auto',
                            objectFit: 'contain'
                          }}
                        />
                      </Box>
                    )}

                    <VStack align='start' spacing='16px' position='relative' zIndex={2}>
                      <Box
                        bg={active ? 'whiteAlpha.300' : isHovering ? 'rgba(244,150,209,0.1)' : '#F1FBFF'}
                        color={active ? 'white' : '#1095C5'}
                        w={{ base: '160px', md: '180px', xl: '200px' }}
                        h={{ base: '50px', md: '55px', xl: '60px' }}
                        display='flex'
                        justifyContent='center'
                        alignItems='center'
                        gap='10px'
                        borderRadius='14px'
                        fontWeight='700'
                        fontSize={{ base: '20px', md: '22px', xl: '26px' }}
                        transition='0.3s'
                      >
                        <WifiSpeedIcon
                          style={{
                            width: '28px',
                            height: '28px',
                            color: active ? 'white' : '#0077C8',
                            fill: active ? 'white' : '#0077C8',
                            transition: '0.3s'
                          }}
                        />
                        {plan.speed}
                      </Box>

                      <Text
                        fontSize={{ base: '26px', md: '30px', xl: '32px' }}
                        fontWeight='800'
                        color={active ? 'white' : '#000'}
                      >
                        {plan.price}
                        <Text as='span' fontSize='26px' fontWeight='500' color={active ? 'white' : '#848199'}>
                          /{t('month')}
                        </Text>
                      </Text>

                      <Text
                        fontSize={{ base: '20px', md: '22px', xl: '24px' }}
                        fontWeight='600'
                        color={active ? 'white' : '#231D4F'}
                      >
                        {plan.title}
                      </Text>

                      <Text fontSize={{ base: '14px', md: '15px', xl: '16px' }} color={active ? 'white' : '#626262'}>
                        {plan.description}
                      </Text>

                      <VStack align='start' spacing='10px' mt='10px'>
                        {plan.features.map((item, idx) => (
                          <HStack key={idx} spacing='10px' gap={4}>
                            <TickNewIcon
                              size={36}
                              color={active ? 'white' : '#8D0247'}
                              style={{ transition: '0.3s' }}
                            />
                            <Text fontSize='18px' color={active ? 'white' : '#292929'}>
                              {item}
                            </Text>
                          </HStack>
                        ))}
                      </VStack>

                      <Button
                        mt='20px'
                        w='100%'
                        borderRadius='full'
                        h='65px'
                        fontWeight='600'
                        fontSize='20px'
                        bg={selected === plan.id ? 'white' : hovered === plan.id ? '#B01559' : 'rgba(244,150,209,0.1)'}
                        color={selected === plan.id ? '#8D0247' : hovered === plan.id ? 'white' : '#8D0247'}
                        transition='0.3s'
                      >
                        {t('choosePlan')}
                      </Button>
                    </VStack>
                  </Box>
                );
              })}
            </Grid>
          </Box>
          <Box w='100%' display='flex' justifyContent='center' mt='40px'>
            <Button
              borderRadius='full'
              px={{ base: '20px', md: '28px', xl: '32px' }}
              h={{ base: '55px', md: '60px', xl: '65px' }}
              bg='white'
              border='1px solid #474747'
              color='#474747'
              fontSize={{ base: '18px', md: '20px', xl: '22px' }}
              position='relative'
              pr={{ base: '60px', md: '70px', xl: '80px' }}
            >
              {t('viewAllPlans')}
              <Box
                position='absolute'
                right={{ base: '10px', md: '14px', xl: '20px' }}
                w={{ base: '40px', md: '50px', xl: '60px' }}
                h={{ base: '40px', md: '50px', xl: '60px' }}
                display='flex'
                justifyContent='center'
                alignItems='center'
              >
                <RightArrowIcon size={50} />
              </Box>
            </Button>
          </Box>
        </Tabs.Content>

        <Tabs.Content value='postpaid'>
          <Text textAlign='center'>Postpaid plans coming soon…</Text>
        </Tabs.Content>
      </Tabs.Root>
    </Box>
  );
}
