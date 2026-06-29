import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, Flex, FormController, HStack, Popup, SimpleGrid, Text, useForm } from "@kfonbss/bss-ui-components"
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import { Save } from "@/components/custom";
import { allowOnlyDigits } from "@/utils/validationUtils";

import { fetchDefaultPackageType, submitMainService, updateMainService } from "../action";
import { BUNDLE_TYPE, CATEGORY_TYPE } from "../constants";
import { getDefaultPackageType, getSubmitSuccess } from "../selector";
import { actions as sliceActions } from "../slice";
import { mainServiceSchema } from "../validation";

const MainServicePopup = ({ isOpen, handleClose, data = null }) => {
    const { t } = useTranslation();

    const dispatch = useDispatch();
    const submitSuccess = useSelector(getSubmitSuccess);
    const defaultPackageType = useSelector(getDefaultPackageType);

    const { control, formState: { errors }, handleSubmit, reset } = useForm({
        resolver: yupResolver(mainServiceSchema(t)),
        defaultValues: {
            active: 'active'
        }
    })

    useEffect(() => {
        dispatch(fetchDefaultPackageType())
    }, [dispatch])

    useEffect(() => {
        if (!isOpen) {
            reset();
        }
    }, [isOpen, reset]);

    useEffect(() => {
        if (data) {
            reset({
                serviceName: data.name,
                labelName: data.label,
                subPackageCount: data.count,
                bundleType: BUNDLE_TYPE.find(item => item.name === data.bundleType),
                defaultPackageType: data.packageTypes,
                isBod: data.isBod === true,
                isAddOnPackage: data.isAddOn === true,
                active: (data.active === true || data.isActive === true) ? 'active' : 'inactive',
                serviceCategory: CATEGORY_TYPE.find(item => item.name === data.serviceCategoryType) || null
            });
        } else {
            reset({
                active: 'active',
                serviceName: '',
                labelName: '',
                subPackageCount: '',
                bundleType: null,
                defaultPackageType: [],
                isBod: false,
                isAddOnPackage: false,
                serviceCategory: null
            });
        }
    }, [data, reset]);

    useEffect(() => {
        if (submitSuccess) {
            handleClose();
            reset();
            dispatch(sliceActions.setSubmitSuccess(false));
        }
    }, [submitSuccess, handleClose, reset, dispatch]);

    const onSubmit = (formData) => {
        const payload = {
            name: formData?.serviceName,
            label: formData?.labelName,
            count: formData?.subPackageCount,
            isActive: formData?.active === 'active',
            bundleType: formData?.bundleType?.name,
            isBod: formData?.isBod === true,
            isAddOn: formData?.isAddOnPackage === true,
            serviceCategoryType: formData?.serviceCategory?.name,
            packageTypeIds: formData?.defaultPackageType?.map((item) => item.id)
        }

        if (data?.id) {
            dispatch(updateMainService({ id: data.id, ...payload }));
        } else {
            dispatch(submitMainService(payload));
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
                    <Text>{data?.id ? t('edit') : t('create')}</Text>
                    <Text color="#FD1C7A">{t('mainService')}</Text>
                </HStack>
            }
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                <SimpleGrid alignItems={'stretch'} columns={2} gap={6} px={5}>
                    <FormController
                        placeholder={t('enter', { 0: t('serviceCategory') })}
                        labelName={t('serviceCategory')}
                        name='serviceCategory'
                        control={control}
                        errors={errors}
                        type='select'
                        items={CATEGORY_TYPE}
                        required
                    />

                    <FormController
                        placeholder={t('enter', { 0: t('serviceName') })}
                        labelName={t('serviceName')}
                        name='serviceName'
                        control={control}
                        errors={errors}
                        required
                    />

                    <FormController
                        placeholder={t('enter', { 0: t('labelName') })}
                        labelName={t('labelName')}
                        name='labelName'
                        control={control}
                        errors={errors}
                        required
                    />

                    <FormController
                        placeholder={t('enter', { 0: t('subPackageCount') })}
                        labelName={t('subPackageCount')}
                        name='subPackageCount'
                        control={control}
                        errors={errors}
                        required
                        onKeyDown={allowOnlyDigits}
                    />

                    <FormController
                        placeholder={t('choose', { 0: t('bundleType') })}
                        labelName={t('bundleType')}
                        name='bundleType'
                        control={control}
                        errors={errors}
                        type="select"
                        items={BUNDLE_TYPE}
                        required
                    />

                    <FormController
                        placeholder={t('choose', { 0: t('defaultPackageType') })}
                        labelName={t('defaultPackageType')}
                        name='defaultPackageType'
                        control={control}
                        errors={errors}
                        type="select"
                        isMulti
                        items={defaultPackageType}
                        required
                    />

                    <FormController
                        labelName={t('status')}
                        name='active'
                        control={control}
                        errors={errors}
                        type="radio"
                        items={[
                            { label: t('active'), value: 'active' },
                            { label: t('inActive'), value: 'inactive' }
                        ]}
                        required
                    />

                    <Box>
                        <Text mb='4px' fontSize='14px' fontWeight='normal' color='#272727' lineHeight='1.2'>
                            {t('specialPackageType')}
                        </Text>
                        <Flex direction='row' align='center'  flexWrap='nowrap'>
                            <Box flexShrink={0}>
                                <FormController
                                    name='isAddOnPackage'
                                    labelName={t('isAddOnPackage')}
                                    control={control}
                                    errors={errors}
                                    type='checkbox'
                                />
                            </Box>
                            <Box flexShrink={0}>
                                <FormController
                                    name='isBod'
                                    labelName={t('isBod')}
                                    control={control}
                                    errors={errors}
                                    type='checkbox'
                                />
                            </Box>
                        </Flex>
                    </Box>

                </SimpleGrid>
                <Flex gap={2} justifyContent={'flex-end'} px={5} pt={4}>
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
            </form>
        </Popup>
    )
}

export default MainServicePopup