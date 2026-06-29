import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, FormController, HStack, Popup, Table, useForm, VStack } from "@kfonbss/bss-ui-components";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

import { BigRoundPluseIcon, Close, DeleteIcon, Save } from "@/components/custom";
import { errorToast } from "@/components/custom/Toast";
import { fetchOnboardingPincode, fetchOnboardingPostoffice } from "@/features/onboarding/action";
import { getPincode, getPostoffice } from "@/features/onboarding/selector";
import { mapObjectValues } from "@/utils/commonUtils";

import { addServiceArea } from "../../action";
import { ADD_SERVICE_AREA } from "../../constants";
import { addServiceAreaSchema } from "../../validation";

const AddServiceArea = ({ isOpen, onClose, fetchPincode, pincode, fetchPostoffice, postofficeValue, addServiceArea, id }) => {
    const { t } = useTranslation();
    const [serviceAreaList, setServiceAreaList] = useState([]);    

    const { control, handleSubmit, reset, formState: { errors }, watch } = useForm({
        mode: 'onChange',
        resolver: yupResolver(addServiceAreaSchema(t))
    });

    const pinCodeValue = watch('pinCode');

    useEffect(() => {
        fetchPincode();
    }, [fetchPincode]);

    useEffect(() => {
        if (pinCodeValue?.pincode) {
            fetchPostoffice({ pincode: Number(pinCodeValue?.pincode) });
        }
    }, [pinCodeValue, fetchPostoffice]);

    const handleAdd = useCallback((data) => {        
        const pinCode = data?.pinCode?.pincode;
        const postOfficeName = data?.postOfficeName?.name;

        const isDuplicate = serviceAreaList.some(
            (item) => item.pinCode === pinCode && item.postOfficeName === postOfficeName
        );

        if (isDuplicate) {
            errorToast({ description: t('serviceAreaAlreadyAdded') });
            return;
        }

        const newItem = {
            pinCode,
            postOfficeName,
            id: Date.now(),
            slno: serviceAreaList.length + 1
        };

        setServiceAreaList([...serviceAreaList, newItem]);
        reset({ pinCode: '', postOfficeName: '' });
    }, [serviceAreaList, reset, t]);

    const handleDelete = useCallback((id) => {
        const updatedList = serviceAreaList
            .filter(item => item.id !== id)
            .map((item, index) => ({ ...item, slno: index + 1 }));
        setServiceAreaList(updatedList);
    }, [serviceAreaList]);

    const columns = useMemo(() => {
        const dataColumns = mapObjectValues(ADD_SERVICE_AREA, t, ['header']);
        return [
            ...dataColumns,
            {
                header: t('action'),
                accessor: 'action',
                cell: (row) => (
                    <Box onClick={() => handleDelete(row.id)} cursor="pointer">
                        <DeleteIcon />
                    </Box>
                )
            }
        ];
    }, [t, handleDelete]);

    const onSubmit = () => {
        if (serviceAreaList.length === 0) {
            errorToast({ description: t('addServiceArea') });
            return;
        }
        const payload = {
            id,
            postOffices: serviceAreaList,
            onSuccess: () => onClose(false)
        };
        
        addServiceArea(payload);
    };

    return (
        <Popup title={t("addServiceArea")} isOpen={isOpen} onClose={onClose} size={'lg'}>
            <VStack alignItems={'stretch'} gap={6} px={5}>
                <HStack align="flex-end" spacing={4} width="100%" flexWrap="nowrap">
                    <Box flex={1}>
                        <FormController
                            placeholder={t('select', { 0: t('pinCode') })}
                            labelName={t('pinCode')}
                            name="pinCode"
                            control={control}
                            errors={errors}
                            type="select"
                            items={pincode}
                            getOptionLabel={(option) => option.pincode}
                            required
                        />
                    </Box>

                    <Box flex={1}>
                        <FormController
                            placeholder={t('select', { 0: t('postOffice') })}
                            labelName={t('postOffice')}
                            name="postOfficeName"
                            control={control}
                            errors={errors}
                            type="select"
                            items={postofficeValue}
                            required
                        />
                    </Box>

                    <Box
                        as="button"
                        height="44px"
                        width="44px"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        mb="2px"
                        onClick={handleSubmit(handleAdd)}
                    > 
                       <BigRoundPluseIcon />
                    </Box>
                </HStack>

                <Table columns={columns} data={serviceAreaList} />

                <Box display={'flex'} justifyContent={'flex-end'} gap={3} mt={7} pb={5}>
                    <Button variant={'outline'} onClick={() => onClose(false)}><Close />{t('cancel')}</Button>
                    <Button variant={'solid'} onClick={onSubmit}><Save />{t('save')}</Button>
                </Box>
            </VStack>

        </Popup>
    );
};

const mapStateToProps = (state) => ({
    pincode: getPincode(state),
    postofficeValue: getPostoffice(state)
});

const mapDispatchToProps = {
    fetchPincode: fetchOnboardingPincode,
    fetchPostoffice: fetchOnboardingPostoffice,
    addServiceArea: addServiceArea
};

export default connect(mapStateToProps, mapDispatchToProps)(AddServiceArea);
