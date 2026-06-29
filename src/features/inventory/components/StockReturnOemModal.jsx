import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  Flex,
  FormController,
  Icons,
  Popup,
  Text,
  useForm,
  VStack
} from '@kfonbss/bss-ui-components';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { allowOnlyAlpha, allowOnlyDigits } from '@/utils/validationUtils';

import { fetchDeviceVendorDropdown } from '../actions';
import { INVENTORY_KEYS } from '../constants';
import { getDropdownData } from '../selectors';
import { getReturnOemSchema } from '../validations';
import DeviceInfoHeader from './DeviceInfoHeader';
import ModalActionButtons from './ModalActionButtons';

const StockReturnOemModal = ({ isOpen, onClose, onSubmit, device }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const vendorList = useSelector(getDropdownData(INVENTORY_KEYS.DEVICE_VENDOR_LIST));

  const { AttachmentIcon, DeleteIcon } = Icons;

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchDeviceVendorDropdown());
    }
  }, [isOpen, dispatch]);

  const {
    control,
    watch,
    handleSubmit,
    setValue,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(getReturnOemSchema(t))
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleFormSubmit = (data) => {
    onSubmit({
      device: device,
      oem: data.oem.value || data.oem.id,
      attachments: data.attachments,
      handedOverName: data.handedOverName,
      handedOverMobile: data.handedOverMobile,
      remark: data.remark
    });
    handleClose();
  };

  const watchedAttachments = watch('attachments');

  const parsedAttachments = watchedAttachments
    ? Array.isArray(watchedAttachments)
      ? watchedAttachments
      : watchedAttachments.target?.files
        ? Array.from(watchedAttachments.target.files)
        : typeof watchedAttachments === 'object' && watchedAttachments.length !== undefined
          ? Array.from(watchedAttachments)
          : [watchedAttachments]
    : [];

  const fileInputRef = useRef(null);

  const handleRemoveFile = (index) => {
    const updatedFiles = parsedAttachments.filter((_, i) => i !== index);
    setValue('attachments', updatedFiles, { shouldValidate: true, shouldDirty: true });
    if (updatedFiles.length === 0 && fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (size) => {
    if (!size) return '';
    const kb = size / 1024;
    const mb = kb / 1024;
    if (mb >= 1) return `${mb.toFixed(2)} MB`;
    return `${kb.toFixed(2)} KB`;
  };

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files || []);
    setValue('attachments', [...parsedAttachments, ...newFiles], { shouldValidate: true, shouldDirty: true });
    e.target.value = '';
  };

  return (
    <Popup
      isOpen={isOpen}
      onOpenChange={(e) => {
        if (!e.open) handleClose();
      }}
      title={t('returnTo')}
      titleMain={t('oem')}
      closeButton={false}
      initialFocusEl={null}
      width='986px'
      maxWidth='986px'
      borderRadius='12px'
    >
      <Box px={4} pb={4} pt={2}>
        <DeviceInfoHeader device={device} />

        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <VStack spacing={6} alignItems='stretch'>
            <Box>
              <Text color='primary.500' fontWeight='bold' mb={4}>
                {t('oemDetails')}
              </Text>

              <Flex gap={4}>
                <Box flex={1}>
                  <FormController
                    type='select'
                    control={control}
                    name='oem'
                    labelName={t('oem')}
                    placeholder={t('choose', { 0: t('oem') })}
                    items={vendorList}
                    errors={errors}
                    required
                  />
                </Box>

                <Box flex={1}>
                  <Text mb='6px' fontWeight='500'>
                    {t('attachments')} *
                  </Text>

                  <Box border='1px solid #D1D5DB' borderRadius='8px' p='10px' position='relative' cursor='pointer'>
                    <input
                      ref={fileInputRef}
                      type='file'
                      multiple
                      accept='.jpg,.jpeg,.png,.pdf'
                      onChange={handleFileChange}
                      style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }}
                    />
                    <Text color='#6B7280'>{t('dragAndDropFiles')}</Text>
                  </Box>

                  {errors.attachments && (
                    <Text color='red.500' fontSize='12px'>
                      {errors.attachments.message}
                    </Text>
                  )}
                </Box>
              </Flex>

              {parsedAttachments.length > 0 && (
                <Flex gap={4} mt={4} wrap='wrap'>
                  {parsedAttachments.map((file, index) => (
                    <Flex
                      key={index}
                      align='center'
                      justify='space-between'
                      border='1px solid #E5E7EB'
                      borderRadius='12px'
                      p='16px'
                      minW='320px'
                      maxW='360px'
                      bg='#F9FAFB'
                    >
                      <Flex align='center' gap='12px'>
                        <Flex align='center' justify='center' w='40px' h='40px' borderRadius='50%' bg='#F3E8FF'>
                          <AttachmentIcon size={18} color='#7C3AED' />
                        </Flex>
                        <Flex direction='column'>
                          <Text fontWeight='500' fontSize='14px' color='#111827' lineHeight='20px'>
                            {file.name}
                          </Text>
                          <Text fontSize='12px' color='#6B7280' lineHeight='16px'>
                            {formatFileSize(file.size)}
                          </Text>
                        </Flex>
                      </Flex>
                      <Flex
                        align='center'
                        justify='center'
                        w='32px'
                        h='32px'
                        borderRadius='8px'
                        bg='#FEE2E2'
                        cursor='pointer'
                        _hover={{ bg: '#FECACA' }}
                        onClick={() => handleRemoveFile(index)}
                      >
                        <DeleteIcon size={16} color='#DC2626' />
                      </Flex>
                    </Flex>
                  ))}
                </Flex>
              )}
            </Box>

            <Box>
              <Text color='primary.500' fontWeight='bold' mb={4}>
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
                    onKeyDown={allowOnlyAlpha}
                    maxLength={100}
                    required
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
                    onKeyDown={allowOnlyDigits}
                    maxLength={10}
                    required
                  />
                </Box>
              </Flex>

              <Box mt={4}>
                <FormController
                  type='textarea'
                  control={control}
                  name='remark'
                  labelName={t('remark')}
                  placeholder={t('enter', { 0: t('remark') })}
                  errors={errors}
                  maxLength={250}
                  required
                />
              </Box>
            </Box>

            <ModalActionButtons onClose={handleClose} />
          </VStack>
        </form>
      </Box>
    </Popup>
  );
};

export default StockReturnOemModal;
