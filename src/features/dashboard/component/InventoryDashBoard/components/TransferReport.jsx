import { Box, Flex, HStack, Icons, Text, VStack } from '@kfonbss/bss-ui-components';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import CustodianTag from './CustodianTag';
import SectionLabel from './SectionLabel';
import { STATUS_COLORS, T } from './tokens';
import TypeBadge from './TypeBadge';

const TransferRow = ({ row }) => {
  const { t } = useTranslation();
  const st = STATUS_COLORS[row.status] ?? STATUS_COLORS.pend;

  return (
    <Box
      display='grid'
      gridTemplateColumns='60px 100px minmax(0,1.2fr) 1.5fr 110px 110px 100px'
      gap='10px' alignItems='center'
      bg={T.card} border={`1px solid ${T.line}`} borderRadius='10px' p='12px 18px'
      transition='all 0.15s' cursor='pointer'
      _hover={{ borderColor: T.maroon700, boxShadow: '0 4px 14px -6px rgba(107,26,61,0.15)', transform: 'translateY(-1px)' }}
    >
      <Text fontSize='14px' color={T.maroon800} fontWeight='400'>
        {String(row.no).padStart(2, '0')}
      </Text>
      <TypeBadge type={row.type} />
      <Text fontSize='xs' fontWeight='700' color={T.maroon700}>{row.id}</Text>
      <HStack gap='10px' fontSize='xs'>
        <Box flex='1' minW='0'>
          <HStack gap='4px' mb='1px'>
            <CustodianTag type={row.fromType} />
            <Text fontSize='xs' fontWeight='700' color={T.ink} overflow='hidden' textOverflow='ellipsis' whiteSpace='nowrap'>{row.from}</Text>
          </HStack>
        </Box>
        <Text color={T.maroon700} fontWeight='400' flexShrink={0}>→</Text>
        <Box flex='1' minW='0' textAlign='right'>
          <HStack gap='4px' mb='1px' justify='flex-end'>
            <Text fontSize='xs' fontWeight='700' color={T.ink} overflow='hidden' textOverflow='ellipsis' whiteSpace='nowrap'>{row.to}</Text>
            <CustodianTag type={row.toType} />
          </HStack>
        </Box>
      </HStack>
      <Box>
        <Text fontSize='sm' color={T.ink} fontWeight='400' letterSpacing='-0.1px'>{row.date}</Text>
        <Text fontSize='2xs' color={T.inkFaint} fontWeight='600' display='block' mt='2px' letterSpacing='0.2px' textTransform='uppercase'>{t('initiated')}</Text>
      </Box>
      <Box>
        {row.eta === '—' ? (
          <Text fontSize='xs' color={T.inkFaint}>—</Text>
        ) : (
          <HStack gap='5px' fontSize='sm' color={T.maroon700} fontWeight='400'>
            <Box w='6px' h='6px' borderRadius='50%' bg={T.mint} flexShrink={0} style={{ animation: 'pulse 1.6s infinite' }} />
            <Text>{row.eta}</Text>
          </HStack>
        )}
      </Box>
      <Flex justify='flex-end'>
        <Box px='10px' py='4px' borderRadius='100px' border={`1px solid ${st.border}`} bg={st.bg} fontSize='2xs' fontWeight='800' letterSpacing='0.4px' textTransform='uppercase' color={st.color} whiteSpace='nowrap'>
          {st.label}
        </Box>
      </Flex>
    </Box>
  );
};

const TransferReport = ({ transferList }) => {
  const { t } = useTranslation();
  const [stage, setStage] = useState('all');

  const data = transferList ?? [];
  const rows = stage === 'all' ? data : data.filter((r) => r.status === stage);
  const counts = {
    transit:   data.filter((r) => r.status === 'transit').length,
    dispatch:  data.filter((r) => r.status === 'dispatch').length,
    delivered: data.filter((r) => r.status === 'delivered').length
  };

  const filters = [
    { key: 'all',       label: `All (${data.length})` },
    { key: 'transit',   label: `In Transit (${counts.transit})` },
    { key: 'dispatch',  label: `Dispatched (${counts.dispatch})` },
    { key: 'delivered', label: `Delivered (${counts.delivered})` }
  ];

  return (
    <>
      <SectionLabel
        badge='D'
        title={t('transferReport')}
        meta={`${t('transferReportMeta', { transit: counts.transit, dispatch: counts.dispatch, delivered: counts.delivered })}`}
      />

      <Box bg={T.card} border={`1px solid ${T.line}`} borderRadius='12px' p='10px 14px' mb='14px'>
        <HStack gap='8px' flexWrap='wrap'>
          {filters.map((f) => (
            <Box
              key={f.key} as='button' px='12px' h='34px' borderRadius='8px'
              fontSize='xs' fontWeight='600' cursor='pointer'
              color={stage === f.key ? T.card : T.maroon700}
              bg={stage === f.key ? T.maroon700 : T.card}
              border={`1px solid ${stage === f.key ? T.maroon700 : T.line}`}
              transition='all 0.15s' _hover={{ borderColor: T.maroon700 }}
              onClick={() => setStage(f.key)}
            >
              {f.label}
            </Box>
          ))}
          <Box flex='1' />
          <HStack as='button' gap='6px' bg={T.card} border={`1px solid ${T.line}`} borderRadius='100px' px='14px' h='34px' fontSize='xs' fontWeight='700' color={T.maroon700} cursor='pointer' _hover={{ borderColor: T.maroon700 }}>
            <Icons.DownloadCsv w='11px' h='11px' />
            <Text>CSV</Text>
          </HStack>
        </HStack>
      </Box>

      <Box
        display='grid'
        gridTemplateColumns='60px 100px minmax(0,1.2fr) 1.5fr 110px 110px 100px'
        gap='10px' alignItems='center' px='18px' mb='8px'
        fontSize='2xs' fontWeight='800' letterSpacing='0.8px' textTransform='uppercase' color={T.inkSoft}
      >
        <Text>{t('colNo')}</Text>
        <Text>{t('colType')}</Text>
        <Text>{t('colDeviceId')}</Text>
        <Text>{t('colCustodianTransferTo')}</Text>
        <Text>{t('colDate')}</Text>
        <Text>{t('colEta')}</Text>
        <Text textAlign='right'>{t('colStatus')}</Text>
      </Box>

      <VStack gap='8px' align='stretch'>
        {rows.map((r) => <TransferRow key={r.no} row={r} />)}
      </VStack>
    </>
  );
};

export default TransferReport;
