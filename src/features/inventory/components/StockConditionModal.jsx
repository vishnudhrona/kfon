import { yupResolver } from '@hookform/resolvers/yup';
import { Box, FormController, Popup, useForm, VStack } from '@kfonbss/bss-ui-components';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { fetchDeviceConditionDropdown } from '../actions';
import { getDeviceConditionDropdown } from '../selectors';
import { getConditionSchema } from '../validations';
import ModalActionButtons from './ModalActionButtons';

const StockConditionModal = ({ isOpen, onClose, onSubmit, device }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const deviceConditionOptions = useSelector(getDeviceConditionDropdown);

  useEffect(() => {
    dispatch(fetchDeviceConditionDropdown());
  }, [dispatch]);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(getConditionSchema(t)),
    defaultValues: {
      date: new Date()
    }
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleFormSubmit = (data) => {
    onSubmit({
      device: device,
      date: data.date,
      condition: data.condition.code,
      remark: data.remark
    });
    handleClose();
  };

  const [showDateField, setShowDateField] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => setShowDateField(true), 0);
      return () => clearTimeout(timer);
    } else {
      setShowDateField(false);
    }
  }, [isOpen]);

  return (
    <Popup
      isOpen={isOpen}
      onOpenChange={(e) => {
        if (!e.open) handleClose();
      }}
      title={t('update')}
      titleMain={t('condition')}
      size='sm'
      closeButton={false}
      initialFocusEl={null}
    >
      <Box px={4} pb={4}>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <VStack spacing={6} gap={6} alignItems='stretch'>
            {showDateField && (
              <FormController
                type='date'
                control={control}
                name='date'
                labelName={t('date')}
                placeholder={t('autoSelectTodayDate')}
                errors={errors}
                required
                disablePortal={true}
              />
            )}

            <FormController
              type='select'
              control={control}
              name='condition'
              labelName={t('condition')}
              placeholder={t('choose', { 0: t('condition') })}
              items={deviceConditionOptions}
              errors={errors}
              required
            />

            <FormController
              type='textarea'
              control={control}
              name='remark'
              labelName={t('remark')}
              placeholder={t('enter', { 0: t('remark') })}
              errors={errors}
              required
            />

            <ModalActionButtons onClose={handleClose} />
          </VStack>
        </form>
      </Box>
    </Popup>
  );
};

export default StockConditionModal;
