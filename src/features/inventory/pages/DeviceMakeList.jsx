import { useTranslation } from 'react-i18next';

import DeviceConfigList from '@/features/inventory/components/DeviceConfigList';

import { INVENTORY_KEYS } from '../constants';

const MakeList = () => {
  const { t } = useTranslation();
  return (
    <DeviceConfigList name={INVENTORY_KEYS.DEVICE_MAKE_LIST} title={t('deviceMakeList')} addText={t('deviceMake')} />
  );
};

export default MakeList;
