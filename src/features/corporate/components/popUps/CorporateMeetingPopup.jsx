import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, FormController, HStack, Icons, Popup, Spinner, Text, useForm, VStack } from '@kfonbss/bss-ui-components';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { STORAGE_KEYS } from '@/constants';
import { getApiProgress } from '@/features/others/ApiProgress/selectors';
import { dayjs } from '@/utils/dateUtils';
import { getTokenData } from '@/utils/encryptionUtils';

import { ACTION_TYPES, fetchCorporateEnquiryList, saveMeeting } from '../../action';
import { CorporateMeetingSchema } from '../../validation';

const { BsXCircle, BsArrowRightCircle } = Icons;

const CorporateMeetingPopup = ({ isOpen, setIsOpen, enquiryId, enquiryDate }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const seatId = getTokenData(STORAGE_KEYS.AUTH_TOKEN)?.seatId ?? null;

    const apiProgress = useSelector(getApiProgress);
    const isSubmitting = !!apiProgress[ACTION_TYPES.SAVE_MEETING];

    const today = dayjs().startOf('day').toDate();
    const minDate = enquiryDate
        ? dayjs(enquiryDate).isValid() ? dayjs(enquiryDate).startOf('day').toDate() : today
        : today;

    const {
        control,
        handleSubmit,
        watch,
        setValue,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(CorporateMeetingSchema(t)),
        defaultValues: {
            meetingConducted: 'yes',
            remarks: '',
            meetingDate: '',
            contactName: '',
            contactNumber: ''
        }
    });

    useEffect(() => {
        if (!isOpen) {
            setValue('remarks', '');
            setValue('meetingDate', '');
            setValue('contactName', '');
            setValue('contactNumber', '');
        }
    }, [isOpen, setValue]);

    const meetingConducted = watch('meetingConducted');

    const handleClose = () => setIsOpen(false);

    const onSubmit = (data) => {
        if (isSubmitting) return;
        dispatch(saveMeeting({
            enquiryId,
            meetingConducted: data.meetingConducted === 'yes',
            remarks: data.remarks,
            meetingDate: data.meetingDate,
            contactPersonName: data.contactName,
            contactNumber: data.contactNumber,
            onSuccess: () => {
                handleClose();
                dispatch(fetchCorporateEnquiryList({ ...(seatId && { seatId }) }));
            }
        }));
    };

    return (
        <Popup
            isOpen={isOpen}
            titleMain={t('meetingDetails')}
            size="md"
            maxW="600px"
            closeButton
            onOpenChange={setIsOpen}
        >
            <Box px={2} pb={6} mt={-2}>
                <Box border="1px solid" borderColor="gray.200" borderRadius="xl" p={5}>
                    <VStack align="stretch" spacing={6}>
                        {/* Radio Section */}
                        <HStack spacing={12} align="center">
                            <Text fontSize="sm" color="gray.700" fontWeight="500">{t('meetingConducted')}*</Text>
                            <HStack spacing={6}>
                                <HStack cursor="pointer" onClick={() => setValue('meetingConducted', 'yes')}>
                                    <input
                                        type="radio"
                                        checked={meetingConducted === 'yes'}
                                        onChange={() => setValue('meetingConducted', 'yes')}
                                        style={{ accentColor: '#8D0247', width: '20px', height: '20px', cursor: 'pointer', border: '2px solid #8D0247' }}
                                    />
                                    <Text fontSize="sm" color="gray.600">{t('yes')}</Text>
                                </HStack>
                                <HStack cursor="pointer" onClick={() => setValue('meetingConducted', 'no')}>
                                    <input
                                        type="radio"
                                        checked={meetingConducted === 'no'}
                                        onChange={() => setValue('meetingConducted', 'no')}
                                        style={{ accentColor: '#8D0247', width: '20px', height: '20px', cursor: 'pointer' }}
                                    />
                                    <Text fontSize="sm" color="gray.600">{t('no')}</Text>
                                </HStack>
                            </HStack>
                        </HStack>

                        <FormController
                            name="remarks"
                            labelName={t('remarks')}
                            placeholder={t('enterRemarks')}
                            control={control}
                            errors={errors}
                            type="textArea"
                            textAreaProps={{
                                resize: 'none',
                                h: '100px',
                                p: 3,
                                _placeholder: { verticalAlign: 'top', color: 'gray.400' },
                                verticalAlign: 'top'
                            }}
                            required
                        />

                        {/* Conditional Fields */}
                        {meetingConducted === 'yes' && (
                            <>
                                <FormController
                                    type="date"
                                    name="meetingDate"
                                    labelName={t('meetingDate')}
                                    control={control}
                                    errors={errors}
                                    required
                                    disablePortal={true}
                                    minDate={minDate}
                                    maxDate={today}
                                />

                                <FormController
                                    name="contactName"
                                    labelName={`${t('contactPersonName')}*`}
                                    placeholder={t('enterName')}
                                    control={control}
                                    errors={errors}
                                />

                                <FormController
                                    name="contactNumber"
                                    labelName={`${t('contactNumber')}*`}
                                    placeholder={t('enterContactNumber')}
                                    control={control}
                                    errors={errors}
                                    maxLength={10}
                                    inputMode="numeric"
                                    onChange={(val) => {
                                        const numeric = (val ?? '').replace(/\D/g, '');
                                        setValue('contactNumber', numeric);
                                    }}
                                />
                            </>
                        )}
                    </VStack>
                </Box>

                <HStack justify="flex-end" spacing={4} mt={6}>
                    <Button variant="outline" borderColor="#8D0247" color="#8D0247" px={8} py={2} h="45px" borderRadius="full" onClick={handleClose}>
                        <BsXCircle style={{ marginRight: '8px', width: '24px', height: '24px' }} /> {t('cancel')}
                    </Button>
                    <Button bg="#8D0247" color="white" px={8} py={2} h="45px" borderRadius="full" _hover={{ bg: '#700138' }} onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>
                        {isSubmitting && <Spinner size='xs' style={{ marginRight: '8px' }} />}
                        {t('done')} <BsArrowRightCircle style={{ marginLeft: '8px', width: '24px', height: '24px' }} />
                    </Button>
                </HStack>
            </Box>
        </Popup>
    );
};

export default CorporateMeetingPopup;
