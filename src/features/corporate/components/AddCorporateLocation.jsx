import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, FormController, HStack, Icons, Input, InputGroup, Popup, SimpleGrid, Spinner, useForm } from '@kfonbss/bss-ui-components';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { getRequest } from '@/app/axios';
import { NavigationIcon } from '@/components/custom';
import CustomLoaderProvider from '@/components/custom/CustomLoaderProvider';
import { getApiProgress } from '@/features/others/ApiProgress/selectors';
import MapPopup from '@/features/public/pages/enquiryForms/components/MapPopup';
import usePlacesAutocomplete from '@/utils/usePlacesAutocomplete';

import { ACTION_TYPES, fetchAdditionalServicesList, fetchEnquiryLocationDetails, fetchPackagesList, fetchPackageTypesList, fetchServicesList, submitEnquiryLocation, updateEnquiryLocation } from '../action';
import { CORPORATE_KEYS } from '../constants.jsx';
import { formatSubmitEnquiryLocationRequest } from '../helper';
import { getAdditionalServicesList, getDropdownData, getEnquiryLocationDetails, getPackagesList, getPackageTypesList } from '../selector';
import { AddCorporateLocationSchema } from '../validation';
import GroupedPackageSelect from './GroupedPackageSelect';

const { BsXCircle, BsCheckCircle } = Icons;

const AddCorporateLocation = ({ isOpen, onClose, enquiryId, locationId, customerId, onSuccess }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const servicesList = useSelector(getDropdownData(CORPORATE_KEYS.SERVICES_LIST));
    const { data: packageTypesList } = useSelector(getPackageTypesList);
    const { data: packagesList } = useSelector(getPackagesList);
    const { data: additionalServicesList } = useSelector(getAdditionalServicesList);
    const { data: locationDetails, isLoading: locationDetailsLoading } = useSelector(getEnquiryLocationDetails);
    const locationDetailsServiceId = locationDetails?.serviceId;
    const locationDetailsPackageType = locationDetails?.packageType;

    const apiProgress = useSelector(getApiProgress);
    const isFetching = !!apiProgress[ACTION_TYPES.FETCH_ENQUIRY_LOCATION_DETAILS];
    const isSaving = !!apiProgress[ACTION_TYPES.SUBMIT_ENQUIRY_LOCATION] || !!apiProgress[ACTION_TYPES.UPDATE_ENQUIRY_LOCATION];

    const {
        control,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(AddCorporateLocationSchema(t)),
        defaultValues: {
            locName: '',
            contactPerson: '',
            mobile: '',
            email: '',
            pincode: '',
            address: '',
            latitude: '',
            longitude: '',
            serviceId: '',
            packageType: '',
            packageId: '',
            additionalServices: [],
            remarks: ''
        }
    });

    const mappedPackagesList = useMemo(
        () => packagesList.map(pkg => ({ ...pkg, id: pkg.id ?? pkg.packageId, name: pkg.name ?? pkg.packageName })),
        [packagesList]
    );

    const hasPopulatedRef = useRef(false);
    const { predictions, search, setPredictions } = usePlacesAutocomplete();
    const [mapOpen, setMapOpen] = useState(false);
    const [districtId, setDistrictId] = useState(null);

    useEffect(() => {
        if (isOpen) {
            hasPopulatedRef.current = false;
            dispatch(fetchServicesList());
            if (locationId) {
                dispatch(fetchEnquiryLocationDetails({ enquiryId, locationId }));
            } else {
                reset({
                    locName: '', contactPerson: '', mobile: '', email: '',
                    pincode: '', address: '', latitude: '', longitude: '',
                    serviceId: '', packageType: '', packageId: '', additionalServices: [], remarks: ''
                });
            }
        }
    }, [isOpen, enquiryId, locationId, dispatch, reset]);

    useEffect(() => {
        if (!locationId || !locationDetailsServiceId) return;
        dispatch(fetchAdditionalServicesList({ serviceId: locationDetailsServiceId }));
        dispatch(fetchPackageTypesList({ serviceCategoryId: locationDetailsServiceId }));
    }, [locationId, locationDetailsServiceId, dispatch]);

    useEffect(() => {
        if (!locationId || !locationDetailsPackageType) return;
        const srvId = locationDetailsServiceId || '';
        if (srvId) {
            dispatch(fetchPackagesList({ serviceCategoryId: srvId, packageTypeId: locationDetailsPackageType }));
        }
    }, [locationId, locationDetailsPackageType, locationDetailsServiceId, dispatch]);

    useEffect(() => {
        if (!locationId || !locationDetails || hasPopulatedRef.current) return;
        if (locationDetails.serviceId && !servicesList.length) return;
        if (locationDetails.packageType && !packageTypesList.length) return;
        if (locationDetails.packageId && !mappedPackagesList.length) return;

        hasPopulatedRef.current = true;
        const matchedService = servicesList.find(s => String(s.id) === String(locationDetails.serviceId)) || '';
        const matchedPackageType = packageTypesList.find(p => String(p.id) === String(locationDetails.packageType)) || '';
        const matchedPackage = mappedPackagesList.find(p => String(p.id) === String(locationDetails.packageId)) || '';
        const existingAdditional = locationDetails.additionalServices;
        const additionalArray = Array.isArray(existingAdditional)
            ? existingAdditional
            : (existingAdditional ? [existingAdditional] : []);

        reset({
            locName: locationDetails.locName || '',
            contactPerson: locationDetails.contactPerson || '',
            mobile: locationDetails.mobile || '',
            email: locationDetails.email || '',
            pincode: locationDetails.pincode || '',
            address: locationDetails.address || '',
            latitude: locationDetails.latitude?.toString() || '',
            longitude: locationDetails.longitude?.toString() || '',
            serviceId: matchedService,
            packageType: matchedPackageType,
            packageId: matchedPackage,
            additionalServices: additionalArray,
            remarks: locationDetails.remarks || ''
        });
    }, [locationDetails, locationId, servicesList, packageTypesList, mappedPackagesList, reset]);

    const watchedPincode = watch('pincode');
    useEffect(() => {
        if (watchedPincode?.length === 6) {
            const baseURL = import.meta.env.VITE_API_BASE_URL;
            getRequest(`bss-core-dmdm-service/api/pincode/${watchedPincode}/district`, { baseURL })
                .then((res) => {
                    const data = res?.data?.data ?? res?.data;
                    const id = Array.isArray(data) ? data[0]?.districtId : data?.districtId;
                    setDistrictId(id ?? null);
                })
                .catch(() => setDistrictId(null));
        } else {
            setDistrictId(null);
        }
    }, [watchedPincode]);

    const handlePackageTypeChange = (val) => {
        setValue('packageId', '');
        const typeId = val?.id || val?.value || (typeof val === 'string' ? val : '');
        const currentService = watch('serviceId');
        const srvId = currentService?.id || (typeof currentService === 'string' ? currentService : '');
        if (typeId && srvId) {
            dispatch(fetchPackagesList({ serviceCategoryId: srvId, packageTypeId: typeId }));
        }
    };

    const handleMapSelect = (loc) => {
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

    const handleFormSubmit = (data) => {
        const formatted = formatSubmitEnquiryLocationRequest(data, customerId);
        const payload = { ...formatted, ...(districtId && { districtId }) };
        const cb = () => { onClose(); onSuccess?.(); };
        if (locationId) {
            dispatch(updateEnquiryLocation({ enquiryId, locationId, ...payload, onSuccess: cb }));
        } else {
            dispatch(submitEnquiryLocation({ enquiryId, ...payload, onSuccess: cb }));
        }
    };

    return (
        <Popup
            title={locationId ? t('edit', 'Edit') : t('add', 'Add')}
            titleMain={t('location', 'Location')}
            size="2xl"
            maxW="900px"
            isOpen={isOpen}
            onOpenChange={onClose}
            closeOnInteractOutside={false}
        >
            {locationDetailsLoading ? (
                <Box display="flex" justifyContent="center" alignItems="center" h="300px">
                    <Spinner size="lg" color="#8D0247" />
                </Box>
            ) : (
                <CustomLoaderProvider isLoading={isFetching} flex='1' minH='0' display='flex' flexDirection='column' w='full'>
                    <form onSubmit={handleSubmit(handleFormSubmit)}>
                        <Box p={6} mt={-2}>
                            <SimpleGrid columns={2} columnGap={8} rowGap={6}>
                                <FormController
                                    control={control}
                                    name="locName"
                                    labelName={`${t('nameOfTheLocation')}`}
                                    placeholder={t('enter', { 0: t('nameOfTheLocation') })}
                                    errors={errors}
                                    required
                                />
                                <FormController
                                    control={control}
                                    name="contactPerson"
                                    labelName={`${t('contactPerson')}`}
                                    placeholder={t('enter', { 0: t('contactPerson') })}
                                    errors={errors}
                                    required
                                />
                                <FormController
                                    control={control}
                                    name="mobile"
                                    labelName={`${t('mobileNumber')}`}
                                    placeholder={t('enter', { 0: t('mobileNumber') })}
                                    errors={errors}
                                    maxLength={10}
                                    inputMode="numeric"
                                    onInput={(e) => (e.target.value = e.target.value.replace(/\D/g, ''))}
                                    required
                                />
                                <FormController
                                    control={control}
                                    name="email"
                                    labelName={`${t('emailId')}`}
                                    placeholder={t('enter', { 0: t('emailId') })}
                                    errors={errors}
                                    required
                                />
                                <FormController
                                    control={control}
                                    name="pincode"
                                    labelName={`${t('pinCode')}`}
                                    placeholder={t('enter', { 0: t('pinCode') })}
                                    errors={errors}
                                    maxLength={6}
                                    inputMode="numeric"
                                    onInput={(e) => (e.target.value = e.target.value.replace(/\D/g, ''))}
                                    required
                                />

                                {/* Address with map */}
                                <Box position="relative">
                                    <Box mb="8px" fontSize="14px" fontWeight="normal" color={errors.address ? '#D72D2E' : '#272727'}>
                                        {t('installationAddress')} <Box as="span">*</Box>
                                    </Box>
                                    <InputGroup
                                        borderRadius="6px"
                                        border="1px solid"
                                        borderColor={errors.address ? 'red.500' : '#A0A0A0'}
                                        _hover={{ borderColor: '#A0A0A0' }}
                                        h="48px"
                                        endAddon={
                                            <Button
                                                variant="unstyled"
                                                onClick={() => setMapOpen(true)}
                                                display="flex"
                                                alignItems="center"
                                                color="#8B1538"
                                                fontWeight="600"
                                                fontSize="14px"
                                                px={3}
                                                h="100%"
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
                                            focusBorderColor="transparent"
                                            _focusVisible={{ outline: 'none' }}
                                        />
                                    </InputGroup>
                                    {predictions.length > 0 && (
                                        <Box
                                            position="absolute"
                                            top="100%"
                                            left="0"
                                            right="0"
                                            mt="6px"
                                            bg="white"
                                            boxShadow="0px 4px 12px rgba(0,0,0,0.15)"
                                            borderRadius="8px"
                                            zIndex="9999"
                                            maxH="280px"
                                            overflowY="auto"
                                        >
                                            {predictions.map((item) => (
                                                <Box
                                                    key={item.place_id}
                                                    p="12px"
                                                    cursor="pointer"
                                                    borderBottom="1px solid #EEE"
                                                    _hover={{ bg: '#f7f7f7' }}
                                                    onClick={() => handlePlaceClick(item)}
                                                >
                                                    {item.description}
                                                </Box>
                                            ))}
                                        </Box>
                                    )}
                                    {errors.address && (
                                        <Box position="absolute" right="0" fontSize="12px" color="#D72D2E" mt="4px" textAlign="right">
                                            {errors.address.message}
                                        </Box>
                                    )}
                                </Box>

                                <FormController
                                    control={control}
                                    name="serviceId"
                                    labelName={t('serviceType')}
                                    placeholder={t('choose', { 0: t('serviceType') })}
                                    type="select"
                                    items={servicesList}
                                    errors={errors}
                                    onOptionSelect={(selected) => {
                                        const srvId = selected?.id;
                                        if (srvId) {
                                            dispatch(fetchAdditionalServicesList({ serviceId: srvId }));
                                            dispatch(fetchPackageTypesList({ serviceCategoryId: srvId }));
                                            setValue('packageType', '');
                                            setValue('packageId', '');
                                        }
                                    }}
                                    required
                                />
                                <FormController
                                    control={control}
                                    name="packageType"
                                    labelName={t('packageType')}
                                    placeholder={t('choose', { 0: t('packageType') })}
                                    type="select"
                                    items={packageTypesList}
                                    errors={errors}
                                    onOptionSelect={handlePackageTypeChange}
                                    required
                                />
                                <FormController
                                    control={control}
                                    name="packageId"
                                    labelName={t('package')}
                                    placeholder={t('choose', { 0: t('package') })}
                                    type="select"
                                    items={mappedPackagesList}
                                    errors={errors}
                                    required
                                />
                                <Box>
                                    <Box mb="8px" fontSize="14px" fontWeight="normal" color="#272727">
                                        {t('additionalServices')}
                                    </Box>
                                    <GroupedPackageSelect
                                        value={watch('additionalServices') || []}
                                        onChange={(val) => setValue('additionalServices', val)}
                                        groups={additionalServicesList}
                                        placeholder={t('choose', { 0: t('additionalServices') })}
                                    />
                                </Box>
                            </SimpleGrid>

                            <Box mt={6}>
                                <FormController
                                    control={control}
                                    name="remarks"
                                    labelName={t('remarks')}
                                    placeholder={t('enter', { 0: t('remarks') })}
                                    type="textArea"
                                    errors={errors}
                                />
                            </Box>
                        </Box>

                        <HStack justify="flex-end" spacing={4} mt={4} mb={6} mr={6}>
                            <Button variant="outline" borderColor="#8D0247" color="#8D0247" px={8} py={2} h="45px" borderRadius="full" onClick={onClose}>
                                <BsXCircle style={{ marginRight: '8px', width: '24px', height: '24px' }} /> {t('cancel')}
                            </Button>
                            <Button type="submit" bg="#8D0247" color="white" px={8} py={2} h="45px" borderRadius="full" _hover={{ bg: '#700138' }} disabled={isSaving}>
                                {isSaving && <Spinner size='xs' style={{ marginRight: '8px' }} />}
                                {t('submit')} <BsCheckCircle style={{ marginLeft: '8px', width: '24px', height: '24px' }} />
                            </Button>
                        </HStack>
                    </form>
                </CustomLoaderProvider>
            )}

            <MapPopup
                isOpen={mapOpen}
                setIsOpen={setMapOpen}
                handleSelect={handleMapSelect}
                initialLat={watch('latitude')}
                initialLng={watch('longitude')}
            />
        </Popup>
    );
};

export default AddCorporateLocation;
