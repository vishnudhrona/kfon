import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, FormController, Popup, SimpleGrid, useForm } from '@kfonbss/bss-ui-components';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';

import { Close, Save } from '@/components/custom';
import { allowOnlyDigits, allowOnlyVlanShortNameChars } from '@/utils/validationUtils';

import { fetchVlanPartnerList, fetchVlanTypeList, submitVlanMapping, updateVlanMapping } from '../action';
import { getPartnerList, getVlanType } from '../selector';
import { vlanMappingValidation } from '../validation';

const EMPTY_VALUES = {
  partnerId: null,
  vlanId: '',
  vlanShortName: '',
  vlanType: null
};

const VlanMapping = ({
  isOpen,
  onClose,
  submit,
  update,
  fetchVlanType,
  vlanType,
  fetchPartnerList,
  partnerList,
  selectedMapping,
  onSuccess
}) => {
  const { t } = useTranslation();

  useEffect(() => {
    fetchVlanType();
    fetchPartnerList({ partnerType: 'LNP' });
  }, [fetchVlanType, fetchPartnerList]);

  const defaultValues = useMemo(() => {
    if (!selectedMapping) return EMPTY_VALUES;

    const selectedPartner =
      partnerList.find((item) => String(item.partnerId) === String(selectedMapping.franchiseId ?? selectedMapping.partnerId)) ?? null;
    const selectedVlanType =
      vlanType.find((item) => String(item.name).toLowerCase() === String(selectedMapping.nasType ?? selectedMapping.vlanType ?? '').toLowerCase()) ??
      null;

    return {
      partnerId: selectedPartner,
      vlanId: selectedMapping.vlanId ? String(selectedMapping.vlanId) : '',
      vlanShortName: selectedMapping.vlanShortName ?? '',
      vlanType: selectedVlanType
    };
  }, [partnerList, selectedMapping, vlanType]);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(vlanMappingValidation(t)),
    defaultValues,
    mode: 'onChange'
  });

  useEffect(() => {
    if (isOpen) {
      reset(defaultValues);
    }
  }, [defaultValues, isOpen, reset]);

  const isEditMode = Boolean(selectedMapping);

  const onSubmit = (data) => {
    const { partnerId } = data;
    const mappingId = selectedMapping?.tableId;
    const payload = {
      ...data,
      vlanType: data.vlanType.name,
      partnerId: partnerId?.partnerId,
      ...(mappingId ? { id: mappingId } : {}),
      onSuccess: () => {
        reset(EMPTY_VALUES);
        onSuccess?.();
        onClose(false);
      }
    };

    if (isEditMode) {
      update(payload);
    } else {
      submit(payload);
    }
  };

  const handleClose = () => {
    reset(EMPTY_VALUES);
    onSuccess?.();
    onClose(false);
  };

  return (
    <Popup title={selectedMapping ? t('editVlanMapping') : t('addNewVlanMapping')} isOpen={isOpen} onClose={handleClose} size={'lg'}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <SimpleGrid columns={2} gap={5} px={5}>
          <FormController
            placeholder={t('choose', { 0: t('selectPartner') })}
            labelName={t('selectPartner')}
            name='partnerId'
            control={control}
            errors={errors}
            type='select'
            items={partnerList}
            isDisabled={isEditMode}
            required
          />

          <FormController
            placeholder={t('vlanID')}
            labelName={t('vlanID')}
            name='vlanId'
            control={control}
            errors={errors}
            onKeyDown={allowOnlyDigits}
            maxLength={4}
            required
          />

          <FormController
            placeholder={t('vlanShortName')}
            labelName={t('vlanShortName')}
            name='vlanShortName'
            control={control}
            errors={errors}
            onKeyDown={allowOnlyVlanShortNameChars}
            maxLength={20}
            required
          />

          <FormController
            placeholder={t('choose', { 0: t('vlanType') })}
            labelName={t('vlanType')}
            name='vlanType'
            control={control}
            errors={errors}
            type='select'
            items={vlanType}
            required
          />

          <Box gridColumn={'span 2'} display={'flex'} justifyContent={'flex-end'} gap={3} mt={7}>
            <Button variant={'outline'} onClick={handleClose}>
              <Close />
              {t('cancel')}
            </Button>
            <Button variant={'solid'} type='submit'>
              <Save />
              {t('save')}
            </Button>
          </Box>
        </SimpleGrid>
      </form>
    </Popup>
  );
};

const mapStateToProps = (state) => ({
  vlanType: getVlanType(state),
  partnerList: getPartnerList(state)
});

const mapDispatchToProps = {
  fetchVlanType: fetchVlanTypeList,
  submit: submitVlanMapping,
  update: updateVlanMapping,
  fetchPartnerList: fetchVlanPartnerList
};

export default connect(mapStateToProps, mapDispatchToProps)(VlanMapping);
