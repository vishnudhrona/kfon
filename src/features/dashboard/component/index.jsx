import { Box, Flex, Heading, SimpleGrid } from '@kfonbss/bss-ui-components';
import { t } from 'i18next';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { STORAGE_KEYS } from '@/constants';
import { getAllTokenInfo } from '@/utils/encryptionUtils';

import { fetchDashboardDetails } from '../action';
import { DASHBOARD_CARDS, TAB_NAMES, TABS } from '../constants';
import { getDashBoardData } from '../selector';
import LargeDashboardCard from './LargeDashboardCard';
import LnpDashboard from './LnpDashBoard';
import SmallDashboardCard from './SmallDashboardCard';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState(TAB_NAMES.FTTH);
  const dispatch = useDispatch();
  const dashboardData = useSelector(getDashBoardData);

  const {
    top,
    row2,
    section12,
    section8,
    darkFiberTop,
    darkFiberRow2,
    enterprisePrivateTop,
    enterprisePrivateRow2,
    enterprisePrivateRow3,
    enterpriseGovernmentTop,
    enterpriseGovernmentRow2,
    enterpriseGovernmentRow3
  } = DASHBOARD_CARDS;

  useEffect(() => {
    dispatch(fetchDashboardDetails({ type: activeTab }));
  }, [activeTab, dispatch]);

  const getCardProps = (card) => {
    const data = dashboardData?.[card.id] || {};
    return {
      ...card,
      value: data?.value ?? card.value,
      growth: data?.growth ?? card.growth
    };
  };

  // Determine which cards to show based on active tab
  const getTopCards = () => {
    if (activeTab === TAB_NAMES.DARK_FIBER) return darkFiberTop;
    if (activeTab === TAB_NAMES.ENTERPRISE_PRIVATE) return enterprisePrivateTop;
    if (activeTab === TAB_NAMES.ENTERPRISE_GOVT) return enterpriseGovernmentTop;
    return top;
  };

  const getRow2Cards = () => {
    if (activeTab === TAB_NAMES.DARK_FIBER) return darkFiberRow2;
    if (activeTab === TAB_NAMES.ENTERPRISE_PRIVATE) return enterprisePrivateRow2;
    if (activeTab === TAB_NAMES.ENTERPRISE_GOVT) return enterpriseGovernmentRow2;
    return row2;
  };

  const getRow3Cards = () => {
    if (activeTab === TAB_NAMES.ENTERPRISE_PRIVATE) return enterprisePrivateRow3;
    if (activeTab === TAB_NAMES.ENTERPRISE_GOVT) return enterpriseGovernmentRow3;
    return [];
  };

  const showSections = activeTab === TAB_NAMES.FTTH;
  const showEnterpriseRow3 = activeTab === TAB_NAMES.ENTERPRISE_PRIVATE || activeTab === TAB_NAMES.ENTERPRISE_GOVT;

  return (
    <Box p='24px' bg='#EEF2FF'>
      <Flex justify='space-between' align='center' mb='24px'>
        <Heading fontSize='32px'>{t('dashboard.title')}</Heading>
        <Flex bg='white' p='6px' borderRadius='50px' boxShadow='0px 1px 4px rgba(0,0,0,0.06)' align='center' gap='6px'>
          {TABS.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <Box
                key={tab}
                onClick={() => setActiveTab(tab)}
                cursor='pointer'
                px='28px'
                py='10px'
                borderRadius='40px'
                bg={isActive ? '#FFE48F' : 'transparent'}
                fontWeight={isActive ? '700' : '500'}
                color='#111'
                transition='all 0.2s'
              >
                {tab}
              </Box>
            );
          })}
        </Flex>
      </Flex>
      <SimpleGrid columns={2} columnGap='28px' rowGap='28px' mb='32px'>
        {getTopCards().map((card) => (
          <LargeDashboardCard key={card.id} {...getCardProps(card)} />
        ))}
      </SimpleGrid>
      <SimpleGrid columns={4} columnGap='24px' rowGap='28px' mb='32px'>
        {getRow2Cards().map((card) => (
          <SmallDashboardCard key={card.id} {...getCardProps(card)} />
        ))}
      </SimpleGrid>

      {showEnterpriseRow3 && (
        <SimpleGrid columns={3} columnGap='24px' rowGap='28px' mb='32px'>
          {getRow3Cards().map((card) => (
            <SmallDashboardCard key={card.id} {...getCardProps(card)} />
          ))}
        </SimpleGrid>
      )}

      {showSections && (
        <>
          <Box width='100%' height='27px' bg='#DEE4F2' borderRadius='50px' mb='32px' />
          <SimpleGrid columns={4} columnGap='24px' rowGap='28px' mb='32px'>
            {section12.map((card) => (
              <SmallDashboardCard key={card.id} {...getCardProps(card)} />
            ))}
          </SimpleGrid>
          <Box width='100%' height='27px' bg='#DEE4F2' borderRadius='50px' mb='32px' />
          <SimpleGrid columns={4} columnGap='24px' rowGap='28px'>
            {section8.map((card) => (
              <SmallDashboardCard key={card.id} {...getCardProps(card)} />
            ))}
          </SimpleGrid>
        </>
      )}
    </Box>
  );
};

const DASHBOARD_BY_TYPE = {
  LNP: LnpDashboard,
  AGNP: LnpDashboard
};

const Dashboard = () => {
  const tokenInfo = useMemo(() => getAllTokenInfo(STORAGE_KEYS.AUTH_TOKEN), []);
  const partnerType = tokenInfo?.data?.partnerType;
  const activeRole = tokenInfo?.roles?.[0]?.name;

  const DashboardComponent = DASHBOARD_BY_TYPE[partnerType] || DASHBOARD_BY_TYPE[activeRole] || AdminDashboard;

  return <DashboardComponent />;
};

export default Dashboard;
