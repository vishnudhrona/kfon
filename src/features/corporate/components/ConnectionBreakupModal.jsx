import { yupResolver } from '@hookform/resolvers/yup';
import { Button, FormController, Icons, Popup, useForm, VStack } from '@kfonbss/bss-ui-components';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

const ConnectionBreakupModal = ({ isOpen, onClose, onAdd, serviceTypes, packages }) => {
  const { t } = useTranslation();

  const schema = yup.object().shape({
    serviceType: yup.string().required(t('required')),
    packageId: yup.string().required(t('required')),
    otc: yup.number().typeError(t('mustBeNumber')).required(t('required')),
    connections: yup.number().typeError(t('mustBeNumber')).required(t('required')),
    discount: yup.number().typeError(t('mustBeNumber')).required(t('required')),
    description: yup.string().required(t('required'))
  });
  const { BsArrowRightCircle, BsXCircle } = Icons;
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      serviceType: '',
      packageId: '',
      otc: '',
      connections: '',
      discount: '',
      description: ''
    }
  });

  useEffect(() => {
    if (isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  const onSubmit = (data) => {
    const selectedPackage = packages?.find((p) => p.id === data.packageId);
    const enrichedData = {
      ...data,
      packageName: selectedPackage?.name || data.packageId,
      id: Date.now()
    };
    onAdd(enrichedData);
    onClose();
  };

  return (
    <Popup
      isOpen={isOpen}
      onClose={onClose}
      title=" "
      titleMain={t('addConnectionBreakup')}
      size='md'
      footer={
        <>
          <Button
            variant='outline'
            onClick={onClose}
            mr={3}
            borderColor='primary.500'
            color='primary.500'
            borderRadius='full'
          >
            <BsXCircle />
            {t('cancel')}
          </Button>
          <Button onClick={handleSubmit(onSubmit)} bg='primary.500' color='white' borderRadius='full'>
            {t('add')}
            <BsArrowRightCircle />
          </Button>
        </>
      }
    >
      <VStack spacing={4} alignItems='stretch'>
        <FormController
          name='serviceType'
          labelName={t('serviceType')}
          placeholder={t('selectServiceType')}
          type='select'
          items={serviceTypes?.map((s) => ({ id: s.id, name: s.name })) || []}
          control={control}
          errors={errors}
        />
        <FormController
          name='packageId'
          labelName={t('package')}
          placeholder={t('selectPackagePlaceholder')}
          type='select'
          items={packages?.map((p) => ({ id: p.id, name: p.packageName })) || []}
          control={control}
          errors={errors}
        />
        <FormController
          name='otc'
          labelName={t('otc')}
          placeholder={t('enterOtc')}
          type='number'
          control={control}
          errors={errors}
        />
        <FormController
          name='connections'
          labelName={t('noOfConnections')}
          placeholder={t('enterNoOfConnections')}
          type='number'
          control={control}
          errors={errors}
        />
        <FormController
          name='discount'
          labelName={t('discountPercent')}
          placeholder={t('enterDiscountPercent')}
          type='number'
          control={control}
          errors={errors}
        />
        <FormController
          name='description'
          labelName={t('description')}
          placeholder={t('enterRemarks')}
          type='textarea'
          control={control}
          errors={errors}
        />
      </VStack>
    </Popup>
  );
};

export default ConnectionBreakupModal;
