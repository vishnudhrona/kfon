import { Box, Button, HStack, Text } from '@kfonbss/bss-ui-components';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { downloadPartnerActiveCsv, fetchPartnerActiveList } from '../action';
import { DEFAULT_PAGE_SIZE, PERIOD_PARAM } from '../constants';
import { getPartnerActiveList, getPartnerDownloadingCsv } from '../selector';
import { Card, Pager, StatusBadge, TableCell, TableHeaderCell, TypeBadge } from './shared';
import { fmtDate } from './utils';

// `period` and `partnerType` are shared (owned by the parent); paging is local.
const ActivePartnersRegister = ({ period, partnerType }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const activeList = useSelector(getPartnerActiveList);
  const isDownloadingCsv = useSelector(getPartnerDownloadingCsv);

  const [perPage, setPerPage] = useState(DEFAULT_PAGE_SIZE);
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(
      fetchPartnerActiveList({
        partnerType: partnerType || undefined,
        period: PERIOD_PARAM[period] || undefined,
        page: page - 1,
        size: perPage
      })
    );
  }, [dispatch, partnerType, period, page, perPage]);

  // Reset to first page whenever the shared filters change.
  useEffect(() => {
    setPage(1);
  }, [partnerType, period]);

  const rows = activeList?.content ?? [];
  const total = activeList?.totalElements ?? 0;
  const totalPages = Math.max(1, activeList?.totalPages ?? 1);
  const currentPage = Math.min(page, totalPages);
  const start = total === 0 ? 0 : (currentPage - 1) * perPage;

  const handleDownloadCsv = () => {
    dispatch(
      downloadPartnerActiveCsv({
        partnerType: partnerType || undefined,
        period: PERIOD_PARAM[period] || undefined
      })
    );
  };

  return (
    <Card
      title={t('dashboard.activePartnersRegister')}
      headerRight={
        <HStack gap='7px' align='center'>
          <Box bg='#EDFAF4' color='#27AE60' fontSize='12px' fontWeight='700' px='9px' py='3px' borderRadius='20px'>
            {t('dashboard.activeCount', { count: total })}
          </Box>
          <Button
            px='13px'
            py='6px'
            borderRadius='7px'
            border='1.5px solid rgba(0,0,0,0.07)'
            bg='#FFFFFF'
            fontSize='13px'
            fontWeight='700'
            color='#5A5070'
            _hover={{ borderColor: '#C0395A', color: '#7A1C2E' }}
            h='auto'
            loading={isDownloadingCsv}
            onClick={handleDownloadCsv}
          >
            {t('dashboard.downloadCsv')}
          </Button>
        </HStack>
      }
    >
      <Box overflowX='auto'>
        <Box as='table' w='full' borderCollapse='collapse' fontSize='14px' minW='580px'>
          <Box as='thead' bg='#7A1C2E'>
            <Box as='tr'>
              <TableHeaderCell>{t('dashboard.colNo')}</TableHeaderCell>
              <TableHeaderCell>{t('dashboard.colPartnerId')}</TableHeaderCell>
              <TableHeaderCell>{t('dashboard.colPartnerName')}</TableHeaderCell>
              <TableHeaderCell>{t('dashboard.colType')}</TableHeaderCell>
              <TableHeaderCell>{t('dashboard.colDistributor')}</TableHeaderCell>
              <TableHeaderCell>{t('dashboard.colDistrict')}</TableHeaderCell>
              <TableHeaderCell>{t('dashboard.colActiveSubs')}</TableHeaderCell>
              <TableHeaderCell>{t('dashboard.colOnboardDate')}</TableHeaderCell>
              <TableHeaderCell>{t('dashboard.colLinkStatus')}</TableHeaderCell>
              <TableHeaderCell>{t('dashboard.colFrc')}</TableHeaderCell>
              <TableHeaderCell>{t('dashboard.colStatus')}</TableHeaderCell>
            </Box>
          </Box>
          <Box as='tbody'>
            {rows.length === 0 ? (
              <Box as='tr'>
                <TableCell colSpan={11} style={{ textAlign: 'center', padding: '24px', color: '#9A90A8' }}>
                  {t('dashboard.noActivePartners')}
                </TableCell>
              </Box>
            ) : (
              rows.map((p, i) => (
                <Box
                  as='tr'
                  key={p.id || p.partnerId || i}
                  borderBottom='1px solid rgba(0,0,0,0.04)'
                  _hover={{ bg: '#FDF5F7' }}
                >
                  <TableCell color='#9A90A8' fontSize='12px'>
                    {start + i + 1}
                  </TableCell>
                  <TableCell>
                    <Text fontSize='13px' fontWeight='700' color='#7A1C2E'>
                      {p.partnerId}
                    </Text>
                  </TableCell>
                  <TableCell>
                    <Text fontWeight='700'>{p.partnerName}</Text>
                  </TableCell>
                  <TableCell>
                    <TypeBadge type={p.type} />
                  </TableCell>
                  <TableCell color='#5A5070' fontSize='13px'>
                    {p.distributor}
                  </TableCell>
                  <TableCell color='#5A5070' fontSize='13px'>
                    {p.district}
                  </TableCell>
                  <TableCell>
                    <Text fontWeight='800' color={p.activeSubscribers >= 1000 ? '#FF8C00' : '#1A1030'}>
                      {(p.activeSubscribers ?? 0).toLocaleString()}
                      {p.activeSubscribers >= 1000 ? ' ⭐' : ''}
                    </Text>
                  </TableCell>
                  <TableCell fontSize='13px' color='#9A90A8'>
                    {fmtDate(p.onboardDate)}
                  </TableCell>
                  <TableCell>
                    <StatusBadge value={p.linkStatus} kind='link' />
                  </TableCell>
                  <TableCell>
                    <StatusBadge value={p.frcReceived} kind='frc' />
                  </TableCell>
                  <TableCell>
                    <StatusBadge value={p.status} kind='st' />
                  </TableCell>
                </Box>
              ))
            )}
          </Box>
        </Box>
      </Box>
      <HStack justify='space-between' mt='12px' fontSize='13px' color='#9A90A8'>
        <Text>
          {total === 0
            ? t('dashboard.noResults')
            : t('dashboard.showingEntries', {
                from: start + 1,
                to: Math.min(start + perPage, total),
                total
              })}
        </Text>
        <HStack gap='6px' align='center'>
          <Text>{t('dashboard.show')}</Text>
          <Box
            as='select'
            px='7px'
            py='3px'
            border='1px solid rgba(0,0,0,0.07)'
            borderRadius='6px'
            fontSize='13px'
            bg='#FFFFFF'
            value={perPage}
            onChange={(e) => {
              setPerPage(parseInt(e.target.value, 10));
              setPage(1);
            }}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </Box>
        </HStack>
        <Pager page={currentPage} totalPages={totalPages} onChange={setPage} />
      </HStack>
    </Card>
  );
};

export default ActivePartnersRegister;
