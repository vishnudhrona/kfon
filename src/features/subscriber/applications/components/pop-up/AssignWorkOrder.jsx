import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, FormController, Popup, useForm, VStack } from '@kfonbss/bss-ui-components';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import * as yup from 'yup';

import { BsXCircle, Save } from '@/components/custom';

import { assignWorkOrder, fetchEwsWorkOrderDropdown } from '../../../workOrder/actions';
import { getEwsWorkOrderOptions } from '../../../workOrder/selectors';

const schema = (t) =>
  yup.object().shape({
    workOrder: yup.object().required(t('workOrderIsRequired')),
    remarks: yup.string().required(t('remarksIsRequired'))
  });

const AssignWorkOrder = ({ data, open, onClose }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const workOrderOptions = useSelector(getEwsWorkOrderOptions);

  useEffect(() => {
    if (open) {
      dispatch(fetchEwsWorkOrderDropdown());
    }
  }, [dispatch, open]);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema(t)),
    defaultValues: {
      workOrder: '',
      remarks: ''
    }
  });

  useEffect(() => {
    if (open) {
      reset({
        workOrder: '',
        remarks: ''
      });
    }
  }, [open, reset]);

  const onSubmit = (formData) => {
    if (!data?.enquiryId) return;

    dispatch(
      assignWorkOrder({
        enquiryId: data.enquiryId,
        workOrderId: formData?.workOrder?.id,
        remarks: formData?.remarks,
        onSuccess: onClose
      })
    );
  };

  return (
    <Popup title={t('assignWorkOrder')} titleMain={data?.trackingId} isOpen={open} onOpenChange={onClose} size='md'>
      <Box p={4} pt={0} bg='white'>
        <form onSubmit={handleSubmit(onSubmit)}>
          <VStack spacing={4} gap={3} align='stretch'>
            <FormController
              type='select'
              control={control}
              name='workOrder'
              labelName={t('workOrder')}
              placeholder={t('selectAnOption')}
              getOptionLabel={(option) => option.wono}
              getOptionValue={(option) => option.workorderId}
              items={workOrderOptions}
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
    </Popup>
  );
};

export default AssignWorkOrder;
