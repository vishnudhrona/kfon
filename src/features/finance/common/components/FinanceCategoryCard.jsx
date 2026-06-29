import { Box, Flex, Text } from '@kfonbss/bss-ui-components';

import { C, fmtINRShort } from './ReportsShared';

const getIconSvg = (type) => {
  const strokeStyle = { stroke: 'white', strokeWidth: '2', fill: 'none', width: '18px', height: '18px' };
  if (type === 'lavender') {
    return (
      <svg viewBox='0 0 24 24' style={strokeStyle}>
        <path d='M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2' />
        <circle cx='9' cy='7' r='4' />
      </svg>
    );
  }
  if (type === 'teal') {
    return (
      <svg viewBox='0 0 24 24' style={strokeStyle}>
        <circle cx='12' cy='12' r='10' />
        <path d='M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z' />
      </svg>
    );
  }
  if (type === 'coral') {
    return (
      <svg viewBox='0 0 24 24' style={strokeStyle}>
        <circle cx='12' cy='12' r='3' />
        <path d='M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z' />
      </svg>
    );
  }
  if (type === 'rose') {
    return (
      <svg viewBox='0 0 24 24' width='16' height='16' fill='none' stroke='white' strokeWidth='2'>
        <path d='M3 21h18M5 21V7l7-4 7 4v14' />
      </svg>
    );
  }
  return (
    <svg viewBox='0 0 24 24' style={strokeStyle}>
      <polygon points='12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2' />
    </svg>
  );
};

const FooterMetric = ({ label, value, color, dotColor, borderRight }) => (
  <Flex
    direction='column'
    gap='3px'
    {...(borderRight && {
      pr: '10px',
      borderRight: '1px dashed',
      borderColor: C.line
    })}
  >
    <Flex
      align='center'
      gap='5px'
      fontSize='9.5px'
      fontWeight='800'
      letterSpacing='0.5px'
      textTransform='uppercase'
      color={C.inkSoft}
    >
      {dotColor && <Box w='7px' h='7px' borderRadius='50%' bg={dotColor} />}
      {label}
    </Flex>

    <Text fontSize='17px' fontWeight='600' letterSpacing='-0.3px' lineHeight={1} color={color}>
      <span
        style={{
          fontSize: '12px',
          color: C.inkSoft,
          marginRight: '1px',
          opacity: 0.7
        }}
      >
        ₹
      </span>

      {fmtINRShort(value)}
    </Text>
  </Flex>
);

export default function FinanceCategoryCard({
  mainLabel,
  category,
  mainValuePrefix = '₹',
  footerData: { items = [], progressBar = false } = {}
}) {
  // Use tokens from the design

  const isAlert = category?.alert;

  const pct = Math.round(category.ratio * 100);

  const getPctClass = () => {
    if (pct >= 80) return { color: C.mintDeep, bg: C.mintSoft, border: '#9ad5b8' };
    if (pct >= 60) return { color: C.amberDeep, bg: C.amberSoft, border: '#f5dc99' };
    return { color: C.roseDeep, bg: C.roseSoft, border: '#f5b9cc' };
  };
  const pctStyle = getPctClass();

  return (
    <Box
      bg='white'
      border='1px solid'
      borderColor={isAlert ? '#e94e77' : C.border}
      borderRadius='14px'
      p='16px 18px 18px'
      position='relative'
      overflow='hidden'
      display='flex'
      flexDirection='column'
      gap='14px'
      minH='220px'
      boxShadow={isAlert ? '0 10px 28px -10px rgba(233,78,119,.25)' : 'none'}
      transition='transform 0.25s, box-shadow 0.25s'
      _hover={{ transform: 'translateY(-2px)', boxShadow: '0 8px 20px rgba(107,26,61,.08)' }}
    >
      {isAlert && (
        <Box
          position='absolute'
          top='0'
          left='0'
          right='0'
          h='3px'
          background='linear-gradient(90deg, #e94e77, #d63d64)'
        />
      )}

      {/* Top */}
      <Flex align='flex-start' justify='space-between' gap='10px'>
        <Box
          w='38px'
          h='38px'
          borderRadius='10px'
          bg={C[category?.icon]}
          display='flex'
          alignItems='center'
          justifyContent='center'
          color='white'
          boxShadow='0 4px 10px rgba(0,0,0,.1)'
          flexShrink='0'
        >
          {getIconSvg(category?.icon)}
        </Box>
        <Box flex='1' minW='0' pt='3px'>
          <Text
            fontSize='14px'
            fontWeight='800'
            color={C.text}
            letterSpacing='0.3px'
            textTransform='uppercase'
            lineHeight='1.1'
          >
            {category?.name}
          </Text>
          <Text fontSize='12px' color={C.mid} fontWeight='500' mt='3px'>
            {category?.sub}
          </Text>
        </Box>
        <Box
          px='10px'
          py='4px'
          borderRadius='100px'
          fontSize='17px'
          letterSpacing='-0.3px'
          lineHeight='1'
          border='1px solid'
          borderColor={pctStyle.border}
          color={pctStyle.color}
          bg={pctStyle.bg}
        >
          {pct}%
        </Box>
      </Flex>

      {/* Hero amount */}
      <Box
        p='12px 14px'
        borderRadius='10px'
        bg={isAlert ? '#fff0f4' : C.bg}
        border='1px solid'
        borderColor={isAlert ? '#f5b9cc' : C.border}
      >
        <Text fontSize='11px' fontWeight='800' letterSpacing='0.6px' textTransform='uppercase' color={C.mid} mb='3px'>
          {mainLabel}
        </Text>
        <Text fontSize='29px' letterSpacing='-0.6px' lineHeight='1' color={C.dark}>
          <Text as='span' fontSize='19px' color={C.mid2} mr='1px' opacity='0.7'>
            {mainValuePrefix}
          </Text>
          {fmtINRShort(category?.val || 0)}
        </Text>
      </Box>

      {progressBar && (
        <Box display='flex' flexDirection='column' gap='7px'>
          <Box h='8px' borderRadius='100px' bg={C.lineSoft} overflow='hidden' display='flex'>
            <Box bg={`linear-gradient(90deg, ${C.mint}, #3da070)`} w={`${pct}%`} h='100%' />
            <Box bg={`linear-gradient(90deg, #ff8fa5, ${C.rose})`} w={`${100 - pct}%`} h='100%' />
          </Box>
        </Box>
      )}
      <Box
        display='grid'
        gridTemplateColumns='1fr 1fr'
        gap='12px'
        pt='12px'
        borderTop='1px dashed'
        borderColor={C.line}
        mt='auto'
      >
        {items.length > 0 &&
          items.map((item, index) => <FooterMetric key={index} {...item} borderRight={index !== items.length - 1} />)}
      </Box>
    </Box>
  );
}
