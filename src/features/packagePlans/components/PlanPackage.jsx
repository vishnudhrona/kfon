import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, Flex, FormController, SimpleGrid, Text, useForm } from '@kfonbss/bss-ui-components';
import { useParams } from '@tanstack/react-router';
import { get, isEmpty } from 'lodash-es';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { BsArrowLeftCircle, Save } from '@/components/custom';
import { successToast } from '@/components/custom/Toast';
import { formatDisplayDate } from '@/utils/dateUtils';
import { allowOnlyDigits } from '@/utils/validationUtils';

import {
  fetchMasterCategoryType,
  fetchMasterFallbackSpeed,
  fetchMasterPackagePlanType,
  fetchMasterPackageType,
  fetchMasterPlanType,
  fetchMasterSpeedProfile,
  fetchPackageDetailsById,
  fetchRetailServiceType,
  fetchServiceCategoryById,
  getSubscriberProfile,
  submitPlanPackage,
  updatePlanPackage
} from '../action';
import { DISBURSEMENT_TYPE_LIST, FIELD_LABELS, PACKAGE_TYPES, RECHARGE_ALLOW_LIST } from '../constants';
import { formatPreviewData } from '../helper';
import Preview from '../pop-up/Preview';
import {
  getCategoryTypes,
  getFallbackSpeed,
  getPackagePlandetails,
  getPackagePlanTypes,
  getPackageTypes,
  getPlanTypes,
  getRetailServiceType,
  getServiceCategoryById,
  getSpeedProfile,
  getSubmitSuccess,
  getSubscriberProfile as getSubscriberProfileTypes
} from '../selector';
import { actions as sliceActions } from '../slice';
import { planPackageSchema } from '../validation';

const PlanPackage = () => {
  const { t } = useTranslation();
  const { packageId } = useParams({ strict: false });

  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({});

  const {
    control,
    watch,
    handleSubmit,
    reset,
    setValue,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(planPackageSchema(t))
  });

  const packageType = watch('packageType');
  const createCorrespondingTermPlan = watch('createCorrespondingTermPlan');
  const serviceType = watch('serviceType');
  const subscriptionType = watch('subscriptionType');
  const packagePlanType = watch('packagePlanType');
  const planType = watch('planType');
  const packageFee = watch('packageFee');

  const dispatch = useDispatch();
  const packageTypeList = useSelector(getPackageTypes) || [];
  const planTypeList = useSelector(getPlanTypes)
  const categoryTypeList = useSelector(getCategoryTypes)
  const packagePlanTypeList = useSelector(getPackagePlanTypes) || [];
  const fallbackSpeedList = useSelector(getFallbackSpeed);
  const speedProfileList = useSelector(getSpeedProfile);
  const subscriptionTypeList = useSelector(getSubscriberProfileTypes) || [];
  const retailServiceTypeList = useSelector(getRetailServiceType);
  const serviceCategoryById = useSelector(getServiceCategoryById);
  const submitSuccess = useSelector(getSubmitSuccess);

  const filteredPlanTypeList = useMemo(() => {
    if (serviceCategoryById?.isAddon === true) {
      return planTypeList.filter(plan => {
        const name = (plan?.name || '').toUpperCase();
        const code = (plan?.code || '').toUpperCase();
        return name !== 'ITPO' && code !== 'ITPO';
      });
    }
    return planTypeList;
  }, [planTypeList, serviceCategoryById?.isAddon]);

  const submitData = (data) => {
    const finalData = { ...data };

    finalData.freeValidity = Number(data.freeValidity || 0);
    finalData.initialFreeValidity = Number(data.initialFreeValidity || 0);
    finalData.bonusValidity = Number(data.bonusValidity || 0);

    if (data.createCorrespondingTermPlan) {
      finalData.threeMonthFreeValidity = Number(data.threeMonthFreeValidity || 0);
      finalData.threeMonthInitialFreeValidity = Number(data.threeMonthInitialFreeValidity || 0);
      finalData.threeMonthBonusValidity = Number(data.threeMonthBonusValidity || 0);

      finalData.sixMonthFreeValidity = Number(data.sixMonthFreeValidity || 0);
      finalData.sixMonthInitialFreeValidity = Number(data.sixMonthInitialFreeValidity || 0);
      finalData.sixMonthBonusValidity = Number(data.sixMonthBonusValidity || 0);

      finalData.twelveMonthFreeValidity = Number(data.twelveMonthFreeValidity || 0);
      finalData.twelveMonthInitialFreeValidity = Number(data.twelveMonthInitialFreeValidity || 0);
      finalData.twelveMonthBonusValidity = Number(data.twelveMonthBonusValidity || 0);
    } else {
      finalData.threeMonthFreeValidity = 0;
      finalData.threeMonthInitialFreeValidity = 0;
      finalData.threeMonthBonusValidity = 0;
      finalData.sixMonthFreeValidity = 0;
      finalData.sixMonthInitialFreeValidity = 0;
      finalData.sixMonthBonusValidity = 0;
      finalData.twelveMonthFreeValidity = 0;
      finalData.twelveMonthInitialFreeValidity = 0;
      finalData.twelveMonthBonusValidity = 0;
    }
    setFormData(finalData);
    setOpen(true);
  };

  const confirmSubmit = () => {
    if (isEmpty(formData)) return;
    if (packageId) {
      dispatch(updatePlanPackage({ id: packageId, ...formData }));
    } else {
      dispatch(submitPlanPackage(formData));
    }
    setOpen(false);
    setFormData({});
  };

  useEffect(() => {
    if (packageId) {
      dispatch(fetchPackageDetailsById({ packageId }));
    }
  }, [dispatch, packageId]);

  useEffect(() => {
    if (serviceType?.id) {
      dispatch(fetchMasterPackageType({ id: serviceType?.id }));
      dispatch(fetchServiceCategoryById({ id: serviceType?.id }));
    }
    if (subscriptionType?.code && packagePlanType?.code) {
      dispatch(fetchMasterCategoryType({
        subscriberProfileCode: subscriptionType.code,
        packagePlanTypeCode: packagePlanType.code
      }));
    }
    dispatch(fetchMasterPlanType());
    dispatch(fetchMasterPackagePlanType());
    dispatch(fetchMasterFallbackSpeed());
    dispatch(fetchMasterSpeedProfile());
    dispatch(getSubscriberProfile());
    dispatch(fetchRetailServiceType());
  }, [dispatch, serviceType?.id, subscriptionType?.code, packagePlanType?.code]);

  useEffect(() => {
    if (submitSuccess) {
      reset({});
      dispatch(sliceActions.setSubmitSuccess(false));
      dispatch(sliceActions.setPackagePlandetails({}));
      dispatch(sliceActions.setServiceCategoryById({}));
    }
  }, [submitSuccess, reset, dispatch]);

  useEffect(() => {
    return () => {
      dispatch(sliceActions.setPackagePlandetails({}));
      dispatch(sliceActions.setServiceCategoryById({}));
    };
  }, [dispatch]);

  const submitForm = handleSubmit(submitData);

  const packageDetails = useSelector(getPackagePlandetails);

  useEffect(() => {
    if (packageDetails && Object.keys(packageDetails).length > 0) {
      const termPlans = packageDetails.termPlans || [];
      const term3 = termPlans.find(t => t.renewPeriod === 90) || {};
      const term6 = termPlans.find(t => t.renewPeriod === 180) || {};
      const term12 = termPlans.find(t => t.renewPeriod === 360) || {};

      reset({
        ...packageDetails,
        subscriptionType: packageDetails.subscriberProfile,
        serviceType: retailServiceTypeList?.find(x => x.id === packageDetails.serviceCategoryId) || {
          id: packageDetails.serviceCategoryId,
          name: packageDetails.serviceCategoryName
        },
        planType: packageDetails.planType,
        packageType: packageDetails.packageType,
        packagePlanType: packageDetails.packagePlanType,
        status: packageDetails.status === 'Active' ? 'true' : 'false',
        ontAllow: packageDetails.ontAllow,
        remarks: packageDetails.remarks,
        packageFee: packageDetails.renewalFee,
        renewPeriod: packageDetails.renewPeriod,
        endDate: packageDetails.endDate ? formatDisplayDate(packageDetails.endDate, 'YYYY-MM-DD') : '',
        speedProfile: speedProfileList?.find(x => String(x.code) === String(packageDetails.speedProfile)) || packageDetails.speedProfile,
        fallbackSpeed: fallbackSpeedList?.find(x => String(x.code) === String(packageDetails.fallbackSpeed?.code || packageDetails.fallbackSpeed)) || packageDetails.fallbackSpeed,
        rechargeAllow: RECHARGE_ALLOW_LIST?.find(x => x.name === packageDetails.rechargeAllow) || packageDetails.rechargeAllow,
        disbursementType: DISBURSEMENT_TYPE_LIST?.find(x => x.label === packageDetails.disbursementType) || packageDetails.disbursementType,

        freeValidity: packageDetails.freeValidity ?? 0,
        initialFreeValidity: packageDetails.initialFreeValidity ?? 0,
        bonusValidity: packageDetails.bonusValidity ?? 0,

        threeMonthFreeValidity: packageDetails.threeMonthFreeValidity ?? term3.freeValidity ?? 0,
        threeMonthInitialFreeValidity: packageDetails.threeMonthInitialFreeValidity ?? term3.trialFreeValidity ?? term3.initialFreeValidity ?? 0,
        threeMonthBonusValidity: packageDetails.threeMonthBonusValidity ?? term3.bonusFreeValidity ?? term3.bonusValidity ?? 0,

        sixMonthFreeValidity: packageDetails.sixMonthFreeValidity ?? term6.freeValidity ?? 0,
        sixMonthInitialFreeValidity: packageDetails.sixMonthInitialFreeValidity ?? term6.trialFreeValidity ?? term6.initialFreeValidity ?? 0,
        sixMonthBonusValidity: packageDetails.sixMonthBonusValidity ?? term6.bonusFreeValidity ?? term6.bonusValidity ?? 0,

        twelveMonthFreeValidity: packageDetails.twelveMonthFreeValidity ?? term12.freeValidity ?? 0,
        twelveMonthInitialFreeValidity: packageDetails.twelveMonthInitialFreeValidity ?? term12.trialFreeValidity ?? term12.initialFreeValidity ?? 0,
        twelveMonthBonusValidity: packageDetails.twelveMonthBonusValidity ?? term12.bonusFreeValidity ?? term12.bonusValidity ?? 0
      });
    }
  }, [packageDetails, reset, retailServiceTypeList, speedProfileList, fallbackSpeedList]);

  useEffect(() => {
    const isMonthlyNonAddon = planType?.name === 'Monthly' && serviceCategoryById?.isAddon === false;
    if (!isMonthlyNonAddon && createCorrespondingTermPlan) {
      setValue('createCorrespondingTermPlan', false);
    }
  }, [planType?.name, serviceCategoryById?.isAddon, createCorrespondingTermPlan, setValue]);

  useEffect(() => {
    if (serviceCategoryById?.count !== undefined) {
      setValue('noOfSubPackages', serviceCategoryById?.count, { shouldValidate: true });
    }
  }, [serviceCategoryById, setValue]);

  useEffect(() => {
    if (categoryTypeList) {
      const derivedCategory = Array.isArray(categoryTypeList) ? categoryTypeList[0] : categoryTypeList;
      if (derivedCategory) {
        setValue('categoryType', derivedCategory, { shouldValidate: true });
      }
    }
  }, [categoryTypeList, setValue]);

  useEffect(() => {
    if (planType) {
      const name = planType?.name
      
      const isMonthly = name === 'Monthly' || name === 'Day Wise'

      if (name === 'ITPO') {
        setValue('renewPeriod', 1, { shouldValidate: true });
      } else if (isMonthly) {
        setValue('renewPeriod', 30, { shouldValidate: true });
      } else if (name === 'Quarterly') {
        setValue('renewPeriod', 90,  { shouldValidate: true })
      } else if (name === 'Half Yearly') {
        setValue('renewPeriod', 180,  { shouldValidate: true })
      } else if (name === 'Yearly') {
        setValue('renewPeriod', 365,  { shouldValidate: true })
      }
    }
  }, [planType, setValue]);

  useEffect(() => {
    if (serviceCategoryById?.isAddon === true) {
      setValue('isAddon', true, { shouldValidate: true });
      successToast({ description: t('isAddOnPackageSelected') });
    } else {
      setValue('isAddon', false, { shouldValidate: true });
    }
  }, [serviceCategoryById, setValue, t]);

  useEffect(() => {
    const isSme = (subscriptionType?.code || '').toUpperCase() === 'SME' || (subscriptionType?.name || '').toUpperCase() === 'SME';
    if (isSme) {
      setValue('ontAllow', false, { shouldValidate: true });
    }
  }, [subscriptionType, setValue]);

  return (
    <>
      <form onSubmit={submitForm}>
        <Box px={5} py={5} bg={'gray.50'} borderRadius={'lg'}>
          <Text color={'primary.500'} fontSize={'xl'} fontWeight={'semibold'} mb={5}>{t('packageIdentification')}</Text>
          <SimpleGrid columns={{ base: 1, lg: 3 }} gap={6} rowGap={8} w='100%' mb={5}>
            <FormController
              placeholder={t('enter', { 0: t(FIELD_LABELS.subscriptionType) })}
              labelName={t(FIELD_LABELS.subscriptionType)}
              name='subscriptionType'
              type={'select'}
              control={control}
              errors={errors}
              items={subscriptionTypeList}
              required
            />

            <FormController
              placeholder={t('enter', { 0: t(FIELD_LABELS.packageName) })}
              labelName={t(FIELD_LABELS.packageName)}
              name='packageName'
              type={'text'}
              control={control}
              errors={errors}
              bg={'white'}
              required
            />

            <FormController
              placeholder={t('enter', { 0: t(FIELD_LABELS.serviceCategory) })}
              labelName={t(FIELD_LABELS.serviceCategory)}
              name='serviceType'
              type={'select'}
              control={control}
              errors={errors}
              required
              items={retailServiceTypeList}
            />

            <FormController
              placeholder={t('enter', { 0: t(FIELD_LABELS.planType) })}
              labelName={t(FIELD_LABELS.planType)}
              name='planType'
              type={'select'}
              control={control}
              errors={errors}
              required
              items={filteredPlanTypeList}
            />

            <FormController
              placeholder={t('enter', { 0: t(FIELD_LABELS.packageType) })}
              labelName={t(FIELD_LABELS.packageType)}
              name='packageType'
              type={'select'}
              control={control}
              errors={errors}
              required
              items={packageTypeList}
            />

            <FormController
              placeholder={t('enter', { 0: t(FIELD_LABELS.packagePlanType) })}
              labelName={t(FIELD_LABELS.packagePlanType)}
              name='packagePlanType'
              type={'select'}
              control={control}
              errors={errors}
              items={packagePlanTypeList}
            />

            <FormController
              placeholder={t('enter', { 0: t(FIELD_LABELS.categoryType) })}
              labelName={t(FIELD_LABELS.categoryType)}
              name='categoryType'
              control={control}
              errors={errors}
              value={get(categoryTypeList, 'name', '')}
              bg={'white'}
              disabled
            />

            <FormController
              labelName={t(FIELD_LABELS.status)}
              name='status'
              control={control}
              errors={errors}
              type={'radio'}
              required
              items={[
                { label: t('active'), value: 'true' },
                { label: t('inActive'), value: 'false' }
              ]}
            />

            <Flex align="center" gap={6} h="100%" pt={4}>
              <FormController
                placeholder={t('enter', { 0: t(FIELD_LABELS.ontDeviceAllow) })}
                labelName={t(FIELD_LABELS.ontDeviceAllow)}
                name='ontAllow'
                type={'checkbox'}
                control={control}
                errors={errors}
                disabled={(subscriptionType?.code || '').toUpperCase() === 'SME' || (subscriptionType?.name || '').toUpperCase() === 'SME'}
              />

              <FormController
                placeholder={t('enter', { 0: t(FIELD_LABELS.isAddon) })}
                labelName={t(FIELD_LABELS.isAddon)}
                name='isAddon'
                type={'checkbox'}
                control={control}
                errors={errors}
                disabled
              />
            </Flex>
          </SimpleGrid>

          <FormController
            placeholder={t('enter', { 0: t(FIELD_LABELS.remarks) })}
            labelName={t(FIELD_LABELS.remarks)}
            name='remarks'
            type={'textArea'}
            control={control}
            errors={errors}
            size='lg'
            bg={'white'}
            required
          />
        </Box>

        <Box px={5} py={5} bg={'gray.50'} borderRadius={'lg'} mt={5}>
          <Text color={'primary.500'} fontSize={'xl'} fontWeight={'semibold'} mb={5}>{t('pricingValidity')}</Text>
          <SimpleGrid columns={{ base: 1, lg: 3 }} gap={6} rowGap={8} w='100%' mb={5}>
            <FormController
              placeholder={t('enter', { 0: t(FIELD_LABELS.packageFee) })}
              labelName={`${t(FIELD_LABELS.packageFee)} (${t(FIELD_LABELS.exclusiveOfGst)})`}
              name='packageFee'
              control={control}
              errors={errors}
              required
              onKeyDown={allowOnlyDigits}
              bg={'white'}
            />

            <Box>
              <FormController
                placeholder={t('enter', { 0: t(FIELD_LABELS.totalRenewalFee) })}
                labelName={`${t(FIELD_LABELS.totalRenewalFee)}`}
                name='totalRenewalFee'
                control={control}
                errors={errors}
                required
                value={createCorrespondingTermPlan ? t('calculatedAutomatically', 'Calculated Automatically') : packageFee}
                onKeyDown={createCorrespondingTermPlan ? undefined : allowOnlyDigits}
                bg={'white'}
                disabled
              />
              <Text fontSize="12px" color="gray.500" mt={1}>
                {createCorrespondingTermPlan
                  ? `${t('autoCalculatedPerTerm')}: 1M=₹${packageFee || 0}, 3M=₹${(packageFee || 0) * 3}, 6M=₹${(packageFee || 0) * 6}, 12M=₹${(packageFee || 0) * 12}`
                  : `=${t('packageFeeNote')}`
                }
              </Text>
            </Box>

            <FormController
              placeholder={t('enter', { 0: t(FIELD_LABELS.renewPeriod) })}
              labelName={t(FIELD_LABELS.renewPeriod)}
              name='renewPeriod'
              control={control}
              errors={errors}
              onKeyDown={allowOnlyDigits}
              disabled
              bg={'white'}
            />

            <FormController
              placeholder={t('enter', { 0: t(FIELD_LABELS.endDate) })}
              labelName={t(FIELD_LABELS.endDate)}
              name='endDate'
              type={'date'}
              control={control}
              errors={errors}
              bg={'white'}
            />

            {createCorrespondingTermPlan && (
              <>
                <FormController
                  placeholder={t('choose', { 0: t(FIELD_LABELS.disbursementType) })}
                  labelName={t(FIELD_LABELS.disbursementType)}
                  name='disbursementType'
                  control={control}
                  errors={errors}
                  type={'select'}
                  items={DISBURSEMENT_TYPE_LIST}
                />
              </>
            )}

            {planType?.name === 'Monthly' && serviceCategoryById?.isAddon === false && (
              <>
                <Box border={'1px solid #CBD5E1'} borderRadius={'lg'} mt={5}>
                  <FormController
                    placeholder={t('enter', { 0: t(FIELD_LABELS.createCorrespondingTermPlan) })}
                    labelName={t(FIELD_LABELS.createCorrespondingTermPlan)}
                    name='createCorrespondingTermPlan'
                    type={'checkbox'}
                    control={control}
                    errors={errors}
                  />
                </Box>
              </>
            )}
            {createCorrespondingTermPlan && (
              <Box display="flex" flexDirection="column" gap={5} w="100%" gridColumn="1 / -1">
                <Box>
                  <Text fontSize="lg" fontWeight="semibold" mb={3}>3 Month</Text>
                  <SimpleGrid columns={{ base: 1, lg: 3 }} gap={6} rowGap={8} w='100%' mb={5}>
                    <FormController
                      placeholder={t('enter', { 0: t(FIELD_LABELS.freeValidity) })}
                      labelName={t(FIELD_LABELS.freeValidity)}
                      name='threeMonthFreeValidity'
                      control={control}
                      errors={errors}
                      onKeyDown={allowOnlyDigits}
                      bg={'white'}
                    />

                    <FormController
                      placeholder={t('enter', { 0: t(FIELD_LABELS.initialFreeValidity) })}
                      labelName={t(FIELD_LABELS.initialFreeValidity)}
                      name='threeMonthInitialFreeValidity'
                      control={control}
                      errors={errors}
                      onKeyDown={allowOnlyDigits}
                      bg={'white'}
                    />

                    <FormController
                      placeholder={t('enter', { 0: t(FIELD_LABELS.bonusValidity) })}
                      labelName={t(FIELD_LABELS.bonusValidity)}
                      name='threeMonthBonusValidity'
                      control={control}
                      errors={errors}
                      onKeyDown={allowOnlyDigits}
                      bg={'white'}
                    />
                  </SimpleGrid>
                </Box>

                <Box>
                  <Text fontSize="lg" fontWeight="semibold" mb={3}>6 Month</Text>
                  <SimpleGrid columns={{ base: 1, lg: 3 }} gap={6} rowGap={8} w='100%' mb={5}>
                    <FormController
                      placeholder={t('enter', { 0: t(FIELD_LABELS.freeValidity) })}
                      labelName={t(FIELD_LABELS.freeValidity)}
                      name='sixMonthFreeValidity'
                      control={control}
                      errors={errors}
                      onKeyDown={allowOnlyDigits}
                      bg={'white'}
                    />

                    <FormController
                      placeholder={t('enter', { 0: t(FIELD_LABELS.initialFreeValidity) })}
                      labelName={t(FIELD_LABELS.initialFreeValidity)}
                      name='sixMonthInitialFreeValidity'
                      control={control}
                      errors={errors}
                      onKeyDown={allowOnlyDigits}
                      bg={'white'}
                    />

                    <FormController
                      placeholder={t('enter', { 0: t(FIELD_LABELS.bonusValidity) })}
                      labelName={t(FIELD_LABELS.bonusValidity)}
                      name='sixMonthBonusValidity'
                      control={control}
                      errors={errors}
                      onKeyDown={allowOnlyDigits}
                      bg={'white'}
                    />
                  </SimpleGrid>
                </Box>

                <Box>
                  <Text fontSize="lg" fontWeight="semibold" mb={3}>12 Month</Text>
                  <SimpleGrid columns={{ base: 1, lg: 3 }} gap={6} rowGap={8} w='100%' mb={5}>
                    <FormController
                      placeholder={t('enter', { 0: t(FIELD_LABELS.freeValidity) })}
                      labelName={t(FIELD_LABELS.freeValidity)}
                      name='twelveMonthFreeValidity'
                      control={control}
                      errors={errors}
                      onKeyDown={allowOnlyDigits}
                      bg={'white'}
                    />

                    <FormController
                      placeholder={t('enter', { 0: t(FIELD_LABELS.initialFreeValidity) })}
                      labelName={t(FIELD_LABELS.initialFreeValidity)}
                      name='twelveMonthInitialFreeValidity'
                      control={control}
                      errors={errors}
                      onKeyDown={allowOnlyDigits}
                      bg={'white'}
                    />

                    <FormController
                      placeholder={t('enter', { 0: t(FIELD_LABELS.bonusValidity) })}
                      labelName={t(FIELD_LABELS.bonusValidity)}
                      name='twelveMonthBonusValidity'
                      control={control}
                      errors={errors}
                      onKeyDown={allowOnlyDigits}
                      bg={'white'}
                    />
                  </SimpleGrid>
                </Box>
              </Box>
            )}
          </SimpleGrid>


        </Box>

        <Box px={5} py={5} bg={'gray.50'} borderRadius={'lg'} mt={5}>
          <Text color={'primary.500'} fontSize={'xl'} fontWeight={'semibold'} mb={5}>{t('technicalSpecifications')}</Text>
          <SimpleGrid columns={{ base: 1, lg: 3 }} gap={6} rowGap={8} w='100%' mb={5}>
            <FormController
              placeholder={t('enter', { 0: t(FIELD_LABELS.speedProfile) })}
              labelName={`${t(FIELD_LABELS.speedProfile)} (${t(FIELD_LABELS.mb)})`}
              name='speedProfile'
              type={'select'}
              control={control}
              errors={errors}
              items={speedProfileList}
              required
            />

            {PACKAGE_TYPES.UNLIMITED !== get(packageType, 'code') && (
              <>
                {serviceCategoryById?.isBod !== true && (
                  <FormController
                    placeholder={t('enter', { 0: t(FIELD_LABELS.allocatedVolume) })}
                    labelName={`${t(FIELD_LABELS.allocatedVolume)} (${t(FIELD_LABELS.mb)})`}
                    name='allocatedVolume'
                    control={control}
                    errors={errors}
                    onKeyDown={allowOnlyDigits}
                    bg={'white'}
                    required
                  />
                )}

                <FormController
                  placeholder={t('enter', { 0: t(FIELD_LABELS.fallbackSpeed) })}
                  labelName={`${t(FIELD_LABELS.fallbackSpeed)} (${t(FIELD_LABELS.mb)})`}
                  name='fallbackSpeed'
                  type={'select'}
                  control={control}
                  errors={errors}
                  items={fallbackSpeedList}
                  required
                />
              </>
            )}

            {serviceCategoryById?.isBod === true && (
              <>
                <FormController
                  placeholder={t('enter', { 0: t(FIELD_LABELS.bodMin) })}
                  labelName={t(FIELD_LABELS.bodMin)}
                  name='bodMin'
                  control={control}
                  errors={errors}
                  required
                  onKeyDown={allowOnlyDigits}
                />

                <FormController
                  placeholder={t('enter', { 0: t(FIELD_LABELS.bodMax) })}
                  labelName={t(FIELD_LABELS.bodMax)}
                  name='bodMax'
                  control={control}
                  errors={errors}
                  required
                  onKeyDown={allowOnlyDigits}
                />
              </>
            )}
          </SimpleGrid>
        </Box>

        <Box px={5} py={5} bg={'gray.50'} borderRadius={'lg'} mt={5}>
          <Text color={'primary.500'} fontSize={'xl'} fontWeight={'semibold'} mb={5}>{t('planBehaviour')}</Text>
          <SimpleGrid columns={{ base: 1, lg: 3 }} gap={6} rowGap={8} w='100%' mb={5}>
            <FormController
              placeholder={t('enter', { 0: t(FIELD_LABELS.noOfSubPackages) })}
              labelName={t(FIELD_LABELS.noOfSubPackages)}
              name='noOfSubPackages'
              control={control}
              errors={errors}
              disabled
              onKeyDown={allowOnlyDigits}
              bg={'white'}
            />

            <FormController
              placeholder={t('enter', { 0: t(FIELD_LABELS.rechargeAllow) })}
              labelName={t(FIELD_LABELS.rechargeAllow)}
              name='rechargeAllow'
              control={control}
              errors={errors}
              type='select'
              items={RECHARGE_ALLOW_LIST}
            />
          </SimpleGrid>
        </Box>

        <Flex w='full' justify='flex-end' p={'5'} gap={2}>
          <Button type='submit' width='160px' h='40px' fontSize={'16px'} variant={'outline'}>
            <BsArrowLeftCircle />
            {t('back')}
          </Button>
          <Button type='submit' width='160px' h='40px' fontSize={'16px'} variant={'solid'}>
            {t('save')}
            <Save />
          </Button>
        </Flex>
      </form >
      <Preview open={open} setOpen={setOpen} onConfirm={confirmSubmit} previewData={formatPreviewData(formData)} />
    </>
  );
};

export default PlanPackage;