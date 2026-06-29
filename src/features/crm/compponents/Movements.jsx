import { Avatar, Box, Button, Flex, HStack, Icons, Text } from "@kfonbss/bss-ui-components";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import { FaUsersLine } from "react-icons/fa6";
import { LuLock } from "react-icons/lu";
import { connect } from "react-redux";

import { RouterImageIcon, VideoIcon } from "@/components/custom";

import { deleteAttachment, submitComment, uploadTicketDocument } from "../action";
import { getIsFileUploading, getUploadedFiles } from "../selector";
import { actions } from "../slice";
import NoteInput from "./NoteInput";

const { ImageGalleryIcon } = Icons;

const Movements = ({
    data,
    attachments,
    visibilityPermission,
    uploadTicketDocument,
    uploadedFiles,
    clearUploadedFiles,
    deleteAttachment,
    onSelectAttachments,
    isFileUploading,
    setNote,
    setFileId,
    viewType,
    isInternal,
    setIsInternal,
    isMovedToRightTop,
    onTogglePosition
}) => {
    const { t } = useTranslation();

    const movementsList = [...(attachments?.movements || data?.movements || (Array.isArray(attachments) ? attachments : []))].sort((a, b) => dayjs(a.createdDate).unix() - dayjs(b.createdDate).unix());
    return (
        <Flex flexDirection="column" h="full" w="50%" px={'19px'} py={'15px'} bg={'#F8F8F8'} borderRadius="8px">
            <Box
                flex="1"
                overflowY="auto"
                className="hide-scrollbar"
            >
                {movementsList?.filter((item) => item?.note)?.length > 0 && (
                    <Box>
                        {movementsList?.filter((item) => item?.note)?.map((value, index) => (
                            <Flex key={index} gap={5} mt={2} align="center" bg={'white'} p={4} borderRadius={'8px'} boxShadow='0 0 4px 0 rgba(0, 0, 0, 0.05)'>
                                <Box px={2}>
                                    <Text fontSize={'15px'} fontWeight={'600'}>
                                        {String(index + 1).padStart(3, '0')}
                                    </Text>
                                </Box>

                                <Box flex="1" pr={4}>
                                    <Flex alignItems="center" mb={3}>
                                        <Avatar.Root bg={'#F3E2C8'} color={'#bb8d43ff'} size="md" mr={3}>
                                            <Avatar.Fallback name={value?.assignedToName || value?.assignedFromName} />
                                        </Avatar.Root>
                                        <Box flex="1">
                                            <Flex alignItems='center' gap={2}>
                                                <Box>
                                                    <Flex alignItems='center' gap={2}>
                                                        <Text fontSize="14px" fontWeight="600" color="primary.500">
                                                            {value?.assignedFromName}
                                                        </Text>

                                                        {value?.visibility && (
                                                            value.visibility === 'INTERNAL' ? (
                                                                <HStack
                                                                    bg="#FFF3E5"
                                                                    color="primary.500"
                                                                    border="1px solid"
                                                                    borderColor="primary.500"
                                                                    borderRadius="full"
                                                                    px={2}
                                                                    spacing={1}
                                                                    alignItems="center"
                                                                >
                                                                    <LuLock size={10} style={{ flexShrink: 0 }} />
                                                                    <Text fontSize="10px" fontWeight="600">{t('internal')}</Text>
                                                                </HStack>
                                                            ) : (
                                                                <HStack
                                                                    bg="#EBF8FF"
                                                                    color="blue.600"
                                                                    border="1px solid"
                                                                    borderColor="blue.200"
                                                                    borderRadius="full"
                                                                    px={2}
                                                                    spacing={1}
                                                                    alignItems="center"
                                                                >
                                                                    <FaUsersLine size={10} style={{ flexShrink: 0 }} />
                                                                    <Text fontSize="10px" fontWeight="600">{t('external')}</Text>
                                                                </HStack>
                                                            )
                                                        )}
                                                    </Flex>
                                                    <Text fontSize="12px" color="gray.600">
                                                        {value?.assignedToDesignation}
                                                    </Text>
                                                </Box>
                                            </Flex>
                                        </Box>
                                        <HStack>
                                            <Text fontSize="12px" color="gray.600" fontWeight="600">
                                                {value?.createdDate ? dayjs(value.createdDate).format("DD-MM-YYYY") : "-"}
                                            </Text>
                                            <Text fontSize="14px" color="gray.600" fontWeight="600">
                                                {value?.createdDate ? dayjs(value.createdDate).format("hh:mm A") : "-"}
                                            </Text>
                                        </HStack>
                                    </Flex>

                                    <Box mb={3}>
                                        <Text fontSize="14px" fontWeight="400" color="gray.700" lineHeight="24px">
                                            {value?.note}
                                        </Text>
                                    </Box>

                                    <Flex alignItems="center" justifyContent="space-between" mb={1}>
                                        <HStack>
                                            {value?.documentUrl.length > 0 && (
                                                <Button variant="outline" borderRadius='6.457px' p={0} border={'0.807px solid rgba(141, 2, 71, 0.29)'} w={'29px'} h={'29px'} onClick={() => onSelectAttachments(value.documentUrl, 'document')}><RouterImageIcon boxSize={'17px'} /></Button>
                                            )}
                                            {value?.videoUrl.length > 0 && (
                                                <Button variant="outline" borderRadius='6.457px' p={0} border={'0.807px solid rgba(141, 2, 71, 0.29)'} w={'29px'} h={'29px'} onClick={() => onSelectAttachments(value.videoUrl, 'video')}><VideoIcon boxSize={'17px'} /></Button>
                                            )}
                                            {value?.imageUrl.length > 0 && (
                                                <Button variant="outline" borderRadius='6.457px' p={0} border={'0.807px solid rgba(141, 2, 71, 0.29)'} w={'29px'} h={'29px'} onClick={() => onSelectAttachments(value.imageUrl, 'image')}><ImageGalleryIcon boxSize={'17px'} /></Button>
                                            )}
                                        </HStack>
                                        <HStack spacing={2}>
                                            <Text bg={value?.status === "OPEN" ? "#e6f3f5" : value?.status === "CLOSED" ? "#ECF5ED" : "#FFF3E5"} color={value?.status === "OPEN" ? "#01889F" : value?.status === "CLOSED" ? "green.500" : "orange.500"} borderRadius="md" px={2} py={1} fontSize="14px" fontWeight="600">
                                                {value?.status === 'IN_PROGRESS' ? 'IN PROGRESS' : value?.status}
                                            </Text>
                                        </HStack>
                                    </Flex>
                                </Box>
                            </Flex>
                        ))}
                    </Box>
                )}
            </Box>

            {viewType === 'inbox' && data?.status?.toLowerCase() !== 'closed' && (
                <NoteInput
                    data={data}
                    visibilityPermission={visibilityPermission}
                    uploadTicketDocument={uploadTicketDocument}
                    uploadedFiles={uploadedFiles}
                    clearUploadedFiles={clearUploadedFiles}
                    deleteAttachment={deleteAttachment}
                    isFileUploading={isFileUploading}
                    setNote={setNote}
                    setFileId={setFileId}
                    viewType={viewType}
                    isInternal={isInternal}
                    setIsInternal={setIsInternal}
                    isMovedToRightTop={isMovedToRightTop}
                    onTogglePosition={onTogglePosition}
                />
            )}
        </Flex>
    )
}

const mapStateToProps = (state) => ({
    uploadedFiles: getUploadedFiles(state),
    isFileUploading: getIsFileUploading(state)
})

const mapDispatchToProps = {
    clearUploadedFiles: actions.clearUploadedFiles,
    deleteAttachment,
    submitComment,
    uploadTicketDocument
}

export default connect(mapStateToProps, mapDispatchToProps)(Movements);
