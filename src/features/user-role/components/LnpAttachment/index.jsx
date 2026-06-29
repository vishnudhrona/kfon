import { Box, Text } from '@kfonbss/bss-ui-components';
import { useCallback, useEffect, useMemo, useReducer, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { fetchDistrict } from '@/features/common/actions';
import { getDistrict } from '@/features/common/selectors';

import {
  attachFeLnp,
  clearFeLnpFeUsers,
  clearFeLnpLnpUsers,
  detachFeLnp,
  fetchFeLnpFeUsers,
  fetchFeLnpLnpUsers
} from '../../action';
import { getFeLnpFeUsers, getFeLnpLnpUsers } from '../../selector';
import ConfirmModal from './ConfirmModal';
import { FE_ROLE_NAME, STATUS_API_MAP } from './constants';
import DistrictGrid from './DistrictGrid';
import LNPSection from './LNPSection';
import { INIT, reducer } from './reducer';
import RoleFESection from './RoleFESection';
import { SectionCard } from './SharedUI';
import { feName, mapFeUser, mapLnpRow } from './utils';

export default function LnpAttachment() {
  const { t } = useTranslation();
  const reduxDispatch = useDispatch();

  const rawDistricts = useSelector(getDistrict);
  const districts = useMemo(() => rawDistricts || [], [rawDistricts]);

  const rawFeUsers = useSelector(getFeLnpFeUsers);
  const feUsers = useMemo(() => (rawFeUsers || []).map(mapFeUser), [rawFeUsers]);

  const lnpResponse = useSelector(getFeLnpLnpUsers);
  const lnpRows = useMemo(() => (lnpResponse?.content || []).map(mapLnpRow), [lnpResponse]);
  const counts = useMemo(
    () => ({
      all: lnpResponse?.allCount ?? 0,
      attached: lnpResponse?.attachedCount ?? 0,
      unassigned: lnpResponse?.unassignedCount ?? 0
    }),
    [lnpResponse]
  );
  const pageMeta = useMemo(
    () => ({
      totalPages: lnpResponse?.totalPages ?? 0,
      totalElements: lnpResponse?.totalElements ?? 0
    }),
    [lnpResponse]
  );

  const [state, dispatch] = useReducer(reducer, INIT);

  // Debounce the search box before it drives the API call
  const [debouncedSearch, setDebouncedSearch] = useState('');
  useEffect(() => {
    const id = setTimeout(() => setDebouncedSearch(state.searchQ.trim()), 400);
    return () => clearTimeout(id);
  }, [state.searchQ]);

  // Fetch districts on mount, clear fe/lnp on unmount
  useEffect(() => {
    reduxDispatch(fetchDistrict());
    return () => {
      reduxDispatch(clearFeLnpFeUsers());
      reduxDispatch(clearFeLnpLnpUsers());
    };
  }, [reduxDispatch]);

  // Fetch FE users (fixed role) when district selected
  useEffect(() => {
    if (state.districtId) {
      reduxDispatch(fetchFeLnpFeUsers({ districtId: state.districtId, roleName: FE_ROLE_NAME }));
    } else {
      reduxDispatch(clearFeLnpFeUsers());
    }
  }, [state.districtId, reduxDispatch]);

  const lnpParams = useMemo(
    () => ({
      districtId: state.districtId,
      feUserId: state.feId,
      status: STATUS_API_MAP[state.statusFilter] ?? 'ALL',
      search: debouncedSearch,
      page: state.page,
      size: state.size
    }),
    [state.districtId, state.feId, state.statusFilter, state.page, state.size, debouncedSearch]
  );

  // Fetch LNP users (server-side status/search/pagination) when district + FE selected
  useEffect(() => {
    if (lnpParams.districtId && lnpParams.feUserId) {
      reduxDispatch(fetchFeLnpLnpUsers(lnpParams));
    } else {
      reduxDispatch(clearFeLnpLnpUsers());
    }
  }, [lnpParams, reduxDispatch]);

  const refetchLnp = useCallback(() => {
    if (lnpParams.districtId && lnpParams.feUserId) {
      reduxDispatch(fetchFeLnpLnpUsers(lnpParams));
    }
  }, [lnpParams, reduxDispatch]);

  const onAttach = useCallback(
    (lnpUserIds) => {
      if (!state.feId || !lnpUserIds.length) return;
      reduxDispatch(
        attachFeLnp({
          feUserId: state.feId,
          lnpUserIds,
          onSuccess: () => {
            dispatch({ type: 'CLEAR_SEL' });
            dispatch({ type: 'CLOSE_MODAL' });
            refetchLnp();
          }
        })
      );
    },
    [state.feId, reduxDispatch, refetchLnp]
  );

  const onDetach = useCallback(
    (lnpUserId, ownerFeUserId) => {
      const feUserId = ownerFeUserId || state.feId;
      if (!feUserId) return;
      reduxDispatch(
        detachFeLnp({
          feUserId,
          lnpUserIds: [lnpUserId],
          onSuccess: refetchLnp
        })
      );
    },
    [state.feId, reduxDispatch, refetchLnp]
  );

  const selectedDistrict = useMemo(
    () => districts.find((d) => d.id === state.districtId) ?? null,
    [districts, state.districtId]
  );
  const selectedFE = useMemo(() => feUsers.find((s) => s.id === state.feId) ?? null, [feUsers, state.feId]);

  return (
    <Box>
      {/* A — Districts */}
      <SectionCard number="A" title={t('lnpDistricts')} subtitle={t('lnpDistrictsDesc')}>
        <DistrictGrid districtId={state.districtId} districts={districts} dispatch={dispatch} />
      </SectionCard>

      {/* B — Role + FE */}
      <SectionCard
        number="B"
        title={t('lnpFieldEngineers')}
        subtitle={t('lnpFEDesc')}
        extra={selectedDistrict && (
          <Text fontSize="12px" color="gray.500" fontWeight={500}>— {selectedDistrict.name}</Text>
        )}
      >
        <RoleFESection
          districtId={state.districtId}
          feId={state.feId}
          seats={feUsers}
          dispatch={dispatch}
        />
      </SectionCard>

      {/* C — LNPs */}
      <SectionCard
        number="C"
        title={t('lnpPlural')}
        subtitle={t('lnpSectionDesc')}
        extra={selectedFE && (
          <Text fontSize="12px" color="gray.500" fontWeight={500}>— {feName(selectedFE)}</Text>
        )}
      >
        <LNPSection
          state={state}
          rows={lnpRows}
          counts={counts}
          pageMeta={pageMeta}
          seats={feUsers}
          dispatch={dispatch}
          onAttach={onAttach}
          onDetach={onDetach}
        />
      </SectionCard>

      <ConfirmModal
        show={state.showModal}
        state={state}
        rows={lnpRows}
        seats={feUsers}
        dispatch={dispatch}
        onAttach={onAttach}
      />
    </Box>
  );
}
