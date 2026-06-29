import { Box, HStack, Icons, Text, VStack } from '@kfonbss/bss-ui-components';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import KeralaMap from './KeralaMap';
import SectionLabel from './SectionLabel';
import { T } from './tokens';

const GEO_MODES = ['total', 'inuse', 'damage'];

const KeralaTreemap = ({ districtBreakdown }) => {
  const { t } = useTranslation();
  const [selected, setSelected] = useState(0);
  const [geoMode, setGeoMode] = useState('total');

  const districts = districtBreakdown ?? [];
  const selDistrict = districts[selected] ?? {};
  const totalUnits = districts.reduce((s, d) => s + (d.total ?? 0), 0);
  const topDistrict = districts[0]?.abbr ?? '—';

  return (
    <>
      <SectionLabel badge='F' title={t('keralaStockTreemap')} meta={t('keralaTreemapMeta')} />
      <Box bg={T.card} border={`1px solid ${T.line}`} borderRadius='14px' overflow='hidden'>
        {/* Header */}
        <Box
          borderBottom={`1px solid ${T.line}`}
          bg={T.paper}
          display='grid'
          gridTemplateColumns='auto 1fr auto'
          gap='18px'
          alignItems='center'
          p='18px 22px 16px'
        >
          <HStack gap='14px'>
            <Box
              w='48px'
              h='48px'
              borderRadius='12px'
              bg={`linear-gradient(135deg, ${T.maroon700}, ${T.maroon900})`}
              color={T.yellow}
              display='flex'
              alignItems='center'
              justifyContent='center'
              flexShrink={0}
              boxShadow='0 6px 16px rgba(74,15,42,0.25)'
            >
              <Icons.Location w='24px' h='24px' />
            </Box>
            <Box>
              <Text
                fontSize='9px'
                fontWeight='800'
                letterSpacing='1.6px'
                textTransform='uppercase'
                color={T.maroon700}
                mb='3px'
              >
                {t('treemapHeaderMeta')}
              </Text>
              <Text
                fontSize='22px'
                fontWeight='400'
                color={T.maroon800}
                letterSpacing='-0.4px'
                lineHeight='1'
              >
                {t('geographicAtlas')}
              </Text>
              <Text fontSize='11px' color={T.inkSoft} mt='4px' fontWeight='500'>
                {t('treemapSubtitle')}
              </Text>
            </Box>
          </HStack>
          <HStack
            gap='24px'
            px='18px'
            borderLeft={`1px solid ${T.line}`}
            borderRight={`1px solid ${T.line}`}
            alignSelf='stretch'
            align='center'
          >
            {[
              { label: t('totalUnits'), val: totalUnits.toLocaleString() },
              { label: 'Top District', val: topDistrict }
            ].map((m) => (
              <Box key={m.label}>
                <Text
                  fontSize='8.5px'
                  fontWeight='800'
                  letterSpacing='1px'
                  textTransform='uppercase'
                  color={T.inkFaint}
                >
                  {m.label}
                </Text>
                <Text
                  fontSize='22px'
                  fontWeight='400'
                  color={T.maroon800}
                  letterSpacing='-0.4px'
                  lineHeight='1'
                >
                  {m.val}
                </Text>
              </Box>
            ))}
          </HStack>
          <HStack bg={T.paper} border={`1px solid ${T.line}`} borderRadius='8px' p='3px' gap='1px'>
            {GEO_MODES.map((mode) => (
              <Box
                key={mode}
                as='button'
                px='13px'
                py='6px'
                borderRadius='5px'
                fontSize='10.5px'
                fontWeight='700'
                cursor='pointer'
                border='none'
                transition='all 0.15s'
                color={geoMode === mode ? T.card : T.inkSoft}
                bg={geoMode === mode ? T.maroon700 : 'transparent'}
                onClick={() => setGeoMode(mode)}
                style={{ textTransform: 'capitalize' }}
              >
                {mode === 'inuse' ? t('inUse') : mode === 'damage' ? t('faulty') : t('totalUnits')}
              </Box>
            ))}
          </HStack>
        </Box>

        {/* Body */}
        <Box display='grid' gridTemplateColumns='1.4fr 1fr' gap='18px' p='20px'>
          {/* Kerala Map */}
          <Box
            position='relative'
            borderRadius='10px'
            overflow='hidden'
            bg={T.paper}
            border={`1px solid ${T.line}`}
            maxH='550px'
            display='flex'
            alignItems='stretch'
          >
            <KeralaMap
              districts={Array.isArray(districts) ? districts : []}
              selectedIdx={selected}
              onSelect={setSelected}
              geoMode={geoMode}
            />
            {/* Legend */}
            <Box position='absolute' bottom='12px' left='12px' display='flex' flexDir='column' gap='4px'>
              <Box
                w='80px'
                h='8px'
                borderRadius='4px'
                style={{
                  background:
                    geoMode === 'total'
                      ? 'linear-gradient(to right, #f9e8ef, #3d0822)'
                      : geoMode === 'inuse'
                        ? 'linear-gradient(to right, #d1fae5, #065f46)'
                        : 'linear-gradient(to right, #fee2e2, #7f1d1d)'
                }}
              />
              <Box display='flex' justifyContent='space-between'>
                <Text fontSize='8px' color={T.inkSoft} fontWeight='600'>
                  {t('low')}
                </Text>
                <Text fontSize='8px' color={T.inkSoft} fontWeight='600'>
                  {t('high')}
                </Text>
              </Box>
            </Box>
          </Box>

          {/* Detail panel */}
          <VStack gap='14px'>
            <Box
              p='18px 20px'
              borderRadius='12px'
              color='white'
              position='relative'
              overflow='hidden'
              bg={`linear-gradient(135deg, ${T.maroon700} 0%, ${T.maroon800} 100%)`}
            >
              <Box
                position='absolute'
                right='-50px'
                top='-50px'
                w='170px'
                h='170px'
                borderRadius='50%'
                style={{ background: 'radial-gradient(circle, rgba(255,213,87,0.2), transparent 65%)' }}
              />
              <HStack justify='space-between' position='relative' zIndex={1} gap='12px' align='flex-start'>
                <Box>
                  <Text
                    fontSize='9px'
                    fontWeight='800'
                    letterSpacing='1.4px'
                    textTransform='uppercase'
                    color={T.yellow}
                    mb='5px'
                  >
                    {t('selectedLabel')}
                  </Text>
                  <Text
                    fontSize='24px'
                    fontWeight='400'
                    letterSpacing='-0.5px'
                    lineHeight='1'
                  >
                    {selDistrict.name ?? '—'}
                  </Text>
                  <Text fontSize='10.5px' color='rgba(255,255,255,0.7)' mt='4px' fontWeight='500' letterSpacing='0.2px'>
                    {selDistrict.abbr} · Rank {selDistrict.rank}
                  </Text>
                </Box>
                <Text
                  fontSize='42px'
                  fontWeight='400'
                  letterSpacing='-1.5px'
                  lineHeight='1'
                  color={T.yellow}
                  textAlign='right'
                >
                  {(selDistrict.total ?? 0).toLocaleString()}
                </Text>
              </HStack>
              <Box
                display='grid'
                gridTemplateColumns='repeat(4,1fr)'
                mt='14px'
                pt='14px'
                borderTop='1px dashed rgba(255,255,255,0.25)'
                position='relative'
                zIndex={1}
              >
                {[
                  { labelKey: 'inUse', val: selDistrict.inUse ?? 0 },
                  {
                    labelKey: 'notInUse',
                    val:
                      (selDistrict.total ?? 0) - (selDistrict.inUse ?? 0) - Math.round((selDistrict.total ?? 0) * 0.05)
                  },
                  { labelKey: 'faulty', val: Math.round((selDistrict.total ?? 0) * 0.05) },
                  { labelKey: 'inTransit', val: Math.round((selDistrict.total ?? 0) * 0.03) }
                ].map((cell, ci) => (
                  <Box
                    key={cell.labelKey}
                    px='10px'
                    borderRight={ci < 3 ? '1px dotted rgba(255,255,255,0.18)' : 'none'}
                    pl={ci === 0 ? '0' : undefined}
                    pr={ci === 3 ? '0' : undefined}
                  >
                    <Text
                      fontSize='8.5px'
                      fontWeight='800'
                      letterSpacing='0.7px'
                      textTransform='uppercase'
                      color='rgba(255,213,87,0.7)'
                    >
                      {t(cell.labelKey)}
                    </Text>
                    <Text
                      fontSize='20px'
                      fontWeight='400'
                      letterSpacing='-0.4px'
                      color='white'
                      mt='3px'
                    >
                      {cell.val.toLocaleString()}
                    </Text>
                  </Box>
                ))}
              </Box>
            </Box>

            {/* District list */}
            <Box>
              <HStack justify='space-between' pb='8px' borderBottom={`1px solid ${T.line}`} mb='2px'>
                <Text
                  fontSize='9.5px'
                  fontWeight='800'
                  letterSpacing='1.2px'
                  textTransform='uppercase'
                  color={T.inkSoft}
                >
                  {t('allDistricts')}
                </Text>
                <Text
                  fontSize='9.5px'
                  fontWeight='800'
                  letterSpacing='1.2px'
                  textTransform='uppercase'
                  color={T.inkSoft}
                >
                  {t('units')}
                </Text>
              </HStack>
              <VStack gap='0' align='stretch' maxH='240px' overflowY='auto'>
                {districts.map((d, i) => (
                  <HStack
                    key={d.abbr ?? i}
                    gap='11px'
                    align='center'
                    p='11px 4px'
                    borderBottom={i < districts.length - 1 ? `1px dashed ${T.line}` : 'none'}
                    cursor='pointer'
                    transition='all 0.12s'
                    _hover={{ bg: T.paper }}
                    onClick={() => setSelected(i)}
                  >
                    <Box w='10px' h='10px' borderRadius='50%' bg={T.maroon700} flexShrink={0} />
                    <Box flex='1' minW='0'>
                      <Text
                        fontSize='11.5px'
                        fontWeight='700'
                        color={selected === i ? T.maroon800 : T.ink}
                        lineHeight='1.1'
                      >
                        {d.name}
                      </Text>
                      <Text fontSize='9.5px' color={T.inkFaint} mt='2px' letterSpacing='0.2px' fontWeight='600'>
                        {d.abbr}
                      </Text>
                    </Box>
                    <Text
                      fontSize='18px'
                      fontWeight='400'
                      color={T.maroon800}
                      letterSpacing='-0.3px'
                    >
                      {(d.total ?? 0).toLocaleString()}
                    </Text>
                    <Box
                      px='8px'
                      py='3px'
                      borderRadius='100px'
                      bg={T.mintSoft}
                      color={T.mintDeep}
                      border={`1px solid ${T.mintBorder}`}
                      fontSize='9.5px'
                      fontWeight='800'
                      minW='48px'
                      textAlign='center'
                    >
                      {d.total ? Math.round((d.inUse / d.total) * 100) : 0}%
                    </Box>
                  </HStack>
                ))}
              </VStack>
            </Box>
          </VStack>
        </Box>
      </Box>
    </>
  );
};

export default KeralaTreemap;
