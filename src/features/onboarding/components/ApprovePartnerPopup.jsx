import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, FormController, useForm, VStack } from '@kfonbss/bss-ui-components';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { BsXCircle, Save } from '@/components/custom';

import { fetchLnpPartnerStatusDropdown, updateAgnpPartner, updateLnpPartner } from '../action';
import { getLnpPartnerStatusOptions } from '../selector';
import { partnerPreviewUpdate } from '../validation';

const ApprovePartnerPopup = ({ data, onClose, partnerType = 'lnp' }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const statusOptions = useSelector(getLnpPartnerStatusOptions);

  useEffect(() => {
    dispatch(fetchLnpPartnerStatusDropdown({ type: partnerType }));
  }, [dispatch, partnerType]);

  const filteredStatusOptions = useMemo(() => {
    if (!Array.isArray(statusOptions)) return [];
    const allowed = ['approved', 'rejected'];
    return statusOptions.filter((opt) => allowed.includes(opt?.name?.toLowerCase()));
  }, [statusOptions]);

  const currentStatus = partnerType === 'agnp' ? data?.agnpStatus : data?.status;
  const currentRemarks = partnerType === 'agnp' ? data?.agnpRemarks : data?.remarks;

  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(partnerPreviewUpdate(t)),
    defaultValues: {
      status: currentStatus || '',
      remarks: currentRemarks || ''
    }
  });

  useEffect(() => {
    if (data) {
      const matchedStatus = filteredStatusOptions?.find(
        (item) => item?.id === currentStatus?.id || item?.name === currentStatus
      );
      reset({
        status: matchedStatus || currentStatus || '',
        remarks: currentRemarks || ''
      });
    }
  }, [data, reset, filteredStatusOptions, currentStatus, currentRemarks]);

  const onSubmit = (formData) => {
    if (!data?.enquiryId) return;

    const currentStatusId = currentStatus?.id;
    if (formData?.status?.id === currentStatusId) {
      setError('status', { type: 'manual', message: t('noChangesDetected') });
      return;
    }

    const updateAction = partnerType === 'agnp' ? updateAgnpPartner : updateLnpPartner;
    dispatch(
      updateAction({
        enquiryId: data.enquiryId,
        statusId: formData?.status?.id,
        remarks: formData?.remarks,
        onSuccess: onClose
      })
    );
  };

  return (
    <Box>
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
    </Box>
  );
};

export default ApprovePartnerPopup;
