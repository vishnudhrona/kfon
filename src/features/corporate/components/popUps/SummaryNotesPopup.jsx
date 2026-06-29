import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, FormController, HStack, Icons, Popup, Spinner, Text, useForm, VStack } from '@kfonbss/bss-ui-components';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { DATE_FORMAT } from '@/constants/date';
import { getApiProgress } from '@/features/others/ApiProgress/selectors';
import { dayjs } from '@/utils/dateUtils';

import { ACTION_TYPES, fetchEnquiryNotes, saveNote } from '../../action';
import { getEnquiryNotes } from '../../selector';
import { SummaryNotesSchema } from '../../validation';

const { ForwardArrowIcon, AddCircleIcon, BsXCircle } = Icons;

const INITIAL_COLORS = ['#F1DEEC', '#DFCDE5', '#F3E2C8', '#FEEFC3', '#FCEBB6'];

const getInitials = (name = '') =>
    name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2);

const getInitialColor = (index) => INITIAL_COLORS[index % INITIAL_COLORS.length];

const SummaryNotesPopup = ({ isOpen, setIsOpen, enquiryId }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { data: notes = [], isLoading } = useSelector(getEnquiryNotes);
    const apiProgress = useSelector(getApiProgress);
    const isSubmitting = !!apiProgress[ACTION_TYPES.SAVE_NOTE];
    const isFetching = isLoading || !!apiProgress[ACTION_TYPES.FETCH_ENQUIRY_NOTES];
    const [noteAdded, setNoteAdded] = useState(false);

    const {
        control,
        handleSubmit,
        reset,
        watch,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(SummaryNotesSchema(t)),
        defaultValues: { notes: '' }
    });

    const notesValue = watch('notes');

    useEffect(() => {
        if (isOpen && enquiryId) {
            dispatch(fetchEnquiryNotes({ enquiryId }));
            setNoteAdded(false);
        }
    }, [isOpen, enquiryId, dispatch]);

    const formatDate = (dateStr) => {
        if (!dateStr) return '-';
        const parsed = dayjs(dateStr);
        return parsed.isValid() ? parsed.format(DATE_FORMAT.DATE_TIME) : dateStr;
    };

    const handleClose = () => {
        reset();
        setNoteAdded(false);
        setIsOpen(false);
    };

    const onSubmit = (data) => {
        if (isSubmitting) return;
        dispatch(saveNote({
            enquiryId,
            remarks: data.notes,
            onSuccess: () => {
                reset();
                setNoteAdded(true);
                dispatch(fetchEnquiryNotes({ enquiryId }));
            }
        }));
    };

    const handleDone = () => {
        if (isSubmitting) return;
        const trimmed = (notesValue || '').trim();
        if (trimmed) {
            // textarea has content — save then close
            handleSubmit((data) => {
                dispatch(saveNote({
                    enquiryId,
                    remarks: data.notes,
                    onSuccess: () => {
                        reset();
                        setNoteAdded(true);
                        dispatch(fetchEnquiryNotes({ enquiryId }));
                        handleClose();
                    }
                }));
            })();
        } else if (noteAdded) {
            // note was saved this session — close without validation
            handleClose();
        } else {
            // nothing saved and textarea empty — trigger validation
            handleSubmit(onSubmit)();
        }
    };

    return (
        <Popup
            isOpen={isOpen}
            title={t('summary')}
            titleMain={t('notes')}
            size="lg"
            maxW={{ base: '90%', md: '700px', lg: '800px' }}
            closeButton
            onOpenChange={setIsOpen}
        >
            <Box px={2} pb={6} mt={-2}>
                <Box bg="#F8F8F8" p={4} borderRadius="md" minH="300px" maxH="450px" display="flex" flexDirection="column">
                    {isFetching ? (
                        <HStack justify="center" py={8}>
                            <Spinner size="md" color="#8D0247" />
                        </HStack>
                    ) : notes.length === 0 ? (
                        <VStack flex={1} justify="center" py={8}>
                            <Text fontSize="sm" color="gray.400">{t('noRecordsFound')}</Text>
                        </VStack>
                    ) : (
                        <VStack
                            align="stretch"
                            spacing={4}
                            overflowY="auto"
                            flex={1}
                            minH={0}
                            mb={4}
                            css={{ '&::-webkit-scrollbar': { display: 'none' }, scrollbarWidth: 'none' }}
                        >
                            {notes.map((note, idx) => (
                                <Box key={note.id ?? idx} p={4} borderRadius="md" border="1px solid" borderColor="gray.100" bg="white" boxShadow="sm">
                                    <HStack align="start" justify="space-between" mb={2}>
                                        <HStack spacing={3} align="center">
                                            <Box w="40px" h="40px" borderRadius="full" bg={getInitialColor(idx)} display="flex" alignItems="center" justifyContent="center">
                                                <Text fontWeight="semibold" color="#C2A060">{getInitials(note.userName ?? '')}</Text>
                                            </Box>
                                            <Box>
                                                <Text fontWeight="semibold" fontSize="md" color="gray.800">{note.userName ?? '-'}</Text>
                                                <Text fontSize="sm" color="gray.400">{note.designation ?? note.roleName ?? '-'}</Text>
                                            </Box>
                                        </HStack>
                                        <Text fontSize="xs" color="gray.500">{formatDate(note.createdAt)}</Text>
                                    </HStack>
                                    <Text fontSize="sm" color="gray.800" fontWeight="medium" pl={12}>
                                        {note.remarks ?? '-'}
                                    </Text>
                                </Box>
                            ))}
                        </VStack>
                    )}

                    <Box position="relative">
                        <FormController
                            name="notes"
                            placeholder={t('enterRemarks')}
                            control={control}
                            errors={errors}
                            type="textArea"
                            textAreaProps={{
                                resize: 'none',
                                h: '80px',
                                minH: '80px',
                                bg: 'white',
                                borderRadius: 'md',
                                border: 'none',
                                boxShadow: '0px 1px 7px 0px #8D024738',
                                py: 3,
                                px: 4,
                                pr: '40px',
                                _placeholder: { verticalAlign: 'top', color: 'gray.400' },
                                verticalAlign: 'top'
                            }}
                        />
                        <Box position="absolute" bottom="12px" right="12px" cursor="pointer" color="#8D0247" onClick={handleSubmit(onSubmit)}>
                            <AddCircleIcon width="24px" height="24px" />
                        </Box>
                    </Box>
                </Box>

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

export default SummaryNotesPopup;
