import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, FormController, HStack, Icons, Popup, Spinner, Text, useForm, VStack } from '@kfonbss/bss-ui-components';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import * as yup from 'yup';

import { Close } from '@/components/custom';
import { MAX_FILE_SIZE } from '@/features/common/constants';
import { getApiProgress } from '@/features/others/ApiProgress/selectors';

import { ACTION_TYPES, submitLocationData } from '../../action';

const locationFormSchema = (t) =>
  yup.object().shape({
    deviceCsv: yup
      .mixed()
      .required(t('validations.required', [t('deviceDetailsCSVFile')]))
      .test('fileSize', t('fileSizeTooLarge'), (value) => {
        return value && value[0] && value[0].size <= MAX_FILE_SIZE;
      })
      .test('fileType', t('uploadOnlyCSV'), (value) => {
        return value && value[0] && value[0].type === 'text/csv';
      })
  });

const LocationPopup = ({ isOpen, setIsOpen }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { AddCircleIcon, BsArrowRightCircle } = Icons;

  const locationSchema = useMemo(() => locationFormSchema(t), [t]);

  const apiProgress = useSelector(getApiProgress);
  const isSubmitting = !!apiProgress[ACTION_TYPES.SUBMIT_LOCATION_DATA];

  const {
    control,
    formState: { errors },
    handleSubmit
  } = useForm({ resolver: yupResolver(locationSchema) });

  const onSubmit = (data) => {
    if (isSubmitting) return;
    dispatch(submitLocationData(data));
    console.log('Form data:', data);
    setIsOpen(false);
  };

  return (
    <Popup isOpen={isOpen} title=" " titleMain={t('uploadLocation')} size='sm' placement='center' onOpenChange={setIsOpen}>
      <VStack as={'form'} onSubmit={handleSubmit(onSubmit)} alignItems='stretch' gap={5} p={4}>
        <Box>
          <FormController
            name='deviceCsv'
            labelName={t('locationCSV')}
            type='file'
            control={control}
            errors={errors}
            accept='.csv'
            rightIcon={<AddCircleIcon />}
            required
          />
          <Text fontSize='xs' color='gray.500'>
            {t('uploadCsvNote', { 0: 'CSV', 1: '5' })}
          </Text>
        </Box>

        <HStack ml='auto' spacing={4} justifyContent='end' width='100%'>
          <Button variant='outline' onClick={() => setIsOpen(false)} width='40%'>
            <Close />
            {t('cancel')}
          </Button>

          <Button type='submit' width='40%' disabled={isSubmitting}>
            {isSubmitting && <Spinner size='xs' style={{ marginRight: '8px' }} />}
            {t('submit')}
            <BsArrowRightCircle />
          </Button>
        </HStack>
      </VStack>
    </Popup>
  );
};

export default LocationPopup;
