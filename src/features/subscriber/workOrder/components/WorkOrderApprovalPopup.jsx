import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, FormController, useForm, VStack } from '@kfonbss/bss-ui-components';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import * as yup from 'yup';

import { BsXCircle, Save } from '@/components/custom';

import { approveWorkOrder, fetchWorkOrderList } from '../actions';
import { WORK_ORDER_TABLE_KEY } from '../constants';

const validationSchema = (t) =>
  yup.object({
    status: yup.object().required(t('decisionRequired')),
    remarks: yup.string().required(t('remarksRequired'))
  });

const WorkOrderApprovalPopup = ({ data, onClose }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const statusOptions = useMemo(
    () => [
      { id: 'APPROVED', name: t('approved') },
      { id: 'REJECTED', name: t('rejected') }
    ],
    [t]
  );

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(validationSchema(t)),
    defaultValues: {
      status: '',
      remarks: ''
    }
  });

  useEffect(() => {
    if (data) {
      const currentStatus = statusOptions.find((opt) => opt.id === data.currentStatus);
      reset({
        status: currentStatus || '',
        remarks: data.remarks || ''
      });
    }
  }, [data, reset, statusOptions]);

  const onSubmit = (formData) => {
    dispatch(
      approveWorkOrder({
        workorderId: data.workorderId,
        status: formData.status.id,
        remarks: formData.remarks,
        onSuccess: () => {
          dispatch(fetchWorkOrderList({ key: WORK_ORDER_TABLE_KEY, size: 10 }));
          onClose();
        }
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
              labelName={t('decisionLabel')}
              placeholder={t('selectDecision')}
              items={statusOptions}
              errors={errors}
              required
            />
            <FormController
              type='textarea'
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
                {t('confirmDecision')}
                <Save />
              </Button>
            </Box>
          </VStack>
        </form>
      </Box>
    </Box>
  );
};

export default WorkOrderApprovalPopup;
