import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, FormController, HStack, Icons, Popup, useForm, VStack } from '@kfonbss/bss-ui-components';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { dayjs } from '@/utils/dateUtils';

import { fetchDispositionList, fetchReasonList, saveDisposition } from '../../action';
import { getDispositionList, getReasonList } from '../../selector';
import { DispositionSchema } from '../../validation';

const { BsXCircle, BsArrowRightCircle } = Icons;

const followUpOptions = [
    { code: 'DAY', name: 'Day' },
    { code: 'DATE', name: 'Date' }
];

const DispositionPopup = ({ isOpen, setIsOpen, enquiryId, locationId, onSuccess }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const { data: dispositions = [], isLoading: dispositionsLoading } = useSelector(getDispositionList);
    const { data: reasons = [], isLoading: reasonsLoading } = useSelector(getReasonList);

    const {
        control,
        handleSubmit,
        watch,
        setValue,
        reset,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(DispositionSchema(t)),
        defaultValues: {
            disposition: null,
            reason: null,
            followUpUnit: null,
            followUpValue: '',
            remarks: ''
        }
    });

    const selectedDisposition = watch('disposition');
    const selectedFollowUpUnit = watch('followUpUnit');
    const followUpUnitCode = selectedFollowUpUnit?.id ?? selectedFollowUpUnit;

    useEffect(() => {
        if (isOpen) {
            reset();
            dispatch(fetchDispositionList());
        }
    }, [isOpen, dispatch, reset]);

    useEffect(() => {
        const dispositionCode = selectedDisposition?.id ?? selectedDisposition;
        if (dispositionCode) {
            setValue('reason', null);
            dispatch(fetchReasonList({ disposition: dispositionCode }));
        }
    }, [selectedDisposition, dispatch, setValue]);

    const handleClose = () => {
        reset();
        setIsOpen(false);
    };

    const onSubmit = (data) => {
        const followUpUnitCode = data.followUpUnit?.id ?? data.followUpUnit;
        const followUpValue =
            followUpUnitCode === 'DATE' && data.followUpValue
                ? dayjs(data.followUpValue).format('DD-MM-YYYY')
                : data.followUpValue;
        dispatch(saveDisposition({ enquiryId, locationId, ...data, followUpValue, onSuccess: () => { reset(); handleClose(); onSuccess?.(); } }));
    };

    return (
        <Popup
            isOpen={isOpen}
            title={t('add')}
            titleMain={t('disposition')}
            size="md"
            maxW="500px"
            closeButton
            onOpenChange={setIsOpen}
            closeOnInteractOutside={false}
        >
            <Box px={2} pb={6} mt={-2}>
                <Box border="1px solid" borderColor="gray.200" borderRadius="xl" p={5}>
                    <VStack align="stretch" spacing={5}>

                        <FormController
                            name="disposition"
                            labelName={t('disposition')}
                            placeholder={t('choose', { 0: t('disposition') })}
                            control={control}
                            errors={errors}
                            type="select"
                            items={dispositions.map((item) => ({ id: item.code ?? item.name, name: item.name }))}
                            isLoading={dispositionsLoading}
                            required
                        />

                        <FormController
                            name="reason"
                            labelName={t('reason')}
                            placeholder={t('choose', { 0: t('reason') })}
                            control={control}
                            errors={errors}
                            type="select"
                            items={reasons.map((item) => ({ id: item.code ?? item.name, name: item.name }))}
                            isLoading={reasonsLoading}
                            isDisabled={!selectedDisposition}
                            required
                        />

                        <Box>
                            <Box fontSize="sm" fontWeight="medium" color="gray.700" mb={1}>
                                {t('followUp', 'Follow Up')}
                            </Box>
                            <HStack spacing={4}>
                                <Box flex={1}>
                                    <FormController
                                        name="followUpUnit"
                                        placeholder={t('choose', { 0: t('day') })}
                                        control={control}
                                        errors={errors}
                                        type="select"
                                        items={followUpOptions.map((item) => ({ id: item.code, name: item.name }))}
                                        required
                                    />
                                </Box>
                                <Box flex={1}>
                                    {followUpUnitCode === 'DATE' ? (
                                        <FormController
                                            name="followUpValue"
                                            control={control}
                                            errors={errors}
                                            type="date"
                                            required
                                            disablePortal={true}
                                        />
                                    ) : (
                                        <FormController
                                            name="followUpValue"
                                            placeholder={t('enter', { 0: t('value') })}
                                            control={control}
                                            errors={errors}
                                            type="number"
                                            required
                                        />
                                    )}
                                </Box>
                            </HStack>
                        </Box>

                        <FormController
                            name="remarks"
                            labelName={t('remarks')}
                            placeholder={t('enterRemarks', 'Enter Remarks')}
                            control={control}
                            errors={errors}
                            type="textArea"
                            textAreaProps={{
                                resize: 'none',
                                h: '100px',
                                p: 3,
                                borderRadius: 'md'
                            }}
                            required
                        />

                    </VStack>
                </Box>

                <HStack justify="flex-end" mt={6} spacing={4}>
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
                        variant="solid"
                        onClick={handleSubmit(onSubmit)}
                        bg="#8D0247"
                        color="white"
                        borderRadius="full"
                        px={8}
                        py={2}
                        h="45px"
                        _hover={{ bg: '#700138' }}
                    >
                        {t('submit')}
                        <BsArrowRightCircle style={{ marginLeft: '8px', width: '24px', height: '24px' }} />
                    </Button>
                </HStack>
            </Box>
        </Popup>
    );
};

export default DispositionPopup;
