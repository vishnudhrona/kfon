import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, Flex, FormController, HStack, Icons, Popup, Table, Text, useForm, VStack } from '@kfonbss/bss-ui-components';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import * as yup from 'yup';

import CustomEditIcon from '@/components/custom/CustomEditIcon';
import { warningToast } from '@/components/custom/Toast';
import { SERVER_SIDE_TABLE_KEYS } from '@/constants/server_table';
import { getServerSideData } from '@/features/others/Pagination/selectors';
import { selectorWithKey } from '@/utils/commonUtils';
import { formatDisplayDate } from '@/utils/dateUtils';
import { allowOnlyDigits } from '@/utils/validationUtils';

import {
  fetchPartnerType,
  fetchProvider,
  fetchRevenueShareList,
  fetchSubpackageList,
  fetchSubServiceType,
  submitPlanSubPackage
} from '../action';
import { DISCOUNT_TYPE_LIST } from '../constants';
import {
  getPartnerType,
  getProviders,
  getRevenueShare,
  getSubServiceTypes
} from '../selector';

const { PackageCardIcon, GlobeRoundIcon, ForwardArrowIcon, CirclePlusIcon } = Icons;
const HeaderIcon = PackageCardIcon || GlobeRoundIcon;

const subPackageRowSchema = (t) =>
  yup.object({
    subServiceType: yup
      .mixed()
      .test('required', t('validations.required', { 0: t('serviceType') }), (v) => !!v),
    packageFee: yup
      .string()
      .required(t('validations.required', { 0: t('packageFee') })),
    partnerType: yup.mixed().nullable(),
    provider: yup.mixed().nullable(),
    revenueShare: yup.mixed().nullable(),
    discountType: yup.mixed().nullable(),
    discount: yup.string().nullable(),
    allowOpo: yup.mixed().nullable(),
    remarks: yup.string().nullable()
  });

const pickSpeedDisplay = (data, t) => {
  if (data?.speedInMbps != null) return `${data.speedInMbps} ${t('mbps')}`;
  if (data?.speedInKbps != null) {
    const k = Number(data.speedInKbps);
    if (k >= 1000) return `${k / 1000} ${t('mbps')}`;
    return `${k} ${t('kbps')}`;
  }
  return '—';
};

const formatVolume = (gb, t) => {
  if (gb == null || Number.isNaN(Number(gb))) return '—';
  const v = Number(gb);
  if (v < 1) return `${(v * 1024).toFixed(2)} ${t('mb', { defaultValue: 'MB' })}`;
  return `${v.toLocaleString('en-IN', { maximumFractionDigits: 2 })} ${t('gb', { defaultValue: 'GB' })}`;
};

const SubPackagePopup = ({ isOpen, onClose, packageId, packageData }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [activeRecords, setActiveRecords] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editId, setEditId] = useState(null);

  const subServiceTypes = useSelector(getSubServiceTypes);
  const revenueShareOptions = useSelector(getRevenueShare);
  const partnerTypeOptions = useSelector(getPartnerType);
  const providerOptions = useSelector(getProviders);
  const serverSideData = useSelector(getServerSideData);
  const fetchedSubPackages = useMemo(
    () => selectorWithKey(serverSideData, SERVER_SIDE_TABLE_KEYS.SUB_PACKAGE_LIST_TABLE) || [],
    [serverSideData]
  );

  const defaultValues = {
    subServiceType: null,
    packageFee: '',
    partnerType: null,
    provider: null,
    revenueShare: null,
    discountType: null,
    discount: '',
    allowOpo: false,
    remarks: ''
  };

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
    setValue,
    watch
  } = useForm({
    defaultValues,
    resolver: yupResolver(subPackageRowSchema(t))
  });

  const subServiceTypeValue = watch('subServiceType');
  const partnerTypeValue = watch('partnerType');
  const discountTypeValue = watch('discountType');
  const showPartnerFields = subServiceTypeValue?.partnerMapping === true;
  const showDiscountFields = subServiceTypeValue?.discountable === true;
  const planTypeCode = packageData?.planType?.code || packageData?.planType;
  const isInternetMonthly =
    planTypeCode === 'MONTHLY' && (subServiceTypeValue?.serviceType?.code === 'INTERNET' || subServiceTypeValue?.name === 'INTERNET');
  const showAllowOpo = showPartnerFields || isInternetMonthly;

  useEffect(() => {
    if (!isOpen) return;
    if (packageData?.serviceCategoryId) {
      dispatch(fetchSubServiceType({ serviceCategoryId: packageData.serviceCategoryId }));
    }
    dispatch(fetchPartnerType());
    dispatch(fetchRevenueShareList());
    if (packageId) {
      dispatch(
        fetchSubpackageList({
          packageId,
          key: SERVER_SIDE_TABLE_KEYS.SUB_PACKAGE_LIST_TABLE
        })
      );
    }
  }, [isOpen, dispatch, packageData?.serviceCategoryId, packageId]);

  // Hydrate the table from the fetched (already saved) sub-packages.
  // Looks up the full sub-service-type item from the dropdown so the
  // form's conditional fields (partnerMapping / discountable) can render
  // correctly when the user clicks Edit on a saved row.
  useEffect(() => {
    if (!isOpen) return;
    if (!Array.isArray(fetchedSubPackages) || fetchedSubPackages.length === 0) return;

    const matchSubServiceType = (fetched) => {
      if (!fetched) return null;
      if (!Array.isArray(subServiceTypes) || subServiceTypes.length === 0) return fetched;
      const match = subServiceTypes.find((s) => s?.id === fetched?.id);
      return match || fetched;
    };

    const matchDiscountType = (dt) => {
      if (!dt) return null;
      if (typeof dt === 'object') return dt;
      const match = (DISCOUNT_TYPE_LIST || []).find((d) => d?.name === dt || d?.code === dt);
      return match || { name: dt, code: dt };
    };

    setActiveRecords(
      fetchedSubPackages.map((pkg) => ({
        ...pkg,
        id: pkg.subPackageId ?? pkg.id ?? Date.now() + Math.random(),
        subPackageId: pkg.subPackageId ?? pkg.id ?? null,
        subServiceType: matchSubServiceType(pkg.subServiceCategory ?? pkg.subServiceType),
        packageFee: pkg.packageFee != null ? String(pkg.packageFee) : '',
        partnerType: pkg.partnerType ?? (pkg.partnerTypeId ? { id: pkg.partnerTypeId } : null),
        provider: pkg.provider ?? (pkg.providerId ? { id: pkg.providerId } : null),
        revenueShare: pkg.revenueShare ?? (pkg.revenueShareId ? { id: pkg.revenueShareId } : null),
        discountType: matchDiscountType(pkg.discountType),
        discount: pkg.discount != null ? String(pkg.discount) : '',
        allowOpo: pkg.allowOpo === true,
        remarks: pkg.remarks ?? ''
      }))
    );
  }, [isOpen, fetchedSubPackages, subServiceTypes]);

  useEffect(() => {
    if (partnerTypeValue?.name) {
      dispatch(fetchProvider({ ptype: partnerTypeValue.name }));
    }
  }, [dispatch, partnerTypeValue]);

  // When option arrays load AFTER an Edit click, the form may hold partner /
  // provider / revenue-share values as just `{ id }` from the fetched row.
  // Re-resolve them to the full option object so the select displays the
  // proper label.
  useEffect(() => {
    if (editId == null) return;
    const row = activeRecords.find((r) => r.id === editId);
    if (!row) return;

    if (Array.isArray(partnerTypeOptions) && partnerTypeOptions.length > 0 && row?.partnerType?.id) {
      const matched = partnerTypeOptions.find((p) => p?.id === row.partnerType.id);
      if (matched) setValue('partnerType', matched);
    }
    if (Array.isArray(providerOptions) && providerOptions.length > 0 && row?.provider?.id) {
      const matched = providerOptions.find((p) => p?.id === row.provider.id);
      if (matched) setValue('provider', matched);
    }
    if (Array.isArray(revenueShareOptions) && revenueShareOptions.length > 0 && row?.revenueShare?.id) {
      const matched = revenueShareOptions.find((p) => p?.id === row.revenueShare.id);
      if (matched) setValue('revenueShare', matched);
    }
  }, [editId, activeRecords, partnerTypeOptions, providerOptions, revenueShareOptions, setValue]);

  const selectedDiscountType = useMemo(() => {
    if (!discountTypeValue) return null;
    if (typeof discountTypeValue === 'object') return discountTypeValue.name;
    return discountTypeValue;
  }, [discountTypeValue]);

  const discountFieldLabel =
    selectedDiscountType === 'PERCENTAGE'
      ? t('discountPercentage')
      : selectedDiscountType === 'FLAT'
        ? t('discountFlat')
        : t('discount');

  useEffect(() => {
    if (!isOpen) {
      setActiveRecords([]);
      setIsFormOpen(false);
      setEditId(null);
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const cardAmount = Number(
    packageData?.totalRenewalFee ?? packageData?.renewalFee ?? 0
  );
  const subTotal = useMemo(
    () => activeRecords.reduce((sum, r) => sum + Number(r.packageFee || 0), 0),
    [activeRecords]
  );
  const isMatch = cardAmount > 0 && Math.abs(subTotal - cardAmount) < 0.01;

  const planTitle = packageData?.termPlanLabel
    ? `${packageData.termPlanLabel} ${t('plan', { defaultValue: 'Plan' })}`
    : packageData?.planType?.name
      ? `${packageData.planType.name} ${t('plan', { defaultValue: 'Plan' })}`
      : packageData?.packageName || '—';
  const planCode = packageData?.packageName || packageData?.subServiceName || '';

  const planStats = [
    { label: t('speed'), value: pickSpeedDisplay(packageData, t) },
    {
      label: t('planVolueme', { defaultValue: 'Plan Volume' }),
      value: formatVolume(packageData?.planVolumeGb ?? packageData?.allocatedVolume, t)
    },
    {
      label: t('validity'),
      value: (packageData?.validity ?? packageData?.renewPeriod) != null
        ? `${packageData?.validity ?? packageData?.renewPeriod} ${t('days')}`
        : '—'
    },
    { label: t('fallBackSpeed', { defaultValue: 'Fallback Speed' }), value: packageData?.fallbackSpeed || '—' },
    { label: t('date', { defaultValue: 'Date' }), value: formatDisplayDate(packageData?.createdDate || packageData?.createdOn) || '—' },
    { label: t('subPackages', { defaultValue: 'Sub Packages' }), value: packageData?.subPackageCount ?? 0 }
  ];

  const handleEdit = (row) => {
    setEditId(row.id);
    setIsFormOpen(true);

    // Look up the latest matching dropdown items so the select controls
    // recognise the row's value by reference and the conditional fields
    // (partnerMapping / discountable) render correctly.
    const matchedSST =
      (Array.isArray(subServiceTypes) &&
        subServiceTypes.find((s) => s?.id === row?.subServiceType?.id)) ||
      row?.subServiceType ||
      null;

    const dtValue =
      typeof row?.discountType === 'string' ? row.discountType : row?.discountType?.name;
    const matchedDT = dtValue
      ? (Array.isArray(DISCOUNT_TYPE_LIST) &&
          DISCOUNT_TYPE_LIST.find((d) => d?.name === dtValue || d?.code === dtValue)) ||
        row.discountType
      : null;

    const matchedRS =
      (Array.isArray(revenueShareOptions) &&
        revenueShareOptions.find((r) => r?.id === row?.revenueShare?.id)) ||
      row?.revenueShare ||
      null;

    const matchedPT =
      (Array.isArray(partnerTypeOptions) &&
        partnerTypeOptions.find(
          (p) => p?.id === row?.partnerType?.id || p?.name === row?.partnerType?.name
        )) ||
      row?.partnerType ||
      null;

    const matchedProv =
      (Array.isArray(providerOptions) &&
        providerOptions.find((p) => p?.id === row?.provider?.id)) ||
      row?.provider ||
      null;

    reset({
      subServiceType: matchedSST,
      packageFee: row?.packageFee != null ? String(row.packageFee) : '',
      partnerType: matchedPT,
      provider: matchedProv,
      revenueShare: matchedRS,
      discountType: matchedDT,
      discount: row?.discount != null ? String(row.discount) : '',
      allowOpo: row?.allowOpo === true,
      remarks: row?.remarks ?? ''
    });
  };

  const onSubmitRow = (data) => {
    const enteredFee = Number(data.packageFee) || 0;
    const expectedCount = Number(packageData?.subPackageCount) || 0;

    // Duplicate sub-service-type check (skip the row being edited)
    const dup = activeRecords.find(
      (r) =>
        (editId == null || r.id !== editId) &&
        r.subServiceType?.id != null &&
        data.subServiceType?.id != null &&
        r.subServiceType.id === data.subServiceType.id
    );
    if (dup) {
      warningToast({
        title: t('warning'),
        description: t('duplicateSubServiceType', {
          defaultValue: 'This Sub Service Type is already added. Duplicates are not allowed.'
        })
      });
      return;
    }

    // Count limit
    const projectedCount = editId != null ? activeRecords.length : activeRecords.length + 1;
    if (expectedCount > 0 && projectedCount > expectedCount) {
      warningToast({
        title: t('warning'),
        description: `${t('youCanAddOnly', { defaultValue: 'You can add only' })} ${expectedCount} ${t('Packages', { defaultValue: 'package(s)' })}`
      });
      return;
    }

    // Single sub-package: its fee must equal the card amount
    if (expectedCount === 1 && cardAmount > 0 && Math.abs(enteredFee - cardAmount) >= 0.01) {
      warningToast({
        title: t('warning'),
        description: t('subPackageMismatch', { defaultValue: 'Sub-package total does not match the card amount.' })
      });
      return;
    }

    // Multi sub-package: a single row can't exceed the card amount.
    // (Total balance is auto-redistributed below via rebalance(), so we don't
    // check the projected sum here — the previous row's fee is reassigned to
    // the next row automatically.)
    if (expectedCount > 1 && cardAmount > 0 && enteredFee - cardAmount > 0.01) {
      warningToast({
        title: t('warning'),
        description: `${t('feeCannotExceedCardAmount', { defaultValue: 'Sub-package fee cannot exceed the card amount' })} (₹ ${cardAmount.toFixed(2)}).`
      });
      return;
    }

    // Two-way auto-balance:
    // - If the edited row is the FIRST, balance into row 1.
    // - Otherwise balance into row 0 (the first row absorbs).
    // - All other rows go to 0 so the total always equals cardAmount.
    const rebalance = (rows, editedIndex) => {
      if (cardAmount <= 0 || editedIndex < 0 || editedIndex >= rows.length) return rows;
      const absorbIndex = editedIndex === 0 ? 1 : 0;
      if (absorbIndex >= rows.length) return rows;
      const editedFee = Number(rows[editedIndex]?.packageFee) || 0;
      const balance = Math.max(0, cardAmount - editedFee);
      return rows.map((r, i) => {
        if (i === editedIndex) return r;
        if (i === absorbIndex) return { ...r, packageFee: String(balance.toFixed(2)) };
        return { ...r, packageFee: '0' };
      });
    };

    if (editId != null) {
      setActiveRecords((prev) => {
        const updated = prev.map((r) => (r.id === editId ? { ...r, ...data } : r));
        const idx = updated.findIndex((r) => r.id === editId);
        return rebalance(updated, idx);
      });
      setEditId(null);
    } else {
      setActiveRecords((prev) => {
        const updated = [...prev, { ...data, id: Date.now() }];
        return rebalance(updated, updated.length - 1);
      });
    }
    reset(defaultValues);
    setIsFormOpen(false);
  };

  const handleCancelForm = () => {
    setIsFormOpen(false);
    setEditId(null);
    reset(defaultValues);
  };

  const handleDone = () => {
    const expectedCount = Number(packageData?.subPackageCount) || 0;

    if (activeRecords.length === 0) {
      warningToast({
        title: t('warning'),
        description: t('pleaseAddAtLeastOneSubPackage', { defaultValue: 'Please add at least one sub-package before continuing.' })
      });
      return;
    }
    if (expectedCount > 0 && activeRecords.length !== expectedCount) {
      warningToast({
        title: t('warning'),
        description: `${t('thisPlanRequiresExactly', { defaultValue: 'This plan requires exactly' })} ${expectedCount} ${t('activeSubPackagesAddAll', { defaultValue: 'active sub-packages. Please add all of them.' })}`
      });
      return;
    }
    if (cardAmount > 0 && !isMatch) {
      warningToast({
        title: t('warning'),
        description: t('subPackageMismatch', {
          defaultValue: `Sub-package total (${subTotal.toFixed(2)}) does not match the card amount (${cardAmount.toFixed(2)}).`
        })
      });
      return;
    }

    // Defensive duplicate check
    const seen = new Set();
    for (const r of activeRecords) {
      const id = r?.subServiceType?.id;
      if (id != null) {
        if (seen.has(id)) {
          warningToast({
            title: t('warning'),
            description: t('duplicateSubServiceType', {
              defaultValue: 'Duplicate Sub Service Type found. Each sub-package must use a unique Sub Service Type.'
            })
          });
          return;
        }
        seen.add(id);
      }
    }

    const payload = {
      subPackages: activeRecords.map((item) => ({
        subPackageId: item.subPackageId || null,
        mainPackageId: packageId,
        mainPackage: packageData?.packageName || '',
        packageFee: Number(item.packageFee) || 0,
        subServiceCategoryId: item.subServiceType?.id || null,
        providerId: item.provider?.id || null,
        revenueShareId: item.revenueShare?.id || null,
        partnerTypeId: item.partnerType?.id || null,
        remarks: item.remarks || '',
        discount: Number(item.discount) || 0,
        discountType:
          typeof item.discountType === 'object'
            ? item.discountType?.name || item.discountType?.value || null
            : item.discountType || null,
        frequency: item.frequency ? Number(item.frequency) : 0,
        allowOpo: item.allowOpo === true
      })),
      deletedSubPackageIds: []
    };
    dispatch(
      submitPlanSubPackage({
        packageId,
        type: packageData?.packageType?.code || null,
        details: payload
      })
    );
    onClose?.();
  };

  const columns = useMemo(
    () => [
      {
        header: t('slNo', { defaultValue: 'Sl.No' }),
        accessor: 'slNo',
        cell: (_row, i) => String((i ?? 0) + 1).padStart(2, '0')
      },
      {
        header: t('subServiceType', { defaultValue: 'Service Type' }),
        accessor: 'serviceType',
        cell: (row) =>
          row?.subServiceType?.label ||
          row?.subServiceType?.code ||
          row?.subServiceType?.name ||
          '—'
      },
      {
        header: t('packageFee'),
        accessor: 'packageFee',
        cell: (row) => Number(row.packageFee || 0).toFixed(2)
      },
      { header: t('remarks'), accessor: 'remarks', cell: (row) => row?.remarks || '—' },
      {
        header: t('action'),
        accessor: 'action',
        cell: (row) => <CustomEditIcon onClick={() => handleEdit(row)} />
      }
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t]
  );

  return (
    <Popup
      isOpen={isOpen}
      onOpenChange={(e) => {
        if (!e?.open) onClose?.();
      }}
      size='xl'
      placement='center'
      title={t('subPackages', { defaultValue: 'Sub Packages' })}
      titleMain=''
      contentProps={{ maxW: { base: '95vw', md: '900px' }, mx: 'auto', p: 0 }}
      closeOnInteractOutside={false}
      closeButton
    >
      <VStack alignItems='stretch' p='24px 28px 0' gap='18px'>
        {/* Plan info card */}
        <Box border='1.5px solid' borderColor='gray.200' borderRadius='12px' p='16px 18px'>
          <Flex justify='space-between' align='center' mb='12px' gap='12px' flexWrap='wrap'>
            <HStack gap='10px' align='center'>
              <Box
                w='32px'
                h='32px'
                borderRadius='full'
                border='2px solid #E5E7EB'
                display='flex'
                alignItems='center'
                justifyContent='center'
              >
                {HeaderIcon && <HeaderIcon boxSize='18px' />}
              </Box>
              <Box>
                <HStack gap='6px' align='baseline'>
                  <Text fontSize='15px' fontWeight={700} color='#1A1A2E'>
                    {planTitle}
                  </Text>
                  {planCode && (
                    <Text fontSize='13px' color='#9CA3AF'>
                      {planCode}
                    </Text>
                  )}
                </HStack>
              </Box>
            </HStack>
            <Text fontSize='14px' fontWeight={700} color='#E91E8C'>
              {t('renewalFeeTaxExtra', { defaultValue: 'Renewal Fee (Tax Extra)' })} : ₹ {cardAmount.toFixed(2)}
            </Text>
          </Flex>
          <Box bg='#F4F5F8' borderRadius='8px' p='12px 14px'>
            <Flex gap='12px' wrap='wrap' rowGap='8px'>
              {planStats.map((s, i) => (
                <Box key={i} w='calc(16.66% - 10px)' minW='110px'>
                  <Text fontSize='10px' color='#9CA3AF' textTransform='uppercase' letterSpacing='0.3px' mb='2px'>
                    {s.label}
                  </Text>
                  <Text fontSize='13px' fontWeight={600} color='#1A1A2E'>
                    {s.value}
                  </Text>
                </Box>
              ))}
            </Flex>
          </Box>
        </Box>

        {/* Expandable add-form */}
        {isFormOpen && (
          <Box
            border='2px solid #7B1040'
            borderRadius='12px'
            p='20px 20px 14px'
            bg='white'
            position='relative'
          >
            <Flex justify='space-between' align='center' mb='16px'>
              <HStack gap='8px' align='center'>
                <Box w='4px' h='16px' bg='#7B1040' borderRadius='2px' />
                <Text fontSize='13px' fontWeight={700} color='#7B1040' textTransform='uppercase' letterSpacing='0.6px'>
                  {t('addSubPackageDetails', { defaultValue: 'Add Sub Package Details' })}
                </Text>
              </HStack>
              <Box
                as='button'
                type='button'
                aria-label={t('close', { defaultValue: 'Close' })}
                onClick={handleCancelForm}
                display='flex'
                alignItems='center'
                justifyContent='center'
                w='28px'
                h='28px'
                borderRadius='full'
                bg='transparent'
                color='#7B1040'
                fontSize='18px'
                lineHeight='1'
                cursor='pointer'
                transition='all 0.15s ease'
                _hover={{ bg: '#FDF2F8' }}
              >
                ×
              </Box>
            </Flex>

            <Box as='form' onSubmit={handleSubmit(onSubmitRow)}>
              {/* Row 1: Sub Service Type | Package Fee */}
              <Flex gap='14px' mb='14px' flexWrap='wrap'>
                <Box flex='1 1 calc(50% - 7px)' minW='220px'>
                  <FormController
                    type='select'
                    labelName={t('subServiceType', { defaultValue: 'Service Type' })}
                    placeholder={t('choose', { 0: t('subServiceType') })}
                    name='subServiceType'
                    control={control}
                    errors={errors}
                    items={subServiceTypes}
                    getOptionLabel={(o) => o?.label || o?.name || ''}
                    required
                  />
                </Box>
                <Box flex='1 1 calc(50% - 7px)' minW='220px'>
                  <FormController
                    labelName={t('packageFeeExclusiveofGST', { defaultValue: 'Package Fee (Exclusive of GST)' })}
                    placeholder={t('enter', { 0: t('packageFee') })}
                    name='packageFee'
                    control={control}
                    errors={errors}
                    onKeyDown={allowOnlyDigits}
                    required
                  />
                </Box>
              </Flex>

              {/* Row 2: Partner Type | Provider */}
              {showPartnerFields && (
                <Flex gap='14px' mb='14px' flexWrap='wrap'>
                  <Box flex='1 1 calc(50% - 7px)' minW='220px'>
                    <FormController
                      type='select'
                      labelName={t('partnerType')}
                      placeholder={t('choose', { 0: t('partnerType') })}
                      name='partnerType'
                      control={control}
                      errors={errors}
                      items={partnerTypeOptions}
                      required
                    />
                  </Box>
                  <Box flex='1 1 calc(50% - 7px)' minW='220px'>
                    <FormController
                      type='select'
                      labelName={t('provider')}
                      placeholder={t('choose', { 0: t('provider') })}
                      name='provider'
                      control={control}
                      errors={errors}
                      items={providerOptions}
                      getOptionLabel={(o) => o?.providerName || o?.name || ''}
                      required
                    />
                  </Box>
                </Flex>
              )}

              {/* Row 3: Revenue Share (alone, half width) */}
              {showPartnerFields && (
                <Flex gap='14px' mb='14px' flexWrap='wrap'>
                  <Box flex='1 1 calc(50% - 7px)' minW='220px'>
                    <FormController
                      type='select'
                      labelName={t('revenueShare')}
                      placeholder={t('choose', { 0: t('revenueShare') })}
                      name='revenueShare'
                      control={control}
                      errors={errors}
                      items={revenueShareOptions}
                      required
                    />
                  </Box>
                  <Box flex='1 1 calc(50% - 7px)' minW='220px' />
                </Flex>
              )}

              {/* Row 4: Discount Type | Discount */}
              {showDiscountFields && (
                <Flex gap='14px' mb='14px' flexWrap='wrap'>
                  <Box flex='1 1 calc(50% - 7px)' minW='220px'>
                    <FormController
                      type='select'
                      labelName={t('discountType')}
                      placeholder={t('choose', { 0: t('discountType') })}
                      name='discountType'
                      control={control}
                      errors={errors}
                      items={DISCOUNT_TYPE_LIST}
                      required
                    />
                  </Box>
                  <Box flex='1 1 calc(50% - 7px)' minW='220px'>
                    <FormController
                      labelName={discountFieldLabel}
                      placeholder={t('enter', { 0: discountFieldLabel })}
                      name='discount'
                      control={control}
                      errors={errors}
                      onKeyDown={allowOnlyDigits}
                      required
                    />
                  </Box>
                </Flex>
              )}

              {/* Row 5: Remarks | Allow Opo */}
              <Flex gap='14px' mb='14px' flexWrap='wrap' align='flex-end'>
                <Box flex='1 1 calc(50% - 7px)' minW='220px'>
                  <FormController
                    type='textArea'
                    labelName={t('remarks')}
                    placeholder={t('enter', { 0: t('remarks') })}
                    name='remarks'
                    control={control}
                    errors={errors}
                  />
                </Box>
                <Box flex='1 1 calc(50% - 7px)' minW='220px' pb='10px'>
                  {showAllowOpo && (
                    <FormController
                      type='checkbox'
                      labelName={t('allowOpo', { defaultValue: 'Allow Opo' })}
                      name='allowOpo'
                      control={control}
                      errors={errors}
                    />
                  )}
                </Box>
              </Flex>

              <HStack justifyContent='flex-end' gap='10px'>
                <Button
                  type='submit'
                  variant='outline'
                  borderColor='#7B1040'
                  color='#7B1040'
                  h='36px'
                  px='22px'
                  borderRadius='full'
                  _hover={{ bg: '#7B1040', color: 'white', borderColor: '#7B1040' }}
                >
                  {editId != null ? t('update', { defaultValue: 'Update' }) : t('add', { defaultValue: 'Add' })}
                </Button>
              </HStack>
            </Box>
          </Box>
        )}

        {/* Sub-packages table */}
        <Box border='1px solid' borderColor='gray.200' borderRadius='10px' overflow='hidden'>
          <Table
            headerColor='table_header.primary'
            data={activeRecords}
            columns={columns}
            emptyMessage={t('noSubPackagesYet', { defaultValue: 'No sub-packages added yet' })}
          />
          {activeRecords.length > 0 && (
            <Flex bg='#F4F5F8' px='20px' py='10px' justify='center' align='center' gap='40px'>
              <Text fontSize='14px' fontWeight={700} color='#1A1A2E'>
                {t('total')}
              </Text>
              <Text fontSize='14px' fontWeight={700} color='#1A1A2E'>
                {subTotal.toFixed(2)}
              </Text>
            </Flex>
          )}
        </Box>
      </VStack>

      {/* Footer */}
      <Flex
        justify='space-between'
        align='center'
        p='14px 28px 20px'
        gap='12px'
        flexWrap='wrap'
        mt='8px'
        borderTop='1px solid #E5E7EB'
      >
        {activeRecords.length > 0 && cardAmount > 0 ? (
          isMatch ? (
            <Text fontSize='13px' color='#22C55E' fontWeight={500}>
              ✓ {t('subPackageMatch', { defaultValue: 'Sub-package total matches the card amount.' })}
            </Text>
          ) : (
            <Text fontSize='13px' color='#EF4444' fontWeight={500}>
              ✗ {t('subPackageMismatch', { defaultValue: 'Sub-package total does not match the card amount.' })}
            </Text>
          )
        ) : (
          <Box />
        )}
        <HStack gap='10px'>
          {!isFormOpen && (
            <Button
              variant='outline'
              borderColor='#7B1040'
              color='#7B1040'
              h='38px'
              px='18px'
              borderRadius='full'
              onClick={() => {
                setEditId(null);
                reset(defaultValues);
                setIsFormOpen(true);
              }}
              _hover={{ bg: '#FDF2F8' }}
            >
              {CirclePlusIcon && <CirclePlusIcon boxSize='14px' />} {t('subPackage', { defaultValue: 'Sub Package' })}
            </Button>
          )}
          <Button
            bg='#7B1040'
            color='white'
            h='38px'
            px='22px'
            borderRadius='full'
            _hover={{ bg: '#5A0C2F' }}
            onClick={handleDone}
          >
            {t('done', { defaultValue: 'Done' })} {ForwardArrowIcon && <ForwardArrowIcon boxSize='14px' />}
          </Button>
        </HStack>
      </Flex>
    </Popup>
  );
};

export default SubPackagePopup;
