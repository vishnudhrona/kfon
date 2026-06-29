import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, Flex, FormController, HStack,  Text, useForm, useWatch  } from "@kfonbss/bss-ui-components"; // SimpleGrid still used for module selector
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import { CirclePlusIcon, Close, DeleteIcon } from "@/components/custom";
import CustomEditIcon from "@/components/custom/CustomEditIcon";
import SplashLoader from "@/components/custom/SplashLoader";
import { errorToast } from "@/components/custom/Toast";
import { getApiProgress } from "@/features/others/ApiProgress/selectors";

import { ACTION_TYPES, clearSeatsByRoles, clearStageConfig, clearWorkflowSubtypes, deleteStageConfig, fetchAllRole, fetchSeatsByRoles, fetchStageConfig, fetchWorkflowSubtypes, fetchWorkflowTypes, saveStageConfig, updateStageConfig } from "../action";
import { getAllRole, getSeatsByRoles, getStageConfig, getWorkflowSubtypes, getWorkflowTypes } from "../selector";
import { moduleWorkflowValidation } from "../validation";

const MAX_VISIBLE_CHIPS = 1;

const TruncatedMultiValue = (props) => {
  const total = props.selectProps?.value?.length ?? 0;
  if (total > MAX_VISIBLE_CHIPS) return null;
  const { data, removeProps } = props;
  return (
    <Box
      display='inline-flex'
      alignItems='center'
      gap='4px'
      bg='#FCF0F5'
      color='#8B1A4A'
      border='1px solid #F4C0D1'
      borderRadius='full'
      px='8px'
      py='2px'
      mr='4px'
      my='2px'
      fontSize='12px'
      fontWeight='500'
      maxW='160px'
      whiteSpace='nowrap'
      overflow='hidden'
      textOverflow='ellipsis'
    >
      <Box as='span' overflow='hidden' textOverflow='ellipsis'>
        {data?.name || data?.label}
      </Box>
      <Box
        as='span'
        cursor='pointer'
        fontSize='14px'
        lineHeight='1'
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
          removeProps?.onClick?.(e);
        }}
      >
        ×
      </Box>
    </Box>
  );
};

const CheckboxOption = (props) => {
  const { isSelected, label, innerRef, innerProps, isFocused } = props;
  return (
    <Box
      ref={innerRef}
      {...innerProps}
      px='12px'
      py='8px'
      cursor='pointer'
      display='flex'
      alignItems='center'
      gap='8px'
      bg={isFocused ? '#FDF8EE' : 'transparent'}
      _hover={{ bg: '#FDF8EE' }}
    >
      <Box
        as='span'
        w='16px'
        h='16px'
        border='1.5px solid'
        borderColor={isSelected ? '#8B1A4A' : '#9C978F'}
        bg={isSelected ? '#8B1A4A' : 'transparent'}
        borderRadius='3px'
        display='inline-flex'
        alignItems='center'
        justifyContent='center'
        flexShrink={0}
      >
        {isSelected && (
          <Box as='span' color='white' fontSize='11px' lineHeight='1' fontWeight='bold'>
            ✓
          </Box>
        )}
      </Box>
      <Box as='span' fontSize='14px' color='#1A1714'>
        {label}
      </Box>
    </Box>
  );
};

const TruncatedValueContainer = (props) => {
  const { children, getValue } = props;
  const values = getValue() || [];
  const total = values.length;
  const [chips, input] = Array.isArray(children) ? children : [children, null];
  return (
    <Box display='flex' flexWrap='wrap' alignItems='center' flex={1} px='8px' py='2px'>
      {total > MAX_VISIBLE_CHIPS ? (
        <Box
          as='span'
          bg='#FCF0F5'
          color='#8B1A4A'
          border='1px solid #F4C0D1'
          borderRadius='full'
          px='10px' py='3px'
          mr='4px'
          fontSize='12px'
          fontWeight='600'
        >
          {total} Others selected
        </Box>
      ) : (
        chips
      )}
      {input}
    </Box>
  );
};

const STATUS_STYLES = {
  'open': { bg: '#EBF2FB', color: '#1A4B7A', dot: '#3A7AB5' },
  'enquiry': { bg: '#F2EDF7', color: '#5C2E87', dot: '#7B3FA0' },
  'feasibility': { bg: '#FDF5E0', color: '#7A5800', dot: '#C9963A' },
  'onboarding': { bg: '#FCEDE3', color: '#8B4513', dot: '#D17F3F' },
  'connected': { bg: '#E5F4F1', color: '#0D5C4F', dot: '#1B8E78' },
  'active': { bg: '#EAF5EF', color: '#1D6B4A', dot: '#1D6B4A' }
};

// Flow card top-border accent colors by stage index (cycles)
// Warm-only HTML reference palette: maroon-700, plum-deep, rose-deep, coral-deep, amber-deep, rose
const FLOW_ACCENTS = ['#6b1a3d', '#7a2d5a', '#a8284e', '#a3362f', '#9a7800', '#e94e77'];
const FLOW_NUM_BG = ['#6b1a3d', '#7a2d5a', '#a8284e', '#a3362f', '#9a7800', '#e94e77'];


const hexToRgba = (hex, alpha) => {
  if (!hex || typeof hex !== 'string') return `rgba(139,26,74,${alpha})`;
  const h = hex.replace('#', '');
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const StatusBadge = ({ statusId, statusName, accentColor }) => {
  if (accentColor) {
    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          backgroundColor: hexToRgba(accentColor, 0.12),
          color: accentColor,
          padding: '5px 14px',
          borderRadius: '9999px',
          fontSize: '14px',
          fontWeight: 600,
          width: 'fit-content',
          border: `1px solid ${hexToRgba(accentColor, 0.25)}`
        }}
      >
        <span
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: accentColor,
            flexShrink: 0,
            display: 'inline-block'
          }}
        />
        <span>{statusName || ''}</span>
      </span>
    );
  }
  const s = STATUS_STYLES[statusId] || STATUS_STYLES['open'];
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        backgroundColor: s.bg,
        color: s.color,
        padding: '5px 14px',
        borderRadius: '9999px',
        fontSize: '14px',
        fontWeight: 600,
        width: 'fit-content'
      }}
    >
      <span
        style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: s.dot,
          flexShrink: 0,
          display: 'inline-block'
        }}
      />
      <span>{statusName || ''}</span>
    </span>
  );
};


const StageNode = ({ stage, index, t, onEdit, onDelete, isEditing }) => {
  const accent = FLOW_ACCENTS[index % FLOW_ACCENTS.length];
  const numBg = FLOW_NUM_BG[index % FLOW_NUM_BG.length];
  const statusId = stage?.status?.id;

  return (
    <Box
      position='relative'
      zIndex={1}
      bg={isEditing ? '#fff9e8' : '#ffffff'}
      border='1px solid'
      borderColor={isEditing ? '#6b1a3d' : '#f0e4ea'}
      borderRadius='10px'
      px='14px'
      py='11px'
      _hover={{
        borderColor: accent,
        boxShadow: '0 6px 18px -10px rgba(74,15,42,.25)',
        transform: 'translateX(2px)',
        transition: 'all 0.2s'
      }}
      transition='all 0.2s'
    >
      <Box
        style={{
          display: 'grid',
          gridTemplateColumns: '38px 140px minmax(0, 1.3fr) minmax(0, 1.6fr) auto auto',
          alignItems: 'flex-start',
          columnGap: '12px',
          rowGap: '8px'
        }}
      >
        {/* Numbered bubble */}
        <Box
          w='38px'
          h='38px'
          borderRadius='full'
          bg={numBg}
          color='#ffd557'
          display='flex'
          alignItems='center'
          justifyContent='center'
          fontSize='16px'
          fontWeight='700'
          boxShadow='0 3px 10px -3px rgba(74,15,42,.4), inset 0 1px 0 rgba(255,255,255,.18)'
        >
          {index + 1}
        </Box>

        {/* Stage name */}
        <Box minW='0'>
          <Text fontSize='9px' fontWeight='800' letterSpacing='1.1px' textTransform='uppercase' color={accent} lineHeight='1' opacity={0.85} mb='3px'>
            {t('stage', { defaultValue: 'Stage' })} {String(index + 1).padStart(2, '0')}
          </Text>
          <Text fontSize='16px' fontWeight='700' color='#5a1433' letterSpacing='-0.3px' lineHeight='1.15' noOfLines={1}>
            {stage.stageLabel}
          </Text>
        </Box>

        {/* Role cell */}
        <Box minW='0'>
          <Text fontSize='9px' fontWeight='800' letterSpacing='1px' textTransform='uppercase' color='#a898a0' lineHeight='1' mb='3px' textAlign='left'>
            {t('role')}
          </Text>
          <Flex flexWrap='wrap' gap='4px' justify='flex-start'>
            {(stage.roles || []).slice(0, 3).map((r) => (
              <Text key={r.id} fontSize='12.5px' fontWeight='700' color={accent} noOfLines={1}>
                {r.name}
                {stage.roles?.indexOf(r) < Math.min(stage.roles.length - 1, 2) ? ',' : ''}
              </Text>
            ))}
            {stage.roles?.length > 3 && (
              <Text fontSize='12.5px' fontWeight='700' color='#a898a0'>
                +{stage.roles.length - 3}
              </Text>
            )}
          </Flex>
        </Box>

        {/* Seat cell */}
        <Box minW='0' textAlign='left'>
          <Text fontSize='9px' fontWeight='800' letterSpacing='1px' textTransform='uppercase' color='#a898a0' lineHeight='1' mb='3px' textAlign='left'>
            {t('seat')}
          </Text>
          <Flex flexWrap='wrap' gap='4px' justify='flex-start' textAlign='left'>
            {(stage.seats || []).slice(0, 2).map((s, i, arr) => (
              <Text key={s.id} fontSize='12.5px' fontWeight='700' color='#2b1a26' noOfLines={1} textAlign='left'>
                {s.name}{i < arr.length - 1 ? ',' : ''}
              </Text>
            ))}
            {stage.seats?.length > 2 && (
              <Text fontSize='12.5px' fontWeight='700' color='#a898a0' textAlign='left'>
                +{stage.seats.length - 2}
              </Text>
            )}
          </Flex>
        </Box>

        {/* Status chip */}
        <Box flexShrink={0} ml='0' mt='12px'>
          <StatusBadge statusId={statusId} statusName={stage?.status?.name} accentColor={accent} />
        </Box>

        {/* Actions */}
        <Flex gap='5px' alignItems='center' flexShrink={0} ml='0' mt='6px'>

          <CustomEditIcon onClick={onEdit} />
          <Box
            as='button'
            type='button'
            onClick={onDelete}
            w='28px'
            h='28px'
            borderRadius='7px'
            border='1px solid #f0e4ea'
            bg='#ffffff'
            color='#6b1a3d'
            display='flex'
            alignItems='center'
            justifyContent='center'
            cursor='pointer'
            transition='all 0.18s'
            _hover={{ borderColor: '#a3362f', bg: '#ffe2e4', color: '#a3362f' }}
          >
            <DeleteIcon color='currentColor' />
          </Box>
        </Flex>
      </Box>
    </Box>
  );
};

const ModuleWorkFlow = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [stages, setStages] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const workflowTypes = useSelector(getWorkflowTypes);
  const workflowSubtypes = useSelector(getWorkflowSubtypes);
  const allRoles = useSelector(getAllRole);
  const seatsByRoles = useSelector(getSeatsByRoles);
  const stageConfig = useSelector(getStageConfig);
  const apiProgress = useSelector(getApiProgress);
  const isSaving = !!apiProgress[ACTION_TYPES.SAVE_STAGE_CONFIG] || !!apiProgress[ACTION_TYPES.UPDATE_STAGE_CONFIG];
  const isAnyLoading =
    !!apiProgress[ACTION_TYPES.FETCH_WORKFLOW_TYPES] ||
    !!apiProgress[ACTION_TYPES.FETCH_WORKFLOW_SUBTYPES] ||
    !!apiProgress[ACTION_TYPES.FETCH_ALL_ROLE] ||
    !!apiProgress[ACTION_TYPES.FETCH_SEAT_BY_ROLES] ||
    !!apiProgress[ACTION_TYPES.FETCH_STAGE_CONFIG] ||
    !!apiProgress[ACTION_TYPES.DELETE_STAGE_CONFIG] ||
    isSaving;

  useEffect(() => {
    dispatch(fetchWorkflowTypes());
    dispatch(fetchAllRole());
    return () => {
      dispatch(clearWorkflowSubtypes());
      dispatch(clearSeatsByRoles());
      dispatch(clearStageConfig());
    };
  }, [dispatch]);

  const MODULE_OPTIONS = useMemo(
    () =>
      (workflowTypes || []).map((item) => ({
        id: item?.id ?? item?.code ?? item?.key ?? item?.value ?? item?.name,
        name: item?.name ?? item?.label ?? item?.displayName ?? item?.title ?? ''
      })),
    [workflowTypes]
  );

  const { control, getValues, setValue, trigger, clearErrors, formState: { errors } } = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    resolver: yupResolver(moduleWorkflowValidation(t)),
    defaultValues: { module: null, roles: [], seats: [], status: null }
  });

  const selectedRoles = useWatch({ control, name: 'roles' });
  const selectedSeats = useWatch({ control, name: 'seats' });

  const ROLE_OPTIONS = useMemo(() => {
    const fromApi = allRoles || [];
    const fromApiIds = new Set(fromApi.map((r) => r?.id));
    const extras = (selectedRoles || []).filter((r) => r?.id && !fromApiIds.has(r.id));
    return [...fromApi, ...extras];
  }, [allRoles, selectedRoles]);

  const SEAT_OPTIONS = useMemo(() => {
    const fromApi = (seatsByRoles || []).map((item) => {
      const seatName = item?.name ?? '';
      const empName = item?.empName ?? '';
      const label = seatName && empName ? `${seatName} - ${empName}` : seatName || empName;
      return { id: item?.id, name: label, seatName, empName };
    });
    const fromApiIds = new Set(fromApi.map((s) => s.id));
    const extras = (selectedSeats || [])
      .filter((s) => s?.id && !fromApiIds.has(s.id))
      .map((s) => ({
        id: s.id,
        name: s.name || s.seatName || '',
        seatName: s.seatName || s.name || '',
        empName: s.empName || ''
      }));
    return [...fromApi, ...extras];
  }, [seatsByRoles, selectedSeats]);

  const STATUS_OPTIONS = useMemo(
    () =>
      (workflowSubtypes || []).map((item) => ({
        id: item?.id ?? item?.code ?? item?.key ?? item?.value ?? item?.name,
        name: item?.name ?? item?.label ?? item?.displayName ?? item?.title ?? ''
      })),
    [workflowSubtypes]
  );

  const handleModuleChange = useCallback(
    (option) => {
      const id = typeof option === 'string' ? option : option?.id;
      setValue('roles', []);
      setValue('seats', []);
      setValue('status', null);
      clearErrors(['roles', 'seats', 'status']);
      setStages([]);
      setEditingId(null);
      dispatch(clearSeatsByRoles());
      if (id) {
        dispatch(fetchWorkflowSubtypes({ moduleId: id }));
        dispatch(fetchStageConfig({ id }));
      } else {
        dispatch(clearWorkflowSubtypes());
        dispatch(clearStageConfig());
      }
    },
    [dispatch, setValue, clearErrors]
  );

  const handleRolesChange = useCallback(
    (selected) => {
      const list = Array.isArray(selected) ? selected : selected ? [selected] : [];
      const roleIds = list.map((r) => (typeof r === 'string' ? r : r?.id)).filter(Boolean);
      if (roleIds.length > 0) {
        dispatch(fetchSeatsByRoles({ roleIds }));
      } else {
        dispatch(clearSeatsByRoles());
        setValue('seats', []);
        clearErrors('seats');
      }
    },
    [dispatch, setValue, clearErrors]
  );

  const toIds = useCallback(
    (list) => (Array.isArray(list) ? list.map((it) => (typeof it === 'string' ? it : it?.id)).filter(Boolean) : []),
    []
  );

  // Build local workflow cards strictly from the GET response — no dropdown-data fallbacks.
  useEffect(() => {
    const apiStages = stageConfig?.stages;
    if (!Array.isArray(apiStages)) return;
    if (apiStages.length === 0) {
      setStages([]);
      return;
    }
    const built = apiStages.map((apiStage, idx) => {
      const order = idx + 1;

      const roles = (apiStage?.roles || []).map((roleObj) => ({
        id: roleObj?.id,
        name: roleObj?.name ?? ''
      }));

      const seats = (apiStage?.seats || []).map((seatObj) => {
        const seatName = seatObj?.name ?? '';
        const empName = seatObj?.empName ?? '';
        const label = seatName && empName ? `${seatName} - ${empName}` : seatName;
        return { id: seatObj?.id, name: label, seatName, empName };
      });

      const statusObj = apiStage?.status || {};
      const status = { id: statusObj?.id ?? '', name: statusObj?.name ?? '' };

      return {
        id: apiStage?.id || `local-${order}-${idx}`,
        savedId: apiStage?.id,
        stageNo: order,
        stageLabel: `${t('stage')} ${order}`,
        roles,
        seats,
        status
      };
    });
    setStages(built);
  }, [stageConfig, t]);

  const clearInputRow = useCallback(() => {
    setValue('roles', []);
    setValue('seats', []);
    setValue('status', null);
    clearErrors(['roles', 'seats', 'status']);
  }, [setValue, clearErrors]);

  const handleAddOrUpdate = useCallback(async () => {
    const valid = await trigger(['module', 'roles', 'seats', 'status']);
    if (!valid) return;

    const { module, roles, seats, status } = getValues();
    const workflowTypeId = typeof module === 'string' ? module : module?.id;
    if (!workflowTypeId) {
      errorToast({ description: t('select', { 0: t('module') }) });
      return;
    }

    const statusId = typeof status === 'string' ? status : status?.id;

    if (editingId) {
      const editingStage = stages.find((s) => s.id === editingId);
      setStages((prev) => prev.map((s) => s.id === editingId ? { ...s, roles, seats, status } : s));
      setEditingId(null);
      clearInputRow();

      if (editingStage?.savedId) {
        dispatch(
          updateStageConfig({
            id: editingStage.savedId,
            roleIds: toIds(roles),
            seatIds: toIds(seats),
            statusId,
            stageOrder: editingStage.stageNo,
            onSuccess: () => {
              dispatch(fetchStageConfig({ id: workflowTypeId }));
            }
          })
        );
      }
      return;
    }

    clearInputRow();

    const apiStages = [
      {
        roleIds: toIds(roles),
        seatIds: toIds(seats),
        statusId,
        stageOrder: stages.length + 1
      }
    ];

    dispatch(
      saveStageConfig({
        workflowTypeId,
        stages: apiStages,
        onSuccess: () => {
          dispatch(fetchStageConfig({ id: workflowTypeId }));
        }
      })
    );
  }, [trigger, getValues, clearInputRow, editingId, t, stages, dispatch, toIds]);

  const handleEdit = useCallback((row) => {
    setEditingId(row.id);

    // Preserve the currently selected module — handleEdit must not affect it.
    const currentModule = getValues('module');

    // Resolve each saved value against the current dropdown items so react-select
    // can match by reference/id and show the option as selected.
    const matchedRoles = (row.roles || []).map(
      (r) => ROLE_OPTIONS.find((o) => o.id === r.id) || r
    );
    const matchedSeats = (row.seats || []).map(
      (s) => SEAT_OPTIONS.find((o) => o.id === s.id) || s
    );
    const matchedStatus = row.status?.id
      ? STATUS_OPTIONS.find((o) => o.id === row.status.id) || row.status
      : null;

    setValue('roles', matchedRoles);
    setValue('seats', matchedSeats);
    setValue('status', matchedStatus);

    // Re-apply the module to ensure react-select keeps showing it even if the
    // options array reference changes due to selectedRoles/selectedSeats updates.
    if (currentModule) {
      const matchedModule = MODULE_OPTIONS.find((o) => o.id === currentModule.id) || currentModule;
      setValue('module', matchedModule);
    }

    // Trigger seat fetch so SEAT_OPTIONS hydrates with seats for these roles
    const roleIds = matchedRoles.map((r) => r.id).filter(Boolean);
    if (roleIds.length > 0) {
      dispatch(fetchSeatsByRoles({ roleIds }));
    }
  }, [setValue, getValues, ROLE_OPTIONS, SEAT_OPTIONS, STATUS_OPTIONS, MODULE_OPTIONS, dispatch]);

  const handleCancelEdit = useCallback(() => {
    setEditingId(null);
    clearInputRow();
  }, [clearInputRow]);

  const handleDelete = useCallback((id) => {
    const stage = stages.find((s) => s.id === id);

    if (stage?.savedId) {
      const workflowTypeId = getValues('module')?.id;
      dispatch(
        deleteStageConfig({
          id: stage.savedId,
          onSuccess: () => {
            if (workflowTypeId) {
              dispatch(fetchStageConfig({ id: workflowTypeId }));
            }
          }
        })
      );
      if (editingId === id) {
        setEditingId(null);
        clearInputRow();
      }
      return;
    }

    setStages((prev) =>
      prev.filter((s) => s.id !== id)
        .map((s, idx) => ({ ...s, stageNo: idx + 1, stageLabel: `${t('stage')} ${idx + 1}` }))
    );
    if (editingId === id) { setEditingId(null); clearInputRow(); }
  }, [t, editingId, clearInputRow, stages, dispatch, getValues]);

  const isEditing = !!editingId;

  const selectedModule = useCallback(() => {
    const { module } = getValues();
    if (!module) return null;
    if (typeof module === 'string') {
      return MODULE_OPTIONS.find((m) => m.id === module)?.name || null;
    }
    return module?.name || null;
  }, [getValues, MODULE_OPTIONS]);

  return (
    <Box
      position='relative'
      display='flex' flexDirection='column'
      gap='24px' px='32px' py='28px'
      bg='#fbf7f5'
    >
      {isAnyLoading && (
        <Box
          position='absolute'
          inset={0}
          display='flex'
          alignItems='center'
          justifyContent='center'
          bg='rgba(255, 255, 255, 0.7)'
          zIndex={20}
        >
          <SplashLoader inline />
        </Box>
      )}

      {/* HEADER */}
      <Flex
        justifyContent='space-between' alignItems='center'
        gap='16px' flexWrap='wrap'
        pb='18px' borderBottom='1px solid #f0e4ea'
      >
        <Box>
          <Text
            fontSize='30px' fontWeight='500'
            color='#5a1433' letterSpacing='-0.5px' lineHeight='1.1'
          >
            {t('moduleWorkFlow')}
          </Text>
          <Text fontSize='13px' color='#6f5e6a' mt='4px'>
            {t('moduleWorkflowSubtitle', { defaultValue: 'Design and publish stage sequences that route work through roles, seats and statuses' })}
          </Text>
        </Box>
        {selectedModule() && (
          <HStack
            bg='#6b1a3d' color='#ffd557'
            px='18px' py='8px'
            borderRadius='100px'
            fontSize='12.5px' fontWeight='700'
            letterSpacing='0.3px'
            gap='9px'
            boxShadow='0 6px 16px -6px rgba(107,26,61,0.4)'
          >
            <Box w='9px' h='9px' borderRadius='full' bgGradient='radial(circle at 30% 30%, #ff6a88, #e94e77 60%, #ffd557)' boxShadow='0 0 6px rgba(255,213,87,0.5)' />
            {selectedModule()}
          </HStack>
        )}
      </Flex>

      {/* CONTROL BAR */}
      <Box
        bg='white'
        border='1px solid #f0e4ea'
        borderRadius='14px'
        position='relative'
        overflow='hidden'
        p='18px 22px'
      >
        <Box
          position='absolute' top={0} left={0} right={0}
          h='3px'          
        />

        <Flex gap='14px' alignItems='flex-end' flexWrap='wrap'>
          <Box flex='1.2' minW='200px'>
            <FormController
              placeholder={t('select', { 0: t('module') })}
              labelName={t('module')}
              name='module'
              control={control}
              errors={errors}
              type='select'
              items={MODULE_OPTIONS}
              onOptionSelect={handleModuleChange}
              required
            />
          </Box>
          <Box flex='1' minW='180px'>
            <FormController
              placeholder={t('select', { 0: t('role') })}
              labelName={t('role')}
              name='roles'
              control={control}
              errors={errors}
              type='select'
              items={ROLE_OPTIONS}
              onOptionSelect={handleRolesChange}
              isMulti
              required
              components={{ MultiValue: TruncatedMultiValue, ValueContainer: TruncatedValueContainer, Option: CheckboxOption }}
            />
          </Box>
          <Box flex='1' minW='180px'>
            <FormController
              placeholder={t('select', { 0: t('seat') })}
              labelName={t('seat')}
              name='seats'
              control={control}
              errors={errors}
              type='select'
              items={SEAT_OPTIONS}
              isMulti
              required
              components={{ MultiValue: TruncatedMultiValue, ValueContainer: TruncatedValueContainer, Option: CheckboxOption }}
            />
          </Box>
          <Box flex='1' minW='180px'>
            <FormController
              placeholder={t('select', { 0: t('status') })}
              labelName={t('status')}
              name='status'
              control={control}
              errors={errors}
              type='select'
              items={STATUS_OPTIONS}
              required
            />
          </Box>

          <HStack gap={2}>
            <Button
              type='button'
              variant='outline'
              bg='white'
              color='#6b1a3d'
              borderColor='#6b1a3d'
              borderWidth='1.5px'
              borderRadius='9px'
              h='42px' px='22px'
              fontSize='13px' fontWeight='700'
              _hover={{ bg: '#fff0f4', borderColor: '#5a1433', color: '#5a1433' }}
              onClick={handleAddOrUpdate}
              loading={isSaving}
            >
              <CirclePlusIcon />
              {isEditing ? t('updateStage') : t('addStage')}
            </Button>
            {isEditing && (
              <Button
                type='button'
                variant='outline'
                borderRadius='9px' h='42px'
                borderColor='#f0e4ea' color='#6f5e6a'
                _hover={{ bg: '#f7ecf1' }}
                onClick={handleCancelEdit}
              >
                <Close />
                {t('cancel')}
              </Button>
            )}
          </HStack>
        </Flex>
      </Box>

      {/* WORKFLOW HEADER */}
      <Flex justifyContent='space-between' alignItems='baseline' gap='14px' flexWrap='wrap' mb='-10px'>
        <Text fontSize='22px' fontWeight='500' color='#5a1433' letterSpacing='-0.3px'>
          {t('workflowStages', { defaultValue: 'Workflow Stages' })}
        </Text>
        <HStack gap='10px' fontSize='11px' color='#6f5e6a' fontWeight='600' flexWrap='wrap'>
          <Text as='span'>
            <Text as='span' fontSize='14px' color='#5a1433' fontWeight='400'>{stages.length}</Text>
            {' '}{t('configured', { defaultValue: 'configured' })}
          </Text>
        </HStack>
      </Flex>

      {/* TIMELINE */}
      <Box
        bg='white'
        border='1px solid #f0e4ea'
        borderRadius='16px'
        p='18px 22px'
        position='relative'
        overflow='hidden'
      >
        <Box
          position='absolute' top={0} right={0}
          w='160px' h='160px'
          bgGradient='radial(circle at 100% 0%, rgba(255,213,87,0.15), transparent 65%)'
          pointerEvents='none'
        />

        <Box display='flex' flexDirection='column' gap='8px' position='relative'>
          {/* Dashed spine line aligned with bubble centers */}
          <Box
            position='absolute'
            left='32px' top='30px' bottom='30px'
            w='2px'
            bgImage='repeating-linear-gradient(180deg, #6b1a3d 0, #6b1a3d 3px, transparent 3px, transparent 7px)'
            opacity={0.35}
            zIndex={0}
          />
          {stages.map((s, idx) => (
            <StageNode
              key={s.id}
              stage={s}
              index={idx}
              t={t}
              isEditing={editingId === s.id}
              onEdit={() => handleEdit(s)}
              onDelete={() => handleDelete(s.id)}
            />
          ))}
          {/* Ghost placeholder rows — shown when there are still empty slots */}
          {Array.from({ length: Math.max(4 - stages.length, 0) }).map((_, ghostIdx) => {
            const slotNumber = stages.length + ghostIdx + 1;
            return (
              <Box
                key={`ghost-${ghostIdx}`}
                position='relative'
                zIndex={1}
                cursor='pointer'
                transition='all 0.2s ease'
                _hover={{
                  '& .ghost-card': { borderColor: '#6b1a3d', color: '#6b1a3d', bg: 'rgba(107,26,61,0.02)' },
                  '& .ghost-node': { borderColor: '#6b1a3d', color: '#6b1a3d', bg: '#ffffff' }
                }}
              >
                <Flex
                  className='ghost-card'
                  align='center'
                  gap='18px'
                  bg='transparent'
                  border='1.5px dashed #f0e4ea'
                  borderRadius='10px'
                  px='14px'
                  py='11px'
                  color='#a898a0'
                  fontSize='12.5px'
                  fontWeight='600'
                  transition='all 0.2s ease'
                >
                  <Box
                    className='ghost-node'
                    w='38px'
                    h='38px'
                    borderRadius='full'
                    bg='transparent'
                    color='#a898a0'
                    border='2px dashed #a898a0'
                    display='flex'
                    alignItems='center'
                    justifyContent='center'
                    fontSize='14px'
                    fontWeight='400'
                    flexShrink={0}
                    transition='all 0.2s ease'
                  >
                    {slotNumber}
                  </Box>
                  <Flex align='center' gap='8px'>
                    <CirclePlusIcon style={{ width: '13px', height: '13px' }} />
                    {t('addStage', { defaultValue: 'Add Stage' })} {slotNumber}
                  </Flex>
                </Flex>
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
};

export default ModuleWorkFlow;