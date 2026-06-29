import { Box, Button, HStack, Icons, Popup, Spinner, Text, VStack } from '@kfonbss/bss-ui-components';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import returnToImg from '@/assets/returnTo.png';
import { getApiProgress } from '@/features/others/ApiProgress/selectors';

import { ACTION_TYPES, fetchReturnToInfo, returnToEnquiry } from '../../action';
import { getReturnToInfo } from '../../selector';

const { BsXCircle, BsCheckCircle } = Icons;

const CorporateReturnToPopup = ({ isOpen, setIsOpen, enquiryId, locationId, onSuccess }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { data: returnInfo, isLoading } = useSelector(getReturnToInfo);
    const apiProgress = useSelector(getApiProgress);
    const isSubmitting = !!apiProgress[ACTION_TYPES.RETURN_TO_ENQUIRY];
    const isFetching = isLoading || !!apiProgress[ACTION_TYPES.FETCH_RETURN_TO_INFO];

    useEffect(() => {
        if (isOpen) {
            dispatch(fetchReturnToInfo(locationId ? { locationId } : { enquiryId }));
        }
    }, [isOpen, dispatch, enquiryId, locationId]);

    const handleClose = () => setIsOpen(false);

    const handleYes = () => {
        if (isSubmitting) return;
        const cb = () => { handleClose(); onSuccess?.(); };
        const payload = locationId
            ? { locationId, remarks: 'Returned', onSuccess: cb }
            : { enquiryId, remarks: 'Returned', onSuccess: cb };
        dispatch(returnToEnquiry(payload));
    };

    const userName = returnInfo?.userName ?? '';
    const designation = returnInfo?.designation ?? '';

    return (
        <Popup
            isOpen={isOpen}
            title={t('return')}
            titleMain={t('to')}
            size='sm'
            maxW='500px'
            closeButton
            onOpenChange={setIsOpen}
        >
            <Box px={4} pb={6}>
                {isFetching ? (
                    <HStack justify='center' py={10}>
                        <Spinner size='md' color='#8D0247' />
                    </HStack>
                ) : (
                    <VStack spacing={5} align='center'>
                        <Box>
                            <img src={returnToImg} alt='return' style={{ width: '160px', height: 'auto' }} />
                        </Box>

                        <Text fontSize='xl' fontWeight='bold' color='#0F1121'>
                            {t('information')}
                        </Text>

                        <Text fontSize='md' color='gray.600' textAlign='center' lineHeight='tall'>
                            {t('returnEnquiryConfirm')}{' '}
                            {userName && (
                                <Text as='span' fontWeight='bold' color='#8D0247'>{userName}</Text>
                            )}{' '}
                            {designation && (
                                <Text as='span' fontWeight='bold' color='#8D0247'>{designation}</Text>
                            )}{' '}
                            {t('forFurtherReview')}
                        </Text>

                        <HStack spacing={4} mt={2}>
                            <Button
                                variant='outline'
                                borderColor='#8D0247'
                                color='#8D0247'
                                px={8}
                                h='45px'
                                borderRadius='full'
                                onClick={handleClose}
                            >
                                <BsXCircle style={{ marginRight: '8px', width: '20px', height: '20px' }} />
                                {t('no')}
                            </Button>
                            <Button
                                bg='#8D0247'
                                color='white'
                                px={8}
                                h='45px'
                                borderRadius='full'
                                _hover={{ bg: '#700138' }}
                                onClick={handleYes}
                                disabled={isSubmitting}
                            >
                                {isSubmitting && <Spinner size='xs' style={{ marginRight: '8px' }} />}
                                {t('yes')}
                                <BsCheckCircle style={{ marginLeft: '8px', width: '20px', height: '20px' }} />
                            </Button>
                        </HStack>
                    </VStack>
                )}
            </Box>
        </Popup>
    );
};

export default CorporateReturnToPopup;
