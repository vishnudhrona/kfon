import { useTranslation } from 'react-i18next';

import DeviceConfigList from '@/features/inventory/components/DeviceConfigList';

import { INVENTORY_KEYS } from '../constants';

const CategoryList = () => {
  const { t } = useTranslation();
  return (
    <DeviceConfigList
      name={INVENTORY_KEYS.DEVICE_CATEGORY_LIST}
      title={t('deviceCategoryList')}
      addText={t('deviceCategory')}
    />
  );
};

export default CategoryList;
