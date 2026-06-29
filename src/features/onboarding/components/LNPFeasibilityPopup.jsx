import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, FormController, useForm, VStack } from '@kfonbss/bss-ui-components';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { BsXCircle, Save } from '@/components/custom';

import { fetchLnpPartnerStatusDropdown, updateLnpPartner } from '../action';
import { getLnpPartnerStatusOptions } from '../selector';
import { partnerPreviewUpdate } from '../validation';

const LNPFeasibilityPopup = ({ data, onClose }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const statusOptions = useSelector(getLnpPartnerStatusOptions);

  useEffect(() => {
    dispatch(fetchLnpPartnerStatusDropdown({ type: 'lnp' }));
  }, [dispatch]);

  const filteredStatusOptions = useMemo(() => {
    if (!Array.isArray(statusOptions)) return [];
    const allowed = ['feasible', 'not feasible'];
    return statusOptions.filter((opt) => allowed.includes(opt?.name?.toLowerCase()));
  }, [statusOptions]);

  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(partnerPreviewUpdate(t)),
    defaultValues: {
      status: data?.status || '',
      remarks: data?.remarks || ''
    }
  });

  useEffect(() => {
    if (data) {
      const currentStatus = filteredStatusOptions?.find((item) => item?.id === data?.status?.id || item?.name === data?.status);
      reset({
        status: currentStatus || data.status || '',
        remarks: data.remarks || ''
      });
    }
  }, [data, reset, filteredStatusOptions]);

  const onSubmit = async (formData) => {
    if (!data?.enquiryId) {
      return;
    }

    const currentStatusId = data?.status?.id;
    if (formData?.status?.id === currentStatusId) {
      setError('status', { type: 'manual', message: t('noChangesDetected') });
      return;
    }

    dispatch(
      updateLnpPartner({
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

export default LNPFeasibilityPopup;
