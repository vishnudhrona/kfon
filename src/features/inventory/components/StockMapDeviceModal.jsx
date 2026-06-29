import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Flex, FormController, Popup, useForm, useWatch, VStack } from '@kfonbss/bss-ui-components';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { allowOnlyDigits, allowOnlyIpChars, formatIpAddress } from '@/utils/validationUtils';

import { fetchDeviceMappedValues, fetchPopNameDropdown } from '../actions';
import { getDeviceMappedValues, getPopNameDropdown } from '../selectors';
import { getMapDeviceSchema } from '../validations';
import DeviceInfoHeader from './DeviceInfoHeader';
import ModalActionButtons from './ModalActionButtons';

const StockMapDeviceModal = ({ isOpen, onClose, onSubmit, device }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const deviceMappedValues = useSelector(getDeviceMappedValues);
  const popNameDropdown = useSelector(getPopNameDropdown);

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchDeviceMappedValues());
      dispatch(fetchPopNameDropdown());
    }
  }, [isOpen, dispatch]);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(getMapDeviceSchema(t))
  });

  const ipPrevValueRef = useRef('');

  const deviceMappedTo = useWatch({ control, name: 'deviceMappedTo' });
  const mappedToValue = deviceMappedTo?.value || deviceMappedTo?.name || deviceMappedTo?.id;
  const isPop = mappedToValue === 'POP';
  const isField = mappedToValue === 'FIELD';

  useEffect(() => {
    setValue('popName', null);
    setValue('nocName', '');
    setValue('location', '');
  }, [mappedToValue, setValue]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleFormSubmit = (data) => {
    onSubmit({
      device,
      deviceMappedTo: data.deviceMappedTo?.name,
      popId: data.popName?.id || data.popName?.value,
      popName: data.popName?.name || data.popName?.value,
      location: data.location,
      deviceIpAddress: data.deviceIpAddress,
      portNumber: data.portNumber,
      remark: data.remark
    });
    handleClose();
  };

  return (
    <Popup
      isOpen={isOpen}
      onOpenChange={(e) => {
        if (!e.open) handleClose();
      }}
      title={t('map')}
      titleMain={t('device')}
      closeButton={false}
      width='820px'
      maxWidth='820px'
      borderRadius='12px'
    >
      <Box px={4} pb={4}>
        <DeviceInfoHeader device={device} />
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <VStack spacing={6} gap={6} alignItems='stretch'>
            <Flex gap={4}>
              <Box flex={1}>
                <FormController
                  type='select'
                  control={control}
                  name='deviceMappedTo'
                  labelName={t('deviceMappedTo')}
                  placeholder={t('deviceMappedTo')}
                  items={deviceMappedValues}
                  errors={errors}
                  required
                />
              </Box>
              <Box flex={1}>
                {isPop && (
                  <FormController
                    type='select'
                    control={control}
                    name='popName'
                    labelName={t('popName')}
                    placeholder={t('popName')}
                    items={popNameDropdown}
                    errors={errors}
                    required
                  />
                )}
                {isField && (
                  <FormController
                    type='input'
                    control={control}
                    name='location'
                    labelName={t('location')}
                    placeholder={t('enterLocation')}
                    errors={errors}
                    required
                  />
                )}
              </Box>
            </Flex>

            <Flex gap={4}>
              <Box flex={1}>
                <FormController
                  type='input'
                  control={control}
                  name='deviceIpAddress'
                  labelName={t('deviceIpAddress')}
                  placeholder={t('enterDeviceIpAddress')}
                  errors={errors}
                  onKeyDown={(e) => {
                    ipPrevValueRef.current = e.target.value;
                    allowOnlyIpChars(e);
                  }}
                  handleChange={(e) => {
                    setValue('deviceIpAddress', formatIpAddress(e.target.value, ipPrevValueRef.current), {
                      shouldValidate: false
                    });
                  }}
                  maxLength={15}
                />
              </Box>
              <Box flex={1}>
                <FormController
                  type='input'
                  control={control}
                  name='portNumber'
                  labelName={t('portNumber')}
                  placeholder={t('enterPortNumber')}
                  errors={errors}
                  onKeyDown={allowOnlyDigits}
                  maxLength={5}
                />
              </Box>
            </Flex>

            <FormController
              type='textarea'
              control={control}
              name='remark'
              labelName={t('remark')}
              placeholder={t('remark')}
              errors={errors}
              required
            />

            <ModalActionButtons onClose={handleClose} />
          </VStack>
        </form>
      </Box>
    </Popup>
  );
};

export default StockMapDeviceModal;
