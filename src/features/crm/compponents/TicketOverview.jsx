import { Box, Button, Flex, HStack, Image, Span, Text, VStack } from "@kfonbss/bss-ui-components";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaExpand } from "react-icons/fa6";
import { connect } from "react-redux";

import noAttachment from '@/assets/landingPage/NoAttachment.png';
import { BackwardBackIcon, ForwardFrontIcon, NavigateIcon, RouterImageIcon } from "@/components/custom";
import { errorToast } from "@/components/custom/Toast";

import { fetchVisibilityPermission, submitComment, uploadTicketDocument } from "../action";
import TicketForward from "../popup/TicketForward";
import { getAttachment, getVisibilityPermission } from "../selector";
import Movements from "./Movements";

const TicketOverview = ({ isOpen, onClose, data, fetchVisibilityPermission, visibilityPermission, submitComment, uploadTicketDocument, attachments, viewType }) => {
    const { t } = useTranslation();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isTicketOpen, setIsTicketOpen] = useState(false);
    const [displayedAttachments, setDisplayedAttachments] = useState([]);
    const [displayType, setDisplayType] = useState('image');
    const [pdfUrl, setPdfUrl] = useState(null);
    const [csvContent, setCsvContent] = useState(null);
    const [isPdfLoading, setIsPdfLoading] = useState(false);
    const [note, setNote] = useState("");
    const [fileId, setFileId] = useState([])
    const [isInternal, setIsInternal] = useState(false);
    const [isMovedToRightTop, setIsMovedToRightTop] = useState(false);

    useEffect(() => {
        if (!isOpen) {
            setIsMovedToRightTop(false);
        }
    }, [isOpen]);

    useEffect(() => {
        fetchVisibilityPermission();
    }, [isOpen, fetchVisibilityPermission]);

    useEffect(() => {
        setCurrentImageIndex(0);
        const movements = attachments?.movements || [];
        const allImages = movements.flatMap(m => m.imageUrl || []);
        setDisplayedAttachments(allImages);
        setDisplayType('image');
    }, [data?.id, attachments]);

    const handleSelectAttachments = (files, type) => {
        setDisplayedAttachments(files || []);
        setDisplayType(type);
        setCurrentImageIndex(0);
        setPdfUrl(null);
    };

    useEffect(() => {
        let objectUrl = null;
        const fetchContent = async () => {
            const fileId = displayedAttachments[currentImageIndex]?.fileId;
            if (displayType === 'document' && fileId) {
                setIsPdfLoading(true);
                const fileName = fileId.split('/').pop().split('?')[0].toLowerCase();
                const extension = fileName.split('.').pop();

                try {
                    const response = await fetch(fileId);
                    if (!response.ok) throw new Error('Failed to fetch document');

                    if (extension === 'pdf') {
                        const blob = await response.blob();
                        objectUrl = URL.createObjectURL(blob);
                        setPdfUrl(objectUrl);
                        setCsvContent(null);
                    } else if (extension === 'csv') {
                        const text = await response.text();
                        setCsvContent(text);
                        setPdfUrl(null);
                    } else {
                        setPdfUrl(null);
                        setCsvContent(null);
                    }
                } catch (error) {
                    console.error('Error loading document content:', error);
                    setPdfUrl(null);
                    setCsvContent(null);
                } finally {
                    setIsPdfLoading(false);
                }
            } else {
                setPdfUrl(null);
                setCsvContent(null);
            }
        };

        fetchContent();

        return () => {
            if (objectUrl) {
                URL.revokeObjectURL(objectUrl);
            }
        };
    }, [displayType, currentImageIndex, displayedAttachments]);

    const handleNextImage = () => {
        if (displayedAttachments.length > 0) {
            setCurrentImageIndex((prev) => (prev + 1) % displayedAttachments.length);
        }
    };

    const handlePrevImage = () => {
        if (displayedAttachments.length > 0) {
            setCurrentImageIndex((prev) => (prev - 1 + displayedAttachments.length) % displayedAttachments.length);
        }
    };

    if (!isOpen) return null;

    return (
        <>
            <Flex bg="white" overflow="hidden" gap={3} h={'full'} position="relative">
                <Movements
                    data={data}
                    attachments={attachments}
                    visibilityPermission={visibilityPermission}
                    onClose={onClose}
                    submitComment={submitComment}
                    uploadTicketDocument={uploadTicketDocument}
                    onSelectAttachments={handleSelectAttachments}
                    setNote={setNote}
                    setFileId={setFileId}
                    viewType={viewType}
                    isInternal={isInternal}
                    setIsInternal={setIsInternal}
                    isMovedToRightTop={isMovedToRightTop}
                    onTogglePosition={() => setIsMovedToRightTop(!isMovedToRightTop)}
                />

                <Box w="50%" bg="white" p={'24px 28px 65px 28px'} position="relative" border="1px solid #C7C7C7" borderRadius="8px" h="full">
                    <Flex
                        h="full"
                        alignItems="center"
                        justifyContent="center"
                        bg="gray.50"
                        borderRadius="lg"
                        position="relative"
                    >
                        {displayedAttachments.length > 0 ? (
                            <>
                                {displayType === 'image' && (
                                    <Image
                                        src={displayedAttachments[currentImageIndex]?.fileId}
                                        alt={`Attachment ${currentImageIndex + 1}`}
                                        maxH="40vh"
                                        objectFit="contain"
                                        borderRadius="md"
                                        fallbackSrc="https://via.placeholder.com/800x600?text=Image+Not+Found"
                                        cursor="pointer"
                                        onClick={() => window.open(displayedAttachments[currentImageIndex]?.fileId, '_blank')}
                                    />
                                )}

                                {displayType === 'video' && (
                                    <Box as="video" controls src={displayedAttachments[currentImageIndex]?.fileId} maxH="40vh" w="full" borderRadius="md" />
                                )}

                                {displayType === 'document' && (
                                    <VStack spacing={2} w="full" h="full" align="center" justify="center">
                                        <Button
                                            as="a"
                                            href={displayedAttachments[currentImageIndex]?.fileId}
                                            target="_blank"
                                            h={'32px'}
                                            color="primary.500"
                                            bg={'none'}
                                            mt={1}
                                            alignSelf="flex-end"
                                        >
                                            <FaExpand />
                                        </Button>
                                        <Box flex="1" w="full" position="relative" borderRadius="md" overflow="hidden" border="1px solid #E2E8F0" bg="white">
                                            {isPdfLoading ? (
                                                <Flex h="full" align="center" justify="center">
                                                    <Span>{t('loading')}...</Span>
                                                </Flex>
                                            ) : pdfUrl ? (
                                                <iframe
                                                    src={`${pdfUrl}#view=Fit&toolbar=0&navpanes=0&scrollbar=0`}
                                                    width="100%"
                                                    height="100%"
                                                    style={{ border: 'none', display: 'block' }}
                                                    title="PDF Preview"
                                                    scrolling="no"
                                                />
                                            ) : csvContent ? (
                                                <Box p={4} overflow="auto" h="full" bg="white" whiteSpace="pre-wrap" fontSize="12px" color="gray.700" textAlign="left" w="full">
                                                    {csvContent}
                                                </Box>
                                            ) : (
                                                <Flex direction="column" align="center" justify="center" h="full" p={6} bg="gray.50">
                                                    <RouterImageIcon boxSize={"80px"} color="primary.500" />
                                                    <Text mt={4} fontWeight="600" color="gray.800" textAlign="center" fontSize="16px" noOfLines={2}>
                                                        {displayedAttachments[currentImageIndex]?.fileId?.split('/').pop()?.split('?')[0] || t('document')}
                                                    </Text>
                                                    <Text mt={2} fontSize="12px" color="gray.500">{t('noDirectPreviewAvailable')}</Text>
                                                </Flex>
                                            )}
                                        </Box>
                                    </VStack>
                                )}

                                {displayedAttachments.length > 1 && (
                                    <Box
                                        position="absolute"
                                        left={4}
                                        onClick={handlePrevImage}
                                        cursor="pointer"
                                        bg="whiteAlpha.800"
                                        _hover={{ bg: "white" }}
                                        borderRadius="full"
                                        p={2}
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="center"
                                    >
                                        <ForwardFrontIcon />
                                    </Box>
                                )}

                                {displayedAttachments.length > 1 && (
                                    <Box
                                        position="absolute"
                                        right={4}
                                        onClick={handleNextImage}
                                        cursor="pointer"
                                        bg="whiteAlpha.800"
                                        _hover={{ bg: "white" }}
                                        borderRadius="full"
                                        p={2}
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="center"
                                    >
                                        <BackwardBackIcon />
                                    </Box>
                                )}
                            </>
                        ) : (
                            <Image
                                src={noAttachment}
                                alt="BSS Internet Service"
                                objectFit='contain'
                                maxW={{ base: '280px', lg: '450px' }}
                                w='100%'
                                h='auto'
                            />
                        )}
                        {displayedAttachments.length > 1 && (
                            <HStack
                                position="absolute"
                                bottom={4}
                                spacing={2}
                            >
                                {displayedAttachments.map((_, index) => (
                                    <Box
                                        key={index}
                                        w={currentImageIndex === index ? "10px" : "8px"}
                                        h={currentImageIndex === index ? "10px" : "8px"}
                                        borderRadius="full"
                                        bg={currentImageIndex === index ? "maroon" : "gray.300"}
                                        cursor="pointer"
                                        onClick={() => setCurrentImageIndex(index)}
                                        transition="all 0.2s"
                                        _hover={{ bg: currentImageIndex === index ? "maroon" : "gray.400" }}
                                    />
                                ))}
                            </HStack>
                        )}
                    </Flex>
                    {viewType === 'inbox' && data?.status?.toLowerCase() !== 'closed' && (
                        <Button
                            position="absolute"
                            bottom={2}
                            right={6}
                            onClick={() => {
                                if (!note) {
                                    errorToast({ description: t('pleaseAddNote') })
                                    return;
                                }
                                setIsTicketOpen(true)
                            }}
                        >
                            <NavigateIcon />
                            <Span fontSize="18px" fontWeight="500">{t('actions')}</Span>
                        </Button>
                    )}
                </Box>
            </Flex>

            <TicketForward isOpen={isTicketOpen} setIsOpen={setIsTicketOpen} ticketId={data?.id} currentStatus={data?.status} note={note} fileId={fileId} visibility={isInternal ? 'INTERNAL' : 'EXTERNAL'} />
        </>
    );
};
const mapStateToProps = (state) => ({
    visibilityPermission: getVisibilityPermission(state),
    attachments: getAttachment(state)
})

const mapDispatchToProps = {
    fetchVisibilityPermission,
    submitComment,
    uploadTicketDocument
}

export default connect(mapStateToProps, mapDispatchToProps)(TicketOverview);