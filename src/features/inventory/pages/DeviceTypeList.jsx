import { useTranslation } from 'react-i18next';

import DeviceConfigList from '@/features/inventory/components/DeviceConfigList';

import { INVENTORY_KEYS } from '../constants';

const TypeList = () => {
  const { t } = useTranslation();
  return (
    <DeviceConfigList name={INVENTORY_KEYS.DEVICE_TYPE_LIST} title={t('deviceTypeList')} addText={t('deviceType')} />
  );
};

export default TypeList;
