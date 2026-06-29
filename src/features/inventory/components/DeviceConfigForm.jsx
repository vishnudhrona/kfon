import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button,
  ButtonGroup,
  Flex,
  FormController,
  Icons,
  Popup,
  SimpleGrid,
  Text,
  useForm,
  useWatch
} from '@kfonbss/bss-ui-components';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import { CustomCheckbox } from '@/components/custom';

import { createDeviceCategory, createDeviceMake, createDeviceType } from '../actions';
import { DEVICE_CONFIG_FIELDS, INVENTORY_KEYS } from '../constants';
import { useDeviceDropdowns } from '../hooks/useDeviceDropdowns';
import { getValidationSchema } from '../validations';
import DeviceVendorForm from './DeviceVendorForm';

const { BsXCircle, BsCheckCircle } = Icons;

const API_MAP = {
  [INVENTORY_KEYS.DEVICE_TYPE_LIST]: createDeviceType,
  [INVENTORY_KEYS.DEVICE_MAKE_LIST]: createDeviceMake,
  [INVENTORY_KEYS.DEVICE_CATEGORY_LIST]: createDeviceCategory
};

const DeviceConfigForm = ({
  name,
  title,
  open,
  setOpen,
  source = '',
  editMode = false,
  editData = null,
  isPopup = true
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const schema = useMemo(() => {
    return getValidationSchema(name, t);
  }, [t, name]);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { deviceType: null }
  });

  const { deviceTypes } = useDeviceDropdowns(name === 'deviceCategoryList');
  const isPonPort = useWatch({ control, name: 'isPonPort' });

  const dropdownItems = useMemo(() => ({ deviceType: deviceTypes }), [deviceTypes]);

  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open, reset]);

  const onSubmit = (val) => {
    dispatch(
      API_MAP[name]({
        ...val,
        source,
        onSuccess: () => {
          setOpen(false);
          reset();
        }
      })
    );
  };

  if (name === 'deviceVendorList') {
    return <DeviceVendorForm {...{ title, open, setOpen, editMode, editData, isPopup }} />;
  }

  const content = (
    <form onSubmit={handleSubmit(onSubmit)}>
      <SimpleGrid columns={isPopup ? 1 : 3} spacing={4} align='stretch' gap='5' px='3'>
        {DEVICE_CONFIG_FIELDS[name].map((field) => (
          <FormController
            key={field.name}
            name={field.name}
            control={control}
            errors={errors}
            type={field.type}
            required
            labelName={t(field.label)}
            placeholder={t('enter', { 0: t(field.label) })}
            {...(dropdownItems[field.name] && { items: dropdownItems[field.name] })}
            {...field?.props}
          />
        ))}

        {name === 'deviceCategoryList' && (
          <>
            <CustomCheckbox
              {...control.register('isPonPort')}
              onChange={(e) => {
                control.register('isPonPort').onChange(e);
                if (!e.target.checked) {
                  control.unregister('numberOfPorts');
                }
              }}
            >
              <Text fontSize='md'>{t('addPonPortNumber')}</Text>
            </CustomCheckbox>

            {isPonPort && (
              <FormController
                name='numberOfPorts'
                control={control}
                errors={errors}
                type='number'
                required
                labelName={t('numberOfPorts')}
                placeholder={t('enter', { 0: t('numberOfPorts') })}
                onInput={(e) => {
                  if (e.target.value.length > 2) {
                    e.target.value = e.target.value.slice(0, 2);
                  }
                }}
              />
            )}
          </>
        )}

        <Flex gridColumn='1 / -1' w='full' justify='flex-end' mt='4'>
          <ButtonGroup variant='solid'>
            {isPopup && (
              <Button
                width='fit-content'
                h='10'
                px='4'
                py='2'
                variant={'outline'}
                onClick={() => setOpen && setOpen(false)}
              >
                <BsXCircle />
                {t('cancel')}
              </Button>
            )}
            <Button type='submit' width='fit-content' h='10' px='4' py='2' variant={'solid'}>
              {isPopup ? t('save') : t('add')}
              <BsCheckCircle />
            </Button>
          </ButtonGroup>
        </Flex>
      </SimpleGrid>
    </form>
  );

  if (!isPopup) {
    return content;
  }

  return (
    <Popup isOpen={open} onOpenChange={setOpen} title={title}>
      {content}
    </Popup>
  );
};

export default DeviceConfigForm;
