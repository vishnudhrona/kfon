import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  Flex,
  FormController,
  HStack,
  Icons,
  Popup,
  Text,
  useForm,
  VStack
} from '@kfonbss/bss-ui-components';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { DeviceRadioGroup } from '@/components/custom';
import SearchInput from '@/components/custom/SearchInput';
import { allowOnlyAlpha, allowOnlyDigits } from '@/utils/validationUtils';

const { BsCheckCircle } = Icons;

import { fetchAllRoles, fetchSearchDevice, fetchUsersByRoleId } from '../actions';
import { getAllRoles, getSearchedDevice, getUsersByRoleId } from '../selectors';
import { getTransferSchema } from '../validations';
import DeviceInfoHeader from './DeviceInfoHeader';
import ModalActionButtons from './ModalActionButtons';

const StockTransferModal = ({ isOpen, onClose, onSubmit, device, isTransferredStock = false, bulkDeviceCount = 0, lnpContext = null, bulkDevices = [] }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const isLnpMode = !!lnpContext;

  const allRoles = useSelector(getAllRoles);
  const usersByRoleId = useSelector(getUsersByRoleId);
  const searchedDevice = useSelector(getSearchedDevice);

  const [deviceSelectionType, setDeviceSelectionType] = useState('same');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchSuccess, setSearchSuccess] = useState(false);
  const [activeDevice, setActiveDevice] = useState(device);
  const deviceType = device?.deviceType;
  useEffect(() => {
    setActiveDevice(device);
  }, [device]);

  useEffect(() => {
    if (searchedDevice && Object.keys(searchedDevice).length > 0 && deviceSelectionType === 'other') {
      setSearchSuccess(true);
      setActiveDevice({
        slNo: searchedDevice?.detailsId,
        transferId: device?.transferId,
        deviceType: searchedDevice?.type?.name,
        category: searchedDevice?.category?.name,
        modelNo: searchedDevice?.model?.name,
        custodian: searchedDevice?.custodian?.empName,
        status: searchedDevice?.status,
        condition: searchedDevice?.deviceCondition,
        serialNumber: searchedDevice?.deviceSlNo,
        gponSerialNumber: searchedDevice?.gponSerialNumber,
        macAddress: searchedDevice?.deviceMac,
        equipmentId: searchedDevice?.deviceSlNo,
        distanceInKm: searchedDevice?.distanceInKm ?? searchedDevice?.sfpDistance,
        id: searchedDevice?.detailsId,
        deviceId: searchedDevice?.detailsId
      });
    }
  }, [searchedDevice, deviceSelectionType, device]);

  useEffect(() => {
    if (isOpen) {
      if (!isLnpMode) dispatch(fetchAllRoles());
    } else {
      setDeviceSelectionType('same');
      setSearchQuery('');
    }
  }, [isOpen, dispatch, isLnpMode]);

  const handleSearchDevice = () => {
    if (searchQuery.trim()) {
      setSearchSuccess(false);
      dispatch(fetchSearchDevice({ serialNumber: searchQuery.trim(), deviceType }));
    }
  };

  const handleDeviceSelectionChange = (e) => {
    const val = typeof e === 'object' && e?.value ? e.value : e;
    setDeviceSelectionType(val);
    if (val === 'same') {
      setActiveDevice(device);
      setSearchQuery('');
      setSearchSuccess(false);
    }
  };

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(getTransferSchema(t, isTransferredStock, isLnpMode))
  });

  const selectedRole = watch('role');

  useEffect(() => {
    if (selectedRole) {
      setValue('person', null);
      dispatch(fetchUsersByRoleId({ roleId: selectedRole?.id }));
    }
  }, [selectedRole, dispatch, setValue]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleFormSubmit = (data) => {
    onSubmit({
      device: activeDevice ? { ...activeDevice, serialNumber: activeDevice.gponSerialNumber } : null,
      role: data.role?.id || null,
      person: data.person || null,
      remark1: data.remark1 || null,
      handedOverName: data.handedOverName,
      handedOverMobile: data.handedOverMobile,
      remark2: data.remark2,
      isSameDevice: deviceSelectionType === 'same'
    });
    handleClose();
  };

  return (
    <Popup
      isOpen={isOpen}
      onOpenChange={handleClose}
      title={t('transfer')}
      titleMain={t('device')}
      closeButton={false}
      width='986px'
      maxWidth='986px'
      borderRadius='12px'
    >
      <Box px={4} pb={4}>
        {isTransferredStock && (
          <Box mb={4}>
            <DeviceRadioGroup
              value={deviceSelectionType}
              onChange={handleDeviceSelectionChange}
              options={[
                { value: 'same', label: t('sameDevice') },
                { value: 'other', label: t('otherDevice') }
              ]}
            />

            {deviceSelectionType === 'other' && (
              <Box mt={4} maxW='400px'>
                <HStack spacing={2} align='center'>
                  <SearchInput
                    placeholder={t('searchForDevice')}
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setSearchSuccess(false);
                    }}
                    onKeyUp={(e) => e.key === 'Enter' && handleSearchDevice()}
                    width='100%'
                  />
                  {searchSuccess && <BsCheckCircle color='green' boxSize={10} flexShrink={0} />}
                </HStack>
              </Box>
            )}
          </Box>
        )}

        {bulkDevices.length > 0 ? (
          <Box border='1px solid #E5E7EB' borderRadius='12px' overflow='hidden' mb='24px'>
            <Flex px='20px' py='12px' align='center' justify='space-between' borderBottom='1px solid #E5E7EB'>
              <Text fontWeight='700' color='#232F50' fontSize='16px'>
                {t('devicesSelected')}: <Text as='span' color='primary.500'>{bulkDevices.length}</Text>
              </Text>
            </Flex>
            <Box maxH='180px' overflowY='auto'>
              {bulkDevices.map((d, i) => (
                <Flex key={d.detailsId} px='20px' py='10px' align='center' gap='12px' borderBottom={i < bulkDevices.length - 1 ? '1px solid #F3F4F6' : 'none'}>
                  <Box bg='#FCECB8' px='8px' py='2px' borderRadius='6px' fontSize='12px' fontWeight='700' color='gray.800' minW='28px' textAlign='center'>
                    {String(i + 1).padStart(2, '0')}
                  </Box>
                  <Text fontSize='14px' fontWeight='600' color='#232F50'>{d.deviceType || '-'}</Text>
                  <Box w='1px' h='14px' bg='gray.200' />
                  <Text fontSize='13px' color='gray.500'>{t('serialNumber')}: <Text as='span' fontWeight='600' color='#232F50'>{d.serialNumber || '-'}</Text></Text>
                  {d.gponSerialNumber && (
                    <>
                      <Box w='1px' h='14px' bg='gray.200' />
                      <Text fontSize='13px' color='gray.500'>{t('gponSerialNumber')}: <Text as='span' fontWeight='600' color='#232F50'>{d.gponSerialNumber}</Text></Text>
                    </>
                  )}
                </Flex>
              ))}
            </Box>
          </Box>
        ) : bulkDeviceCount > 0 ? (
          <Box border='1px solid #E5E7EB' borderRadius='12px' overflow='hidden' mb='24px' px='20px' py='14px'>
            <Text fontWeight='700' color='#232F50' fontSize='16px'>
              {bulkDeviceCount} {t('devicesSelected')}
            </Text>
          </Box>
        ) : (
          <DeviceInfoHeader device={activeDevice} />
        )}

        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <VStack spacing={6} gap={6} alignItems='stretch'>
            {!isTransferredStock && (
              <>
                <Text color='primary.500' fontWeight='bold' mb={2}>
                  {t('movingTo')}
                </Text>

                {isLnpMode ? (
                  <Box border='1px solid #E5E7EB' borderRadius='10px' px='16px' py='12px'>
                    <Text fontSize='13px' color='gray.500' mb='2px'>{t('company')}</Text>
                    <Text fontSize='15px' fontWeight='700' color='#232F50'>{lnpContext.companyName}</Text>
                  </Box>
                ) : (
                  <>
                    <Flex gap={4}>
                      <Box flex={1}>
                        <FormController
                          type='select'
                          control={control}
                          name='role'
                          labelName={t('role')}
                          placeholder={t('choose', { 0: t('role') })}
                          options={allRoles}
                          getOptionLabel={(option) => option?.roleName}
                          errors={errors}
                          required={!isTransferredStock}
                        />
                      </Box>
                      <Box flex={1}>
                        <FormController
                          type='select'
                          control={control}
                          name='person'
                          labelName={t('person')}
                          placeholder={t('choose', { 0: t('person') })}
                          options={usersByRoleId}
                          errors={errors}
                          required={!isTransferredStock}
                        />
                      </Box>
                    </Flex>

                    <FormController
                      type='input'
                      control={control}
                      name='remark1'
                      labelName={t('remark')}
                      placeholder={t('enter', { 0: t('remark') })}
                      errors={errors}
                      required={!isTransferredStock}
                    />
                  </>
                )}
              </>
            )}

            <Text color='primary.500' fontWeight='bold' mb={2} mt={2}>
              {t('handedOverTo')}
            </Text>

            <Flex gap={4}>
              <Box flex={1}>
                <FormController
                  type='input'
                  control={control}
                  name='handedOverName'
                  labelName={t('name')}
                  placeholder={t('enter', { 0: t('name') })}
                  errors={errors}
                  required
                  maxLength={100}
                  handleKeyDown={allowOnlyAlpha}
                />
              </Box>
              <Box flex={1}>
                <FormController
                  type='input'
                  control={control}
                  name='handedOverMobile'
                  labelName={t('mobileNumber')}
                  placeholder={t('enter', { 0: t('mobileNumber') })}
                  errors={errors}
                  required
                  inputMode='numeric'
                  maxLength={10}
                  handleKeyDown={allowOnlyDigits}
                />
              </Box>
            </Flex>
            {isTransferredStock && (
              <FormController
                type='input'
                control={control}
                name='remark2'
                labelName={t('remarks')}
                placeholder={t('enter', { 0: t('remarks') })}
                errors={errors}
                required
              />
            )}
            <ModalActionButtons onClose={handleClose} />
          </VStack>
        </form>
      </Box>
    </Popup>
  );
};

export default StockTransferModal;
