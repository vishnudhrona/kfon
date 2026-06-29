import { yupResolver } from '@hookform/resolvers/yup';
import { Button, FormController, Icons, Popup, useForm, VStack } from '@kfonbss/bss-ui-components';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

const LinkDetailsModal = ({ isOpen, onClose, onAdd }) => {
  const { t } = useTranslation();
  const { AddCircleIcon, BsXCircle } = Icons;

  const schema = yup.object().shape({
    linkName: yup.string().required(t('required')),
    fiberType: yup.string().required(t('required')),
    chosenStrands: yup.string().required(t('required')),
    length: yup.number().typeError(t('mustBeNumber')).required(t('required'))
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      linkName: '',
      fiberType: '',
      chosenStrands: '',
      length: ''
    }
  });

  useEffect(() => {
    if (isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  const onSubmit = (data) => {
    const enrichedData = {
      ...data,
      id: Date.now()
    };
    onAdd(enrichedData);
    onClose();
  };

  const fiberTypes = [
    { id: 'single_mode', name: 'Single Mode' },
    { id: 'multi_mode', name: 'Multi Mode' }
  ];

  const strandOptions = [
    { id: '1,2', name: '1, 2' },
    { id: '3,4', name: '3, 4' },
    { id: '5,6', name: '5, 6' }
  ];

  const linkNameOptions = [
    { id: 'link1', name: 'Link 1' },
    { id: 'link2', name: 'Link 2' }
  ];

  return (
    <Popup
      isOpen={isOpen}
      onClose={onClose}
      title={t('addLinkDetails')}
      size='md'
      footer={
        <>
          <Button
            variant='outline'
            onClick={onClose}
            h='47px'
            w='128px'
            px='18px'
            py='8px'
            justifyContent='center'
            alignItems='center'
            gap='6px'
            borderRadius='40px'
            border='1px solid'
            borderColor='primary.500'
            color='primary.500'
            mr={3}
          >
            <BsXCircle />
            {t('cancel')}
          </Button>
          <Button
            onClick={handleSubmit(onSubmit)}
            h='47px'
            w='128px'
            px='18px'
            py='8px'
            justifyContent='center'
            alignItems='center'
            gap='6px'
            borderRadius='40px'
            border='1px solid'
            borderColor='primary.500'
            bg='primary.500'
            color='white'
            _hover={{ bg: 'primary.600' }}
          >
            {t('add')}
            <AddCircleIcon pl='5px' />
          </Button>
        </>
      }
    >
      <VStack spacing={4} alignItems='stretch' pb={6}>
        <FormController
          name='linkName'
          labelName={t('linkName')}
          placeholder={t('chooseLinkName')}
          type='select'
          items={linkNameOptions}
          control={control}
          errors={errors}
          required
        />
        <FormController
          name='fiberType'
          labelName={t('fiberType')}
          placeholder={t('chooseFiberType')}
          type='select'
          items={fiberTypes}
          control={control}
          errors={errors}
          required
        />
        <FormController
          name='chosenStrands'
          labelName={t('chosenStrands')}
          placeholder={t('chooseStrands')}
          type='select'
          items={strandOptions}
          control={control}
          errors={errors}
          required
        />
        <FormController
          name='length'
          labelName={t('lengthInKm')}
          placeholder={t('enterLength')}
          type='number'
          control={control}
          errors={errors}
          required
        />
      </VStack>
    </Popup>
  );
};

export default LinkDetailsModal;
