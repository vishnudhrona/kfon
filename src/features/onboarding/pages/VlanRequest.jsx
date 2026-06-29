import { Box, Button } from '@kfonbss/bss-ui-components';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { CirclePlusIcon, FilterIcon } from '@/components/custom';
import CsvDownloadBtn from '@/components/custom/CsvDownloadBtn';
import GenericPageTable from '@/components/custom/GenericPageTable';
import { SERVER_SIDE_TABLE_KEYS } from '@/constants/server_table';
import { mapObjectValues } from '@/utils/commonUtils';

import { fetchVlanRequestData } from '../action';
import NewVlanRequest from '../components/NewVlanRequest';
import { VISIBLE_COLUMNS_VLAN_REQUEST } from '../constants';
import { getVlanRequestData } from '../selector';

const VlanRequest = () => {
  const { t } = useTranslation();
  const [openVlanMapping, setOpenVlanMapping] = useState(false);

  const columns = useMemo(() => {
    const dataColumns = mapObjectValues(VISIBLE_COLUMNS_VLAN_REQUEST, t, ['header']);
    return [{ header: 'SL.NO', accessor: 'slNo' }, ...dataColumns];
  }, [t]);

  const actions = (
    <Box display='flex' gap='10px'>
      <Button variant={'outline'} h={'40px'}>
        <FilterIcon />
        {t('filter')}
      </Button>
      <CsvDownloadBtn />
      <Button variant='solid' borderRadius='md' height='40px' onClick={() => setOpenVlanMapping(true)}>
        <CirclePlusIcon />
        {t('createNewVlanRequest')}
      </Button>
    </Box>
  );
  return (
    <>
      <GenericPageTable
        pageTitle='Vlan Request'
        fetchAction={fetchVlanRequestData}
        dataSelector={getVlanRequestData}
        columns={columns}
        actions={actions}
        tableKey={SERVER_SIDE_TABLE_KEYS.VLAN_REQUEST_TABLE}
      />

      <NewVlanRequest isOpen={openVlanMapping} onClose={setOpenVlanMapping} />
    </>
  );
};

export default VlanRequest;
