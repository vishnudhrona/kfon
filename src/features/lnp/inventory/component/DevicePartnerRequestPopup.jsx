import { Button, FormController, HStack, Popup, useForm, VStack } from '@kfonbss/bss-ui-components';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Close, Save } from '@/components/custom';

const DevicePartnerRequest = () => {
  const { t } = useTranslation();

  const [open] = useState(true);

  const {
    control,
    formState: { errors }
  } = useForm();

  return (
    <Popup title={t('createNewRequest')} isOpen={open}>
      <VStack alignItems={'stretch'} gap={5} px={8} py={5}>
        <FormController
          placeholder={`${t('select')} ${t('deviceType')}`}
          labelName={t('deviceType')}
          name='otp'
          control={control}
          errors={errors}
          type='select'
          required
        />

        <FormController
          placeholder={t('deviceCount')}
          labelName={t('deviceCount')}
          name='otp'
          control={control}
          errors={errors}
          required
        />

        <FormController
          placeholder={t('remarks')}
          labelName={t('remarks')}
          name='otp'
          control={control}
          errors={errors}
          type='textArea'
          resize='none'
          required
        />

        <HStack ml='auto' mt={5}>
          <Button
            variant='outline'
          >
            <Close />
            {t('close')}
          </Button>

          <Button type='submit'>
            {t('createRequest')}
            <Save />
          </Button>
        </HStack>
      </VStack>
    </Popup>
  );
};

export default DevicePartnerRequest;
