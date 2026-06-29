import { Box, Flex, Text } from '@kfonbss/bss-ui-components';
import { useNavigate, useParams } from '@tanstack/react-router';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { fetchCategoryCount } from '../actions';
import { getCategoryCount } from '../selectors';

const StockTypeView = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { typeName } = useParams({ strict: false });
  const categoryCount = useSelector(getCategoryCount);

  useEffect(() => {
    if (typeName) {
      dispatch(fetchCategoryCount({ typeName }));
    }
  }, [dispatch, typeName]);

  const handleCategoryClick = (item) => {
    navigate({
      to: '/app/inventory/stock-management/$typeName/$categoryId',
      params: { typeName, categoryId: item.categoryId },
      state: { headerTitle: item.categoryName },
      search: {}
    });
  };

  return (
    <Flex direction='column' gap='4' w='100%' mt='2'>
      {categoryCount && categoryCount.length > 0 ? (
        categoryCount.map((item, idx) => {
          const nameMatch = item.categoryName ? item.categoryName.match(/^(.*?)\s*(\(.*?\))?$/) : [];
          const mainName = nameMatch?.[1] || item.categoryName;
          const subName = nameMatch?.[2] || '';

          const displayId =
            item.categoryId && item.categoryId.length > 10
              ? (parseInt(item.categoryId.substring(0, 4), 16) % 10000) + 10000
              : item.categoryId || 11340 + idx;

          return (
            <Flex
              key={item.categoryId || idx}
              align='center'
              justify='space-between'
              p='4'
              bg='white'
              borderRadius='md'
              border='1px solid'
              borderColor='gray.200'
              boxShadow='sm'
              cursor='pointer'
              _hover={{ bg: 'gray.50', borderColor: 'primary.300' }}
              onClick={() => handleCategoryClick(item)}
            >
              <Flex align='center' gap='4'>
                <Box bg='#FCECB8' px='3' py='1' borderRadius='md' fontSize='sm' fontWeight='bold' color='gray.800'>
                  {t('id')} : {displayId}
                </Box>
                <Text fontWeight='bold' color='#8C1A4A' fontSize='md'>
                  {mainName}
                  {subName && (
                    <Text as='span' color='gray.600' fontWeight='normal' ml='2'>
                      {subName}
                    </Text>
                  )}
                </Text>
              </Flex>
              <Box
                border='1px solid'
                borderColor='gray.200'
                px='4'
                py='2'
                borderRadius='md'
                fontSize='sm'
                fontWeight='medium'
                bg='white'
              >
                {t('totalDevice')}:{' '}
                <Text as='span' fontWeight='bold' color='gray.900'>
                  {item.totalCount}
                </Text>
              </Box>
            </Flex>
          );
        })
      ) : (
        <Text color='gray.500'>{t('noRecordsFound')}</Text>
      )}
    </Flex>
  );
};

export default StockTypeView;
