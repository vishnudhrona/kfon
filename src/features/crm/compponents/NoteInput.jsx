import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, Flex, FormController, HStack, Icons, Menu, Text, useForm } from "@kfonbss/bss-ui-components";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { LuX } from "react-icons/lu";

import { Close, Save } from "@/components/custom";
import { successToast } from "@/components/custom/Toast";
import Toggle from "@/components/custom/Toggle";

import AttachmentPopup from "../popup/AttachmentPopup";
import { ticketCommentValidation } from "../validation";

const { BoldCirclePlusIcon, TicketConvertIcon } = Icons;

const NoteInput = ({
    visibilityPermission,
    uploadTicketDocument,
    uploadedFiles,
    clearUploadedFiles,
    deleteAttachment,
    isFileUploading,
    setNote,
    setFileId,
    isInternal,
    setIsInternal,
    isMovedToRightTop,
    onTogglePosition
}) => {
    const { t } = useTranslation();

    const [isAddingMode, setIsAddingMode] = useState(false);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [popupType, setPopupType] = useState('Document');
    const [showAttachment, setShowAttachment] = useState(false);

    const { control, formState: { errors }, handleSubmit, reset } = useForm({
        mode: 'onChange',
        resolver: yupResolver(ticketCommentValidation(t))
    });

    const handleMenuClick = (type) => {
        setPopupType(type);
        setIsPopupOpen(true);
    };

    const handleRemove = (fileId) => {
        if (fileId && deleteAttachment) {
            deleteAttachment(fileId);
        }
    };

    const handlePopupSubmit = (file) => {
        const payload = { file: file };
        uploadTicketDocument(payload);
    };

    const handleSave = (commentData) => {
        const fileIds = uploadedFiles?.map(f => f.fileId) || [];
        setNote(commentData?.remarks);
        setFileId(fileIds);
        successToast({
            title: t('noteAdded'),
            description: t('noteAddedSuccessfully')
        });
    };

    useEffect(() => {
        if (isMovedToRightTop) {
            setIsAddingMode(true);
        }
    }, [isMovedToRightTop]);

    return (
        <>
            <Box
                mt={isMovedToRightTop ? "0px" : "auto"}
                w={isMovedToRightTop ? "calc(50% - 34px)" : "full"}
                position={isMovedToRightTop ? "absolute" : "static"}
                top={isMovedToRightTop ? "24px" : "auto"}
                right={isMovedToRightTop ? "17px" : "auto"}
                zIndex={isMovedToRightTop ? 1000 : 1}
            >
                <AnimatePresence>
                    <motion.div
                        initial={false}
                        animate={{
                            backgroundColor: "white",
                            padding: isAddingMode ? "24px" : "8px 16px",
                            borderRadius: "8px",
                            boxShadow: isMovedToRightTop ? "0 4px 20px rgba(0, 0, 0, 0.15)" : "0 0 4px 0 rgba(0, 0, 0, 0.05)",
                            marginTop: isAddingMode && !isMovedToRightTop ? "20px" : "10px"
                        }}
                        transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                        style={{ overflow: "hidden", cursor: isAddingMode ? "default" : "pointer" }}
                        onClick={() => !isAddingMode && setIsAddingMode(true)}
                    >
                        {isAddingMode ? (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Box spacing={2} display={'flex'} flexDirection={'row'} alignItems={'center'} gap={2} justifyContent='flex-end' mb={2}>
                                    <Toggle
                                        checked={isInternal}
                                        onChange={(checked) => setIsInternal(checked)}
                                        checkedText={visibilityPermission?.find(p => p.name?.toUpperCase() === 'INTERNAL')?.name || 'Internal'}
                                        uncheckedText={visibilityPermission?.find(p => p.name?.toUpperCase() === 'EXTERNAL')?.name || 'External'}
                                        size="sm"
                                        textColor={'var(--chakra-colors-gray-200)'}
                                    />
                                    <Box cursor={'pointer'} onClick={(e) => {
                                        e.stopPropagation();
                                        onTogglePosition();
                                    }}>
                                        {isMovedToRightTop ? (
                                            <LuX size={24} color={'black'} />
                                        ) : (
                                            <TicketConvertIcon boxSize={6} color={'black'} />
                                        )}
                                    </Box>
                                </Box>

                                <FormController
                                    name='remarks'
                                    placeholder={t('enterNoteHere')}
                                    control={control}
                                    errors={errors}
                                    type="textArea"
                                    border={'none'}
                                    required
                                    rows={5}
                                    resize="none"
                                    _focus={{ ring: 0, border: 'none' }}
                                />

                                {showAttachment && uploadedFiles?.length > 0 && (
                                    <Flex flexWrap="wrap" gap={4} mb={5} pt={2}>
                                        {uploadedFiles?.map((f, idx) => (
                                            <Box key={idx} position="relative">
                                                <Flex bg="#F8F8F8" height={'27px'} width={'136px'} p={2} borderRadius="11px" alignItems="center">
                                                    <Text fontSize="14px" color="primary.500" maxW="120px" fontWeight={400} whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis">
                                                        {f.name}
                                                    </Text>
                                                </Flex>
                                                <Box
                                                    as="button"
                                                    position="absolute"
                                                    top="-6px"
                                                    right="-6px"
                                                    color="primary.500"
                                                    bg="white"
                                                    border={'1.5px solid'}
                                                    borderRadius="full"
                                                    onClick={() => handleRemove(f?.fileId)}
                                                    display="flex"
                                                    alignItems="center"
                                                    justifyContent="center"
                                                    _hover={{ transform: 'scale(1.1)' }}
                                                    transition="all 0.2s"
                                                    p={'2px'}
                                                >
                                                    <LuX size={"10px"} strokeWidth={3} />
                                                </Box>
                                            </Box>
                                        ))}
                                    </Flex>
                                )}

                                <Flex alignItems={'center'} justifyContent={'space-between'} mt={4}>
                                    <Box spacing={4} display={'flex'} flexDirection={'row'} alignItems={'center'} gap={4} mb={0}>
                                        <Menu.Root positioning={{ placement: 'top-start' }}>
                                            <Menu.Trigger asChild>
                                                <Button
                                                    bg={'none'}
                                                    p={0}
                                                    h={"32px"}
                                                    minW="auto"
                                                    _hover={{ bg: 'none', opacity: 0.8 }}
                                                    _active={{ bg: 'none' }}
                                                >
                                                    <BoldCirclePlusIcon color={'primary.500'} fontSize="24px" boxSize={"30px"} />
                                                </Button>
                                            </Menu.Trigger>
                                            <Menu.Positioner>
                                                <Menu.Content bg='white' borderRadius='md' boxShadow='0 4px 20px rgba(0,0,0,0.08)' py={2} zIndex={100} minW='140px'>
                                                    <Menu.Item onClick={() => handleMenuClick('Document')} p="10px 16px" _hover={{ bg: 'gray.50' }} cursor="pointer">{t('document')}</Menu.Item>
                                                    <Menu.Item onClick={() => handleMenuClick('Video')} p="10px 16px" _hover={{ bg: 'gray.50' }} cursor="pointer">{t('video')}</Menu.Item>
                                                    <Menu.Item onClick={() => handleMenuClick('Image')} p="10px 16px" _hover={{ bg: 'gray.50' }} cursor="pointer">{t('image')}</Menu.Item>
                                                </Menu.Content>
                                            </Menu.Positioner>
                                        </Menu.Root>
                                    </Box>

                                    <HStack spacing={3}>
                                        <Button
                                            variant="outline"
                                            height={'36px'}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setIsAddingMode(false);
                                                setIsInternal(true);
                                                if (isMovedToRightTop) {
                                                    onTogglePosition();
                                                }
                                                reset({
                                                    remarks: ''
                                                });
                                            }}
                                        >
                                            <Close /> {t('close')}
                                        </Button>
                                        <Button
                                            height={'36px'}
                                            variant={'outline'}
                                            onClick={handleSubmit(handleSave)}
                                        >
                                            {t('save')} <Save color={'primary.500'} />
                                        </Button>
                                    </HStack>
                                </Flex>
                            </motion.div>
                        ) : (
                            <Flex alignItems="center" justifyContent={'center'} gap={3}>
                                <BoldCirclePlusIcon color={'primary.500'} fontSize="24px" boxSize={"30px"} />
                                <Box flex={1}>
                                    <FormController
                                        name='remarks'
                                        control={control}
                                        errors={errors}
                                        type="textArea"
                                        border={'none'}
                                        required
                                        rows={1}
                                        resize="none"
                                        placeholder={t('enterNoteHere')}
                                        _focus={{ ring: 0, border: 'none' }}
                                    />
                                </Box>
                                <Button
                                    height={'36px'}
                                    onClick={handleSubmit(handleSave)}
                                    variant={'outline'}
                                >
                                    {t('save')} <Save color={'primary.500'} />
                                </Button>
                            </Flex>
                        )}
                    </motion.div>
                </AnimatePresence>
            </Box>

            <AttachmentPopup
                isOpen={isPopupOpen}
                onClose={(isSubmit) => {
                    setIsPopupOpen(false);
                    if (!isSubmit) {
                        clearUploadedFiles();
                        setShowAttachment(false);
                    }
                }}
                setShowAttachment={setShowAttachment}
                type={popupType}
                onSubmit={handlePopupSubmit}
                uploadedFiles={uploadedFiles}
                deleteAttachment={deleteAttachment}
                isUploading={isFileUploading}
            />
        </>
    );
};

export default NoteInput;
