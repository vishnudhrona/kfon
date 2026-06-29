import { Box, Button, Flex, Image, Popup, Spinner, Text, VStack } from "@kfonbss/bss-ui-components";
import { debounce } from "lodash-es";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import noAttachment from '@/assets/landingPage/NoAttachment.png';
import { Close } from "@/components/custom";
import SearchInput from "@/components/custom/SearchInput";
import TrackingCard from "@/features/public/pages/enquiryForms/components/TrackingCard";

import { takeoverSearch } from "../action";
import { getTakeoverSearchData, getTakeoverSearchLoading } from "../selector";
import { actions as crmActions } from "../slice";

const TakeOverPopup = ({ isOpen, setIsOpen }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const [searchQuery, setSearchQuery] = useState('');
    const searchData = useSelector(getTakeoverSearchData);
    const isLoading = useSelector(getTakeoverSearchLoading);

    const debouncedSearch = useMemo(
        () => debounce((value) => {
            if (value.trim().length >= 3) {
                dispatch(takeoverSearch({ search: value.trim() }));
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
        setSearchQuery(value);
        if (value.trim().length === 0) {
            dispatch(crmActions.clearTakeoverSearch());
            debouncedSearch.cancel();
        } else {
            debouncedSearch(value);
        }
    };

    useEffect(() => {
        if (!isOpen) {
            setSearchQuery('');
            dispatch(crmActions.clearTakeoverSearch());
        }
    }, [isOpen, dispatch]);

    const renderResult = () => {
        if (isLoading) {
            return (
                <VStack spacing={4} py={10}>
                    <Spinner size="xl" color="primary.500" thickness="4px" />
                    <Text fontSize="16px" color="gray.500">{t('searching', { defaultValue: 'Searching...' })}</Text>
                </VStack>
            );
        }

        if (searchData && searchData.length > 0) {
            return (
                <VStack align="stretch" spacing={4} w="100%">
                    {searchData.map((item, index) => (
                        <Box key={index} p={4} bg="white" borderRadius="md" boxShadow="sm" border="1px solid" borderColor="gray.200">
                            <TrackingCard attachmentData={item} noBox={true} setIsOpen={setIsOpen} />
                        </Box>
                    ))}
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
                    opacity={searchQuery.length > 0 ? 1 : 0.6}
                />
                <Text fontSize='17px' fontWeight={500} color='#8E8E8E'>
                    {searchQuery.length >= 3 ? t('noDataFound') : t('startTracking', { defaultValue: 'Enter Search Query' })}
                </Text>
                <Text fontSize='12px' color='#8E8E8E' fontWeight={400}>
                    {searchQuery.length >= 3 ? t('pleaseCheckTicketId', { defaultValue: 'Please check your search query and try again' }) : t('pleaseEnterAboveFieldsSearchTrackingId')}
                </Text>
            </VStack>
        );
    };

    return (
        <Popup
            isOpen={isOpen}
            onOpenChange={setIsOpen}
            size='xl'
            placement='center'
            hideCloseButton
            headerProps={{ display: 'none' }}
        >
            <Box bg='white' p={3}>
                <VStack spacing={6} align='stretch'>
                    <Box bg='#FAFAFA' py={8} borderRadius='15px'>
                        <VStack spacing={4} gap={8} align='center'>
                            <Text fontSize='36px' fontWeight={800} color='primary.500' textTransform='uppercase' letterSpacing='-1px'>
                                {t('takeOverTicket')}
                            </Text>
                            <SearchInput
                                width='80%'
                                value={searchQuery}
                                onChange={handleSearch}
                                placeholder={t('searchTicketUserCustomer')}
                            />
                        </VStack>
                    </Box>

                    <Box
                        bg='#FAFAFA'
                        mt={2}
                        borderRadius='15px'
                        minH='400px'
                        maxH={'450px'}
                        overflowY='auto'
                        className='hide-scrollbar'
                        display={(isLoading || !(searchData && searchData.length > 0)) ? 'flex' : 'block'}
                        alignItems='center'
                        justifyContent='center'
                        p={(isLoading || !(searchData && searchData.length > 0)) ? 0 : 4}
                    >
                        {renderResult()}
                    </Box>

                    <Flex justify='flex-end'>
                        <Button
                            variant='outline'
                            h={'40px'}
                            mt={3}
                            onClick={() => setIsOpen(false)}
                        >
                            <Close /> {t('close')}
                        </Button>
                    </Flex>
                </VStack>
            </Box>
        </Popup>
    );
};

export default TakeOverPopup;