import { Box, Button, Flex, HStack, Input, Text, VStack } from '@kfonbss/bss-ui-components';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import PaginationComponent from '@/components/custom/Pagination';

import { CheckCircleIcon, PersonCircleIcon, PlusIcon, SearchCircleIcon, SearchIcon } from './icons';
import LNPCard from './LNPCard';
import { Checkbox, EmptyState } from './SharedUI';
import { buildSeatsById, feName } from './utils';

export default function LNPSection({ state, rows, counts, pageMeta, seats, dispatch, onAttach, onDetach }) {
  const { t } = useTranslation();
  const { districtId, feId, selected, searchQ, statusFilter, page, size } = state;

  // Rows are already filtered/paginated server-side
  const filtered = useMemo(() => rows || [], [rows]);
  const ctAtt = counts?.attached ?? 0;
  const ctUna = counts?.unassigned ?? 0;
  const ctAll = counts?.all ?? 0;
  const allChecked = useMemo(() => filtered.length > 0 && filtered.every((l) => selected.has(l.id)), [filtered, selected]);
  const someChecked = useMemo(() => filtered.some((l) => selected.has(l.id)), [filtered, selected]);
  const seatsById = useMemo(() => buildSeatsById(seats), [seats]);
  const currentFE = useMemo(() => seatsById[feId] ?? null, [seatsById, feId]);
  const currentFEName = useMemo(() => feName(currentFE), [currentFE]);

  const onAttachClick = useCallback(() => {
    const ids = Array.from(selected);
    const conflicts = ids.filter((id) => {
      const l = filtered.find((x) => x.id === id);
      return l && l.feId && l.feId !== feId;
    });
    if (conflicts.length > 0) {
      dispatch({ type: 'SHOW_MODAL', ids });
    } else {
      onAttach(ids);
    }
  }, [selected, filtered, feId, dispatch, onAttach]);

  // Early returns AFTER all hooks
  if (!districtId) {
    return (
      <EmptyState
        icon={<CheckCircleIcon />}
        title={t('lnpPickDistrictAndFE')}
        desc={t('lnpPickDistrictAndFEDesc')}
      />
    );
  }
  if (!feId) {
    return (
      <EmptyState
        icon={<PersonCircleIcon />}
        title={t('lnpSelectFE')}
        desc={t('lnpSelectFEDesc')}
      />
    );
  }

  return (
    <VStack align="stretch" gap={4}>
      {/* Toolbar */}
      <Flex gap={3} flexWrap="wrap" align="center">
        <Flex
          flex={1} minW="260px"
          align="center" gap={3}
          bg="gray.50" border="1.5px solid transparent"
          borderRadius="11px" px={4} py="10px"
          _focusWithin={{ bg: 'white', borderColor: 'primary.300', boxShadow: '0 0 0 4px rgba(141,2,71,.08)' }}
          transition="all .15s"
        >
          <SearchIcon />
          <Input
            flex={1}
            placeholder={t('lnpSearchPlaceholder')}
            value={searchQ}
            onChange={(e) => dispatch({ type: 'SET_SEARCH', q: e.target.value })}
            sx={{
              border: 'none',
              outline: 'none',
              background: 'transparent',
              fontSize: '13px',
              height: 'auto',
              padding: 0,
              _focus: { boxShadow: 'none' }
            }}
          />
        </Flex>

        <Flex bg="gray.100" borderRadius="10px" p="4px" gap={0}>
          {[
            { v: 'all', label: t('all'), ct: ctAll },
            { v: 'attached', label: t('lnpAttached'), ct: ctAtt },
            { v: 'unassigned', label: t('lnpUnassigned'), ct: ctUna }
          ].map(({ v, label, ct }) => (
            <Flex
              key={v}
              align="center" gap={2} px={3} py="7px"
              borderRadius="7px" fontSize="11.5px" fontWeight={600}
              cursor="pointer"
              color={statusFilter === v ? 'primary.500' : 'gray.500'}
              bg={statusFilter === v ? 'white' : 'transparent'}
              boxShadow={statusFilter === v ? '0 2px 6px rgba(0,0,0,.06)' : 'none'}
              onClick={() => dispatch({ type: 'SET_STATUS', v })}
              transition="all .12s"
            >
              {label}
              <Box
                bg={statusFilter === v ? '#ffd233' : 'rgba(0,0,0,.06)'}
                color={statusFilter === v ? '#7a0c3e' : 'gray.500'}
                fontSize="10px" fontWeight={700}
                px="6px" py="1px" borderRadius="7px"
              >
                {ct}
              </Box>
            </Flex>
          ))}
        </Flex>
      </Flex>

      {/* Actions bar */}
      <Flex
        align="center" justify="space-between"
        px={4} py="10px"
        bg="linear-gradient(90deg,#fdf8eb,#fff)"
        border="1px solid #f0e8dc"
        borderRadius="10px"
        flexWrap="wrap" gap={3}
      >
        <Flex align="center" gap={2} cursor="pointer" onClick={() => dispatch({ type: 'TOGGLE_ALL', ids: filtered.map((l) => l.id) })}>
          <Checkbox checked={allChecked} partial={someChecked && !allChecked} />
          <Text fontSize="12.5px" fontWeight={600}>
            {allChecked ? t('lnpDeselectAll') : t('lnpSelectAll')}
          </Text>
        </Flex>

        <Text fontSize="12.5px" color="gray.500">
          {selected.size > 0
            ? <>{selected.size} {t('lnpSelected')} · {t('lnpWillAttachTo')} <strong>{currentFEName}</strong></>
            : t('lnpTapToSelect')}
        </Text>

        <HStack gap={2}>
          {selected.size > 0 && (
            <Button variant="outline" size="sm" borderRadius="10px" onClick={() => dispatch({ type: 'CLEAR_SEL' })}>
              {t('clear')}
            </Button>
          )}
          <Button
            size="sm" borderRadius="10px"
            bg="linear-gradient(135deg,#b81668,#8a0b4e)"
            color="white"
            _hover={{ filter: 'brightness(1.05)' }}
            boxShadow="0 6px 14px rgba(184,22,104,.30)"
            disabled={selected.size === 0}
            onClick={onAttachClick}
            px={4}
          >
            <PlusIcon width={13} height={13} />
            {t('lnpAttachBtn')} {selected.size > 0 ? selected.size : ''} {selected.size === 1 ? t('lnp') : t('lnpPlural')}
          </Button>
        </HStack>
      </Flex>

      {/* Cards */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<SearchCircleIcon />}
          title={t('lnpNoMatch')}
          desc={t('lnpNoMatchDesc')}
        />
      ) : (
        <VStack align="stretch" gap={2}>
          {filtered.map((l) => (
            <LNPCard
              key={l.id}
              lnp={l}
              feId={feId}
              currentFE={currentFE}
              seatsById={seatsById}
              selected={selected}
              dispatch={dispatch}
              onAttach={onAttach}
              onDetach={onDetach}
            />
          ))}
        </VStack>
      )}

      {pageMeta?.totalElements > 0 && (
        <PaginationComponent
          page={page + 1}
          totalPages={pageMeta.totalPages}
          itemsPerPage={size}
          totalEntries={pageMeta.totalElements}
          onPageChange={({ page: nextPage, size: nextSize }) =>
            dispatch({ type: 'SET_PAGE', page: nextSize !== size ? 0 : nextPage, size: nextSize })
          }
        />
      )}
    </VStack>
  );
}
