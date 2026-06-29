import { Button, Icons, Spinner } from '@kfonbss/bss-ui-components';
import { useNavigate } from '@tanstack/react-router';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import CsvDownloadBtn from '@/components/custom/CsvDownloadBtn';
import CustomLoaderProvider from '@/components/custom/CustomLoaderProvider';
import GenericPageTable from '@/components/custom/GenericPageTable';
import { DATE_FORMAT } from '@/constants/date';
import { getApiProgress } from '@/features/others/ApiProgress/selectors';
import { router } from '@/routes/routes';
import { mapObjectValues } from '@/utils/commonUtils';
import { dayjs } from '@/utils/dateUtils';

import { ACTION_TYPES, downloadEnquiryListCsv, fetchCorporateCustomerList } from '../action';
import { CORPORATE_KEYS, VISIBLE_COLUMNS_CORPORATE_CUSTOMER } from '../constants';
import { createCorporateCustomerRoute } from '../routes';
import { getTableData } from '../selector';

const CorporateCustomer = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { FilterIcon, ThreeDotActionIcon, UserProfileIcon } = Icons;
  const navigate = useNavigate();

  const apiProgress = useSelector(getApiProgress);
  const isFetching = !!apiProgress[ACTION_TYPES.FETCH_CORPORATE_CUSTOMER_LIST];
  const isDownloading = !!apiProgress[ACTION_TYPES.DOWNLOAD_ENQUIRY_LIST_CSV];

  useEffect(() => {
    dispatch(fetchCorporateCustomerList());
  }, [dispatch]);

  const columns = useMemo(() => {
    const baseColumns = mapObjectValues(VISIBLE_COLUMNS_CORPORATE_CUSTOMER, t, ['header']);

    if (!Array.isArray(baseColumns)) {
      console.error('baseColumns is not an array:', baseColumns);
      return [];
    }

    return baseColumns.map((col) => {
      if (col.accessor === 'companyName') {
        return {
          ...col,
          cell: (row) => (
            <Button
              variant='link'
              as='a'
              onClick={() => {
                router.navigate({
                  to: '/app/corporate/customers/details/$customerId',
                  params: { customerId: row.enquiryId || row.id }
                });
              }}
              fontWeight='bold'
              color='primary.500'
              p={0}
            >
              {row.companyName}
            </Button>
          )
        };
      }
      if (col.accessor === 'createdDate') {
        return {
          ...col,
          cell: (row) => (row.createdDate ? dayjs(row.createdDate).format(DATE_FORMAT.DATE_TIME) : '-')
        };
      }

      if (col.accessor === 'kycDetails') {
        return {
          ...col,
          cell: () => (
            <Button variant='outline' size='sm' colorScheme='red' borderRadius='full'>
              {t('addKyc')}
            </Button>
          )
        };
      }

      if (col.accessor === 'action') {
        return {
          ...col,
          cell: () => (
            <Button variant='ghost' minW='auto' p={0}>
              <ThreeDotActionIcon />
            </Button>
          )
        };
      }

      return col;
    });
  }, [t]);

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
        onClick={() => {
          if (isDownloading) return;
          dispatch(downloadEnquiryListCsv());
        }}
        label={isDownloading ? <><Spinner size='xs' style={{ marginRight: '8px' }} />{t('downloadCSV')}</> : undefined}
      />

      <Button
        variant={'outline'}
        borderRadius='md'
        height='40px'
        onClick={() =>
          navigate({
            to: createCorporateCustomerRoute.to
          })
        }
      >
        <UserProfileIcon />
        {t('addNewCustomer')}
      </Button>
    </>
  );

  return (
    <CustomLoaderProvider isLoading={isFetching} flex='1' minH='0' display='flex' flexDirection='column' w='full'>
      <GenericPageTable
        tableKey={CORPORATE_KEYS.CORPORATE_CUSTOMER_LIST}
        dataSelector={getTableData(CORPORATE_KEYS.CORPORATE_CUSTOMER_LIST)}
        fetchAction={fetchCorporateCustomerList}
        filters={filters}
        actions={actions}
        columns={columns}
      />
    </CustomLoaderProvider>
  );
};

export default CorporateCustomer;
