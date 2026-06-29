import { yupResolver } from '@hookform/resolvers/yup';
import {
  Avatar,
  Box,
  Button,
  Flex,
  FormController,
  Icons,
  Popup,
  SimpleGrid,
  Text,
  useForm
} from '@kfonbss/bss-ui-components';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { assignEnquiryValidationSchema } from '../../validation';

const { BsXCircle, BsCheckCircle } = Icons;

/**
 * Shared popup for assigning an enquiry to a person (FE or LNP).
 *
 * Props:
 *  - open / setOpen        — visibility control
 *  - titleMain             — popup subtitle (e.g. t('fieldEngineer') / t('lnp'))
 *  - fieldName             — react-hook-form field name ('feId' | 'lnpId')
 *  - list                  — array of { id, name, nameInLocal? } items
 *  - selectedEnquiryId     — card data; uses .pincode as default
 *  - onFetchList(pincode)  — called when pincode reaches 6 digits
 *  - onAssign(selected, enquiryId) — called on submit with the selected item
 */
const AssignToPopup = ({ open, setOpen, titleMain, fieldName, list, selectedEnquiryId, onFetchList, onAssign }) => {
  const { t } = useTranslation();

  const validationSchema = useMemo(() => assignEnquiryValidationSchema(t, fieldName), [t, fieldName]);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      pincode: selectedEnquiryId?.pincode || '',
      [fieldName]: ''
    }
  });

  const pincodeValue = watch('pincode');
  const selectedItem = watch(fieldName);

  useEffect(() => {
    if (open) {
      reset({ pincode: selectedEnquiryId?.pincode || '', [fieldName]: '' });
    }
  }, [open, selectedEnquiryId?.pincode, fieldName, reset]);

  useEffect(() => {
    if (pincodeValue && pincodeValue.length === 6) {
      onFetchList(pincodeValue);
    }
  }, [pincodeValue, onFetchList]);

  const handlePincodeChange = (e) => {
    const value = e.target.value;
    setValue('pincode', value);
    setValue(fieldName, null);
    if (value && value.length === 6) {
      onFetchList(value);
    }
  };

  const handleClose = (isOpen) => {
    reset();
    setOpen(isOpen);
  };

  const onSubmit = (data) => {
    onAssign(data[fieldName], selectedEnquiryId?.enquiryId);
    handleClose(false);
  };

  return (
    <Popup
      title={t('assignTo')}
      titleMain={titleMain}
      isOpen={open}
      onOpenChange={handleClose}
      size='sm'
      closeOnInteractOutside={false}
    >
      <Box as='form' onSubmit={handleSubmit(onSubmit)}>
        <SimpleGrid columns={1} spacing={4} px={4} gap='3' borderRadius='8px' bg='#FFF' mb='6'>
          <FormController
            control={control}
            name='pincode'
            labelName={t('pinCode')}
            required
            type='text'
            placeholder={t('enterPinCode')}
            maxLength={6}
            inputMode='numeric'
            onInput={(e) => {
              e.target.value = e.target.value.replace(/\D/g, '');
            }}
            handleChange={handlePincodeChange}
            errors={errors}
          />

          <Box>
            <Text fontSize='14px' fontWeight='500' mb={2}>
              {t('assigningPerson')}{' '}
              <Text as='span' color='red.500'>
                *
              </Text>
            </Text>
            <Box height='200px' overflow='auto' border='1px solid' borderColor='gray.200' borderRadius='md' p={2}>
              {(list || []).map((item) => (
                <Flex
                  key={item.id}
                  justifyContent='space-between'
                  mt={2}
                  bg={selectedItem?.id === item.id ? '#D8ECE4' : ''}
                  borderRadius='lg'
                  p={2}
                >
                  <Flex alignItems='center'>
                    <Avatar.Root bg='#F3E2C8' color='#bb8d43ff' size='md' mr={3}>
                      <Avatar.Fallback name={item.name} />
                    </Avatar.Root>
                    <Box flex='1'>
                      <Text fontSize='16px' fontWeight='600'>
                        {item.name}
                      </Text>
                      {item.nameInLocal && (
                        <Text fontSize='12px' color='gray.500'>
                          {item.nameInLocal}
                        </Text>
                      )}
                    </Box>
                  </Flex>
                  <Button
                    mt={1}
                    height='34px'
                    borderRadius='lg'
                    variant={selectedItem?.id === item.id ? 'solid' : 'outline'}
                    onClick={() => setValue(fieldName, item, { shouldValidate: true })}
                  >
                    {selectedItem?.id === item.id ? t('selected') : t('btnSelect')}
                  </Button>
                </Flex>
              ))}
            </Box>
            {errors?.[fieldName] && (
              <Text color='red.500' fontSize='sm' mt={1}>
                {errors[fieldName].message}
              </Text>
            )}
          </Box>
        </SimpleGrid>

        <Flex w='full' justify='flex-end' pb={5} pr={5} gap={3}>
          <Button
            variant='outline'
            onClick={() => handleClose(false)}
            colorScheme='pink'
            borderColor='#8D0247'
            color='#8D0247'
            h='47px'
            px='18px'
            borderRadius='48px'
            fontSize='16px'
            fontWeight='400'
          >
            <BsXCircle style={{ marginRight: '6px', width: '24px', height: '24px' }} /> {t('cancel')}
          </Button>
          <Button
            type='submit'
            variant='solid'
            colorScheme='pink'
            bg='#8D0247'
            h='47px'
            px='18px'
            borderRadius='48px'
            fontSize='16px'
            fontWeight='400'
          >
            {t('done')} <BsCheckCircle style={{ marginLeft: '6px', width: '24px', height: '24px' }} />
          </Button>
        </Flex>
      </Box>
    </Popup>
  );
};

export default AssignToPopup;
