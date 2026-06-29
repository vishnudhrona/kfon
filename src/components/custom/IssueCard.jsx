import { Badge, Box, Button, Divider, Flex, HStack, Icons, Text, Tooltip, VStack } from "@kfonbss/bss-ui-components";
import { useNavigate } from "@tanstack/react-router";
import { get } from "lodash-es";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import { MENU_KEYS, PERMISSIONS } from "@/constants/permissions";
import { forwardTicket, pinTicket, reopenTicket } from "@/features/crm/action";
import ComplaintTracking from "@/features/public/pages/enquiryForms/popup/ComplaintTracking";
import { formatDisplayDate, formatDisplayTime } from "@/utils/dateUtils";

import TableActionMenu from "./TableActionMenu";
import { successToast, warningToast } from "./Toast";

const priorityConfig = (priority) => {
    switch (priority) {
        case "Instant": return { bg: "#fcebeb", borderColor: "#f87171", color: "#dc2626" };
        case "Medium": return { bg: "#fdf9e2", borderColor: "#ca8a04", color: "#ca8a04" };
        case "High": return { bg: "#fff4e6", borderColor: "#f97316", color: "#ea580c" };
        default: return { bg: "#ECF5ED", borderColor: "#22c55e", color: "#16a34a" };
    }
};

const statusConfig = (status) => {
    switch (status) {
        case "Open": return { bg: "#e6f3f5", borderColor: "#01889F", color: "#01889F" };
        case "Closed": return { bg: "#ECF5ED", borderColor: "#22c55e", color: "#16a34a" };
        default: return { bg: "#FFF3E5", borderColor: "#f97316", color: "#ea580c" };
    }
};

const PriorityBadge = ({ priority }) => {
    const cfg = priorityConfig(priority);
    return (
        <Badge
            px={3} py={1} borderRadius="full"
            bg={cfg.bg} border={`1px solid ${cfg.borderColor}`}
            display="inline-flex" alignItems="center" gap={1}
            textTransform="none" whiteSpace="nowrap" flexShrink={0}
        >
            <Box w="7px" h="7px" borderRadius="full" bg={cfg.color} flexShrink={0} />
            <Text fontSize="12px" fontWeight="600" color={cfg.color} lineHeight="1">{priority}</Text>
        </Badge>
    );
};

const StatusBadge = ({ status }) => {
    const cfg = statusConfig(status);
    return (
        <Badge
            px={4} py={1} borderRadius="full"
            bg={cfg.bg} border={`1px solid ${cfg.borderColor}`}
            textTransform="none" whiteSpace="nowrap" flexShrink={0}
        >
            <Text fontSize="13px" fontWeight="600" color={cfg.color} lineHeight="1">{status?.toUpperCase()}</Text>
        </Badge>
    );
};

const AnimatedDetails = ({ isExpanded, children }) => {
    const ref = useRef(null);
    const [height, setHeight] = useState(0);

    useEffect(() => {
        if (!ref.current) return;
        if (isExpanded) {
            const h = ref.current.scrollHeight;
            setHeight(h);
        } else {
            setHeight(0);
        }
    }, [isExpanded]);

    return (
        <div
            style={{
                height: `${height}px`,
                overflow: "hidden",
                transition: "height 0.25s ease"
            }}
        >
            <div ref={ref}>{children}</div>
        </div>
    );
};

const IssueCard = ({ data, onOpen, isExpandOnly = false, allExpanded = false, border, noSerialKey = true, viewType, isPinned = false, pinnedCount = 0 }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state) => get(state['authentication'], 'loginDetails.data'));
    const { t } = useTranslation();
    const [expandedIndices, setExpandedIndices] = useState(new Set());
    const [showTrackPopup, setShowTrackPopup] = useState(false);
    const [selectedTicketId, setSelectedTicketId] = useState(null);
    const { UpArrowIcon, DownArrowIcon, PinIcon, CurveIcon, RouteMapIcon } = Icons;

    useEffect(() => {
        if (allExpanded) {
            setExpandedIndices(new Set(data?.map((_, i) => i)));
        } else {
            setExpandedIndices(new Set());
        }
    }, [allExpanded, data]);

    const toggleExpand = (index, e) => {
        e.stopPropagation();
        setExpandedIndices(prev => {
            const next = new Set(prev);
            next.has(index) ? next.delete(index) : next.add(index);
            return next;
        });
    };

    const handleSubscriberClick = (subscriberUuid, ticket, e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
            e.nativeEvent?.stopImmediatePropagation?.();
        }
        
        navigate({
            to: '/app/crm/ticket-list/subscriber-details/$subscriberId',
            params: { subscriberId: subscriberUuid },
            search: { id: ticket?.id },
            state: { ticketId: ticket?.ticketId, ticketSubject: ticket?.subject?.name }
        });
    };

    const handleCopyTicketId = (ticketId, e) => {
        if (e) e.stopPropagation();
        if (ticketId) {
            navigator.clipboard.writeText(ticketId)
                .then(() => {
                    successToast({ description: t("ticketIdCopied", { defaultValue: "Ticket ID copied successfully!" }) });
                })
                .catch((err) => {
                    console.error("Failed to copy!", err);
                });
        }
    };

    return (
        <Box spacing={2} align="stretch">
            {data?.map((item, index) => {
                const isExpanded = isExpandOnly || expandedIndices.has(index);

                return (
                    <Box
                        key={item?.id || index}
                        mb={'12px'}
                        bg={isPinned ? "#FFFCF2" : "white"}
                        border={isPinned ? "1px solid #F1E2AA" : border}
                        borderRadius="8px"
                        p={2}
                        pb={isExpanded ? 4 : 2}
                        boxShadow={isPinned ? "md" : "0 0 4px 0 rgba(0,0,0,0.05)"}
                        cursor={onOpen ? "pointer" : "default"}
                        _hover={onOpen ? { boxShadow: "xs" } : {}}
                        onClick={() => {
                            if (onOpen) onOpen(item);
                        }}
                        position="relative"
                    >
                        {isPinned && (
                            <Box
                                position="absolute"
                                top="-10px"
                                right="-1px"
                            >
                                <CurveIcon boxSize={10} />
                            </Box>
                        )}
                        <HStack align="center" spacing={4} w="100%" position="relative">
                            {noSerialKey && (
                                <Box minW="65px" textAlign="left" pl={2} flexShrink={0} cursor="pointer" onClick={(e) => handleCopyTicketId(item?.ticketId, e)}>
                                    <Text fontSize="14px" fontWeight="700">
                                        {item?.ticketId}
                                    </Text>
                                </Box>
                            )}
                            <Flex w={'full'}>
                                <VStack align="stretch" flex="1" spacing={0} mt={2} minW={0}>
                                    <HStack justify="space-between" w="100%" align={{ base: 'flex-start', '2xl': 'center' }} minW={0}>
                                        <VStack flex="1" align="stretch" spacing={{ base: 2, '2xl': 0 }} minW={0} mr={4} pt={{ base: 1, '2xl': 0 }}>
                                            <HStack align="center" spacing={0} flex="1" minW={0}>
                                                {!noSerialKey && (
                                                    <Text bg={'#FFDE74'} borderRadius={'4px'} px={2} py={1} fontSize={'14px'} fontWeight={600} mr={{ base: 2, '2xl': 0 }} cursor="pointer" onClick={(e) => handleCopyTicketId(item?.ticketId, e)}>{t("id")}: {item?.ticketId}</Text>
                                                )}
                                                <HStack spacing={1} flexShrink={1} minW={0}>
                                                    <Text fontSize="14px" fontWeight="400" color="gray.700" whiteSpace="nowrap">{t("createdBy")}:</Text>
                                                    <Text fontSize="14px" fontWeight="600" color="primary.500" noOfLines={1} flexShrink={1} minW={0}>{item?.customerType === "General Public" ? item?.publicName : item?.createdByUser}</Text>
                                                </HStack>

                                                <Divider orientation="vertical" height="16px" borderWidth={1} borderColor="gray.300" flexShrink={0} mx={{ base: 2, '2xl': 0 }} />

                                                {isExpanded ? (
                                                    <HStack spacing={0} align="center">
                                                        <HStack spacing={1} flexShrink={0}>
                                                            <Text fontSize="14px" fontWeight="400" color="gray.700" whiteSpace="nowrap">{t("type")}:</Text>
                                                            <Text fontSize="14px" fontWeight="600" color="primary.500" whiteSpace="nowrap">{item?.customerType}</Text>
                                                        </HStack>
                                                        {item?.partnerName && (
                                                            <>
                                                                <Divider orientation="vertical" height="16px" borderWidth={1} borderColor="gray.200" flexShrink={0} mx={{ base: 2, '2xl': 0 }} />
                                                                <HStack spacing={1} flexShrink={0}>
                                                                    <Text fontSize="14px" fontWeight="400" color="gray.700" whiteSpace="nowrap">{t("name")}:</Text>
                                                                    <Text fontSize="14px" fontWeight="600" color="primary.500" whiteSpace="nowrap">{item?.partnerName}</Text>
                                                                </HStack>
                                                            </>
                                                        )}

                                                        {item?.mobileNumber && (
                                                            <>
                                                                <Divider orientation="vertical" height="16px" borderWidth={1} borderColor="gray.200" flexShrink={0} mx={{ base: 2, '2xl': 0 }} />
                                                                <HStack spacing={1} flexShrink={0}>
                                                                    <Text fontSize="14px" fontWeight="400" color="gray.700" whiteSpace="nowrap">{t("phone")}:</Text>
                                                                    <Text fontSize="14px" fontWeight="600" color="primary.500" whiteSpace="nowrap">{item?.mobileNumber}</Text>
                                                                </HStack>
                                                            </>
                                                        )}

                                                        {item?.subscriberUserName && (
                                                            <>
                                                                <Divider orientation="vertical" height="16px" borderWidth={1} borderColor="gray.200" flexShrink={0} mx={{ base: 2, '2xl': 0 }} />
                                                                <HStack spacing={1} flexShrink={0}>
                                                                    <Text fontSize="14px" fontWeight="400" color="gray.700" whiteSpace="nowrap">{t("userName")}:</Text>
                                                                    <Text
                                                                        fontSize="14px"
                                                                        fontWeight="600"
                                                                        color="primary.500"
                                                                        whiteSpace="nowrap"
                                                                        cursor={"pointer"}
                                                                        textDecoration={item?.subscriberUuid ? "underline" : "none"}
                                                                        _hover={item?.subscriberUuid ? { color: "primary.600" } : {}}
                                                                        onClick={(e) => handleSubscriberClick(item?.subscriberUuid, item, e)}
                                                                    >{item?.subscriberUserName}</Text>
                                                                </HStack>
                                                            </>
                                                        )}
                                                    </HStack>
                                                ) : (
                                                    <HStack spacing={0} align="center" flexShrink={1} minW={0}>
                                                        <Text fontSize="15px" fontWeight="700" color="black" noOfLines={1} flexShrink={1} minW={0}>
                                                            {item?.subject?.name}
                                                        </Text>
                                                        {item?.priority !== null && (
                                                            <>
                                                                <Divider orientation="vertical" height="16px" borderWidth={1} borderColor="gray.200" flexShrink={0} mx={2} />
                                                                <PriorityBadge priority={item?.priority} />
                                                            </>
                                                        )}

                                                        <HStack display={{ base: 'none', '2xl': 'flex' }} spacing={0} align="center" flexShrink={1} minW={0}>
                                                            <Divider orientation="vertical" height="16px" borderWidth={1} borderColor="gray.200" flexShrink={0} mx={2} />
                                                            <Text fontSize="14px" fontWeight="400" color="gray.700" noOfLines={1} flexShrink={1} minW={0}>
                                                                {item?.subjectResolve}
                                                            </Text>
                                                        </HStack>
                                                    </HStack>
                                                )}
                                            </HStack>

                                            <HStack display={{ base: isExpanded ? 'none' : 'flex', '2xl': 'none' }} spacing={3} align="center" minW={0}>
                                                <HStack spacing={1} flexShrink={0}>
                                                    <Button
                                                        size='sm'
                                                        variant='plain'
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setSelectedTicketId(item?.ticketId);
                                                            setShowTrackPopup(true);
                                                        }}
                                                        p={0}
                                                        w='24px'
                                                        minW='auto'
                                                        title={t('trackEnquiry')}
                                                    >
                                                        <RouteMapIcon size={6} color='primary.500' />
                                                    </Button>
                                                    <Text fontSize="14px" fontWeight="400" color="gray.700" whiteSpace="nowrap">{t("submittedDate")}:</Text>
                                                    {item?.submitDate ? (
                                                        <HStack spacing={2}>
                                                            <Text fontSize="12px" fontWeight="600" color="gray.800" whiteSpace="nowrap">
                                                                {formatDisplayDate(item.submitDate)}
                                                            </Text>
                                                            <Text fontSize="12px" fontWeight="600" color="gray.800" whiteSpace="nowrap">
                                                                {formatDisplayTime(item.submitDate)}
                                                            </Text>
                                                        </HStack>
                                                    ) : (
                                                        <Text fontSize="12px" fontWeight="600">-</Text>
                                                    )}
                                                </HStack>

                                                <HStack spacing={0} align="center" flexShrink={1} minW={0}>
                                                    <Divider orientation="vertical" height="16px" borderWidth={1} borderColor="gray.300" flexShrink={0} mr={{ base: 2, '2xl': 0 }} />
                                                    <Text fontSize="14px" fontWeight="400" color="gray.700" noOfLines={1} flexShrink={1} minW={0}>
                                                        {item?.subjectResolve}
                                                    </Text>
                                                </HStack>
                                            </HStack>
                                        </VStack>

                                        <HStack spacing={3} align={{ base: 'flex-start', '2xl': 'center' }} flexShrink={0} pt={{ base: 1, '2xl': 0 }}>
                                            <HStack display={{ base: isExpanded ? 'flex' : 'none', '2xl': 'flex' }} spacing={1} flexShrink={0}>
                                                {noSerialKey && (
                                                    <Button
                                                        size='sm'
                                                        variant='plain'
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setSelectedTicketId(item?.ticketId);
                                                            setShowTrackPopup(true);
                                                        }}
                                                        p={0}
                                                        w='24px'
                                                        minW='auto'
                                                        title={t('trackEnquiry')}
                                                    >
                                                        <RouteMapIcon size={6} color='primary.500' />
                                                    </Button>
                                                )}
                                                <Text fontSize="14px" fontWeight="400" color="gray.700" whiteSpace="nowrap">{t("submittedDate")}:</Text>
                                                {item?.submitDate ? (
                                                    <HStack spacing={2}>
                                                        <Text fontSize="12px" fontWeight="600" color="gray.800" whiteSpace="nowrap">
                                                            {formatDisplayDate(item.submitDate)}
                                                        </Text>
                                                        <Text fontSize="12px" fontWeight="600" color="gray.800" whiteSpace="nowrap">
                                                            {formatDisplayTime(item.submitDate)}
                                                        </Text>
                                                    </HStack>
                                                ) : (
                                                    <Text fontSize="12px" fontWeight="600">-</Text>
                                                )}
                                            </HStack>

                                            {!isExpanded && <StatusBadge status={item?.status} />}

                                        </HStack>
                                    </HStack>

                                    <AnimatedDetails isExpanded={isExpanded}>
                                        <Flex w="100%" pt={4} align={{ base: 'flex-start', '2xl': 'center' }} justify="space-between">
                                            <VStack flex="1" align="flex-start" spacing={{ base: 3, '2xl': 0 }} minW={0} overflow="hidden">
                                                <HStack w="100%" spacing={2} align="center">
                                                    <HStack spacing={1}>
                                                        <Text fontSize="14px" fontWeight="400" color="gray.700" whiteSpace="nowrap">{t("subject")}:</Text>
                                                        <Tooltip content={item?.subject?.name}>
                                                            <Text fontSize="14px" fontWeight="700" color="black" whiteSpace="nowrap" overflow='hidden' textOverflow='ellipsis' maxW={'140px'}>{item?.subject?.name}</Text>
                                                        </Tooltip>
                                                    </HStack>
                                                    {item?.subject?.name === "Others" ? (
                                                        <>
                                                            <Divider orientation="vertical" height="16px" borderWidth={1} borderColor="gray.300" />
                                                            <HStack spacing={1}>
                                                                <Text fontSize="14px" fontWeight="400" color="gray.700" whiteSpace="nowrap">{t("issue")}:</Text>
                                                                <Tooltip content={item?.customerIssue}>
                                                                    <Text fontSize="14px" fontWeight="700" color="black" whiteSpace="nowrap" overflow='hidden' textOverflow='ellipsis' maxW={'140px'}>{item?.customerIssue}</Text>
                                                                </Tooltip>
                                                            </HStack>
                                                        </>
                                                    ) : (
                                                        <Tooltip content={item?.subjectResolve}>
                                                            <Text fontSize="14px" fontWeight="400" color="gray.700" whiteSpace="nowrap" overflow='hidden' textOverflow='ellipsis' maxW={'280px'}>{item?.subjectResolve}</Text>
                                                        </Tooltip>
                                                    )}
                                                </HStack>

                                                <HStack display={{ base: 'flex', '2xl': 'none' }} spacing={4} align="center" mt={1}>
                                                    <Text fontSize="14px" fontWeight="600" color="primary.500" whiteSpace="nowrap">
                                                        {item?.slaStatus === "Delayed" ? t("delayed") : t("onTime")}
                                                    </Text>
                                                    <Divider orientation="vertical" height="16px" borderWidth={1} borderColor="gray.300" mx={2} />
                                                    <HStack spacing={2} align="center">
                                                        <Text fontSize="14px" fontWeight="700" color="#515151" whiteSpace="nowrap">{t("priority")}:</Text>
                                                        <PriorityBadge priority={item?.priority} />
                                                    </HStack>
                                                </HStack>
                                            </VStack>

                                            <HStack display={{ base: 'none', '2xl': 'flex' }} flex="1" justify="center" spacing={4} align="center">
                                                <Text fontSize="14px" fontWeight="600" color="primary.500" whiteSpace="nowrap">
                                                    {item?.slaStatus === "Delayed" ? t("delayed") : t("onTime")}
                                                </Text>
                                                {item?.priority !== null && (
                                                    <>
                                                        <Divider orientation="vertical" height="16px" borderWidth={1} borderColor="gray.300" mx={2} />
                                                        <HStack spacing={2} align="center">
                                                            <Text fontSize="14px" fontWeight="700" color="#515151" whiteSpace="nowrap">{t("priority")}:</Text>
                                                            <PriorityBadge priority={item?.priority} />
                                                        </HStack>
                                                    </>
                                                )}
                                            </HStack>

                                            <HStack flex={{ base: "none", '2xl': "1" }} flexShrink={0} justify="flex-end" spacing={3} align={{ base: 'flex-start', '2xl': 'center' }} pt={{ base: 1, '2xl': 0 }}>
                                                {item?.assignedToName || item?.assignedFromUser ? (
                                                    <>
                                                        <HStack spacing={1}>
                                                            <Text fontSize="14px" fontWeight="400" color="gray.700" whiteSpace="nowrap">
                                                                {item?.takeOver === true
                                                                    ? t("takenOverBy")
                                                                    : (viewType === 'outbox' ? t("forwardedTo") : t("forwardedBy"))}:
                                                            </Text>
                                                            <Text fontSize="12px" fontWeight="600" color="gray.700" whiteSpace="nowrap">
                                                                {item?.takeOver === true
                                                                    ? item?.assignedToName
                                                                    : (viewType === 'outbox' ? item?.assignedToName : item?.assignedFromName)}
                                                            </Text>
                                                        </HStack>
                                                        <Divider orientation="vertical" height="16px" borderWidth={1} borderColor="gray.200" />
                                                    </>
                                                ) : (
                                                    <>
                                                        <Badge
                                                            px={3} py={1} borderRadius="full"
                                                            bg="#EBF8FF" border="1px solid #BEE3F8"
                                                            display="inline-flex" alignItems="center" gap={1}
                                                            textTransform="none" whiteSpace="nowrap" flexShrink={0}
                                                        >
                                                            <Box w="7px" h="7px" borderRadius="full" bg="#2B6CB0" flexShrink={0} />
                                                            <Text fontSize="12px" fontWeight="600" color="#2B6CB0" lineHeight="1">{t("unassigned", { defaultValue: "Unassigned" })}</Text>
                                                        </Badge>
                                                        <Divider orientation="vertical" height="16px" borderWidth={1} borderColor="gray.200" />
                                                    </>
                                                )}
                                                <StatusBadge status={item?.status} />
                                            </HStack>
                                        </Flex>
                                    </AnimatedDetails>
                                </VStack>

                                <Flex justify="center" alignItems="center" gap={1} >
                                    <Flex direction="column" justify={isExpanded ? "space-between" : "flex-start"} align="center" ml={5} pb={isExpanded ? 0 : 0}>
                                        {!isExpandOnly && (
                                            <Button p={0} bg="none" h="auto" minW="auto" flexShrink={0} onClick={(e) => toggleExpand(index, e)}>
                                                {isExpanded ? <UpArrowIcon size={18} color="gray.600" /> : <DownArrowIcon size={18} color="gray.600" />}
                                            </Button>
                                        )}

                                        {isExpanded && noSerialKey && !(item?.status?.toLowerCase() === 'closed' && viewType === 'outbox') && (
                                            <Box onClick={(e) => e.stopPropagation()} mt={2}>
                                                <TableActionMenu
                                                    actionItems={viewType === 'outbox' ? [
                                                        {
                                                            label: 'takeOver',
                                                            onClick: () => {
                                                                const payload = {
                                                                    action: "FORWARD_PLUS",
                                                                    assignedToName: user?.username,
                                                                    assignedToUser: user?.userId,
                                                                    status: item?.status === 'In Progress' ? 'IN_PROGRESS' : item?.status === 'Open' ? 'OPEN' : item?.status === 'Closed' ? 'CLOSED' : item?.status === 'Re Open' ? 'REOPEN' : '',
                                                                    ticketId: item?.id,
                                                                    takeOver: true,
                                                                    onSuccess: () => { }
                                                                };

                                                                dispatch(forwardTicket(payload));
                                                            }
                                                        }
                                                    ] : [
                                                        {
                                                            label: isPinned ? 'unpin' : 'pin',
                                                            onClick: () => {
                                                                if (!isPinned && pinnedCount >= 3) {
                                                                    warningToast({ description: t('youCanOnlyPinUpto') })
                                                                    return;
                                                                }
                                                                dispatch(pinTicket({ ticketId: item.id, isClicked: !isPinned }));
                                                            }
                                                        },
                                                        {
                                                            label: 'Reopen',
                                                            hidden: item?.status?.toLowerCase() !== 'closed',
                                                            permission: PERMISSIONS.TICKET.REOPEN,
                                                            menuKey: MENU_KEYS.TICKET_LIST,
                                                            onClick: () => {
                                                                dispatch(reopenTicket({ ticketId: item.id, status: 'REOPEN', note: '', fileIds: [] }));
                                                            }
                                                        }
                                                    ]}
                                                    row={item}
                                                />
                                            </Box>
                                        )}
                                    </Flex>
                                    {viewType === 'inbox' && noSerialKey && (
                                        isPinned && (
                                            <Box >
                                                <PinIcon boxSize={6} />
                                            </Box>
                                        )
                                    )}
                                </Flex>
                            </Flex>
                        </HStack>
                    </Box>
                );
            })}
            <ComplaintTracking
                open={showTrackPopup}
                setOpen={setShowTrackPopup}
                ticketId={selectedTicketId}
            />
        </Box >
    );
};

export default IssueCard;