import { Box, Flex, Icons, Text } from '@kfonbss/bss-ui-components';
import { useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

const { GrowthIcon } = Icons;

const SmallDashboardCard = ({ id, title, highlight, subtitle, value, growth, bg, color, route, icon }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const IconComponent = Icons[icon];

  return (
    <Box
      bg='white'
      p='16px'
      borderRadius='16px'
      border='1px solid #E6EEF8'
      height='150px'
      display='flex'
      flexDirection='column'
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
        <Text as='span' display='inline-flex' alignItems='center' justifyContent='center' mt='6px'>
          {IconComponent && <IconComponent width='32px' height='32px' />}
        </Text>

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

      {/* VALUE + GROWTH IN SAME ROW */}
      <Flex mt='29px' align='center' justify='space-between'>
        <Box
          bg={bg}
          width='114px'
          height='38px'
          borderRadius='8px'
          fontSize='22px'
          fontWeight='600'
          color={color}
          display='flex'
          alignItems='center'
          justifyContent='center'
        >
          {value}
        </Box>

        <Flex align='center' gap='6px'>
          <GrowthIcon width='14px' height='14px' />
          <Text fontSize='13px' fontWeight='600' color='#25A86A'>
            +{growth}
          </Text>
          <Text fontSize='13px' fontWeight='600'>
            {t('thisMonth')}
          </Text>
        </Flex>
      </Flex>
    </Box>
  );
};

export default SmallDashboardCard;
