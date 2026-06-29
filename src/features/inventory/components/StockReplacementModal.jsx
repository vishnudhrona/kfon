import { yupResolver } from '@hookform/resolvers/yup';
import { Box, FormController, Popup, SimpleGrid, Text, useForm, VStack } from '@kfonbss/bss-ui-components';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';

import { formatIpAddress, formatMacAddress, regex, transformUppercaseAlphaNumeric, validation } from '@/utils/validationUtils';

import { fetchDeviceTypeFields, fetchReplaceDeviceCondition } from '../actions';
import { getDeviceTypeFields, getReplaceDeviceCondition } from '../selectors';
import DeviceInfoHeader from './DeviceInfoHeader';
import ModalActionButtons from './ModalActionButtons';

const StockReplacementModal = ({ isOpen, onClose, onSubmit, device }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const replaceDeviceCondition = useSelector(getReplaceDeviceCondition);

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchReplaceDeviceCondition());
      dispatch(fetchDeviceTypeFields());
    }
  }, [isOpen, dispatch]);

  const deviceTypeFields = useSelector(getDeviceTypeFields);

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

    shape.condition = Yup.mixed().test('condition', required('condition'), (val) => val?.code ?? val);

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
    if (isOpen) reset({});
  }, [isOpen, reset]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleFormSubmit = (data) => {
    const { condition, ...deviceFields } = data;
    onSubmit({
      device,
      ...deviceFields,
      deviceCondition: condition?.code ?? condition
    });
    console.log('[StockReplacementModal] form data:', {
      ...deviceFields,
      deviceCondition: condition?.code ?? condition
    });
    handleClose();
  };

  return (
    <Popup
      isOpen={isOpen}
      onOpenChange={(e) => {
        if (!e.open) handleClose();
      }}
      title={t('replace')}
      titleMain={t('device')}
      closeButton={false}
      initialFocusEl={null}
      width='986px'
      maxWidth='986px'
      borderRadius='12px'
    >
      <Box px={4} pb={4} pt={2}>
        <DeviceInfoHeader device={device} />

        <form
          onSubmit={handleSubmit(handleFormSubmit, (errs) =>
            console.log('[StockReplacement] validation errors:', errs)
          )}
        >
          <VStack spacing={6} alignItems='stretch'>
            <Box>
              <Text color='primary.500' fontWeight='bold' mb={4}>
                {t('newDeviceDetails')}
              </Text>
              <SimpleGrid columns={{ base: 1, md: 3 }} gap={4} rowGap={5}>
                <FormController
                  type='select'
                  control={control}
                  name='condition'
                  labelName={t('condition')}
                  placeholder={t('choose', { 0: t('condition') })}
                  items={replaceDeviceCondition}
                  errors={errors}
                  required
                />
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

export default StockReplacementModal;
