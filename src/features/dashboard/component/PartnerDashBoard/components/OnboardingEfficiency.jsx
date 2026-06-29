import { Box, HStack, Text } from '@kfonbss/bss-ui-components';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { fetchPartnerOnboardingEfficiency } from '../action';
import { PERIOD_PARAM } from '../constants';
import { getPartnerOnboardingEfficiency } from '../selector';
import { Card } from './shared';

const EFF_COLORS = ['#00C8A8', '#4488FF', '#9B59B6', '#FF8C00', '#C0395A'];

const EfficiencyRow = ({ e }) => {
  const { t } = useTranslation();
  const pct = e.tgt ? Math.round((e.avg / e.tgt) * 100) : 0;
  const ok = typeof e.onTrack === 'boolean' ? e.onTrack : pct <= 80;
  return (
    <Box mb='11px'>
      <HStack justify='space-between' mb='3px'>
        <Text fontSize='14px' fontWeight='700' color='#1A1030'>
          {e.n}
        </Text>
        <Text fontSize='14px' fontWeight='800' color={ok ? '#27AE60' : '#FF5A7E'}>
          {e.avg}d
        </Text>
      </HStack>
      <Box h='8px' bg='#EDEAF5' borderRadius='4px' overflow='hidden'>
        <Box h='100%' w={`${Math.min(pct, 100)}%`} bg={e.c} borderRadius='4px' />
      </Box>
      <Text fontSize='12px' color='#9A90A8' mt='2px'>
        {ok ? t('dashboard.onTrack') : t('dashboard.delayed')} ·{' '}
        {t('dashboard.efficiencyNote', { avg: e.avg, tgt: e.tgt })}
      </Text>
    </Box>
  );
};

const OnboardingEfficiency = ({ period }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const efficiency = useSelector(getPartnerOnboardingEfficiency);

  useEffect(() => {
    dispatch(fetchPartnerOnboardingEfficiency({ period: PERIOD_PARAM[period] || undefined }));
  }, [dispatch, period]);

  const rows = useMemo(() => {
    const stages = (efficiency?.stages ?? []).map((s, i) => ({
      n: s.label,
      avg: s.avgDays,
      tgt: s.targetDays,
      onTrack: s.onTrack,
      c: EFF_COLORS[i % EFF_COLORS.length]
    }));
    if (efficiency && (efficiency.totalAvgDays != null || efficiency.totalTargetDays != null)) {
      stages.push({
        n: t('dashboard.endToEndTotal'),
        avg: efficiency.totalAvgDays,
        tgt: efficiency.totalTargetDays,
        onTrack: efficiency.totalOnTrack,
        c: '#C0395A'
      });
    }
    return stages;
  }, [efficiency, t]);

  return (
    <Card
      title={t('dashboard.onboardingEfficiency')}
      headerRight={
        <Box bg='#EDFCF9' color='#00C8A8' fontSize='12px' fontWeight='700' px='9px' py='3px' borderRadius='20px'>
          {t('dashboard.processSpeed')}
        </Box>
      }
      p='14px 16px'
    >
      {rows.length === 0 ? (
        <Text fontSize='13px' color='#9A90A8' py='8px'>
          {t('dashboard.noData')}
        </Text>
      ) : (
        rows.map((e) => <EfficiencyRow key={e.n} e={e} />)
      )}
    </Card>
  );
};

export default OnboardingEfficiency;
