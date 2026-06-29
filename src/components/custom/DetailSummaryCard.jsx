import { Badge, Box, Divider, Flex, HStack, Text } from '@kfonbss/bss-ui-components';
import React from 'react';
import { useTranslation } from 'react-i18next';

const DetailSummaryCard = ({ data, config }) => {
    const { t } = useTranslation();
    const { header, body, style } = config || {};

    const renderField = (field, isHeader = false) => {
        if (field.isSeparator) {
            return <Divider orientation='vertical' height='20px' borderColor='gray.300' mx={2} key={`sep-${Math.random()}`} />;
        }

        const value = data?.[field.key] || field.value;
        const label = field.label || '';
        const Icon = field.icon;

        if (!value && !label) return null;

        return (
            <HStack key={field.key || label} spacing={2} align='center'>
                {Icon && <Icon style={{ fontSize: '16px', color: '#718096', ...field.iconStyle }} />}
                {label && (
                    <Text
                        fontSize='sm'
                        color={field.labelStyle?.color || 'gray.600'}
                        fontWeight={isHeader ? 'normal' : 'medium'}
                        {...field.labelStyle}
                    >
                        {t(label)} {value && ':'}
                    </Text>
                )}
                {value && (
                    <Text
                        fontSize='sm'
                        color={field.color || (isHeader ? 'gray.800' : 'gray.700')}
                        fontWeight={isHeader ? 'bold' : 'normal'}
                        {...field.style}
                    >
                        {value}
                    </Text>
                )}
            </HStack>
        );
    };

    return (
        <Box
            bg='white'
            p={4}
            borderRadius='md'
            border='1px solid'
            borderColor='gray.200'
            boxShadow='sm'
            w='full'
            {...style}
        >
            {/* Header Section */}
            <Flex justify='space-between' align='center' mb={4} wrap='wrap' gap={4}>
                <HStack spacing={3} align='center' wrap='wrap'>
                    {header?.badge && (
                        <Badge
                            colorScheme={header.badge.colorScheme || 'yellow'}
                            bg={header.badge.bg}
                            color={header.badge.textColor}
                            fontSize='xs'
                            px={2}
                            py={1}
                            borderRadius='md'
                            textTransform='none'
                        >
                            {t(header.badge.label)} : {data?.[header.badge.key]}
                        </Badge>
                    )}

                    {header?.title && (
                        <Text fontSize='lg' fontWeight='bold' color='navy.700' {...header.title.style}>
                            {data?.[header.title.key]}
                        </Text>
                    )}

                    {header?.fields?.map((field, index) => (
                        <React.Fragment key={index}>
                            {renderField(field, true)}
                        </React.Fragment>
                    ))}
                </HStack>

                {/* Right Side Meta Info */}
                <HStack spacing={6}>
                    {header?.meta?.map((item, index) => (
                        <HStack key={index} spacing={1}>
                            {item.label && <Text fontSize='xs' color='gray.500'>{t(item.label)}:</Text>}
                            {item.icon && item.iconPosition === 'left' && <item.icon style={{ fontSize: '16px', color: '#718096', ...item.iconStyle }} />}
                            <Text fontSize='sm' fontWeight='medium' color='gray.700'>
                                {item.value || data?.[item.key]}
                            </Text>
                            {item.icon && item.iconPosition !== 'left' && <item.icon style={{ fontSize: '16px', color: '#718096', ...item.iconStyle }} />}
                        </HStack>
                    ))}
                </HStack>
            </Flex>

            {/* Body Section */}
            <Flex justify='space-between' align='center' borderTop='1px solid' borderColor='gray.100' pt={4} wrap='wrap' gap={4}>
                <HStack spacing={4} wrap='wrap'>
                    {body?.fields?.map((field, index) => (
                        <React.Fragment key={index}>
                            {renderField(field)}
                        </React.Fragment>
                    ))}
                </HStack>

                <HStack spacing={3} wrap='wrap'>
                    {body?.action && (
                        <Box
                            border='1px solid'
                            borderColor='gray.200'
                            borderRadius='md'
                            px={3}
                            py={1}
                            bg='gray.50'
                            cursor={body.action.onClick ? 'pointer' : 'default'}
                            onClick={body.action.onClick}
                            _hover={body.action.onClick ? { bg: 'gray.100' } : {}}
                        >
                            <Text fontSize='sm' fontWeight='bold' color='gray.700'>
                                {t(body.action.label)}: <Text as="span" fontWeight="extrabold">{data?.[body.action.valueKey]}</Text>
                            </Text>
                        </Box>
                    )}
                    {body?.actions?.map((action, i) => (
                        <Box
                            key={i}
                            border='1px solid'
                            borderColor={action.borderColor || 'gray.200'}
                            borderRadius='md'
                            px={3}
                            py={1}
                            bg={action.bg || 'gray.50'}
                            cursor={action.onClick ? 'pointer' : 'default'}
                            onClick={action.onClick}
                            _hover={action.onClick ? { bg: 'gray.100' } : {}}
                        >
                            <Text fontSize='sm' fontWeight='bold' color={action.color || 'gray.700'}>
                                {t(action.label)}: <Text as="span" fontWeight="extrabold">{data?.[action.valueKey] ?? 0}</Text>
                            </Text>
                        </Box>
                    ))}
                </HStack>
            </Flex>
        </Box>
    );
};

export default DetailSummaryCard;
