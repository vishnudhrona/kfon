import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Flex, FormController, Popup, Text, useForm, VStack } from '@kfonbss/bss-ui-components';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { fetchDeviceConditionDropdown } from '../actions';
import { getDeviceConditionDropdown } from '../selectors';
import { getReceiveSchema } from '../validations';
import ModalActionButtons from './ModalActionButtons';

const StockReceiveModal = ({ isOpen, onClose, onSubmit, device, bulkDevices }) => {
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
    resolver: yupResolver(getReceiveSchema(t)),
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
      remarks: data.remarks
    });
    handleClose();
  };

  const [showDateField, setShowDateField] = useState(false);

  useEffect(() => {
    if (isOpen) {
      reset({
        date: new Date(),
        condition: deviceConditionOptions[0]
      });
      const timer = setTimeout(() => setShowDateField(true), 0);
      return () => clearTimeout(timer);
    } else {
      setShowDateField(false);
    }
  }, [isOpen, reset, deviceConditionOptions]);

  return (
    <Popup
      isOpen={isOpen}
      onOpenChange={(e) => {
        if (!e.open) handleClose();
      }}
      title={t('receive')}
      titleMain={t('device')}
      size={bulkDevices ? 'lg' : 'sm'}
      closeButton={false}
      initialFocusEl={null}
    >
      <Box px={4} pb={4}>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <VStack spacing={6} gap={6} alignItems='stretch'>
            {bulkDevices && bulkDevices.length > 0 && (
              <Box border='1px solid #E5E7EB' borderRadius='12px' overflow='hidden'>
                <Flex px='20px' py='12px' align='center' justify='space-between' borderBottom='1px solid #E5E7EB'>
                  <Text fontWeight='700' color='#232F50' fontSize='16px'>
                    {t('devicesSelected')}:{' '}
                    <Text as='span' color='primary.500'>
                      {bulkDevices.length}
                    </Text>
                  </Text>
                </Flex>
                <Box maxH='180px' overflowY='auto'>
                  {bulkDevices.map((d, i) => (
                    <Flex
                      key={d.deviceId}
                      px='20px'
                      py='10px'
                      align='center'
                      gap='12px'
                      borderBottom={i < bulkDevices.length - 1 ? '1px solid #F3F4F6' : 'none'}
                    >
                      <Box
                        bg='#FCECB8'
                        px='8px'
                        py='2px'
                        borderRadius='6px'
                        fontSize='12px'
                        fontWeight='700'
                        color='gray.800'
                        minW='28px'
                        textAlign='center'
                      >
                        {String(i + 1).padStart(2, '0')}
                      </Box>
                      <Text fontSize='14px' fontWeight='600' color='#232F50'>
                        {d.deviceTypeName || '-'}
                      </Text>
                      <Box w='1px' h='14px' bg='gray.200' />
                      <Text fontSize='13px' color='gray.500'>
                        {t('serialNumber')}:{' '}
                        <Text as='span' fontWeight='600' color='#232F50'>
                          {d.serialNumber || '-'}
                        </Text>
                      </Text>
                      {d.gponSerialNumber && (
                        <>
                          <Box w='1px' h='14px' bg='gray.200' />
                          <Text fontSize='13px' color='gray.500'>
                            {t('gponSerialNumber')}:{' '}
                            <Text as='span' fontWeight='600' color='#232F50'>
                              {d.gponSerialNumber}
                            </Text>
                          </Text>
                        </>
                      )}
                    </Flex>
                  ))}
                </Box>
              </Box>
            )}
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
              name='remarks'
              labelName={t('remarks')}
              placeholder={t('enter', { 0: t('remarks') })}
              errors={errors}
              required
            />

            <ModalActionButtons onClose={handleClose} px={6} />
          </VStack>
        </form>
      </Box>
    </Popup>
  );
};

export default StockReceiveModal;
