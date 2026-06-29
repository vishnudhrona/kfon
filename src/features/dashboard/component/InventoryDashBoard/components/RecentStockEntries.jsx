import { Box, HStack, Text, VStack } from '@kfonbss/bss-ui-components';
import { useTranslation } from 'react-i18next';

import SectionLabel from './SectionLabel';
import StatusPill from './StatusPill';
import { STATUS_COLORS, T } from './tokens';
import TypeBadge from './TypeBadge';

const GRID_COLS = '60px 130px 110px 1.2fr 100px 1fr 80px 140px 1fr 110px';

const AllocBar = ({ qty, allocated }) => {
  const pct = qty > 0 ? Math.round((allocated / qty) * 100) : 0;
  return (
    <HStack gap='8px'>
      <Box flex='1' h='6px' borderRadius='100px' bg={T.lineSoft} overflow='hidden'>
        <Box h='100%' w={`${pct}%`} bg={T.teal} />
      </Box>
      <Text fontSize='10px' color={T.inkSoft} fontWeight='600'>
        {allocated}/{qty}
      </Text>
    </HStack>
  );
};

const RecentStockEntries = ({ stockEntries }) => {
  const { t } = useTranslation();
  const entries = stockEntries ?? [];

  return (
    <>
      <SectionLabel badge='G' title={t('recentStockEntries')} meta={t('recentEntriesMeta')} />
      <Box bg={T.card} border={`1px solid ${T.line}`} borderRadius='14px' overflow='hidden'>
        <Box
          display='grid' gridTemplateColumns={GRID_COLS} gap='10px'
          px='18px' py='11px' bg={T.paper} borderBottom={`1px solid ${T.line}`}
          fontSize='9.5px' fontWeight='800' letterSpacing='0.8px' textTransform='uppercase' color={T.inkSoft}
        >
          <Text>{t('colNo')}</Text>
          <Text>{t('colPoNumber')}</Text>
          <Text>{t('colDate')}</Text>
          <Text>{t('colVendor')}</Text>
          <Text>{t('colType')}</Text>
          <Text>{t('colModel')}</Text>
          <Text textAlign='right'>{t('colQty')}</Text>
          <Text>{t('colAllocation')}</Text>
          <Text>{t('colCustodian')}</Text>
          <Text>{t('colStatus')}</Text>
        </Box>

        <VStack gap='0' align='stretch'>
          {entries.map((entry, i) => {
            const st = STATUS_COLORS[entry.status] ?? STATUS_COLORS.pend;
            return (
              <Box
                key={entry.no}
                display='grid' gridTemplateColumns={GRID_COLS} gap='10px'
                px='18px' py='12px' alignItems='center'
                bg={i % 2 === 0 ? T.card : T.paper}
                borderBottom={i < entries.length - 1 ? `1px solid ${T.lineSoft}` : 'none'}
                cursor='pointer' transition='all 0.12s'
                _hover={{ bg: T.yellowBg }}
              >
                <Text fontSize='12px' color={T.inkSoft}>{String(entry.no).padStart(2, '0')}</Text>
                <Text fontSize='11.5px' color={T.maroon700} fontWeight='700'>
                  <Text as='span' color={T.inkSoft} fontWeight='500'>PO-</Text>
                  {entry.po.slice(3)}
                </Text>
                <Text fontSize='13px' color={T.ink} fontWeight='400'>{entry.date}</Text>
                <Text fontSize='12.5px' fontWeight='700' color={T.ink}>{entry.vendor}</Text>
                <TypeBadge type={entry.type} />
                <Text fontSize='11.5px' color={T.inkSoft}>{entry.model}</Text>
                <Text textAlign='right' fontSize='15px' fontWeight='400' color={T.ink}>{entry.qty}</Text>
                <AllocBar qty={entry.qty} allocated={entry.allocated} />
                <Text fontSize='12px' color={T.inkSoft} overflow='hidden' textOverflow='ellipsis' whiteSpace='nowrap'>{entry.custodian}</Text>
                <StatusPill bg={st.bg} color={st.color} border={st.border} label={st.label} dot />
              </Box>
            );
          })}
        </VStack>
      </Box>
    </>
  );
};

export default RecentStockEntries;
