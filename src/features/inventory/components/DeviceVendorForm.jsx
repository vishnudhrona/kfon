import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button,
  ButtonGroup,
  Flex,
  FormController,
  Icons,
  Popup,
  SimpleGrid,
  useForm
} from '@kfonbss/bss-ui-components';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';

import { createDeviceVendor, fetchDeviceModelDropdown, updateDeviceVendor } from '../actions';
import { INVENTORY_KEYS } from '../constants';
import { getDropdownData } from '../selectors';
import { vendorSchema } from '../validations';

const { BsXCircle, BsCheckCircle } = Icons;

const DeviceVendorForm = ({
  title,
  open,
  setOpen,
  deviceModels,
  getDeviceModels,
  createDeviceVendor,
  updateDeviceVendor,
  editMode = false,
  editData = null,
  isPopup = true
}) => {
  const { t } = useTranslation();

  const schema = vendorSchema(t);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema)
  });

  useEffect(() => {
    getDeviceModels();
  }, [getDeviceModels]);

  // Pre-populate form when in edit mode
  useEffect(() => {
    if (open && editMode && editData) {
      const formattedModels = editData.vendorMap.map((model) => ({
        id: model.modelId,
        name: model.modelName
      }));

      reset({
        vendor: {
          name: editData.vendor.name,
          description: editData.vendor.description,
          mobileNumber: editData.vendor.mobileNumber,
          address: editData.vendor.address
        },
        vendorMap: formattedModels
      });
    } else if (open && !editMode) {
      reset({
        vendor: { name: '', description: '', mobileNumber: '', address: '' },
        vendorMap: []
      });
    }
  }, [open, editMode, editData, reset]);

  const onSubmit = (val) => {
    if (editMode && editData) {
      // In edit mode, preserve mapId for existing models
      const vendorMapWithIds = val.vendorMap.map((model) => {
        // Find if this model was in the original data
        const existingModel = editData.vendorMap.find((m) => m.modelId === model.id);

        return {
          modelId: model.id,
          modelName: model.name,
          ...(existingModel && { mapId: existingModel.mapId })
        };
      });

      const payload = {
        id: editData.vendor.vendorId,
        vendor: {
          ...val.vendor
        },
        vendorMap: vendorMapWithIds
      };

      updateDeviceVendor(payload);
    } else {
      // Create mode - no mapId needed
      const payload = {
        ...val,
        vendorMap: val.vendorMap.map((model) => ({
          modelId: model.id,
          modelName: model.name
        }))
      };

      createDeviceVendor(payload);
    }

    setOpen(false);
    reset({ vendor: { name: '', description: '', mobileNumber: '', address: '' }, vendorMap: [] });
  };

  // Get the initial models that should not be removable in edit mode
  const existingModelIds = editMode && editData ? editData.vendorMap.map((model) => model.modelId) : [];

  const content = (
    <form onSubmit={handleSubmit(onSubmit)}>
      <SimpleGrid columns={isPopup ? 1 : 3} spacing={4} align='stretch' gap='5' px='3'>
        <FormController
          name={'vendor.name'}
          control={control}
          errors={errors}
          type={'text'}
          required
          labelName={t('vendorName')}
          placeholder={t('enter', { 0: t('vendorName') })}
          disabled={editMode}
        />
        <FormController
          name={'vendor.description'}
          control={control}
          errors={errors}
          type={'text'}
          required
          labelName={t('description')}
          placeholder={t('enter', { 0: t('description') })}
        />
        <FormController
          name={'vendor.mobileNumber'}
          control={control}
          errors={errors}
          type={'text'}
          required
          labelName={t('mobileNumber')}
          placeholder={t('enter', { 0: t('mobileNumber') })}
        />
        <FormController
          name={'vendor.address'}
          control={control}
          errors={errors}
          type={'text'}
          required
          labelName={t('address')}
          placeholder={t('enter', { 0: t('address') })}
        />
        <FormController
          name={'vendorMap'}
          control={control}
          errors={errors}
          type={'select'}
          required
          labelName={t('models')}
          items={deviceModels}
          placeholder={t('choose', { 0: t('models') })}
          isMulti={true}
          menuPortalTarget={null}
          isOptionDisabled={(option) => editMode && existingModelIds.includes(option.id)}
        />

        <Flex gridColumn='1 / -1' w='full' justify='flex-end' mt='4'>
          <ButtonGroup variant='solid'>
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
            <Button type='submit' width='fit-content' h='10' px='4' py='2' variant={'solid'}>
              {t('save')}
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
const mapStateToProps = (state) => ({
  deviceModels: getDropdownData(INVENTORY_KEYS.DEVICE_MODEL_LIST)(state).map((model) => ({
    id: model.id,
    name: `${model.name} - ${model.deviceType} - ${model.deviceMake}`
  }))
});

const mapDispatchToProps = {
  getDeviceModels: fetchDeviceModelDropdown,
  createDeviceVendor: createDeviceVendor,
  updateDeviceVendor: updateDeviceVendor
};

export default connect(mapStateToProps, mapDispatchToProps)(DeviceVendorForm);
