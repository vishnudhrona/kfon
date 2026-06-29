import { Box, Button, Flex, HStack, Icons, Input, InputGroup, Popover, Text, VStack } from '@kfonbss/bss-ui-components';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import MainCardBg from '@/assets/corporate/MainCardBg.png';
import { SearchIcon } from '@/components/custom';
import CsvDownloadBtn from '@/components/custom/CsvDownloadBtn';
import SplashLoader from '@/components/custom/SplashLoader';
import TableActionMenu from '@/components/custom/TableActionMenu';
import { getApiProgress } from '@/features/others/ApiProgress/selectors';
import { router } from '@/routes/routes';

import { ACTION_TYPES, downloadEnquiryListCsv, fetchCorporateCustomerList } from '../action';
import { CORPORATE_KEYS } from '../constants';
import { getTableData } from '../selector';

const {
    CardUserIcon,
    MobileNewIcon,
    NewEmailIcon,
    AddressCardIcon,
    DownArrowIcon
} = Icons;

const TYPE_OPTIONS = [
    { label: 'All', value: '' },
    { label: 'Private', value: 'PRIVATE' },
    { label: 'Government', value: 'GOVERNMENT' },
    { label: 'Government EO', value: 'GOVERNMENT_EO' }
];

const Sep = () => <Box h='20px' w='1px' bg='rgba(130,130,130,0.19)' flexShrink={0} />;

const formatCustomerType = (value) => {
    if (!value) return '-';
    return value.replace(/_/g, ' ').replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
};

const STATUS_TONES = {
    KYC_COMPLETED: { bg: '#EAF7EF', color: '#1F8A4D', dot: '#27AE60', border: '1px solid #C5E5D3' },
    KYC_DETAILS_ADDED: { bg: '#EFF5FF', color: '#2255CC', dot: '#4488FF', border: '1px solid #CBDDFA' },
    KYC_PENDING: { bg: '#FFF8E6', color: '#9A6F00', dot: '#FF8C00', border: '1px solid #F3E2C8' },
    APPROVED: { bg: '#EAF7EF', color: '#1F8A4D', dot: '#27AE60', border: '1px solid #C5E5D3' },
    PENDING: { bg: '#FFF8E6', color: '#9A6F00', dot: '#FF8C00', border: '1px solid #F3E2C8' },
    REJECTED: { bg: '#FFF0F3', color: '#C82020', dot: '#FD1C7A', border: '1px solid #F0E1E7' }
};
const STATUS_DEFAULT = { bg: '#FFFFFF', color: '#8D0247', dot: '#FD1C7A', border: '1px solid #F0E1E7' };

const STATUS_LABELS = {
    KYC_COMPLETED: 'KYC Completed',
    KYC_DETAILS_ADDED: 'KYC Details Added',
    KYC_PENDING: 'KYC Pending'
};

const formatStatusLabel = (status) => STATUS_LABELS[status] ?? formatCustomerType(status);

const StatusBadge = ({ status }) => {
    if (!status) return null;
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

const navigateToCreate = (enquiryId) => {
    if (!enquiryId) return;
    router.navigate({
        to: '/app/corporate/customers/create-customer',
        search: { enquiryId }
    });
};

const CustomerCard = ({ data, index }) => {
    const { t } = useTranslation();
    const [isAddressOpen, setIsAddressOpen] = useState(false);

    const customerType = data?.companyType ?? data?.customerType ?? '';
    const organizationName = data?.companyName ?? data?.organizationName ?? '';
    const contactPerson = data?.contactPerson ?? data?.contactName ?? '';
    const mobileNumber = data?.mobile ?? data?.mobileNumber ?? data?.contactNumber ?? '';
    const email = data?.email ?? data?.emailId ?? '';
    const locationAddress = data?.locationAddress ?? data?.location ?? data?.address ?? data?.installationAddress ?? '';
    const pinCode = data?.pincode ?? data?.pinCode ?? '';
    const enquiryId = data?.enquiryId ?? '';
    const approvalStatus = data?.approvalStatus ?? '';
    const indexLabel = String(index + 1).padStart(2, '0');

    const handleView = (row) => navigateToCreate(row?.enquiryId ?? enquiryId);
    const handleCardClick = () => navigateToCreate(enquiryId);

    const actionItems = useMemo(
        () => [
            { label: 'view', onClick: handleView }
        ],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [enquiryId]
    );

    return (
        <Box
            borderRadius='md'
            boxShadow='sm'
            mb={3}
            cursor={enquiryId ? 'pointer' : 'default'}
            onClick={enquiryId ? handleCardClick : undefined}
            _hover={{ boxShadow: 'md' }}
        >
            <Box
                bg='#FFFDF6'
                border='1.5px solid #E1E1E1'
                borderRadius='md'
                px={5}
                py={5}
                position='relative'
                backgroundImage={`url(${MainCardBg})`}
                backgroundRepeat='no-repeat'
                backgroundPosition='center'
                backgroundSize='40% auto'
                css={{ backgroundBlendMode: 'multiply' }}
                _before={{
                    content: '""',
                    position: 'absolute',
                    inset: 0,
                    bg: '#FFFDF6',
                    opacity: 0.9,
                    pointerEvents: 'none',
                    borderRadius: 'inherit'
                }}
                _hover={{ borderColor: '#EFDD9D' }}
            >
                <HStack w='full' spacing={3} align='center' position='relative'>
                    <Box flexShrink={0} minW='32px' alignSelf='stretch' display='flex' alignItems='center' justifyContent='center'>
                        <Text fontWeight='bold' fontSize='md' color='gray.600'>{indexLabel}</Text>
                    </Box>

                    <VStack flex={1} minW={0} align='stretch' spacing={4}>
                        {/* Row 1: Organization Name | Customer Type chip | spacer | Action menu */}
                        <HStack w='full' spacing={3} align='center'>
                            <Text fontWeight='700' fontSize='16px' color='gray.900' noOfLines={1}>
                                {organizationName || '-'}
                            </Text>
                            {customerType && (
                                <Box
                                    px={2}
                                    py='2px'
                                    borderRadius='full'
                                    bg='#F6EBD7'
                                    border='1px solid #EFDD9D'
                                    flexShrink={0}
                                >
                                    <Text fontSize='12px' fontWeight='500' color='#232F50'>
                                        {formatCustomerType(customerType)}
                                    </Text>
                                </Box>
                            )}
                            <Box flex={1} />
                            <Box onClick={(e) => e.stopPropagation()} flexShrink={0} w='32px' display='flex' justifyContent='center'>
                                <TableActionMenu row={data} actionItems={actionItems} />
                            </Box>
                        </HStack>

                        {/* Row 2: Contact Person | Mobile Number | Email ID | Location Address | Pincode */}
                        <HStack w='full' spacing={3} align='center' flexWrap='wrap'>
                            <HStack spacing={1} flexShrink={0}>
                                {CardUserIcon && <CardUserIcon width='24px' height='24px' />}
                                <Text fontSize='16px' color='#000' fontWeight='600'>{contactPerson || '-'}</Text>
                            </HStack>
                            <Sep />
                            <HStack spacing={1} flexShrink={0}>
                                {MobileNewIcon && <MobileNewIcon width='24px' height='24px' style={{ color: '#919191' }} />}
                                <Text fontSize='16px' color='#5F5F5F' fontWeight='600'>{mobileNumber || '-'}</Text>
                            </HStack>
                            <Sep />
                            <HStack spacing={1} flexShrink={0}>
                                {NewEmailIcon && <NewEmailIcon width='24px' height='24px' style={{ color: '#919191' }} />}
                                <Text fontSize='16px' color='#5F5F5F' fontWeight='500'>{email || '-'}</Text>
                            </HStack>
                            {locationAddress && AddressCardIcon && (
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
                                                <AddressCardIcon width='24px' height='24px' style={{ color: '#919191' }} />
                                                <Text fontSize='16px' color='#5F5F5F' fontWeight='500'>{t('locationAddress', 'Location Address')}</Text>
                                            </HStack>
                                        </Popover.Trigger>
                                        <Popover.Positioner>
                                            <Popover.Content minW='280px' bg='white' boxShadow='md' borderRadius='md'>
                                                <Popover.Body p={3}>
                                                    <Text fontSize='sm' color='gray.800' fontWeight='medium'>
                                                        {locationAddress || '-'}
                                                    </Text>
                                                </Popover.Body>
                                            </Popover.Content>
                                        </Popover.Positioner>
                                    </Popover.Root>
                                </>
                            )}
                            {pinCode && (
                                <>
                                    <Sep />
                                    <Text fontSize='16px' color='#5F5F5F' fontWeight='500'>
                                        {t('pincode', 'Pincode')}:<Text as='span' fontWeight='600' color='#232F50'>{pinCode}</Text>
                                    </Text>
                                </>
                            )}
                            <Box flex={1} />
                            {approvalStatus && <StatusBadge status={approvalStatus} />}
                        </HStack>
                    </VStack>
                </HStack>
            </Box>
        </Box>
    );
};

const CorporateCustomerListView = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const apiProgress = useSelector(getApiProgress);
    const tableState = useSelector(getTableData(CORPORATE_KEYS.CORPORATE_CUSTOMER_LIST));
    const customers = Array.isArray(tableState?.data) ? tableState.data : [];
    const isLoading = !!apiProgress[ACTION_TYPES.FETCH_CORPORATE_CUSTOMER_LIST];

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
    const debounceRef = useRef(null);

    const fetchCustomers = (params = {}) => {
        dispatch(fetchCorporateCustomerList({
            ...(params.type && { type: params.type }),
            ...(params.search && { search: params.search })
        }));
    };

    useEffect(() => {
        fetchCustomers({ type: selectedType, search: searchQuery });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedType]);

    const handleSearchChange = (value) => {
        setSearchQuery(value);
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            fetchCustomers({ type: selectedType, search: value });
        }, 400);
    };

    const selectedTypeLabel = TYPE_OPTIONS.find((o) => o.value === selectedType)?.label ?? 'All';

    return (
        <Box px={5} py={4} bg='#F8F8F8' minH='100%'>
            <Flex justify='space-between' align='center' mb={4} gap={3} flexWrap='wrap'>
                <Box maxW='320px' w='full'>
                    <InputGroup startElement={<SearchIcon color='gray.400' width='4' height='6' />} width='100%'>
                        <Input
                            height='40px'
                            placeholder={t('search')}
                            borderRadius='md'
                            bg='white'
                            value={searchQuery}
                            onChange={(e) => handleSearchChange(e.target.value)}
                        />
                    </InputGroup>
                </Box>
                <HStack spacing={2}>
                    <Popover.Root
                        open={isTypeDropdownOpen}
                        onOpenChange={(e) => setIsTypeDropdownOpen(e.open)}
                        positioning={{ placement: 'bottom-start' }}
                    >
                        <Popover.Trigger asChild>
                            <Button
                                variant='outline'
                                borderRadius='md'
                                height='40px'
                            >
                                {selectedTypeLabel}
                                {DownArrowIcon && <DownArrowIcon style={{ marginLeft: 6 }} />}
                            </Button>
                        </Popover.Trigger>
                        <Popover.Positioner>
                            <Popover.Content
                                width='180px'
                                bg='white'
                                boxShadow='md'
                                border='1px solid'
                                borderColor='gray.200'
                                borderRadius='md'
                                p={1}
                            >
                                <Popover.Body p={0}>
                                    {TYPE_OPTIONS.map((opt) => (
                                        <Box
                                            key={opt.label}
                                            px={3}
                                            py={2}
                                            cursor='pointer'
                                            borderRadius='sm'
                                            bg={selectedType === opt.value ? 'gray.100' : 'transparent'}
                                            _hover={{ bg: 'gray.100' }}
                                            onClick={() => {
                                                setSelectedType(opt.value);
                                                setIsTypeDropdownOpen(false);
                                            }}
                                        >
                                            <Text fontSize='14px' fontWeight={selectedType === opt.value ? '600' : '400'}>
                                                {opt.label}
                                            </Text>
                                        </Box>
                                    ))}
                                </Popover.Body>
                            </Popover.Content>
                        </Popover.Positioner>
                    </Popover.Root>
                    <CsvDownloadBtn
                        variant='outline'
                        borderColor='#8D0247'
                        color='#8D0247'
                        borderRadius='md'
                        height='40px'
                        onClick={() => dispatch(downloadEnquiryListCsv({ type: selectedType, search: searchQuery }))}
                    />
                </HStack>
            </Flex>

            {isLoading ? (
                <Flex justify='center' py={10}>
                    <SplashLoader inline />
                </Flex>
            ) : customers.length === 0 ? (
                <Box bg='white' borderRadius='md' border='1px solid #E1E1E1' py={10}>
                    <Text textAlign='center' color='gray.500'>{t('noRecordsFound')}</Text>
                </Box>
            ) : (
                customers.map((c, idx) => (
                    <CustomerCard key={c?.id ?? `${c?.companyName}-${idx}`} data={c} index={idx} />
                ))
            )}
        </Box>
    );
};

export default CorporateCustomerListView;
