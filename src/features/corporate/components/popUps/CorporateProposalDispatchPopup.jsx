import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, FormController, Icons, Popup, Spinner, useForm, VStack } from '@kfonbss/bss-ui-components';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BsCheckCircle, BsXCircle } from 'react-icons/bs';
import { LuArrowRight } from 'react-icons/lu';
import { useDispatch, useSelector } from 'react-redux';

const { DispatchEmailIcon, DispatchDirectIcon } = Icons;

import { STORAGE_KEYS } from '@/constants';
import { getApiProgress } from '@/features/others/ApiProgress/selectors';
import { getTokenData } from '@/utils/encryptionUtils';

import { ACTION_TYPES, fetchCorporateEnquiryList, fetchProposalDispatch, sendDirectProposalDispatch, sendEmailProposalDispatch } from '../../action';
import { getProposalDispatch } from '../../selector';
import { ProposalDispatchDirectSchema, ProposalDispatchEmailSchema } from '../../validation';

const DISPATCH_MODES = [
    { label: 'byHand', value: 'BY_HAND' },
    { label: 'courier', value: 'COURIER' },
    { label: 'post', value: 'POST' }
];

/* ── Email sub-form ─────────────────────────────────────────── */
const EmailForm = ({ enquiryId, version, prefillEmail, onCancel, onSuccess }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const apiProgress = useSelector(getApiProgress);
    const isSubmitting = apiProgress[ACTION_TYPES.SEND_EMAIL_PROPOSAL_DISPATCH];

    const { control, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(ProposalDispatchEmailSchema(t)),
        defaultValues: { emailId: prefillEmail || '', additionalMailId: '' }
    });

    const onSubmit = (data) => {
        dispatch(sendEmailProposalDispatch({
            enquiryId,
            version,
            ...data,
            onSuccess
        }));
    };

    return (
        <>
            <Box bg="#FFF9ED" py={4} px={6} borderRadius="md" mb={5}>
                <Box fontSize="xl" fontWeight="bold" color="#232F50">{t('sendViaEmail')}</Box>
            </Box>
            <Box px={6} pb={2}>
                <VStack align="stretch" spacing={5}>
                    <FormController
                        name="emailId"
                        labelName={t('emailId')}
                        placeholder={t('enter', { 0: t('emailId') })}
                        control={control}
                        errors={errors}
                        required
                    />
                    <FormController
                        name="additionalMailId"
                        labelName={t('additionalMailId')}
                        placeholder={t('enter', { 0: t('additionalMailId') })}
                        control={control}
                        errors={errors}
                    />
                </VStack>
            </Box>
            <Box px={6} py={5} display="flex" justifyContent="flex-end" gap={4} borderTop="1px solid" borderColor="gray.100" mt={4}>
                <Button
                    variant="outline"
                    h="44px"
                    px={8}
                    borderRadius="full"
                    borderColor="#8D0247"
                    color="#8D0247"
                    _hover={{ bg: '#FFF5F7' }}
                    onClick={onCancel}
                >
                    <BsXCircle style={{ marginRight: '8px', width: '18px', height: '18px' }} />
                    {t('cancel')}
                </Button>
                <Button
                    bg="#8D0247"
                    color="white"
                    h="44px"
                    px={8}
                    borderRadius="full"
                    _hover={{ bg: '#6d0136' }}
                    onClick={handleSubmit(onSubmit)}
                    isLoading={isSubmitting}
                >
                    {t('confirmAndSend')}
                    <BsCheckCircle style={{ marginLeft: '8px', width: '18px', height: '18px' }} />
                </Button>
            </Box>
        </>
    );
};

/* ── Direct sub-form ────────────────────────────────────────── */
const DirectForm = ({ enquiryId, version, onCancel, onSuccess }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const apiProgress = useSelector(getApiProgress);
    const isSubmitting = apiProgress[ACTION_TYPES.SEND_DIRECT_PROPOSAL_DISPATCH];

    const { control, handleSubmit, watch, setValue, formState: { errors } } = useForm({
        resolver: yupResolver(ProposalDispatchDirectSchema(t)),
        defaultValues: { dispatchMode: 'BY_HAND', dispatchDate: '', consigneeName: '' }
    });

    const selectedMode = watch('dispatchMode');

    const onSubmit = (data) => {
        dispatch(sendDirectProposalDispatch({
            enquiryId,
            version,
            ...data,
            onSuccess
        }));
    };

    return (
        <>
            <Box bg="#FFF9ED" py={4} px={6} borderRadius="md" mb={5}>
                <Box fontSize="xl" fontWeight="bold" color="#232F50">{t('sendDirect')}</Box>
            </Box>
            <Box px={6} pb={2}>
                <VStack align="stretch" spacing={5}>
                    {/* Dispatch Mode — radio group */}
                    <Box>
                        <Box fontSize="14px" fontWeight="normal" color="#272727" mb={3}>
                            {t('dispatchMode')} <Box as="span" color="red.500">*</Box>
                        </Box>
                        <Box display="flex" gap={6} alignItems="center">
                            {DISPATCH_MODES.map((mode) => (
                                <Box
                                    key={mode.value}
                                    display="flex"
                                    alignItems="center"
                                    gap={2}
                                    cursor="pointer"
                                    onClick={() => setValue('dispatchMode', mode.value, { shouldValidate: true })}
                                >
                                    <Box
                                        w="18px"
                                        h="18px"
                                        borderRadius="full"
                                        border="2px solid"
                                        borderColor={selectedMode === mode.value ? '#8D0247' : '#A0A0A0'}
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="center"
                                        flexShrink={0}
                                    >
                                        {selectedMode === mode.value && (
                                            <Box w="9px" h="9px" borderRadius="full" bg="#8D0247" />
                                        )}
                                    </Box>
                                    <Box fontSize="14px" color="#272727">{t(mode.label)}</Box>
                                </Box>
                            ))}
                        </Box>
                        {errors.dispatchMode && (
                            <Box fontSize="12px" color="red.500" mt={1}>{errors.dispatchMode.message}</Box>
                        )}
                    </Box>

                    <FormController
                        name="dispatchDate"
                        labelName={t('dispatchDate')}
                        control={control}
                        errors={errors}
                        type="date"
                        required
                        disablePortal={true}
                    />
                    <FormController
                        name="consigneeName"
                        labelName={t('consigneeName')}
                        placeholder={t('enter', { 0: t('consigneeName') })}
                        control={control}
                        errors={errors}
                        required
                    />
                </VStack>
            </Box>
            <Box px={6} py={5} display="flex" justifyContent="flex-end" gap={4} borderTop="1px solid" borderColor="gray.100" mt={4}>
                <Button
                    variant="outline"
                    h="44px"
                    px={8}
                    borderRadius="full"
                    borderColor="#8D0247"
                    color="#8D0247"
                    _hover={{ bg: '#FFF5F7' }}
                    onClick={onCancel}
                >
                    <BsXCircle style={{ marginRight: '8px', width: '18px', height: '18px' }} />
                    {t('cancel')}
                </Button>
                <Button
                    bg="#8D0247"
                    color="white"
                    h="44px"
                    px={8}
                    borderRadius="full"
                    _hover={{ bg: '#6d0136' }}
                    onClick={handleSubmit(onSubmit)}
                    isLoading={isSubmitting}
                >
                    {t('confirmAndSend')}
                    <BsCheckCircle style={{ marginLeft: '8px', width: '18px', height: '18px' }} />
                </Button>
            </Box>
        </>
    );
};

/* ── Main popup ─────────────────────────────────────────────── */
const CorporateProposalDispatchPopup = ({ isOpen, onClose, enquiryId, version }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { data: dispatchData, isLoading } = useSelector(getProposalDispatch);

    // 'selection' | 'email' | 'direct'
    const [view, setView] = useState('selection');

    useEffect(() => {
        if (isOpen && enquiryId) {
            setView('selection');
            dispatch(fetchProposalDispatch({ enquiryId }));
        }
    }, [isOpen, enquiryId, dispatch]);

    const handleClose = () => {
        setView('selection');
        onClose();
    };

    const handleSuccess = () => {
        handleClose();
        const tokenData = getTokenData(STORAGE_KEYS.AUTH_TOKEN);
        const seatId = tokenData?.seatId ?? null;
        dispatch(fetchCorporateEnquiryList({ ...(seatId && { seatId }) }));
    };

    return (
        <Popup
            isOpen={isOpen}
            title={t('sending')}
            titleMain={t('medium')}
            onOpenChange={(open) => { if (!open) handleClose(); }}
            size="md"
            maxW="500px"
            closeButton
            closeOnInteractOutside={false}
        >
            {isLoading && view === 'selection' ? (
                <Box display="flex" justifyContent="center" alignItems="center" h="200px">
                    <Spinner size="lg" color="#8D0247" />
                </Box>
            ) : view === 'selection' ? (
                <Box>
                    <VStack px={6} spacing={4} align="stretch">
                        {/* Send Via Email card */}
                        <Box
                            border="1px solid"
                            borderColor="gray.200"
                            borderRadius="xl"
                            px={5}
                            py={4}
                            display="flex"
                            alignItems="center"
                            gap={4}
                            cursor="pointer"
                            _hover={{ borderColor: '#8D0247', bg: '#FFF5F7' }}
                            onClick={() => setView('email')}
                        >
                            <Box
                                w="56px"
                                h="56px"
                                borderRadius="lg"
                                bg="#F4E6ED"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                flexShrink={0}
                            >
                                <DispatchEmailIcon width="32px" height="32px" style={{ color: '#8D0247' }} />
                            </Box>
                            <Box flex={1} fontSize="15px" fontWeight="500" color="#232F50">
                                {t('sendViaEmail')}
                            </Box>
                            <LuArrowRight size={18} color="#8D0247" />
                        </Box>

                        {/* Send Direct card */}
                        <Box
                            border="1px solid"
                            borderColor="gray.200"
                            borderRadius="xl"
                            px={5}
                            py={4}
                            display="flex"
                            alignItems="center"
                            gap={4}
                            cursor="pointer"
                            _hover={{ borderColor: '#8D0247', bg: '#FFF5F7' }}
                            onClick={() => setView('direct')}
                        >
                            <Box
                                w="56px"
                                h="56px"
                                borderRadius="lg"
                                bg="#F4E6ED"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                flexShrink={0}
                            >
                                <DispatchDirectIcon width="32px" height="32px" style={{ color: '#8D0247' }} />
                            </Box>
                            <Box flex={1} fontSize="15px" fontWeight="500" color="#232F50">
                                {t('sendDirect')}
                            </Box>
                            <LuArrowRight size={18} color="#8D0247" />
                        </Box>
                    </VStack>
                    <Box px={6} pt={3} pb={4} display="flex" justifyContent="flex-end" mt={4}>
                        <Button
                            variant="outline"
                            h="44px"
                            px={8}
                            borderRadius="full"
                            borderColor="#8D0247"
                            color="#8D0247"
                            _hover={{ bg: '#FFF5F7' }}
                            onClick={handleClose}
                        >
                            <BsXCircle style={{ marginRight: '8px', width: '18px', height: '18px' }} />
                            {t('cancel')}
                        </Button>
                    </Box>
                </Box>
            ) : view === 'email' ? (
                <EmailForm
                    enquiryId={enquiryId}
                    version={version}
                    prefillEmail={dispatchData?.emailId || ''}
                    onCancel={() => setView('selection')}
                    onSuccess={handleSuccess}
                />
            ) : (
                <DirectForm
                    enquiryId={enquiryId}
                    version={version}
                    onCancel={() => setView('selection')}
                    onSuccess={handleSuccess}
                />
            )}
        </Popup>
    );
};

export default CorporateProposalDispatchPopup;
