import { Box, Button, HStack, Icons, Popup, Spinner, Text, VStack } from '@kfonbss/bss-ui-components';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { DATE_FORMAT } from '@/constants/date';
import { getApiProgress } from '@/features/others/ApiProgress/selectors';
import { dayjs } from '@/utils/dateUtils';

import { ACTION_TYPES, fetchEnquiryDispositionList } from '../../action';
import { getEnquiryDispositionList } from '../../selector';

const { BsXCircle, BsArrowRightCircle } = Icons;

const STATUS_LABEL_MAP = {
    RE_ASSIGN: 'Re-Assign',
    NOT_INTERESTED: 'Not Interested'
};

const formatDispositionLabel = (label) => {
    if (!label) return '-';
    if (STATUS_LABEL_MAP[label]) return STATUS_LABEL_MAP[label];
    return label.split('_').map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
};

const DEFAULT_BADGE_STYLE = { bg: '#F4F4F4', border: '1px solid #D7D7D7', color: '#FD1C7A', dot: true };

const DispositionBadge = ({ label }) => {
    const style = DEFAULT_BADGE_STYLE;
    const displayLabel = formatDispositionLabel(label);
    return (
        <Box
            px={3}
            py="2px"
            borderRadius="full"
            bg={style.bg}
            border={style.border}
            display="inline-flex"
            alignItems="center"
            gap={1}
        >
            {style.dot && <Box as="span" w="8px" h="8px" borderRadius="full" bg="#FD1C7A" flexShrink={0} />}
            <Text fontSize="sm" fontWeight="600" color={style.color}>{displayLabel}</Text>
        </Box>
    );
};

const CorporateDispositionPopup = ({ isOpen, setIsOpen, enquiryId, dispositionCode }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { data: dispositionList = [], isLoading } = useSelector(getEnquiryDispositionList);
    const apiProgress = useSelector(getApiProgress);
    const isFetching = isLoading || !!apiProgress[ACTION_TYPES.FETCH_ENQUIRY_DISPOSITION_LIST];

    useEffect(() => {
        if (isOpen && enquiryId) {
            dispatch(fetchEnquiryDispositionList({ enquiryId, ...(dispositionCode ? { dispositionCode } : {}) }));
        }
    }, [isOpen, enquiryId, dispositionCode, dispatch]);

    const handleClose = () => setIsOpen(false);

    return (
        <Popup
            isOpen={isOpen}
            title={t('disposition')}
            titleMain={t('summary')}
            size="md"
            maxW="620px"
            closeButton
            onOpenChange={setIsOpen}
        >
            <Box px={2} pb={6} mt={-2}>
                <Box border="1px solid" borderColor="#EAEAEA" borderRadius="xl" p={2} bg="#FFFFFF">
                    {isFetching ? (
                        <HStack justify="center" py={8}>
                            <Spinner size="md" color="#8D0247" />
                        </HStack>
                    ) : dispositionList.length === 0 ? (
                        <VStack py={8} spacing={2}>
                            <Text fontSize="sm" color="gray.400">{t('noRecordsFound')}</Text>
                        </VStack>
                    ) : (
                        <VStack
                            align="stretch"
                            spacing={4}
                            maxH="500px"
                            overflowY="auto"
                            css={{ '&::-webkit-scrollbar': { display: 'none' }, scrollbarWidth: 'none' }}
                        >
                            {dispositionList.map((item, idx) => (
                                <Box
                                    key={item.id ?? idx}
                                    bg="white"
                                    p={4}
                                    borderRadius="xl"
                                    border="1px solid"
                                    borderColor="gray.100"
                                    boxShadow="0px 0px 16px 0px #0000000F"
                                >
                                    {/* Row 1: company name | date */}
                                    <HStack justify="space-between" align="center" mb={3}>
                                        <Text fontWeight="bold" fontSize="md" color="gray.900">
                                            {item.locationName ?? item.companyName ?? '-'}
                                        </Text>
                                        <Text fontSize="sm" color="gray.600" flexShrink={0}>
                                            {item.createdAt
                                                ? dayjs(item.createdAt).isValid()
                                                    ? dayjs(item.createdAt).format(DATE_FORMAT.DATE_TIME)
                                                    : item.createdAt
                                                : '-'}
                                        </Text>
                                    </HStack>

                                    {/* Row 2: disposition badge + reason */}
                                    <HStack spacing={2} align="center" mb={3}>
                                        <DispositionBadge label={item.disposition ?? item.dispositionName} />
                                        <Text fontSize="sm" color="gray.700">
                                            {formatDispositionLabel(item.reason ?? item.reasonName ?? '')}
                                        </Text>
                                    </HStack>

                                    {/* Row 3-4: Remarks */}
                                    <Box mb={item.followUpDays ? 3 : 0}>
                                        <Text fontSize="xs" color="gray.400" mb={1}>{t('remarks')}</Text>
                                        <Text fontSize="sm" color="#0F1121" whiteSpace="pre-line">
                                            {item.remarks ?? '-'}
                                        </Text>
                                    </Box>

                                    {/* Row 5: Follow Up days (optional) */}
                                    {item.followUpDays && (
                                        <HStack spacing={2} align="center" mt={2}>
                                            <Box
                                                w="28px"
                                                h="28px"
                                                borderRadius="md"
                                                bg="#FFF3E0"
                                                display="flex"
                                                alignItems="center"
                                                justifyContent="center"
                                                flexShrink={0}
                                            >
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#E43F00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                                    <line x1="16" y1="2" x2="16" y2="6" />
                                                    <line x1="8" y1="2" x2="8" y2="6" />
                                                    <line x1="3" y1="10" x2="21" y2="10" />
                                                </svg>
                                            </Box>
                                            <Text fontSize="sm" color="gray.700" fontWeight="medium">
                                                Follow Up: <Text as="span" fontWeight="bold">{item.followUpDays} Days</Text>
                                            </Text>
                                        </HStack>
                                    )}
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

export default CorporateDispositionPopup;
