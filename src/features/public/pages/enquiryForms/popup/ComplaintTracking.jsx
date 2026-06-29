import { Box, Button, Flex, Image, Popup, Spinner, Text, VStack } from "@kfonbss/bss-ui-components";
import { debounce } from "lodash-es";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import noAttachment from '@/assets/landingPage/NoAttachment.png';
import { Close } from "@/components/custom";
import SearchInput from "@/components/custom/SearchInput";
import { getAttachment } from "@/features/crm/selector";
import { actions as crmActions } from "@/features/crm/slice";
import { allowOnlyDigits } from "@/utils/validationUtils";

import { trackComplaint } from "../action";
import TrackingCard from "../components/TrackingCard";
import TrackingNotes from "../components/TrackingNotes";
import { getTrackComplaintData, getTrackComplaintLoading } from "../selector";
import { actions as enquiryActions } from "../slice";

const ComplaintTracking = ({ open, setOpen, ticketId }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const [trackId, setTrackId] = useState('');
    const trackComplaintData = useSelector(getTrackComplaintData);
    const isLoading = useSelector(getTrackComplaintLoading);
    const attachmentData = useSelector(getAttachment);

    const debouncedSearch = useMemo(
        () => debounce((value) => {
            if (value.trim().length >= 3) {
                dispatch(trackComplaint({ ticketId: value.trim() }));
            }
        }, 500),
        [dispatch]
    );

    useEffect(() => {
        return () => {
            debouncedSearch.cancel();
        };
    }, [debouncedSearch]);

    const handleSearch = (e) => {
        const value = e.target.value;
        setTrackId(value);
        debouncedSearch(value);
    };

    useEffect(() => {
        if (open) {
            if (ticketId) {
                setTrackId(ticketId);
                dispatch(trackComplaint({ ticketId: String(ticketId).trim() }));
            }
        } else {
            setTrackId('');
            dispatch(enquiryActions.clearTrackComplaint());
            dispatch(crmActions.clearAttachment());
        }
    }, [open, ticketId, dispatch]);

    const renderResult = () => {
        if (isLoading) {
            return (
                <VStack spacing={4} py={10}>
                    <Spinner size="xl" color="primary.500" thickness="4px" />
                    <Text fontSize="16px" color="gray.500">{t('searching', { defaultValue: 'Searching...' })}</Text>
                </VStack>
            );
        }

        if (trackComplaintData && trackComplaintData.length > 0) {
            return (
                <VStack align="stretch" spacing={0} w="100%">
                    <TrackingCard attachmentData={attachmentData} />
                    <TrackingNotes movements={trackComplaintData} />
                </VStack>
            );
        }

        return (
            <VStack spacing={4}>
                <Image
                    src={noAttachment}
                    alt='No Data Found'
                    maxW='300px'
                    mb={2}
                    opacity={trackId.length > 0 ? 1 : 0.6}
                />
                <Text fontSize='17px' fontWeight={500} color='#8E8E8E'>
                    {trackId.length >= 3 ? t('noDataFound') : t('startTracking', { defaultValue: 'Enter Ticket ID to Track' })}
                </Text>
                <Text fontSize='12px' color='#8E8E8E' fontWeight={400}>
                    {trackId.length >= 3 ? t('pleaseCheckTicketId', { defaultValue: 'Please check your Ticket ID and try again' }) : t('pleaseEnterAboveFieldsSearchTrackingId')}
                </Text>
            </VStack>
        );
    };

    return (
        <Popup
            isOpen={open}
            onOpenChange={setOpen}
            size='xl'
            placement='center'
            hideCloseButton
            headerProps={{ display: 'none' }}
        >
            <Box bg='white' p={3}>
                <VStack spacing={6} align='stretch'>
                    {!ticketId && (
                        <Box bg='#FAFAFA' py={8} borderRadius='15px'>
                            <VStack spacing={4} gap={8} align='center'>
                                <Flex align='center' gap={2}>
                                    <svg width='25' height='13' viewBox='0 0 25 13' fill='none' xmlns='http://www.w3.org/2000/svg'>
                                        <rect x='5.5' y='0.5' width='19' height='12' rx='6' stroke='#8D0247' />
                                        <rect width='19' height='13' rx='6.5' fill='#8D0247' />
                                    </svg>
                                    <Text fontSize='14px' fontWeight={600} color='#292929' textTransform='uppercase' letterSpacing={'0.423px'}>
                                        {t('bestInternetProvider')}
                                    </Text>
                                </Flex>
                                <Text fontSize='36px' fontWeight={800} color='primary.500' textTransform='uppercase' letterSpacing='-1px'>
                                    {t('trackYourComplaint')}
                                </Text>
                                <SearchInput
                                    width='80%'
                                    value={trackId}
                                    onChange={handleSearch}
                                    placeholder={t('enterTicketId', { defaultValue: 'Enter Ticket ID (e.g. 10239)' })}
                                    onKeyDown={allowOnlyDigits}
                                />
                            </VStack>
                        </Box>
                    )}

                    <Box
                        bg='#FAFAFA'
                        mt={2}
                        borderRadius='15px'
                        minH='400px'
                        maxH={'450px'}
                        overflowY='auto'
                        className='hide-scrollbar'
                        display={(isLoading || !(trackComplaintData && Object.keys(trackComplaintData).length > 0)) ? 'flex' : 'block'}
                        alignItems='center'
                        justifyContent='center'
                        p={(isLoading || !(trackComplaintData && Object.keys(trackComplaintData).length > 0)) ? 0 : 4}
                    >
                        {renderResult()}
                    </Box>

                    <Flex justify='flex-end'>
                        <Button
                            variant='outline'
                            h={'40px'}
                            mt={3}
                            onClick={() => setOpen(false)}
                        >
                            <Close /> {t('close')}
                        </Button>
                    </Flex>
                </VStack>
            </Box>
        </Popup>
    );
}

export default ComplaintTracking;