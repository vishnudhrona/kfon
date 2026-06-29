import { Box, Text } from '@kfonbss/bss-ui-components';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { fetchPartnerLongPendingNotOnboarded } from '../action';
import { getPartnerLongPendingNotOnboarded } from '../selector';
import { Card, DelayRow } from './shared';

const LongPendingNotOnboarded = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const data = useSelector(getPartnerLongPendingNotOnboarded);

  useEffect(() => {
    dispatch(fetchPartnerLongPendingNotOnboarded());
  }, [dispatch]);

  const rows = (data?.content ?? []).map((r) => ({
    id: r.trackingId || r.enquiryId,
    name: r.partnerName,
    dist: r.district,
    days: r.ageDays,
    stage: r.stage || t('dashboard.stageNotOnboarded')
  }));

  return (
    <Card
      title={t('dashboard.longPendingNotOnboarded')}
      headerRight={
        <Box bg='#FFF2F2' color='#C82020' fontSize='12px' fontWeight='700' px='9px' py='3px' borderRadius='20px'>
          {t('dashboard.action')}
        </Box>
      }
      p='14px 16px'
    >
      {rows.length === 0 ? (
        <Text fontSize='13px' color='#9A90A8' py='8px'>
          {t('dashboard.nothingPending')}
        </Text>
      ) : (
        <Box maxH='320px' overflowY='auto' pr='4px'>
          {rows.map((d, i) => (
            <DelayRow key={d.id || i} d={d} accent='#E53070' />
          ))}
        </Box>
      )}
    </Card>
  );
};

export default LongPendingNotOnboarded;
