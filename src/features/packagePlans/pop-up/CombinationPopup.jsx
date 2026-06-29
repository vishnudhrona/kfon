import { yupResolver } from "@hookform/resolvers/yup"
import { Button, Flex, FormController, HStack, Popup, Text, useForm, VStack } from "@kfonbss/bss-ui-components"
import { useEffect, useMemo } from "react"
import { useTranslation } from "react-i18next"
import { useDispatch, useSelector } from "react-redux"
import * as yup from 'yup'

import { Close, Save } from "@/components/custom"

import { fetchServiceCategoryLookup, fetchSubServiceCategoryLookup, submitServiceMapping, updateServiceMapping } from "../action"
import { CATEGORY_TYPE } from "../constants"
import { getServiceCategoryLookup, getSubmitSuccess, getSubServiceCategoryLookup } from "../selector"
import { actions as sliceActions } from "../slice"

const CombinationPopup = ({ isOpen, handleClose, editData, type }) => {
    const { t } = useTranslation()
    const dispatch = useDispatch()
    const serviceCategoryLookup = useSelector(getServiceCategoryLookup)
    const subServiceCategoryLookup = useSelector(getSubServiceCategoryLookup)
    const submitSuccess = useSelector(getSubmitSuccess)

    const schema = useMemo(() => yup.object().shape({
        serviceName: yup.object().nullable().required(t('validations.required', { 0: t('mainService') })),
        subPackageCount: yup.mixed().nullable(),
        subService: yup.array().nullable().required(t('validations.required', { 0: t('subService') }))
            .test('max-sub-services', '', function (value) {
                const maxCount = this.parent.serviceName?.subPackageCount || 0;
                if (value && value.length > maxCount) {
                    return this.createError({ message: t('maxSubServiceAllowed', `You can only select up to ${maxCount} sub services`) });
                }
                return true;
            })
    }), [t]);

    const { control, formState: { errors }, handleSubmit, reset, watch } = useForm({
        resolver: yupResolver(schema)
    })

    useEffect(() => {
        if (!isOpen) {
            reset({
                serviceCategory: null,
                serviceName: null,
                subService: null
            });
        } else if (editData) {
            reset({
                serviceCategory: { label: type, name: type },
                serviceName: { id: editData.serviceCategoryId, name: editData.serviceName, subPackageCount: editData.count },
                subService: (editData.subServices || []).map(sub => ({ id: sub.subServiceCategoryId, name: sub.subServiceName || sub.subServiceLabel }))
            });
        }
    }, [isOpen, reset, editData, type]);

    const serviceName = watch('serviceName');
    const selectedSubServices = watch('subService');
    const serviceCategory = watch('serviceCategory')

    useEffect(() => {
        if (isOpen) {
            if (serviceCategory?.name) dispatch(fetchServiceCategoryLookup({ type: serviceCategory?.name }))
            else if (editData) dispatch(fetchServiceCategoryLookup()) // fetch all if no specific category during edit
            dispatch(fetchSubServiceCategoryLookup())
        }
    }, [dispatch, isOpen, serviceCategory, editData])

    useEffect(() => {
        if (submitSuccess) {
            handleClose();
            reset();
            dispatch(sliceActions.setSubmitSuccess(false));
        }
    }, [submitSuccess, handleClose, reset, dispatch]);

    const onSubmit = (data) => {
        const payload = {
            serviceCategoryId: data?.serviceName?.id,
            subServiceCategoryIds: data?.subService?.map((item) => item?.id),
            serviceCategoryType: data?.serviceCategory?.name || null
        }
        
        if (editData?.serviceCategoryId) {
            dispatch(updateServiceMapping({ 
                id: editData.serviceCategoryId, 
                subServiceCategoryIds: payload?.subServiceCategoryIds,
                serviceCategoryType: payload?.serviceCategoryType 
            }));
        } else {
            dispatch(submitServiceMapping(payload));
        }
    }
    return (
        <Popup
            isOpen={isOpen}
            onOpenChange={handleClose}
            size="md"
            title={
                <HStack fontSize="24px" fontWeight="600">
                    <Text>{t('combine')}</Text>
                    <Text color="#FD1C7A">{t('services')}</Text>
                </HStack>
            }
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                <VStack alignItems={'stretch'} gap={5} px={5}>
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
                        placeholder={t('choose', { 0: t('mainService') })}
                        labelName={t('mainService')}
                        name='serviceName'
                        control={control}
                        errors={errors}
                        type='select'
                        items={serviceCategoryLookup}
                        required
                    />

                    <FormController
                        placeholder={t('enter', { 0: t('subPackageCount') })}
                        labelName={t('subPackageCount')}
                        name='subPackageCount'
                        control={control}
                        errors={errors}
                        disabled={true}
                        value={serviceName?.subPackageCount}
                        required
                    />

                    <FormController
                        placeholder={t('choose', { 0: t('subService') })}
                        labelName={t('subService')}
                        name='subService'
                        control={control}
                        errors={errors}
                        type='select'
                        isMulti
                        items={subServiceCategoryLookup}
                        isOptionDisabled={() => selectedSubServices?.length >= (serviceName?.subPackageCount || 0)}
                        required
                    />

                    <Flex gap={2} justifyContent={'flex-end'}>
                        <Button
                            onClick={handleClose}
                            variant="outline"
                            colorScheme="gray"
                            height={'40px'}
                        >
                            <Close />
                            {t('close')}
                        </Button>
                        <Button
                            type="submit"
                            variant="solid"
                            colorScheme="gray"
                            height={'40px'}
                        >
                            {t('submit')}
                            <Save />
                        </Button>
                    </Flex>
                </VStack>
            </form>
        </Popup>
    )
}

export default CombinationPopup