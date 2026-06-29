import { Box, HStack, Text } from '@kfonbss/bss-ui-components';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { fetchPartnerStatCards } from '../action';
import { HERO_STATS, PERIOD_PARAM } from '../constants';
import { getPartnerStatCards } from '../selector';

// Format an int64 count for display; '—' when missing.
const fmtCount = (v) => (v == null ? '—' : Number(v).toLocaleString('en-IN'));

// Format the trend percentage with a leading sign, e.g. +15.2% / -3.0%.
const fmtTrend = (v) => {
  if (v == null) return null;
  const n = Number(v);
  return `${n > 0 ? '+' : ''}${n.toFixed(1)}%`;
};

const HeroStatCard = ({ label, value, sub, gradient }) => (
  <Box
    borderRadius='14px'
    p='18px 20px'
    color='#FFFFFF'
    position='relative'
    overflow='hidden'
    boxShadow='0 6px 20px rgba(0,0,0,0.13)'
    minH='108px'
    bgGradient={gradient.replace('linear-gradient(135deg,', 'linear(135deg,').replace(')', ')')}
    bg={gradient}
    transition='all 0.18s'
    _hover={{ transform: 'translateY(-3px)', boxShadow: '0 10px 28px rgba(0,0,0,0.18)' }}
  >
    <Box
      position='absolute'
      right='-22px'
      top='-22px'
      w='88px'
      h='88px'
      borderRadius='50%'
      bg='rgba(255,255,255,0.12)'
      pointerEvents='none'
    />
    <Box
      position='absolute'
      right='18px'
      bottom='-28px'
      w='60px'
      h='60px'
      borderRadius='50%'
      bg='rgba(255,255,255,0.07)'
      pointerEvents='none'
    />
    <Text
      fontSize='12px'
      fontWeight='800'
      letterSpacing='0.8px'
      textTransform='uppercase'
      opacity={0.82}
      mb='6px'
      position='relative'
      zIndex={1}
    >
      {label}
    </Text>
    <Text fontSize='38px' fontWeight='900' letterSpacing='-2px' lineHeight='1' mb='5px' position='relative' zIndex={1}>
      {value}
    </Text>
    <Text fontSize='13px' opacity={0.72} fontWeight='600' position='relative' zIndex={1}>
      {sub}
    </Text>
  </Box>
);

const HeroStats = ({ period, district, partnerType }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const statCards = useSelector(getPartnerStatCards);

  useEffect(() => {
    dispatch(
      fetchPartnerStatCards({
        period: PERIOD_PARAM[period] || undefined,
        district: district || undefined,
        type: partnerType || undefined
      })
    );
  }, [dispatch, period, district, partnerType]);

  const trend = fmtTrend(statCards?.totalEnquiriesTrendPct);

  return (
    <Box display='grid' gridTemplateColumns='230px 1fr' gap='12px' mb='16px'>
      <Box
        borderRadius='14px'
        p='22px 24px'
        color='#FFFFFF'
        display='flex'
        flexDirection='column'
        justifyContent='space-between'
        position='relative'
        overflow='hidden'
        boxShadow='0 6px 20px rgba(255,107,0,0.3)'
        bg='linear-gradient(135deg,#FF9800,#FF6B00)'
      >
        <Box
          position='absolute'
          right='-24px'
          top='-24px'
          w='110px'
          h='110px'
          borderRadius='50%'
          bg='rgba(255,255,255,0.1)'
          pointerEvents='none'
        />
        <Box
          position='absolute'
          left='-16px'
          bottom='-24px'
          w='80px'
          h='80px'
          borderRadius='50%'
          bg='rgba(255,255,255,0.06)'
          pointerEvents='none'
        />
        <Box position='relative' zIndex={1}>
          <Text
            fontSize='11px'
            fontWeight='800'
            letterSpacing='1px'
            textTransform='uppercase'
            color='rgba(255,255,255,0.55)'
            mb='6px'
          >
            {t('dashboard.brandTagline')}
          </Text>
          <Text fontSize='60px' fontWeight='900' letterSpacing='-3px' lineHeight='1'>
            {fmtCount(statCards?.totalEnquiries)}
          </Text>
          <Text fontSize='13px' color='rgba(255,255,255,0.5)' mt='5px'>
            {t('dashboard.totalEnquiries')}
            {trend ? ` · ● ${t('dashboard.trendThisPeriod', { trend })}` : ''}
          </Text>
        </Box>
        <HStack
          gap='7px'
          p='8px 13px'
          bg='rgba(255,255,255,0.12)'
          border='1px solid rgba(255,255,255,0.2)'
          borderRadius='8px'
          mt='14px'
          position='relative'
          zIndex={1}
        >
          <Box
            w='7px'
            h='7px'
            borderRadius='50%'
            bg='#4ADE80'
            boxShadow='0 0 0 2px rgba(74,222,128,0.28)'
            flexShrink={0}
          />
          <Text fontSize='13px' fontWeight='700' color='#FFFFFF'>
            {t('dashboard.activePartnersLive', { count: fmtCount(statCards?.activePartners) })}
          </Text>
        </HStack>
      </Box>

      <Box display='grid' gridTemplateColumns='repeat(3, 1fr)' gap='9px'>
        {HERO_STATS.map((s) => (
          <HeroStatCard
            key={s.key}
            label={t(s.labelKey)}
            sub={t(s.subKey)}
            gradient={s.gradient}
            value={fmtCount(statCards?.[s.key])}
          />
        ))}
      </Box>
    </Box>
  );
};

export default HeroStats;
