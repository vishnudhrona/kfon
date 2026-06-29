import { Box, Flex, HStack, SimpleGrid, Text, VStack } from '@kfonbss/bss-ui-components';

import { DIVS, PALETTE, SUBJECTS } from './data';
import { HeroCard, PageHeader, PageShell, SectionCard } from './shared';

const DivisionHero = ({ d }) => {
  const p = Math.round((d.closed / d.total) * 100);
  const gradient = `linear-gradient(135deg,${d.c}CC,${d.c})`;
  return <HeroCard label={d.div} value={`${p}%`} sub={`${d.closed}/${d.total} closed`} gradient={gradient} />;
};

const DivPerfCard = ({ d }) => {
  const p = Math.round((d.closed / d.total) * 100);
  return (
    <Box borderRadius='10px' p='14px 16px' bg='#FFFFFF' border='1px solid #E8EAF2'>
      <Flex justify='space-between' align='center' mb='10px'>
        <Box>
          <Text fontSize='13px' fontWeight='800' color={PALETTE.tx}>
            {d.div}
          </Text>
          <Text fontSize='10px' color={PALETTE.tx3} mt='2px'>
            {d.subj}
          </Text>
        </Box>
        <Text fontSize='22px' fontWeight='900' color={d.c}>
          {p}%
        </Text>
      </Flex>
      <SimpleGrid columns={3} gap='6px' mb='8px'>
        {[
          { v: d.closed, l: 'Closed', c: d.c },
          { v: d.total - d.closed, l: 'Pending', c: PALETTE.tx2 },
          { v: d.total, l: 'Total', c: PALETTE.tx }
        ].map((s) => (
          <Box
            key={s.l}
            bg={PALETTE.card}
            border='1px solid'
            borderColor={PALETTE.bdr}
            borderRadius='6px'
            p='6px 8px'
            textAlign='center'
          >
            <Text fontSize='16px' fontWeight='900' lineHeight='1' color={s.c}>
              {s.v}
            </Text>
            <Text fontSize='9px' textTransform='uppercase' letterSpacing='0.5px' color={PALETTE.tx3} mt='2px'>
              {s.l}
            </Text>
          </Box>
        ))}
      </SimpleGrid>
      <Box h='7px' bg='rgba(0,0,0,0.07)' borderRadius='4px' overflow='hidden'>
        <Box h='100%' w={`${p}%`} background={`linear-gradient(90deg,${d.c}99,${d.c})`} borderRadius='4px' />
      </Box>
    </Box>
  );
};

const RoutingRow = ({ s }) => (
  <HStack gap='10px' py='10px' borderBottom='1px solid' borderColor={PALETTE.bdr}>
    <Box w='8px' h='8px' borderRadius='50%' bg={s.c} flexShrink={0} />
    <Text fontSize='12px' fontWeight='700' color={PALETTE.tx} flex='1'>
      {s.label}
    </Text>
    <Text as='span' fontSize='11px' fontWeight='700' px='12px' py='4px' borderRadius='20px' bg={`${s.c}18`} color={s.c}>
      → {s.div}
    </Text>
  </HStack>
);

const DivisionSummaryTable = () => (
  <Box overflowX='auto'>
    <Box as='table' w='100%' borderCollapse='collapse' minW='680px'>
      <Box as='thead'>
        <Box as='tr' bg={PALETTE.mar}>
          {['Division', 'Subject Focus', 'Total', 'Closed', 'Pending', 'Close Rate'].map((h, i, arr) => (
            <Box
              as='th'
              key={h}
              p='9px 13px'
              textAlign='left'
              fontSize='10px'
              fontWeight='800'
              color='#fff'
              textTransform='uppercase'
              letterSpacing='0.6px'
              borderTopLeftRadius={i === 0 ? '8px' : undefined}
              borderTopRightRadius={i === arr.length - 1 ? '8px' : undefined}
            >
              {h}
            </Box>
          ))}
        </Box>
      </Box>
      <Box as='tbody'>
        {DIVS.map((d) => {
          const p = Math.round((d.closed / d.total) * 100);
          const pc = p >= 85 ? '#27AE60' : p >= 70 ? '#FF8C00' : '#C82020';
          const pb = p >= 85 ? '#D0F0DD' : p >= 70 ? '#FFE8C0' : '#FFD0D0';
          return (
            <Box as='tr' key={d.div} _hover={{ bg: '#f3f0fb' }}>
              <Box as='td' p='9px 13px' borderBottom='1px solid' borderColor={PALETTE.bdr}>
                <HStack gap='6px'>
                  <Box w='8px' h='8px' borderRadius='50%' bg={d.c} />
                  <Text fontSize='12px' fontWeight='700' color={PALETTE.tx}>
                    {d.div}
                  </Text>
                </HStack>
              </Box>
              <Box
                as='td'
                p='9px 13px'
                borderBottom='1px solid'
                borderColor={PALETTE.bdr}
                fontSize='12px'
                color={PALETTE.tx2}
              >
                {d.subj}
              </Box>
              <Box
                as='td'
                p='9px 13px'
                borderBottom='1px solid'
                borderColor={PALETTE.bdr}
                fontWeight='700'
                fontSize='12px'
                color={PALETTE.tx}
              >
                {d.total}
              </Box>
              <Box
                as='td'
                p='9px 13px'
                borderBottom='1px solid'
                borderColor={PALETTE.bdr}
                fontWeight='700'
                fontSize='12px'
                color='#27AE60'
              >
                {d.closed}
              </Box>
              <Box
                as='td'
                p='9px 13px'
                borderBottom='1px solid'
                borderColor={PALETTE.bdr}
                fontWeight='700'
                fontSize='12px'
                color='#C82020'
              >
                {d.total - d.closed}
              </Box>
              <Box as='td' p='9px 13px' borderBottom='1px solid' borderColor={PALETTE.bdr}>
                <Text
                  as='span'
                  display='inline-block'
                  bg={pb}
                  color={pc}
                  px='9px'
                  py='3px'
                  borderRadius='20px'
                  fontSize='11px'
                  fontWeight='800'
                >
                  {p}%
                </Text>
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  </Box>
);

const Divisions = () => {
  return (
    <PageShell>
      <PageHeader title='Division Report' subtitle='Team performance by division' />

      <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} gap='14px' mb='18px'>
        {DIVS.map((d) => (
          <DivisionHero key={d.div} d={d} />
        ))}
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, lg: 2 }} gap='14px' mb='16px'>
        <SectionCard title='Division Performance' mb='0'>
          <VStack align='stretch' gap='10px'>
            {DIVS.map((d) => (
              <DivPerfCard key={d.div} d={d} />
            ))}
          </VStack>
        </SectionCard>
        <SectionCard title='Subject → Division Routing' mb='0'>
          <VStack align='stretch' gap='0'>
            {SUBJECTS.map((s) => (
              <RoutingRow key={s.label} s={s} />
            ))}
          </VStack>
        </SectionCard>
      </SimpleGrid>

      <SectionCard title='Division Ticket Summary'>
        <DivisionSummaryTable />
      </SectionCard>
    </PageShell>
  );
};

export default Divisions;
