import { Box, Button, HStack, Icons, Select } from '@kfonbss/bss-ui-components';
import { useNavigate, useRouteContext, useSearch } from '@tanstack/react-router';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { CirclePlusIcon, CsvDownloadBtn } from '@/components/custom';
import ExpandButton from '@/components/custom/ExpandButton';
import GenericCardPage from '@/components/custom/GenericCardPage';
import { MENU_KEYS, PERMISSIONS } from '@/constants/permissions';
import { SERVER_SIDE_TABLE_KEYS } from '@/constants/server_table';
import { fetchDistrict } from '@/features/common/actions';
import { getDistrict } from '@/features/common/selectors';
import { getServerSideData, getServerSideFilterDetails } from '@/features/others/Pagination/selectors';
import { usePageActions } from '@/hooks/usePageActions';
import { selectorWithKey } from '@/utils/commonUtils';

import {
  downloadPartnerEnquiryCsv,
  downloadPartnerListCsv,
  fetchAgnpPartnersList,
  fetchLnpPartnersList,
  fetchPartnersAll
} from '../action';
import AGNPPartnerCard from '../components/AGNPPartnerCard';
import LNPPartnerCard from '../components/LNPPartnerCard';
import PartnerListCard from '../components/PartnerListCard';
import { VISIBLE_COLUMNS_LNP_PARTNERS_LIST } from '../constants';

const fetchLnpPartnersListWrapper = (data) => {
  const params = { ...data };
  if (params.type && typeof params.type === 'string') {
    params.type = params.type.toLowerCase();
  }
  if (params.forwardType && typeof params.forwardType === 'string') {
    params.forwardType = params.forwardType.toLowerCase();
  }
  return fetchLnpPartnersList(params);
};
fetchLnpPartnersListWrapper.type = fetchLnpPartnersList.type;

const fetchAgnpPartnersListWrapper = (data) => {
  const params = { ...data };
  if (params.type && typeof params.type === 'string') {
    params.type = params.type.toLowerCase();
  }
  if (params.forwardType && typeof params.forwardType === 'string') {
    params.forwardType = params.forwardType.toLowerCase();
  }
  return fetchAgnpPartnersList(params);
};
fetchAgnpPartnersListWrapper.type = fetchAgnpPartnersList.type;

const fetchPartnersAllWrapper = (data) => {
  const params = { ...data };
  if (params.type) {
    params.partnerType = params.type;
    delete params.type;
  }
  delete params.status;
  return fetchPartnersAll(params);
};
fetchPartnersAllWrapper.type = fetchPartnersAll.type;

const PartnerCardWrapper = ({ isPartnersList, ...props }) => {
  if (isPartnersList) {
    return <PartnerListCard {...props} />;
  }

  if (props.data && props.data.agnpName) {
    return <AGNPPartnerCard {...props} />;
  }
  return <LNPPartnerCard {...props} />;
};

const ENQUIRY_STATUS_OPTIONS = [
  { id: '', label: 'All', value: '', name: 'All' },
  { id: 'OPEN', label: 'Open', value: 'OPEN', name: 'Open' },
  { id: 'FEASIBLE', label: 'Feasible', value: 'FEASIBLE', name: 'Feasible' },
  { id: 'NOT_FEASIBLE', label: 'Not Feasible', value: 'NOT_FEASIBLE', name: 'Not Feasible' },
  { id: 'APPROVED', label: 'Approved', value: 'APPROVED', name: 'Approved' },
  { id: 'REJECTED', label: 'Rejected', value: 'REJECTED', name: 'Rejected' },
  { id: 'ONBOARDED', label: 'Onboarded', value: 'ONBOARDED', name: 'Onboarded' }
];

const LNPPartners = () => {
  const { t } = useTranslation();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [expandAll, setExpandAll] = useState(true);

  const districtList = useSelector(getDistrict);

  useEffect(() => {
    dispatch(fetchDistrict());
  }, [dispatch]);

  const { menuKey } = useRouteContext({ strict: false });
  const isPartnersList = menuKey === MENU_KEYS.PARTNERS_LIST;
  const search = useSearch({ strict: false });
  const selectedType = search?.type ?? 'LNP';
  const selectedForwardType = search?.forwardType ?? 'inbox';

  const initialParams = useMemo(() => {
    if (isPartnersList) return { type: selectedType };
    return { type: selectedType, status: '' };
  }, [isPartnersList, selectedType]);

  const { hasPermission } = usePageActions();
  const canOnboardPartner = hasPermission(PERMISSIONS.PARTNERS.ONBOARD_PARTNER);

  const tableKey = isPartnersList
    ? SERVER_SIDE_TABLE_KEYS.PARTNERS_FETCH_ALL_TABLE
    : selectedType === 'AGNP'
      ? SERVER_SIDE_TABLE_KEYS.AGNP_PARTNERS_LIST_TABLE
      : SERVER_SIDE_TABLE_KEYS.LNP_PARTNERS_LIST_TABLE;

  const serverSideData = useSelector(getServerSideData);
  const tableData = selectorWithKey(serverSideData, tableKey);
  const filterDetails = useSelector(getServerSideFilterDetails);

  const currentFilters = selectorWithKey(filterDetails, tableKey) || {};

  const filterConfig = useMemo(
    () => [
      ...(!isPartnersList
        ? [
            {
              name: 'status',
              label: 'status',
              type: 'select',
              placeholder: 'selectStatus',
              items: ENQUIRY_STATUS_OPTIONS
            }
          ]
        : []),
      {
        name: 'districtId',
        label: 'district',
        type: 'select',
        placeholder: 'selectDistrict',
        items: districtList?.map((d) => ({ districtId: d.id, label: d.name })) || [],
        isClearable: true,
        valueKey: 'districtId'
      },
      {
        name: 'fromDate',
        label: 'fromDate',
        type: 'date',
        placeholder: 'selectFromDate',
        disablePortal: true,
        props: { disableFuture: true }
      },
      {
        name: 'toDate',
        label: 'toDate',
        type: 'date',
        placeholder: 'selectToDate',
        disablePortal: true,
        props: { disableFuture: true }
      }
    ],
    [isPartnersList, districtList]
  );

  const handleTypeChange = (val) => {
    const newType = val?.target ? val.target.value : val?.value || val;
    if (newType === selectedType) return;
    navigate({ search: { type: newType }, replace: true });
  };

  const handleForwardTypeChange = (val) => {
    if (val === selectedForwardType) return;
    navigate({ search: (prev) => ({ ...prev, forwardType: val }), replace: true });
  };

  const searchPrefix = (
    <HStack spacing={2} gap='10px' mr='70px'>
      {isPartnersList && (
        <HStack spacing={6} bg='gray.100' borderRadius='full' p={1} gap='10px'>
          <Button
            border='none'
            bg={selectedType === 'LNP' ? '#FFDE74' : 'transparent'}
            color={selectedType === 'LNP' ? '#000' : 'gray.500'}
            onClick={() => handleTypeChange('LNP')}
            fontSize='16px'
            fontWeight='500'
            fontStyle='normal'
            width='120px'
            height='40px'
            borderRadius='full'
          >
            <Icons.LnpIcon color={selectedType === 'LNP' ? '#000' : 'gray.500'} /> {t('lnp')}
          </Button>
          <Button
            border='none'
            bg={selectedType === 'AGNP' ? '#FFDE74' : 'transparent'}
            color={selectedType === 'AGNP' ? '#000' : 'gray.500'}
            onClick={() => handleTypeChange('AGNP')}
            fontSize='16px'
            fontWeight='500'
            fontStyle='normal'
            width='120px'
            height='40px'
            borderRadius='full'
          >
            <Icons.AgnpIcon color={selectedType === 'AGNP' ? '#000' : 'gray.500'} /> {t('agnp')}
          </Button>
        </HStack>
      )}
      {!isPartnersList && (
        <HStack bg='gray.100' borderRadius='full' p={1} gap='10px'>
          <Button
            border='none'
            bg={selectedForwardType === 'inbox' ? '#FFDE74' : 'transparent'}
            color={selectedForwardType === 'inbox' ? '#000' : 'gray.500'}
            onClick={() => handleForwardTypeChange('inbox')}
            fontSize='16px'
            fontWeight='500'
            fontStyle='normal'
            width='120px'
            height='40px'
            borderRadius='full'
          >
            <Icons.InboxIcon color={selectedForwardType === 'inbox' ? '#000' : 'gray.500'} /> {t('inbox')}
          </Button>
          <Button
            border='none'
            bg={selectedForwardType === 'outbox' ? '#FFDE74' : 'transparent'}
            color={selectedForwardType === 'outbox' ? '#000' : 'gray.500'}
            onClick={() => handleForwardTypeChange('outbox')}
            fontSize='16px'
            fontWeight='500'
            fontStyle='normal'
            width='120px'
            height='40px'
            borderRadius='full'
          >
            <Icons.OutboxIcon color={selectedForwardType === 'outbox' ? '#000' : 'gray.500'} /> {t('outbox')}
          </Button>
        </HStack>
      )}
    </HStack>
  );

  const actions = (
    <Box display='flex' gap={2}>
      {canOnboardPartner && (
        <Button
          variant={'outline'}
          borderRadius='lg'
          height={'40px'}
          onClick={() =>
            navigate({ to: '/app/partners/enquiry-list/new', search: { type: selectedType?.toLowerCase() } })
          }
        >
          <CirclePlusIcon />
          {t('newPartnerRequest')}
        </Button>
      )}

      <CsvDownloadBtn
        onClick={() => {
          const params = {
            ...initialParams,
            ...currentFilters,
            partnerType: selectedType
          };
          if (isPartnersList) {
            dispatch(downloadPartnerListCsv(params));
          } else {
            dispatch(downloadPartnerEnquiryCsv(params));
          }
        }}
      />
      <ExpandButton isAllExpanded={expandAll} setIsAllExpanded={setExpandAll} />
    </Box>
  );

  return (
    <GenericCardPage
      key={tableKey}
      data={tableData}
      actions={actions}
      searchPrefix={searchPrefix}
      afterSearch={
        !isPartnersList ? (
          <Box minW='140px'>
            <Select
              options={[
                { id: 'LNP', name: t('lnp') },
                { id: 'AGNP', name: t('agnp') }
              ]}
              value={{ id: selectedType, name: t(selectedType.toLowerCase()) }}
              onChange={(opt) => handleTypeChange(opt?.id)}
              getOptionLabel={(o) => o.name}
              getOptionValue={(o) => o.id}
              isClearable={false}
              isSearchable={false}
            />
          </Box>
        ) : undefined
      }
      fetchAction={
        isPartnersList
          ? fetchPartnersAllWrapper
          : selectedType === 'AGNP'
            ? fetchAgnpPartnersListWrapper
            : fetchLnpPartnersListWrapper
      }
      columns={VISIBLE_COLUMNS_LNP_PARTNERS_LIST}
      tableKey={tableKey}
      pageTitle={isPartnersList ? t('partnersList') : t('appliedOnlinePartners')}
      CardComponent={(props) => (
        <PartnerCardWrapper {...props} isPartnersList={isPartnersList} forwardType={selectedForwardType} />
      )}
      params={{ type: selectedType, status: '', ...(!isPartnersList && { forwardType: selectedForwardType }) }}
      externalFilters={{ type: selectedType, ...(!isPartnersList && { forwardType: selectedForwardType }) }}
      filterConfig={filterConfig}
      expandAll={expandAll}
    />
  );
};

export default LNPPartners;
