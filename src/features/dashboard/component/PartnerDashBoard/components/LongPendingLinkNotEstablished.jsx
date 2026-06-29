import { Box, Text } from '@kfonbss/bss-ui-components';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { fetchPartnerLongPendingLinkNotEstablished } from '../action';
import { getPartnerLongPendingLinkNotEstablished } from '../selector';
import { Card, DelayRow } from './shared';

const LongPendingLinkNotEstablished = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const data = useSelector(getPartnerLongPendingLinkNotEstablished);

  useEffect(() => {
    dispatch(fetchPartnerLongPendingLinkNotEstablished());
  }, [dispatch]);

  const rows = (data?.content ?? []).map((r) => ({
    id: r.partnerId,
    name: r.partnerName,
    dist: r.district,
    days: r.ageDays,
    stage: t('dashboard.stageOnboardedNoLink')
  }));

  return (
    <Card
      title={t('dashboard.longPendingLinkNotEstablished')}
      headerRight={
        <Box bg='#FFF6EE' color='#FF8C00' fontSize='12px' fontWeight='700' px='9px' py='3px' borderRadius='20px'>
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
            <DelayRow key={d.id || i} d={d} accent='#FF8C00' />
          ))}
        </Box>
      )}
    </Card>
  );
};

export default LongPendingLinkNotEstablished;
