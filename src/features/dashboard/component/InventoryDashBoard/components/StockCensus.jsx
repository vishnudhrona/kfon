import { Box, HStack, Icons, Text } from '@kfonbss/bss-ui-components';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { CENSUS_TYPE_META } from '../constants';
import SectionLabel from './SectionLabel';
import { SHADOWS, T } from './tokens';

const CensusCard = ({ item, isActive, onClick }) => (
  <Box
    bg={T.card}
    border={`1px solid ${isActive ? T.maroon700 : T.line}`}
    borderRadius='12px'
    p='12px 14px'
    position='relative'
    overflow='hidden'
    cursor='pointer'
    transition='all 0.18s'
    minH='126px'
    display='flex'
    flexDir='column'
    gap='2px'
    boxShadow={isActive ? '0 8px 22px -8px rgba(107,26,61,0.2)' : SHADOWS.base}
    _hover={{ transform: 'translateY(-2px)', boxShadow: SHADOWS.hover }}
    onClick={onClick}
  >
    {isActive && <Box position='absolute' top='0' left='0' right='0' h='3px' bg={T.maroon700} />}
    <HStack gap='9px' position='relative' zIndex={2}>
      <Box
        w='30px'
        h='30px'
        borderRadius='8px'
        bg={item.color}
        color='white'
        display='flex'
        alignItems='center'
        justifyContent='center'
        boxShadow='0 3px 8px rgba(0,0,0,0.1)'
        flexShrink={0}
      >
        <Icons.RouterIcon w='14px' h='14px' />
      </Box>
      <Box flex='1' minW='0'>
        <Text
          fontSize='xs'
          fontWeight='800'
          color={T.ink}
          letterSpacing='0.3px'
          textTransform='uppercase'
          lineHeight='1'
        >
          {item.label}
        </Text>
        <Text fontSize='2xs' color={T.inkSoft} fontWeight='500' lineHeight='1' mt='2px'>
          {item.sub}
        </Text>
      </Box>
      {isActive && (
        <Box
          fontSize='2xs'
          fontWeight='800'
          letterSpacing='0.5px'
          color={T.maroon700}
          bg={T.yellowBg}
          border={`1px solid ${T.yellowWarm}`}
          px='5px'
          py='2px'
          borderRadius='3px'
          textTransform='uppercase'
          whiteSpace='nowrap'
        >
          LIVE
        </Box>
      )}
    </HStack>
    <Text
      fontSize='xl'
      fontWeight='400'
      color={T.ink}
      letterSpacing='-0.6px'
      lineHeight='1'
      mt='6px'
      position='relative'
      zIndex={2}
    >
      {item.val.toLocaleString()}
      <Text
        as='span'
        fontSize='xs'
        color={T.maroon700}
        ml='3px'
        opacity={0.75}
        fontWeight='600'
      >
        {' '}
        units
      </Text>
    </Text>
    <HStack mt='auto' pt='5px' gap='5px' align='center' position='relative' zIndex={2}>
      <Box
        fontSize='2xs'
        fontWeight='800'
        letterSpacing='0.4px'
        px='5px'
        py='2px'
        borderRadius='3px'
        textTransform='uppercase'
        bg={T.yellowBg}
        color={T.maroon800}
        border={`1px solid ${T.yellowWarm}`}
      >
        {item.share}% share
      </Box>
    </HStack>
    <Box position='absolute' bottom='0' left='0' right='0' h='24px' opacity={0.35} pointerEvents='none'>
      <svg width='100%' height='100%' preserveAspectRatio='none' viewBox='0 0 200 24'>
        <path d='M0 12 Q50 0 100 12 Q150 24 200 12 L200 24 L0 24Z' fill={item.color} />
      </svg>
    </Box>
  </Box>
);

const TotalStockCard = ({ total, assetValue, period }) => {
  const { t } = useTranslation();
  return (
    <Box
      borderRadius='14px'
      border={`1px solid ${T.yellowWarm}`}
      boxShadow='0 6px 22px -10px rgba(255,213,87,0.55)'
      p='18px 16px'
      display='flex'
      flexDir='column'
      position='relative'
      overflow='hidden'
      cursor='pointer'
      transition='all 0.25s'
      _hover={{ transform: 'translateY(-2px)', boxShadow: '0 10px 26px -8px rgba(255,213,87,0.55)' }}
      style={{
        background:
          'radial-gradient(circle at 100% 0%, rgba(255,213,87,0.32) 0%, transparent 55%), radial-gradient(circle at 0% 100%, rgba(255,213,87,0.2) 0%, transparent 55%), linear-gradient(160deg, #fffbea 0%, #fff5d1 100%)'
      }}
    >
      <Box
        position='absolute'
        top='-40px'
        right='-30px'
        w='130px'
        h='130px'
        borderRadius='50%'
        style={{ background: 'radial-gradient(circle, rgba(255,213,87,0.4) 0%, transparent 70%)' }}
        pointerEvents='none'
      />
      <Box
        position='absolute'
        bottom='-30px'
        left='-20px'
        w='100px'
        h='100px'
        borderRadius='50%'
        style={{ background: 'radial-gradient(circle, rgba(255,213,87,0.25) 0%, transparent 70%)' }}
        pointerEvents='none'
      />

      <HStack gap='10px' pb='14px' borderBottom={`1px solid ${T.yellowWarm}`} position='relative' zIndex={2}>
        <Box
          w='36px'
          h='36px'
          borderRadius='10px'
          bg='linear-gradient(135deg, #ffd557, #f5b93b)'
          color={T.maroon800}
          display='flex'
          alignItems='center'
          justifyContent='center'
          flexShrink={0}
          boxShadow='0 4px 12px rgba(255,213,87,0.4)'
        >
          <Icons.PackageIcon w='18px' h='18px' />
        </Box>
        <Box flex='1' minW='0'>
          <Text
            fontSize='xs'
            fontWeight='800'
            color={T.maroon800}
            letterSpacing='0.4px'
            textTransform='uppercase'
            lineHeight='1'
          >
            {t('totalStock')}
          </Text>
          <Text fontSize='2xs' color={T.maroon700} fontWeight='600' mt='3px' letterSpacing='0.2px'>
            {t('totalStockMeta')}
          </Text>
        </Box>
      </HStack>

      <Box
        flex='1'
        display='flex'
        flexDir='column'
        justifyContent='center'
        alignItems='center'
        py='18px'
        position='relative'
        zIndex={2}
        textAlign='center'
      >
        <Text
          fontSize='2xs'
          fontWeight='800'
          letterSpacing='1.4px'
          textTransform='uppercase'
          color={T.amberDeep}
          opacity={0.85}
          mb='10px'
        >
          {t('inventoryCensus')}
        </Text>
        <Text
          fontSize='3xl'
          fontWeight='400'
          color={T.maroon800}
          lineHeight='1'
          letterSpacing='-0.9px'
        >
          {total.toLocaleString()}
          <Text
            as='span'
            fontSize='xs'
            color={T.maroon700}
            opacity={0.75}
            ml='3px'
            fontWeight='600'
          >
            {' '}
            units
          </Text>
        </Text>
        <Box
          fontSize='2xs'
          fontWeight='800'
          letterSpacing='0.8px'
          color={T.amberDeep}
          textTransform='uppercase'
          bg='rgba(255,255,255,0.65)'
          px='9px'
          py='3px'
          borderRadius='100px'
          border={`1px solid ${T.yellowWarm}`}
          mt='12px'
          display='inline-block'
        >
          {period}
        </Box>
      </Box>

      <Box
        bg='rgba(255,255,255,0.7)'
        p='11px 14px'
        borderRadius='10px'
        border={`1px solid ${T.yellowWarm}`}
        position='relative'
        zIndex={2}
      >
        <Text
          fontSize='2xs'
          fontWeight='800'
          letterSpacing='0.8px'
          textTransform='uppercase'
          color={T.amberDeep}
          opacity={0.85}
        >
          {t('assetValue')}
        </Text>
        <Text
          fontSize='lg'
          fontWeight='400'
          color={T.amberDeep}
          letterSpacing='-0.3px'
          lineHeight='1'
          mt='2px'
        >
          <Text as='span' fontSize='xs' opacity={0.75} fontWeight='600'>
            ₹
          </Text>
          {assetValue}
          <Text as='span' fontSize='xs' opacity={0.75} ml='2px' fontWeight='600'>
            {' '}
            {t('crSuffix')}
          </Text>
        </Text>
      </Box>
    </Box>
  );
};

const StockCensus = ({ summaryCards, stockTypeCount, vendorStock, assetValue }) => {
  const { t } = useTranslation();
  const [view, setView] = useState('type');
  const [activeKey, setActiveKey] = useState(null);

  const total = summaryCards.find((c) => c.id === 'total_devices')?.value ?? 0;

  const typeItems = stockTypeCount.map((item) => {
    const label = item.type ?? item.title ?? item.deviceType ?? '';
    const val = item.total ?? item.count ?? 0;
    const meta = CENSUS_TYPE_META[label] ?? {};
    return {
      key: label,
      label,
      sub: meta.sub ?? '',
      color: T[meta.colorKey] ?? T.slate,
      val,
      share: item.share ?? Math.round((val / (total || 1)) * 100)
    };
  });

  const vendorItems = (vendorStock ?? []).map((v) => ({
    key: v.name,
    label: v.name,
    sub: v.sub ?? '',
    color: v.color ?? T.slate,
    val: v.total,
    share: v.share ?? 0
  }));

  const items = view === 'type' ? typeItems : vendorItems;

  return (
    <>
      <SectionLabel
        badge='A'
        title={t('stockCensus')}
        meta={`${t('stockCensusMeta')} ${view === 'type' ? t('byType').toLowerCase() : t('byVendor').toLowerCase()}`}
        right={
          <HStack bg={T.card} border={`1px solid ${T.line}`} borderRadius='8px' p='3px' gap='1px'>
            {['type', 'vendor'].map((v) => (
              <Box
                key={v}
                as='button'
                px='14px'
                py='5px'
                borderRadius='5px'
                fontSize='2xs'
                fontWeight='700'
                cursor='pointer'
                border='none'
                color={view === v ? T.card : T.inkSoft}
                bg={view === v ? T.maroon700 : 'transparent'}
                boxShadow={view === v ? '0 1px 3px rgba(74,15,42,0.15)' : 'none'}
                transition='all 0.15s'
                onClick={() => {
                  setView(v);
                  setActiveKey(null);
                }}
                style={{ letterSpacing: '0.3px' }}
              >
                {v === 'type' ? t('byType') : t('byVendor')}
              </Box>
            ))}
          </HStack>
        }
      />
      <Box display='grid' gridTemplateColumns='minmax(0,1fr) 230px' gap='14px' alignItems='stretch'>
        <Box display='grid' gridTemplateColumns='repeat(4,1fr)' gridTemplateRows='1fr 1fr' gap='10px'>
          {items.map((item) => (
            <CensusCard
              key={item.key}
              item={item}
              isActive={activeKey === item.key}
              onClick={() => setActiveKey(activeKey === item.key ? null : item.key)}
            />
          ))}
        </Box>
        <TotalStockCard total={total} assetValue={assetValue?.value ?? '—'} period={assetValue?.period ?? '—'} />
      </Box>
    </>
  );
};

export default StockCensus;
