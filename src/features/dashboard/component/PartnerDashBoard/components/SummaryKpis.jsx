import { Box } from '@kfonbss/bss-ui-components';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { fetchPartnerSummaryCards } from '../action';
import { getPartnerSummaryCards } from '../selector';
import { KpiBox } from './shared';

const SummaryKpis = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const summaryCards = useSelector(getPartnerSummaryCards);

  useEffect(() => {
    dispatch(fetchPartnerSummaryCards());
  }, [dispatch]);

  const longPending = summaryCards?.longPendingNotOnboarded ?? '—';
  const linkDelayed = summaryCards?.linkDelayed ?? '—';
  const avgEndToEnd = summaryCards?.avgEndToEndDays != null ? `${summaryCards.avgEndToEndDays}d` : '—';
  const targetEndToEnd = t('dashboard.kpiTarget', {
    value: summaryCards?.targetEndToEndDays != null ? `${summaryCards.targetEndToEndDays}d` : '—'
  });

  return (
    <Box display='grid' gridTemplateColumns='repeat(3, 1fr)' gap='8px'>
      <KpiBox
        iconBg='#FFF0F4'
        valueColor='#FF5A7E'
        value={longPending}
        label={t('dashboard.kpiLongPending')}
        note={t('dashboard.kpiLongPendingNote')}
        icon={<Box fontSize='18px'>⏱</Box>}
      />
      <KpiBox
        iconBg='#FFF6EE'
        valueColor='#FF8C00'
        value={linkDelayed}
        label={t('dashboard.kpiLinkDelayed')}
        note={t('dashboard.kpiLinkDelayedNote')}
        icon={<Box fontSize='18px'>🔗</Box>}
      />
      <KpiBox
        iconBg='#EDFAF4'
        valueColor='#27AE60'
        value={avgEndToEnd}
        label={t('dashboard.kpiAvgEndToEnd')}
        note={targetEndToEnd}
        icon={<Box fontSize='18px'>📈</Box>}
      />
    </Box>
  );
};

export default SummaryKpis;
