import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, Flex, FormController, Icons, Popup, SimpleGrid, useForm } from '@kfonbss/bss-ui-components';
import { useTranslation } from 'react-i18next';

import { rejectSubscriberValidationSchema } from '../../validation';

const { BsXCircle, BsArrowRightCircle } = Icons;

const RejectReason = ({ open, setOpen, onConfirm, isLoading = false }) => {
  const { t } = useTranslation();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(rejectSubscriberValidationSchema(t)),
    defaultValues: { rejectionReason: '' }
  });

  const handleClose = (isOpen) => {
    reset();
    setOpen(isOpen);
  };

  const onSubmit = (data) => {
    onConfirm(data.rejectionReason.trim());
    handleClose(false);
  };

  return (
    <Popup
      title={t('reject')}
      titleMain={t('subscriber')}
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
            name='rejectionReason'
            labelName={t('reason')}
            required
            type='textArea'
            placeholder={t('enter', { 0: t('reason') })}
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
          <Button
            type='submit'
            variant='solid'
            px='18px'
            borderRadius='48px'
            fontSize='16px'
            fontWeight='400'
            loading={isLoading}
          >
            {t('submit')} <BsArrowRightCircle style={{ marginLeft: '6px', width: '24px', height: '24px' }} />
          </Button>
        </Flex>
      </Box>
    </Popup>
  );
};

export default RejectReason;
