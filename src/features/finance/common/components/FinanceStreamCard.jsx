import { Box, Flex, Text } from '@kfonbss/bss-ui-components';
import { useTranslation } from 'react-i18next';

import { C, fmtINRShort, shortTitle } from './ReportsShared';

const getChipLabel = (t, chip) =>
  ({
    LNP_RETAIL: t('menu.expenseReport.chipRetail'),
    LNP_ENTERPRISE: t('menu.expenseReport.chipEnterprise'),
    PARTNERS_INCENTIVES: t('menu.expenseReport.chipIncentive'),
    PARTNER_GST_REFUND: t('menu.expenseReport.chipGst'),
    REVENUE_CONTROL: t('menu.expenseReport.chipControl')
  })[chip] || '';

const getChipColors = (code) => {
  switch (code) {
    case 'LNP_RETAIL':
      return { bg: C.roseSoft, color: C.roseDeep };
    case 'LNP_ENTERPRISE':
      return { bg: C.lavenderSoft, color: C.lavenderDeep };
    case 'PARTNERS_INCENTIVES':
      return { bg: C.amberSoft, color: C.amberDeep };
    case 'PARTNER_GST_REFUND':
      return { bg: C.mintSoft, color: C.mintDeep };
    case 'REVENUE_CONTROL':
      return { bg: C.slateSoft, color: C.slateDeep };
    default:
      return { bg: 'transparent', color: 'inherit' };
  }
};

const iconFor = (kind) => {
  const baseStyle = { width: '100%', height: '100%', stroke: 'white', strokeWidth: '2', fill: 'none' };
  switch (kind) {
    case 'LNP_RETAIL':
      return (
        <svg viewBox='0 0 24 24' style={baseStyle}>
          <path d='M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z' />
          <path d='M3 6h18' />
        </svg>
      );
    case 'LNP_ENTERPRISE':
      return (
        <svg viewBox='0 0 24 24' style={baseStyle}>
          <path d='M3 21h18M5 21V7l7-4 7 4v14' />
        </svg>
      );
    case 'AGNP_ENTERPRISE':
      return (
        <svg viewBox='0 0 24 24' style={baseStyle}>
          <circle cx='12' cy='12' r='10' />
          <path d='M2 12h20' />
        </svg>
      );
    case 'PARTNERS_INCENTIVES':
      return (
        <svg viewBox='0 0 24 24' style={baseStyle}>
          <circle cx='12' cy='12' r='10' />
          <path d='M2 12h20' />
        </svg>
      );
    case 'MSP_REVENUE':
      return (
        <svg viewBox='0 0 24 24' style={baseStyle}>
          <circle cx='12' cy='12' r='3' />
          <path d='M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z' />
        </svg>
      );
    case 'VAS_PROVIDER':
      return (
        <svg viewBox='0 0 24 24' style={baseStyle}>
          <polygon points='13 2 3 14 12 14 11 22 21 10 12 10 13 2' />
        </svg>
      );
    case 'REVENUE_DASHBOARD':
      return (
        <svg viewBox='0 0 24 24' style={baseStyle}>
          <path d='M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z' />
          <polyline points='14 2 14 8 20 8' />
        </svg>
      );
    case 'INCENTIVES_SUMMARY':
      return (
        <svg viewBox='0 0 24 24' style={baseStyle}>
          <path d='M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z' />
        </svg>
      );
    case 'PARTNER_GST_REFUND':
      return (
        <svg viewBox='0 0 24 24' style={baseStyle}>
          <path d='M3 12a9 9 0 1018 0 9 9 0 00-18 0z' />
          <path d='M9 12l2 2 4-4' />
        </svg>
      );
    case 'REVENUE_CONTROL':
      return (
        <svg viewBox='0 0 24 24' style={baseStyle}>
          <path d='M22 12h-4l-3 9L9 3l-3 9H2' />
        </svg>
      );
    default:
      return (
        <svg viewBox='0 0 24 24' style={baseStyle}>
          <circle cx='12' cy='12' r='3' />
        </svg>
      );
  }
};

export default function FinanceStreamCard({ onClick, cardData, mainValuePrefix = '₹', footerData = {} }) {
  // Use tokens from the design

  const { t } = useTranslation();

  const isActive = cardData?.active || false;
  const chipLabel = getChipLabel(t, cardData?.code);
  const chipColors = getChipColors(cardData?.code);

  return (
    <Box
      bg='white'
      border='1px solid'
      borderColor={isActive ? C.primary : C.border}
      borderRadius='12px'
      p='12px 14px'
      position='relative'
      overflow='hidden'
      cursor={onClick ? 'pointer' : 'default'}
      minH='126px'
      display='flex'
      flexDirection='column'
      gap='2px'
      boxShadow={isActive ? '0 8px 22px -8px rgba(107,26,61,.2)' : 'none'}
      transition='transform 0.2s, box-shadow 0.2s, border-color 0.2s'
      _hover={{ transform: 'translateY(-2px)', boxShadow: '0 6px 18px rgba(107,26,61,.08)' }}
      onClick={onClick}
    >
      {/* Active top bar */}
      {isActive && <Box position='absolute' top='0' left='0' right='0' h='3px' bg={C.primary} />}

      {/* Card top row */}
      <Flex align='center' gap='9px' position='relative' zIndex='2'>
        <Box
          w='30px'
          h='30px'
          borderRadius='8px'
          bg={C[cardData.icon]}
          display='flex'
          alignItems='center'
          justifyContent='center'
          color='white'
          boxShadow='0 3px 8px rgba(0,0,0,.1)'
          flexShrink='0'
        >
          <Box w='14px' h='14px'>
            {iconFor(cardData.code)}
          </Box>
        </Box>
        <Box flex='1' minW='0' display='flex' flexDirection='column' gap='2px'>
          <Flex align='center' gap='5px' flexWrap='wrap'>
            <Text
              fontSize='11px'
              fontWeight='800'
              color={C.text}
              letterSpacing='0.3px'
              textTransform='uppercase'
              lineHeight='1'
            >
              {cardData?.title}
            </Text>
            {chipLabel && (
              <Box
                bg={chipColors.bg}
                color={chipColors.color}
                fontSize='8.5px'
                fontWeight='800'
                letterSpacing='0.4px'
                textTransform='uppercase'
                px='5px'
                py='1px'
                borderRadius='3px'
                lineHeight='1'
              >
                {chipLabel}
              </Box>
            )}
          </Flex>
          <Text fontSize='9.5px' color={C.mid} fontWeight='500' lineHeight='1'>
            {shortTitle(cardData.title)}
          </Text>
        </Box>
        <Text
          fontSize='10px'
          fontWeight='500'
          letterSpacing='0.5px'
          textTransform='uppercase'
          whiteSpace='nowrap'
          alignSelf='flex-start'
          pt='2px'
          color={'gray.500'}
        >
          {t('menu.expenseReport.statusApr')}
        </Text>
      </Flex>

      {/* Value */}
      <Text fontSize='20px' fontWeight='400' color={C.text} letterSpacing='-0.6px' lineHeight='1' mt='6px'>
        <Text as='span' fontSize='13px' color={C.mid2} mr='1px' opacity='0.75'>
          {mainValuePrefix}
        </Text>
        {fmtINRShort(cardData.total)}
      </Text>

      {/* Secondary Content Row */}
      <Flex align='center' gap='5px' mt='auto' pt='5px' fontSize='9.5px' color={C.mid} position='relative' zIndex='2'>
        {cardData.gst > 0 ? (
          <Box>
            <Text
              as='span'
              bg={C.amberSoft}
              color={C.amberDeep}
              fontSize='8px'
              fontWeight='800'
              letterSpacing='0.4px'
              px='5px'
              py='2px'
              borderRadius='3px'
              textTransform='uppercase'
              mr='4px'
            >
              GST
            </Text>
            <strong>₹{fmtINRShort(cardData.gst)}</strong>
          </Box>
        ) : (
          <Text
            as='span'
            bg={C.amberSoft}
            color={C.amberDeep}
            fontSize='8px'
            fontWeight='800'
            letterSpacing='0.4px'
            px='5px'
            py='2px'
            borderRadius='3px'
            textTransform='uppercase'
          >
            {footerData?.firstLabel}
          </Text>
        )}
        <Box ml='auto'>{footerData?.secondLabel}</Box>
      </Flex>

      {/* Wave */}
      <Box position='absolute' bottom='0' left='0' right='0' h='24px' opacity='0.5' pointerEvents='none' zIndex='1'>
        <svg viewBox='0 0 100 30' preserveAspectRatio='none' style={{ width: '100%', height: '100%' }}>
          <path
            d='M0,22 Q15,8 30,16 T60,10 T100,6 L100,30 L0,30 Z'
            fill={`var(--kfon-wave-${cardData.icon}, ${C[cardData.icon] + '22'})`}
          />
        </svg>
      </Box>
    </Box>
  );
}
