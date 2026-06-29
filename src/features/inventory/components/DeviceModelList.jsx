import { Button, HStack, Icons, VStack } from '@kfonbss/bss-ui-components';
import { useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import CsvDownloadBtn from '@/components/custom/CsvDownloadBtn';
import GenericPageTable from '@/components/custom/GenericPageTable';

import { downloadDeviceModelCsv, fetchDeviceModelList } from '../actions';
import { INVENTORY_KEYS, VISIBLE_COLUMNS_DEVICE_MODEL } from '../constants';
import { getTableData } from '../selectors';

const { AddCircleIcon } = Icons;

const DeviceModelList = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const actions = (
    <HStack flex={'3'} justifyContent={'end'} alignItems={'stretch'}>
      <CsvDownloadBtn onClick={() => dispatch(downloadDeviceModelCsv())} />
      <Button
        variant={'solid'}
        borderRadius='lg'
        h='10'
        onClick={() =>
          navigate({
            to: 'add'
          })
        }
      >
        <AddCircleIcon />
        {t('addDeviceModel')}
      </Button>
    </HStack>
  );

  return (
    <VStack alignItems={'stretch'} h='full' gap='3'>
      <GenericPageTable
        pageTitle={t('deviceModelList')}
        dataSelector={getTableData(INVENTORY_KEYS.DEVICE_MODEL_LIST)}
        fetchAction={fetchDeviceModelList}
        columns={VISIBLE_COLUMNS_DEVICE_MODEL}
        actions={actions}
        tableKey={INVENTORY_KEYS.DEVICE_MODEL_LIST}
      />
    </VStack>
  );
};

export default DeviceModelList;
