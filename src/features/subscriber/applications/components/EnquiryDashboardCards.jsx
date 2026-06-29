import { Box, CommonCard, Icons, SimpleGrid } from '@kfonbss/bss-ui-components';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { fetchEnquiryCardData } from '../actions';
import { ENQUIRY_CARD_CONFIG } from '../constants';
import { getEnquiryCardData } from '../selectors';

const EnquiryDashboardCards = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const enquiryDashboard = useSelector(getEnquiryCardData);

  useEffect(() => {
    dispatch(fetchEnquiryCardData());
  }, [dispatch]);

  if (!enquiryDashboard?.length) return null;

  return (
    <Box
      overflowX='auto'
      w='full'
      css={{
        '&::-webkit-scrollbar': {
          display: 'none'
        },
        scrollbarWidth: 'none'
      }}
    >
      <SimpleGrid columns={{ base: 1, md: 2, lg: enquiryDashboard.length }} p={1} mb={4} gap={4}>
        {enquiryDashboard.map((item, index) => {
          const config = ENQUIRY_CARD_CONFIG[item.key] || {
            iconBg: 'gray.400',
            bgIconColor: '#F0F0F0'
          };
          return (
            <Box key={index} minW='250px'>
              <CommonCard
                height={28}
                title={t(item.key)}
                icon={item.icon || Icons.MdOutlineAnalytics}
                iconBg={config.iconBg}
                bgIconColor={config.bgIconColor}
                totalCount={item.value}
                titleFontSize='18px'
                titleFontWeight='500'
              />
            </Box>
          );
        })}
      </SimpleGrid>
    </Box>
  );
};

export default EnquiryDashboardCards;
