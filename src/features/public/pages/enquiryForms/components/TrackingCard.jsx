import { Badge, Box, Divider, HStack, Text, Tooltip, VStack } from "@kfonbss/bss-ui-components";
import { get } from "lodash-es";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import TableActionMenu from "@/components/custom/TableActionMenu";
import { forwardTicket } from "@/features/crm/action";
import { formatDisplayDate, formatDisplayTime } from "@/utils/dateUtils";

const statusConfig = (status) => {
    switch (status) {
        case "Open": return { bg: "#e6f3f5", borderColor: "#01889F", color: "#01889F" };
        case "Closed": return { bg: "#ECF5ED", borderColor: "#22c55e", color: "#16a34a" };
        default: return { bg: "#FFF3E5", borderColor: "#f97316", color: "#ea580c" };
    }
};

const TrackingCard = ({ attachmentData, noBox, setIsOpen }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const user = useSelector((state) => get(state['authentication'], 'loginDetails.data'));

    const actionMenus = useMemo(() => {
        return [
            {
                label: 'takeOver',
                onClick: (row) => {
                    const payload = {
                        action: "FORWARD_PLUS",
                        assignedToName: user?.username,
                        assignedToUser: user?.userId,
                        status: row?.status === 'In Progress' ? 'IN_PROGRESS' : row?.status === 'Open' ? 'OPEN' : row?.status === 'Closed' ? 'CLOSED' : row?.status === 'Reopen' ? 'REOPEN' : '',
                        ticketId: row?.id,
                        takeOver: true,
                        onSuccess: () => {
                            if (setIsOpen) {
                                setIsOpen(false);
                            }
                        }
                    };
                    dispatch(forwardTicket(payload));
                }
            }
        ];
    }, [dispatch, setIsOpen, user]);

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

    return (
        <Box>
            {!noBox && <Text color={'primary.500'} fontSize={'16px'} fontWeight={600} mb={2}>{t('ticketDetails')}</Text>}
            <Box
                mb={noBox ? 0 : '12px'}
                bg={noBox ? "transparent" : "white"}
                border={noBox ? 'none' : '1px solid #E8EFF4'}
                borderRadius={noBox ? 0 : "8px"}
                p={noBox ? 0 : 4}
                boxShadow={noBox ? 'none' : "md"}
                borderColor={noBox ? "transparent" : "gray.200"}
                position="relative"
            >
                <VStack spacing={4} w="100%">
                    <HStack justify="space-between" w="100%" align="center">
                        <HStack>
                            <Text bg={'#FFDE74'} borderRadius={'4px'} px={2} py={1} fontSize={'14px'} fontWeight={600}>{t("id")}: {attachmentData?.ticketId}</Text>
                            <HStack spacing={1} flexShrink={0}>
                                <Text fontSize="14px" fontWeight="400" color="gray.700" whiteSpace="nowrap">{t("createdBy")}:</Text>
                                <Text fontSize="14px" fontWeight="600" color="primary.500" whiteSpace="nowrap">{attachmentData?.customerType === "General Public" ? attachmentData?.publicName : attachmentData?.createdByUser}</Text>
                            </HStack>

                            <Divider orientation="vertical" height="16px" borderWidth={1} borderColor="gray.200" flexShrink={0} />
                            <HStack spacing={1} flexShrink={0}>
                                <Text fontSize="14px" fontWeight="400" color="gray.700" whiteSpace="nowrap">{t("phone")}:</Text>
                                <Text fontSize="14px" fontWeight="600" color="primary.500" whiteSpace="nowrap">{attachmentData?.mobileNumber}</Text>
                            </HStack>
                        </HStack>

                        <HStack spacing={1} flexShrink={0}>
                            <Text fontSize="14px" fontWeight="400" color="gray.700" whiteSpace="nowrap">{t("submittedDate")}:</Text>
                            {attachmentData?.submitDate ? (
                                <HStack spacing={2}>
                                    <Text fontSize="12px" fontWeight="600" color="gray.800" whiteSpace="nowrap">
                                        {formatDisplayDate(attachmentData.submitDate)}
                                    </Text>
                                    <Text fontSize="12px" fontWeight="600" color="gray.800" whiteSpace="nowrap">
                                        {formatDisplayTime(attachmentData.submitDate)}
                                    </Text>
                                </HStack>
                            ) : (
                                <Text fontSize="12px" fontWeight="600">-</Text>
                            )}
                        </HStack>
                    </HStack>

                    <HStack justify="space-between" w="100%" align="center">

                        <HStack spacing={1}>
                            <Text fontSize="14px" fontWeight="400" color="gray.700" whiteSpace="nowrap">{t("subject")}:</Text>
                            <Tooltip content={attachmentData?.subject?.name}>
                                <Text fontSize="14px" fontWeight="700" color="black" whiteSpace="nowrap" overflow='hidden' textOverflow='ellipsis' maxW={'140px'}>{attachmentData?.subject?.name}</Text>
                            </Tooltip>
                        </HStack>

                        <HStack spacing={2}>
                            <StatusBadge status={attachmentData?.status} />
                            {noBox && (
                                <Box onClick={(e) => e.stopPropagation()}>
                                    <TableActionMenu actionItems={actionMenus} row={attachmentData} zIndex={1500} />
                                </Box>
                            )}
                        </HStack>
                    </HStack>
                </VStack>
            </Box>
        </Box>
    );

}

export default TrackingCard;