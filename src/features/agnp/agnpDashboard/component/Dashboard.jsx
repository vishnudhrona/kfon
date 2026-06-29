import { Box, Button, Grid, Headline, HStack, Pagination, Table, Text } from '@kfonbss/bss-ui-components';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';

import { Forward,TicketIcon } from '@/components/custom';

import { fetchDashboardCardData,fetchDashboardTableData } from '../action';
import { getCardData, getTableData } from '../selector';

const Dashboard = ({ getTableData, cardData }) => {
  const { t } = useTranslation();

  useEffect(() => {
    getTableData();
    cardData();
  }, [getTableData, cardData]);

  const getCardColors = (index) => {
    switch (index) {
      case 0:
        return { bg: 'background.pink_bg', text: 'white' };
      case 1:
        return { bg: 'background.yellow_bg', text: 'white' };
      default:
        return { bg: 'gray.700', text: 'white' };
    }
  };

  const getCardData = (index) => {
    switch (index) {
      case 0:
        return { title: 'Account Balance' };
      case 1:
        return { title: 'Total Users' };
      case 2:
        return { title: 'Franchisees' };
      case 3:
        return { title: 'Vendors' };
      case 4:
        return { title: 'Transactions' };
      case 5:
        return { title: 'Pending Requests' };
      default:
        return { title: 'Unknown' };
    }
  };

  return (
    <>
      <Headline headName={t('agnpDashboard')} />
      <Grid
        templateColumns={{
          base: '1fr',
          md: '1fr',
          lg: 'repeat(3, 1fr)',
          xl: 'repeat(2, 1fr)'
        }}
        gap={3}
      >
        {[1, 2].map((value, index) => {
          const { bg, text } = getCardColors(index);
          return (
            <Box
              key={index}
              bg={bg}
              color={text}
              display='flex'
              justifyContent='space-between'
              alignItems='center'
              px={4}
              py={3}
              borderRadius='xl'
              height='64px'
            >
              <HStack spacing={3}>
                <TicketIcon boxSize={6} />
                <Text fontSize='17px' fontWeight='semibold'>
                  {t(value)}
                </Text>
              </HStack>
              <Box
                bg='background.light_white'
                borderRadius='xl'
                width='166px'
                height='44px'
                display='flex'
                alignItems='center'
                justifyContent='center'
              >
                <Text fontWeight='bold' fontSize='24px'>
                  17
                </Text>
              </Box>
            </Box>
          );
        })}
      </Grid>

      <Grid
        templateColumns={{
          base: '1fr',
          md: 'repeat(2, 1fr)',
          lg: 'repeat(3, 1fr)',
          xl: 'repeat(6, 1fr)'
        }}
        gap={3}
      >
        {[...Array(6)].map((item, index) => {
          const { value } = getCardData(index);

          return (
            <Box
              key={index}
              bg='background.light_gray'
              height='94px'
              borderRadius='2xl'
              display='flex'
              flexDirection='column'
              alignItems='center'
              justifyContent='center'
            >
              <Text fontSize='14px' fontWeight='semibold' color='black'>
                {/* {item} */} {t('accountBalance')}
              </Text>
              <HStack spacing={2}>
                <Text fontWeight='semibold' fontSize='18px' color='primary.500'>
                  {value}
                </Text>
                <Button bg='white' w='24px' h='24px' p={0} minW='24px'>
                  <Forward boxSize={2} />
                </Button>
              </HStack>
            </Box>
          );
        })}
      </Grid>

      <Box overflow={'hidden'}>
        <Table />
      </Box>

      <Box mt={'auto'}>
        <Pagination totalPages={2} itemsPerPage={5} totalEntries={10} />
      </Box>
    </>
  );
};

const mapStateToProps = (state) => ({
  dashboardTableData: getTableData(state),
  dashboardCardData: getCardData(state)
});

const mapDispatchToProps = {
  getTableData: fetchDashboardTableData,
  cardData: fetchDashboardCardData
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
