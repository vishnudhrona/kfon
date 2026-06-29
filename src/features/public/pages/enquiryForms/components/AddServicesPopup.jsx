import { Box, Button, FormController, HStack, Icons, Popup, Table, useForm, VStack } from '@kfonbss/bss-ui-components';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { BigRoundPluseIcon } from '@/components/custom';
import { showToast } from '@/components/custom/Toast';

const { Close, BsArrowRightCircle, DeleteIcon } = Icons;

const normalizeServices = (services = []) =>
  services.map((item, index) => ({
    ...item,
    id: item.id ?? `${item.serviceId || 'svc'}-${index}`,
    slno: index + 1,
    noOfConnections: Number(item.noOfConnections) || 0
  }));

const AddServicesPopup = ({ isOpen, onClose, serviceList, onSave, initialServices = [] }) => {
  const { t } = useTranslation();
  const [servicesList, setServicesList] = useState(() => normalizeServices(initialServices));

  useEffect(() => {
    if (isOpen) {
      setServicesList(normalizeServices(initialServices));
    }
  }, [isOpen, initialServices]);

  const {
    control,
    handleSubmit,
    reset,
    getValues,
    formState: { errors }
  } = useForm({
    mode: 'onChange'
  });

  const handleAdd = useCallback(
    (data) => {
      const serviceId = data?.service?.id;
      const serviceName = data?.service?.name;
      const noOfConnections = data?.noOfConnections;

      if (!noOfConnections || noOfConnections <= 0) {
        showToast({ description: t('pleaseEnterValidNoOfConnections'), type: 'warning', title: 'Information' });
        return;
      }

      if (noOfConnections > 100) {
        showToast({ description: t('noOfConnectionsCannotExceed100'), type: 'warning', title: 'Information' });
        return;
      }

      const existingServiceIndex = servicesList.findIndex((item) => item.serviceId === serviceId);

      if (existingServiceIndex !== -1) {
        const updatedList = [...servicesList];
        const newCount = updatedList[existingServiceIndex].noOfConnections + Number(noOfConnections);

        if (newCount > 100) {
          showToast({ description: t('totalConnectionsCannotExceed100'), type: 'warning', title: 'Information' });
          return;
        }

        updatedList[existingServiceIndex] = {
          ...updatedList[existingServiceIndex],
          noOfConnections: newCount
        };
        setServicesList(updatedList);
      } else {
        const newItem = {
          serviceId,
          serviceName,
          noOfConnections: Number(noOfConnections),
          id: Date.now(),
          slno: servicesList.length + 1
        };
        setServicesList([...servicesList, newItem]);
      }

      reset({ service: '', noOfConnections: '' });
    },
    [servicesList, reset, t]
  );

  const handleDelete = useCallback(
    (id) => {
      const updatedList = servicesList
        .filter((item) => item.id !== id)
        .map((item, index) => ({ ...item, slno: index + 1 }));
      setServicesList(updatedList);
    },
    [servicesList]
  );

  const columns = useMemo(() => {
    return [
      {
        header: t('slNo'),
        accessor: 'slno'
      },
      {
        header: t('services'),
        accessor: 'serviceName'
      },
      {
        header: t('noOfConnections'),
        accessor: 'noOfConnections'
      },
      {
        header: t('action'),
        accessor: 'action',
        cell: (row) => (
          <Box onClick={() => handleDelete(row.id)} cursor='pointer'>
            <DeleteIcon />
          </Box>
        )
      }
    ];
  }, [t, handleDelete]);

  const onSubmit = () => {
    const formValues = getValues();
    const hasPendingData = formValues?.service && formValues?.noOfConnections;

    let finalServicesList = [...servicesList];

    if (hasPendingData) {
      const serviceId = formValues?.service?.id;
      const serviceName = formValues?.service?.name;
      const noOfConnections = formValues?.noOfConnections;

      if (!noOfConnections || noOfConnections <= 0) {
        showToast({ description: t('pleaseEnterValidNoOfConnections'), type: 'warning', title: 'Information' });
        return;
      }

      if (noOfConnections > 100) {
        showToast({ description: t('noOfConnectionsCannotExceed100'), type: 'warning', title: 'Information' });
        return;
      }

      const existingServiceIndex = finalServicesList.findIndex((item) => item.serviceId === serviceId);

      if (existingServiceIndex !== -1) {
        const newCount = finalServicesList[existingServiceIndex].noOfConnections + Number(noOfConnections);

        if (newCount > 100) {
          showToast({ description: t('totalConnectionsCannotExceed100'), type: 'warning', title: 'Information' });
          return;
        }

        finalServicesList[existingServiceIndex] = {
          ...finalServicesList[existingServiceIndex],
          noOfConnections: newCount
        };
      } else {
        const newItem = {
          serviceId,
          serviceName,
          noOfConnections: Number(noOfConnections),
          id: Date.now(),
          slno: finalServicesList.length + 1
        };
        finalServicesList.push(newItem);
      }
    }

    if (finalServicesList.length === 0) {
      showToast({ description: t('pleaseAddAtLeastOneService'), type: 'warning', title: 'Information' });
      return;
    }

    onSave(finalServicesList);
    onClose(false);
  };

  return (
    <Popup title={t('addServices')} isOpen={isOpen} onClose={onClose} size={'lg'}>
      <VStack alignItems={'stretch'} gap={6} px={5}>
        <HStack align='flex-end' spacing={4} width='100%' flexWrap='nowrap'>
          <Box flex={1}>
            <FormController
              placeholder={t('choose', { 0: t('service') })}
              labelName={t('service')}
              name='service'
              control={control}
              errors={errors}
              type='select'
              items={serviceList || []}
              required
            />
          </Box>

          <Box flex={1}>
            <FormController
              placeholder={t('enter', { 0: t('noOfConnections') })}
              labelName={t('noOfConnections')}
              name='noOfConnections'
              control={control}
              errors={errors}
              type='text'
              inputMode='numeric'
              pattern='[0-9]*'
              onInput={(e) => (e.target.value = e.target.value.replace(/\D/g, ''))}
              maxLength={3}
              required
            />
          </Box>

          <Box
            as='button'
            height='44px'
            width='44px'
            display='flex'
            alignItems='center'
            justifyContent='center'
            mb='2px'
            cursor='pointer'
            onClick={handleSubmit(handleAdd)}
          >
            <BigRoundPluseIcon />
          </Box>
        </HStack>

        <Table columns={columns} data={servicesList} />

        <Box display={'flex'} justifyContent={'flex-end'} gap={3} mt={7} pb={5}>
          <Button variant={'outline'} onClick={() => onClose(false)} size={'md'}>
            <Close width={6} height={6} />
            {t('cancel')}
          </Button>
          <Button variant={'solid'} onClick={onSubmit} size={'lg'}>
            {t('done')}
            <BsArrowRightCircle width={6} height={6} />
          </Button>
        </Box>
      </VStack>
    </Popup>
  );
};

export default AddServicesPopup;
