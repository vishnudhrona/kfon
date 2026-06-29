import { Box, HStack, Text, VStack } from '@kfonbss/bss-ui-components';

import { AV_COLORS } from './constants';
import { avIndex, initials } from './utils';

export function Avatar({ name, id, size = '38px', borderRadius = '11px' }) {
  const [c1, c2] = AV_COLORS[avIndex(id || name)];
  return (
    <Box
      flexShrink={0}
      w={size} h={size}
      borderRadius={borderRadius}
      background={`linear-gradient(135deg, ${c1}, ${c2})`}
      display="flex" alignItems="center" justifyContent="center"
      color="#fff" fontWeight={700} fontSize="12px"
    >
      {initials(name)}
    </Box>
  );
}

export function Checkbox({ checked, partial }) {
  return (
    <Box
      w="18px" h="18px" borderRadius="5px"
      border="1.7px solid"
      borderColor={checked || partial ? 'primary.500' : 'gray.300'}
      bg={checked || partial ? 'primary.500' : 'white'}
      display="flex" alignItems="center" justifyContent="center"
      flexShrink={0} cursor="pointer" transition="all .12s"
    >
      {checked && (
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 13l4 4L19 7" />
        </svg>
      )}
      {partial && !checked && <Box w="9px" h="2px" bg="white" borderRadius="1px" />}
    </Box>
  );
}

export function EmptyState({ icon, title, desc }) {
  return (
    <VStack p={8} textAlign="center" bg="#fafaff" borderRadius="10px" border="1px dashed" borderColor="gray.100" gap={2}>
      {icon && (
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#9a9aa8" strokeWidth="1.8">
          {icon}
        </svg>
      )}
      <Text fontWeight={700} fontSize="13.5px">{title}</Text>
      {desc && <Text fontSize="12px" color="gray.500">{desc}</Text>}
    </VStack>
  );
}

export function SectionCard({ number, title, subtitle, children, extra }) {
  return (
    <Box
      bg="white" border="1px solid" borderColor="gray.100"
      borderRadius="14px" mb={4}
      boxShadow="0 4px 14px rgba(0,0,0,.04)"
      overflow="hidden"
    >
      <Box px={5} py={3} bg="#fdf8eb" borderBottom="1px solid" borderColor="gray.100">
        <HStack gap={3} flexWrap="wrap">
          <Box
            w="26px" h="26px" borderRadius="7px"
            bg="primary.500" color="#fff"
            display="flex" alignItems="center" justifyContent="center"
            fontWeight={700} fontSize="13px" flexShrink={0}
          >
            {number}
          </Box>
          <Box>
            <HStack gap={2} align="baseline">
              <Text fontWeight={700} fontSize="15px" color="primary.500">{title}</Text>
              {extra}
            </HStack>
            {subtitle && <Text fontSize="11.5px" color="gray.500" mt="1px">{subtitle}</Text>}
          </Box>
        </HStack>
      </Box>
      <Box p={5}>{children}</Box>
    </Box>
  );
}
