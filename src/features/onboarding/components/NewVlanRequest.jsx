import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, FormController, Popup, SimpleGrid, useForm } from "@kfonbss/bss-ui-components";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

import { Close, Save } from "@/components/custom";

import { fetchOnboardingPopName, fetchVlanPartnerList, submitVlanRequest } from "../action";
import { getPartnerList, getPopName } from "../selector";
import { vlanRequestValidation } from "../validation";


const NewVlanRequest = ({ isOpen, onClose, fetchPopName, getPopName, fetchPartnerList, partnerList, submit }) => {
    const { t } = useTranslation();

    const { control, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(vlanRequestValidation(t)),
        mode: 'onChange'
    });

    useEffect(() => {
        fetchPopName();
        fetchPartnerList({ partnerType: 'LNP' });
    }, [fetchPopName, fetchPartnerList]);

    const onSubmit = (data) => {

        const payload = {
            ...data,
            partnerId: data.partnerId.partnerId,
            popName: data.popName.name,
            onSuccess: () => onClose(false)
        };

        submit(payload);
    };

    return (
        <Popup title={t("addNewVlanMapping")}
            isOpen={isOpen} onClose={onClose}
            size={'lg'}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <SimpleGrid columns={2} gap={5} px={5}>
                    <FormController
                        placeholder={t('choose', { 0: t('partner') })}
                        labelName={t('partner')}
                        name='partnerId'
                        control={control}
                        errors={errors}
                        type='select'
                        items={partnerList}
                        required
                    />

                    <FormController
                        placeholder={t('choose', { 0: t('pop') })}
                        labelName={t('pop')}
                        name='popName'
                        control={control}
                        errors={errors}
                        type="select"
                        items={getPopName}
                        required
                    />

                    <FormController
                        placeholder={t('enter', { 0: t('portNumber') })}
                        labelName={t('port')}
                        name='portNumber'
                        control={control}
                        errors={errors}
                        required
                    />

                    <FormController
                        placeholder={t('enter', { 0: t('vlanRange') })}
                        labelName={t('preferedVlanRange')}
                        name='vlanRange'
                        control={control}
                        errors={errors}
                        required
                    />

                    <FormController
                        placeholder={t('enter', { 0: t('switchType') })}
                        labelName={t('switchType')}
                        name='switchType'
                        control={control}
                        errors={errors}
                        required
                    />

                    <FormController
                        placeholder={t('enter', { 0: t('switchIp') })}
                        labelName={t('switchIp')}
                        name='switchIp'
                        control={control}
                        errors={errors}
                        required
                    />

                    <FormController
                        placeholder={t('enter', { 0: t('sfp') })}
                        labelName={t('sfp')}
                        name='sfp'
                        control={control}
                        errors={errors}
                        required
                    />
                </SimpleGrid>

                <Box px={5} mt={5} size={'lg'} >
                    <FormController
                        placeholder={t('remarks')}
                        labelName={t('remarks')}
                        name='remarks'
                        control={control}
                        errors={errors}
                        type='textArea'
                        size='xl'
                        resize={'vertical'}
                        required
                    />
                </Box>

                <Box gridColumn={'span 2'} display={'flex'} justifyContent={'flex-end'} gap={3} mt={7}>
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
    getPopName: getPopName(state),
    partnerList: getPartnerList(state)

});

const mapDispatchToProps = {
    submit: submitVlanRequest,
    fetchPopName: fetchOnboardingPopName,
    fetchPartnerList: fetchVlanPartnerList
};

export default connect(mapStateToProps, mapDispatchToProps)(NewVlanRequest);
