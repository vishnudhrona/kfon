import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, Flex, FormController, HStack, Popup, SimpleGrid, Text, useForm, VStack } from "@kfonbss/bss-ui-components";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import { Save } from "@/components/custom";

import { fetchRetailServiceType, fetchServiceTypesLookup, fetchSubPackageTypeLookup, fetchSubServiceById, submitSubService, updateSubService } from "../action";
import { getRetailServiceType, getServiceTypesLookup, getSubmitSuccess, getSubPackageTypeLookup, getSubServiceDetail } from "../selector";
import { actions as sliceActions } from "../slice";
import { subServiceSchema } from "../validation";

const SubServicePopup = ({ isOpen, handleClose, editData }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const subPackageTypeLookup = useSelector(getSubPackageTypeLookup);
    const submitSuccess = useSelector(getSubmitSuccess);
    const serviceTypesLookup = useSelector(getServiceTypesLookup)
    const mainServiceOptions = useSelector(getRetailServiceType);
    const subServiceDetail = useSelector(getSubServiceDetail);

    const { control, formState: { errors }, handleSubmit, reset, setValue, watch } = useForm({
        resolver: yupResolver(subServiceSchema(t)),
        defaultValues: {
            discountable: 'yes',
            partnerMapping: 'yes',
            isActive: 'yes'
        }
    })

    const serviceTypes = watch('serviceTypes')

    useEffect(() => {
        dispatch(fetchServiceTypesLookup())
        dispatch(fetchRetailServiceType())
    }, [dispatch]);

    useEffect(() => {
        if (serviceTypes?.requiresRCode) {
            dispatch(fetchSubPackageTypeLookup({ serviceTypeId: serviceTypes?.id }))
        }
    }, [dispatch, serviceTypes])

    useEffect(() => {
        if (!isOpen) {
            reset();
            dispatch(sliceActions.clearSubServiceDetail());
        }
    }, [isOpen, reset, dispatch]);

    // On edit open, fetch the full detail by id so all fields (including
    // serviceCategories for the Main Service multi-select) hydrate correctly.
    useEffect(() => {
        if (isOpen && editData?.id) {
            dispatch(fetchSubServiceById(editData.id));
        }
    }, [isOpen, editData?.id, dispatch]);

    useEffect(() => {
        if (editData?.id && subServiceDetail) {
            reset({
                name: subServiceDetail.name ?? '',
                label: subServiceDetail.label ?? '',
                sequence: subServiceDetail.sequence ?? '',
                mainServices: Array.isArray(subServiceDetail.serviceCategories)
                    ? subServiceDetail.serviceCategories
                    : [],
                discountable: subServiceDetail.discountable ? 'yes' : 'no',
                partnerMapping: subServiceDetail.partnerMapping ? 'yes' : 'no',
                isActive: subServiceDetail.isActive ? 'yes' : 'no',
                serviceTypes: subServiceDetail.serviceType ?? null,
                subPackageTypeId: subServiceDetail.subPackageTypeId
                    ? { id: subServiceDetail.subPackageTypeId }
                    : null
            });
        } else if (!editData) {
            reset({
                discountable: 'yes',
                partnerMapping: 'yes',
                isActive: 'yes',
                mainServices: []
            });
        }
    }, [editData, subServiceDetail, reset]);

    useEffect(() => {
        if (!editData || !subServiceDetail) return;
        const targetId = subServiceDetail.serviceType?.id;
        if (!targetId) return;
        const selectedServiceType = serviceTypesLookup.find((item) => item.id === targetId);
        if (selectedServiceType) {
            setValue('serviceTypes', selectedServiceType);
        }
    }, [editData, subServiceDetail, serviceTypesLookup, setValue]);

    useEffect(() => {
        if (!editData || !subServiceDetail) return;
        const targetId = subServiceDetail.subPackageTypeId;
        if (!targetId) return;
        const selectedSubPackage = subPackageTypeLookup.find((item) => item.id === targetId);
        if (selectedSubPackage) {
            setValue('subPackageTypeId', selectedSubPackage);
        }
    }, [editData, subServiceDetail, subPackageTypeLookup, setValue]);

    useEffect(() => {
        if (submitSuccess) {
            handleClose();
            reset();
            dispatch(sliceActions.setSubmitSuccess(false));
        }
    }, [submitSuccess, handleClose, reset, dispatch]);

    const onSubmit = (data) => {
        const payload = {
            name: data?.name,
            label: data?.label,
            discountable: data?.discountable === 'yes',
            partnerMapping: data?.partnerMapping === 'yes',
            isActive: data?.isActive === 'yes',
            subPackageTypeId: data?.subPackageTypeId?.id || null,
            serviceTypeId: data?.serviceTypes?.id || null,
            serviceCategoryIds: Array.isArray(data?.mainServices)
                ? data.mainServices.map((item) => item?.id).filter(Boolean)
                : []
        }
        if (editData?.id) {
            dispatch(updateSubService({ id: editData.id, ...payload }));
        } else {
            dispatch(submitSubService(payload));
        }
    }

    return (
        <Popup
            isOpen={isOpen}
            onOpenChange={handleClose}
            size="lg"
            closeButton
            title={
                <HStack fontSize="24px" fontWeight="600">
                    <Text>{editData ? t('update') : t('create')}</Text>
                    <Text color="#FD1C7A">{t('subService')}</Text>
                </HStack>
            }
        >
            <VStack as="form" onSubmit={handleSubmit(onSubmit)} alignItems={'stretch'} gap={6} px={5}>
                <SimpleGrid columns={2} columnGap={6} rowGap={6}>
                    <Box gridColumn='1 / -1'>
                        <FormController
                            placeholder={t('choose', { 0: t('mainService') })}
                            labelName={t('mainService')}
                            name='mainServices'
                            control={control}
                            errors={errors}
                            type='select'
                            isMulti
                            items={mainServiceOptions}
                            getOptionLabel={(o) => o?.label || o?.name || ''}
                        />
                    </Box>

                    <FormController
                        placeholder={t('enter', { 0: t('subServiceName') })}
                        labelName={t('subServiceName')}
                        name='name'
                        control={control}
                        errors={errors}
                        required
                    />

                    <FormController
                        placeholder={t('enter', { 0: t('labelName') })}
                        labelName={t('labelName')}
                        name='label'
                        control={control}
                        errors={errors}
                        required
                    />

                    <FormController
                        placeholder={t('choose', { 0: t('serviceTypes') })}
                        labelName={t('serviceTypes')}
                        name='serviceTypes'
                        control={control}
                        errors={errors}
                        type='select'
                        items={serviceTypesLookup}
                        required
                    />

                    {serviceTypes?.requiresRCode && (
                        <FormController
                            placeholder={t('choose', { 0: t('rCodE') })}
                            labelName={t('rCode')}
                            name='subPackageTypeId'
                            control={control}
                            errors={errors}
                            type='select'
                            items={subPackageTypeLookup}
                            required
                        />
                    )}
                </SimpleGrid>

                <Box border={'1px solid #A0A0A0'} borderRadius={6} pt={4} px={4}>
                    <HStack gap={2} justifyContent={'space-between'}>
                        <FormController
                            labelName={t('enableDiscount')}
                            name='discountable'
                            control={control}
                            errors={errors}
                            type="radio"
                            items={[
                                { label: t('yes'), value: 'yes' },
                                { label: t('no'), value: 'no' }
                            ]}
                            required
                        />

                        <FormController
                            labelName={t('includeProvider')}
                            name='partnerMapping'
                            control={control}
                            errors={errors}
                            type="radio"
                            items={[
                                { label: t('yes'), value: 'yes' },
                                { label: t('no'), value: 'no' }
                            ]}
                            required
                        />

                        <FormController
                            labelName={t('status')}
                            name='isActive'
                            control={control}
                            errors={errors}
                            type="radio"
                            items={[
                                { label: t('active'), value: 'yes' },
                                { label: t('inActive'), value: 'no' }
                            ]}
                            required
                        />
                    </HStack>
                </Box>

                <Flex gap={2} justifyContent={'flex-end'} pt={2}>
                    <Button
                        type="submit"
                        variant="outline"
                        borderColor='#8D0247'
                        color='#8D0247'
                        height={'40px'}
                        _hover={{ bg: '#8D0247', color: 'white' }}
                    >
                        {t('submit')}
                        <Save />
                    </Button>
                </Flex>
            </VStack>
        </Popup>
    )
}

export default SubServicePopup