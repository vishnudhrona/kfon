import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, FormController, Popup, SimpleGrid, useForm } from "@kfonbss/bss-ui-components";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

import { Close, Save } from "@/components/custom";
import { fetchOnboardingSharePlan } from "@/features/onboarding/action";
import { getSharePlan } from "@/features/onboarding/selector";

import { fetchPartnerList, submitNewGroupAssociation } from "../action";
import { getPartnerList, getPartnerLnpList } from "../selector";
import { newGroupValidation } from "../validation";

const NewGroup = ({ isOpen, onClose, getSharePlan, sharePlan, fetchPartnerList, partnerList, partnerLnpList, submitNewGroup }) => {

    const { t } = useTranslation();

    useEffect(() => {
        getSharePlan();
        fetchPartnerList({ type: 'LNP' });
        fetchPartnerList({ type: 'AGNP' });
    }, [getSharePlan, fetchPartnerList]);

    const { control, handleSubmit, formState: { errors } } = useForm({
        mode: 'onChange',
        resolver: yupResolver(newGroupValidation(t))
    });

    const onSubmit = (data) => {
        const payload = {
            lnpPartnerId: data?.lnp?.partnerId,
            agnpPartnerId: data?.agnp?.partnerId,
            revenueShareUuid: data?.sharePlan?.id,
            revenueShareName: data?.sharePlan?.name,
            onSuccess: () => onClose(false)
        }
        submitNewGroup(payload);
    };

    return (
        <Popup title={t("newGroupAssociation")} isOpen={isOpen} onClose={onClose} size={'sm'}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <SimpleGrid gap={5} px={5}>
                    <FormController
                        placeholder={t('choose', { 0: t('lnp') })}
                        labelName={t('lnp')}
                        name='lnp'
                        control={control}
                        errors={errors}
                        type='select'
                        items={partnerLnpList}
                        required
                    />

                    <FormController
                        placeholder={t('choose', { 0: t('agnp') })}
                        labelName={t('agnp')}
                        name='agnp'
                        control={control}
                        errors={errors}
                        type="select"
                        items={partnerList}
                        required
                    />

                    <FormController
                        placeholder={t('enter', { 0: t('sharePlan') })}
                        labelName={t('sharePlan')}
                        name='sharePlan'
                        control={control}
                        errors={errors}
                        type="select"
                        items={sharePlan}
                        required
                    />
                </SimpleGrid>

                <Box gridColumn={'span 2'} display={'flex'} justifyContent={'flex-end'} gap={3} mt={7} px={5}>
                    <Button variant={'outline'}
                        onClick={() => onClose(false)}
                    ><Close />{t('cancel')}</Button>
                    <Button variant={'solid'} type="submit"><Save />{t('save')}</Button>
                </Box>
            </form>
        </Popup>
    );
};

const mapStateToProps = (state) => ({
    sharePlan: getSharePlan(state),
    partnerList: getPartnerList(state),
    partnerLnpList: getPartnerLnpList(state)
})

const mapDispatchToProps = {
    getSharePlan: fetchOnboardingSharePlan,
    fetchPartnerList: fetchPartnerList,
    submitNewGroup: submitNewGroupAssociation
};

export default connect(mapStateToProps, mapDispatchToProps)(NewGroup);