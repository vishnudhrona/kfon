import { Box, Button, Flex, FormController, HStack, Icons, Popup, Text, useForm, VStack } from "@kfonbss/bss-ui-components";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import { Close, Save } from "@/components/custom";
import { getSubscriberByNumber } from "@/features/crm/selector";

const { DeviceDetailsIcon } = Icons;

const DeviceDetails = ({ isOpen, setIsOpen, setSelectedDevice, selectedDevice }) => {
    const { t } = useTranslation();
    const subscriberList = useSelector(getSubscriberByNumber);

    console.log(15, subscriberList);


    const { control, formState: { errors }, handleSubmit, reset, setValue, watch } = useForm({
        defaultValues: {
            selectedDevice: selectedDevice?.username || ''
        }
    });

    useEffect(() => {
        if (isOpen) {
            reset({ selectedDevice: selectedDevice?.username || '' });
        }
    }, [isOpen, selectedDevice, reset]);

    const onSubmit = (data) => {
        if (setSelectedDevice) {
            const selectedSub = subscriberList?.subscribers?.find(s => s.username === data.selectedDevice);
            setSelectedDevice(selectedSub || null);
        }
        setIsOpen(false);
    };

    return (
        <Popup isOpen={isOpen} onClose={() => setIsOpen(false)} title={
            <HStack fontSize="24px" fontWeight="600">
                <Text>{t('btnSelect')}</Text>
                <Text color="#FD1C7A">{t('user')}</Text>
            </HStack>
        }
            size={'md'}
        >
            <Box px={5} as="form" onSubmit={handleSubmit(onSubmit)}>
                <Text color={"#73726B"} fontSize={"14px"} fontWeight={"400"} mb={"20px"}>{t('selectUserForRaiseTicket')}</Text>
                <Box maxH="400px" overflowY="auto" pr={2} className="custom-scrollbar">
                    {subscriberList?.subscribers?.map((value, indx) => (
                        <Box
                            key={indx}
                            borderRadius={'6px'}
                            border={'1px solid'}
                            borderColor={watch('selectedDevice') === value?.username ? 'primary.500' : '#E2E1E1'}
                            bg={watch('selectedDevice') === value?.username ? 'gray.50' : 'transparent'}
                            p={2}
                            mb={'20px'}
                            cursor="pointer"
                            onClick={() => setValue('selectedDevice', value?.username)}
                            _hover={{ borderColor: 'primary.500', bg: 'gray.50' }}
                            transition="all 0.2s"
                        >
                            <Flex alignItems={'center'} justifyContent={'space-between'}>
                                <Flex alignItems={'center'} gap={2}>
                                    <DeviceDetailsIcon boxSize='12' />
                                    <VStack align="start" spacing={1}>
                                        <HStack spacing={2}>
                                            <Text fontWeight="600" color={'#878681'} fontSize={'14px'}>{t('userName')}:</Text>
                                            <Text fontWeight="600" color={'primary.500'} fontSize={'14px'}>{value?.username}</Text>
                                        </HStack>

                                        <HStack spacing={2}>
                                            <Text fontWeight="600" color={'#878681'} fontSize={'14px'}>{t('location')}:</Text>
                                            <Text fontWeight="600" color={'primary.500'} fontSize={'14px'}>{value?.location}</Text>
                                        </HStack>
                                    </VStack>
                                </Flex>

                                <Box mt={5}>
                                    <FormController
                                        name="selectedDevice"
                                        control={control}
                                        errors={errors}
                                        type="radio"
                                        items={[{ label: '', value: value?.username }]}
                                    />
                                </Box>
                            </Flex>
                        </Box>
                    ))}
                </Box>

                <Flex gap={2} justifyContent={'flex-end'} mt={4}>
                    <Button onClick={() => setIsOpen(false)} variant="outline" colorScheme="gray">
                        <Close />
                        {t('close')}
                    </Button>
                    <Button type="submit" variant="solid" colorScheme="gray">
                        {t('submit')}
                        <Save />
                    </Button>
                </Flex>
            </Box>
        </Popup>
    );
};

export default DeviceDetails;