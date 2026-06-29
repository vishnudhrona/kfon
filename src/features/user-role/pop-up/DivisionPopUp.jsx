import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Flex, FormController, Popup, SimpleGrid, useForm } from "@kfonbss/bss-ui-components";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import { Close, Save } from "@/components/custom";
import { handleKeyDown } from "@/utils/validationUtils";

import { createDivisionSubmit, fetchOrganization, updateDivisionSubmit } from "../action";
import { getOrganization } from "../selector";
import { createDivisionValidation } from "../validation";

const DivisionPopUp = ({ open, setOpen, isEditMode, selectedData }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const organizationData = useSelector(getOrganization);

    useEffect(() => {
        dispatch(fetchOrganization());
    }, [dispatch]);

    const {
        control,
        formState: { errors },
        handleSubmit,
        reset
    } = useForm({
        resolver: yupResolver(createDivisionValidation(t)),
        mode: 'onTouched'
    });

    useEffect(() => {
        if (open) {
            if (isEditMode && selectedData) {
                const defaultOrg = organizationData?.find((org) => org?.id === selectedData?.organization?.id || org?.id === selectedData?.organizationId) || null;
                reset({
                    name: selectedData?.name,
                    active: selectedData?.active ? 'active' : 'inactive',
                    organization: defaultOrg
                });
            } else {
                reset({ active: 'active', name: '', organization: null });
            }
        }
    }, [open, isEditMode, selectedData, organizationData, reset]);

    const onSubmit = (data) => {
        const { organization, ...rest } = data;
        const payload = {
            ...rest,
            organizationId: organization?.id,
            active: data?.active === 'active'
        };
        if (isEditMode) {
            dispatch(updateDivisionSubmit({
                ...payload,
                id: selectedData?.id,
                onSuccess: () => setOpen(false)
            }));
        } else {
            dispatch(createDivisionSubmit({
                ...payload,
                onSuccess: () => setOpen(false)
            }));
        }
    };

    return (
        <Popup title={t('createDivision')} size='xl' isOpen={open} onOpenChange={setOpen} placement='center'>
            <form onSubmit={handleSubmit(onSubmit)}>
                <SimpleGrid columns={2} rowGap={5} columnGap={14} mb={5} px={5}>
                    <FormController
                        placeholder={t('select', { 0: t('organization') })}
                        labelName={t('organization')}
                        name='organization'
                        control={control}
                        errors={errors}
                        type='select'
                        items={organizationData}
                        required
                    />

                    <FormController
                        placeholder={t('enter', { 0: t('divisionName') })}
                        labelName={t('divisionName')}
                        name='name'
                        control={control}
                        errors={errors}
                        onKeyDown={handleKeyDown}
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

export default DivisionPopUp;