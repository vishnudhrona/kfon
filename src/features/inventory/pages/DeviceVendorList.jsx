import { useTranslation } from 'react-i18next';

import DeviceConfigList from '@/features/inventory/components/DeviceConfigList';

import { INVENTORY_KEYS } from '../constants';

const VendorList = () => {
  const { t } = useTranslation();
  return (
    <DeviceConfigList
      name={INVENTORY_KEYS.DEVICE_VENDOR_LIST}
      title={t('deviceVendorList')}
      addText={t('deviceVendor')}
    />
  );
};

export default VendorList;
