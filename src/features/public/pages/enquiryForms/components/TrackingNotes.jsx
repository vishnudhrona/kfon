import { Badge, Box, Flex, HStack, Icons, Text, Tooltip, VStack } from "@kfonbss/bss-ui-components";
import { useTranslation } from "react-i18next";

import { formatDayMonth, formatFullDisplayDate, formatYearTime } from "@/utils/dateUtils";

const statusConfig = (status) => {
    switch (status) {
        case "OPEN": return { bg: "#e6f3f5", borderColor: "#01889F", color: "#01889F" };
        case "CLOSED": return { bg: "#ECF5ED", borderColor: "#22c55e", color: "#16a34a" };
        default: return { bg: "#FFF3E5", borderColor: "#f97316", color: "#ea580c" };
    }
};

const TrackingNotes = ({ movements }) => {
    const { t } = useTranslation();
    if (!movements || movements.length === 0) return null;

    const { TrackSuccess, TrackFailure, TrackArrowIcon, TrackDateIcon, TrackNoteIcon, UserAdd } = Icons

    const StatusBadge = ({ status }) => {
        const cfg = statusConfig(status);
        return (
            <Badge
                px={4} py={1} borderRadius="full"
                bg={cfg.bg} border={`1px solid ${cfg.borderColor}`}
                textTransform="none" whiteSpace="nowrap" flexShrink={0}
                h={'24px'}
            >
                <Text fontSize="13px" fontWeight="600" color={cfg.color} lineHeight="1">{status === 'IN_PROGRESS' ? 'IN PROGRESS' : status?.toUpperCase()}</Text>
            </Badge>
        );
    };

    const sortedMovements = [...movements].sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
    return (
        <Box mt={2}>
            {sortedMovements.map((movement, index) => {
                const isLast = index === sortedMovements.length - 1;
                const isSuccess = movement.status?.toLowerCase().includes('closed');
                return (
                    <>
                        <HStack gap={8}>
                            <VStack key={index}>
                                {isSuccess ? (
                                    <TrackSuccess boxSize={8} />
                                ) : (
                                    <TrackFailure boxSize={8} />
                                )}

                                <Flex direction="column" alignItems="center">
                                    <Text fontSize="12px" fontWeight={600} color="#232F50">
                                        {formatDayMonth(movement?.createdDate)}
                                    </Text>
                                    <Text fontSize="12px" fontWeight={600} color="#232F50">
                                        {formatYearTime(movement?.createdDate)}
                                    </Text>
                                </Flex>

                                {!isLast && (
                                    <>
                                        <TrackArrowIcon boxSize={14} />
                                    </>
                                )}
                            </VStack>

                            <Box flex="1" bg="#F5F5F5" borderRadius="15px" p={5} mb={isLast ? 0 : 12}>
                                <Flex justifyContent={'space-between'}>
                                    <VStack alignItems="flex-start" gap={5}>
                                        {!isLast ? (
                                            <>
                                                <HStack gap={3}>
                                                    <TrackNoteIcon boxSize={4} />
                                                    <HStack>
                                                        <Text fontSize="13px" color="#292929" fontWeight={400} lineHeight="1.5">
                                                            {t('fileReceived')}
                                                        </Text>

                                                        <Text fontSize="13px" color="primary.500" fontWeight={600} lineHeight="1.5">
                                                            {formatFullDisplayDate(movement?.receivedAt || movement?.createdDate)}
                                                        </Text>
                                                    </HStack>
                                                </HStack>

                                                {(movement?.status === 'CLOSED' || movement?.status === 'REOPEN' || movement?.ticketAction === 'RETURNED' || movement?.assignedToName !== null) && (
                                                    <HStack gap={3}>
                                                        <UserAdd boxSize={4} color={'gray.700'} />
                                                        {movement?.status === 'CLOSED' ? (
                                                            <Flex wrap="wrap" columnGap={1}>
                                                                <Text fontSize="13px" color="primary.500" fontWeight={600} lineHeight="1.5">{`${movement?.assignedFromName}(${movement?.assignedFromDesignation})`}</Text>
                                                                <Text fontSize="13px" fontWeight={400} color="#292929">
                                                                    {t('closedTicket')}
                                                                </Text>
                                                                <Text fontSize="13px" fontWeight={400} color="#292929"> {t('on')}</Text>
                                                                <Text fontSize="13px" color="primary.500" fontWeight={600} lineHeight="1.5">{formatFullDisplayDate(movement?.modifiedDate)}</Text>
                                                            </Flex>
                                                        ) : movement?.status === 'REOPEN' ? (
                                                            <Flex wrap="wrap" columnGap={1}>
                                                                <Text fontSize="13px" color="primary.500" fontWeight={600} lineHeight="1.5">{`${movement?.assignedFromName}(${movement?.assignedFromDesignation})`}</Text>
                                                                <Text fontSize="13px" fontWeight={400} color="#292929">
                                                                    {t('reopenedTicket')}
                                                                </Text>
                                                                <Text fontSize="13px" fontWeight={400} color="#292929"> {t('on')}</Text>
                                                                <Text fontSize="13px" color="primary.500" fontWeight={600} lineHeight="1.5">{formatFullDisplayDate(movement?.modifiedDate)}</Text>
                                                            </Flex>
                                                        ) : movement?.ticketAction === 'RETURNED' ? (
                                                            <Flex wrap="wrap" columnGap={1}>
                                                                <Text fontSize="13px" color="primary.500" fontWeight={600} lineHeight="1.5">{`${movement?.assignedFromName}(${movement?.assignedFromDesignation})`}</Text>
                                                                <Text fontSize="13px" fontWeight={400} color="#292929">
                                                                    {t('returnedTicketTo')}
                                                                </Text>
                                                                <Text fontSize="13px" color="primary.500" fontWeight={600} lineHeight="1.5">{`${movement?.assignedToName}(${movement?.assignedToDesignation})`}</Text>
                                                                <Text fontSize="13px" fontWeight={400} color="#292929"> {t('on')}</Text>
                                                                <Text fontSize="13px" color="primary.500" fontWeight={600} lineHeight="1.5">{formatFullDisplayDate(movement?.modifiedDate)}</Text>
                                                            </Flex>
                                                        ) : movement?.takeOver ? (
                                                            <Flex wrap="wrap" columnGap={1}>
                                                                <Text fontSize="13px" color="primary.500" fontWeight={600} lineHeight="1.5">{`${movement?.assignedToName}(${movement?.assignedToDesignation})`}</Text>
                                                                <Text fontSize="13px" fontWeight={400} color="#292929">
                                                                    {t('ticketTakenOverFrom')}
                                                                </Text>
                                                                <Text fontSize="13px" color="primary.500" fontWeight={600} lineHeight="1.5">{`${movement?.assignedFromName}(${movement?.assignedFromDesignation})`}</Text>
                                                                <Text fontSize="13px" fontWeight={400} color="#292929"> {t('on')}</Text>
                                                                <Text fontSize="13px" color="primary.500" fontWeight={600} lineHeight="1.5">{formatFullDisplayDate(movement?.modifiedDate)}</Text>
                                                            </Flex>
                                                        ) : (
                                                            <Flex wrap="wrap" columnGap={1}>
                                                                <Text fontSize="13px" color="primary.500" fontWeight={600} lineHeight="1.5">{`${movement?.assignedFromName}(${movement?.assignedFromDesignation})`}</Text>
                                                                <Text fontSize="13px" fontWeight={400} color="#292929">
                                                                    {t('forwardTicketTo')}
                                                                </Text>
                                                                <Text fontSize="13px" color="primary.500" fontWeight={600} lineHeight="1.5">{`${movement?.assignedToName}(${movement?.assignedToDesignation})`}</Text>
                                                                <Text fontSize="13px" fontWeight={400} color="#292929"> {t('on')}</Text>
                                                                <Text fontSize="13px" color="primary.500" fontWeight={600} lineHeight="1.5">{formatFullDisplayDate(movement?.modifiedDate)}</Text>
                                                            </Flex>
                                                        )}
                                                    </HStack>
                                                )}

                                                <HStack gap={3}>
                                                    <TrackDateIcon boxSize={4} />
                                                    <HStack>
                                                        <Text fontSize="13px" fontWeight={400} color="#292929" lineHeight="1.5">{t('totalTimeTakenAtThisSeatIs')}</Text>
                                                        <Text fontSize="13px" fontWeight={400} color="primary.500">
                                                            {movement?.timeAtSeat}
                                                        </Text>
                                                    </HStack>
                                                </HStack>
                                            </>
                                        ) : (
                                            <Flex wrap="wrap" columnGap={1}>
                                                <UserAdd boxSize={4} color={'gray.700'} mr={2} />
                                                <Text fontSize="13px" color="primary.500" fontWeight={600} lineHeight="1.5">{movement?.assignedFromName}</Text>
                                                <Text fontSize="13px" fontWeight={400} color="#292929">
                                                    {t('raisedTicket')}
                                                </Text>
                                            </Flex>
                                        )}

                                        {movement?.remarks && (
                                            <HStack gap={4} alignItems="center" justifyContent={'center'}>
                                                <TrackNoteIcon boxSize={4} />
                                                <HStack>
                                                    <Text fontSize="13px" fontWeight={400} color="#292929" lineHeight="1.5">{t('remarks')}: </Text>
                                                    <Tooltip content={movement?.remarks}>
                                                        <Text
                                                            fontSize="13px"
                                                            fontWeight={400}
                                                            color="primary.500"
                                                            lineHeight="1.5"
                                                            noOfLines={1}
                                                            maxW="300px"
                                                            whiteSpace="nowrap"
                                                            overflow="hidden"
                                                            textOverflow="ellipsis"
                                                            display="block"
                                                        >
                                                            {movement?.remarks}
                                                        </Text>
                                                    </Tooltip>
                                                </HStack>
                                            </HStack>
                                        )}

                                    </VStack>
                                    <Box mt={3}>
                                        <StatusBadge status={movement?.status} />
                                    </Box>
                                </Flex>
                            </Box>
                        </HStack >
                    </>
                );
            })}
        </Box >
    )
}

export default TrackingNotes;