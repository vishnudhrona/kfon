import { Box, Button, HStack, Icons, Input, InputGroup, Popup, Spinner, Text, VStack } from '@kfonbss/bss-ui-components';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { SearchIcon } from '@/components/custom';
import { STORAGE_KEYS } from '@/constants';
import { getApiProgress } from '@/features/others/ApiProgress/selectors';
import { router } from '@/routes/routes';
import { getTokenData } from '@/utils/encryptionUtils';

import { ACTION_TYPES, delinkCorporateCustomer, fetchCorporateEnquirySummaryList, linkCorporateCustomer, verifyCustomer } from '../../action';
import { getCustomerVerificationList } from '../../selector';

const { BsXCircle, BsCheckCircle, MobileNewIcon, NewEmailIcon, AddressNewIcon } = Icons;

const CustomerMappingPopup = ({ isOpen, setIsOpen, enquiryId, customerId, companyName }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const seatId = getTokenData(STORAGE_KEYS.AUTH_TOKEN)?.seatId ?? null;
    const debounceRef = useRef(null);

    const [searchText, setSearchText] = useState('');
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [hasSearched, setHasSearched] = useState(false);

    const { data: customerList = [], isLoading } = useSelector(getCustomerVerificationList);
    const apiProgress = useSelector(getApiProgress);
    const isSubmitting = !!(apiProgress[ACTION_TYPES.LINK_CORPORATE_CUSTOMER] || apiProgress[ACTION_TYPES.DELINK_CORPORATE_CUSTOMER]);

    useEffect(() => {
        if (isOpen) {
            if (customerId) {
                setSearchText(companyName || '');
                setSelectedCustomer({ id: customerId, name: companyName || '', isAutoMapped: true });
                setHasSearched(false);
            } else {
                setSearchText('');
                setSelectedCustomer(null);
                setHasSearched(false);
            }
        }
    }, [isOpen, customerId, companyName]);

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchText(value);
        setSelectedCustomer(null);
        setHasSearched(value.trim().length >= 2);

        if (debounceRef.current) clearTimeout(debounceRef.current);

        if (value.trim().length >= 2) {
            debounceRef.current = setTimeout(() => {
                dispatch(verifyCustomer({ q: value.trim(), page: 1, limit: 10, enquiryId }));
            }, 400);
        }
    };

    const handleClose = () => setIsOpen(false);

    const handleDone = () => {
        if (isSubmitting) return;
        if (selectedCustomer) {
            dispatch(linkCorporateCustomer({
                enquiryId,
                customerId: selectedCustomer.id,
                onSuccess: handleClose
            }));
        } else {
            handleClose();
        }
    };

    const handleDeleteMapping = () => {
        if (isSubmitting) return;
        dispatch(delinkCorporateCustomer({
            enquiryId,
            onSuccess: () => {
                dispatch(fetchCorporateEnquirySummaryList({ ...(seatId && { seatId }) }));
                handleClose();
            }
        }));
    };

    return (
        <Popup
            isOpen={isOpen}
            title={t('customer')}
            titleMain={t('verification')}
            size="md"
            maxW="550px"
            closeButton
            onOpenChange={setIsOpen}
        >
            <VStack align="stretch" spacing={4} px={4} pb={6} pt={2}>
                <Box>
                    <Text fontSize="sm" color="gray.800" mb={2} fontWeight="medium">
                        {t('existingCustomerName', 'Existing Customer Name')} *
                    </Text>
                    <InputGroup
                        endElement={
                            isLoading
                                ? <Spinner size="sm" color="#8D0247" />
                                : <SearchIcon color="gray.500" width="20px" height="20px" />
                        }
                        width="100%"
                    >
                        <Input
                            height="45px"
                            placeholder={t('searchHere', 'Search here')}
                            borderRadius="md"
                            border="1px solid"
                            borderColor="gray.400"
                            _placeholder={{ color: 'gray.400' }}
                            value={searchText}
                            onChange={handleSearchChange}
                        />
                    </InputGroup>
                </Box>

                {/* Initial mapped customer style */}
                {!hasSearched && selectedCustomer?.isAutoMapped && (
                    <Box border="1px solid" borderColor="gray.200" borderRadius="md" bg="white" boxShadow="sm">
                        <Box px={4} py={3} bg="#FFF5F9" borderColor="gray.100" borderRadius="md">
                            <HStack justify="space-between" align="flex-start">
                                <HStack spacing={2} align="flex-start" flex={1}>
                                    {AddressNewIcon && (
                                        <Box pt="2px" flexShrink={0}>
                                            <AddressNewIcon width="18px" height="18px" style={{ color: '#8D0247' }} />
                                        </Box>
                                    )}
                                    <VStack align="stretch" spacing={1} flex={1}>
                                        <Text fontSize="sm" fontWeight="semibold" color="#232F50" lineHeight="short">
                                            {selectedCustomer.name}
                                        </Text>
                                    </VStack>
                                </HStack>
                                <HStack spacing={3} flexShrink={0} align="center">
                                    <Box color="#8D0247">
                                        <BsCheckCircle style={{ width: '18px', height: '18px' }} />
                                    </Box>
                                    <Box
                                        color="red.500"
                                        cursor="pointer"
                                        onClick={handleDeleteMapping}
                                        _hover={{ color: 'red.700' }}
                                    >
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="3 6 5 6 21 6"></polyline>
                                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                            <line x1="10" y1="11" x2="10" y2="17"></line>
                                            <line x1="14" y1="11" x2="14" y2="17"></line>
                                        </svg>
                                    </Box>
                                </HStack>
                            </HStack>
                        </Box>
                    </Box>
                )}

                {/* Results list — address/location style */}
                {hasSearched && customerList.length > 0 && (
                    <Box
                        border="1px solid"
                        borderColor="gray.200"
                        borderRadius="md"
                        maxH="260px"
                        overflowY="auto"
                        bg="white"
                        boxShadow="sm"
                    >
                        {customerList.map((customer, index) => {
                            const isSelected = selectedCustomer?.id === customer?.id;
                            return (
                                <Box
                                    key={customer?.id ?? index}
                                    px={4}
                                    py={3}
                                    cursor="pointer"
                                    bg={isSelected ? '#FFF5F9' : 'white'}
                                    borderBottom={index < customerList.length - 1 ? '1px solid' : 'none'}
                                    borderColor="gray.100"
                                    _hover={{ bg: '#FFF5F9' }}
                                    onClick={() => setSelectedCustomer(customer)}
                                >
                                    <HStack justify="space-between" align="flex-start">
                                        <HStack spacing={2} align="flex-start" flex={1}>
                                            {AddressNewIcon && (
                                                <Box pt="2px" flexShrink={0}>
                                                    <AddressNewIcon width="18px" height="18px" style={{ color: '#8D0247' }} />
                                                </Box>
                                            )}
                                            <VStack align="stretch" spacing={1} flex={1}>
                                                <Text fontSize="sm" fontWeight="semibold" color="#232F50" lineHeight="short">
                                                    {customer?.name || '-'}
                                                </Text>

                                                {customer?.address && (
                                                    <Text fontSize="xs" color="gray.500" lineHeight="short">
                                                        {customer.address}{customer?.pinCode ? `, ${customer.pinCode}` : ''}
                                                    </Text>
                                                )}

                                                <HStack spacing={3} flexWrap="wrap">
                                                    {customer?.mobile && (
                                                        <HStack spacing={1}>
                                                            {MobileNewIcon && (
                                                                <MobileNewIcon width="12px" height="12px" style={{ color: '#8D0247' }} />
                                                            )}
                                                            <Text fontSize="xs" color="gray.600">
                                                                {customer.mobile}
                                                            </Text>
                                                        </HStack>
                                                    )}
                                                    {customer?.email && (
                                                        <HStack spacing={1}>
                                                            {NewEmailIcon && (
                                                                <NewEmailIcon width="12px" height="12px" style={{ color: '#8D0247' }} />
                                                            )}
                                                            <Text fontSize="xs" color="gray.600">
                                                                {customer.email}
                                                            </Text>
                                                        </HStack>
                                                    )}
                                                </HStack>
                                            </VStack>
                                        </HStack>

                                        {isSelected && (
                                            <Box color="#8D0247" flexShrink={0}>
                                                <BsCheckCircle style={{ width: '18px', height: '18px' }} />
                                            </Box>
                                        )}
                                    </HStack>
                                </Box>
                            );
                        })}
                    </Box>
                )}

                {/* No results */}
                {!isLoading && hasSearched && searchText.trim().length >= 2 && customerList.length === 0 && (
                    <Text fontSize="md" color="black">
                        {t('noExistingCustomer', 'No existing customer found.')}{' '}
                        <Text as="span" color="#8D0247" fontWeight="medium" cursor="pointer" onClick={() => {
                            setIsOpen(false);
                            router.navigate({ to: '/app/corporate/customers/create-customer', search: { enquiryId } });
                        }}>
                            {t('addNewCustomer', 'Add New Customer')}
                        </Text>
                    </Text>
                )}

                {/* Default hint */}
                {hasSearched && searchText.trim().length < 2 && customerList.length === 0 && (
                    <Text fontSize="sm" color="gray.500">
                        {t('typeToSearch', 'Type at least 2 characters to search for existing customers.')}
                    </Text>
                )}

                <HStack justify="flex-end" spacing={4} mt={2}>
                    <Button
                        variant="outline"
                        borderColor="#8D0247"
                        color="#8D0247"
                        px={8}
                        py={2}
                        h="45px"
                        borderRadius="full"
                        onClick={handleClose}
                    >
                        <BsXCircle style={{ marginRight: '8px', width: '24px', height: '24px' }} />
                        {t('cancel')}
                    </Button>
                    <Button
                        variant="solid"
                        bg="#8D0247"
                        color="white"
                        px={8}
                        py={2}
                        h="45px"
                        borderRadius="full"
                        _hover={{ bg: '#700138' }}
                        isDisabled={!selectedCustomer || isSubmitting}
                        disabled={isSubmitting}
                        onClick={handleDone}
                    >
                        {isSubmitting && <Spinner size='xs' style={{ marginRight: '8px' }} />}
                        {t('done')}
                        <BsCheckCircle style={{ marginLeft: '8px', width: '24px', height: '24px' }} />
                    </Button>
                </HStack>
            </VStack>
        </Popup>
    );
};

export default CustomerMappingPopup;
