import { Box, HStack, Text } from '@kfonbss/bss-ui-components';
import { useTranslation } from 'react-i18next';

import { resolveStageIndex, STAGE_COLORS, STAGE_LABEL_KEYS, STAGES } from '../constants';

export const Pill = ({ active, onClick, children }) => (
  <Box
    as='button'
    onClick={onClick}
    px={4}
    py='5px'
    borderRadius='20px'
    border='1.5px solid'
    borderColor={active ? '#7A1C2E' : 'rgba(0,0,0,0.07)'}
    bg={active ? '#7A1C2E' : '#FFFFFF'}
    color={active ? '#FFFFFF' : '#5A5070'}
    fontSize='13px'
    fontWeight='700'
    cursor='pointer'
    _hover={{ borderColor: active ? '#7A1C2E' : '#C0395A', color: active ? '#FFFFFF' : '#7A1C2E' }}
    transition='all 0.13s'
  >
    {children}
  </Box>
);

export const Select = ({ children, ...rest }) => (
  <Box
    as='select'
    px='12px'
    py='5px'
    border='1.5px solid rgba(0,0,0,0.07)'
    borderRadius='20px'
    fontSize='13px'
    color='#5A5070'
    bg='#FFFFFF'
    cursor='pointer'
    outline='none'
    {...rest}
  >
    {children}
  </Box>
);

export const Badge = ({ bg, color, children }) => (
  <Box
    display='inline-flex'
    alignItems='center'
    gap='4px'
    px='9px'
    py='3px'
    borderRadius='20px'
    fontSize='12px'
    fontWeight='700'
    bg={bg}
    color={color}
    whiteSpace='nowrap'
  >
    <Box as='span' w='5px' h='5px' borderRadius='50%' bg='currentColor' flexShrink={0} />
    {children}
  </Box>
);

export const Card = ({ title, headerRight, children, ...rest }) => (
  <Box
    bg='#FFFFFF'
    borderRadius='14px'
    border='1px solid rgba(0,0,0,0.07)'
    p='16px 18px'
    boxShadow='0 2px 8px rgba(0,0,0,0.06)'
    {...rest}
  >
    {(title || headerRight) && (
      <HStack justify='space-between' align='center' mb='14px'>
        {title && (
          <HStack gap='7px' align='center'>
            <Box w='3px' h='14px' borderRadius='2px' bgGradient='linear(to-b, #7A1C2E, #FF8C00)' />
            <Text fontSize='15px' fontWeight='800' color='#1A1030' letterSpacing='-0.1px'>
              {title}
            </Text>
          </HStack>
        )}
        {headerRight}
      </HStack>
    )}
    {children}
  </Box>
);

export const StageBadge = ({ stage }) => {
  const { t } = useTranslation();
  const idx = resolveStageIndex(stage);
  const colors = idx >= 0 ? STAGE_COLORS[idx] : { bg: '#EDEAF5', color: '#5A5070' };
  return (
    <Badge bg={colors.bg} color={colors.color}>
      {idx >= 0 ? t(STAGE_LABEL_KEYS[STAGES[idx]]) : (stage ?? '—')}
    </Badge>
  );
};

export const TypeBadge = ({ type }) =>
  type === 'LNP' ? (
    <Badge bg='#EDFCF9' color='#00C8A8'>
      {type}
    </Badge>
  ) : (
    <Badge bg='#F5F0FF' color='#9B59B6'>
      {type ?? '—'}
    </Badge>
  );

export const StatusBadge = ({ value, kind }) => {
  if (kind === 'link') {
    if (value === 'Active')
      return (
        <Badge bg='#EDFAF4' color='#27AE60'>
          {value}
        </Badge>
      );
    if (value === 'Inactive')
      return (
        <Badge bg='#FFF2F2' color='#C82020'>
          {value}
        </Badge>
      );
    return (
      <Badge bg='#FFF6EE' color='#FF8C00'>
        {value ?? '—'}
      </Badge>
    );
  }
  if (kind === 'frc') {
    return value === 'Received' ? (
      <Badge bg='#EDFAF4' color='#27AE60'>
        {value}
      </Badge>
    ) : (
      <Badge bg='#FFF6EE' color='#FF8C00'>
        {value ?? '—'}
      </Badge>
    );
  }
  return (
    <Badge bg='#EDFAF4' color='#27AE60'>
      {value ?? '—'}
    </Badge>
  );
};

export const DaysBadge = ({ days }) => {
  const c =
    days > 20
      ? { bg: '#FFF2F2', color: '#C82020' }
      : days > 10
        ? { bg: '#FFF6EE', color: '#FF8C00' }
        : { bg: '#EDFAF4', color: '#27AE60' };
  return (
    <Box
      px='9px'
      py='3px'
      borderRadius='20px'
      fontSize='12px'
      fontWeight='700'
      bg={c.bg}
      color={c.color}
      display='inline-block'
    >
      {days}d
    </Box>
  );
};

export const TableHeaderCell = ({ children }) => (
  <Box
    as='th'
    p='9px 12px'
    textAlign='left'
    fontSize='12px'
    fontWeight='800'
    color='#FFFFFF'
    letterSpacing='0.5px'
    textTransform='uppercase'
    whiteSpace='nowrap'
  >
    {children}
  </Box>
);

export const TableCell = ({ children, ...rest }) => (
  <Box as='td' p='9px 12px' color='#1A1030' verticalAlign='middle' fontSize='14px' {...rest}>
    {children}
  </Box>
);

export const PageBtn = ({ active, children, onClick }) => (
  <Box
    as='button'
    onClick={onClick}
    w='28px'
    h='28px'
    borderRadius='6px'
    border='1px solid rgba(0,0,0,0.07)'
    bg={active ? '#7A1C2E' : '#FFFFFF'}
    color={active ? '#FFFFFF' : '#5A5070'}
    fontSize='13px'
    fontWeight='700'
    cursor='pointer'
    display='flex'
    alignItems='center'
    justifyContent='center'
    borderColor={active ? '#7A1C2E' : 'rgba(0,0,0,0.07)'}
    _hover={!active ? { borderColor: '#C0395A', color: '#7A1C2E' } : undefined}
    transition='all 0.13s'
  >
    {children}
  </Box>
);

// Compact numbered pager: « ‹ 1 … n › » with ellipsis around the current page.
export const Pager = ({ page, totalPages, onChange }) => (
  <HStack gap='3px'>
    <PageBtn onClick={() => onChange(1)}>«</PageBtn>
    <PageBtn onClick={() => onChange(Math.max(1, page - 1))}>‹</PageBtn>
    {Array.from({ length: totalPages }, (_, p) => p + 1)
      .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
      .map((p, i, arr) => {
        const prev = arr[i - 1];
        const showEllipsis = prev !== undefined && p - prev > 1;
        return (
          <Box key={p} display='inline-flex' gap='3px' alignItems='center'>
            {showEllipsis && (
              <Text px='4px' color='#9A90A8'>
                …
              </Text>
            )}
            <PageBtn active={p === page} onClick={() => onChange(p)}>
              {p}
            </PageBtn>
          </Box>
        );
      })}
    <PageBtn onClick={() => onChange(Math.min(totalPages, page + 1))}>›</PageBtn>
    <PageBtn onClick={() => onChange(totalPages)}>»</PageBtn>
  </HStack>
);

export const DelayRow = ({ d, accent }) => (
  <HStack
    gap='10px'
    p='9px 13px'
    bg='#FFFFFF'
    borderRadius='10px'
    border='1px solid rgba(0,0,0,0.07)'
    borderLeft={`3px solid ${accent}`}
    mb='7px'
    boxShadow='0 2px 8px rgba(0,0,0,0.06)'
    align='center'
    _hover={{ bg: '#FDF5F7' }}
    transition='background 0.13s'
  >
    <Text fontSize='12px' fontWeight='700' color='#7A1C2E' w='90px' flexShrink={0}>
      {d.id}
    </Text>
    <Box flex={1} minW={0}>
      <Text fontSize='14px' fontWeight='700' color='#1A1030'>
        {d.name}
      </Text>
      <Text fontSize='12px' color='#9A90A8' mt='2px'>
        {d.dist} · {d.stage}
      </Text>
    </Box>
    <Box
      fontSize='14px'
      fontWeight='800'
      px='10px'
      py='3px'
      borderRadius='20px'
      bg={accent === '#E53070' ? '#FFF2F2' : '#FFF6EE'}
      color={accent === '#E53070' ? '#C82020' : '#FF8C00'}
      flexShrink={0}
    >
      {d.days}d
    </Box>
  </HStack>
);

export const KpiBox = ({ iconBg, valueColor, value, label, note, icon }) => (
  <HStack
    bg='#FFFFFF'
    borderRadius='10px'
    border='1px solid rgba(0,0,0,0.07)'
    p='12px 14px'
    gap='10px'
    align='center'
    boxShadow='0 2px 8px rgba(0,0,0,0.06)'
  >
    <Box
      w='38px'
      h='38px'
      borderRadius='9px'
      bg={iconBg}
      display='flex'
      alignItems='center'
      justifyContent='center'
      flexShrink={0}
    >
      {icon}
    </Box>
    <Box>
      <Text fontSize='24px' fontWeight='900' letterSpacing='-0.5px' lineHeight='1' color={valueColor}>
        {value}
      </Text>
      <Text fontSize='12px' fontWeight='600' color='#5A5070' textTransform='uppercase' letterSpacing='0.4px' mt='2px'>
        {label}
      </Text>
      {note && (
        <Text fontSize='12px' color='#9A90A8' mt='1px'>
          {note}
        </Text>
      )}
    </Box>
  </HStack>
);
