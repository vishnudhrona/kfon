import { FormController, Icons, Popup, useForm, VStack } from '@kfonbss/bss-ui-components';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { fetchDeviceConditionDropdown, fetchDeviceTypeDropdown, fetchStockStatusDropdown } from '../actions';
import { INVENTORY_KEYS } from '../constants';
import { getDeviceConditionDropdown, getDropdownData, getStockStatusDropdown } from '../selectors';
import ModalActionButtons from './ModalActionButtons';

const { BsArrowRightCircle } = Icons;

const StockFilterModal = ({ isOpen, onClose, onApply, defaultValues, allowedFields }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const deviceTypeList = useSelector(getDropdownData(INVENTORY_KEYS.DEVICE_TYPE_LIST));
  const statusList = useSelector(getStockStatusDropdown);
  const deviceConditionOptions = useSelector(getDeviceConditionDropdown);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    defaultValues: defaultValues || {}
  });

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchDeviceTypeDropdown());
      dispatch(fetchStockStatusDropdown());
      dispatch(fetchDeviceConditionDropdown());
      reset(defaultValues || {});
    }
  }, [isOpen, dispatch, reset, defaultValues]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleReset = () => {
    reset({});
    onApply({}, {});
    onClose();
  };

  const onSubmit = (data) => {
    onApply(
      {
        deviceType: data.deviceType?.name,
        stockStatus: data.status?.code,
        deviceCondition: data.condition?.code
      },
      data
    );
    handleClose();
  };

  return (
    <Popup isOpen={isOpen} onOpenChange={handleClose} title={t('filter')} size='sm' closeButton={true}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack spacing={6} alignItems='stretch' gap={6} px={4} pb={4} pt={4}>
          <FormController
            type='select'
            control={control}
            name='deviceType'
            labelName={t('deviceType')}
            placeholder={t('choose', { 0: t('deviceType') })}
            items={deviceTypeList}
            errors={errors}
            labelStyles={{ fontWeight: 'bold' }}
          />

          {(!allowedFields || allowedFields.includes('status')) && (
            <FormController
              type='select'
              control={control}
              name='status'
              labelName={t('status')}
              placeholder={t('choose', { 0: t('status') })}
              items={statusList}
              errors={errors}
              labelStyles={{ fontWeight: 'bold' }}
            />
          )}

          {(!allowedFields || allowedFields.includes('condition')) && (
            <FormController
              type='select'
              control={control}
              name='condition'
              labelName={t('condition')}
              placeholder={t('choose', { 0: t('condition') })}
              items={deviceConditionOptions}
              errors={errors}
              labelStyles={{ fontWeight: 'bold' }}
            />
          )}

          <ModalActionButtons
            onClose={handleReset}
            closeLabel='reset'
            submitLabel='search'
            submitIcon={<BsArrowRightCircle />}
            mt={4}
          />
        </VStack>
      </form>
    </Popup>
  );
};

export default StockFilterModal;
