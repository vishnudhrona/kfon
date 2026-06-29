import { Avatar, Box, Button, Flex, HStack, Popup, Text, VStack } from "@kfonbss/bss-ui-components";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

import { Close, Save, TickTrueIcon } from "@/components/custom";
import SearchInput from "@/components/custom/SearchInput";

import { fetchUnmappedUser, linkUser } from "../action";
import { getUnmappedUser } from "../selector";

const LinkUser = ({ isOpen, setIsOpen, seatRow, linkUser, fetchUnmappedUser, unmappedUser, isEditMode }) => {
    const { t } = useTranslation();
    const [selectedUser, setSelectedUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');    

    useEffect(() => {
        if (isOpen) {
            fetchUnmappedUser();
        }
    }, [isOpen, fetchUnmappedUser]);

    useEffect(() => {
        if (isEditMode && seatRow?.user) {
            setSelectedUser(seatRow.user);
        } else {
            setSelectedUser(null);
        }
        setSearchTerm('');
    }, [isEditMode, seatRow, isOpen]);

    const handleSelectUser = (user) => {
        setSelectedUser(user);
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredUsers = (unmappedUser || [])
        .filter((u) => {
            const term = searchTerm.toLowerCase();
            return (u.name && u.name.toLowerCase().includes(term));
        })
        .sort((a, b) => (a.name || '').localeCompare(b.name || ''));

    const handleLinkUser = () => {
        const payload = {
            seatId: seatRow?.id,
            seatName: seatRow?.name,
            userId: selectedUser?.id,
            userName: selectedUser?.name,
            active: true,
            onSuccess: () => setIsOpen(false)
        };

        linkUser(payload);
    };
    return (
        <Popup isOpen={isOpen} onClose={() => setIsOpen(false)} title={isEditMode ? t('editLinkUser') : t('linkUser')} size={'md'}>
            <VStack align={'stretch'}>
                <Box borderRadius={'xl'} border={'1px solid #E7E7E7'} px={'27px'} py={'17px'}>
                    <HStack gap={5}>
                        <HStack>
                            <Text fontSize={'16px'} fontWeight={'500'} color={'#43647C'}>{t('seatName')}:</Text>
                            <Text maxWidth={'200px'} fontWeight={'500'} fontSize={'16px'} color={'primary.500'}>{seatRow?.name || seatRow?.seatName || '-'}</Text>
                        </HStack>
                        <HStack>
                            <Text fontSize={'16px'} fontWeight={'500'} color={'#43647C'}>{t('seatCode')}:</Text>
                            <Text fontWeight={'500'} fontSize={'16px'} color={'primary.500'}>{seatRow?.code || seatRow?.seatCode || '-'}</Text>
                        </HStack>
                    </HStack>
                </Box>
                <Box bg={'#F1F6F8'} borderRadius={'xl'} p={3} mt={2}>
                    <SearchInput placeholder={t('search')}
                        width={'full'}
                        border={'1px solid #DEE4ED'}
                        height={'40px'}
                        bg={'white'}
                        onChange={handleSearch}
                        value={searchTerm}
                    />
                    <Box height={'200px'} overflow={'auto'}>
                        {filteredUsers.map((users) => (
                            <Flex key={users.id} justifyContent={'space-between'} mt={5} bg={selectedUser?.id === users.id ? '#D8ECE4' : '  '} borderRadius={'lg'} p={2}>
                                <Flex alignItems={'center'}>
                                    <Avatar.Root bg={'#F3E2C8'} color={'#bb8d43ff'} size="md" mr={3}>
                                        <Avatar.Fallback name={users.name} />
                                    </Avatar.Root>
                                    <Box flex="1">
                                        <Text fontSize="16px" fontWeight="600">
                                            {users.name}
                                        </Text>
                                        <Text fontSize="12px" color="gray.500">
                                            {users.designation}
                                        </Text>
                                    </Box>
                                </Flex>
                                <Button
                                    mt={1}
                                    height={'34px'}
                                    borderRadius={'lg'}
                                    variant={selectedUser?.id === users.id ? 'solid' : 'outline'}
                                    onClick={() => handleSelectUser(users)}
                                >
                                    {selectedUser?.id === users.id ? (
                                        <>
                                            <TickTrueIcon />
                                            {t('selected')}
                                        </>
                                    ) : (
                                        t('btnSelect')
                                    )}
                                </Button>
                            </Flex>
                        ))}
                    </Box>
                </Box>
                <Flex gap={2} justifyContent={'flex-end'} mt={5}>
                    <Button variant={'outline'} height={'40px'} onClick={() => setIsOpen(false)}><Close />{t('cancel')}</Button>
                    <Button onClick={handleLinkUser} height={'40px'}>{isEditMode ? t('update') : t('submit')} <Save /></Button>
                </Flex>
            </VStack>
        </Popup>
    );
};

const mapStateToProps = (state) => ({
    unmappedUser: getUnmappedUser(state)
});

const mapDispatchToProps = {
    fetchUnmappedUser: fetchUnmappedUser,
    linkUser: linkUser
};

export default connect(mapStateToProps, mapDispatchToProps)(LinkUser);
