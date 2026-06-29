import { Button, Flex, FormController, Popup, SimpleGrid, useForm } from "@kfonbss/bss-ui-components";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

import { Close, Save } from "@/components/custom";
import { fetchTicketCategory } from "@/features/public/pages/enquiryForms/action";
import { getTicketCategoryList } from "@/features/public/pages/enquiryForms/selector";
import { fetchAllRole } from "@/features/user-role/action";
import { getAllRole } from "@/features/user-role/selector";

import { fetchCustomerTypes, submitCrmMapping, updateCrmMapping } from "../action";
import { getCustomerTypes } from "../selector";


const CrmMapping = ({ open, setOpen, customerTypes, fetchCustomerTypes, fetchTicketCategory, ticketCategoryList, allRoles, fetchAllRole, submitCrmMapping, updateCrmMapping, isEditMode, initialData }) => {
    const { t } = useTranslation();

    const { control, handleSubmit, formState: { errors }, reset } = useForm();

    useEffect(() => {
        fetchCustomerTypes();
        fetchTicketCategory();
        fetchAllRole();
    }, [fetchCustomerTypes, fetchTicketCategory, fetchAllRole]);

    useEffect(() => {
        if (open && isEditMode && initialData) {
            reset({
                customerType: customerTypes?.find(c => c.id === initialData?.customerTypeId) || { id: initialData?.customerTypeId, name: initialData?.customerTypeName },
                ticketCategory: ticketCategoryList?.find(cat => cat.id === initialData?.categoryId) || { id: initialData?.categoryId, label: initialData?.categoryName },
                role: allRoles?.find(r => r.id === initialData?.roleId) || { id: initialData?.roleId, name: initialData?.roleName }
            });
        } else if (open && !isEditMode) {
            reset({
                customerType: null,
                ticketCategory: null,
                role: null
            });
        }
    }, [open, isEditMode, initialData, reset, customerTypes, ticketCategoryList, allRoles]);

    const onSubmit = (data) => {

        if (isEditMode && initialData?.id) {
            const payload = {
                id: initialData.id,
                customerTypeIds: [data?.customerType?.id],
                roleId: data?.role?.id,
                categoryIds: [data?.ticketCategory?.id],
                onSuccess: () => setOpen(false)

            }
            updateCrmMapping(payload);
        } else {
            const mappingData = {
                customerTypeIds: data?.customerType?.map(item => item?.id) || [],
                roleId: data?.role?.id,
                categoryIds: data?.ticketCategory?.map(item => item?.id) || []
            };
            submitCrmMapping({
                data: mappingData,
                onSuccess: () => setOpen(false)
            });
        }
    };

    return (
        <Popup title={isEditMode ? t('edit', { 0: t('crmMapping') }) : t('crmMapping')} size='xl' isOpen={open} onOpenChange={setOpen} placement='center'>
            <form onSubmit={handleSubmit(onSubmit)}>
                <SimpleGrid columns={2} rowGap={5} columnGap={14} mb={5} px={5}>
                    <FormController
                        placeholder={t('choose', { 0: t('customerType') })}
                        labelName={t('customerType')}
                        name='customerType'
                        control={control}
                        errors={errors}
                        type='select'
                        isMulti={!isEditMode}
                        items={customerTypes}
                        required
                    />

                    <FormController
                        placeholder={t('choose', { 0: t('ticketCategory') })}
                        labelName={t('ticketCategory')}
                        name='ticketCategory'
                        control={control}
                        errors={errors}
                        type="select"
                        isMulti={!isEditMode}
                        items={ticketCategoryList}
                        required
                    />

                    <FormController
                        placeholder={t('choose', { 0: t('role') })}
                        labelName={t('role')}
                        name='role'
                        control={control}
                        errors={errors}
                        type="select"
                        items={allRoles}
                        required
                    />

                </SimpleGrid>

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
    );
}

const mapStateToProps = (state) => ({
    customerTypes: getCustomerTypes(state),
    ticketCategoryList: getTicketCategoryList(state),
    allRoles: getAllRole(state)
});

const mapDispatchToProps = {
    fetchCustomerTypes,
    fetchTicketCategory,
    fetchAllRole,
    submitCrmMapping,
    updateCrmMapping
};

export default connect(mapStateToProps, mapDispatchToProps)(CrmMapping);