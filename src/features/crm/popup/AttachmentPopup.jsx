import { Box, Button, Flex, FormController, HStack, Popup, Text, useForm } from "@kfonbss/bss-ui-components";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { LuX } from 'react-icons/lu';

import { Close, Save } from "@/components/custom";

const AttachmentPopup = ({ isOpen, onClose, type, onSubmit, uploadedFiles, setShowAttachment, deleteAttachment, isUploading }) => {
    const { t } = useTranslation();
    const [selectedFiles, setSelectedFiles] = useState([]);

    const getAcceptTypes = () => {
        if (type === 'Document') return '.pdf,.doc,.docx,.csv';
        if (type === 'Video') return 'video/*';
        if (type === 'Image') return 'image/*';
        return '*/*';
    };

    const { control, formState: { errors }, setValue } = useForm({
        mode: 'onChange',
        defaultValues: {
            file: null
        }
    });

    const prevIsUploading = useRef(false);

    useEffect(() => {
        if (prevIsUploading.current && !isUploading) {
            setSelectedFiles('');
            setValue('file', null);
        }
        prevIsUploading.current = isUploading;
    }, [isUploading, setValue]);

    const handleFileSelect = (file) => {
        if (file) {
            onSubmit(file);
            setSelectedFiles(file.name);
        }
    };

    const handleRemove = (fileId) => {
        if (fileId && deleteAttachment) {
            deleteAttachment(fileId);
        }
    };

    const handlePopupSubmit = () => {
        setSelectedFiles('');
        setShowAttachment(true);
        onClose(true);
    };

    const handleClose = () => {
        setSelectedFiles('');
        onClose(false);
    };

    const isFileTypeMatch = (fileName) => {
        const extension = fileName.split('.').pop().toLowerCase();
        if (type === 'Document') return ['pdf', 'doc', 'docx', 'csv'].includes(extension);
        if (type === 'Video') return ['mp4', 'mov', 'avi', 'mkv', 'webm'].includes(extension);
        if (type === 'Image') return ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'bmp'].includes(extension);
        return true;
    };

    return (
        <Popup
            isOpen={isOpen}
            onOpenChange={handleClose}
            size="md"
            title={
                <HStack fontSize="24px" fontWeight="600">
                    <Text>{t('add', 'Add')}</Text>
                    <Text color="#FD1C7A">{t('attachment', 'Attachment')}</Text>
                </HStack>
            }
        >
            <Box px={5}>
                <FormController
                    placeholder={t('dragAndDropHere')}
                    labelName={t('attachment')}
                    name='file'
                    value={selectedFiles}
                    control={control}
                    errors={errors}
                    type="file"
                    accept={getAcceptTypes()}
                    onFileSelect={handleFileSelect}
                    multipleUpload={false}
                    isLoading={isUploading}
                    required
                />
                <Text fontSize="14px" fontWeight={'400'} color="gray.500" mt={3} mb={5}>
                    {t("noteupload")} {type === 'Document' ? 'CSV, PDF & DOC' : type === 'Video' ? 'Video' : 'Image'} {t("filesizecannotexceed2mb")}
                </Text>

                {uploadedFiles?.length > 0 && (
                    <Flex flexWrap="wrap" gap={4} mb={5} pt={2}>
                        {uploadedFiles?.filter(f => isFileTypeMatch(f.name)).map((f, idx) => (
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

                <Flex justify={'center'} gap={'20px'} mt={'20px'}>
                    <Button variant='outline' onClick={handleClose} h={'45px'} px={8} borderRadius="full" borderColor="primary.500" color="primary.500"><Close />{t('cancel')}</Button>
                    <Button variant='solid' h={'45px'} px={8} borderRadius="full" onClick={handlePopupSubmit} isDisabled={selectedFiles.length === 0} bg="primary.500" _hover={{ bg: 'primary.600' }} color="white"><Save /> {t('submit')} </Button>
                </Flex>
            </Box>
        </Popup>
    )
}

export default AttachmentPopup;