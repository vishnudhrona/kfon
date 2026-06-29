import { Box, Button, HStack, Icons, Popup, Spinner, Text, VStack } from '@kfonbss/bss-ui-components';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { DATE_FORMAT } from '@/constants/date';
import { getApiProgress } from '@/features/others/ApiProgress/selectors';
import { dayjs } from '@/utils/dateUtils';

import { ACTION_TYPES, fetchMeetingHistory } from '../../action';
import { getMeetingHistory } from '../../selector';

const { BsXCircle, BsArrowRightCircle } = Icons;

const PhoneBadgeIcon = () => (
    <Box
        w="16px"
        h="16px"
        borderRadius="full"
        bg="#8D0247"
        display="flex"
        alignItems="center"
        justifyContent="center"
    >
        <svg width="8" height="8" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
        </svg>
    </Box>
);

const CorporateMeetingHistoryPopup = ({ isOpen, setIsOpen, enquiryId }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { data: meetingHistory = [], isLoading } = useSelector(getMeetingHistory);
    const apiProgress = useSelector(getApiProgress);
    const isFetching = isLoading || !!apiProgress[ACTION_TYPES.FETCH_MEETING_HISTORY];

    useEffect(() => {
        if (isOpen && enquiryId) {
            dispatch(fetchMeetingHistory({ enquiryId }));
        }
    }, [isOpen, enquiryId, dispatch]);

    const handleClose = () => setIsOpen(false);

    const formatDate = (dateStr) => {
        if (!dateStr) return '-';
        const parsed = dayjs(dateStr);
        return parsed.isValid() ? parsed.format(DATE_FORMAT.DATE_LOCAL) : dateStr;
    };

    return (
        <Popup
            isOpen={isOpen}
            title={t('add')}
            titleMain={t('meetingDetails')}
            size="md"
            maxW="600px"
            closeButton
            onOpenChange={setIsOpen}
        >
            <Box px={2} pb={6} mt={-2}>
                <Box border="1px solid" borderColor="#EAEAEA" borderRadius="xl" p={2} bg="#FFFFFF">
                    {isFetching ? (
                        <HStack justify="center" py={8}>
                            <Spinner size="md" color="#8D0247" />
                        </HStack>
                    ) : meetingHistory.length === 0 ? (
                        <VStack py={8} spacing={2}>
                            <Text fontSize="sm" color="gray.400">{t('noRecordsFound')}</Text>
                        </VStack>
                    ) : (
                        <VStack align="stretch" spacing={4} maxH="500px" overflowY="auto" css={{ '&::-webkit-scrollbar': { display: 'none' }, scrollbarWidth: 'none' }}>
                            {[...meetingHistory]
                                .sort((a, b) => dayjs(b.createdAt).valueOf() - dayjs(a.createdAt).valueOf())
                                .map((item, idx) => (
                                    <Box key={item.id ?? idx} bg="white" p={2} borderRadius="xl" border="1px solid" borderColor="gray.100" boxShadow="0px 0px 16px 0px #0000000F">
                                        <HStack justify="space-between" align="start" mb={2}>
                                            <VStack align="start" spacing={1}>
                                                <Text fontWeight="semibold" fontSize="lg" color="gray.900">
                                                    {item.contactPersonName ?? '-'}
                                                </Text>
                                                <HStack spacing={2}>
                                                    <PhoneBadgeIcon />
                                                    <Text fontSize="sm" color="gray.500">
                                                        {item.contactNumber ?? '-'}
                                                    </Text>
                                                </HStack>
                                            </VStack>
                                            <Text fontSize="sm" color="gray.600">
                                                {formatDate(item.meetingDate)}
                                            </Text>
                                        </HStack>

                                        <Box mt={4} mb={4}>
                                            <Text fontSize="sm" color="gray.400" mb={2}>{t('remarks')}</Text>
                                            <Text fontSize="md" color="gray.900" fontWeight="medium" whiteSpace="pre-line">
                                                {item.remarks ?? '-'}
                                            </Text>
                                        </Box>
                                    </Box>
                                ))}
                        </VStack>
                    )}
                </Box>

                <HStack justify="flex-end" spacing={4} mt={6}>
                    <Button variant="outline" borderColor="#8D0247" color="#8D0247" px={8} py={2} h="45px" borderRadius="full" onClick={handleClose}>
                        <BsXCircle style={{ marginRight: '8px', width: '24px', height: '24px' }} /> {t('cancel')}
                    </Button>
                    <Button bg="#8D0247" color="white" px={8} py={2} h="45px" borderRadius="full" _hover={{ bg: '#700138' }} onClick={handleClose}>
                        {t('done')} <BsArrowRightCircle style={{ marginLeft: '8px', width: '24px', height: '24px' }} />
                    </Button>
                </HStack>
            </Box>
        </Popup>
    );
};

export default CorporateMeetingHistoryPopup;
