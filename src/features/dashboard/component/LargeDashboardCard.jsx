import { Box, Flex, Icons, Text } from '@kfonbss/bss-ui-components';
import { useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

const { GrowthIcon } = Icons;

const LargeDashboardCard = ({ id, title, highlight, subtitle, value, growth, bg, color, route, icon }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const IconComponent = Icons[icon];

  return (
    <Box
      bg='white'
      p='18px'
      borderRadius='16px'
      border='1px solid #E6EEF8'
      height='158px'
      display='flex'
      flexDirection='column'
      gap='10px'
      cursor='pointer'
      onClick={() =>
        navigate({
          to: route || '/app/dashboard/details/$cardId',
          params: { cardId: id }
        })
      }
      _hover={{ boxShadow: '0 3px 8px rgba(0,0,0,0.12)' }}
      transition='0.2s'
    >
      {/* HEADER */}
      <Flex gap='8px' align='flex-start'>
        {/* INLINE ICON */}
        <Text as='span' display='inline-flex' alignItems='center' justifyContent='center' mt='6px'>
          {IconComponent && <IconComponent width='32px' height='32px' />}
        </Text>

        {/* TEXT */}
        <Box>
          <Text fontSize='16px' fontWeight='600' color='#111827'>
            {t(title)}{' '}
            <Text as='span' color='#8D0247' fontWeight='700'>
              {t(highlight)}
            </Text>
          </Text>

          <Text fontSize='16px' color='#111827' fontWeight='600'>
            {t(subtitle)}
          </Text>
        </Box>
      </Flex>

      {/* GROWTH + VALUE BOX EXACTLY LIKE FIGMA */}
      <Flex align='flex-end' justify='space-between' mt='-43px' mr='10px'>
        {/* Growth left */}
        <Flex align='flex-end' gap='6px'>
          <GrowthIcon width='16px' height='16px' />
          <Text fontSize='14px' fontWeight='500' color='#25A86A'>
            +{growth}
          </Text>
          <Text fontSize='13px' fontWeight='600'>
            {t('thisMonth')}
          </Text>
        </Flex>

        {/* VALUE BOX */}
        <Box
          bg={bg}
          width='93px'
          height='93px'
          borderRadius='12px'
          fontSize='32px'
          fontWeight='700'
          color={color}
          display='flex'
          alignItems='center'
          justifyContent='center'
        >
          {value}
        </Box>
      </Flex>

      {/* Spacer for bottom breathing space */}
      <Box flex='1' />
    </Box>
  );
};

export default LargeDashboardCard;
