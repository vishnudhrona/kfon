import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, Flex, FormController, HStack, Icons, Input, InputGroup, Popup, Spinner, Text, useForm, VStack } from '@kfonbss/bss-ui-components';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { SearchIcon } from '@/components/custom';
import { STORAGE_KEYS } from '@/constants';
import { DATE_FORMAT } from '@/constants/date';
import { getApiProgress } from '@/features/others/ApiProgress/selectors';
import { dayjs } from '@/utils/dateUtils';
import { getTokenData } from '@/utils/encryptionUtils';
import { validation } from '@/utils/validationUtils';

import {
    ACTION_TYPES,
    clearNextStepUsers,
    fetchEnquiryNotes,
    fetchNextStepUsers,
    forwardNextStep,
    saveNote
} from '../../action';
import { getEnquiryNotes, getNextStepUsers } from '../../selector';
import { RemarksSchema } from '../../validation';

const { ForwardArrowIcon, AddCircleIcon, BsXCircle } = Icons;

const INITIAL_COLORS = ['#F1DEEC', '#DFCDE5', '#F3E2C8', '#FEEFC3', '#FCEBB6'];

const getInitials = (name = '') =>
    name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2);

const getInitialColor = (index) => INITIAL_COLORS[index % INITIAL_COLORS.length];

const CheckIcon = (props) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
);

const ForwardPopup = ({ isOpen, setIsOpen, enquiryId }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const { data: stageUsers = [], workflowTypeName } = useSelector(getNextStepUsers);
    const { data: notes = [], isLoading: notesLoading } = useSelector(getEnquiryNotes);

    const apiProgress = useSelector(getApiProgress);
    const usersLoading = !!apiProgress[ACTION_TYPES.FETCH_NEXT_STEP_USERS];
    const isSubmitting = !!apiProgress[ACTION_TYPES.FORWARD_NEXT_STEP];
    const isSavingNote = !!apiProgress[ACTION_TYPES.SAVE_NOTE];

    const { pleaseSelect } = validation(t);
    const remarksSchema = RemarksSchema(t);

    const { control, handleSubmit, reset, watch, setValue, setError, clearErrors, formState: { errors } } = useForm({
        resolver: yupResolver(remarksSchema),
        defaultValues: { remarks: '', userId: null }
    });

    const watchedUser = watch('userId');
    const watchedUserId = watchedUser?.id ?? watchedUser ?? '';

    const [userError, setUserError] = useState('');
    const [userSearch, setUserSearch] = useState('');
    const [noteAdded, setNoteAdded] = useState(false);

    const userOptions = useMemo(
        () =>
            (stageUsers || []).map((u) => {
                const seatName = u?.name ?? '';
                const empName = u?.empName ?? '';
                const label = seatName && empName ? `${empName} (${seatName})` : empName || seatName || u?.id;
                return {
                    id: u?.id,
                    name: label,
                    seatName,
                    empName,
                    nextStepCode: u?.nextStepCode ?? '',
                    nextStepName: u?.nextStepName ?? '',
                    raw: u
                };
            }),
        [stageUsers]
    );

    useEffect(() => {
        if (!isOpen || !enquiryId) return;

        dispatch(fetchEnquiryNotes({ enquiryId }));
        dispatch(fetchNextStepUsers({ enquiryId }));
    }, [isOpen, enquiryId, dispatch]);

    const handleAddRemark = (data) => {
        if (isSavingNote) return;
        dispatch(saveNote({
            enquiryId,
            remarks: data.remarks,
            onSuccess: () => {
                reset({ remarks: '', userId: watchedUser });
                setNoteAdded(true);
                dispatch(fetchEnquiryNotes({ enquiryId }));
            }
        }));
    };

    const handleClose = () => {
        setUserError('');
        setUserSearch('');
        setNoteAdded(false);
        reset();
        dispatch(clearNextStepUsers());
        setIsOpen(false);
    };

    const handleDone = () => {
        if (isSubmitting) return;
        if (!watchedUserId) {
            setUserError(pleaseSelect('user'));
            return;
        }
        setUserError('');
        if (!noteAdded && !watch('remarks')?.trim()) {
            setError('remarks', { message: t('remarksRequired') });
            return;
        }
        clearErrors('remarks');
        const selectedUser = userOptions.find((u) => u.id === watchedUserId);
        const seat = selectedUser?.raw || {};
        const tokenData = getTokenData(STORAGE_KEYS.AUTH_TOKEN);
        const currentRole = tokenData?.roles?.[0]?.name ?? tokenData?.role?.[0]?.name ?? '';
        dispatch(forwardNextStep({
            enquiryId,
            actionRole: currentRole,
            remarks: watch('remarks'),
            nextStepCode: selectedUser?.nextStepCode ?? '',
            toSeatId: seat?.id ?? selectedUser?.id ?? '',
            toSeatName: seat?.name ?? selectedUser?.seatName ?? '',
            toUserId: null,
            toUserName: null,
            onSuccess: handleClose
        }));
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '-';
        const parsed = dayjs(dateStr);
        return parsed.isValid() ? parsed.format(DATE_FORMAT.DATE_TIME) : dateStr;
    };

    const selectUser = (id) => {
        if (watchedUserId === id) {
            setValue('userId', null);
            return;
        }
        const opt = userOptions.find((u) => u.id === id);
        setValue('userId', opt || null);
    };

    const filteredUsers = userSearch
        ? userOptions.filter((u) =>
            (u.name ?? '').toLowerCase().includes(userSearch.toLowerCase()) ||
            (u.empName ?? '').toLowerCase().includes(userSearch.toLowerCase()) ||
            (u.seatName ?? '').toLowerCase().includes(userSearch.toLowerCase())
        )
        : userOptions;

    return (
        <Popup
            isOpen={isOpen}
            title={t('forward')}
            titleMain={workflowTypeName || ''}
            size="xl"
            maxW={{ base: '90%', md: '900px', lg: '1000px' }}
            closeButton
            onOpenChange={(open) => (open ? setIsOpen(true) : handleClose())}
        >
            <Box px={2} pb={6} mt={-2}>
                <HStack align="stretch" spacing={6} w="full" h="410px">
                    {/* Left Column: Notes List + Remark Input */}
                    <Flex flex={1} direction="column" bg="#F8F8F8" p={2} borderRadius="md" h="full" gap={4}>
                        <Box flex={1} overflowY="auto" css={{ '&::-webkit-scrollbar': { display: 'none' }, scrollbarWidth: 'none' }}>
                            {notesLoading ? (
                                <HStack justify="center" py={6}><Spinner size="md" color="#8D0247" /></HStack>
                            ) : notes.length === 0 ? (
                                <Flex h="full" align="center" justify="center">
                                    <Text fontSize="sm" color="gray.400" textAlign="center">{t('noRecordsFound')}</Text>
                                </Flex>
                            ) : (
                                <VStack align="stretch" spacing={4}>
                                    {[...notes]
                                        .sort((a, b) => dayjs(b.createdAt).valueOf() - dayjs(a.createdAt).valueOf())
                                        .slice(0, 2)
                                        .map((note, idx) => (
                                            <Box key={note.id ?? idx} p={4} borderRadius="md" border="1px solid" borderColor="gray.100" bg="white" h="122px" display="flex" flexDirection="column">
                                                <HStack align="start" justify="space-between" mb={2} flexShrink={0}>
                                                    <HStack spacing={3} align="center">
                                                        <Box w="40px" h="40px" borderRadius="full" bg={getInitialColor(idx)} display="flex" alignItems="center" justifyContent="center">
                                                            <Text fontWeight="bold" color="#C2A060">{getInitials(note.userName ?? '')}</Text>
                                                        </Box>
                                                        <Box>
                                                            <Text fontWeight="bold" fontSize="md" color="gray.800">{note.userName ?? '-'}</Text>
                                                            <Text fontSize="xs" color="gray.400">{note.roleName ?? '-'}</Text>
                                                        </Box>
                                                    </HStack>
                                                    <Text fontSize="xs" color="gray.500">{formatDate(note.createdAt)}</Text>
                                                </HStack>
                                                <Box flex={1} overflowY="auto" css={{ '&::-webkit-scrollbar': { display: 'none' }, scrollbarWidth: 'none' }}>
                                                    <HStack spacing={3} align="start">
                                                        <Box w="40px" flexShrink={0} />
                                                        <Text fontSize="md" color="gray.800" fontWeight="medium">
                                                            {note.remarks ?? '-'}
                                                        </Text>
                                                    </HStack>
                                                </Box>
                                            </Box>
                                        ))}
                                </VStack>
                            )}
                        </Box>

                        <Box position="relative" flexShrink={0}>
                            <FormController
                                name="remarks"
                                placeholder={t('enterRemarks')}
                                control={control}
                                errors={errors}
                                type="textArea"
                                border="none"
                                boxShadow="0px 1px 7px 0px #8D024738"
                                height={"160px"}
                            />
                            <Box
                                position="absolute"
                                bottom={errors.remarks ? "40px" : "16px"}
                                right="16px"
                                cursor="pointer"
                                color="#8D0247"
                                zIndex={2}
                                onClick={handleSubmit(handleAddRemark)}
                            >
                                <AddCircleIcon width="24px" height="24px" />
                            </Box>
                        </Box>
                    </Flex>

                    {/* Right Column: Users List */}
                    <Flex flex={1} border="1px solid #E7E7E7" borderRadius="md" p={2} direction="column" h="full" position="relative">
                        <Flex direction="column" h="full" gap={4}>
                            <Flex direction="column" flex={1} bg="#F8F8F8" borderRadius="md" p={3} overflow="hidden">
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

                                <Box flex={1} overflowY="auto" mt={3} css={{ '&::-webkit-scrollbar': { display: 'none' }, scrollbarWidth: 'none' }}>
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
                                                const isSelected = watchedUserId === userId;
                                                const empName = u.empName || u.seatName || '';
                                                const seatLine = u.seatName ?? '';
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
                                                        onClick={() => selectUser(userId)}
                                                    >
                                                        <HStack spacing={3}>
                                                            <Box w="40px" h="40px" borderRadius="full" bg={getInitialColor(idx)} display="flex" alignItems="center" justifyContent="center">
                                                                <Text fontWeight="semibold" color="#C2A060">{getInitials(empName)}</Text>
                                                            </Box>
                                                            <Box>
                                                                <Text fontWeight="semibold" fontSize="md" color="gray.800">{empName}</Text>
                                                                <Text fontSize="sm" color={isSelected ? 'teal.700' : 'gray.500'}>{seatLine}</Text>
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
                                                            onClick={(e) => { e.stopPropagation(); selectUser(userId); }}
                                                        >
                                                            {isSelected && <CheckIcon style={{ marginRight: '6px' }} />}
                                                            {isSelected ? t('selected') : t('selectBtn')}
                                                        </Button>
                                                    </HStack>
                                                );
                                            })}
                                        </VStack>
                                    )}
                                </Box>
                            </Flex>
                        </Flex>
                        <Text position="absolute" bottom="8px" right="8px" visibility={userError ? 'visible' : 'hidden'} fontSize="xs" color="red.500" h="14px" lineHeight="1">
                            {userError || pleaseSelect('user')}
                        </Text>
                    </Flex>
                </HStack>

                <HStack justify="flex-end" spacing={4} mt={6}>
                    <Button variant="outline" borderColor="#8D0247" color="#8D0247" px={8} py={2} h="45px" borderRadius="full" onClick={handleClose}>
                        <BsXCircle style={{ marginRight: '8px', width: '24px', height: '24px' }} /> {t('cancel')}
                    </Button>
                    <Button variant="solid" bg="#8D0247" color="white" px={8} py={2} h="45px" borderRadius="full" _hover={{ bg: '#700138' }} onClick={handleDone} disabled={isSubmitting}>
                        {isSubmitting && <Spinner size='xs' style={{ marginRight: '8px' }} />}
                        {t('forward')} <ForwardArrowIcon style={{ marginLeft: '8px', width: '24px', height: '24px' }} />
                    </Button>
                </HStack>
            </Box>
        </Popup>
    );
};

export default ForwardPopup;
