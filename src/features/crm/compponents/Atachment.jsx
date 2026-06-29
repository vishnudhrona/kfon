import { Box, Flex, HStack, Image, Popup, Text } from "@kfonbss/bss-ui-components";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { AttachmentIcon, DeleteIcon } from "@/components/custom";

const Attachment = ({ onDelete, attachments }) => {
    const { t } = useTranslation();
    const [selectedImage, setSelectedImage] = useState(null);

    return (
        <>
            {attachments?.attachments?.map((file, index) => (
                <Box
                    key={file?.id || index}
                    bg="gray.100"
                    border="1px solid"
                    borderColor="gray.200"
                    borderRadius="12px"
                    p={4}
                    width={'full'}
                    maxW={'300px'}
                    height={'64px'}
                    mt={2}
                    cursor="pointer"
                    onClick={() => setSelectedImage(file?.fileUrl)}
                    _hover={{ borderColor: 'primary.500' }}
                >
                    <Flex alignItems="center" justifyContent="space-between" h='full'>
                        <HStack gap={3} align="center">
                            <AttachmentIcon />
                            <Text
                                fontSize="14px"
                                fontWeight="600"
                                color="gray.800"
                                lineHeight="shorter"
                                noOfLines={1}
                            >
                                {file?.filePath?.split('/').pop() || "Attachment"}
                            </Text>
                        </HStack>
                        <Box cursor="pointer" onClick={(e) => {
                            e.stopPropagation();
                            onDelete(file?.id);
                        }} p={2} _hover={{ bg: 'gray.200', borderRadius: 'md' }}>
                            <DeleteIcon color={'primary.500'} />
                        </Box>
                    </Flex>
                </Box>
            ))}

            {selectedImage && (
                <Popup
                    isOpen={!!selectedImage}
                    onOpenChange={() => setSelectedImage(null)}
                    title={t('attachmentPreview')}
                    size="xl"
                    closeButton
                >
                    <Box p={4} display="flex" justifyContent="center">
                        <Image
                            src={selectedImage}
                            alt="Attachment Preview"
                            maxH="500px"
                            objectFit="contain"
                        />
                    </Box>
                </Popup>
            )}
        </>
    );
};

export default Attachment;