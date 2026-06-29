import { Box, Button, Flex, FormController, Popup, SimpleGrid, useForm } from "@kfonbss/bss-ui-components";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";

import { Close, Save } from "@/components/custom";

import { createDesignationSubmit, updateDesignationSubmit } from "../action";

const CreateDesigantion = ({ open, setOpen, isEditMode, selectedData }) => {
    const { t } = useTranslation();

    const dispatch = useDispatch()

    const { formState: { errors }, reset, control, handleSubmit } = useForm();

    const onSubmit = (data) => {
        const payload = {
            ...data,
            active: data.active === 'active',
            onSuccess: () => {
                setOpen(false);
            }
        }

        if (isEditMode && selectedData?.id) {
            dispatch(updateDesignationSubmit({ ...payload, id: selectedData.id }));
        } else {
            dispatch(createDesignationSubmit(payload));
        }
    }

    useEffect(() => {
        if (open) {
            if (isEditMode && selectedData) {
                reset({
                    name: selectedData.name,
                    active: selectedData.active ? 'active' : 'inactive',
                    label: selectedData.label
                });
            } else {
                reset({
                    name: '',
                    active: 'active',
                    label: ''
                });
            }
        }
    }, [open, isEditMode, selectedData, reset]);

    return (
        <Popup title={isEditMode ? t('editDesignation') : t('createDesignation')} size='xl' isOpen={open} onOpenChange={setOpen} placement='center'>
            <form onSubmit={handleSubmit(onSubmit)}>
                <SimpleGrid columns={2} rowGap={5} columnGap={14} mb={5} px={5}>
                    <FormController
                        placeholder={t('enter', { 0: t('designationName') })}
                        labelName={t('designationName')}
                        name='name'
                        control={control}
                        errors={errors}
                        minLength={3}
                        maxLength={100}
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
                            { label: t('inactive'), value: 'inactive' }
                        ]}
                        required
                    />
                </SimpleGrid>
                <Box px={5} mb={8}>
                    <FormController
                        placeholder={t('enter', { 0: t('description') })}
                        labelName={t('description')}
                        name='label'
                        control={control}
                        errors={errors}
                        minLength={5}
                        maxLength={100}
                        required
                    />
                </Box>
                <Flex gap={2} px={5} justifyContent={'flex-end'}>
                    <Button
                        onClick={() => setOpen(false)}
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
                        {isEditMode ? t('update') : t('submit')}
                        <Save />
                    </Button>
                </Flex>
            </form>
        </Popup>
    )
}

export default CreateDesigantion;