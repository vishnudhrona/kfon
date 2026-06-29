import { Box, Button, Flex, HStack, Text } from '@kfonbss/bss-ui-components';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { MapPinIcon, PlusIcon, XIcon } from './icons';
import { Avatar, Checkbox } from './SharedUI';
import { feName } from './utils';

export default function LNPCard({ lnp, feId, currentFE, seatsById, selected, dispatch, onAttach, onDetach }) {
  const { t } = useTranslation();

  const isOwn = lnp.feId === feId;
  const isOther = Boolean(lnp.feId) && !isOwn;
  const isChecked = selected.has(lnp.id);
  const owner = lnp.feId ? seatsById[lnp.feId] : null;
  const currentFEName = feName(currentFE);

  const handleDetach = useCallback((e) => {
    e.stopPropagation();
    onDetach(lnp.id, lnp.feId);
  }, [onDetach, lnp.id, lnp.feId]);

  const handleAttachOne = useCallback((e) => {
    e.stopPropagation();
    if (lnp.feId === feId) return;
    if (lnp.feId && lnp.feId !== feId) {
      dispatch({ type: 'SHOW_MODAL', ids: [lnp.id] });
    } else {
      onAttach([lnp.id]);
    }
  }, [dispatch, onAttach, lnp.id, lnp.feId, feId]);

  let badge, statusAv, statusText;
  if (isOwn) {
    badge = (
      <Box display="inline-block" fontSize="8.5px" fontWeight={700} px="6px" py="1px" borderRadius="4px" bg="#ffd233" color="#7a0c3e" textTransform="uppercase">
        {t('lnpBadgeAttached')}
      </Box>
    );
    statusAv = <Avatar name={currentFEName || '?'} id={String(currentFE?.id ?? 'own')} size="30px" borderRadius="9px" />;
    statusText = <Text fontWeight={700} fontSize="12.5px">{currentFEName}</Text>;
  } else if (isOther) {
    const ownerName = feName(owner) || t('lnpAnotherFE');
    badge = (
      <Box display="inline-block" fontSize="8.5px" fontWeight={700} px="6px" py="1px" borderRadius="4px" bg="#fff1e8" color="#b85b1c" textTransform="uppercase">
        {t('lnpBadgeOtherFE')}
      </Box>
    );
    statusAv = <Avatar name={ownerName || '?'} id={String(owner?.id ?? lnp.feId)} size="30px" borderRadius="9px" />;
    statusText = <Text fontWeight={700} fontSize="12.5px">{ownerName}</Text>;
  } else {
    badge = (
      <Box display="inline-block" fontSize="8.5px" fontWeight={700} px="6px" py="1px" borderRadius="4px" bg="gray.100" color="gray.500" textTransform="uppercase">
        {t('lnpBadgeUnassigned')}
      </Box>
    );
    statusAv = (
      <Box w="30px" h="30px" borderRadius="9px" bg="gray.100" display="flex" alignItems="center" justifyContent="center" color="gray.400" fontSize="14px" flexShrink={0}>
        —
      </Box>
    );
    statusText = <Text fontSize="12.5px" color="gray.500" fontWeight={600}>{t('lnpNotAssigned')}</Text>;
  }

  return (
    <Flex
      align="center" gap={4} p="12px 14px"
      border="1.5px solid"
      borderColor={isChecked ? 'primary.500' : isOwn ? '#f0d484' : 'gray.100'}
      borderRadius="11px"
      bg={
        isChecked
          ? 'linear-gradient(90deg,#fff5f9,#fff 70%)'
          : isOwn
          ? 'linear-gradient(90deg,#fffaf0,#fff 70%)'
          : 'white'
      }
      boxShadow={isChecked ? '0 4px 12px rgba(122,12,62,.10)' : 'none'}
      cursor="pointer"
      transition="all .15s"
      _hover={{ borderColor: '#e0c0d0', boxShadow: '0 3px 10px rgba(0,0,0,.04)' }}
      onClick={() => dispatch({ type: 'TOGGLE_ONE', id: lnp.id })}
      flexWrap={{ base: 'wrap', md: 'nowrap' }}
    >
      <Checkbox checked={isChecked} />

      {/* Identity */}
      <Box flex={1.5} minW={0}>
        <HStack gap={2} mb="3px">
          <Box
            fontSize="10.5px" fontWeight={700}
            color="primary.500" bg="#fff5f9"
            px="7px" py="2px" borderRadius="5px" flexShrink={0}
          >
            {lnp.partnerId || lnp.id}
          </Box>
          <Text fontWeight={700} fontSize="13.5px" truncate>{lnp.name}</Text>
        </HStack>
        <HStack gap="5px">
          <MapPinIcon />
          <Text fontSize="11.5px" color="gray.500" truncate>{lnp.address}</Text>
        </HStack>
      </Box>

      {/* PIN + Mobile */}
      <Flex gap={5} flexShrink={0}>
        {[
          { l: 'PIN', v: lnp.pin },
          { l: 'Mobile', v: lnp.mobile ? `${lnp.mobile.slice(0, 5)} ${lnp.mobile.slice(5)}`.trim() : '—' }
        ].map(({ l, v }) => (
          <Box key={l}>
            <Text fontSize="9px" color="gray.400" textTransform="uppercase" letterSpacing=".4px" fontWeight={700}>{l}</Text>
            <Text fontSize="12px" fontWeight={700} mt="1px" whiteSpace="nowrap">{v}</Text>
          </Box>
        ))}
      </Flex>

      {/* Status / owner */}
      <Flex align="center" gap={2} flex={1} minW={0}>
        {statusAv}
        <Box flex={1} minW={0}>
          <Flex align="center" gap="5px" fontSize="9px" color="gray.400" textTransform="uppercase" letterSpacing=".3px" fontWeight={700} mb="1px">
            {isOwn ? t('lnpAttachedTo') : isOther ? t('lnpCurrentlyWith') : t('lnpStatus')}
            {badge}
          </Flex>
          {statusText}
        </Box>
      </Flex>

      {/* Action */}
      <Box flexShrink={0}>
        {(isOwn || isOther) ? (
          <Button
            size="sm" variant="outline"
            borderColor="#f3c4cc" color="red.500"
            _hover={{ bg: '#fde8eb' }}
            borderRadius="9px"
            onClick={handleDetach}
          >
            <XIcon />
            {t('lnpDetach')}
          </Button>
        ) : (
          <Button
            size="sm"
            bg="linear-gradient(135deg,#b81668,#8a0b4e)"
            color="white"
            _hover={{ filter: 'brightness(1.05)' }}
            boxShadow="0 3px 8px rgba(184,22,104,.25)"
            borderRadius="9px"
            onClick={handleAttachOne}
          >
            <PlusIcon width={12} height={12} />
            {t('lnpAttach')}
          </Button>
        )}
      </Box>
    </Flex>
  );
}
