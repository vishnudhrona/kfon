import { Box, Flex, FormController, HStack, Input, Text, useForm } from '@kfonbss/bss-ui-components';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { PrintBtn } from '@/components/custom';
import CsvDownloadBtn from '@/components/custom/CsvDownloadBtn';
import GenericPageTable from '@/components/custom/GenericPageTable';
import { SERVER_SIDE_TABLE_KEYS } from '@/constants/server_table';

import { fetchPartnerRequestList } from '../action';
import {
  MOCK_PARTNER_REQUEST_DATA,
  PARTNER_REQUEST_COLUMNS,
  PARTNER_REQUEST_TABS,
  PARTNER_REQUEST_TILE_CARDS,
  PARTNER_TAB_TILE_COUNTS
} from '../constants';
import { getPartnerRequestList } from '../selector';

const WaveChart = ({ id, isIncrease }) =>
  isIncrease ? (
    <svg width='48' height='37' viewBox='0 0 48 37' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path
        d='M48 37V22.1472C42.7753 22.1472 42.1483 10.8199 37.3923 10.8199C32.6364 10.8199 33.0197 18.8638 27.067 21.0104C21.1143 23.157 20.2187 1 15.6548 1C11.0908 1 13.5162 17.5889 8.59005 19.7134C3.66386 21.838 1.46497 13.5237 0 15.8219V37H48Z'
        fill={`url(#increase_grad_${id})`}
      />
      <path
        d='M0 15.8219C2.7696 15.8219 3.66386 21.838 8.59005 19.7134C13.5162 17.5889 11.0908 1 15.6548 1C20.2187 1 21.1143 23.157 27.067 21.0104C33.0197 18.8638 32.6364 10.8199 37.3923 10.8199C42.1483 10.8199 42.0855 22.1472 48 22.1472'
        stroke='#33CCCC'
        strokeWidth='2'
      />
      <defs>
        <linearGradient id={`increase_grad_${id}`} x1='24' y1='1' x2='24' y2='37' gradientUnits='userSpaceOnUse'>
          <stop stopColor='#0DE7B9' stopOpacity='0.4' />
          <stop offset='1' stopColor='#0DE7B9' stopOpacity='0' />
        </linearGradient>
      </defs>
    </svg>
  ) : (
    <svg width='48' height='37' viewBox='0 0 48 37' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path
        d='M48 37V22.1472C42.7753 22.1472 42.1483 10.8199 37.3923 10.8199C32.6364 10.8199 33.0197 18.8638 27.067 21.0104C21.1143 23.157 20.2187 1 15.6548 1C11.0908 1 13.5162 17.5889 8.59005 19.7134C3.66386 21.838 1.46497 13.5237 0 15.8219V37H48Z'
        fill={`url(#decrease_grad_${id})`}
      />
      <path
        d='M0 15.8219C2.7696 15.8219 3.66386 21.838 8.59005 19.7134C13.5162 17.5889 11.0908 1 15.6548 1C20.2187 1 21.1143 23.157 27.067 21.0104C33.0197 18.8638 32.6364 10.8199 37.3923 10.8199C42.1483 10.8199 42.0855 22.1472 48 22.1472'
        stroke='#F27649'
        strokeWidth='2'
      />
      <defs>
        <linearGradient id={`decrease_grad_${id}`} x1='22.5385' y1='1' x2='22.5385' y2='37' gradientUnits='userSpaceOnUse'>
          <stop stopColor='#FA7885' stopOpacity='0.4' />
          <stop offset='1' stopColor='#FD3549' stopOpacity='0' />
        </linearGradient>
      </defs>
    </svg>
  );

const KERALA_DISTRICTS = [
  { id: '', name: 'All Districts' },
  { id: 'thiruvananthapuram', name: 'Thiruvananthapuram' },
  { id: 'kollam', name: 'Kollam' },
  { id: 'pathanamthitta', name: 'Pathanamthitta' },
  { id: 'alappuzha', name: 'Alappuzha' },
  { id: 'kottayam', name: 'Kottayam' },
  { id: 'idukki', name: 'Idukki' },
  { id: 'ernakulam', name: 'Ernakulam' },
  { id: 'thrissur', name: 'Thrissur' },
  { id: 'palakkad', name: 'Palakkad' },
  { id: 'malappuram', name: 'Malappuram' },
  { id: 'kozhikode', name: 'Kozhikode' },
  { id: 'wayanad', name: 'Wayanad' },
  { id: 'kannur', name: 'Kannur' },
  { id: 'kasaragod', name: 'Kasaragod' }
];

const PartnerRequestList = () => {
  const { t } = useTranslation();
  const listData = useSelector(getPartnerRequestList);
  const [activeKey, setActiveKey] = useState('total');
  const [activeTab, setActiveTab] = useState('All');
  const [activeFilter, setActiveFilter] = useState(null);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');

  const { control, formState: { errors } } = useForm({ defaultValues: { district: null, status: null } });

  const STATUS_OPTIONS = [
    { id: 'total', name: 'All Status' },
    ...PARTNER_REQUEST_TILE_CARDS.filter((c) => c.key !== 'total').map((c) => ({ id: c.key, name: c.label }))
  ];

  const allData = listData?.data || MOCK_PARTNER_REQUEST_DATA;

  const applyDateFilter = (data) => {
    const now = new Date();
    now.setHours(23, 59, 59, 999);
    let start;
    let end = now;

    if (activeFilter === 'today') {
      start = new Date();
      start.setHours(0, 0, 0, 0);
    } else if (activeFilter === 'week') {
      start = new Date();
      start.setDate(start.getDate() - start.getDay());
      start.setHours(0, 0, 0, 0);
    } else if (activeFilter === 'month') {
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      start.setHours(0, 0, 0, 0);
    } else if (activeFilter === 'year') {
      start = new Date(now.getFullYear(), 0, 1);
      start.setHours(0, 0, 0, 0);
    } else if (activeFilter === 'custom' && fromDate && toDate) {
      start = new Date(fromDate);
      end = new Date(toDate);
      end.setHours(23, 59, 59, 999);
    } else {
      return data;
    }

    return data.filter((d) => {
      const date = new Date(d.dateOfRequest);
      return date >= start && date <= end;
    });
  };

  const statusFiltered =
    activeKey === 'total'
      ? allData
      : allData.filter((d) => d.status === PARTNER_REQUEST_TILE_CARDS.find((c) => c.key === activeKey)?.statusKey);

  const locationFiltered = statusFiltered
    .filter((d) => !selectedDistrict || d.district?.toLowerCase() === selectedDistrict.toLowerCase());

  const filteredData = applyDateFilter(locationFiltered);

  const DATE_FILTERS = [
    { key: 'today', label: 'Today' },
    { key: 'week', label: 'This Week' },
    { key: 'month', label: 'This Month' },
    { key: 'year', label: 'This Year' },
    { key: 'custom', label: 'Custom Period' }
  ];

  const actions = (
    <Box display='flex' gap='10px'>
      <CsvDownloadBtn />
      <PrintBtn
        title={t('partnerRequests')}
        columns={PARTNER_REQUEST_COLUMNS}
        data={filteredData}
        label={t('print')}
      />
    </Box>
  );

  const tabCounts = PARTNER_TAB_TILE_COUNTS[activeTab];

  const dashboard = (
    <Box w='full' mb={2}>
      <Flex justify='flex-end' mb={3}>
        <Flex bg='white' p='6px' borderRadius='30px' border='1.5px solid #D1D5DB' boxShadow='0px 1px 4px rgba(0,0,0,0.06)' align='center' gap='6px'>
          {PARTNER_REQUEST_TABS.map((tab) => {
            const isTabActive = activeTab === tab;
            return (
              <Box
                key={tab}
                onClick={() => setActiveTab(tab)}
                cursor='pointer'
                px='28px'
                py='10px'
                borderRadius='40px'
                bg={isTabActive ? '#FFE48F' : 'transparent'}
                fontWeight={isTabActive ? '700' : '500'}
                color='#111'
                transition='all 0.2s'
              >
                {tab}
              </Box>
            );
          })}
        </Flex>
      </Flex>

      <Flex align='center' gap='8px' mb={3} wrap='wrap'>
        <Box w='180px'>
          <FormController
            type='select'
            name='district'
            control={control}
            errors={errors}
            items={KERALA_DISTRICTS}
            isSearchable
            onOptionSelect={(op) => setSelectedDistrict(op?.id ?? '')}
          />
        </Box>
        {DATE_FILTERS.map((f) => (
          <Box
            key={f.key}
            px='16px'
            py='7px'
            borderRadius='full'
            border='1.5px solid'
            borderColor={activeFilter === f.key ? '#8D0247' : '#D1D5DB'}
            bg={activeFilter === f.key ? '#8D0247' : 'white'}
            color={activeFilter === f.key ? 'white' : '#374151'}
            fontSize='13px'
            fontWeight='500'
            cursor='pointer'
            transition='all 0.2s'
            onClick={() => setActiveFilter(activeFilter === f.key ? null : f.key)}
          >
            {f.label}
          </Box>
        ))}
        {activeFilter === 'custom' && (
          <Flex align='center' gap='8px'>
            <Input
              type='date'
              size='sm'
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              borderRadius='8px'
              borderColor='#D1D5DB'
              fontSize='13px'
              w='150px'
            />
            <Text fontSize='13px' color='#6B7280'>to</Text>
            <Input
              type='date'
              size='sm'
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              borderRadius='8px'
              borderColor='#D1D5DB'
              fontSize='13px'
              w='150px'
            />
          </Flex>
        )}
        <Box ml='auto' w='160px'>
          <FormController
            type='select'
            name='status'
            control={control}
            errors={errors}
            items={STATUS_OPTIONS}
            onOptionSelect={(op) => setActiveKey(op?.id ?? 'total')}
          />
        </Box>
      </Flex>

      <HStack spacing={4} w='full'>
        {PARTNER_REQUEST_TILE_CARDS.map((card) => {
          const count = tabCounts[card.key];
          const percentage = tabCounts[`${card.key}Pct`];
          const trendColor = card.chartColor;

          return (
            <Box
              key={card.key}
              flex={1}
              bg='white'
              p={5}
              borderRadius='16px'
              boxShadow='0px 2px 12px rgba(0, 0, 0, 0.08)'
              border='1.5px solid #E2E8F0'
              cursor='pointer'
              onClick={() => setActiveKey(card.key)}
              transition='all 0.2s'
              _hover={{ transform: 'translateY(-3px)', boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.12)' }}
            >
              <Flex justify='space-between' align='flex-start' mb={3}>
                <Text fontSize='16px' fontWeight='700' color='#374151'>
                  {card.label}
                </Text>
                <WaveChart id={card.key} isIncrease={card.isIncrease} />
              </Flex>

              <Text fontSize='28px' fontWeight='700' color='#8D0247' mb={3} lineHeight='1'>
                {count}
              </Text>

              <Flex justify='flex-end' align='center' gap='6px'>
                <Box w='8px' h='8px' borderRadius='full' bg={trendColor} flexShrink={0} />
                <Text fontSize='20px' fontWeight='700' color={trendColor}>
                  {percentage}%
                </Text>
              </Flex>
            </Box>
          );
        })}
      </HStack>
    </Box>
  );

  return (
    <GenericPageTable
      pageTitle={t('partnerRequests')}
      fetchAction={fetchPartnerRequestList}
      tableKey={SERVER_SIDE_TABLE_KEYS.PARTNER_REQUEST_LIST}
      dataSelector={() => ({})}
      columns={PARTNER_REQUEST_COLUMNS}
      data={filteredData}
      actions={actions}
      headerContent={dashboard}
    />
  );
};

export default PartnerRequestList;
