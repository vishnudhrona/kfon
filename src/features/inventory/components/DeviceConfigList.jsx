import { IconButton, Icons, VStack } from '@kfonbss/bss-ui-components';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import GenericPageTable from '@/components/custom/GenericPageTable';

import {
  createDeviceType,
  fetchDeviceCategoryList,
  fetchDeviceMakeList,
  fetchDeviceTypeList,
  fetchDeviceVendorList
} from '../actions';
import { DUMMY_TABLE_DATA, INVENTORY_KEYS } from '../constants';
import { getTableData } from '../selectors';
import DeviceConfigForm from './DeviceConfigForm';

const { EditIcon } = Icons;

const API_MAP = {
  [INVENTORY_KEYS.DEVICE_VENDOR_LIST]: { fetch: fetchDeviceVendorList },
  [INVENTORY_KEYS.DEVICE_TYPE_LIST]: { fetch: fetchDeviceTypeList, submit: createDeviceType },
  [INVENTORY_KEYS.DEVICE_MAKE_LIST]: { fetch: fetchDeviceMakeList },
  [INVENTORY_KEYS.DEVICE_CATEGORY_LIST]: { fetch: fetchDeviceCategoryList }
};

const DeviceConfigList = ({ name, addText }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState(null);

  const fetchAction = useMemo(() => API_MAP[name]?.fetch, [name]);

  const handleCreateItem = (data) => {
    const action = API_MAP[name].submit;
    if (action) {
      dispatch(action(data));
    }
  };

  const handleEdit = (rowData) => {
    setEditData(rowData);
    setEditMode(true);
    setOpen(true);
  };

  const handleClosePopup = () => {
    setOpen(false);
    setEditMode(false);
    setEditData(null);
  };

  // Add edit button to actions column for device vendor list
  const columns = useMemo(() => {
    if (name === INVENTORY_KEYS.DEVICE_VENDOR_LIST) {
      return DUMMY_TABLE_DATA[name].COLUMN_DATA.map((col) => {
        if (col.accessor === 'actions') {
          return {
            ...col,
            cell: (row) => (
              <IconButton aria-label='Edit vendor' size='sm' variant='ghost' onClick={() => handleEdit(row)}>
                <EditIcon color={'primary.500'} boxSize={5} />
              </IconButton>
            )
          };
        }
        return col;
      });
    }
    return DUMMY_TABLE_DATA[name].COLUMN_DATA;
  }, [name]);

  return (
    <VStack alignItems={'stretch'} h='full' gap='3'>
      <DeviceConfigForm
        source='list'
        name={name}
        open={open}
        setOpen={handleClosePopup}
        title={editMode ? t('editItem', { 0: addText }) : t('addItem', { 0: addText })}
        onSubmit={handleCreateItem}
        editMode={editMode}
        editData={editData}
        isPopup={false}
      />
      <GenericPageTable
        dataSelector={getTableData(name)}
        fetchAction={fetchAction}
        columns={columns}
        searchable={false}
        tableKey={name}
      />
    </VStack>
  );
};

export default DeviceConfigList;
