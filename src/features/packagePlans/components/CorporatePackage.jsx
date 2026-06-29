import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, Flex, FormController, SimpleGrid, useForm } from '@kfonbss/bss-ui-components';
import { useParams } from '@tanstack/react-router';
import { get, isEmpty } from 'lodash-es';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { Save } from '@/components/custom';
import CustomLoaderProvider from '@/components/custom/CustomLoaderProvider';
import { getApiProgress } from '@/features/others/ApiProgress/selectors';
import { allowOnlyDigits } from '@/utils/validationUtils';

import {
  ACTION_TYPES,
  fetchCorporatePackageById,
  fetchMasterPackageType,
  fetchServiceCategoryLookup,
  fetchSubServiceType,
  submitCorporatePackage,
  updateCorporatePackage
} from '../action';
import { UNLIMITED_CODE } from '../constants';
import { formatCorporatePreviewData } from '../helper';
import Preview from '../pop-up/Preview';
import { getCorporatePackageDetails, getPackageTypes, getServiceCategoryLookup, getSubServiceTypes } from '../selector';
import { actions as sliceActions } from '../slice';
import { corporatePackageSchema } from '../validation';

const matchByIdentifier = (list, candidate) => {
  if (candidate == null) return null;
  const id =
    typeof candidate === 'object'
      ? (candidate.id ?? candidate.srvId ?? candidate.value ?? candidate.code ?? candidate.name)
      : candidate;
  if (id == null) return typeof candidate === 'object' ? candidate : null;
  const safe = Array.isArray(list) ? list : [];
  return (
    safe.find(
      (item) => item?.id === id || item?.srvId === id || item?.value === id || item?.code === id || item?.name === id
    ) || (typeof candidate === 'object' ? candidate : null)
  );
};

const CorporatePackage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { packageId } = useParams({ strict: false });
  const isEditMode = !!packageId;

  const subServiceTypes = useSelector(getSubServiceTypes);
  const packageTypeList = useSelector(getPackageTypes);
  const serviceCategoryLookup = useSelector(getServiceCategoryLookup);
  const prefillData = useSelector(getCorporatePackageDetails);
  const apiProgress = useSelector(getApiProgress);
  const isFetchingPackage = isEditMode && !!apiProgress[ACTION_TYPES.FETCH_CORPORATE_PACKAGE_BY_ID];
  const isUpdatingPackage = !!apiProgress[ACTION_TYPES.UPDATE_CORPORATE_PACKAGE];
  const isSubmittingPackage = !!apiProgress[ACTION_TYPES.SUBMIT_CORPORATE_PACKAGE];
  const isLoading = isFetchingPackage || isUpdatingPackage || isSubmittingPackage;

  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [hasHydratedServiceType, setHasHydratedServiceType] = useState(false);
  const [hasHydratedSubService, setHasHydratedSubService] = useState(false);
  const [hasHydratedPackageType, setHasHydratedPackageType] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
    setValue
  } = useForm({
    resolver: yupResolver(corporatePackageSchema(t)),
    defaultValues: {
      validity: 365
    }
  });

  const packageType = watch('packageType');
  const serviceType = watch('serviceType');
  const serviceId = get(serviceType, 'srvId');
  const subServiceType = watch('subServiceType');

  useEffect(() => {
    setValue('subServiceType', null);
  }, [serviceType?.id, setValue]);

  useEffect(() => {
    dispatch(fetchServiceCategoryLookup({ type: 'CORPORATE' }));
  }, [dispatch]);

  useEffect(() => {
    if (serviceType) {
      dispatch(fetchSubServiceType({ serviceCategoryId: serviceType?.id }));
      dispatch(fetchMasterPackageType({ id: serviceType?.id }));
    }
  }, [dispatch, serviceType, serviceId, setValue, subServiceType]);

  useEffect(() => {
    if (!isEditMode) return undefined;
    dispatch(fetchCorporatePackageById({ id: packageId }));
    return () => {
      dispatch(sliceActions.clearCorporatePackageDetails());
    };
  }, [dispatch, isEditMode, packageId]);

  const initialValues = useMemo(() => {
    if (!isEditMode || !prefillData) return null;
    const rawFallback = prefillData.fallbackSpeed;
    let fallbackValue = '';
    if (rawFallback != null) {
      const match = String(rawFallback).match(/\d+(\.\d+)?/);
      fallbackValue = match ? match[0] : '';
    }
    return {
      renewalFee: prefillData.renewalFee ?? '',
      speedInMbps: prefillData.speedInMbps ?? '',
      validity: prefillData.validity ?? '',
      volume: prefillData.volume ?? prefillData.planVolumeGb ?? '',
      otcCost: prefillData.otcCost ?? '',
      fallbackSpeed: fallbackValue
    };
  }, [isEditMode, prefillData]);

  useEffect(() => {
    if (!isEditMode || !prefillData || hasHydratedServiceType) return;
    const serviceCandidate = prefillData.serviceType ?? prefillData.serviceId;
    const resolvedServiceType = matchByIdentifier(serviceCategoryLookup, serviceCandidate);
    if (!resolvedServiceType) return;
    reset({
      ...initialValues,
      serviceType: resolvedServiceType
    });
    setHasHydratedServiceType(true);
  }, [isEditMode, prefillData, serviceCategoryLookup, hasHydratedServiceType, initialValues, reset]);

  useEffect(() => {
    if (!isEditMode || !prefillData || !hasHydratedServiceType || hasHydratedSubService) return;
    if (!Array.isArray(subServiceTypes) || subServiceTypes.length === 0) return;

    const candidate = prefillData.subServiceType ?? prefillData.subServiceId;
    const resolved = matchByIdentifier(subServiceTypes, candidate);
    if (resolved) {
      setValue('subServiceType', resolved);
      setHasHydratedSubService(true);
    }
  }, [isEditMode, prefillData, hasHydratedServiceType, hasHydratedSubService, subServiceTypes, setValue]);

  useEffect(() => {
    if (!isEditMode || !prefillData || !hasHydratedServiceType || hasHydratedPackageType) return;
    if (!Array.isArray(packageTypeList) || packageTypeList.length === 0) return;

    const candidate = prefillData.packageType ?? prefillData.planType;
    const resolved = matchByIdentifier(packageTypeList, candidate);
    if (resolved) {
      setValue('packageType', resolved);
      setHasHydratedPackageType(true);
    }
  }, [isEditMode, prefillData, hasHydratedServiceType, hasHydratedPackageType, packageTypeList, setValue]);

  const submitData = (data) => {
    setFormData(data);
    setOpen(true);
  };

  const confirmSubmit = () => {
    if (isEmpty(formData)) return;

    if (isEditMode) {
      dispatch(updateCorporatePackage({ ...formData, id: packageId }));
    } else {
      dispatch(submitCorporatePackage(formData));
    }
    setOpen(false);
    setFormData({});
    reset({});
  };

  const submitForm = handleSubmit(submitData);

  return (
    <Flex flexDirection='column' h='full'>
      <CustomLoaderProvider isLoading={isLoading} flex='1' minH='0' display='flex' flexDirection='column' w='full'>
        <form onSubmit={handleSubmit(submitForm)} style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Box flex='1'>
            <SimpleGrid columns={{ base: 1, lg: 3 }} gap={6} rowGap={8} p='5' pb='' w='100%'>
              <FormController
                placeholder={t('choose', { 0: t('serviceType') })}
                labelName={t('serviceType')}
                name='serviceType'
                type={'select'}
                control={control}
                errors={errors}
                items={serviceCategoryLookup}
                required
              />

              <FormController
                placeholder={t('choose', { 0: t('subServiceType') })}
                labelName={t('subServiceType')}
                name='subServiceType'
                type={'select'}
                control={control}
                errors={errors}
                items={subServiceTypes}
              />

              <FormController
                placeholder={t('enter', { 0: t('renewalFee') })}
                labelName={t('renewalFeeTax')}
                name='renewalFee'
                control={control}
                errors={errors}
                onKeyDown={allowOnlyDigits}
                required
              />

              <FormController
                placeholder={t('enter', { 0: t('speedInMbps') })}
                labelName={t('speedInMbps')}
                name='speedInMbps'
                control={control}
                errors={errors}
                onKeyDown={allowOnlyDigits}
                required
              />

              <FormController
                placeholder='365'
                labelName={t('packageValidityInDays')}
                name='validity'
                control={control}
                errors={errors}
                onKeyDown={allowOnlyDigits}
                disabled
              />

              <FormController
                placeholder={t('choose', { 0: t('packageType') })}
                labelName={t('packageType')}
                name='packageType'
                type={'select'}
                control={control}
                errors={errors}
                items={packageTypeList}
                required
              />
              {UNLIMITED_CODE !== get(packageType, 'code') && (
                <>
                  <FormController
                    placeholder={t('enter', { 0: t('allocatedVolume') })}
                    labelName={t('allocatedVolume')}
                    name='volume'
                    control={control}
                    errors={errors}
                    onKeyDown={allowOnlyDigits}
                    required
                  />

                  <FormController
                    placeholder={t('enter', {
                      0: t('fallBackSpeedInMbps', { defaultValue: 'Fall Back Speed in Mbps' })
                    })}
                    labelName={t('fallBackSpeedInMbps', { defaultValue: 'Fall Back Speed in Mbps' })}
                    name='fallbackSpeed'
                    control={control}
                    errors={errors}
                    onKeyDown={allowOnlyDigits}
                    required
                  />
                </>
              )}

              <FormController
                placeholder={t('enter', { 0: t('otcCost') })}
                labelName={t('otcCost')}
                name='otcCost'
                control={control}
                errors={errors}
                onKeyDown={allowOnlyDigits}
              />
            </SimpleGrid>
          </Box>

          <Flex w='full' justify='flex-end' p={'5'}>
            <Button type='submit' width='165px' h='47px' fontSize={'16px'} variant={'solid'}>
              {t('save')}
              <Save />
            </Button>
          </Flex>
        </form>
      </CustomLoaderProvider>
      <Preview
        open={open}
        setOpen={setOpen}
        onConfirm={confirmSubmit}
        previewData={formatCorporatePreviewData(formData)}
      />
    </Flex>
  );
};

export default CorporatePackage;
