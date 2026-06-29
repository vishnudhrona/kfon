import { yupResolver } from '@hookform/resolvers/yup';
import { Button, FormController, HStack, Popup, Stack,useForm, VStack } from '@kfonbss/bss-ui-components';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import { Close, Save } from '@/components/custom';

import { submitTicketData } from '../action';
import { ticketFormSchema } from '../validation';


const TicketPopup = ({ isOpen, setIsOpen }) => {

  const { t } = useTranslation();
  const dispatch = useDispatch()

    const translatedSchema = useMemo(() => ticketFormSchema(t), [t]);

  const {
    control,
    formState: { errors },
    handleSubmit
  } = useForm({ resolver: yupResolver(translatedSchema) });

  const onSubmit = (data) => {
    dispatch(submitTicketData(data))
  };

  return (
    <Stack>
      <Popup isOpen={isOpen} title={t('createNewTicket')} size='sm' placement='center' onOpenChange={setIsOpen}>
        <VStack as={'form'} onSubmit={handleSubmit(onSubmit)} alignItems='stretch' gap={5} p={4}>
          <FormController
            control={control}
            name={'selectSubject'}
            errors={errors}
            type='text'
            labelName={t('selectSubject')}
            placeholder={t('selectSubject')}
            required
          />

          <FormController
            control={control}
            name='attachment'
            errors={errors}
            type='file'
            labelName={t('attachment')}
            placeholder={t('attachment')}
            required
          />

          <FormController
            control={control}
            name={'description'}
            errors={errors}
            type='textArea'
            labelName={t('description')}
            placeholder={t('remarks')}
            resize='none'
            required
          />

          <HStack ml='auto'>
            <Button variant='outline' onClick={() => setIsOpen(false)}>
              <Close />
              {t('close')}
            </Button>

            <Button type='submit'>
              {t('saveTicket')}
              <Save />
            </Button>
          </HStack>
        </VStack>
      </Popup>
    </Stack>
  );
};

export default TicketPopup;

