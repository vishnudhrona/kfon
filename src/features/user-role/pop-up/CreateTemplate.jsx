import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Flex, FormController, Popup, SimpleGrid, useForm } from "@kfonbss/bss-ui-components";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

import { Close, Save } from "@/components/custom";

import { editTemplate, fetchAllRole, submitTemplate } from "../action";
import { getAllRole } from "../selector";
import { createTemplateValidation } from "../validation";

const CreateTemplate = ({ open, setOpen, fetchRoleLookup, getAllRoleData, submit, editTemplateAction, selectedData, isEditMode }) => {
    const { t } = useTranslation();

    useEffect(() => {
        fetchRoleLookup();
    }, [fetchRoleLookup]);

    const { control, formState: { errors }, handleSubmit, reset } = useForm({
        resolver: yupResolver(createTemplateValidation(t)),
        mode: 'all'
    });

    useEffect(() => {
        if (isEditMode && selectedData) {
            reset({
                name: selectedData.name,
                label: selectedData.label,
                roleName: { id: selectedData.roleId, name: selectedData.roleName },
                active: selectedData.active ? 'active' : 'inactive'
            });
        } else {
            reset({
                name: '',
                label: '',
                roleName: null,
                active: 'active'
            });
        }
    }, [isEditMode, selectedData, reset]);

    const onSubmit = (data) => {
        const payload = {
            ...data,
            name: data?.name?.toUpperCase(),
            roleName: data?.roleName?.name,
            roleId: data?.roleName?.id,
            active: data?.active === "active" ? true : false,
            onSuccess: () => {
                setOpen(false)
                reset()
            }
        }

        if (isEditMode) {
            payload.id = selectedData.id;
            editTemplateAction(payload)
        } else {
            submit(payload)
        }
    };

    return (
        <Popup title={isEditMode ? t('updateTemplate') : t('createTemplate')} size='xl' isOpen={open} onOpenChange={setOpen} placement='center'>
            <form onSubmit={handleSubmit(onSubmit)}>
                <SimpleGrid columns={2} rowGap={5} columnGap={14} mb={5} px={5}>
                    <FormController
                        placeholder={t('enter', { 0: t('templateName') })}
                        labelName={t('templateName')}
                        name='name'
                        control={control}
                        errors={errors}
                        minLength={3}
                        maxLength={100}
                        required
                    />

                    <FormController
                        placeholder={t('enter', { 0: t('label') })}
                        labelName={t('label')}
                        name='label'
                        control={control}
                        errors={errors}
                        minLength={3}
                        maxLength={100}
                        required
                    />

                    <FormController
                        placeholder={t('select', { 0: t('roleName') })}
                        labelName={t('roleName')}
                        name='roleName'
                        control={control}
                        errors={errors}
                        minLength={3}
                        maxLength={100}
                        type='select'
                        items={getAllRoleData}
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
                <Flex gap={2} px={5} justifyContent={'flex-end'} pt={8} pb={5}>
                    <Button
                        onClick={() => setOpen(false)}
                        variant="outline"
                        colorScheme="gray"
                    >
                        <Close />
                        {t('close')}
                    </Button>
                    <Button
                        type="submit"
                        variant="solid"
                        colorScheme="gray"
                    >
                        {isEditMode ? t('update') : t('submit')}
                        <Save />
                    </Button>
                </Flex>
            </form>
        </Popup>
    );
};

const mapStateToProps = (state) => ({
    getAllRoleData: getAllRole(state)
});

const mapDispatchToProps = {
    fetchRoleLookup: fetchAllRole,
    submit: submitTemplate,
    editTemplateAction: editTemplate
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateTemplate);