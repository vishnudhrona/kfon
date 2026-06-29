import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, FormController, SimpleGrid, Table, useForm } from '@kfonbss/bss-ui-components';
import { useLocation, useParams } from '@tanstack/react-router';
import { get } from 'lodash-es';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { Save } from '@/components/custom';
import CustomEditIcon from '@/components/custom/CustomEditIcon';
import { warningToast } from '@/components/custom/Toast';
import { mapObjectValues } from '@/utils/commonUtils';
import { allowOnlyDigits } from '@/utils/validationUtils';

import { fetchPackageDetailsById, fetchPartnerType, fetchProvider, fetchRevenueShareList, fetchSubServiceType, submitPlanSubPackage, updatePlanSubPackage } from '../action';
import { DISCOUNT_TYPE_LIST, VISIBLE_COLUMNS_SUB_PACKAGE } from '../constants';
import { getPackagePlandetails, getPartnerType, getProviders, getRevenueShare, getSubServiceTypes } from '../selector';
import { subPackageSchema } from '../validation';
import PackagePreview from './PackagePreview';


const AddSubPackage = ({ packageId: propPackageId, initialSubPackages, isEditAll: propIsEditAll } = {}) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const { state: locationState } = useLocation();
  const routeParams = useParams({ strict: false });
  const packageId = propPackageId ?? routeParams.packageId;

  const effectiveSubPackages = initialSubPackages ?? locationState?.subPackages;
  const effectiveIsEditAll = propIsEditAll ?? locationState?.isEditAll;

  const [activeRecords, setActiveRecords] = useState(() => {
    if (effectiveIsEditAll && effectiveSubPackages) {
      return effectiveSubPackages.map(pkg => ({
        ...pkg,
        id: pkg.subPackageId,
        subServiceType: pkg.subServiceCategory
      }));
    }
    return [];
  });
  const [isEditActive, setIsEditActive] = useState(false);
  const [editIdActive, setEditIdActive] = useState(null);

  const defaultValues = {
    tempId: null,
    subServiceType: null,
    packageFee: '',
    revenueShare: null,
    partnerType: null,
    provider: null,
    discount: '',
    discountType: null,
    remarks: ''
  };

  const {
    control,
    formState: { errors },
    watch,
    handleSubmit,
    reset
  } = useForm({
    resolver: yupResolver(subPackageSchema(t)),
    defaultValues
  });

  const subServiceTypeValue = watch('subServiceType');
  const partnerTypeValue = watch('partnerType');
  const discountTypeValue = watch('discountType');

  const packageDetails = useSelector(getPackagePlandetails);
  const subServiceTypes = useSelector(getSubServiceTypes);
  const partnerTypeOptions = useSelector(getPartnerType);
  const providerOptions = useSelector(getProviders);
  const revenueShareOptions = useSelector(getRevenueShare);

  useEffect(() => {
    if (packageId) {
      dispatch(fetchPackageDetailsById({ packageId }));
    }
  }, [packageId, dispatch]);

  useEffect(() => {
    if (packageDetails?.serviceCategoryId) {
      dispatch(fetchSubServiceType({ serviceCategoryId: packageDetails?.serviceCategoryId }));
    }
  }, [dispatch, packageDetails?.serviceCategoryId]);

  useEffect(() => {
    dispatch(fetchPartnerType());
    if (partnerTypeValue?.name) {
      dispatch(fetchProvider({ ptype: partnerTypeValue?.name }));
    }
    dispatch(fetchRevenueShareList())
  }, [dispatch, partnerTypeValue]);

  const { packageName, packageType, subPackageCount = 0, planType, totalRenewalFee } = packageDetails || {};

  const details = [
    { label: 'Plan', value: packageName },
    { label: 'Main Package', value: packageType?.code },
    { label: 'Plan Type', value: planType?.name },
    { label: 'No.of Sub Packages', value: subPackageCount },
    { label: 'Renewal Fee', value: totalRenewalFee }
  ];

  const activeColumns = useMemo(() => {
    const dataColumns = mapObjectValues(VISIBLE_COLUMNS_SUB_PACKAGE, t, ['header']);
    return [
      ...dataColumns,
      {
        header: t('action'),
        accessor: 'action',
        cell: (row) => (
          <CustomEditIcon onClick={() => {
            setIsEditActive(true);
            setEditIdActive(row.id);
            const fullSubServiceType = subServiceTypes?.find(item => item.id === row.subServiceType?.id) || row.subServiceType;
            reset({ ...row, subServiceType: fullSubServiceType });
          }} />
        )
      }
    ];
  }, [t, reset, subServiceTypes]);

  const onSubmit = (data) => {
    if (isEditActive) {
      setActiveRecords((prev) =>
        prev.map((item) =>
          item.id === editIdActive
            ? { ...item, ...data, subServiceCategory: data.subServiceType }
            : item
        )
      );
      setIsEditActive(false);
      setEditIdActive(null);
      reset(defaultValues);
      return;
    }

    if (activeRecords.length >= subPackageCount) {
      warningToast({ description: t('youCanAddOnly') + ' ' + subPackageCount + ' ' + t('Packages'), title: t('warning') })
      return;
    }
    setActiveRecords((prev) => [
      ...prev,
      {
        ...data,
        subServiceCategory: data.subServiceType,
        id: Date.now()
      }
    ]);
    reset(defaultValues);
  }

  const selectedDiscountType = useMemo(() => {
    if (!discountTypeValue) return null;
    if (typeof discountTypeValue === 'object' && discountTypeValue !== null) {
      return discountTypeValue.name;
    }
    return discountTypeValue;
  }, [discountTypeValue]);

  const discountFieldLabel = useMemo(() => {
    if (selectedDiscountType === 'PERCENTAGE') {
      return t('discountPercentage');
    }
    if (selectedDiscountType === 'FLAT') {
      return t('discountFlat');
    }
    return t('discount');
  }, [selectedDiscountType, t]);

  const discountFieldPlaceholder = useMemo(() => {
    if (selectedDiscountType === 'PERCENTAGE') {
      return t('enter', { 0: t('discountPercentage') });
    }
    if (selectedDiscountType === 'FLAT') {
      return t('enter', { 0: t('discountFlat') });
    }
    return t('enter', { 0: t('discount') });
  }, [selectedDiscountType, t]);

  const confirmSubmit = () => {
    if (activeRecords?.length < subPackageCount) {
      warningToast({ description: t('pleaseAdd') + ' ' + subPackageCount + ' ' + t('Packages'), title: t('warning') })
      return;
    }

    const payload = {
      subPackages: activeRecords.map(item => ({
        subPackageId: item.subPackageId || null,
        mainPackageId: packageId,
        mainPackage: packageName,
        packageFee: Number(item.packageFee) || 0,
        subServiceCategoryId: item.subServiceType?.id || item.subServiceCategory?.id || null,
        subServiceCategory: item.subServiceCategory?.name,
        providerId: item.provider?.id || null,
        revenueShareId: item.revenueShare?.id || null,
        remarks: item.remarks || '',
        discount: Number(item.discount) || 0,
        discountType: typeof item.discountType === 'object' ? item.discountType?.name || item.discountType?.value : item.discountType || null,
        frequency: item.frequency ? Number(item.frequency) : 0,
        allowOpo: item.allowOpo === true
      })),
      deletedSubPackageIds: []
    };

    if (locationState?.isEditAll) {
      const subPackageId = activeRecords[0]?.subPackageId || null;
      dispatch(updatePlanSubPackage({ subPackageId, details: payload }));
    } else {
      dispatch(submitPlanSubPackage({ packageId, type: packageType?.code || null, details: payload }));
    }
  }

  return (
    <>
      <PackagePreview details={details} />
      <Box as={'form'} px={5} onSubmit={handleSubmit(onSubmit)}>
        <SimpleGrid columns={{ base: 1, lg: 2, xl: 3 }} gap={'70px'} rowGap={5} mt={2}>
          <FormController
            placeholder={t('choose', { 0: t('subServiceType') })}
            labelName={t('subServiceType')}
            items={subServiceTypes}
            name='subServiceType'
            type='select'
            control={control}
            errors={errors}
            required
          />

          {get(subServiceTypeValue, 'partnerMapping') === true && (
            <>
              <FormController
                placeholder={t('choose', { 0: t('partnerType') })}
                labelName={t('partnerType')}
                name='partnerType'
                type='select'
                items={partnerTypeOptions}
                control={control}
                errors={errors}
                required
              />

              <FormController
                placeholder={t('choose', { 0: t('provider') })}
                labelName={t('provider')}
                name='provider'
                type='select'
                items={providerOptions}
                getOptionLabel={(option) => get(option, 'providerName', '')}
                control={control}
                errors={errors}
                required
              />

              <FormController
                placeholder={t('choose', { 0: t('revenueShare') })}
                labelName={t('revenueShare')}
                name='revenueShare'
                type='select'
                items={revenueShareOptions}
                control={control}
                errors={errors}
                required
              />
            </>
          )}

          <FormController
            placeholder={t('enter', { 0: t('packageFee') })}
            labelName={t('packageFeeExclusiveofGST')}
            name='packageFee'
            control={control}
            errors={errors}
            onKeyDown={allowOnlyDigits}
            required
          />

          {(get(subServiceTypeValue, 'partnerMapping') === true || (planType?.code === 'MONTHLY' && subServiceTypeValue?.name === 'INTERNET')) && (
            <FormController
              labelName={t('allowOpo')}
              name='allowOpo'
              type={'checkbox'}
              control={control}
              errors={errors}
            />
          )}

          {get(subServiceTypeValue, 'discountable') === true && (
            <>
              <FormController
                placeholder={t('choose', { 0: t('discountType') })}
                labelName={t('discountType')}
                name='discountType'
                control={control}
                errors={errors}
                type='select'
                items={DISCOUNT_TYPE_LIST}
                required
              />

              <FormController
                placeholder={discountFieldPlaceholder}
                labelName={discountFieldLabel}
                name='discount'
                control={control}
                errors={errors}
                onKeyDown={allowOnlyDigits}
                required
              />
            </>
          )}

          < FormController
            placeholder={t('enter', { 0: t('remarks') })}
            labelName={t('remarks')}
            name='remarks'
            type='textArea'
            resize='none'
            size='xs'
            control={control}
            errors={errors}
          />
        </SimpleGrid>

        <Button variant='outline' type='submit' ml={'auto'} height={'40px'} mt={10} px={10}>
          {isEditActive ? t('update') : t('add')}
        </Button>
      </Box>

      {activeRecords.length > 0 && (
        <Box px={5} mt={5} mb={4}>
          <Table
            headerColor="table_header.primary"
            columns={activeColumns}
            data={activeRecords}
          />
        </Box>
      )}

      <Box px={5}>
        {activeRecords.length > 0 && (
          <Button ml="auto" variant="solid" onClick={confirmSubmit}>
            {t('submit')} <Save />
          </Button>
        )}
      </Box>
    </>
  );
};

export default AddSubPackage;
