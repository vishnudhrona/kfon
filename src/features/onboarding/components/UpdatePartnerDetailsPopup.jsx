import { Box, Button, FormController, Grid, HStack, Popup, useForm } from '@kfonbss/bss-ui-components';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';

import { Close, Save } from '@/components/custom';
import { getApiProgress } from '@/features/others/ApiProgress/selectors';

import {
  ACTION_TYPES,
  fetchLinkEstablishmentStatusOptions,
  fetchLinkTypeOptions,
  updatePartnerDetails
} from '../action';
import { getLinkEstablishmentStatusOptions, getLinkTypeOptions } from '../selector';

const toSelectItems = (options) =>
  (options || []).map((opt) => {
    if (typeof opt === 'object' && opt !== null) {
      return { id: opt.value ?? opt.id ?? opt.name, name: opt.label ?? opt.name ?? String(opt.value) };
    }
    return { id: opt, name: String(opt) };
  });

const UpdatePartnerDetailsPopup = ({
  isOpen,
  onClose,
  id,
  agreementDetails,
  linkTypeOptions,
  linkEstablishmentStatusOptions,
  fetchLinkTypes,
  fetchLinkEstablishmentStatuses,
  onUpdate,
  isSaving
}) => {
  const { t } = useTranslation();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({ mode: 'onChange' });

  useEffect(() => {
    fetchLinkTypes();
    fetchLinkEstablishmentStatuses();
  }, [fetchLinkTypes, fetchLinkEstablishmentStatuses]);

  useEffect(() => {
    if (isOpen && agreementDetails) {
      reset({
        linkEstablishmentStatus: agreementDetails.linkEstablishmentStatus
          ? { id: agreementDetails.linkEstablishmentStatus, name: agreementDetails.linkEstablishmentStatus }
          : '',
        linkType: agreementDetails.linkType ? { id: agreementDetails.linkType, name: agreementDetails.linkType } : '',
        reasonForNotLinkDelivery: agreementDetails.reasonForNotLinkDelivery || '',
        briefReason: agreementDetails.briefReason || ''
      });
    }
  }, [isOpen, agreementDetails, reset]);

  const onSubmit = (data) => {
    const payload = {
      id,
      linkEstablishmentStatus: data.linkEstablishmentStatus?.id ?? data.linkEstablishmentStatus ?? null,
      linkType: data.linkType?.id ?? data.linkType ?? null,
      reasonForNotLinkDelivery: data.reasonForNotLinkDelivery || null,
      briefReason: data.briefReason || null,
      onSuccess: onClose
    };
    onUpdate(payload);
  };

  const linkEstablishmentStatusItems = linkEstablishmentStatusOptions?.length
    ? toSelectItems(linkEstablishmentStatusOptions)
    : [];

  const linkTypeItems = linkTypeOptions?.length ? toSelectItems(linkTypeOptions) : [];

  return (
    <Popup title={t('editLinkDetails')} isOpen={isOpen} onClose={onClose} size='lg'>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid templateColumns='1fr 1fr' gap={4} px={5} pt={2} pb={4}>
          <FormController
            labelName={t('linkEstablishmentStatus')}
            name='linkEstablishmentStatus'
            control={control}
            errors={errors}
            type='select'
            items={linkEstablishmentStatusItems}
            placeholder={t('select', { 0: t('linkEstablishmentStatus') })}
          />
          <FormController
            labelName={t('linkType')}
            name='linkType'
            control={control}
            errors={errors}
            type='select'
            items={linkTypeItems}
            placeholder={t('select', { 0: t('linkType') })}
          />
          <Box gridColumn='1 / -1'>
            <FormController
              labelName={t('reasonForNotLinkDelivery')}
              name='reasonForNotLinkDelivery'
              control={control}
              errors={errors}
              type='text'
              placeholder={t('enter', { 0: t('reasonForNotLinkDelivery') })}
            />
          </Box>
          <Box gridColumn='1 / -1'>
            <FormController
              labelName={t('briefReason')}
              name='briefReason'
              control={control}
              errors={errors}
              type='textArea'
              placeholder={t('enter', { 0: t('briefReason') })}
            />
          </Box>
        </Grid>
        <HStack justify='flex-end' px={5} pb={5} gap={3}>
          <Button variant='outline' onClick={onClose} type='button'>
            <Close />
            {t('cancel')}
          </Button>
          <Button type='submit' isLoading={isSaving}>
            <Save />
            {t('save')}
          </Button>
        </HStack>
      </form>
    </Popup>
  );
};

const mapStateToProps = (state) => ({
  linkTypeOptions: getLinkTypeOptions(state),
  linkEstablishmentStatusOptions: getLinkEstablishmentStatusOptions(state),
  isSaving: !!getApiProgress(state)?.[ACTION_TYPES.UPDATE_PARTNER_DETAILS]
});

const mapDispatchToProps = {
  fetchLinkTypes: fetchLinkTypeOptions,
  fetchLinkEstablishmentStatuses: fetchLinkEstablishmentStatusOptions,
  onUpdate: updatePartnerDetails
};

export default connect(mapStateToProps, mapDispatchToProps)(UpdatePartnerDetailsPopup);
