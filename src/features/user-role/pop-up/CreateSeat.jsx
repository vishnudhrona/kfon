import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, Flex, FormController, Popup, SimpleGrid, useForm } from "@kfonbss/bss-ui-components";
import { useEffect, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

import { Close, Save } from "@/components/custom";
import { handleKeyDown } from "@/utils/validationUtils";

import { createSeatSubmit, fetchBusinessUnit, fetchDivisionByOrganization, fetchOrganization, fetchZone, updateSeatSubmit } from "../action";
import { getBusinessUnit, getDivisionByOrganization, getOrganization, getZone } from '../selector';
import { createSeatValidation } from "../validation";

const CreateSeat = ({ open, setOpen, createSeatSubmit, updateSeatSubmit, seatRow, isEditMode, fetchOrganization, getOrganizationData, getZoneData, fetchZone, getBusinessUnitDist, getBusinessUnitData, fetchDivisionByOrganization, getDivisionByOrganizationData }) => {
    const { t } = useTranslation();

    const {
        control,
        formState: { errors },
        handleSubmit,
        reset,
        watch,
        setValue
    } = useForm({
        resolver: yupResolver(createSeatValidation(t)),
        mode: 'onTouched'
    });

    const watchedZone = watch('zone');
    const watchedOrganization = watch('organization');
    const prevZoneIdRef = useRef(watchedZone?.id);
    const prevOrgIdRef = useRef(watchedOrganization?.id);

    useEffect(() => {
        if (watchedOrganization?.id) {
            fetchDivisionByOrganization({ id: watchedOrganization?.id });
        }

        if (watchedZone?.id) {
            getBusinessUnitDist({ id: watchedZone?.id });
        }

        if (prevZoneIdRef.current !== undefined && prevZoneIdRef.current !== watchedZone?.id) {
            const znId = seatRow?.zoneId || seatRow?.zone?.id;
            const znName = seatRow?.zoneName || seatRow?.zone?.name || seatRow?.zone;
            if (!(isEditMode && (znId === watchedZone?.id || znName === watchedZone?.name))) {
                setValue('district', []);
            }
        }
        prevZoneIdRef.current = watchedZone?.id;

        if (prevOrgIdRef.current !== undefined && prevOrgIdRef.current !== watchedOrganization?.id) {
            const orgId = seatRow?.organizationId || seatRow?.organization?.id;
            const orgName = seatRow?.organizationName || seatRow?.organization?.name || seatRow?.organization;
            if (!(isEditMode && (orgId === watchedOrganization?.id || orgName === watchedOrganization?.name))) {
                setValue('division', null);
            }
        }
        prevOrgIdRef.current = watchedOrganization?.id;
    }, [watchedZone, watchedOrganization, getBusinessUnitDist, setValue, isEditMode, seatRow, fetchDivisionByOrganization]);

    useEffect(() => {
        fetchOrganization()
        fetchZone()

    }, [fetchOrganization, fetchZone]);

    useEffect(() => {
        if (open && isEditMode && seatRow) {
            const orgId = seatRow.organizationId || seatRow.organization?.id;
            const orgName = seatRow.organizationName || seatRow.organization?.name || seatRow.organization;
            const divId = seatRow.divisionId || seatRow.division?.id;
            const divName = seatRow.divisionName || seatRow.division?.name || seatRow.division;
            const znId = seatRow.zoneId || seatRow.zone?.id;
            const znName = seatRow.zoneName || seatRow.zone?.name || seatRow.zone;

            reset({
                name: seatRow.name || '',
                active: seatRow.active === true ? 'active' : 'inactive',
                remarks: seatRow.remarks || '',
                organization: getOrganizationData?.find((item) => item.id === orgId || item.name === orgName) || (orgId || orgName ? { id: orgId, name: orgName } : null),
                division: getDivisionByOrganizationData?.find((item) => item.id === divId || item.name === divName) || (divId || divName ? { id: divId, name: divName } : null),
                zone: getZoneData?.data?.find((item) => item.id === znId || item.name === znName) || (znId || znName ? { id: znId, name: znName } : null),
                district: (seatRow?.districtMaps || seatRow?.seatDistrictMaps)?.map((item) => ({
                    id: item.districtId,
                    name: item.districtName,
                    sdmId: item.sdmId
                })) || []
            });
        } else if (open && !isEditMode) {
            reset({
                name: '',
                active: 'active',
                remarks: '',
                organization: null,
                division: null,
                zone: null,
                district: []
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, isEditMode, seatRow, reset, getOrganizationData, getZoneData]);

    const sortedOrganizations = useMemo(() => {
        return getOrganizationData ? [...getOrganizationData].sort((a, b) => (a.name || '').localeCompare(b.name || '')) : [];
    }, [getOrganizationData]);

    const sortedDivisions = useMemo(() => {
        return getDivisionByOrganizationData ? [...getDivisionByOrganizationData].sort((a, b) => (a.name || '').localeCompare(b.name || '')) : [];
    }, [getDivisionByOrganizationData]);

    const sortedDistricts = useMemo(() => {
        return getBusinessUnitData ? [...getBusinessUnitData].sort((a, b) => (a.name || '').localeCompare(b.name || '')) : [];
    }, [getBusinessUnitData]);

    const onSubmit = (data) => {
        const payload = {
            name: data.name,
            active: data.active === 'active',
            remarks: data.remarks,
            organizationId: data.organization?.id,
            divisionId: data.division?.id,
            zoneId: data.zone?.id,
            districtMaps: data.district?.map((item) => ({
                sdmId: item.sdmId || '',
                districtId: item.id,
                districtName: item.name,
                active: item.isActive || true
            })) || []
        };

        if (isEditMode && seatRow?.id) {
            updateSeatSubmit({
                id: seatRow.id,
                ...payload,
                onSuccess: () => setOpen(false)
            });
        } else {
            createSeatSubmit({
                ...payload,
                onSuccess: () => setOpen(false)
            });
        }
    };

    return (
        <Popup title={isEditMode ? t('editSeat') : t('createSeat')} size='xl' isOpen={open} onOpenChange={setOpen} placement='center'>
            <form onSubmit={handleSubmit(onSubmit)}>
                <SimpleGrid columns={2} rowGap={5} columnGap={14} mb={5} px={5}>
                    <FormController
                        placeholder={t('select', { 0: t('organization') })}
                        labelName={t('organization')}
                        name='organization'
                        control={control}
                        errors={errors}
                        items={sortedOrganizations}
                        type='select'
                        required
                    />

                    <FormController
                        placeholder={t('select', { 0: t('division') })}
                        labelName={t('division')}
                        name='division'
                        control={control}
                        errors={errors}
                        items={sortedDivisions}
                        type='select'
                        required
                    />

                    <FormController
                        placeholder={t('select', { 0: t('zone') })}
                        labelName={t('zone')}
                        name='zone'
                        control={control}
                        errors={errors}
                        type='select'
                        isClearable={true}
                        items={getZoneData?.data}
                    />

                    {watchedZone && (
                        <FormController
                            placeholder={t('select', { 0: t('district') })}
                            labelName={t('district')}
                            name='district'
                            control={control}
                            errors={errors}
                            items={sortedDistricts}
                            type='select'
                            isMulti={true}
                        />
                    )}

                    <FormController
                        placeholder={t('enter', { 0: t('seatName') })}
                        labelName={t('seatName')}
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
                <Box px={5} mb={8}>
                    <FormController
                        placeholder={t('remarks')}
                        labelName={t('remarks')}
                        name='remarks'
                        control={control}
                        errors={errors}
                        type='textArea'
                        size="lg"
                        minLength={5}
                        maxLength={500}
                        required
                    />
                </Box>
                <Flex gap={2} px={5} justifyContent={'flex-end'}>
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
    getOrganizationData: getOrganization(state),
    getZoneData: getZone(state),
    getBusinessUnitData: getBusinessUnit(state),
    getDivisionByOrganizationData: getDivisionByOrganization(state)
});

const mapDispatchToProps = {
    createSeatSubmit,
    updateSeatSubmit,
    fetchOrganization,
    fetchZone,
    getBusinessUnitDist: fetchBusinessUnit,
    fetchDivisionByOrganization
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateSeat);