import {
  Box,
  Button,
  CommonCard,
  Flex,
  Heading,
  HStack,
  Icons,
  Popup,
  SimpleGrid,
  Table
} from '@kfonbss/bss-ui-components';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import PackageImage from '../../../../assets/landingPage/package.png';
import { fetchLnpDashboardDetails } from '../../action';
import { LNP_DASHBOARD_CARDS, MALAYALAM_MESSAGES } from '../../constants';
import { getLnpDashboardData } from '../../selector';

const RECENT_TOPUP_COLUMNS = [
  { header: 'Name', accessor: 'name' },
  { header: 'Amount', accessor: 'amount' },
  { header: 'Date Time', accessor: 'dateTime' }
];

const RECENT_TOPUP_DATA = [{ name: 'kfon.657rfg', amount: '352.82', dateTime: '12-Dec-2025 17:26:38' }];

const LNP_NOTICE_KEY = 'lnp_notice_shown';

const LnpDashboard = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const lnpDashboardData = useSelector(getLnpDashboardData);
  const [isNoticeOpen, setIsNoticeOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchLnpDashboardDetails());

    const noticeShown = localStorage.getItem(LNP_NOTICE_KEY);
    if (!noticeShown) {
      setIsNoticeOpen(true);
    }
  }, [dispatch]);

  const handleCloseNotice = () => {
    setIsNoticeOpen(false);
    localStorage.setItem(LNP_NOTICE_KEY, 'true');
  };

  const mapCardData = (cards) => {
    return cards.map((card) => {
      const IconComponent = card.icon && typeof card.icon === 'string' ? Icons[card.icon] : null;
      let renderedIcon = null;
      if (IconComponent) {
        renderedIcon = <IconComponent boxSize={card.boxSize || '32px'} />;
      }

      return {
        ...card,
        title: t(card.titleKey),
        value: lnpDashboardData?.[card.id] || card.value,
        subText: card.subTextKey ? t(card.subTextKey) : '',
        renderedIcon
      };
    });
  };

  const topCards = mapCardData(LNP_DASHBOARD_CARDS.TOP_CARDS);
  const secondRowCards = mapCardData(LNP_DASHBOARD_CARDS.SECOND_ROW_CARDS);
  const thirdRowCards = mapCardData(LNP_DASHBOARD_CARDS.THIRD_ROW_CARDS);
  const fourthRowCards = mapCardData(LNP_DASHBOARD_CARDS.FOURTH_ROW_CARDS);

  return (
    <Box p='32px' bg='#f5f6fa'>
      <SimpleGrid columns={4} columnGap='13px' rowGap='13px' mb='20px'>
        {topCards.map((card, index) => (
          <CommonCard
            key={index}
            title={card.title}
            totalCount={card.value}
            iconBg={card.iconBg}
            bgIconColor={card.bgIconColor}
            values={card.subText ? { description: card.subText } : {}}
            width='340px'
            height='139px'
            titleFontSize='md'
          />
        ))}
      </SimpleGrid>

      <SimpleGrid columns={5} columnGap='13px' rowGap='13px' mb='20px'>
        {secondRowCards.map((card, index) => (
          <CommonCard
            key={index}
            title={card.title}
            totalCount={card.value}
            iconBg={card.iconBg}
            bgIconColor={card.bgIconColor}
            width='270px'
            height='139px'
            titleFontSize='md'
          />
        ))}
      </SimpleGrid>

      <Box w='full' h='20px' bg='#DEE4F2' borderRadius='full' mb='20px' opacity={0.5} />

      <SimpleGrid columns={5} columnGap='13px' rowGap='13px' mb='20px'>
        {thirdRowCards.map((card, index) => (
          <Box
            key={index}
            bg='white'
            p='24px'
            borderRadius='lg'
            boxShadow='sm'
            display='flex'
            flexDirection='column'
            justifyContent='space-between'
            h={'139px'}
          >
            <HStack mb={4} align='start'>
              <Box borderRadius='full' bg={(card.color || '#000') + '1A'}>
                {card.renderedIcon}
              </Box>
              <Box fontWeight='bold' fontSize='sm' color='gray.600'>
                {card.title}
              </Box>
            </HStack>
            <Box alignSelf='end' fontWeight='bold' fontSize='2xl'>
              {card.value}
            </Box>
          </Box>
        ))}
      </SimpleGrid>

      <SimpleGrid columns={5} columnGap='13px' rowGap='13px' mb='48px'>
        {fourthRowCards.map((card, index) => (
          <Box
            key={index}
            bg='white'
            p='24px'
            borderRadius='lg'
            boxShadow='sm'
            display='flex'
            flexDirection='column'
            justifyContent='space-between'
            minH='120px'
          >
            <HStack mb={4} align='center'>
              <Box p={3} borderRadius='full' bg={(card.color || '#000') + '1A'}>
                {card.renderedIcon}
              </Box>
              <Box fontWeight='bold' fontSize='sm' color='gray.600'>
                {card.title}
              </Box>
            </HStack>
            {card.value && (
              <Box alignSelf='end' fontWeight='bold' fontSize='2xl'>
                {card.value}
              </Box>
            )}
          </Box>
        ))}
      </SimpleGrid>

      <SimpleGrid columns={2} columnGap='40px' rowGap='40px'>
        <Box bg='white' p='24px' borderRadius='lg' boxShadow='sm'>
          <Heading size='md' mb={6} color='purple.700'>
            {t('recentSubscriberTopUp')}
          </Heading>
          <Table headerColor='table_header.primary' columns={RECENT_TOPUP_COLUMNS} data={RECENT_TOPUP_DATA} />
        </Box>

        <Box bg='white' p='24px' borderRadius='lg' boxShadow='sm'>
          <Heading size='md' mb={6} color='purple.700'>
            {t('kfonOttBundlePackages')}
          </Heading>
          <Box h='180px' borderRadius='md' overflow='hidden'>
            <img
              src={PackageImage}
              alt='KFON-OTT Bundle Packages'
              style={{ width: '100%', height: '100%', objectFit: 'fill' }}
            />
          </Box>
        </Box>
      </SimpleGrid>

      <Popup isOpen={isNoticeOpen} onClose={handleCloseNotice} size='xl'>
        <Box p={4}>
          <Box mb={5}>
            <Box fontWeight='bold' fontSize='md' mb={2}>
              {MALAYALAM_MESSAGES.lnpNoticeTitle1}
            </Box>
            <Box fontSize='sm' lineHeight='1.6' textAlign='justify'>
              {MALAYALAM_MESSAGES.lnpNoticeContent1}
            </Box>
          </Box>

          <Box mb={5}>
            <Box fontWeight='bold' fontSize='md' mb={2}>
              {MALAYALAM_MESSAGES.lnpNoticeTitle2}
            </Box>
            <Box fontSize='sm' lineHeight='1.6' textAlign='justify'>
              {MALAYALAM_MESSAGES.lnpNoticeContent2}
            </Box>
            <Box mt={2}>
              <Box
                color='blue.600'
                textDecoration='none'
                _hover={{ textDecoration: 'underline' }}
                mb={1}
                cursor='pointer'
                fontSize='sm'
              >
                {MALAYALAM_MESSAGES.lnpNoticeDoc1}
              </Box>
              <Box
                color='blue.600'
                textDecoration='none'
                _hover={{ textDecoration: 'underline' }}
                cursor='pointer'
                fontSize='sm'
              >
                {MALAYALAM_MESSAGES.lnpNoticeDoc2}
              </Box>
            </Box>
          </Box>

          <Box mb={4}>
            <Box fontWeight='bold' fontSize='md' mb={2}>
              {MALAYALAM_MESSAGES.lnpNoticeTitle3}
            </Box>
            <Box fontSize='sm' lineHeight='1.6' textAlign='justify'>
              {MALAYALAM_MESSAGES.lnpNoticeContent3}
            </Box>
          </Box>

          <Box mt={5} pt={3} borderTop='1px solid' borderColor='gray.200'>
            <Box
              color='blue.600'
              textDecoration='none'
              _hover={{ textDecoration: 'underline' }}
              mb={2}
              cursor='pointer'
              fontSize='sm'
            >
              {MALAYALAM_MESSAGES.lnpNoticeLink1}
            </Box>
            <Box
              color='blue.600'
              textDecoration='none'
              _hover={{ textDecoration: 'underline' }}
              mb={3}
              cursor='pointer'
              fontSize='sm'
            >
              {MALAYALAM_MESSAGES.lnpNoticeLink2}
            </Box>

            <Flex justifyContent='flex-end' mt={4}>
              <Button
                onClick={handleCloseNotice}
                bg='primary.500'
                color='white'
                size='sm'
                borderRadius='md'
                _hover={{ bg: 'primary.600' }}
                px={6}
              >
                Close
              </Button>
            </Flex>
          </Box>
        </Box>
      </Popup>
    </Box>
  );
};

export default LnpDashboard;
