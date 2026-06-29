import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, Controller, Flex, FormController, HStack, Icons, Popup, SimpleGrid, Text, useForm } from "@kfonbss/bss-ui-components";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

import { Close, Save } from "@/components/custom";

import { fetchPriorities } from "../action";
import { UPDATE_STATE_OPTIONS } from "../constants";
import { getPriorities } from "../selector";
import { filterPopupValidation } from "../validation";

const STATUS_COLORS = {
    'OPEN': '#4ADE80',
    'IN_PROGRESS': '#FBBF24',
    'CLOSED': '#F472B6',
    'REOPEN': '#3B82F6',
    'UNASSIGNED': '#9CA3AF'
};

const PRIORITY_COLORS = {
    'INSTANT': '#0EA5E9',
    'HIGH': '#A855F7',
    'MEDIUM': '#D946EF',
    'LOW': '#EF4444'
};

const { TickSuccessIcon } = Icons;

const SelectableCard = ({ label, color, isSelected, onClick, type = 'dot' }) => {
    return (
        <Box
            onClick={onClick}
            cursor="pointer"
            border="1px solid #BBB"
            borderColor='gray.200'
            borderRadius="12px"
            p={4}
            bg="white"
            transition="all 0.2s"
            _hover={{ borderColor: isSelected ? '#10B981' : 'gray.300', shadow: 'sm' }}
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            h="48px"
        >
            <Flex alignItems="center">
                <Box
                    w={type === 'dot' ? "10px" : "12px"}
                    h={type === 'dot' ? "10px" : "12px"}
                    borderRadius={type === 'dot' ? "full" : "2px"}
                    bg={color || 'gray.300'}
                    mr={3}
                />
                <Text fontSize="16px" fontWeight="500" color="#1A202C">
                    {label}
                </Text>
            </Flex>

            {isSelected && (
                <Box color="#10B981">
                    <TickSuccessIcon boxSize="24px" />
                </Box>
            )}
        </Box>
    );
};

const FilterPopup = ({ isOpen, setIsOpen, fetchPriorities, priorities, onSubmit }) => {
    const { t } = useTranslation();

    const { control, handleSubmit, reset } = useForm({
        mode: 'onChange',
        resolver: yupResolver(filterPopupValidation(t)),
        defaultValues: {
            priority: [],
            status: [],
            createdDateFrom: null,
            createdDateTo: null
        }
    });

    useEffect(() => {
        if (isOpen) {
            fetchPriorities();
        }
    }, [isOpen, fetchPriorities]);

    const onFormSubmit = (data) => {
        onSubmit(data);
        setIsOpen(false);
    };

    const handleClose = () => {
        setIsOpen(false);
    };

    const handleReset = () => {
        reset({
            priority: [],
            status: [],
            createdDateFrom: null,
            createdDateTo: null
        });
        onSubmit({});
    };

    return (
        <Popup
            isOpen={isOpen}
            onClose={handleClose}
            title={
                <HStack fontSize="24px" fontWeight="600">
                    <Text>{t('add')} </Text>
                    <Text color="#FD1C7A">{t('filter')}</Text>
                </HStack>
            }
            size={'md'}
        >
            <Box px={5} pb={5} as="form" onSubmit={handleSubmit(onFormSubmit)}>
                <Box mb={6}>
                    <Text fontWeight="700" color="gray.500" fontSize="14px" mb={4} textTransform="uppercase">
                        {t('status')}
                    </Text>
                    <Controller
                        name="status"
                        control={control}
                        render={({ field }) => (
                            <SimpleGrid columns={2} spacing={4} gap={5}>
                                {UPDATE_STATE_OPTIONS.map((opt) => (
                                    <SelectableCard
                                        key={opt.label}
                                        label={opt.name}
                                        color={STATUS_COLORS[opt.label]}
                                        isSelected={(field.value || []).some(v => v.label === opt.label)}
                                        onClick={() => {
                                            const current = field.value || [];
                                            const isSelected = current.some(v => v.label === opt.label);
                                            field.onChange(isSelected ? current.filter(v => v.label !== opt.label) : [...current, opt]);
                                        }}
                                        type="dot"
                                    />
                                ))}
                            </SimpleGrid>
                        )}
                    />
                </Box>

                <Box mb={6}>
                    <Text fontWeight="700" color="gray.500" fontSize="14px" mb={4} textTransform="uppercase">
                        {t('priority')}
                    </Text>
                    <Controller
                        name="priority"
                        control={control}
                        render={({ field }) => (
                            <SimpleGrid columns={2} spacing={4} gap={5}>
                                {priorities?.map((opt) => (
                                    <SelectableCard
                                        key={opt.code}
                                        label={opt.name}
                                        color={PRIORITY_COLORS[opt.code]}
                                        isSelected={(field.value || []).some(v => v.code === opt.code)}
                                        onClick={() => {
                                            const current = field.value || [];
                                            const isSelected = current.some(v => v.code === opt.code);
                                            field.onChange(isSelected ? current.filter(v => v.code !== opt.code) : [...current, opt]);
                                        }}
                                        type="square"
                                    />
                                ))}
                            </SimpleGrid>
                        )}
                    />
                </Box>

                <SimpleGrid columns={2} gap={6} mb={8}>
                    <FormController
                        labelName={t('fromDate')}
                        name='createdDateFrom'
                        control={control}
                        type="date"
                    />
                    <FormController
                        labelName={t('toDate')}
                        name='createdDateTo'
                        control={control}
                        type="date"
                    />
                </SimpleGrid>

                <Flex gap={4} justifyContent={'flex-end'}>
                    <Button variant="link" fontSize={'16px'} onClick={handleReset} color="primary.500" fontWeight="500" mr="auto">
                        {t('clearAll')}
                    </Button>
                    <Button variant={'outline'} borderRadius="full" px={8} onClick={handleClose}>
                        <Close />
                        {t('cancel')}
                    </Button>
                    <Button type='submit' borderRadius="full" bg="primary.500" color="white" px={10} _hover={{ bg: 'primary.600' }}>
                        {t('submit')}
                        <Save />
                    </Button>
                </Flex>
            </Box>
        </Popup>
    );
};

const mapStateToProps = (state) => ({
    priorities: getPriorities(state)
});

const mapDispatchToProps = {
    fetchPriorities
};

export default connect(mapStateToProps, mapDispatchToProps)(FilterPopup);