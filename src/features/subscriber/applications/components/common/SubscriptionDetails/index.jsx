import { yupResolver } from '@hookform/resolvers/yup';
import { AccordionItem, FormController, useForm } from '@kfonbss/bss-ui-components';
import { useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { fetchDistributorList, fetchPlanType, updateSubscriptionDetails } from '../../../actions';
import { getDistributorList, getPlanTypeList, getPrepopulatedData, getSubscriberId } from '../../../selectors';
import { ewsSubscriptionDetailsValidationSchema, subscriptionDetailsValidationSchema } from '../../../validation';
import { BASIC_DETAILS_FORM, PRE_TEXT } from '../constants';
import PackageSelection from './PackageSelection';
import UsernameInput from './UsernameInput';

const SubscriptionDetails = ({ isEws = false, onBeforeSave, onSuccess }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const subscriberId = useSelector(getSubscriberId);
  const planTypeList = useSelector(getPlanTypeList);
  const distributorList = useSelector(getDistributorList);
  const prepopulatedData = useSelector(getPrepopulatedData);

  const validationSchema = useMemo(
    () => (isEws ? ewsSubscriptionDetailsValidationSchema(t) : subscriptionDetailsValidationSchema(t)),
    [isEws, t]
  );

  const computedValues = useMemo(() => {
    let planType = '';
    let distributorId = '';
    let desiredUserName = '';
    let selectedPackage = '';
    let packageId = null;

    if (prepopulatedData?.subscriberDetail) {
      const {
        planType: pPlanType,
        agnpId,
        username,
        packageId: pPackageId,
        packageName
      } = prepopulatedData.subscriberDetail;

      if (pPlanType && planTypeList?.length > 0) {
        planType = planTypeList.find((p) => p.code === pPlanType) || '';
      }

      if (agnpId) {
        distributorId = distributorList?.find((d) => d.id === agnpId) || { id: agnpId };
      }

      if (username) {
        desiredUserName = username.replace(PRE_TEXT, '');
      }

      if (pPackageId && packageName) {
        packageId = pPackageId;
        selectedPackage = packageName;
      }
    }

    if (!distributorId && distributorList?.length === 1) {
      distributorId = distributorList[0];
    }

    return {
      planType,
      distributorId,
      desiredUserName,
      selectedPackage,
      packageId
    };
  }, [prepopulatedData, planTypeList, distributorList]);

  const {
    control,
    formState: { errors },
    handleSubmit,
    setValue,
    watch
  } = useForm({
    values: computedValues,
    resolver: yupResolver(validationSchema),
    mode: 'onChange'
  });

  const desiredUsername = watch('desiredUserName');
  const packageId = watch('packageId');
  const planType = watch('planType');

  // Default-select first plan type when none chosen
  useEffect(() => {
    if (!isEws && !planType && planTypeList?.length > 0) {
      setValue('planType', planTypeList[0], { shouldValidate: true });
    }
  }, [isEws, planType, planTypeList, setValue]);

  const handleSetDesiredUsername = useCallback(
    (val) => setValue('desiredUserName', val, { shouldValidate: true }),
    [setValue]
  );

  const handleSetPackageId = useCallback((val) => setValue('packageId', val, { shouldValidate: true }), [setValue]);

  useEffect(() => {
    if (!isEws) {
      dispatch(fetchPlanType());
      dispatch(fetchDistributorList());
    }
  }, [dispatch, isEws]);

  const onSubmit = useCallback(
    (data) => {
      if (onBeforeSave && !onBeforeSave()) return;
      const fullUsername = `${PRE_TEXT}${desiredUsername}`;

      const submitData = {
        planType: data.planType?.code,
        username: fullUsername,
        packageId: packageId,
        packageName: data.selectedPackage,
        agnpId: data.distributorId?.id || data.distributorId,
        onSuccess
      };

      dispatch(updateSubscriptionDetails(submitData));
    },
    [onBeforeSave, desiredUsername, packageId, dispatch, onSuccess]
  );

  const isDisabled = !subscriberId;

  return (
    <AccordionItem
      title={t('subscriptionDetails')}
      name='SubscriptionDetails'
      value='SubscriptionDetails'
      isDisabled={isDisabled}
      onSubmit={handleSubmit(onSubmit)}
      saveButton={true}
      buttonValue={t('saveAndContinue')}
    >
      {!isEws && (
        <>
          <FormController
            placeholder={t('choose', {
              0: t(BASIC_DETAILS_FORM.fieldLabels.subscriptionDetails.planType)
            })}
            labelName={t(BASIC_DETAILS_FORM.fieldLabels.subscriptionDetails.planType)}
            name='planType'
            type='select'
            items={planTypeList || []}
            control={control}
            errors={errors}
            required
          />

          <FormController
            placeholder={t('choose', {
              0: t(BASIC_DETAILS_FORM.fieldLabels.subscriptionDetails.distributor)
            })}
            labelName={t(BASIC_DETAILS_FORM.fieldLabels.subscriptionDetails.distributor)}
            name='distributorId'
            type='select'
            items={distributorList || []}
            control={control}
            errors={errors}
            isDisabled={distributorList?.length === 1}
            required
          />
        </>
      )}
      <UsernameInput
        control={control}
        setValue={setValue}
        desiredUsername={desiredUsername}
        setDesiredUsername={handleSetDesiredUsername}
      />
      {!isEws && (
        <PackageSelection
          setValue={setValue}
          packageId={packageId}
          setPackageId={handleSetPackageId}
          subscriptionType={prepopulatedData?.basicDetail?.type}
          planType={planType?.code}
          error={errors.selectedPackage?.message}
        />
      )}
    </AccordionItem>
  );
};

export default SubscriptionDetails;
