import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  Button,
  Controller,
  Flex,
  FormController,
  HStack,
  Icons,
  Popup,
  SimpleGrid,
  Text,
  useForm
} from '@kfonbss/bss-ui-components';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import * as yup from 'yup';

import { Close, Save } from '@/components/custom';
import { getDistrict } from '@/features/common/selectors';
import { fetchAllRoles, fetchStockStatusDropdown, fetchUsersByRoleId } from '@/features/inventory/actions';
import { useDeviceDropdowns } from '@/features/inventory/hooks/useDeviceDropdowns';
import { getAllRoles, getStockStatusDropdown, getUsersByRoleId } from '@/features/inventory/selectors';

const { TickSuccessIcon } = Icons;

const TERM_OPTIONS = [
  { label: 'Last 1 Month', value: '1m' },
  { label: 'Last 3 Months', value: '3m' },
  { label: 'Last 6 Months', value: '6m' },
  { label: 'Last 12 Months', value: '12m' }
];

const DEVICE_COLORS = {
  OLT: '#E94E77',
  Switch: '#2FB8C6',
  Router: '#8B7FD6',
  SFP: '#5BBF95',
  'Media Converter': '#5B8CB8',
  'Fiber Patch Cord': '#F5B93B'
};

const PALETTE = [
  '#E94E77',
  '#2FB8C6',
  '#8B7FD6',
  '#5BBF95',
  '#5B8CB8',
  '#F5B93B',
  '#F97316',
  '#06B6D4',
  '#84CC16',
  '#EC4899',
  '#14B8A6',
  '#A78BFA',
  '#FB923C',
  '#34D399',
  '#60A5FA',
  '#F472B6',
  '#4ADE80',
  '#FBBF24'
];

const getDeviceColor = (label = '') => {
  if (DEVICE_COLORS[label]) return DEVICE_COLORS[label];
  let hash = 0;
  for (let i = 0; i < label.length; i++) hash = label.charCodeAt(i) + ((hash << 5) - hash);
  return PALETTE[Math.abs(hash) % PALETTE.length];
};

const STATUS_COLORS = {
  'In Use': '#4ADE80',
  'Not In Use': '#FBBF24',
  Faulty: '#F472B6',
  'In Transit': '#3B82F6',
  'Sent to OEM': '#A855F7',
  Refurbished: '#0EA5E9',
  Replaced: '#D946EF'
};

const getStatusColor = (name = '') => STATUS_COLORS[name] ?? getDeviceColor(name);

const filterSchema = yup.object({
  districts: yup.array(),
  term: yup.string().nullable(),
  fromDate: yup.string().nullable(),
  toDate: yup.string().nullable(),
  deviceTypes: yup.array(),
  vendors: yup.array(),
  statuses: yup.array(),
  custodianRole: yup.object().nullable(),
  custodianPerson: yup.object().nullable()
});

const toggleValue = (arr, val) => (arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val]);

/* ── selectable card — same pattern as crm/FilterPopup ── */
const SelectableCard = ({ label, color, isSelected, onClick, type = 'dot' }) => (
  <Box
    onClick={onClick}
    cursor='pointer'
    border='1px solid'
    borderColor={isSelected ? '#10B981' : 'gray.200'}
    borderRadius='12px'
    p={3}
    bg='white'
    transition='all 0.2s'
    _hover={{ borderColor: isSelected ? '#10B981' : 'gray.300', shadow: 'sm' }}
    display='flex'
    alignItems='center'
    justifyContent='space-between'
    h='44px'
  >
    <Flex alignItems='center'>
      <Box
        w={type === 'dot' ? '10px' : '12px'}
        h={type === 'dot' ? '10px' : '12px'}
        borderRadius={type === 'dot' ? 'full' : '2px'}
        bg={color || 'gray.300'}
        mr={2}
        flexShrink={0}
      />
      <Text fontSize='13px' fontWeight='500' color='#1A202C'>
        {label}
      </Text>
    </Flex>
    {isSelected && (
      <Box color='#10B981'>
        <TickSuccessIcon boxSize='20px' />
      </Box>
    )}
  </Box>
);

const EMPTY_DEFAULTS = {
  districts: [],
  term: null,
  fromDate: null,
  toDate: null,
  deviceTypes: [],
  vendors: [],
  statuses: [],
  custodianRole: null,
  custodianPerson: null
};

const FilterModal = ({ isOpen, onClose, onApply }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const allRoles = useSelector(getAllRoles);
  const usersByRoleId = useSelector(getUsersByRoleId);
  const statusList = useSelector(getStockStatusDropdown);
  const districtList = useSelector(getDistrict);
  const { deviceTypes, deviceVendors } = useDeviceDropdowns();

  const { control, handleSubmit, reset, setValue, watch } = useForm({
    mode: 'onChange',
    resolver: yupResolver(filterSchema),
    defaultValues: EMPTY_DEFAULTS
  });

  const termValue = watch('term');
  const selectedRole = watch('custodianRole');

  useEffect(() => {
    dispatch(fetchAllRoles());
    dispatch(fetchStockStatusDropdown());
  }, [dispatch]);

  useEffect(() => {
    if (selectedRole?.id) {
      setValue('custodianPerson', null);
      dispatch(fetchUsersByRoleId({ roleId: selectedRole.id }));
    }
  }, [selectedRole?.id, dispatch, setValue]);

  const handleTermClick = (val) => {
    const next = termValue === val ? null : val;
    setValue('term', next, { shouldDirty: true });
    if (next) {
      const now = new Date();
      const months = { '1m': 1, '3m': 3, '6m': 6, '12m': 12 }[next];
      if (!months) return;
      const from = new Date(now);
      from.setMonth(from.getMonth() - months);
      setValue('fromDate', from.toISOString().slice(0, 10));
      setValue('toDate', now.toISOString().slice(0, 10));
    }
  };

  const onFormSubmit = (data) => {
    onApply(data);
    onClose();
  };

  const handleReset = () => {
    reset(EMPTY_DEFAULTS);
    onApply({});
  };

  return (
    <Popup
      isOpen={isOpen}
      onClose={onClose}
      title={
        <HStack fontSize='24px' fontWeight='600'>
          <Text>{t('add')} </Text>
          <Text color='#FD1C7A'>{t('filter')}</Text>
        </HStack>
      }
      size='xl'
    >
      <Box as='form' onSubmit={handleSubmit(onFormSubmit)} display='flex' flexDirection='column' h='full'>
        <Box px={5} pb={5} overflowY='auto' maxH='60vh' flex='1'>
          {/* Status */}
          <Box mb={6}>
            <Text fontWeight='700' color='gray.500' fontSize='14px' mb={4} textTransform='uppercase'>
              {t('status')}
            </Text>
            <Controller
              name='statuses'
              control={control}
              render={({ field }) => (
                <SimpleGrid columns={3} spacing={3} gap={3}>
                  {(statusList || []).map((opt) => {
                    const code = opt.code ?? opt.id ?? opt.value;
                    const name = opt.name ?? opt.label ?? '';
                    return (
                      <SelectableCard
                        key={code}
                        label={name}
                        color={getStatusColor(name)}
                        isSelected={(field.value || []).includes(code)}
                        onClick={() => field.onChange(toggleValue(field.value || [], code))}
                        type='dot'
                      />
                    );
                  })}
                </SimpleGrid>
              )}
            />
          </Box>

          {/* Device type */}
          <Box mb={6}>
            <Text fontWeight='700' color='gray.500' fontSize='14px' mb={4} textTransform='uppercase'>
              {t('deviceType')}
            </Text>
            <Controller
              name='deviceTypes'
              control={control}
              render={({ field }) => (
                <SimpleGrid columns={3} spacing={3} gap={3}>
                  {(deviceTypes || []).map((opt) => {
                    const id = opt.id ?? opt.value;
                    const name = opt.name ?? opt.label ?? '';
                    return (
                      <SelectableCard
                        key={id}
                        label={name}
                        color={getDeviceColor(name)}
                        isSelected={(field.value || []).includes(id)}
                        onClick={() => field.onChange(toggleValue(field.value || [], id))}
                        type='square'
                      />
                    );
                  })}
                </SimpleGrid>
              )}
            />
          </Box>

          {/* Vendor */}
          <Box mb={6}>
            <Text fontWeight='700' color='gray.500' fontSize='14px' mb={4} textTransform='uppercase'>
              {t('deviceVendor')}
            </Text>
            <Controller
              name='vendors'
              control={control}
              render={({ field }) => (
                <SimpleGrid columns={3} spacing={3} gap={3}>
                  {(deviceVendors || []).map((opt) => {
                    const id = opt.id ?? opt.value;
                    const name = opt.name ?? opt.label ?? '';
                    return (
                      <SelectableCard
                        key={id}
                        label={name}
                        color={getDeviceColor(name)}
                        isSelected={(field.value || []).includes(id)}
                        onClick={() => field.onChange(toggleValue(field.value || [], id))}
                        type='square'
                      />
                    );
                  })}
                </SimpleGrid>
              )}
            />
          </Box>

          {/* Custodian */}
          <Box mb={6}>
            <Text fontWeight='700' color='gray.500' fontSize='14px' mb={4} textTransform='uppercase'>
              {t('custodian')}
            </Text>
            <Flex gap={4}>
              <Box flex={1}>
                <FormController
                  type='select'
                  control={control}
                  name='custodianRole'
                  labelName={t('role')}
                  placeholder={t('choose', { 0: t('role') })}
                  options={allRoles}
                  getOptionLabel={(option) => option?.roleName}
                />
              </Box>
              <Box flex={1}>
                <FormController
                  type='select'
                  control={control}
                  name='custodianPerson'
                  labelName={t('person')}
                  placeholder={t('choose', { 0: t('person') })}
                  options={usersByRoleId}
                  isDisabled={!selectedRole}
                />
              </Box>
            </Flex>
          </Box>

          {/* District */}
          <Box mb={6}>
            <Text fontWeight='700' color='gray.500' fontSize='14px' mb={4} textTransform='uppercase'>
              {t('district')}
            </Text>
            <Controller
              name='districts'
              control={control}
              render={({ field }) => (
                <SimpleGrid columns={4} spacing={3} gap={3}>
                  {(districtList || []).map((d) => (
                    <SelectableCard
                      key={d.id}
                      label={d.name}
                      color='#8D0247'
                      isSelected={(field.value || []).includes(d.id)}
                      onClick={() => field.onChange(toggleValue(field.value || [], d.id))}
                      type='dot'
                    />
                  ))}
                </SimpleGrid>
              )}
            />
          </Box>

          {/* Term presets */}
          <Box mb={6}>
            <Text fontWeight='700' color='gray.500' fontSize='14px' mb={4} textTransform='uppercase'>
              {t('term')}
            </Text>
            <SimpleGrid columns={4} spacing={3} gap={3}>
              {TERM_OPTIONS.map((opt) => (
                <SelectableCard
                  key={opt.value}
                  label={opt.label}
                  color='#6B1A3D'
                  isSelected={termValue === opt.value}
                  onClick={() => handleTermClick(opt.value)}
                  type='dot'
                />
              ))}
            </SimpleGrid>
          </Box>

          {/* Date range */}
          <SimpleGrid columns={2} gap={6} mb={8}>
            <FormController labelName={t('fromDate')} name='fromDate' control={control} type='date' />
            <FormController labelName={t('toDate')} name='toDate' control={control} type='date' />
          </SimpleGrid>
        </Box>

        <Flex
          gap={4}
          justifyContent='flex-end'
          px={5}
          py={4}
          borderTop='1px solid'
          borderColor='gray.100'
          flexShrink={0}
        >
          <Button variant='link' fontSize='16px' onClick={handleReset} color='primary.500' fontWeight='500' mr='auto'>
            {t('clearAll')}
          </Button>
          <Button variant='outline' borderRadius='full' px={8} onClick={onClose}>
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
            {t('apply')}
            <Save />
          </Button>
        </Flex>
      </Box>
    </Popup>
  );
};

export default FilterModal;
