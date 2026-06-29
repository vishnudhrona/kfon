import { Box, Button, Icons, Text } from '@kfonbss/bss-ui-components';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import CsvDownloadBtn from '@/components/custom/CsvDownloadBtn';
import CustomLoaderProvider from '@/components/custom/CustomLoaderProvider';
import GenericPageTable from '@/components/custom/GenericPageTable';
import { SERVER_SIDE_TABLE_KEYS } from '@/constants/server_table';
import { getApiProgress } from '@/features/others/ApiProgress/selectors';
import { router } from '@/routes/routes';
import { mapObjectValues } from '@/utils/commonUtils';

import {
  ACTION_TYPES,
  downloadLocationListCsv,
  downloadLocationReportCsv,
  fetchCorpEnquiryLocationList,
  locationForwardToFE,
  locationForwardToLNP
} from '../action';
import { VISIBLE_COLUMNS_CORP_ENQ_LOCATION } from '../constants';
import { getTableData } from '../selector';

const { BsArrowRightCircle } = Icons;

const CorpEnqLocationList = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { FilterIcon } = Icons;
  const apiProgress = useSelector(getApiProgress);
  const isLoading = !!apiProgress[ACTION_TYPES.FETCH_CORP_ENQUIRY_LOCATION_LIST];

  useEffect(() => {
    dispatch(fetchCorpEnquiryLocationList());
  }, [dispatch]);

  const [selectedRows, setSelectedRows] = useState([]);
  const [activeButton, setActiveButton] = useState(null);

  const getRowId = (row) => row.slNo;

  const toggleRow = useCallback((row) => {
    const rowId = getRowId(row);

    setSelectedRows((prev) =>
      prev.some((r) => getRowId(r) === rowId) ? prev.filter((r) => getRowId(r) !== rowId) : [...prev, row]
    );
  }, []);

  const buildPayload = () => ({
    locations: selectedRows.map((row) => ({
      slNo: row.slNo,
      partnerId: row.partnerId,
      partnerName: row.partnerName,
      customerName: row.customerName,
      contactName: row.contactName,
      contactNumber: row.contactNumber,
      contactEmail: row.contactEmail
    }))
  });

  const columns = useMemo(() => {
    const baseColumns = mapObjectValues(VISIBLE_COLUMNS_CORP_ENQ_LOCATION, t, ['header']);

    return baseColumns.map((col) => {
      if (col.accessor === 'select') {
        return {
          ...col,
          cell: (row) => {
            const id = getRowId(row);
            const checked = id ? selectedRows.some((r) => getRowId(r) === id) : false;

            return (
              <input
                type='checkbox'
                checked={checked}
                disabled={!id}
                onChange={() => toggleRow(row)}
                style={{
                  accentColor: 'var(--chakra-colors-primary-500)',
                  width: '18px',
                  height: '18px',
                  cursor: id ? 'pointer' : 'not-allowed'
                }}
              />
            );
          }
        };
      }

      if (col.accessor === 'additionalServices') {
        return {
          ...col,
          cell: (row) => {
            const services = Array.isArray(row.additionalServices) ? row.additionalServices : [];
            if (!services.length) return '-';
            return (
              <Box>
                {services.map((s, i) => (
                  <Box key={i} mb={i < services.length - 1 ? 2 : 0}>
                    <Text fontSize="sm" fontWeight="600" color="#232F50">{s.serviceName}</Text>
                    {Array.isArray(s.planIds) && s.planIds.map((p) => (
                      <Text key={p.id} fontSize="xs" color="gray.500">• {p.planName}</Text>
                    ))}
                  </Box>
                ))}
              </Box>
            );
          }
        };
      }

      if (col.accessor === 'receivedFrom') {
        return {
          ...col,
          cell: (row) => {
            const name = row.receivedFromName;
            const designation = row.receivedFromDesignation;
            if (!name) return '-';
            return (
              <Text fontSize="sm" color="#232F50">
                {name}{designation ? ` (${designation})` : ''}
              </Text>
            );
          }
        };
      }

      if (col.accessor === 'customerName') {
        return {
          ...col,
          cell: (row) => (
            <Button
              variant='link'
              p={0}
              fontWeight='bold'
              color='primary.500'
              onClick={() =>
                router.navigate({
                  to: '/app/corporate/corporate-enquiry-details/$enquiryId',
                  params: { enquiryId: row.customerId }
                })
              }
            >
              {row.customerName}
            </Button>
          )
        };
      }
      return col;
    });
  }, [t, selectedRows, toggleRow]);

  const filters = (
    <Button variant='outline' borderRadius='md' height='40px'>
      <FilterIcon />
      {t('filter')}
    </Button>
  );

  const actions = (
    <>
      <CsvDownloadBtn
        variant='outline'
        borderRadius='md'
        height='40px'
        onClick={() => dispatch(downloadLocationListCsv())}
      />
      <CsvDownloadBtn
        variant='outline'
        borderRadius='md'
        height='40px'
        label={t('locationReport')}
        onClick={() => dispatch(downloadLocationReportCsv())}
      />
    </>
  );

  const handleForward = (type) => {
    setActiveButton(type);
    if (type === 'fe') {
      dispatch(locationForwardToFE(buildPayload()));
    } else {
      dispatch(locationForwardToLNP(buildPayload()));
    }
  };

  const footerActions = (
    <>
      <Button variant={activeButton === 'fe' ? 'solid' : 'outline'} onClick={() => handleForward('fe')}>
        {t('locationToFE')}
        <BsArrowRightCircle />
      </Button>

      <Button variant={activeButton === 'lnp' ? 'solid' : 'outline'} onClick={() => handleForward('lnp')}>
        {t('locationToLNP')}
        <BsArrowRightCircle />
      </Button>
    </>
  );

  return (
    <CustomLoaderProvider isLoading={isLoading}>
      <GenericPageTable
        tableKey={SERVER_SIDE_TABLE_KEYS.ENQUIRY_LOCATION_LIST}
        dataSelector={getTableData(SERVER_SIDE_TABLE_KEYS.ENQUIRY_LOCATION_LIST)}
        fetchAction={fetchCorpEnquiryLocationList}
        filters={filters}
        actions={actions}
        columns={columns}
        footerActions={footerActions}
      />
    </CustomLoaderProvider>
  );
};

export default CorpEnqLocationList;
