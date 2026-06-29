import { Box, Button, HStack, Popup, Text } from '@kfonbss/bss-ui-components';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { WarningIcon } from './icons';
import { feName } from './utils';

export default function ConfirmModal({ show, state, rows, seats, dispatch, onAttach }) {
  const { t } = useTranslation();
  const { feId, pendingIds } = state;

  // All hooks before conditional return
  const currentFE = useMemo(() => seats.find((s) => s.id === feId) ?? null, [seats, feId]);
  const currentFEName = useMemo(() => feName(currentFE), [currentFE]);
  const allRows = useMemo(() => rows || [], [rows]);
  const conflicts = useMemo(
    () => pendingIds.filter((id) => {
      const l = allRows.find((x) => x.id === id);
      return l && l.feId && l.feId !== feId;
    }),
    [pendingIds, allRows, feId]
  );

  if (!show) return null;

  function handleConfirm() {
    onAttach(pendingIds);
  }

  return (
    <Popup
      title={t('lnpReassignTitle')}
      size="sm"
      isOpen={show}
      onOpenChange={(open) => { if (!open) dispatch({ type: 'CLOSE_MODAL' }); }}
      placement="center"
    >
      <Box
        w="54px" h="54px" borderRadius="16px"
        bg="#fff1e8"
        display="flex" alignItems="center" justifyContent="center"
        mb={4}
      >
        <WarningIcon />
      </Box>
      <Text fontSize="13px" color="gray.500" mb={5} lineHeight={1.5}>
        <strong>{conflicts.length}</strong> {t('lnpReassignMsg')} <strong>{currentFEName}</strong>.
      </Text>
      <HStack gap={3}>
        <Button flex={1} variant="ghost" bg="gray.100" borderRadius="10px" onClick={() => dispatch({ type: 'CLOSE_MODAL' })}>
          {t('cancel')}
        </Button>
        <Button
          flex={1}
          bg="linear-gradient(135deg,#b81668,#8a0b4e)"
          color="white"
          borderRadius="10px"
          onClick={handleConfirm}
        >
          {t('lnpYesReassign')}
        </Button>
      </HStack>
    </Popup>
  );
}
