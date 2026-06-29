import { Box, CommonCard, Flex } from '@kfonbss/bss-ui-components';
import { useNavigate } from '@tanstack/react-router';
import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { fetchStockTypeCount } from '../actions';
import { getStockTypeCount } from '../selectors';

const FALLBACK_STYLES = [
  { iconBg: '#05BCC3', bgIconColor: '#E0F7FA' },
  { iconBg: '#E91E63', bgIconColor: '#FCE4EC' },
  { iconBg: '#3F51B5', bgIconColor: '#E8EAF6' },
  { iconBg: '#FF9800', bgIconColor: '#FFF3E0' },
  { iconBg: '#4CAF50', bgIconColor: '#E8F5E9' },
  { iconBg: '#9C27B0', bgIconColor: '#F3E5F5' },
  { iconBg: '#00BCD4', bgIconColor: '#E0F7FA' },
  { iconBg: '#F44336', bgIconColor: '#FFEBEE' },
  { iconBg: '#795548', bgIconColor: '#EFEBE9' },
  { iconBg: '#FFEB3B', bgIconColor: '#FFFDE7' }
];

const AvailableStock = ({ filters }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const stockTypeCount = useSelector(getStockTypeCount);

  useEffect(() => {
    dispatch(fetchStockTypeCount(filters));
  }, [dispatch, filters]);

  const handleCardClick = (typeName) => {
    navigate({
      to: '/app/inventory/stock-management/$typeName',
      params: { typeName }
    });
  };

  const cards = useMemo(() => {
    if (stockTypeCount.length === 0) {
      return [];
    }
    return stockTypeCount.map((item, index) => {
      const style = FALLBACK_STYLES[index % FALLBACK_STYLES.length];
      return {
        title: item.title ?? item.deviceType,
        totalCount: item.count ?? 0,
        iconBg: style.iconBg,
        bgIconColor: style.bgIconColor,
        icon: item.icon
      };
    });
  }, [stockTypeCount]);

  return (
    <Flex wrap='wrap' gap={4} columns={3}>
      {cards.map((card) => (
        <Box
          key={card.title}
          minW='250px'
          flex='1'
          cursor='pointer'
          onClick={() => handleCardClick(card.title)}
          transition='transform 0.2s'
          _hover={{ transform: 'translateY(-2px)' }}
        >
          <CommonCard
            title={card.title}
            totalCount={card.totalCount}
            icon={card.icon}
            iconBg={card.iconBg}
            bgIconColor={card.bgIconColor}
          />
        </Box>
      ))}
    </Flex>
  );
};

export default AvailableStock;
