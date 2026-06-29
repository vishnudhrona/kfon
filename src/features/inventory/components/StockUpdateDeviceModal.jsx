import { yupResolver } from '@hookform/resolvers/yup';
import { Box, FormController, Popup, SimpleGrid, Text, useForm, VStack } from '@kfonbss/bss-ui-components';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';

import { normalizeDateToISO } from '@/utils/dateUtils';
import { formatIpAddress, formatMacAddress, regex, transformUppercaseAlphaNumeric, validation } from '@/utils/validationUtils';

import { fetchDeviceTypeFields } from '../actions';
import { getDeviceTypeFields } from '../selectors';
import DeviceInfoHeader from './DeviceInfoHeader';
import ModalActionButtons from './ModalActionButtons';

const StockUpdateDeviceModal = ({ isOpen, onClose, onSubmit, device }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const deviceTypeFields = useSelector(getDeviceTypeFields);

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchDeviceTypeFields());
    }
  }, [isOpen, dispatch]);

  const formatters = useMemo(() => ({
    macAddress: formatMacAddress,
    ipAddress: formatIpAddress,
    uppercaseAlphaNumeric: transformUppercaseAlphaNumeric
  }), []);

  const fields = useMemo(() => {
    const deviceType = device?.deviceType;
    if (!deviceType) return [];
    return deviceTypeFields[deviceType.toUpperCase()] || [];
  }, [device?.deviceType, deviceTypeFields]);

  const schema = useMemo(() => {
    const shape = {};
    const { required, mustBeNumber, minValue, maxValue, mustBeGreaterThan } = validation(t);

    fields.forEach((field) => {
      let rule;
      if (field.type === 'number') {
        rule = Yup.number().typeError(mustBeNumber(field.label));
        if (field.required) rule = rule.required(required(field.label));
        if (field.min !== undefined && field.min !== '') rule = rule.min(field.min, minValue(field.label, field.min));
        if (field.max !== undefined && field.max !== '') rule = rule.max(field.max, maxValue(field.label, field.max));
      } else if (field.type === 'date') {
        rule = Yup.string();
        if (field.required) rule = rule.required(required(field.label));
        if (field.minValueRef) {
          const refField = fields.find((f) => f.name === field.minValueRef);
          const refLabel = refField ? refField.label : field.minValueRef;
          rule = rule.test('date-min', mustBeGreaterThan(field.label, refLabel), (value, context) => {
            const start = context.parent[field.minValueRef];
            if (!value || !start) return true;
            return new Date(value) >= new Date(start);
          });
        }
      } else {
        rule = Yup.string();
        if (field.required) rule = rule.required(required(field.label));
        if (field.min !== undefined && field.min !== '') rule = rule.min(field.min, minValue(field.label, field.min));
        if (field.max !== undefined && field.max !== '') rule = rule.max(field.max, maxValue(field.label, field.max));
        if (field.regex) rule = rule.matches(new RegExp(field.regex), t('invalidFormat', { 0: field.label }));
        if (field.format === 'macAddress') rule = rule.matches(regex.macAddress, t('invalidMacAddress'));
        if (field.format === 'ipAddress') rule = rule.matches(regex.ipAddress, t('invalidIpAddress'));
      }
      shape[field.name] = rule;
    });

    return Yup.object().shape(shape);
  }, [fields, t]);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema)
  });

  useEffect(() => {
    if (isOpen && device) {
      const deviceKeyMap = {
        deviceMac: 'macAddress',
        deviceSlno: 'serialNumber'
      };
      const defaults = {};
      fields.forEach((field) => {
        const deviceKey = deviceKeyMap[field.name] ?? field.name;
        if (device[deviceKey] != null) {
          defaults[field.name] = field.type === 'date' ? normalizeDateToISO(device[deviceKey]) : device[deviceKey];
        }
      });
      reset(defaults);
    }
  }, [isOpen, device, fields, reset]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleFormSubmit = (data) => {
    onSubmit({
      device,
      ...data,
      deviceCondition: 'UPDATED'
    });
    handleClose();
  };

  return (
    <Popup
      isOpen={isOpen}
      onOpenChange={(e) => {
        if (!e.open) handleClose();
      }}
      title={t('update')}
      titleMain={t('deviceDetails')}
      closeButton={false}
      initialFocusEl={null}
      width='986px'
      maxWidth='986px'
      borderRadius='12px'
    >
      <Box px={4} pb={4} pt={2}>
        <DeviceInfoHeader device={device} />

        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <VStack spacing={6} alignItems='stretch'>
            <Box>
              <Text color='primary.500' fontWeight='bold' mb={4}>
                {t('newDeviceDetails')}
              </Text>
              <SimpleGrid columns={{ base: 1, md: 3 }} gap={4} rowGap={5}>
                {fields.map((field) => (
                  <FormController
                    key={field.name}
                    control={control}
                    name={field.name}
                    labelName={field.label}
                    placeholder={t('enter', { 0: field.label })}
                    type={field.type}
                    errors={errors}
                    required={field.required}
                    min={field.min}
                    max={field.max}
                    {...(field.type !== 'number' && field.max !== undefined && { maxLength: field.max })}
                    {...(field.format && formatters[field.format] && {
                      handleChange: (e) => {
                        const formatter = formatters[field.format];
                        setValue(field.name, formatter(e.target.value), { shouldValidate: true });
                      }
                    })}
                    disablePortal={true}
                  />
                ))}
              </SimpleGrid>
            </Box>

            <ModalActionButtons onClose={handleClose} />
          </VStack>
        </form>
      </Box>
    </Popup>
  );
};

export default StockUpdateDeviceModal;
