import { Box, Button, HStack, Text } from '@kfonbss/bss-ui-components';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { getDistrict } from '@/features/common/selectors';

import { fetchPartnerEnquiryPosition } from '../action';
import { DEFAULT_PAGE_SIZE, STAGE_LABEL_KEYS, STAGES } from '../constants';
import { getPartnerEnquiryPosition } from '../selector';
import { Card, DaysBadge, Pager, Select, StageBadge, TableCell, TableHeaderCell, TypeBadge } from './shared';
import { fmtDate } from './utils';

// `district` and `partnerType` are shared (owned by the parent); search/stage/paging are local.
const EnquiryPosition = ({ district, partnerType, onDistrictChange, onPartnerTypeChange }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const districtList = useSelector(getDistrict);
  const enquiryPosition = useSelector(getPartnerEnquiryPosition);

  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState('');
  const [perPage, setPerPage] = useState(DEFAULT_PAGE_SIZE);
  const [page, setPage] = useState(1);

  const districtOptions = useMemo(() => (districtList ?? []).map((d) => d?.name).filter(Boolean), [districtList]);

  useEffect(() => {
    dispatch(
      fetchPartnerEnquiryPosition({
        type: partnerType || undefined,
        search: search || undefined,
        district: district || undefined,
        stage: stageFilter || undefined,
        page: page - 1,
        size: perPage
      })
    );
  }, [dispatch, partnerType, search, district, stageFilter, page, perPage]);

  const rows = enquiryPosition?.content ?? [];
  const total = enquiryPosition?.totalElements ?? 0;
  const totalPages = Math.max(1, enquiryPosition?.totalPages ?? 1);
  const currentPage = Math.min(page, totalPages);
  const start = total === 0 ? 0 : (currentPage - 1) * perPage;

  const clearFilters = () => {
    setSearch('');
    setStageFilter('');
    setPage(1);
    onDistrictChange('');
    onPartnerTypeChange('');
  };

  const filterPills = [];
  if (search) filterPills.push({ label: t('dashboard.filterSearch', { value: search }), clear: () => setSearch('') });
  if (district)
    filterPills.push({ label: t('dashboard.filterDistrict', { value: district }), clear: () => onDistrictChange('') });
  if (partnerType)
    filterPills.push({
      label: t('dashboard.filterType', { value: partnerType }),
      clear: () => onPartnerTypeChange('')
    });
  if (stageFilter)
    filterPills.push({ label: t('dashboard.filterStage', { value: stageFilter }), clear: () => setStageFilter('') });

  return (
    <Card
      title={t('dashboard.enquiryCurrentPosition')}
      headerRight={
        <Box bg='#FEF9E0' color='#7A5800' fontSize='12px' fontWeight='700' px='9px' py='3px' borderRadius='20px'>
          {t('dashboard.recordsCount', { count: total })}
        </Box>
      }
    >
      <HStack gap='8px' mb='12px' flexWrap='wrap'>
        <HStack
          gap='6px'
          px='13px'
          py='6px'
          bg='#EDEAF5'
          border='1.5px solid rgba(0,0,0,0.07)'
          borderRadius='8px'
          flex={1}
          maxW='200px'
        >
          <Text fontSize='15px' color='#9A90A8'>
            🔍
          </Text>
          <Box
            as='input'
            placeholder={t('dashboard.searchIdOrName')}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            border='none'
            outline='none'
            fontSize='14px'
            bg='transparent'
            flex={1}
            color='#1A1030'
            _placeholder={{ color: '#9A90A8' }}
          />
        </HStack>
        <Select
          value={district}
          onChange={(e) => {
            onDistrictChange(e.target.value);
            setPage(1);
          }}
        >
          <option value=''>{t('dashboard.allDistricts')}</option>
          {districtOptions.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </Select>
        <Select
          value={partnerType}
          onChange={(e) => {
            onPartnerTypeChange(e.target.value);
            setPage(1);
          }}
        >
          <option value=''>{t('dashboard.agnpAndLnp')}</option>
          <option value='AGNP'>AGNP</option>
          <option value='LNP'>LNP</option>
        </Select>
        <Select
          value={stageFilter}
          onChange={(e) => {
            setStageFilter(e.target.value);
            setPage(1);
          }}
        >
          <option value=''>{t('dashboard.allStages')}</option>
          {STAGES.map((s) => (
            <option key={s} value={s}>
              {t(STAGE_LABEL_KEYS[s])}
            </option>
          ))}
        </Select>
        <Button
          ml='auto'
          px='13px'
          py='6px'
          borderRadius='7px'
          border='1.5px solid rgba(0,0,0,0.07)'
          bg='#FFFFFF'
          fontSize='13px'
          fontWeight='700'
          color='#5A5070'
          cursor='pointer'
          _hover={{ borderColor: '#C0395A', color: '#7A1C2E' }}
          onClick={clearFilters}
          h='auto'
        >
          {t('dashboard.clear')}
        </Button>
      </HStack>

      {filterPills.length > 0 && (
        <HStack flexWrap='wrap' gap='6px' mb='10px'>
          {filterPills.map((p, i) => (
            <HStack
              key={i}
              gap='5px'
              px='10px'
              py='3px'
              borderRadius='20px'
              bg='#F2D9DF'
              fontSize='13px'
              fontWeight='700'
              color='#7A1C2E'
            >
              <Text>{p.label}</Text>
              <Box as='span' cursor='pointer' fontSize='15px' lineHeight='1' ml='2px' onClick={p.clear}>
                ×
              </Box>
            </HStack>
          ))}
        </HStack>
      )}

      <Box overflowX='auto'>
        <Box as='table' w='full' borderCollapse='collapse' fontSize='14px' minW='580px'>
          <Box as='thead' bg='#7A1C2E'>
            <Box as='tr'>
              <TableHeaderCell>{t('dashboard.colNo')}</TableHeaderCell>
              <TableHeaderCell>{t('dashboard.colTrackingId')}</TableHeaderCell>
              <TableHeaderCell>{t('dashboard.colPartnerName')}</TableHeaderCell>
              <TableHeaderCell>{t('dashboard.colDistrict')}</TableHeaderCell>
              <TableHeaderCell>{t('dashboard.colType')}</TableHeaderCell>
              <TableHeaderCell>{t('dashboard.colDate')}</TableHeaderCell>
              <TableHeaderCell>{t('dashboard.colStage')}</TableHeaderCell>
              <TableHeaderCell>{t('dashboard.colAge')}</TableHeaderCell>
            </Box>
          </Box>
          <Box as='tbody'>
            {rows.length === 0 ? (
              <Box as='tr'>
                <TableCell colSpan={8} style={{ textAlign: 'center', padding: '24px', color: '#9A90A8' }}>
                  {t('dashboard.noMatchingEnquiries')}
                </TableCell>
              </Box>
            ) : (
              rows.map((e, i) => (
                <Box
                  as='tr'
                  key={e.enquiryId || e.trackingId || i}
                  borderBottom='1px solid rgba(0,0,0,0.04)'
                  _hover={{ bg: '#FDF5F7' }}
                >
                  <TableCell color='#9A90A8' fontSize='12px'>
                    {start + i + 1}
                  </TableCell>
                  <TableCell>
                    <Text fontSize='13px' fontWeight='700' color='#7A1C2E'>
                      {e.trackingId || e.enquiryId}
                    </Text>
                  </TableCell>
                  <TableCell>
                    <Text fontWeight='700'>{e.partnerName}</Text>
                  </TableCell>
                  <TableCell color='#5A5070' fontSize='13px'>
                    {e.district}
                  </TableCell>
                  <TableCell>
                    <TypeBadge type={e.type} />
                  </TableCell>
                  <TableCell fontSize='13px' color='#9A90A8'>
                    {fmtDate(e.date)}
                  </TableCell>
                  <TableCell>
                    <StageBadge stage={e.stage} />
                  </TableCell>
                  <TableCell>
                    <DaysBadge days={e.ageDays} />
                  </TableCell>
                </Box>
              ))
            )}
          </Box>
        </Box>
      </Box>

      <HStack justify='space-between' mt='10px' fontSize='13px' color='#9A90A8'>
        <Text>
          {total === 0
            ? t('dashboard.noResults')
            : t('dashboard.showingOf', { from: start + 1, to: Math.min(start + perPage, total), total })}
        </Text>
        <HStack gap='6px' align='center'>
          <Text fontSize='13px' color='#9A90A8'>
            {t('dashboard.show')}
          </Text>
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

export default EnquiryPosition;
