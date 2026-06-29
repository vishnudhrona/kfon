import {
  Box,
  Button,
  Controller,
  Flex,
  FormController,
  Grid,
  GridItem,
  Icons,
  Popup,
  Text,
  useForm
} from '@kfonbss/bss-ui-components';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { Close, FilterIcon, Save } from '@/components/custom';
import { DATE_FORMAT } from '@/constants/date';
import { getServerSideFilterDetails } from '@/features/others/Pagination/selectors';
import { actions as paginationActions } from '@/features/others/Pagination/slice';
import { selectorWithKey } from '@/utils/commonUtils';
import { dayjs, parseDate } from '@/utils/dateUtils';

const { TickSuccessIcon } = Icons;

// Stable helpers outside component — no new ref on each render
const getItemId = (field, item) => item[field.idKey || 'id'];
const getItemLabel = (field, item) => item[field.labelKey || 'name'];

const getChipDefault = (field) => {
  if (!field.single) return [];
  if (field.defaultValue == null) return null;
  return (field.items || []).find((item) => String(getItemId(field, item)) === String(field.defaultValue)) ?? null;
};

const SelectableCard = ({ label, color, isSelected, onClick }) => (
  <Box
    as='button'
    type='button'
    onClick={onClick}
    cursor='pointer'
    border='1px solid'
    borderColor={isSelected ? 'primary.500' : 'gray.200'}
    borderRadius='12px'
    p={4}
    bg='white'
    transition='all 0.2s'
    _hover={{ borderColor: isSelected ? 'primary.500' : 'gray.300' }}
    display='flex'
    alignItems='center'
    justifyContent='space-between'
    h='48px'
    w='full'
  >
    <Flex alignItems='center'>
      {color && <Box w='10px' h='10px' borderRadius='full' bg={color} mr={3} flexShrink={0} />}
      <Text fontSize='16px' fontWeight='500' color='#1A202C'>
        {label}
      </Text>
    </Flex>
    {isSelected && (
      <Box color='green.400'>
        <TickSuccessIcon boxSize='20px' />
      </Box>
    )}
  </Box>
);

/**
 * CommonFilter Component
 *
 * filterConfig field types:
 *   'text'   — plain text input
 *   'select' — single-select dropdown
 *   'date'   — date picker
 *   'radio'  — radio group (FormController)
 *   'chip'   — selectable cards (Figma style)
 *     options:
 *       single: true           — single-select; reset restores defaultValue (default: multi-select)
 *       idKey: 'value'         — item property used as ID (default: 'id')
 *       labelKey: 'label'      — item property used as label (default: 'name')
 *       colors: {'ID': '#hex'} — dot color per item ID
 */
const CommonFilter = ({ filterConfig = [], tableKey, onApplyFilters }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const filterDetails = useSelector(getServerSideFilterDetails);

  const currentFilters = useMemo(() => selectorWithKey(filterDetails, tableKey) || {}, [filterDetails, tableKey]);

  const defaultValues = useMemo(() => {
    const values = {};
    filterConfig.forEach((field) => {
      const storedValue = currentFilters[field.name];

      if (!storedValue) {
        values[field.name] = field.type === 'chip' ? getChipDefault(field) : (field.defaultValue ?? '');
        return;
      }

      if (field.type === 'date') {
        values[field.name] = parseDate(storedValue) ?? '';
      } else if (field.type === 'chip') {
        const items = field.items || [];
        if (field.single) {
          values[field.name] = items.find((item) => String(getItemId(field, item)) === String(storedValue)) ?? null;
        } else {
          const ids = String(storedValue).split(',');
          values[field.name] = items.filter((item) => ids.includes(String(getItemId(field, item))));
        }
      } else if (field.type === 'select' && field.items?.length > 0) {
        const vKey = field.valueKey || field.key;
        const matchingItem = field.items.find((item) => {
          if (vKey && item[vKey] === storedValue) return true;
          return item.id === storedValue || item.value === storedValue || item.name === storedValue;
        });
        values[field.name] = matchingItem || '';
      } else {
        values[field.name] = storedValue;
      }
    });
    return values;
  }, [filterConfig, currentFilters]);

  const { control, handleSubmit, reset, formState: { errors } } = useForm({ defaultValues });

  useEffect(() => {
    if (isOpen) reset(defaultValues);
  }, [isOpen, defaultValues, reset]);

  const onSubmit = (values) => {
    const filteredValues = Object.keys(values).reduce((acc, key) => {
      const value = values[key];
      if (value === '' || value === null || value === undefined) return acc;

      const field = filterConfig.find((f) => f.name === key);

      if (field?.type === 'chip') {
        if (field.single) {
          acc[key] = getItemId(field, value);
        } else {
          if (!Array.isArray(value) || value.length === 0) return acc;
          acc[key] = value.map((v) => getItemId(field, v)).join(',');
        }
      } else if (field?.type === 'date' && value) {
        acc[key] = dayjs(value).format(DATE_FORMAT.DATE_LOCAL);
      } else if (typeof value === 'object' && value !== null) {
        const vKey = field?.valueKey || field?.key;
        acc[key] = vKey && value[vKey] !== undefined ? value[vKey] : (value.id ?? value.value ?? value.name ?? value);
      } else {
        acc[key] = value;
      }

      return acc;
    }, {});

    dispatch(paginationActions.setFilter({ key: tableKey, data: filteredValues }));
    setIsOpen(false);
    onApplyFilters?.(filteredValues);
  };

  const handleReset = () => {
    const resetValues = {};
    filterConfig.forEach((field) => {
      resetValues[field.name] = field.type === 'chip' ? getChipDefault(field) : '';
    });
    reset(resetValues);
    dispatch(paginationActions.resetFilter({ key: tableKey }));
    dispatch(paginationActions.resetPagination({ key: tableKey }));
    setIsOpen(false);
    const submitValues = {};
    filterConfig.forEach((field) => {
      if (field.type === 'chip' && field.single && resetValues[field.name] != null) {
        submitValues[field.name] = getItemId(field, resetValues[field.name]);
      }
    });
    onApplyFilters?.(submitValues);
  };

  const activeFilterCount = filterConfig.filter((field) => {
    const val = currentFilters[field.name];
    return val !== '' && val !== null && val !== undefined;
  }).length;

  if (filterConfig.length === 0) return null;

  return (
    <>
      <Button variant='outline' borderRadius='lg' height='40px' position='relative' onClick={() => setIsOpen(true)}>
        <FilterIcon />
        {t('filter')}
        {activeFilterCount > 0 && (
          <span
            style={{
              position: 'absolute',
              top: '-4px',
              right: '-4px',
              background: 'var(--chakra-colors-primary-500)',
              color: 'white',
              borderRadius: '50%',
              width: '18px',
              height: '18px',
              fontSize: '11px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold'
            }}
          >
            {activeFilterCount}
          </span>
        )}
      </Button>

      <Popup
        isOpen={isOpen}
        onOpenChange={(e) => setIsOpen(e?.open)}
        title={t('add')}
        titleMain={t('filter')}
        size='lg'
        closeButton
        closeOnInteractOutside
      >
        <Box px={5} pb={5} as='form' onSubmit={handleSubmit(onSubmit)}>
          <Grid templateColumns='repeat(2, 1fr)' gap={6}>
            {filterConfig.map((field) => {
              if (field.type === 'chip') {
                return (
                  <GridItem key={field.name} colSpan={2}>
                    <Text fontWeight='700' color='gray.500' fontSize='14px' mb={4} textTransform='uppercase'>
                      {t(field.label)}
                    </Text>
                    <Controller
                      name={field.name}
                      control={control}
                      render={({ field: f }) => (
                        <Grid templateColumns='repeat(2, 1fr)' gap={4}>
                          {(field.items || []).map((opt) => {
                            const optId = getItemId(field, opt);
                            const isSelected = field.single
                              ? f.value != null && getItemId(field, f.value) === optId
                              : (f.value || []).some((v) => getItemId(field, v) === optId);

                            return (
                              <SelectableCard
                                key={optId}
                                label={getItemLabel(field, opt)}
                                color={field.colors?.[optId]}
                                isSelected={isSelected}
                                onClick={() => {
                                  if (field.single) {
                                    f.onChange(isSelected ? null : opt);
                                  } else {
                                    const current = f.value || [];
                                    f.onChange(
                                      isSelected
                                        ? current.filter((v) => getItemId(field, v) !== optId)
                                        : [...current, opt]
                                    );
                                  }
                                }}
                              />
                            );
                          })}
                        </Grid>
                      )}
                    />
                  </GridItem>
                );
              }

              return (
                <GridItem key={field.name} colSpan={field.colSpan || 1}>
                  <FormController
                    name={field.name}
                    control={control}
                    errors={errors}
                    type={field.type}
                    required={field.required || false}
                    labelName={t(field.label)}
                    placeholder={t('choose', { 0: t(field.label) })}
                    items={field.items || []}
                    menuPortalTarget={null}
                    disablePortal={field.type === 'date' || field.type === 'time'}
                    {...(field.props || {})}
                  />
                </GridItem>
              );
            })}
          </Grid>

          <Flex gap={4} justifyContent='flex-end' mt={8}>
            <Button variant='link' fontSize='16px' onClick={handleReset} color='primary.500' fontWeight='500' mr='auto'>
              {t('clearAll')}
            </Button>
            <Button variant='outline' borderRadius='full' px={8} type='button' onClick={() => setIsOpen(false)}>
              <Close />
              {t('cancel')}
            </Button>
            <Button
              type='submit'
              borderRadius='full'
              bg='primary.500'
              color='white'
              px={10}
              _hover={{ bg: 'primary.600' }}
            >
              {t('submit')}
              <Save />
            </Button>
          </Flex>
        </Box>
      </Popup>
    </>
  );
};

export default CommonFilter;
