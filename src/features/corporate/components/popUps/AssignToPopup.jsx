import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, Flex, FormController, HStack, Icons, Input, InputGroup, Popup, Spinner, Text, useForm, VStack } from '@kfonbss/bss-ui-components';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { SearchIcon } from '@/components/custom';
import { getApiProgress } from '@/features/others/ApiProgress/selectors';
import { validation } from '@/utils/validationUtils';

import { ACTION_TYPES, assignEnquiry, assignEnquiryMultiple, fetchForwardRoles, fetchRoleUsers } from '../../action';
import { getForwardRoles, getForwardRoleUsers } from '../../selector';
import { RemarksSchema } from '../../validation';

const { ForwardArrowIcon, BsXCircle } = Icons;

const CheckIcon = (props) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
);

const RadioCheckedIcon = () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="10" cy="10" r="9" stroke="#8D0247" strokeWidth="2" />
        <circle cx="10" cy="10" r="5" fill="#8D0247" />
    </svg>
);

const RadioUncheckedIcon = () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="10" cy="10" r="9" stroke="#8A92A6" strokeWidth="2" />
    </svg>
);

const INITIAL_COLORS = ['#F1DEEC', '#DFCDE5', '#F3E2C8', '#FEEFC3', '#FCEBB6'];

const getInitials = (name = '') =>
    name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2);

const getInitialColor = (index) => INITIAL_COLORS[index % INITIAL_COLORS.length];

const AssignToPopup = ({ isOpen, setIsOpen, enquiryId, locationIds = [], onSuccess }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const { data: roles = [], isLoading: rolesLoading } = useSelector(getForwardRoles);
    const { data: roleUsers = [], isLoading: usersLoading } = useSelector(getForwardRoleUsers);

    const apiProgress = useSelector(getApiProgress);
    const isSubmitting = !!(apiProgress[ACTION_TYPES.ASSIGN_ENQUIRY] || apiProgress[ACTION_TYPES.ASSIGN_ENQUIRY_MULTIPLE]);
    const isFetching = !!(apiProgress[ACTION_TYPES.FETCH_FORWARD_ROLES] || apiProgress[ACTION_TYPES.FETCH_ROLE_USERS]);

    const { pleaseSelect } = validation(t);

    const { control, reset, watch, setValue, formState: { errors } } = useForm({
        resolver: yupResolver(RemarksSchema(t)),
        defaultValues: { roleId: '' }
    });

    const watchedRole = watch('roleId');
    const watchedRoleId = watchedRole?.id ?? watchedRole;

    const [selectedUserId, setSelectedUserId] = useState('');
    const [userError, setUserError] = useState('');
    const [userSearch, setUserSearch] = useState('');
    const [assignType, setAssignType] = useState('individual');

    useEffect(() => {
        if (isOpen) {
            dispatch(fetchForwardRoles());
            dispatch(fetchRoleUsers({}));
        }
    }, [isOpen, dispatch]);

    useEffect(() => {
        if (watchedRoleId) {
            setSelectedUserId('');
            dispatch(fetchRoleUsers({ roleId: watchedRoleId }));
        }
    }, [watchedRoleId, dispatch]);

    const handleClose = () => {
        setSelectedUserId('');
        setUserError('');
        setUserSearch('');
        setAssignType('individual');
        reset();
        setIsOpen(false);
    };

    const handleDone = () => {
        if (isSubmitting) return;
        if (!selectedUserId) {
            setUserError(pleaseSelect('user'));
            return;
        }
        setUserError('');
        const selectedUser = roleUsers.find((u) => u.id === selectedUserId);
        const selectedRole = roles.find((r) => r.id === watchedRoleId);
        const cb = () => { handleClose(); onSuccess?.(); };
        if (assignType === 'individual') {
            dispatch(assignEnquiry({
                enquiryId,
                locationIds,
                seatId: selectedUser?.seatId ?? '',
                seatName: selectedUser?.seatName ?? '',
                toUserId: selectedUserId,
                toUserName: selectedUser?.name ?? '',
                roleId: watchedRoleId,
                roleName: selectedRole?.roleName ?? selectedRole?.name ?? '',
                remarks: '',
                onSuccess: cb
            }));
        } else {
            dispatch(assignEnquiryMultiple({
                assignments: locationIds.length > 0
                    ? locationIds.map((locationId) => ({
                        enquiryId,
                        locationId,
                        seatId: selectedUser?.seatId ?? '',
                        seatName: selectedUser?.seatName ?? '',
                        toUserId: selectedUserId,
                        toUserName: selectedUser?.name ?? '',
                        roleId: watchedRoleId,
                        roleName: selectedRole?.roleName ?? selectedRole?.name ?? ''
                    }))
                    : [{
                        enquiryId,
                        locationId: '',
                        seatId: selectedUser?.seatId ?? '',
                        seatName: selectedUser?.seatName ?? '',
                        toUserId: selectedUserId,
                        toUserName: selectedUser?.name ?? '',
                        roleId: watchedRoleId,
                        roleName: selectedRole?.roleName ?? selectedRole?.name ?? ''
                    }],
                remarks: '',
                onSuccess: cb
            }));
        }
    };

    const filteredUsers = userSearch
        ? roleUsers.filter((u) => (u.name ?? '').toLowerCase().includes(userSearch.toLowerCase()))
        : roleUsers;

    return (
        <Popup
            isOpen={isOpen}
            title={t('enquiry')}
            titleMain={t('assignTo')}
            size="xl"
            maxW={{ base: '90%', md: '600px' }}
            closeButton
            onOpenChange={setIsOpen}
        >
            <Box px={2} pb={6} mt={-2}>
                {isFetching && (
                    <HStack justify="center" py={2}><Spinner size="md" color="#8D0247" /></HStack>
                )}
                <HStack spacing={6} mb={4} ml={2}>
                    <HStack cursor="pointer" onClick={() => setAssignType('individual')}>
                        {assignType === 'individual' ? <RadioCheckedIcon /> : <RadioUncheckedIcon />}
                        <Text color="#4A5568" fontWeight="medium">{t('individual')}</Text>
                    </HStack>
                    <HStack cursor="pointer" onClick={() => setAssignType('multiple')}>
                        {assignType === 'multiple' ? <RadioCheckedIcon /> : <RadioUncheckedIcon />}
                        <Text color="#4A5568" fontWeight="medium">{t('multiple')}</Text>
                    </HStack>
                </HStack>

                <Flex flex={1} border="1px solid #E7E7E7" borderRadius="md" p={3} direction="column" position="relative">
                    <Flex direction="column" gap={4}>
                        {/* Role Dropdown */}
                        <Box
                            onKeyDown={(e) => {
                                if ((e.key === 'Delete' || e.key === 'Backspace') && watchedRoleId) {
                                    setValue('roleId', '');
                                    setSelectedUserId('');
                                }
                            }}
                        >
                            <FormController
                                name="roleId"
                                labelName={t('role')}
                                type="select"
                                items={roles.map((r) => ({ id: r.id, name: r.roleName || r.name || r.id }))}
                                placeholder={t('choose', { 0: t('role') })}
                                control={control}
                                errors={errors}
                                isLoading={rolesLoading}
                            />
                        </Box>

                        {/* Users List */}
                        {assignType === 'individual' ? (
                            <Flex direction="column" bg="#F8F8F8" borderRadius="md" p={3} overflow="hidden">
                                <InputGroup startElement={<SearchIcon color="gray.400" width="4" height="6" />} width="100%">
                                    <Input
                                        height="40px"
                                        placeholder={t('search')}
                                        borderRadius="md"
                                        bg="white"
                                        value={userSearch}
                                        onChange={(e) => setUserSearch(e.target.value)}
                                    />
                                </InputGroup>

                                <Box mt={3} maxH="300px" overflowY="auto" css={{ '&::-webkit-scrollbar': { display: 'none' }, scrollbarWidth: 'none' }}>
                                    {usersLoading ? (
                                        <HStack justify="center" py={6}><Spinner size="md" color="#8D0247" /></HStack>
                                    ) : filteredUsers.length === 0 ? (
                                        <Text fontSize="sm" color="gray.400" textAlign="center" py={4}>
                                            {t('noRecordsFound')}
                                        </Text>
                                    ) : (
                                        <VStack align="stretch" spacing={3}>
                                            {filteredUsers.map((u, idx) => {
                                                const userId = u.id;
                                                const isSelected = selectedUserId === userId;
                                                const name = u.name ?? '';
                                                const roleInfo = u.seatName ?? '';
                                                return (
                                                    <HStack
                                                        key={userId ?? idx}
                                                        py={3}
                                                        px={3}
                                                        bg={isSelected ? '#E3EFE8' : 'transparent'}
                                                        borderRadius="md"
                                                        justify="space-between"
                                                        align="center"
                                                        cursor="pointer"
                                                        onClick={() => setSelectedUserId(isSelected ? '' : userId)}
                                                    >
                                                        <HStack spacing={3}>
                                                            <Box w="40px" h="40px" borderRadius="full" bg={getInitialColor(idx)} display="flex" alignItems="center" justifyContent="center">
                                                                <Text fontWeight="semibold" color="#C2A060">{getInitials(name)}</Text>
                                                            </Box>
                                                            <Box>
                                                                <Text fontWeight="semibold" fontSize="md" color="gray.800">{name}</Text>
                                                                <Text fontSize="sm" color={isSelected ? 'teal.700' : 'gray.500'}>{roleInfo}</Text>
                                                            </Box>
                                                        </HStack>
                                                        <Button
                                                            bg={isSelected ? '#8D0247' : 'transparent'}
                                                            color={isSelected ? 'white' : '#8D0247'}
                                                            border="1px solid"
                                                            borderColor="#8D0247"
                                                            size="sm"
                                                            h="35px"
                                                            borderRadius="md"
                                                            w={isSelected ? '120px' : '90px'}
                                                            transition="all 0.3s ease-in-out"
                                                            display="flex"
                                                            alignItems="center"
                                                            justifyContent="center"
                                                            _hover={{ bg: isSelected ? '#700138' : 'rgba(141, 2, 71, 0.04)' }}
                                                            onClick={() => setSelectedUserId(isSelected ? '' : userId)}
                                                        >
                                                            {isSelected && <CheckIcon style={{ marginRight: '6px' }} />}
                                                            {isSelected ? t('selected') : t('select')}
                                                        </Button>
                                                    </HStack>
                                                );
                                            })}
                                        </VStack>
                                    )}
                                </Box>
                            </Flex>
                        ) : (
                            <Box bg="#F8F8F8" border="1px solid #E7E7E7" borderRadius="md" p={6} minH="200px" display="flex" alignItems="center" justifyContent="center">
                                <VStack spacing={2} textAlign="center">
                                    <Text fontSize="md" color="#232F50" fontWeight="medium">
                                        {t('assignToResourcesPinCodeText1')}
                                    </Text>
                                    <Text fontSize="lg" color="#8D0247" fontWeight="bold">
                                        {t('assignToResourcesPinCodeText2')}
                                    </Text>
                                </VStack>
                            </Box>
                        )}
                    </Flex>

                    <Text
                        position="absolute"
                        bottom="8px"
                        right="8px"
                        visibility={userError ? 'visible' : 'hidden'}
                        fontSize="xs"
                        color="red.500"
                        h="14px"
                        lineHeight="1"
                    >
                        {userError || pleaseSelect('user')}
                    </Text>
                </Flex>

                <HStack justify="flex-end" spacing={4} mt={6}>
                    <Button variant="outline" borderColor="#8D0247" color="#8D0247" px={8} py={2} h="45px" borderRadius="full" onClick={handleClose}>
                        <BsXCircle style={{ marginRight: '8px', width: '24px', height: '24px' }} /> {t('cancel')}
                    </Button>
                    <Button variant="solid" bg="#8D0247" color="white" px={8} py={2} h="45px" borderRadius="full" _hover={{ bg: '#700138' }} onClick={handleDone} disabled={isSubmitting}>
                        {isSubmitting && <Spinner size='xs' style={{ marginRight: '8px' }} />}
                        {t('done')} <ForwardArrowIcon style={{ marginLeft: '8px', width: '24px', height: '24px' }} />
                    </Button>
                </HStack>
            </Box>
        </Popup>
    );
};

export default AssignToPopup;
