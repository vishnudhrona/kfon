import { yupResolver } from '@hookform/resolvers/yup';
import { AccordionItem, Box, Button, FormController, Input, InputGroup, Spinner, useForm } from '@kfonbss/bss-ui-components';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { NavigationIcon } from '@/components/custom';
import { getApiProgress } from '@/features/others/ApiProgress/selectors';
import { fetchDepartment, fetchSubDepartment } from '@/features/public/pages/enquiryForms/action';
import MapPopup from '@/features/public/pages/enquiryForms/components/MapPopup';
import { CUSTOMER_TYPES } from '@/features/public/pages/enquiryForms/constants';
import { getDepartmentList, getSubDepartmentList } from '@/features/public/pages/enquiryForms/selector';
import usePlacesAutocomplete from '@/utils/usePlacesAutocomplete';

import { ACTION_TYPES, fetchEnquiryDetails, fetchKycDetails, saveCustomerBasicDetails, updateCustomerBasicDetails } from '../action';
import { getEnquiryDetailsData, getKycCustomer, getKycDetails } from '../selector';
import { CorporateCustomerBasicDetailsSchema } from '../validation';

const CorporateCustomerBasicDetails = ({ onSaveSuccess, customerId, enquiryId }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { cusId } = useSelector(getKycCustomer);
    const kycDetails = useSelector(getKycDetails);
    const { data: enquiryDetails } = useSelector(getEnquiryDetailsData);
    const departmentList = useSelector(getDepartmentList);
    const subDepartmentList = useSelector(getSubDepartmentList);

    const apiProgress = useSelector(getApiProgress);
    const isBasicSaving = apiProgress[ACTION_TYPES.SAVE_CUSTOMER_BASIC_DETAILS] || apiProgress[ACTION_TYPES.UPDATE_CUSTOMER_BASIC_DETAILS];

    const [popupOpen, setPopupOpen] = useState(false);
    const { predictions, search, setPredictions } = usePlacesAutocomplete();


    const {
        control,
        handleSubmit,
        setValue,
        watch,
        reset,
        getValues,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(CorporateCustomerBasicDetailsSchema(t)),
        defaultValues: {
            companyType: '',
            department: '',
            subDepartment: '',
            customerName: '',
            contactPerson: '',
            mobile: '',
            email: '',
            pincode: '',
            address: '',
            latitude: '',
            longitude: ''
        }
    });

    const watchedCompanyType = watch('companyType');
    const isGovernment = watchedCompanyType?.code === 'GOVERNMENT' || watchedCompanyType === 'GOVERNMENT';
    const isPrivate = watchedCompanyType?.code === 'PRIVATE' || watchedCompanyType === 'PRIVATE';
    const companyTypeDisabled = !!enquiryId && isPrivate;

    // Always fetch enquiry details when enquiryId is present
    useEffect(() => {
        if (enquiryId) {
            dispatch(fetchEnquiryDetails({ enquiryId }));
        }
    }, [enquiryId, dispatch]);

    // Fetch KYC details when customerId prop is present
    useEffect(() => {
        if (customerId) {
            dispatch(fetchKycDetails({ customerId }));
        }
    }, [customerId, dispatch]);

    // Fetch KYC details when enquiryDetails response provides a customerId
    useEffect(() => {
        const id = enquiryDetails?.customerId;
        if (id && !customerId) {
            dispatch(fetchKycDetails({ customerId: id }));
        }
    }, [enquiryDetails?.customerId, customerId, dispatch]);

    // Prefill from enquiry details (initial fill)
    useEffect(() => {
        if (!enquiryId || !enquiryDetails || Object.keys(enquiryDetails).length === 0) return;

        const companyTypeCode = enquiryDetails.customerType || enquiryDetails.companyType || '';
        const matchedType = CUSTOMER_TYPES.find(
            (ct) => ct.code === companyTypeCode || ct.name === companyTypeCode
        ) || companyTypeCode;
        reset({
            companyType: matchedType,
            department: enquiryDetails.department || '',
            subDepartment: enquiryDetails.subDepartment || '',
            customerName: enquiryDetails.organizationName || enquiryDetails.companyName || '',
            contactPerson: enquiryDetails.contactPerson || enquiryDetails.contactName || '',
            mobile: enquiryDetails.mobileNumber || String(enquiryDetails.contactNumber || '') || '',
            email: enquiryDetails.email || enquiryDetails.emailId || '',
            pincode: enquiryDetails.pinCode || enquiryDetails.pincode || '',
            address: enquiryDetails.location || enquiryDetails.address || enquiryDetails.installationAddress || enquiryDetails.companyLocation || '',
            latitude: enquiryDetails.latitude?.toString() || '',
            longitude: enquiryDetails.longitude?.toString() || ''
        });
    }, [enquiryDetails, enquiryId, reset]);

    useEffect(() => {
        if (!kycDetails?.data || Object.keys(kycDetails.data).length === 0) return;
        if (kycDetails?.isLoading) return;

        const kycData = kycDetails.data;
        const current = getValues();
        reset({
            ...current,
            customerName: kycData.customerName || '',
            contactPerson: kycData.contactPerson || '',
            mobile: kycData.mobile || '',
            email: kycData.email || '',
            pincode: kycData.pincode || '',
            address: kycData.address || ''
        });
    }, [kycDetails?.data, kycDetails?.isLoading, getValues, reset]);

    // Fetch departments when government type selected
    useEffect(() => {
        if (isGovernment) {
            dispatch(fetchDepartment());
        }
    }, [isGovernment, dispatch]);

    const departmentChange = (val) => {
        const departmentId = val?.target?.value || val?.id || val?.value || (typeof val === 'string' ? val : '');
        setValue('subDepartment', '');
        if (departmentId) {
            dispatch(fetchSubDepartment(departmentId));
        }
    };

    const onSubmit = (data) => {
        const companyTypeCode = data.companyType?.code || data.companyType || '';
        const payload = {
            customerName: data.customerName,
            contactPerson: data.contactPerson,
            mobile: data.mobile,
            email: data.email,
            pincode: data.pincode,
            address: data.address,
            companyType: companyTypeCode,
            ...(enquiryId ? { enquiryId } : {}),
            ...(data.latitude ? { latitude: data.latitude } : {}),
            ...(data.longitude ? { longitude: data.longitude } : {}),
            ...(isGovernment && data.department ? { department: data.department?.id || data.department } : {}),
            ...(isGovernment && data.subDepartment ? { subDepartment: data.subDepartment?.id || data.subDepartment } : {}),
            onSuccess: () => onSaveSuccess?.()
        };

        if (cusId) {
            dispatch(updateCustomerBasicDetails({ cusId, ...payload }));
        } else {
            dispatch(saveCustomerBasicDetails(payload));
        }
    };

    const handleSelect = (loc) => {
        setValue('address', loc.fullAddress || '', { shouldValidate: true, shouldDirty: true });
        if (loc.lat && loc.lng) {
            setValue('latitude', loc.lat.toString(), { shouldValidate: true });
            setValue('longitude', loc.lng.toString(), { shouldValidate: true });
        }
    };

    const handlePlaceClick = async (item) => {
        if (!window.google) return;

        const geocoder = new window.google.maps.Geocoder();
        const { results } = await geocoder.geocode({ placeId: item.place_id });

        if (!results?.length) return;

        const result = results[0];
        const loc = result.geometry.location;

        setValue('address', result.formatted_address, { shouldValidate: true, shouldDirty: true });
        setValue('latitude', loc.lat().toString(), { shouldValidate: true });
        setValue('longitude', loc.lng().toString(), { shouldValidate: true });

        setPredictions([]);
    };

    return (
        <Box css={isBasicSaving ? { '& button[type="submit"] svg': { display: 'none' } } : {}}>
        <AccordionItem
            title={t('basicDetails')}
            name="step1"
            value="step1"
            onSubmit={handleSubmit(onSubmit)}
            saveButton={true}
            buttonValue={isBasicSaving ? <><Spinner size="xs" style={{ marginRight: '6px' }} />{t('loading') || 'Loading...'}</> : t('saveAndContinue')}
        >
            <FormController
                name="companyType"
                labelName={t('customerType')}
                type="select"
                options={CUSTOMER_TYPES}
                placeholder={t('choose', { 0: t('customerType') })}
                control={control}
                errors={errors}
                required
                optionKey="code"
                isDisabled={companyTypeDisabled}
            />

            {isGovernment && (
                <>
                    <FormController
                        name="department"
                        labelName={t('department')}
                        type="select"
                        items={departmentList}
                        placeholder={t('choose', { 0: t('department') })}
                        control={control}
                        errors={errors}
                        onOptionSelect={departmentChange}
                        required
                    />
                    <FormController
                        name="subDepartment"
                        labelName={t('subDepartment')}
                        type="select"
                        items={subDepartmentList}
                        placeholder={t('choose', { 0: t('subDepartment') })}
                        control={control}
                        errors={errors}
                        required
                    />
                </>
            )}

            <FormController
                name="customerName"
                labelName={t('nameOfOrgOrCompany')}
                placeholder={t('enterCompanyName')}
                control={control}
                errors={errors}
            />
            <FormController
                name="contactPerson"
                labelName={t('contactPerson')}
                placeholder={t('enterContactPerson')}
                control={control}
                errors={errors}
            />
            <FormController
                name="mobile"
                labelName={t('mobileNumber')}
                placeholder={t('enterMobileNumber')}
                control={control}
                errors={errors}
                maxLength={10}
                inputMode="numeric"
                onInput={(e) => (e.target.value = e.target.value.replace(/\D/g, ''))}
            />
            <FormController
                name="email"
                labelName={t('emailId')}
                placeholder={t('enterEmailId')}
                control={control}
                errors={errors}
            />
            <FormController
                name="pincode"
                labelName={t('pinCode')}
                placeholder={t('enterPinCode')}
                control={control}
                errors={errors}
                maxLength={6}
                inputMode="numeric"
                onInput={(e) => (e.target.value = e.target.value.replace(/\D/g, ''))}
            />

            <Box w='100%' position='relative'>
                <Box mb='8px' fontSize='14px' fontWeight='normal' color='#272727'>
                    {t('locationAddress')} <Box as='span' color='#272727'>*</Box>
                </Box>
                <InputGroup
                    borderRadius='6px'
                    border='1px solid'
                    borderColor={errors.address ? 'red.500' : '#A0A0A0'}
                    _hover={{ borderColor: '#A0A0A0' }}
                    h='48px'
                    endAddon={
                        <Button
                            variant='unstyled'
                            onClick={() => setPopupOpen(true)}
                            display='flex'
                            alignItems='center'
                            color='#8B1538'
                            fontWeight='600'
                            fontSize='14px'
                            px={3}
                            h='100%'
                            whiteSpace="nowrap"
                        >
                            {t('selectOnTheMap')} <NavigationIcon ml={2} />
                        </Button>
                    }
                >
                    <Input
                        placeholder={t('enterLocationAddress')}
                        value={watch('address') || ''}
                        border={0}
                        onChange={(e) => {
                            const value = e.target.value;
                            setValue('address', value);
                            search(value);
                            setValue('latitude', '');
                            setValue('longitude', '');
                        }}
                        _focus={{ boxShadow: 'none', border: 'none' }}
                        focusBorderColor='transparent'
                        _focusVisible={{ outline: 'none' }}
                    />
                </InputGroup>
                {predictions.length > 0 && (
                    <Box
                        position='absolute'
                        top='100%'
                        left='0'
                        right='0'
                        mt='6px'
                        bg='white'
                        boxShadow='0px 4px 12px rgba(0,0,0,0.15)'
                        borderRadius='8px'
                        zIndex='9999'
                        maxH='280px'
                        overflowY='auto'
                    >
                        {predictions.map((item) => (
                            <Box
                                key={item.place_id}
                                p='12px'
                                cursor='pointer'
                                borderBottom='1px solid #EEE'
                                _hover={{ bg: '#f7f7f7' }}
                                onClick={() => handlePlaceClick(item)}
                            >
                                {item.description}
                            </Box>
                        ))}
                    </Box>
                )}
                {errors.address && (
                    <Box position='absolute' right='0' fontSize='12px' color='#D72D2E' mt='4px' textAlign='right'>
                        {errors.address.message}
                    </Box>
                )}
            </Box>

            <MapPopup
                isOpen={popupOpen}
                setIsOpen={setPopupOpen}
                handleSelect={handleSelect}
                initialLat={watch('latitude')}
                initialLng={watch('longitude')}
            />
        </AccordionItem>
        </Box>
    );
};

export default CorporateCustomerBasicDetails;
