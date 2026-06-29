import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button,
  ButtonGroup,
  Flex,
  FormController,
  Icons,
  SimpleGrid,
  useForm,
  VStack
} from '@kfonbss/bss-ui-components';
import { forwardRef, useEffect, useImperativeHandle, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

import {
  CSV_FILE,
  formatIpAddress,
  formatMacAddress,
  regex,
  transformUppercaseAlphaNumeric,
  validation
} from '@/utils/validationUtils';

const AddDeviceModal = forwardRef(
  (
    {
      isOpen,
      onClose,
      onAdd,
      deviceType,
      addingMethod,
      parentControl,
      parentErrors,
      fileName,
      onFileSelect,
      onDownloadSample,
      allFields = {}
    },
    ref
  ) => {
    const { t } = useTranslation();
    const fields = useMemo(() => allFields[deviceType?.toUpperCase()] || [], [allFields, deviceType]);

    const formatters = useMemo(
      () => ({
        macAddress: formatMacAddress,
        ipAddress: formatIpAddress,
        uppercaseAlphaNumeric: transformUppercaseAlphaNumeric
      }),
      []
    );

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
      resolver: yupResolver(schema),
      defaultValues: {}
    });

    useEffect(() => {
      if (isOpen) {
        reset({});
      }
    }, [isOpen, reset]);

    const onSubmit = (data) => {
      onAdd({ ...data, _id: crypto.randomUUID() });
      onClose();
      reset();
    };

    useImperativeHandle(ref, () => ({
      submitPending: () =>
        new Promise((resolve) => {
          handleSubmit(
            (data) => {
              onAdd({ ...data, _id: crypto.randomUUID() });
              reset();
              resolve(true);
            },
            () => resolve(false)
          )();
        })
    }));

    return (
      <VStack px='8' py='8' spacing={4} align='stretch'>
        <SimpleGrid columns={{ base: 1, md: 3 }} w='full' gap={4} rowGap={10} pb={4} position='relative'>
          <FormController
            labelName={t('Adding Method')}
            name='addingMethod'
            errors={parentErrors}
            control={parentControl}
            type='radio'
            required
            items={[
              { label: t('Normal'), value: 'normal' },
              { label: t('CSV'), value: 'csv' }
            ]}
          />
          {addingMethod === 'csv' && (
            <FormController
              placeholder={fileName ? fileName : t('dragAndDropFilesHere')}
              labelName={t('deviceDetailsFile')}
              name='deviceDetailsFile'
              errors={parentErrors}
              type='file'
              control={parentControl}
              accept={CSV_FILE}
              value={fileName}
              onFileSelect={onFileSelect}
              onCtaClick={onDownloadSample}
              ctaText={t('downloadSampleFile')}
              note={t('csvFileUploadNote')}
            />
          )}
          {addingMethod === 'normal' &&
            fields.map((field) => (
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
                {...(field.format &&
                  formatters[field.format] && {
                    handleChange: (e) => {
                      const formatter = formatters[field.format];
                      setValue(field.name, formatter(e.target.value), { shouldValidate: true });
                    }
                  })}
              />
            ))}
        </SimpleGrid>

        {addingMethod === 'normal' && (
          <Flex justify='flex-end' pt={4}>
            <ButtonGroup>
              <Button type='button' variant='outline' onClick={handleSubmit(onSubmit)}>
                {t('add')}
                <Icons.BsArrowRightCircle />
              </Button>
            </ButtonGroup>
          </Flex>
        )}
      </VStack>
    );
  }
);

export default AddDeviceModal;
