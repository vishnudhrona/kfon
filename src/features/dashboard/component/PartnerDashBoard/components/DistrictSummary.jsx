import { Box, Text } from '@kfonbss/bss-ui-components';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { fetchPartnerDistrictSummary } from '../action';
import { getPartnerDistrictSummary } from '../selector';
import { Badge, Card, TableCell, TableHeaderCell } from './shared';

const DistrictSummary = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const districtSummary = useSelector(getPartnerDistrictSummary);

  useEffect(() => {
    dispatch(fetchPartnerDistrictSummary());
  }, [dispatch]);

  return (
    <Card
      title={t('dashboard.districtWiseSummary')}
      headerRight={
        <Box bg='#FEF9E0' color='#7A5800' fontSize='12px' fontWeight='700' px='9px' py='3px' borderRadius='20px'>
          {t('dashboard.districtsCount', { count: districtSummary.length })}
        </Box>
      }
    >
      <Box overflowX='auto'>
        <Box as='table' w='full' borderCollapse='collapse' fontSize='14px' minW='580px'>
          <Box as='thead' bg='#7A1C2E'>
            <Box as='tr'>
              <TableHeaderCell>{t('dashboard.colDistrict')}</TableHeaderCell>
              <TableHeaderCell>{t('dashboard.colTotal')}</TableHeaderCell>
              <TableHeaderCell>{t('dashboard.colActive')}</TableHeaderCell>
              <TableHeaderCell>{t('dashboard.colPending')}</TableHeaderCell>
              <TableHeaderCell>{t('dashboard.colRate')}</TableHeaderCell>
            </Box>
          </Box>
          <Box as='tbody'>
            {districtSummary.length === 0 ? (
              <Box as='tr'>
                <TableCell colSpan={5} style={{ textAlign: 'center', padding: '24px', color: '#9A90A8' }}>
                  {t('dashboard.noData')}
                </TableCell>
              </Box>
            ) : (
              districtSummary.map((row, i) => {
                const pct = parseInt(String(row.rate ?? '0'), 10) || 0;
                const rateClass =
                  pct >= 70
                    ? { bg: '#EDFAF4', color: '#27AE60' }
                    : pct >= 50
                      ? { bg: '#FFF6EE', color: '#FF8C00' }
                      : { bg: '#FFF2F2', color: '#C82020' };
                return (
                  <Box
                    as='tr'
                    key={row.district || i}
                    borderBottom='1px solid rgba(0,0,0,0.04)'
                    _hover={{ bg: '#FDF5F7' }}
                  >
                    <TableCell>
                      <Text fontWeight='700'>{row.district}</Text>
                    </TableCell>
                    <TableCell>
                      <Text fontWeight='700' color='#7A1C2E'>
                        {row.total}
                      </Text>
                    </TableCell>
                    <TableCell>
                      <Text fontWeight='700' color='#27AE60'>
                        {row.active}
                      </Text>
                    </TableCell>
                    <TableCell>
                      <Text fontWeight='700' color='#FF8C00'>
                        {row.pending}
                      </Text>
                    </TableCell>
                    <TableCell>
                      <Badge bg={rateClass.bg} color={rateClass.color}>
                        {row.rate ?? `${pct}%`}
                      </Badge>
                    </TableCell>
                  </Box>
                );
              })
            )}
          </Box>
        </Box>
      </Box>
    </Card>
  );
};

export default DistrictSummary;
