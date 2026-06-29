import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, FormController, Grid, HStack, Icons, Text, useForm, VStack } from '@kfonbss/bss-ui-components';
import { useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { CardCloseIcon, CardExpandIcon, CardSplitCloseIcon } from '@/components/custom';

import { getProposalParams } from '../selector';
import { proposalCardSchema } from '../validation';



const ServiceCard = ({ serviceName, value, onRemove }) => {

    return (
        <Box
            position="relative"
            border="1px solid #000000"
            borderRadius="10px"
            minW="250px"
            bg="white"
        >
            <Button
                variant="ghost"
                size="xs"
                position="absolute"
                top="-12px"
                right="-12px"
                minW="unset"
                p={0}
                borderRadius="full"
                w="24px"
                h="24px"
                display="flex"
                alignItems="center"
                justifyContent="center"
                onClick={onRemove}
                _hover={{ bg: 'red.600' }}
                zIndex={1}
            >
                <CardCloseIcon boxSize={6} color="white" />
            </Button>
            <HStack spacing={0} align="stretch" h="full">
                <Box
                    bg="#EDEDED"
                    px={4}
                    py={2}
                    display="flex"
                    alignItems="center"
                    h="full"
                    flex={1.5}
                    borderLeftRadius="10px"
                >
                    <Text fontSize="md" fontWeight="medium" color="#333333">
                        {serviceName}
                    </Text>
                </Box>

                <Box
                    px={4}
                    py={2}
                    display="flex"
                    alignItems="center"
                    h="full"
                    minW="100px"
                    borderRightRadius="full"
                >
                    <Text fontSize="md" fontWeight="bold" color="#000000">
                        {value}
                    </Text>
                </Box>
            </HStack>
        </Box>
    );
};

const ProposalCard = ({ data, index, onMerge, isReviseMode = false, onSaved, onFormChange }) => {
    const { DownArrowIcon, UpArrowIcon, CirclePlusIcon } = Icons;
    const { t } = useTranslation();

    const navigate = useNavigate();
    const { enquiryId: proposalEnquiryId } = useSelector(getProposalParams);
    const [isExpanded, setIsExpanded] = useState(true);
    const [services, setServices] = useState(
        (data.additionalServices || []).map((s, i) => ({ id: i, name: s.serviceName, value: s.planNames || s.amount }))
    );

    const billingFrequencyOptions = [
        { id: '1', name: t('monthly') },
        { id: '2', name: t('quarterly') },
        { id: '3', name: t('yearly') }
    ];

    const getBillingOption = (val) => billingFrequencyOptions.find(o => o.id === val) || null;

    const { control, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm({
        defaultValues: {
            lockingPeriod: data.lockingPeriod || '',
            billingFrequency: getBillingOption(data.billingFrequency),
            arc: data.arc || '',
            discount: data.discount || '',
            finalArc: data.finalArc || '',
            otc: data.otc || ''
        },
        resolver: yupResolver(proposalCardSchema(t))
    });

    useEffect(() => {
        reset({
            lockingPeriod: data.lockingPeriod || '',
            billingFrequency: getBillingOption(data.billingFrequency),
            arc: data.arc || '',
            discount: data.discount || '',
            finalArc: data.finalArc || '',
            otc: data.otc || ''
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);

    const arcValue = watch('arc');
    const discountValue = watch('discount');
    const finalArcValue = watch('finalArc');
    const otcValue = watch('otc');
    const lockingPeriodValue = watch('lockingPeriod');
    const billingFrequencyValue = watch('billingFrequency');

    useEffect(() => {
        const arc = parseFloat(arcValue);
        const discount = parseFloat(discountValue);
        if (!isNaN(arc) && arc > 0) {
            const computed = isNaN(discount) || discount === 0
                ? arc
                : arc - (arc * discount) / 100;
            setValue('finalArc', parseFloat(computed.toFixed(2)), { shouldValidate: true });
        }
    }, [arcValue, discountValue, setValue]);

    const finalArc = parseFloat(finalArcValue) || 0;
    const otc = parseFloat(otcValue) || 0;
    const excludeGst = parseFloat((finalArc + otc).toFixed(2));
    const includeGst = parseFloat((excludeGst * 1.18).toFixed(2));

    useEffect(() => {
        if (!onFormChange) return;
        onFormChange(data.id, {
            locationIds: data.locationIds || [],
            lockingPeriod: Number(lockingPeriodValue) || 0,
            billingFrequency: billingFrequencyValue?.id || billingFrequencyValue || '',
            arc: Number(arcValue) || 0,
            discount: Number(discountValue) || 0,
            finalArc: finalArc,
            otc: otc,
            excludeGst: excludeGst,
            totalIncludeGst: includeGst,
            additionalServices: services.map(s => ({ serviceName: s.name, amount: Number(s.value) }))
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lockingPeriodValue, billingFrequencyValue, arcValue, discountValue, finalArcValue, otcValue, services]);

    const handleNumberKeyDown = (e) => {
        if (
            !/[0-9.]/.test(e.key) &&
            !['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key) &&
            !(e.ctrlKey || e.metaKey)
        ) {
            e.preventDefault();
        }
    };

    const handleToggle = (e) => {
        e.stopPropagation();
        setIsExpanded((prev) => !prev);
    };

    const handleRemoveService = (serviceId) => {
        setServices(services.filter(s => s.id !== serviceId));
    };

    const handleSplitNavigate = (e) => {
        e.stopPropagation();
        sessionStorage.setItem('splitFilterLocationIds', JSON.stringify(data.locationIds || []));
        const eId = data.enquiryId || proposalEnquiryId;
        navigate({
            to: isReviseMode
                ? '/app/corporate/enquiry-detailed-view/revise-proposal/$enquiryId'
                : '/app/corporate/enquiry-detailed-view/$enquiryId',
            params: { enquiryId: eId }
        });
    };

    const handleSave = (e) => {
        e.stopPropagation();
        handleSubmit(() => {
            const cardEnquiryId = data.enquiryId || proposalEnquiryId;
            onSaved?.(data.id, cardEnquiryId);
        })(e);
    };

    // const lockingPeriodUnitOptions = [
    //     { id: 'Months', name: 'Months', value: 'Months' }
    // ];

    // const discountUnitOptions = [
    //     { id: '%', name: '%', value: '%' }
    // ];

    return (
        <Box
                flex={1}
                bg="white"
                p={4}
                borderRadius="md"
                boxShadow="sm"
                border="1px solid"
                borderColor="gray.200"
                _hover={{ boxShadow: 'md' }}
            >
                <HStack align="center" justify="space-between" width="full" mb={4}>
                    <HStack spacing={3} flex={1}>
                        <Box bg="#FFDE74" px={3} py={1} borderRadius="md">
                            <Text fontWeight="bold" fontSize="md" color="#232F50">
                                {String(index).padStart(2, '0')}
                            </Text>
                        </Box>

                        <HStack spacing={1}>
                            <Text fontSize="md" fontWeight="semibold" color="#6D6D6D">{t('totalCount')}:</Text>
                            <Text fontSize="md" fontWeight="bold" color="#232F50">{data.totalCount}</Text>
                        </HStack>

                        <Box h="20px" w="1px" bg="rgba(130, 130, 130, 0.19)" />

                        <HStack spacing={1}>
                            <Text fontSize="md" fontWeight="semibold" color="#6D6D6D">{t('services')}:</Text>
                            <Text fontSize="md" fontWeight="bold" color="#232F50">{data.services}</Text>
                        </HStack>

                        <Box h="20px" w="1px" bg="rgba(130, 130, 130, 0.19)" />

                        <HStack spacing={1}>
                            <Text fontSize="md" fontWeight="semibold" color="#6D6D6D">{t('packageType')}:</Text>
                            <Text fontSize="md" fontWeight="bold" color="#232F50">{data.packageType}</Text>
                        </HStack>

                        <Box h="20px" w="1px" bg="rgba(130, 130, 130, 0.19)" />

                        <HStack spacing={1}>
                            <Text fontSize="md" fontWeight="semibold" color="#6D6D6D">{t('package')}:</Text>
                            <Text fontWeight="bold" fontSize="md" color="#8D0247">{data.packageName}</Text>
                        </HStack>
                    </HStack>

                    <HStack spacing={2}>
                        {(data.locStatus || data.status) && (
                            <Box
                                px={3}
                                py="2px"
                                borderRadius="full"
                                bg="#FFE1CD"
                                color="#AC5013"
                                fontSize="sm"
                                fontWeight="600"
                                border="1px solid #FBB8B8"
                                flexShrink={0}
                            >
                                {data.locStatus || data.status}
                            </Box>
                        )}
                        <Button
                            variant="ghost"
                            size="sm"
                            p={1}
                            minW="unset"
                            h="unset"
                            onClick={data.hasSplits ? (e) => {
                                e.stopPropagation();
                                if (onMerge) onMerge(data);
                            } : handleSplitNavigate}
                        >
                            {data.hasSplits ? (
                                <CardSplitCloseIcon boxSize={8} color="#8D0247" />
                            ) : (
                                <CardExpandIcon boxSize={8} color="#8D0247" />
                            )}
                        </Button>
                        <Button
                            variant="ghost"
                            onClick={handleToggle}
                            p={1}
                            borderRadius="full"
                            _hover={{ bg: 'gray.100' }}
                            minW="unset"
                            h="unset"
                        >
                            {isExpanded ? <UpArrowIcon /> : <DownArrowIcon />}
                        </Button>
                    </HStack>
                </HStack>

                {isExpanded && (
                    <VStack w="full" align="stretch" spacing={3} pt={4} borderTop="1px solid" borderColor="gray.100">
                        <Grid
                            templateColumns="minmax(180px, 1fr) minmax(180px, 1fr) minmax(120px, 1fr) minmax(150px, 1fr) minmax(120px, 1fr) minmax(180px, 1fr)"
                            gap={3}
                            w="full"
                            pb={6}
                        >
                            <HStack spacing={1} align="flex-end">
                                <Box flex={1}>
                                    <FormController
                                        name="lockingPeriod"
                                        control={control}
                                        type="text"
                                        labelName={t('lockingPeriod')}
                                        placeholder={t('enterLockingPeriod')}
                                        size="sm"
                                        required
                                        rightLabel={t('months')}
                                        onKeyDown={handleNumberKeyDown}
                                        errors={errors}
                                    />
                                </Box>
                            </HStack>

                            <FormController
                                name="billingFrequency"
                                control={control}
                                type="select"
                                labelName={t('billingFrequency')}
                                placeholder={t('billingFrequency')}
                                items={billingFrequencyOptions}
                                size="sm"
                                required
                                optionKey="id"
                                errors={errors}
                            />

                            <FormController
                                name="arc"
                                control={control}
                                type="text"
                                labelName={t('arc')}
                                placeholder={t('arc')}
                                size="sm"
                                onKeyDown={handleNumberKeyDown}
                                errors={errors}
                            />

                            <HStack spacing={1} align="flex-end">
                                <Box flex={1}>
                                    <FormController
                                        name="discount"
                                        control={control}
                                        type="text"
                                        labelName={t('discount')}
                                        placeholder={t('discount')}
                                        size="sm"
                                        rightLabel={t('%')}
                                        onKeyDown={handleNumberKeyDown}
                                        errors={errors}
                                    />
                                </Box>
                            </HStack>

                            <FormController
                                name="finalArc"
                                control={control}
                                type="text"
                                labelName={t('finalArc')}
                                placeholder={t('finalArc')}
                                size="sm"
                                readOnly
                                required
                                errors={errors}
                            />

                            <Box>
                                <HStack justify="space-between" mb={1}>
                                    <Text fontSize="sm" fontWeight="medium" color="gray.700">
                                        {t('otc')} *
                                    </Text>
                                    <HStack spacing={1}>
                                        <Text fontSize="xs" color="#6D6D6D">{t('proposed')}:</Text>
                                        <Text fontSize="xs" fontWeight="medium" color="gray.700">
                                            {data.proposed}
                                        </Text>
                                    </HStack>
                                </HStack>
                                <FormController
                                    name="otc"
                                    control={control}
                                    type="text"
                                    placeholder={t('enterOtc')}
                                    size="sm"
                                    onKeyDown={handleNumberKeyDown}
                                    required
                                    errors={errors}
                                />
                            </Box>
                        </Grid>

                        <VStack w="full" align="stretch" spacing={2} display={data.additionalServices ? 'flex' : 'none'}>
                            <Text fontSize="sm" fontWeight="medium" color="gray.700">{t('additionalServices')}</Text>
                            <HStack w="full" gap={4} align="center" flexWrap="wrap">
                                {services.map((service) => (
                                    <ServiceCard
                                        key={service.id}
                                        serviceName={service.name}
                                        value={service.value}
                                        onRemove={() => handleRemoveService(service.id)}
                                    />
                                ))}

                                <Button
                                    variant="ghost"
                                    size="md"
                                    minW="unset"
                                    h="unset"
                                    p={1}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                    }}
                                    _hover={{ bg: '#FFF5F7' }}
                                >
                                    <CirclePlusIcon boxSize={10} color="#8D0247" />
                                </Button>

                                <Box flex={1} />

                                <HStack spacing={3} align="flex-end">
                                    <VStack align="flex-end" spacing={1}>
                                        <HStack spacing={1}>
                                            <Text fontSize="xs" color="#6D6D6D">{t('excludeGst')}:</Text>
                                            <Text fontSize="xs" fontWeight="medium" color="gray.700">
                                                {excludeGst}
                                            </Text>
                                        </HStack>
                                        <Box
                                            border="1px solid #DEDEDE"
                                            borderRadius="md"
                                            px={4}
                                            py={2}
                                            bg="white"
                                        >
                                            <HStack spacing={2}>
                                                <Text fontSize="sm" color="#6D6D6D">{t('totalIncludeGst')}:</Text>
                                                <Text fontSize="sm" fontWeight="bold" color="#232F50">
                                                    {includeGst}
                                                </Text>
                                            </HStack>
                                        </Box>
                                    </VStack>
                                    <Button
                                        variant="outline"
                                        borderColor="#8D0247"
                                        color="#8D0247"
                                        borderRadius="full"
                                        px={6}
                                        h="40px"
                                        _hover={{ bg: '#FFF5F7' }}
                                        onClick={handleSave}
                                    >
                                        {t('save')}
                                    </Button>
                                </HStack>
                            </HStack>
                        </VStack>
                    </VStack>
                )}
            </Box>
    );
};

export default ProposalCard;
