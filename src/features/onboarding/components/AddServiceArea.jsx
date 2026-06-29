import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, FormController, HStack, Popup, Table, useForm, VStack } from '@kfonbss/bss-ui-components';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';

import { BigRoundPluseIcon, Close, DeleteIcon, Save } from '@/components/custom';
import { errorToast } from '@/components/custom/Toast';
import { mapObjectValues } from '@/utils/commonUtils';

import { addServiceArea, fetchOnboardingPincode, fetchOnboardingPostoffice } from '../action';
import { getPincode, getPostoffice } from '../selector';
import { actions } from '../slice';
import { addServiceAreaSchema } from '../validation';
import { ADD_SERVICE_AREA } from './constants';

const AddServiceArea = ({
  isOpen,
  onClose,
  fetchPincode,
  pincode,
  fetchPostoffice,
  postofficeValue,
  addServiceArea,
  setPostOffice,
  id
}) => {
  const { t } = useTranslation();
  const [serviceAreaList, setServiceAreaList] = useState([]);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
    getValues
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(addServiceAreaSchema(t))
  });

  useEffect(() => {
    fetchPincode();
  }, [fetchPincode]);

  useEffect(() => {
    if (isOpen) {
      reset({ pinCode: '', postOfficeName: '' });
      setServiceAreaList([]);
      clearErrors('pinCode');
    }
  }, [isOpen, reset, clearErrors]);

  // Handle modal close cleanup specifically
  const prevOpenRef = useRef(isOpen);
  useEffect(() => {
    if (prevOpenRef.current && !isOpen) {
      setPostOffice([]);
    }
    prevOpenRef.current = isOpen;
  }, [isOpen, setPostOffice]);

  const handlePincodeChange = (data) => {
    const value = data?.target ? data.target.value : data;
    setValue('pinCode', value, { shouldValidate: true });
    if (value?.pincode) {
      fetchPostoffice({
        pincode: Number(value?.pincode),
        onSuccess: (data) => {
          if (data?.length === 0) {
            setError('pinCode', {
              type: 'manual',
              message: t('validations.enterProperKeralaPincode')
            });
          }
        }
      });
      clearErrors('pinCode');
    } else {
      setPostOffice([]);
      clearErrors('pinCode');
    }
    reset((prev) => ({ ...prev, postOfficeName: '' }));
  };

  const handleAdd = useCallback(
    (data) => {
      const pinCode = data?.pinCode?.pincode;
      const postOfficeName = data?.postOfficeName?.name;

      const isDuplicate = serviceAreaList.some(
        (item) => item.pinCode === pinCode && item.postOfficeName === postOfficeName
      );

      if (isDuplicate) {
        errorToast({ description: t('serviceAreaAlreadyAdded') });
        return;
      }

      const newItem = {
        pinCode,
        postOfficeName,
        id: Date.now(),
        slno: serviceAreaList.length + 1
      };

      setServiceAreaList([...serviceAreaList, newItem]);
      reset({ pinCode: '', postOfficeName: '' });
    },
    [serviceAreaList, reset, t]
  );

  const handleDelete = useCallback(
    (id) => {
      const updatedList = serviceAreaList
        .filter((item) => item.id !== id)
        .map((item, index) => ({ ...item, slno: index + 1 }));
      setServiceAreaList(updatedList);
    },
    [serviceAreaList]
  );

  const columns = useMemo(() => {
    const dataColumns = mapObjectValues(ADD_SERVICE_AREA, t, ['header']);
    return [
      ...dataColumns,
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
    const pendingPinCode = formValues?.pinCode?.pincode;
    const pendingPostOffice = formValues?.postOfficeName?.name;

    let finalList = [...serviceAreaList];

    if (pendingPinCode && pendingPostOffice) {
      const isDuplicate = finalList.some(
        (item) => item.pinCode === pendingPinCode && item.postOfficeName === pendingPostOffice
      );
      if (!isDuplicate) {
        finalList = [
          ...finalList,
          {
            pinCode: pendingPinCode,
            postOfficeName: pendingPostOffice,
            id: Date.now(),
            slno: finalList.length + 1
          }
        ];
      }
    }

    if (finalList.length === 0) {
      errorToast({ description: t('addServiceArea') });
      return;
    }

    const payload = {
      id,
      postOffices: finalList,
      onSuccess: () => onClose(false)
    };

    addServiceArea(payload);
  };

  return (
    <Popup title={t('add')} titleMain={t('serviceArea')} isOpen={isOpen} onClose={onClose} size={'lg'}>
      <VStack alignItems={'stretch'} gap={6} px={5}>
        <HStack align='flex-end' spacing={4} width='100%' flexWrap='nowrap'>
          <Box flex={1}>
            <FormController
              placeholder={t('select', { 0: t('pinCode') })}
              labelName={t('pinCode')}
              name='pinCode'
              control={control}
              errors={errors}
              type='select'
              items={pincode}
              getOptionLabel={(option) => option.pincode}
              required
              onOptionSelect={handlePincodeChange}
            />
          </Box>

          <Box flex={1}>
            <FormController
              placeholder={t('select', { 0: t('postOffice') })}
              labelName={t('postOffice')}
              name='postOfficeName'
              control={control}
              errors={errors}
              type='select'
              items={postofficeValue}
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
            onClick={handleSubmit(handleAdd)}
          >
            <BigRoundPluseIcon />
          </Box>
        </HStack>

        <Table columns={columns} data={serviceAreaList} />

        <Box display={'flex'} justifyContent={'flex-end'} gap={3} mt={7} pb={5}>
          <Button variant={'outline'} onClick={() => onClose(false)}>
            <Close />
            {t('cancel')}
          </Button>
          <Button variant={'solid'} onClick={onSubmit}>
            <Save />
            {t('save')}
          </Button>
        </Box>
      </VStack>
    </Popup>
  );
};

const mapStateToProps = (state) => ({
  pincode: getPincode(state),
  postofficeValue: getPostoffice(state)
});

const mapDispatchToProps = {
  fetchPincode: fetchOnboardingPincode,
  fetchPostoffice: fetchOnboardingPostoffice,
  addServiceArea: addServiceArea,
  setPostOffice: actions.setPostOffice
};

export default connect(mapStateToProps, mapDispatchToProps)(AddServiceArea);
