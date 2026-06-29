import { Box, HStack, Icons, Spinner, Text } from '@kfonbss/bss-ui-components';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { DATE_FORMAT } from '@/constants/date';
import { getApiProgress } from '@/features/others/ApiProgress/selectors';
import { router } from '@/routes/routes';
import { dayjs } from '@/utils/dateUtils';

import { ACTION_TYPES, fetchEnquirySummaryWithPo } from '../action';
import { getEnquirySummaryWithPo } from '../selector';

const { DownArrowIcon } = Icons;

const statusLabelMap = {
    CREATED: 'PO Created',
    PO_RECEIVED: 'PO Received',
    APPROVED: 'Approved',
    CONNECTED: 'Connected',
    'IN PROGRESS': 'In Progress',
    OPEN: 'Open',
    CLOSED: 'Closed',
    PENDING: 'Pending',
    REJECTED: 'Rejected'
};

const formatStatusLabel = (status) =>
    statusLabelMap[status] ??
    status.replace(/_/g, ' ').replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());

const Sep = () => <Box h="20px" w="1px" bg="rgba(130,130,130,0.19)" flexShrink={0} />;

const PoStatusBadge = ({ status }) => {
    if (!status) return null;
    const bg = status === 'APPROVED' ? '#E6FCEE' : status === 'PO_RECEIVED' ? '#DCEEFF' : '#FFDE74';
    const color = status === 'APPROVED' ? '#008232' : status === 'PO_RECEIVED' ? '#0062BE' : '#000000';
    const borderColor = status === 'APPROVED' ? '#008232' : status === 'PO_RECEIVED' ? '#0062BE' : '#9B7809';
    return (
        <Box
            px={2}
            py="2px"
            borderRadius="full"
            fontSize="xs"
            fontWeight="600"
            bg={bg}
            color={color}
            border="1px solid"
            borderColor={borderColor}
            flexShrink={0}
        >
            {formatStatusLabel(status)}
        </Box>
    );
};

const PoSummaryCard = ({ data, index }) => {
    const { t } = useTranslation();

    const {
        enquiryId,
        enqId,
        trackingId,
        companyName,
        createdDate,
        source = 'WEB',
        receivedFromName,
        receivedFromDesignation,
        poStatus,
        latestPoStatus
    } = data;

    const indexLabel = String(index).padStart(2, '0');
    const displayId = trackingId || enqId || enquiryId;

    const formattedDate = createdDate
        ? dayjs(createdDate).isValid()
            ? dayjs(createdDate).format(DATE_FORMAT.DATE_TIME)
            : createdDate
        : '-';

    const currentStatus = latestPoStatus || poStatus;

    const handleNavigate = () => {
        router.navigate({
            to: '/app/corporate/purchase-orders-list/$enquiryId',
            params: { enquiryId: enquiryId || enqId }
        });
    };

    return (
        <Box
            bg="white"
            px={4}
            py={3}
            borderRadius="md"
            boxShadow="sm"
            border="1px solid"
            borderColor="gray.200"
            mb={3}
            cursor="pointer"
            _hover={{ boxShadow: 'md' }}
            onClick={handleNavigate}
        >
            <HStack w="full" spacing={3} align="center">
                <Text fontWeight="bold" fontSize="md" color="gray.600" flexShrink={0} minW="28px">
                    {indexLabel}
                </Text>

                <HStack spacing={1} flexShrink={0}>
                    <Text fontSize="16px" fontWeight="400" color="#8D0247">{t('id', 'ID')} :</Text>
                    <Text fontSize="16px" fontWeight="bold" color="#8D0247">{displayId}</Text>
                </HStack>

                <Text fontWeight="700" fontSize="16px" color="gray.900" noOfLines={1} flex={1} overflow="hidden" textOverflow="ellipsis">
                    {companyName || '-'}
                </Text>

                <Text fontSize="16px" fontWeight="400" color="#232F50" flexShrink={0}>
                    {t('receivedFrom', 'Received From')}:{' '}
                    <Text as="span" fontWeight="600">
                        {receivedFromName || source}{receivedFromDesignation ? ` (${receivedFromDesignation})` : ''}
                    </Text>
                </Text>

                <Sep />

                <Text fontSize="16px" fontWeight="400" color="#232F50" flexShrink={0}>
                    {t('receivedOn', 'Received On')}:{' '}
                    <Text as="span" fontWeight="600">{formattedDate}</Text>
                </Text>

                {currentStatus && <PoStatusBadge status={currentStatus} />}

                <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    flexShrink={0}
                    w="32px"
                    h="32px"
                >
                    <DownArrowIcon />
                </Box>
            </HStack>
        </Box>
    );
};

const CorporatePoSummaryCards = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const apiProgress = useSelector(getApiProgress);
    const summaryState = useSelector(getEnquirySummaryWithPo);

    const isLoading = !!(apiProgress[ACTION_TYPES.FETCH_ENQUIRY_SUMMARY_WITH_PO]) || summaryState?.isLoading;
    const list = summaryState?.data ?? [];

    useEffect(() => {
        dispatch(fetchEnquirySummaryWithPo());
    }, [dispatch]);

    return (
        <Box>
            <Text fontWeight="700" fontSize="15px" color="gray.700" mb={3}>
                {t('purchaseOrders', 'Purchase Orders')}
            </Text>

            {isLoading ? (
                <Box display="flex" justifyContent="center" alignItems="center" py={6}>
                    <Spinner size="lg" color="#8D0247" />
                </Box>
            ) : !list.length ? (
                <Box display="flex" justifyContent="center" alignItems="center" py={6}>
                    <Text fontSize="md" color="gray.500">{t('noData', 'No data available')}</Text>
                </Box>
            ) : (
                list.map((item, index) => (
                    <PoSummaryCard
                        key={item.enquiryId || item.id || index}
                        data={item}
                        index={index + 1}
                    />
                ))
            )}
        </Box>
    );
};

export default CorporatePoSummaryCards;
