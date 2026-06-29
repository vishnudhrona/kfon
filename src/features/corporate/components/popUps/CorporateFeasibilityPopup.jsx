import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, FormController, Grid, HStack, Icons, Popup, Spinner, useForm, VStack } from '@kfonbss/bss-ui-components';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { getApiProgress } from '@/features/others/ApiProgress/selectors';

import {
    ACTION_TYPES,
    fetchFeasibilityLnpList,
    fetchNearestLocation,
    fetchNearestPop,
    saveNearestLocation,
    updateNearestLocation
} from '../../action';
import { getFeasibilityLnpList, getNearestLocation, getNearestPopList } from '../../selector';
import { CorporateFeasibilitySchema } from '../../validation';

const { BsArrowRightCircle, BsXCircle } = Icons;

const CONNECTED_BY_LIST = [
    { id: 1, name: 'BELL', code: 'BELL' },
    { id: 2, name: 'RAILTEL', code: 'RAILTEL' }
];


const CorporateFeasibilityPopup = ({ isOpen, onClose, enquiryId, locationId, onSuccess }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const { data: lnpList = [], isLoading: lnpLoading } = useSelector(getFeasibilityLnpList);
    const { data: nearestPopList = [], isLoading: nearestPopLoading } = useSelector(getNearestPopList);
    const { data: existingData } = useSelector(getNearestLocation);

    const apiProgress = useSelector(getApiProgress);
    const isSubmitting = !!(apiProgress[ACTION_TYPES.SAVE_NEAREST_LOCATION] || apiProgress[ACTION_TYPES.UPDATE_NEAREST_LOCATION]);
    const isFetching = !!(apiProgress[ACTION_TYPES.FETCH_FEASIBILITY_LNP_LIST] || apiProgress[ACTION_TYPES.FETCH_NEAREST_POP] || apiProgress[ACTION_TYPES.FETCH_NEAREST_LOCATION]);

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(CorporateFeasibilitySchema(t)),
        defaultValues: {
            nearestLnp: null,
            nearestSubscriberId: '',
            connectedBy: null,
            distance: '',
            nearestClosureId: '',
            nearestPop: null,
            otc: '',
            fiberQuantity: '',
            remarks: ''
        }
    });

    useEffect(() => {
        if (isOpen) {
            dispatch(fetchFeasibilityLnpList());
            dispatch(fetchNearestPop());
            if (enquiryId && locationId) {
                dispatch(fetchNearestLocation({ enquiryId, locationId }));
            }
            reset({
                nearestLnp: null,
                nearestSubscriberId: '',
                connectedBy: null,
                distance: '',
                nearestClosureId: '',
                nearestPop: null,
                otc: '',
                fiberQuantity: '',
                remarks: ''
            });
        }
    }, [isOpen, enquiryId, locationId, dispatch, reset]);

    useEffect(() => {
        if (existingData) {
            const mappedLnpList = lnpList.map((item) => ({ id: item.id, name: item.displayName }));
            const matchedLnp = mappedLnpList.find(
                (item) => item.id === existingData.nearestLnpId
            ) ?? null;
            const matchedConnectedBy = CONNECTED_BY_LIST.find(
                (item) => item.code === existingData.scope
            ) ?? null;
            const matchedNearestPop = nearestPopList.find(
                (item) => item.name === existingData.nearestPop
            ) ?? null;

            reset({
                nearestLnp: matchedLnp,
                nearestSubscriberId: existingData.nearestSubscriberId ?? '',
                connectedBy: matchedConnectedBy,
                distance: existingData.distanceMeters != null ? String(existingData.distanceMeters) : '',
                nearestClosureId: existingData.nearestClosureId ?? '',
                nearestPop: matchedNearestPop,
                otc: existingData.estimatedOtc != null ? String(existingData.estimatedOtc) : '',
                fiberQuantity: existingData.estimatedFiberQuantity != null ? String(existingData.estimatedFiberQuantity) : '',
                remarks: existingData.remarks ?? ''
            });
        }
    }, [existingData, lnpList, nearestPopList, reset]);

    const handleClose = () => {
        reset();
        onClose();
    };

    const onSubmit = (data) => {
        if (isSubmitting) return;
        const action = existingData ? updateNearestLocation : saveNearestLocation;
        dispatch(action({
            enquiryId,
            locationId,
            ...data,
            onSuccess: () => { handleClose(); onSuccess?.(); }
        }));
    };

    const isDropdownsLoading = lnpLoading || nearestPopLoading || isFetching;

    return (
        <Popup
            isOpen={isOpen}
            title={t('nearest')}
            titleMain={t('connection')}
            size="2xl"
            maxW="850px"
            closeButton
            onOpenChange={(e) => !e.open && handleClose()}
        >
            <Box px={6} pb={6} pt={2}>

                {isDropdownsLoading ? (
                    <HStack justify="center" py={10}>
                        <Spinner size="md" color="#8D0247" />
                    </HStack>
                ) : (
                    <Box px={0}>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <VStack spacing={6} align="stretch" px={2} pb={2}>
                                <Grid templateColumns="repeat(2, 1fr)" gap={6}>
                                    <FormController
                                        name="nearestLnp"
                                        control={control}
                                        errors={errors}
                                        type="select"
                                        labelName={t('nearestLnp', 'Nearest LNP')}
                                        placeholder={t('chooseLnp', 'Choose LNP')}
                                        items={lnpList.map((item) => ({ id: item.id, name: item.displayName }))}
                                        required
                                    />
                                    <FormController
                                        name="nearestSubscriberId"
                                        control={control}
                                        errors={errors}
                                        type="text"
                                        labelName={t('nearestSubscriberId', 'Nearest Subscriber ID')}
                                        placeholder={t('enterSubscriberId', 'Enter Subscriber ID')}
                                        required
                                    />
                                    <FormController
                                        name="connectedBy"
                                        control={control}
                                        errors={errors}
                                        type="select"
                                        labelName={t('scope', 'Scope')}
                                        placeholder={t('chooseConnectedBy', 'Choose Connected By')}
                                        items={CONNECTED_BY_LIST}
                                        required
                                    />
                                    <FormController
                                        name="distance"
                                        control={control}
                                        errors={errors}
                                        type="text"
                                        labelName={t('distanceFromNearestLnp', 'Distance from the Nearest LNP')}
                                        placeholder={t('distance', 'Distance')}
                                        required
                                        rightLabel="Meter"
                                    />
                                    <FormController
                                        name="nearestClosureId"
                                        control={control}
                                        errors={errors}
                                        type="text"
                                        labelName={t('nearestClosureId', 'Nearest Closure ID')}
                                        placeholder={t('enterClosureId', 'Enter Closure ID')}
                                        required
                                    />
                                    <FormController
                                        name="nearestPop"
                                        control={control}
                                        errors={errors}
                                        type="select"
                                        labelName={t('nearestPop', 'Nearest POP')}
                                        placeholder={t('chooseStatus', 'Choose Status')}
                                        items={nearestPopList.map((item) => ({ id: item.id, name: item.name }))}
                                        required
                                    />
                                    <FormController
                                        name="otc"
                                        control={control}
                                        errors={errors}
                                        type="text"
                                        labelName={t('estimatedOtc', 'Estimated OTC')}
                                        placeholder={t('enterOtc', 'Enter OTC')}
                                        required
                                    />
                                    <FormController
                                        name="fiberQuantity"
                                        control={control}
                                        errors={errors}
                                        type="text"
                                        labelName={t('estimatedFiberQuantity', 'Estimated Fiber Quantity')}
                                        placeholder={t('enterFiberQuantity', 'Enter Fiber Quantity')}
                                        required
                                    />
                                </Grid>

                                <FormController
                                    name="remarks"
                                    control={control}
                                    errors={errors}
                                    type="textArea"
                                    labelName={t('remarks', 'Remarks')}
                                    placeholder={t('enterRemarks', 'Enter Remarks')}
                                    required
                                    textAreaProps={{
                                        resize: 'none',
                                        h: '100px',
                                        p: 3,
                                        borderRadius: 'md'
                                    }}
                                />

                                <HStack justify="flex-end" spacing={4} pt={4}>
                                    <Button
                                        variant="outline"
                                        onClick={handleClose}
                                        borderColor="#8D0247"
                                        color="#8D0247"
                                        borderRadius="full"
                                        px={8}
                                        py={2}
                                        h="45px"
                                        _hover={{ bg: 'pink.50' }}
                                    >
                                        <BsXCircle style={{ marginRight: '8px', width: '24px', height: '24px' }} />
                                        {t('cancel')}
                                    </Button>
                                    <Button
                                        type="submit"
                                        variant="solid"
                                        bg="#8D0247"
                                        color="white"
                                        borderRadius="full"
                                        px={8}
                                        py={2}
                                        h="45px"
                                        _hover={{ bg: '#700138' }}
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting && <Spinner size='xs' style={{ marginRight: '8px' }} />}
                                        {t('submit')}
                                        <BsArrowRightCircle style={{ marginLeft: '8px', width: '24px', height: '24px' }} />
                                    </Button>
                                </HStack>
                            </VStack>
                        </form>
                    </Box>
                )}
            </Box>
        </Popup>
    );
};

export default CorporateFeasibilityPopup;
