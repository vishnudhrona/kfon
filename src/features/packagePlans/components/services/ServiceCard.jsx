import { Badge, Box, Divider, Flex, HStack, Text, VStack } from "@kfonbss/bss-ui-components"
import { useTranslation } from "react-i18next"

import CustomEditIcon from "@/components/custom/CustomEditIcon";
import { formatDisplayDate, formatDisplayTime } from "@/utils/dateUtils";

import { formatMainServicedata } from "../../helper"

const ServiceCard = ({ mainServices = [], pageOffset = 0, onEdit = () => { }, formatData = formatMainServicedata }) => {

    const { t } = useTranslation();

    const handleEditClick = (service) => {
        onEdit(service);
    };

    return (
        <>
            {mainServices?.map((service, idx) => {
                const fields = formatData(service);
                const serialNo = pageOffset + idx + 1;
                return (
                    <Box
                        key={idx}
                        border="1px solid #E1E1E1"
                        borderRadius="lg"
                        p={4}
                        h={'73px'}
                        bg="#FFFCF2"
                        minW="320px"
                        mt={2}
                        display="flex"
                        alignItems="center"
                    >
                        <VStack alignItems="stretch" spacing={0} w="full">
                            <Flex w="full" alignItems="center" justifyContent="space-between" gap={4}>
                                <Flex gap={2} alignItems="center" flexWrap="wrap" flex={1}>
                                    <Text fontSize="14px" fontWeight="600" mr={5}>{serialNo}</Text>
                                    {fields?.map((item, fIdx) => (
                                        <>
                                            <HStack key={fIdx}>
                                                {typeof item.label === 'string' ? (
                                                    <Text fontSize="16px" fontWeight="500">{item.label}:</Text>
                                                ) : (
                                                    item.label
                                                )}
                                                {typeof item.value === 'string' || typeof item.value === 'number' ? (
                                                    <Text fontSize="16px" fontWeight="700">{item.value}</Text>
                                                ) : (
                                                    item.value
                                                )}
                                            </HStack>
                                            {
                                                fIdx < fields.length - 1 && (
                                                    <Divider orientation="vertical" height="16px" borderWidth={1} borderColor="gray.300" flexShrink={0} />
                                                )}
                                        </>
                                    ))}
                                </Flex>

                                <HStack spacing={2} flexShrink={0} alignItems="center">
                                    <Text fontSize="16px" fontWeight="600" whiteSpace="nowrap">
                                        {formatDisplayDate(service.createdDate)}
                                    </Text>
                                    <Text fontSize="16px" fontWeight="600" whiteSpace="nowrap">
                                        {formatDisplayTime(service.createdDate)}
                                    </Text>
                                    <Badge
                                        px={4} py={2} borderRadius="full"
                                        bg='#F4F4F4' border="1px solid #D7D7D7"
                                        display="inline-flex" alignItems="center" gap={1}
                                        textTransform="none" whiteSpace="nowrap" flexShrink={0}
                                    >
                                        <Box w="7px" h="7px" borderRadius="full" bg='#39F5A1' flexShrink={0} />
                                        <Text fontSize="16px" fontWeight="600" color='#FD1C7A' lineHeight="1">{service.active === true || service.isActive === true ? t('active') : t('inActive')}</Text>
                                    </Badge>

                                    <Box ml={5}>
                                        <CustomEditIcon onClick={() => handleEditClick(service)} />
                                    </Box>
                                </HStack>
                            </Flex>
                        </VStack>
                    </Box>
                );
            })}
        </>
    )
}

export default ServiceCard