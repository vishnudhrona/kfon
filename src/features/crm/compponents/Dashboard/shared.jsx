import { Box, Button, Flex, HStack, SimpleGrid, Text } from '@kfonbss/bss-ui-components';

import { HERO_GRADIENTS, PALETTE, STATUS_PILL } from './data';

export const PageShell = ({ children }) => (
  <Box
    bg={PALETTE.bg}
    minH='100%'
    px={{ base: 4, md: 6 }}
    py={5}
    color={PALETTE.tx}
  >
    {children}
  </Box>
);

export const PageHeader = ({ title, subtitle, right }) => (
  <Flex
    justify='space-between'
    align='center'
    bg={PALETTE.card}
    border='1px solid'
    borderColor={PALETTE.bdr}
    borderRadius='14px'
    px={5}
    py={3}
    mb={5}
    boxShadow='0 2px 10px rgba(0,0,0,0.06)'
  >
    <Box>
      <Text fontSize='17px' fontWeight='800' letterSpacing='-0.2px' color={PALETTE.tx}>
        {title}
      </Text>
      {subtitle && (
        <Text fontSize='11px' color={PALETTE.tx3} mt='1px'>
          {subtitle}
        </Text>
      )}
    </Box>
    {right}
  </Flex>
);

export const PeriodTabs = ({ value, onChange }) => {
  const tabs = [
    { id: 'today', label: 'Today' },
    { id: 'week', label: 'This Week' },
    { id: 'month', label: 'This Month' }
  ];
  return (
    <HStack bg='#F0F2FF' borderRadius='8px' p='3px' gap='2px'>
      {tabs.map((tab) => {
        const active = value === tab.id;
        return (
          <Button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            px='14px'
            py='5px'
            h='auto'
            minW='unset'
            borderRadius='6px'
            fontSize='11px'
            fontWeight='700'
            bg={active ? PALETTE.mar : 'transparent'}
            color={active ? '#fff' : PALETTE.tx2}
            _hover={{ bg: active ? PALETTE.mar2 : 'rgba(122,28,46,0.08)' }}
            border='none'
          >
            {tab.label}
          </Button>
        );
      })}
    </HStack>
  );
};

export const HeroCard = ({ label, value, sub, gradient }) => (
  <Box
    borderRadius='14px'
    p='20px 22px'
    color='#fff'
    position='relative'
    overflow='hidden'
    minH='115px'
    background={gradient}
    boxShadow='0 6px 24px rgba(0,0,0,0.15)'
    transition='transform 0.18s, box-shadow 0.18s'
    _hover={{ transform: 'translateY(-3px)', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}
  >
    <Box
      position='absolute'
      right='-28px'
      top='-28px'
      w='110px'
      h='110px'
      borderRadius='50%'
      bg='rgba(255,255,255,0.13)'
      pointerEvents='none'
    />
    <Box
      position='absolute'
      right='20px'
      bottom='-30px'
      w='70px'
      h='70px'
      borderRadius='50%'
      bg='rgba(255,255,255,0.08)'
      pointerEvents='none'
    />
    <Text
      fontSize='10px'
      fontWeight='800'
      letterSpacing='0.9px'
      textTransform='uppercase'
      opacity={0.85}
      mb='6px'
      position='relative'
      zIndex={1}
    >
      {label}
    </Text>
    <Text
      fontSize='36px'
      fontWeight='900'
      letterSpacing='-2px'
      lineHeight='1'
      mb='5px'
      position='relative'
      zIndex={1}
    >
      {typeof value === 'number' ? value.toLocaleString() : value}
    </Text>
    <Text fontSize='11px' opacity={0.78} fontWeight='600' position='relative' zIndex={1}>
      {sub}
    </Text>
  </Box>
);

export const HeroGrid = ({ items }) => (
  <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} gap='14px' mb='18px'>
    {items.map((it, i) => (
      <HeroCard
        key={it.label}
        label={it.label}
        value={it.value}
        sub={it.sub}
        gradient={it.gradient || HERO_GRADIENTS[i % HERO_GRADIENTS.length]}
      />
    ))}
  </SimpleGrid>
);

// eslint-disable-next-line react-refresh/only-export-components
export const buildPeriodHeroes = (d) => [
  { label: 'Total Tickets', value: d.total, sub: 'All received' },
  { label: 'Open', value: d.open, sub: 'Awaiting action' },
  { label: 'Processing', value: d.processing, sub: 'Being handled' },
  { label: 'Closed', value: d.closed, sub: 'Resolved' }
];

export const SectionCard = ({ title, badge, children, mb = '16px', ...rest }) => (
  <Box
    bg={PALETTE.card}
    borderRadius='14px'
    border='1px solid'
    borderColor={PALETTE.bdr}
    p='18px 20px'
    boxShadow='0 2px 10px rgba(0,0,0,0.06)'
    mb={mb}
    {...rest}
  >
    <Flex align='center' justify='space-between' mb='16px'>
      <Text fontSize='13px' fontWeight='800' letterSpacing='-0.1px' color={PALETTE.tx}>
        {title}
      </Text>
      {badge}
    </Flex>
    {children}
  </Box>
);

export const SectionBadge = ({ label, bg = '#EFF5FF', color = '#2255CC' }) => (
  <Text
    as='span'
    fontSize='10px'
    fontWeight='700'
    px='9px'
    py='3px'
    borderRadius='20px'
    bg={bg}
    color={color}
  >
    {label}
  </Text>
);

export const StatusPill = ({ status }) => {
  const cfg = STATUS_PILL[status] || STATUS_PILL.Open;
  return (
    <Box
      as='span'
      display='inline-flex'
      alignItems='center'
      gap='4px'
      px='9px'
      py='3px'
      borderRadius='20px'
      fontSize='10px'
      fontWeight='800'
      bg={cfg.bg}
      color={cfg.color}
    >
      <Box as='span' w='5px' h='5px' borderRadius='50%' bg={cfg.dot} />
      {status}
    </Box>
  );
};
