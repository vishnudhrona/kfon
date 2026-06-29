import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, Flex, FormController, HStack, Popup, Text, useForm, VStack } from "@kfonbss/bss-ui-components";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

import { fetchDistrict } from "@/features/common/actions";
import { getDistrict } from "@/features/common/selectors";

import { fetchMappedDist, fetchPincodeByDistrictIds, resetMappedDist, submitPincodeMapping, updatePincodeMapping } from "../action";
import { getMappedDist, getPincodeByDistrict } from "../selector";
import { pincodeMappingValidation } from "../validation";

const PincodeMapping = ({ isOpen, setIsOpen, seatRow, fetchDistrict, district, fetchPincodeByDistrictIds, pincodeByDistrict, submitPincodeMapping, fetchMappedDist, mappedDist, resetMappedDist, updatePincodeMapping }) => {

    const { t } = useTranslation();

    const { control, formState: { errors }, watch, handleSubmit, reset, setValue } = useForm({
        resolver: yupResolver(pincodeMappingValidation(t)),
        mode: 'onTouched'
    });

    const selectedDistricts = watch("district");

    const sortedDistricts = useMemo(() => {
        return [...(district || [])].sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    }, [district]);

    useEffect(() => {
        if (isOpen && seatRow?.id) {
            fetchDistrict();
            fetchMappedDist({ seatId: seatRow?.id });
        }
    }, [isOpen, seatRow?.id, fetchDistrict, fetchMappedDist]);

    useEffect(() => {
        if (isOpen && mappedDist?.length > 0 && district?.length > 0) {
            const uniqueDistricts = Array.from(new Set(mappedDist.map(item => item.districtId)))
                .map(id => {
                    const found = mappedDist.find(m => m.districtId === id);
                    return { id: found.districtId, name: found.districtName };
                });

            setValue('district', uniqueDistricts);

            const districtIds = uniqueDistricts.map(d => d.id);
            fetchPincodeByDistrictIds(districtIds);
        }
    }, [isOpen, mappedDist, district, setValue, fetchPincodeByDistrictIds]);

    useEffect(() => {
        if (isOpen && mappedDist?.length > 0 && pincodeByDistrict?.length > 0) {
            const initialPincodes = mappedDist.map(item => ({
                id: item.pincodeId,
                pincode: item.pincode,
                districtId: item.districtId,
                district: item.districtName
            }));

            setValue('pincode', initialPincodes);
        }
    }, [isOpen, mappedDist, pincodeByDistrict, setValue]);

    useEffect(() => {
        if (isOpen && selectedDistricts?.length > 0) {
            const districtIds = selectedDistricts.map((d) => d.id);
            fetchPincodeByDistrictIds(districtIds);
        }
    }, [isOpen, selectedDistricts, fetchPincodeByDistrictIds]);

    const onSubmit = (data) => {
        const formattedPincodes = data?.pincode?.map((item) => ({
            districtId: item.districtId,
            districtName: item.district,
            pincodeId: item.id,
            pincode: item.pincode
        })) || [];

        const payload = {
            seatId: seatRow?.id,
            pincode: formattedPincodes,
            onSuccess: () => {
                setIsOpen(false);
                reset();
            }
        }

        if (mappedDist?.length > 0) {
            updatePincodeMapping(payload);
        } else {
            submitPincodeMapping(payload);
        }
    };

    return (
        <Popup isOpen={isOpen} onClose={() => { setIsOpen(false); reset(); resetMappedDist(); }} title={t('pincodeMapping')} size={'md'}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <VStack align={'stretch'} px={5}>
                    <Box borderRadius={'xl'} border={'1px solid #E7E7E7'} px={'27px'} py={'17px'}>
                        <HStack gap={5}>
                            <HStack>
                                <Text fontSize={'16px'} fontWeight={'500'} color={'#43647C'}>{t('seatName')}:</Text>
                                <Text fontWeight={'500'} maxWidth={'200px'} fontSize={'16px'} color={'primary.500'}>{t(seatRow?.name)}</Text>
                            </HStack>
                            <HStack>
                                <Text fontSize={'16px'} fontWeight={'500'} color={'#43647C'}>{t('seatCode')}:</Text>
                                <Text fontWeight={'500'} fontSize={'16px'} color={'primary.500'}>{t(seatRow?.code)}</Text>
                            </HStack>
                        </HStack>
                    </Box>

                    <VStack align={'stretch'} mt={4} gap={5}>
                        <FormController
                            placeholder={t('district')}
                            labelName={t('district')}
                            name='district'
                            control={control}
                            errors={errors}
                            type="select"
                            items={sortedDistricts}
                            isMulti
                            required
                        />

                        <FormController
                            placeholder={t('pincode')}
                            labelName={t('pincode')}
                            name='pincode'
                            control={control}
                            errors={errors}
                            type="select"
                            items={pincodeByDistrict}
                            getOptionLabel={(option) => option?.pincode}
                            getOptionValue={(option) => option?.id}
                            isMulti
                            required
                        />
                    </VStack>
                    <Flex gap={2} justifyContent={'flex-end'} mt={5}>
                        <Button variant={'outline'} height={'40px'} onClick={() => { setIsOpen(false); reset(); resetMappedDist(); }}>{t('cancel')}  </Button>
                        <Button type='submit' height={'40px'}>{t('submit')}</Button>
                    </Flex>
                </VStack>
            </form>
        </Popup>
    );
};

const mapStateToProps = (state) => ({
    district: getDistrict(state),
    pincodeByDistrict: getPincodeByDistrict(state),
    mappedDist: getMappedDist(state)
});

const mapDispatchToProps = {
    fetchDistrict: fetchDistrict,
    fetchPincodeByDistrictIds: fetchPincodeByDistrictIds,
    submitPincodeMapping: submitPincodeMapping,
    fetchMappedDist: fetchMappedDist,
    resetMappedDist: resetMappedDist,
    updatePincodeMapping: updatePincodeMapping
};

export default connect(mapStateToProps, mapDispatchToProps)(PincodeMapping);
