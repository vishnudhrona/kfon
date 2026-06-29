import { Box, HStack, Icons, Text, VStack } from '@kfonbss/bss-ui-components';
import { useTranslation } from 'react-i18next';

import CustodianTag from './CustodianTag';
import SectionLabel from './SectionLabel';
import StatusPill from './StatusPill';
import { AV_GRADIENTS, STATUS_COLORS, T, TYPE_COLORS } from './tokens';

const RequestQueue = ({ requestQueue, pendingCount }) => {
  const { t } = useTranslation();
  return (
    <Box bg={T.card} border={`1px solid ${T.line}`} borderRadius='14px' display='flex' flexDir='column' overflow='hidden'>
      <HStack px='18px' py='14px' justify='space-between' borderBottom={`1px solid ${T.line}`} bg={T.paper}>
        <HStack gap='11px'>
          <Box w='36px' h='36px' borderRadius='10px' bg={T.lavender} color='white' display='flex' alignItems='center' justifyContent='center' boxShadow='0 4px 10px rgba(0,0,0,0.1)' flexShrink={0}>
            <Icons.ClockOutline w='16px' h='16px' />
          </Box>
          <Box>
            <Text fontSize='lg' fontWeight='400' color={T.maroon800} letterSpacing='-0.3px'>{t('requestQueueTitle')}</Text>
            <Text fontSize='2xs' color={T.inkSoft} fontWeight='500' mt='3px'>{t('requestQueueMeta')}</Text>
          </Box>
        </HStack>
        <Box px='11px' py='4px' borderRadius='100px' border={`1px solid ${T.lavenderBorder}`} bg={T.lavenderSoft} color={T.lavenderDeep} fontSize='sm' fontWeight='400' letterSpacing='-0.2px'>
          {t('pendingCount', { count: pendingCount })}
        </Box>
      </HStack>
      <VStack gap='0' align='stretch' px='14px' py='6px' maxH='480px' overflowY='auto'>
        {(requestQueue ?? []).map((req) => {
          const st = STATUS_COLORS[req.status] ?? STATUS_COLORS.pend;
          return (
            <HStack
              key={req.id} gap='12px' align='center' px='6px' py='12px'
              borderBottom={`1px dashed ${T.line}`} cursor='pointer' transition='all 0.14s'
              _hover={{ bg: T.paper, borderRadius: '8px' }}
              _last={{ borderBottom: 'none' }}
            >
              <Box w='36px' h='36px' borderRadius='10px' bg={AV_GRADIENTS[req.colorClass % AV_GRADIENTS.length]} color='white' display='flex' alignItems='center' justifyContent='center' fontSize='xs' fontWeight='800' letterSpacing='-0.3px' flexShrink={0}>
                {req.initials}
              </Box>
              <Box flex='1' minW='0'>
                <HStack gap='8px' flexWrap='wrap'>
                  <Text fontSize='xs' fontWeight='700' color={T.ink} lineHeight='1.2'>{req.name}</Text>
                  <CustodianTag type={req.role} />
                </HStack>
                <Text fontSize='xs' color={T.inkSoft} mt='3px' fontWeight='500'>{req.device}</Text>
                <Text fontSize='2xs' color={T.inkFaint} mt='2px' letterSpacing='0.2px'>{req.time}</Text>
              </Box>
              <StatusPill bg={st.bg} color={st.color} border={st.border} label={st.label} />
            </HStack>
          );
        })}
      </VStack>
    </Box>
  );
};

const ActiveRoutes = ({ activeRoutes, inTransitCount }) => {
  const { t } = useTranslation();
  return (
    <Box bg={T.card} border={`1px solid ${T.line}`} borderRadius='14px' display='flex' flexDir='column' overflow='hidden'>
      <HStack px='18px' py='14px' justify='space-between' borderBottom={`1px solid ${T.line}`} bg={T.paper}>
        <HStack gap='11px'>
          <Box w='36px' h='36px' borderRadius='10px' bg={T.amber} color='white' display='flex' alignItems='center' justifyContent='center' boxShadow='0 4px 10px rgba(0,0,0,0.1)' flexShrink={0}>
            <Icons.RouteMapIcon w='16px' h='16px' />
          </Box>
          <Box>
            <Text fontSize='lg' fontWeight='400' color={T.maroon800} letterSpacing='-0.3px'>{t('activeRoutesTitle')}</Text>
            <Text fontSize='2xs' color={T.inkSoft} fontWeight='500' mt='3px'>{t('activeRoutesMeta')}</Text>
          </Box>
        </HStack>
        <Box px='11px' py='4px' borderRadius='100px' border={`1px solid ${T.amberBorder}`} bg={T.amberSoft} color={T.amberDeep} fontSize='sm' fontWeight='400' letterSpacing='-0.2px'>
          {t('inTransitCount', { count: inTransitCount })}
        </Box>
      </HStack>
      <VStack gap='0' align='stretch' px='14px' py='6px' maxH='480px' overflowY='auto'>
        {(activeRoutes ?? []).map((route) => {
          const typeColor = TYPE_COLORS[route.type] ?? T.slate;
          return (
            <Box
              key={route.id}
              display='flex' flexDir='column' gap='9px' px='6px' py='13px'
              borderBottom={`1px dashed ${T.line}`} cursor='pointer' transition='all 0.14s'
              _hover={{ bg: T.paper, borderRadius: '8px' }}
              _last={{ borderBottom: 'none' }}
            >
              <HStack justify='space-between' gap='8px'>
                <Box px='9px' py='3px' borderRadius='5px' bg={T.yellowBg} border={`1px solid ${T.yellowWarm}`} color={T.maroon700} fontSize='2xs' fontWeight='700' letterSpacing='0.3px'>
                  {route.id}
                </Box>
                <StatusPill bg={T.amberSoft} color={T.amberDeep} border={T.amberBorder} label={t('inTransit')} />
              </HStack>
              <HStack gap='9px' align='center'>
                <Box flex='1' minW='0'>
                  <Text fontSize='xs' fontWeight='700' color={T.ink} lineHeight='1.1' overflow='hidden' textOverflow='ellipsis' whiteSpace='nowrap'>{route.from}</Text>
                  <Text fontSize='2xs' color={T.inkFaint} fontWeight='600' mt='2px' letterSpacing='0.2px' textTransform='uppercase'>{route.fromSub}</Text>
                </Box>
                <Box flex='0 0 80px' position='relative' h='18px' display='flex' alignItems='center'>
                  <Box h='3px' w='100%' borderRadius='100px' overflow='hidden' style={{ background: `linear-gradient(90deg, ${T.amber}, ${T.mint})` }}>
                    <Box position='absolute' top='-2px' h='7px' style={{ width: '25%', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.85), transparent)', animation: 'shimmer 2s infinite' }} />
                  </Box>
                  <Box position='absolute' w='6px' h='6px' borderRadius='50%' top='50%' left='0' transform='translate(-50%,-50%)' bg={T.mint} boxShadow={`0 0 0 3px ${T.card}`} />
                  <Box position='absolute' w='6px' h='6px' borderRadius='50%' top='50%' right='0' transform='translate(50%,-50%)' bg={T.rose} boxShadow={`0 0 0 3px ${T.card}`} />
                </Box>
                <Box flex='1' minW='0' textAlign='right'>
                  <Text fontSize='xs' fontWeight='700' color={T.ink} lineHeight='1.1' overflow='hidden' textOverflow='ellipsis' whiteSpace='nowrap'>{route.to}</Text>
                  <Text fontSize='2xs' color={T.inkFaint} fontWeight='600' mt='2px' letterSpacing='0.2px' textTransform='uppercase'>{route.toSub}</Text>
                </Box>
              </HStack>
              <HStack justify='space-between' fontSize='2xs' pt='7px' borderTop={`1px dotted ${T.line}`} color={T.inkSoft}>
                <Text>
                  <Text as='strong' color={T.ink}>{route.devices}</Text>{' '}devices · {route.type}
                </Text>
                <HStack gap='5px'>
                  <Box flex='1' w='60px' h='3px' bg={T.lineSoft} borderRadius='100px' overflow='hidden'>
                    <Box h='100%' w={`${route.progress}%`} bg={typeColor} borderRadius='100px' />
                  </Box>
                  <Text fontWeight='700'>{route.progress}%</Text>
                </HStack>
              </HStack>
            </Box>
          );
        })}
      </VStack>
    </Box>
  );
};

const LiveOperations = ({ requestQueue, activeRoutes, requestPipeline }) => {
  const { t } = useTranslation();
  const pendingCount = requestPipeline?.pendingApproval ?? 0;
  const inTransitCount = requestPipeline?.approved ?? 0;

  return (
    <>
      <SectionLabel badge='E' title={t('liveOperations')} meta={t('liveOperationsMeta')} />
      <Box display='grid' gridTemplateColumns='1fr 1fr' gap='14px'>
        <RequestQueue requestQueue={requestQueue} pendingCount={pendingCount} />
        <ActiveRoutes activeRoutes={activeRoutes} inTransitCount={inTransitCount} />
      </Box>
    </>
  );
};

export default LiveOperations;
