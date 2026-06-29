import { yupResolver } from '@hookform/resolvers/yup';
import { Button, FormController, HStack, Popup, Stack, useForm, VStack } from '@kfonbss/bss-ui-components';
import { useTranslation } from 'react-i18next';

import { Close, Save } from '@/components/custom';

const MappingPopup = ({ isOpen, setIsOpen, isMap = true }) => {
  const { t } = useTranslation();

  const {
    control,
    formState: { errors },
    handleSubmit
  } = useForm({ resolver: yupResolver() });

  const onSubmit = (data) => {
    console.log(19, 'formData', data);
  };

  return (
    <Stack>
      <Popup
        isOpen={isOpen}
        title={isMap ? t('mapDevice') : t('unMapDevice')}
        size='xs'
        placement='center'
        onOpenChange={setIsOpen}
      >
        <VStack as={'form'} onSubmit={handleSubmit(onSubmit)} alignItems='stretch' gap={5} p={4}>
          {isMap ? (
            <>
              <FormController
                placeholder={t('deviceType')}
                labelName={t('deviceType')}
                name='deviceType'
                control={control}
                errors={errors}
                type='select'
                required
              />
              <FormController
                placeholder={t('device')}
                labelName={t('device')}
                name='device'
                control={control}
                errors={errors}
                type='select'
                required
              />
            </>
          ) : (
            <FormController
              placeholder={t('deviceStatus')}
              labelName={t('deviceStatus')}
              name='deviceStatus'
              control={control}
              errors={errors}
              type='select'
              required
            />
          )}

          <HStack ml='auto'>
            <Button variant='outline' onClick={() => setIsOpen(false)}>
              <Close />
              {t('close')}
            </Button>

            <Button type='submit'>
              <Save />
              {isMap ? t('mapDevice') : t('unMapDevice')}
            </Button>
          </HStack>
        </VStack>
      </Popup>
    </Stack>
  );
};

export default MappingPopup;
