import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button,
  ButtonGroup,
  Flex,
  FormController,
  Headline,
  Icons,
  SimpleGrid,
  useForm,
  useWatch,
  VStack
} from '@kfonbss/bss-ui-components';
import { useRouter } from '@tanstack/react-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';

import {
  createDeviceModel,
  fetchDeviceCategoryDropdown,
  fetchDeviceMakeDropdown,
  fetchDeviceTypeDropdown
} from '../actions';
import { INVENTORY_KEYS } from '../constants';
import { getDropdownData } from '../selectors';
import { deviceModelSchema } from '../validations';
import DeviceConfigForm from './DeviceConfigForm';

const { BsArrowLeftCircle, BsCheckCircle } = Icons;

const AddDeviceModelForm = ({
  deviceTypes,
  deviceMakes,
  deviceCategories,
  getDeviceTypes,
  getDeviceMakes,
  getDeviceCategories,
  createDeviceModel
}) => {
  const { t } = useTranslation();
  const schema = deviceModelSchema(t);
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema)
  });
  const deviceType = useWatch({ control, name: 'deviceType' });

  const filteredDeviceCategories = useMemo(() => {
    if (deviceType?.name?.toLowerCase()?.includes('olt')) {
      return deviceCategories.filter((category) => category?.numberOfPorts);
    }
    return deviceCategories;
  }, [deviceCategories, deviceType]);

  const [popup, setOpen] = useState(false);
  const router = useRouter();

  const handleModelSubmit = useCallback(
    (val) => {
      const payload = {
        typeId: val.deviceType?.id,
        typeName: val.deviceType?.name,
        makeId: val.deviceMake?.id,
        makeName: val.deviceMake?.name,
        categoryId: val.deviceCategory?.id,
        categoryName: val.deviceCategory?.name,
        modelName: val.modelName,
        modelDescription: val.modelDescription,
        onSuccess: () => {
          router.navigate({ to: '/app/inventory/device-model-list' });
        }
      };

      createDeviceModel(payload);
    },
    [createDeviceModel, router]
  );

  useEffect(() => {
    getDeviceTypes();
    getDeviceMakes();
    getDeviceCategories();
  }, [getDeviceTypes, getDeviceMakes, getDeviceCategories]);

  return (
    <VStack alignItems={'stretch'} h='full' position={'relative'}>
      <Headline headName={t('addDeviceModel')} />
      <form onSubmit={handleSubmit(handleModelSubmit)}>
        <SimpleGrid
          mt='7'
          px='8'
          columns={{ base: 1, lg: 2, xl: 3 }}
          columnGap={{ base: 4, md: 6, lg: 8, xl: 16 }}
          rowGap={10}
        >
          <FormController
            placeholder={t('enter', { 0: t('deviceModelName') })}
            labelName={t('deviceModelName')}
            name='modelName'
            errors={errors}
            control={control}
            required
          />

          <FormController
            placeholder={t('choose', { 0: t('deviceType') })}
            labelName={t('deviceType')}
            name='deviceType'
            errors={errors}
            control={control}
            type='select'
            items={deviceTypes}
            selectProps={{
              creatable: true,
              addText: t('addDeviceType'),
              onAddClick: () => {
                setOpen({
                  name: 'deviceTypeList',
                  title: t('addDeviceType')
                });
              }
            }}
            required
          />
          <FormController
            placeholder={t('choose', { 0: t('deviceMake') })}
            labelName={t('deviceMake')}
            name='deviceMake'
            errors={errors}
            control={control}
            items={deviceMakes}
            type='select'
            selectProps={{
              creatable: true,
              addText: t('addDeviceMake'),
              onAddClick: () => {
                setOpen({
                  name: 'deviceMakeList',
                  title: t('addDeviceMake')
                });
              }
            }}
            required
          />
          <FormController
            placeholder={t('choose', { 0: t('deviceCategory') })}
            labelName={t('deviceCategory')}
            name='deviceCategory'
            errors={errors}
            control={control}
            items={filteredDeviceCategories}
            type='select'
            selectProps={{
              creatable: true,
              addText: t('addDeviceCategory'),
              onAddClick: () => {
                setOpen({
                  name: 'deviceCategoryList',
                  title: t('addDeviceCategory')
                });
              }
            }}
            required
          />
          <FormController
            placeholder={t('enter', { 0: t('description') })}
            labelName={t('description')}
            name='modelDescription'
            errors={errors}
            control={control}
            required
          />

          <Flex w='full' justify='flex-end' pb={5} pr='5' position={'absolute'} bottom={0} right={0}>
            <ButtonGroup variant='solid'>
              <Button
                width='fit-content'
                h='10'
                px='4'
                py='2'
                variant={'outline'}
                onClick={() => router.history.back()}
              >
                <BsArrowLeftCircle />
                {t('back')}
              </Button>
              <Button type='submit' width='fit-content' h='10' px='4' py='2' variant={'solid'}>
                {t('submit')}
                <BsCheckCircle />
              </Button>
            </ButtonGroup>
          </Flex>
        </SimpleGrid>
      </form>
      {popup?.name && (
        <DeviceConfigForm source='dropdown' name={popup.name} open={popup} setOpen={setOpen} title={popup.title} />
      )}
    </VStack>
  );
};

const mapStateToProps = (state) => ({
  deviceTypes: getDropdownData(INVENTORY_KEYS.DEVICE_TYPE_LIST)(state),
  deviceMakes: getDropdownData(INVENTORY_KEYS.DEVICE_MAKE_LIST)(state),
  deviceCategories: getDropdownData(INVENTORY_KEYS.DEVICE_CATEGORY_LIST)(state)
});

const mapDispatchToProps = {
  getDeviceTypes: fetchDeviceTypeDropdown,
  getDeviceMakes: fetchDeviceMakeDropdown,
  getDeviceCategories: fetchDeviceCategoryDropdown,
  createDeviceModel: createDeviceModel
};

export default connect(mapStateToProps, mapDispatchToProps)(AddDeviceModelForm);
