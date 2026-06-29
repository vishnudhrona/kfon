/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Button, Flex, HStack, Icons, Input, InputGroup, Popover, Spinner, Text, VStack } from '@kfonbss/bss-ui-components';
import { useLocation, useParams } from '@tanstack/react-router';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LuExternalLink } from 'react-icons/lu';
import { useDispatch, useSelector } from 'react-redux';

import ChildCardBg from '@/assets/corporate/ChildCardBg.png';
import { SearchIcon } from '@/components/custom';
import CsvDownloadBtn from '@/components/custom/CsvDownloadBtn';
import SplashLoader from '@/components/custom/SplashLoader';
import TableActionMenu from '@/components/custom/TableActionMenu';
import { DATE_FORMAT } from '@/constants/date';
import { getApiProgress } from '@/features/others/ApiProgress/selectors';
import { router } from '@/routes/routes';
import { dayjs } from '@/utils/dateUtils';

import {
    ACTION_TYPES,
    downloadCorporatePurchaseOrderListCsv,
    fetchEnquiryDetails,
    fetchPoByEnquiry,
    generatePoPdf
} from '../action';
import { getEnquiryDetailsData, getTableData } from '../selector';
import PurchaseOrderPreviewPopup from './popUps/PurchaseOrderPreviewPopup';

const {
    CardTickIcon,
    CardUserIcon,
    MobileNewIcon,
    NewEmailIcon,
    AddressCardIcon,
    CardNotesIcon,
    TimeCorporateNewIcon,
    FilterIcon
} = Icons;

const TABLE_KEY = ACTION_TYPES.FETCH_PO_BY_ENQUIRY;

const STATUS_LABELS = {
    DRAFT: 'Draft',
    CREATED: 'Proposal Created',
    SEND_TO_CUSTOMER: 'Send to Customer',
    APPROVED: 'Proposal Approved',
    PO_RECEIVED: 'PO Received',
    REVISED: 'Revised'
};

const STATUS_TONES = {
    PO_RECEIVED: { bg: '#EAF7EF', color: '#1F8A4D', dot: '#27AE60', border: '1px solid #C5E5D3' },
    APPROVED: { bg: '#EAF7EF', color: '#1F8A4D', dot: '#27AE60', border: '1px solid #C5E5D3' }
};
const STATUS_DEFAULT = { bg: '#FFFFFF', color: '#8D0247', dot: '#FD1C7A', border: '1px solid #F0E1E7' };

const Sep = () => <Box h='20px' w='1px' bg='rgba(130,130,130,0.19)' flexShrink={0} />;

const formatStatusLabel = (status) =>
    STATUS_LABELS[status] ??
    (status ? status.replace(/_/g, ' ').replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()) : '-');

const relativeFromNow = (dateStr) => {
    if (!dateStr) return '';
    const parsed = dayjs(dateStr);
    if (!parsed.isValid()) return '';
    const now = dayjs();
    const diffMs = now.valueOf() - parsed.valueOf();
    const sec = Math.floor(diffMs / 1000);
    const min = Math.floor(sec / 60);
    const hr = Math.floor(min / 60);
    const day = Math.floor(hr / 24);
    if (day >= 1) return `${day} Day${day > 1 ? 's' : ''} ago`;
    if (hr >= 1) return `${hr} Hour${hr > 1 ? 's' : ''} ago`;
    if (min >= 1) return `${min} Min${min > 1 ? 's' : ''} ago`;
    return 'Just now';
};

const StatusBadge = ({ status }) => {
    const tone = STATUS_TONES[status] ?? STATUS_DEFAULT;
    return (
        <Box
            display='inline-flex'
            alignItems='center'
            gap='6px'
            px={3}
            py='3px'
            borderRadius='full'
            bg={tone.bg}
            color={tone.color}
            border={tone.border}
            fontSize='12px'
            fontWeight='600'
            flexShrink={0}
        >
            <Box as='span' w='8px' h='8px' borderRadius='full' bg={tone.dot} />
            {formatStatusLabel(status)}
        </Box>
    );
};

const HeaderCard = ({ enquiry, t }) => {
    const {
        enqId, trackingId, enquiryId,
        companyName, companyType,
        contactName, contactNumber, emailId,
        installationAddress, latitude, longitude,
        receivedFromName, receivedFromDesignation, source = 'WEB',
        createdDate
    } = enquiry || {};
    const [isAddressOpen, setIsAddressOpen] = useState(false);

    const formattedDate = createdDate && dayjs(createdDate).isValid()
        ? `${dayjs(createdDate).format(DATE_FORMAT.DATE)} ${dayjs(createdDate).format('hh:mm:ss A')}`
        : '-';
    const ago = relativeFromNow(createdDate);

    return (
        <Box
            bg='white'
            border='1.5px solid #E1E1E1'
            borderRadius='md'
            px={4}
            py={3}
            mb={4}
        >
            <VStack align='stretch' spacing={2}>
                <HStack w='full' spacing={3} align='center'>
                    <HStack
                        spacing={1}
                        bg='#FFD557'
                        borderRadius='full'
                        px={3}
                        py='4px'
                        flexShrink={0}
                    >
                        {CardTickIcon && <CardTickIcon width='14px' height='14px' style={{ color: '#232F50' }} />}
                        <Text fontSize='14px' fontWeight='700' color='#232F50'>
                            ID: {trackingId || enqId || enquiryId || '-'}
                        </Text>
                    </HStack>
                    <Text fontWeight='700' fontSize='16px' color='gray.900' noOfLines={1}>
                        {companyName || '-'}
                    </Text>
                    {companyType && (
                        <Box
                            px={2}
                            py='2px'
                            borderRadius='full'
                            bg='#F6EBD7'
                            border='1px solid #EFDD9D'
                            flexShrink={0}
                        >
                            <Text fontSize='12px' fontWeight='500' color='#232F50'>
                                {companyType.charAt(0).toUpperCase() + companyType.slice(1).toLowerCase()}
                            </Text>
                        </Box>
                    )}
                    <Box flex={1} />
                    <HStack spacing={2} flexShrink={0}>
                        {CardNotesIcon && <CardNotesIcon width='22px' height='22px' style={{ color: '#919191' }} />}
                        <Text fontSize='14px' color='#5F5F5F' fontWeight='500'>
                            {t('receivedFrom')}:{' '}
                            <Text as='span' fontWeight='600' color='#232F50'>
                                {receivedFromName || source}{receivedFromDesignation ? ` ${receivedFromDesignation}` : ''}
                            </Text>
                        </Text>
                    </HStack>
                </HStack>

                <HStack w='full' spacing={3} align='center' flexWrap='wrap'>
                    <HStack spacing={1} flexShrink={0}>
                        {CardUserIcon && <CardUserIcon width='20px' height='20px' />}
                        <Text fontSize='14px' color='#000' fontWeight='600'>{contactName || '-'}</Text>
                    </HStack>
                    <Sep />
                    <HStack spacing={1} flexShrink={0}>
                        {MobileNewIcon && <MobileNewIcon width='20px' height='20px' style={{ color: '#919191' }} />}
                        <Text fontSize='14px' color='#5F5F5F' fontWeight='600'>{contactNumber || '-'}</Text>
                    </HStack>
                    <Sep />
                    <HStack spacing={1} flexShrink={0}>
                        {NewEmailIcon && <NewEmailIcon width='20px' height='20px' style={{ color: '#919191' }} />}
                        <Text fontSize='14px' color='#5F5F5F' fontWeight='500'>{emailId || '-'}</Text>
                    </HStack>
                    {AddressCardIcon && (
                        <>
                            <Sep />
                            <Popover.Root
                                open={isAddressOpen}
                                onOpenChange={(e) => setIsAddressOpen(e.open)}
                                positioning={{ placement: 'top-start' }}
                            >
                                <Popover.Trigger asChild>
                                    <HStack
                                        spacing={1}
                                        cursor='pointer'
                                        flexShrink={0}
                                        onMouseEnter={() => setIsAddressOpen(true)}
                                        onMouseLeave={() => setIsAddressOpen(false)}
                                    >
                                        <AddressCardIcon width='20px' height='20px' style={{ color: '#919191' }} />
                                        <Text fontSize='14px' color='#5F5F5F' fontWeight='500'>{t('address')}</Text>
                                    </HStack>
                                </Popover.Trigger>
                                <Popover.Positioner>
                                    <Popover.Content minW='320px' bg='white' boxShadow='md' borderRadius='md'>
                                        <Popover.Body p={3}>
                                            <VStack align='stretch' spacing={2}>
                                                <Text fontSize='sm' color='gray.800' fontWeight='medium'>
                                                    {installationAddress || '-'}
                                                </Text>
                                                <HStack spacing={3} pt={2} borderTop='1px solid' borderColor='gray.100'>
                                                    <Text fontSize='xs' color='gray.400'>
                                                        {t('latitude')}:{' '}
                                                        <Text as='span' color='gray.800' fontWeight='medium'>{latitude || '-'}</Text>
                                                    </Text>
                                                    <Box w='1px' h='12px' bg='gray.200' />
                                                    <Text fontSize='xs' color='gray.400'>
                                                        {t('longitude')}:{' '}
                                                        <Text as='span' color='gray.800' fontWeight='medium'>{longitude || '-'}</Text>
                                                    </Text>
                                                </HStack>
                                            </VStack>
                                        </Popover.Body>
                                    </Popover.Content>
                                </Popover.Positioner>
                            </Popover.Root>
                        </>
                    )}
                    <Box flex={1} />
                    <HStack spacing={2} flexShrink={0}>
                        <Text fontSize='14px' color='#5F5F5F' fontWeight='500'>
                            {t('receivedOn')}:{' '}
                            <Text as='span' fontWeight='600' color='#232F50'>{formattedDate}</Text>
                        </Text>
                        {TimeCorporateNewIcon && <TimeCorporateNewIcon width='18px' height='18px' />}
                        {ago && (
                            <Text fontSize='13px' color='#8D0247' fontWeight='600'>{ago}</Text>
                        )}
                    </HStack>
                </HStack>
            </VStack>
        </Box>
    );
};

const PurchaseOrderRow = ({ row, index, t, onViewPo, isPoPdfLoading, actionItems, onCardClick }) => {
    const indexLabel = String(index + 1).padStart(2, '0');
    const poDateLabel = row?.poDate
        ? `${dayjs(row.poDate, ['DD-MM-YYYY', 'YYYY-MM-DD']).format(DATE_FORMAT.DATE)} ${row?.poTime ? row.poTime : ''}`.trim()
        : 'NIL';

    return (
        <Box
            bg='#FFFDF6'
            borderRadius='md'
            border='1.5px solid #E1E1E1'
            borderTop='1.5px solid #66D08F7A'
            px={4}
            py={3}
            mb={3}
            position='relative'
            backgroundImage={`linear-gradient(rgba(255,253,246,0.3), rgba(255,253,246,0.3)), url(${ChildCardBg})`}
            backgroundRepeat='no-repeat'
            backgroundPosition='center'
            backgroundSize='cover'
            cursor={onCardClick ? 'pointer' : 'default'}
            onClick={onCardClick ? () => onCardClick(row) : undefined}
            _hover={onCardClick ? { boxShadow: 'md' } : undefined}
        >
            <HStack w='full' spacing={4} align='center' position='relative'>
                <Box flexShrink={0} minW='32px' display='flex' alignItems='center' justifyContent='center'>
                    <Text fontWeight='bold' fontSize='md' color='gray.600'>{indexLabel}</Text>
                </Box>

                <HStack spacing={1} flexShrink={0}>
                    <Text fontSize='14px' color='#5F5F5F'>{t('proposalName')}:</Text>
                    <Text fontSize='14px' fontWeight='700' color='#232F50'>
                        {row?.proposalName || '-'}
                    </Text>
                </HStack>

                <HStack spacing={1} flexShrink={0}>
                    <Text fontSize='14px' color='#5F5F5F'>{t('purchaseOrder')}:</Text>
                    <Text fontSize='14px' fontWeight='700' color='#232F50'>
                        {row?.poNumber || 'NIL'}
                    </Text>
                </HStack>

                <HStack spacing={1} flexShrink={0}>
                    <Text fontSize='14px' color='#5F5F5F'>{t('purchaseOrderDate')}:</Text>
                    <Text fontSize='14px' fontWeight='700' color='#232F50'>
                        {poDateLabel}
                    </Text>
                    {row?.poNumber && (
                        <Box
                            as='span'
                            cursor={isPoPdfLoading ? 'wait' : 'pointer'}
                            color='#8D0247'
                            onClick={(e) => { e.stopPropagation(); if (!isPoPdfLoading) onViewPo(row); }}
                            ml={1}
                            display='inline-flex'
                            alignItems='center'
                        >
                            {isPoPdfLoading ? <Spinner size='xs' color='#8D0247' /> : <LuExternalLink size={14} />}
                        </Box>
                    )}
                </HStack>

                <Box flex={1} />

                <StatusBadge status={row?.proposalStatus} />

                <Box onClick={(e) => e.stopPropagation()} flexShrink={0} w='32px' display='flex' justifyContent='center'>
                    <TableActionMenu row={row} actionItems={actionItems} />
                </Box>
            </HStack>
        </Box>
    );
};

const CorporatePurchaseOrderTableView = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { enquiryId } = useParams({ strict: false });
    const pathname = useLocation({ select: (l) => l.pathname }) ?? '';
    const isCircuitProvisioningContext = pathname.includes('circuit-provisioning');
    const isServiceProvisioningContext = pathname.includes('service-provisioning') && !isCircuitProvisioningContext;
    const isProvisioningContext = isCircuitProvisioningContext || isServiceProvisioningContext;

    const [isPOPreviewOpen, setIsPOPreviewOpen] = useState(false);
    const [poPreviewData, setPoPreviewData] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    const apiProgress = useSelector(getApiProgress);
    const { data: enquiry } = useSelector(getEnquiryDetailsData) || {};
    const tableState = useSelector(getTableData(TABLE_KEY));
    const purchaseOrders = Array.isArray(tableState?.data) ? tableState.data : [];
    const isLoading = !!apiProgress[ACTION_TYPES.FETCH_PO_BY_ENQUIRY];
    const isPoPdfLoading = !!apiProgress[ACTION_TYPES.GENERATE_PO_PDF];

    const handleCardClick = (row) => {
        const targetPath = isServiceProvisioningContext
            ? '/app/corporate/service-provisioning-list/$enquiryId'
            : '/app/corporate/enquiry-detailed-view/circuit-provisioning/$enquiryId';
        router.navigate({
            to: targetPath,
            params: { enquiryId: row?.enquiryId ?? enquiryId },
            state: { version: row?.version, locationIds: row?.locationIds }
        });
    };

    useEffect(() => {
        if (!enquiryId) return;
        dispatch(fetchEnquiryDetails({ enquiryId }));
        dispatch(fetchPoByEnquiry({ key: TABLE_KEY, enquiryId }));
    }, [dispatch, enquiryId]);

    const onViewPo = (row) => {
        dispatch(generatePoPdf({
            enquiryId: row?.enquiryId ?? enquiryId,
            version: row?.version ?? 1,
            onSuccess: (d) => { setPoPreviewData(d); setIsPOPreviewOpen(true); }
        }));
    };

    const actionItems = useMemo(() => [
        { label: 'viewPo', onClick: (row) => onViewPo(row) }
     
    ], [enquiryId]);

    const filteredPurchaseOrders = useMemo(() => {
        const list = Array.isArray(purchaseOrders) ? purchaseOrders : [];
        if (!searchQuery.trim()) return list;
        const q = searchQuery.trim().toLowerCase();
        return list.filter((p) =>
            (p?.poNumber ?? '').toLowerCase().includes(q) ||
            (p?.proposalName ?? '').toLowerCase().includes(q) ||
            (p?.proposalStatus ?? '').toLowerCase().includes(q)
        );
    }, [purchaseOrders, searchQuery]);

    return (
        <Box px={5} py={4} bg='#F8F8F8' minH='100%'>
            <HeaderCard enquiry={enquiry} t={t} />

            <Flex justify='space-between' align='center' mb={4} gap={3} flexWrap='wrap'>
                <Box maxW='320px' w='full'>
                    <InputGroup startElement={<SearchIcon color='gray.400' width='4' height='6' />} width='100%'>
                        <Input
                            height='40px'
                            placeholder={t('search')}
                            borderRadius='md'
                            bg='white'
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </InputGroup>
                </Box>
                <HStack spacing={2}>
                    <Button variant='outline' borderColor='#8D0247' color='#8D0247' borderRadius='md' height='40px'>
                        {FilterIcon && <FilterIcon style={{ marginRight: 6 }} />}
                        {t('filter')}
                    </Button>
                    <CsvDownloadBtn
                        variant='outline'
                        borderColor='#8D0247'
                        color='#8D0247'
                        borderRadius='md'
                        height='40px'
                        onClick={() => dispatch(downloadCorporatePurchaseOrderListCsv({ enquiryId }))}
                    />
                </HStack>
            </Flex>

            {isLoading ? (
                <Flex justify='center' py={10}>
                    <SplashLoader inline />
                </Flex>
            ) : filteredPurchaseOrders.length === 0 ? (
                <Box bg='white' borderRadius='md' border='1px solid #E1E1E1' py={10}>
                    <Text textAlign='center' color='gray.500'>{t('noRecordsFound')}</Text>
                </Box>
            ) : (
                filteredPurchaseOrders.map((p, idx) => (
                    <PurchaseOrderRow
                        key={p?.id ?? `${p?.poNumber}-${idx}`}
                        row={p}
                        index={idx}
                        t={t}
                        onViewPo={onViewPo}
                        isPoPdfLoading={isPoPdfLoading}
                        actionItems={actionItems}
                        onCardClick={isProvisioningContext ? handleCardClick : undefined}
                    />
                ))
            )}

            <PurchaseOrderPreviewPopup
                isOpen={isPOPreviewOpen}
                data={poPreviewData}
                onCancel={() => { setIsPOPreviewOpen(false); setPoPreviewData(null); }}
                navigateOnClose={false}
                hideActions
            />
        </Box>
    );
};

export default CorporatePurchaseOrderTableView;
