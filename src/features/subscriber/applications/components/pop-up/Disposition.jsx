import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, Flex, FormController, Icons, Popup, SimpleGrid, useForm } from '@kfonbss/bss-ui-components';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { DATE_FORMAT } from '@/constants/date';
import { formatDate } from '@/utils/dateUtils';

import { fetchDispositionList, fetchReasonList, submitDisposition } from '../../actions';
import { getDispositionList, getReasonList } from '../../selectors';
import { dispositionValidationSchema } from '../../validation';

const { BsXCircle, BsArrowRightCircle } = Icons;

const selectProps = {
  getOptionLabel: (o) => o.name,
  getOptionValue: (o) => o.code
};

const Disposition = ({ open, setOpen, enquiryId }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const dispositionList = useSelector(getDispositionList);
  const reasonList = useSelector(getReasonList);

  const DAY_ITEMS = [
    { id: 'Day', name: t('day') },
    { id: 'Date', name: t('date') }
  ];

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(dispositionValidationSchema(t)),
    defaultValues: {
      disposition: '',
      reason: '',
      followUpCount: '',
      followUpUnit: 'Day',
      remarks: ''
    }
  });

  const selectedDisposition = watch('disposition');
  const selectedFollowUpUnit = watch('followUpUnit');

  useEffect(() => {
    dispatch(fetchDispositionList());
  }, [dispatch]);

  useEffect(() => {
    if (selectedDisposition) {
      const dispositionCode = typeof selectedDisposition === 'object' ? selectedDisposition.code : selectedDisposition;
      dispatch(fetchReasonList(dispositionCode));
      setValue('reason', '');
    }
  }, [selectedDisposition, dispatch, setValue]);

  useEffect(() => {
    setValue('followUpCount', '');
  }, [selectedFollowUpUnit, setValue]);

  const handleClose = (isOpen) => {
    reset();
    setOpen(isOpen);
  };

  const onSubmit = (data) => {
    const isDateUnit = data.followUpUnit?.id === 'Date';
    const body = {
      enquiryId,
      customerEnquiryId: enquiryId,
      disposition: typeof data.disposition === 'object' ? data.disposition.code : data.disposition,
      reason: typeof data.reason === 'object' ? data.reason.code : data.reason,
      type: isDateUnit ? 'DATE' : 'DAY',
      day: isDateUnit ? 0 : Number(data.followUpCount) || 0,
      remarks: data.remarks,
      ...(isDateUnit &&
        data.followUpCount && {
          date: formatDate(data.followUpCount, DATE_FORMAT.DATE_YYYYMMDD)
        })
    };
    dispatch(submitDisposition(body));
    handleClose(false);
  };

  return (
    <Popup
      title={t('add')}
      titleMain={t('disposition')}
      isOpen={open}
      onOpenChange={handleClose}
      size='md'
      closeOnInteractOutside={false}
    >
      <Box as='form' onSubmit={handleSubmit(onSubmit)}>
        <SimpleGrid columns={1} spacing={4} px={4} gap='3' borderRadius='8px' bg='#FFF' mb='6'>
          <FormController
            control={control}
            errors={errors}
            name='disposition'
            labelName={t('disposition')}
            required
            type='select'
            placeholder={t('chooseDisposition')}
            items={dispositionList}
            {...selectProps}
          />

          <FormController
            control={control}
            errors={errors}
            name='reason'
            labelName={t('reason')}
            required
            type='select'
            placeholder={t('chooseReason')}
            items={reasonList}
            {...selectProps}
          />

          <Box>
            <Box fontSize='sm' fontWeight='medium' mb={2} color='gray.700'>
              {t('followUp')}
            </Box>
            <Flex gap={3}>
              <Box w='120px'>
                <FormController
                  control={control}
                  errors={errors}
                  name='followUpUnit'
                  type='select'
                  placeholder={t('day')}
                  items={DAY_ITEMS}
                />
              </Box>
              <Box flex={1}>
                <FormController
                  control={control}
                  errors={errors}
                  name='followUpCount'
                  type={selectedFollowUpUnit.id === 'Date' ? 'date' : 'number'}
                  placeholder={selectedFollowUpUnit.id === 'Date' ? undefined : 'days'}
                  disablePortal={true}
                  disablePast
                />
              </Box>
            </Flex>
          </Box>

          <FormController
            control={control}
            errors={errors}
            name='remarks'
            labelName={t('remarks')}
            required
            type='textArea'
            placeholder={t('enterRemarks')}
            rows={4}
          />
        </SimpleGrid>

        <Flex w='full' justify='flex-end' pb={5} gap={3}>
          <Button
            variant='outline'
            onClick={() => handleClose(false)}
            colorScheme='pink'
            px='18px'
            borderRadius='48px'
            fontSize='16px'
            fontWeight='400'
          >
            <BsXCircle style={{ marginRight: '6px', width: '24px', height: '24px' }} /> {t('cancel')}
          </Button>
          <Button type='submit' variant='solid' px='18px' borderRadius='48px' fontSize='16px' fontWeight='400'>
            {t('done')} <BsArrowRightCircle style={{ marginLeft: '6px', width: '24px', height: '24px' }} />
          </Button>
        </Flex>
      </Box>
    </Popup>
  );
};

export default Disposition;
