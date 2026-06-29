import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  Button,
  FormController,
  HStack,
  Popup,
  Preview,
  Stack,
  Text,
  useForm,
  VStack
} from '@kfonbss/bss-ui-components';
import { useTranslation } from 'react-i18next';

import { Close, Save } from '@/components/custom';

import { TOP_UP_DATA } from '../constants';

const RetailSubscriberPopup = ({
  isOpen,
  setIsOpen,
  isChangePackage = false,
  topUpPackage = false,
  ottRecharge = false
}) => {
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
        title={isChangePackage ? t('changePackage') : topUpPackage ? t('topUp') : ottRecharge ? t('ottRecharge') : ''}
        size='md'
        placement='center'
        onOpenChange={setIsOpen}
      >
        <VStack as={'form'} onSubmit={handleSubmit(onSubmit)} alignItems='stretch' gap={5} p={4}>
          {isChangePackage ? (
            <>
              <FormController
                placeholder={t('selectPackage')}
                labelName={t('selectPackage')}
                name='packageType'
                control={control}
                errors={errors}
                type='select'
                required
              />
            </>
          ) : topUpPackage ? (
            <Box alignItems='center' width='100%'>
              <Text textAlign='center' fontWeight='600' fontSize='16px' mb='12px'>
                Last 2 Top-up
              </Text>
              <Preview data={TOP_UP_DATA} />
            </Box>
          ) : ottRecharge ? (
            <Box width='100%'>
              <Text fontWeight='600' fontSize='16px' mb='12px' textAlign='left'>
                Notes
              </Text>

              <Box display='flex' flexDirection='column' gap='10px' mb='20px'>
                <Box display='flex' gap='10px'>
                  <Text fontSize='18px' lineHeight='20px'>
                    •
                  </Text>
                  <Text fontSize='14px' lineHeight='20px'>
                    {t('ottRechargeNoteOne')}
                  </Text>
                </Box>

                <Box display='flex' gap='10px'>
                  <Text fontSize='18px' lineHeight='20px'>
                    •
                  </Text>
                  <Text fontSize='14px' lineHeight='20px'>
                    {t('ottRechargeNoteTwo')}
                  </Text>
                </Box>
              </Box>

              <Button variant='outline'>{t('allPlatforms')}</Button>
            </Box>
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
              {isChangePackage ? t('update') : topUpPackage ? t('confirmTopUp') : ottRecharge ? t('confirmTopUp') : ''}
            </Button>
          </HStack>
        </VStack>
      </Popup>
    </Stack>
  );
};

export default RetailSubscriberPopup;
