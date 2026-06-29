import { Box, Button } from '@kfonbss/bss-ui-components';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { CirclePlusIcon, EditActionIcon } from '@/components/custom';
import CsvDownloadBtn from '@/components/custom/CsvDownloadBtn';
import GenericPageTable from '@/components/custom/GenericPageTable';
import { SERVER_SIDE_TABLE_KEYS } from '@/constants/server_table';
import { getServerSideFilterDetails } from '@/features/others/Pagination/selectors';
import { mapObjectValues, selectorWithKey } from '@/utils/commonUtils';

import { downloadVlanMappingsCsv, fetchVlanMappingData } from '../action';
import VlanMapping from '../components/VlanMapping';
import { VISIBLE_COLUMNS_VLAN_ASSOCIATION } from '../constants';
import { getVlanMappingData } from '../selector';

const VlanAssociation = () => {
  const { t } = useTranslation();
  const [openVlanMapping, setOpenVlanMapping] = useState(false);
  const [selectedMapping, setSelectedMapping] = useState(null);
  const dispatch = useDispatch();
  
  const filterDetails = useSelector(getServerSideFilterDetails);
  const currentFilters = selectorWithKey(filterDetails, SERVER_SIDE_TABLE_KEYS.VLAN_ASSOCIATION_TABLE) || {};

  const handleAddNew = () => {
    setSelectedMapping(null);
    setOpenVlanMapping(true);
  };

  const handleEdit = (row) => {
    setSelectedMapping(row);
    setOpenVlanMapping(true);
  };

  const handlePopupClose = (isOpen) => {
    setOpenVlanMapping(isOpen);
    if (!isOpen) {
      setSelectedMapping(null);
    }
  };

  const handleDownloadCsv = () => {
    dispatch(downloadVlanMappingsCsv(currentFilters));
  };

  const columns = useMemo(() => {
    const dataColumns = mapObjectValues(VISIBLE_COLUMNS_VLAN_ASSOCIATION, t, ['header']);
    return [
      ...dataColumns,
      {
        header: t('action'),
        accessor: 'action',
        cell: (row) => (
          <Box
            cursor='pointer'
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(row);
            }}
          >
            <EditActionIcon />
          </Box>
        )
      }
    ];
  }, [t]);

  const actions = (
    <Box display='flex' gap='10px'>
      <CsvDownloadBtn onClick={handleDownloadCsv} />
      <Button variant='solid' borderRadius='md' height='40px' onClick={handleAddNew}>
        <CirclePlusIcon />
        {t('addNewVlanMapping')}
      </Button>
    </Box>
  );
  return (
    <>
      <GenericPageTable
        pageTitle='Vlan Association'
        fetchAction={fetchVlanMappingData}
        dataSelector={getVlanMappingData}
        columns={columns}
        actions={actions}
        tableKey={SERVER_SIDE_TABLE_KEYS.VLAN_ASSOCIATION_TABLE}
      />

      <VlanMapping
        isOpen={openVlanMapping}
        onClose={handlePopupClose}
        selectedMapping={selectedMapping}
        onSuccess={() => setSelectedMapping(null)}
      />
    </>
  );
};

export default VlanAssociation;
