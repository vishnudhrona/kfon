import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, FormController, useForm, VStack } from '@kfonbss/bss-ui-components';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { BsXCircle, Save } from '@/components/custom';
import { errorToast } from '@/components/custom/Toast';

import { fetchLnpPartnerStatusDropdown, updateAgnpPartner, updateLnpPartner } from '../action';
import { getLnpPartnerStatusOptions } from '../selector';
import { actions as onboardingActions } from '../slice';
import { partnerPreviewUpdate } from '../validation';

const ALLOWED_STATUSES = {
  feasibility: ['feasible', 'not feasible'],
  approve: ['approved', 'rejected']
};

const PartnerStatusPopup = ({ data, onClose, partnerType = 'lnp', mode = 'feasibility', isOpen = false }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const statusOptions = useSelector(getLnpPartnerStatusOptions);

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      dispatch(onboardingActions.clearPartnerStatusOptions());
      dispatch(fetchLnpPartnerStatusDropdown({ type: partnerType }));
    }
  }, [dispatch, isOpen, partnerType]);

  useEffect(() => {
    if (statusOptions.length > 0) setIsLoading(false);
  }, [statusOptions]);

  const filteredStatusOptions = useMemo(() => {
    if (!Array.isArray(statusOptions)) return [];
    const allowed = ALLOWED_STATUSES[mode];
    if (!allowed) {
      console.warn(`PartnerStatusPopup: unknown mode "${mode}"`);
      return [];
    }
    return statusOptions.filter((opt) => allowed.includes(opt?.name?.toLowerCase()));
  }, [statusOptions, mode]);

  const schema = useMemo(() => yupResolver(partnerPreviewUpdate(t)), [t]);

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: schema,
    defaultValues: {
      status: '',
      remarks: ''
    }
  });

  const onSubmit = (formData) => {
    if (!data?.enquiryId) {
      errorToast({ description: t('enquiryIdMissing') });
      return;
    }

    const updateAction = partnerType === 'agnp' ? updateAgnpPartner : updateLnpPartner;
    dispatch(
      updateAction({
        enquiryId: data.enquiryId,
        statusId: formData.status.id,
        remarks: formData.remarks,
        onSuccess: onClose
      })
    );
  };

  return (
    <Box p={4} pt={0} bg='white'>
      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack spacing={4} gap={3} align='stretch'>
          <FormController
            type='select'
            control={control}
            name='status'
            labelName={t('status')}
            placeholder={t('selectAnOption')}
            items={filteredStatusOptions}
            errors={errors}
            required
            isLoading={isLoading}
          />
          <FormController
            type='textArea'
            control={control}
            name='remarks'
            labelName={t('remarks')}
            placeholder={t('enterRemarks')}
            errors={errors}
            required
            rows={4}
          />

          <Box display='flex' justifyContent='flex-end' gap={3} mt={4}>
            <Button variant='outline' size='md' onClick={onClose}>
              <BsXCircle />
              {t('cancel')}
            </Button>
            <Button type='submit' colorScheme='primary' size='md'>
              {t('submit')}
              <Save />
            </Button>
          </Box>
        </VStack>
      </form>
    </Box>
  );
};

export default PartnerStatusPopup;
