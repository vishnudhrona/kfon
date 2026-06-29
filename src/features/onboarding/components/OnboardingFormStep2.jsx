import { yupResolver } from '@hookform/resolvers/yup';
import { AccordionItem, FormController, useForm, useWatch } from '@kfonbss/bss-ui-components';
import { useParams } from '@tanstack/react-router';
import { isEmpty } from 'lodash-es';
import { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';

import {
  fetchDistributorField,
  fetchOnboardingCompanyNature,
  fetchOnboardingPopName,
  fetchOnboardingSharePlan,
  submitOnboardingAgreementDetails
} from '../action';
import {
  getAgreementDetails,
  getBasicDetails,
  getCompanyNature,
  getDistributorField,
  getPopName,
  getSharePlan
} from '../selector';
import { agreementDetails as agreementDetailsSchema } from '../validation';

const OnboardingFormStep2 = ({
  submitFormdata,
  agreementDetails,
  basicDetails,
  fetchPopName,
  popName,
  fetchCompanyNature,
  companyNature,
  fetchSharePlan,
  sharePlan,
  getDistributorFieldValue,
  distributorFieldValue,
  showSaveButton = false,
  isActive,
  isDisabled = false,
  onSaveSuccess,
  onBeforeSave
}) => {
  const { t } = useTranslation();
  const onboardingId = basicDetails?.id;
  const agreementType = basicDetails?.agreementType?.trim() || '';

  const { type } = useParams({ strict: false });
  const isLnpUrl = type?.toLowerCase() === 'lnp';

  useEffect(() => {
    if (isActive) {
      if (!popName?.length) fetchPopName();
      if (!companyNature?.length) fetchCompanyNature();
      if (!sharePlan?.length) fetchSharePlan();
      if (isLnpUrl && !distributorFieldValue?.length) {
        getDistributorFieldValue();
      }
    }
  }, [
    fetchPopName,
    fetchCompanyNature,
    fetchSharePlan,
    getDistributorFieldValue,
    popName?.length,
    companyNature?.length,
    sharePlan?.length,
    distributorFieldValue?.length,
    isActive,
    isLnpUrl
  ]);

  const getInitialValues = useCallback(() => {
    const data = agreementDetails || {};
    const distributorId = data?.distributor || (typeof data?.distributor === 'string' ? data.distributor : '');
    const distributorObj =
      distributorFieldValue?.find((item) => String(item.id) === String(distributorId)) ||
      (typeof data?.distributor === 'object' ? data.distributor : '');

    const sharePlanId =
      data?.revenueShareUuid ||
      data?.revenueShare?.id ||
      (typeof data?.sharePlan === 'object' ? data.sharePlan?.id : data?.sharePlan) ||
      '';
    const sharePlanObj =
      sharePlan?.find((item) => String(item.id) === String(sharePlanId)) ||
      (typeof data?.revenueShare === 'object' ? data.revenueShare : '') ||
      (typeof data?.sharePlan === 'object' ? data.sharePlan : '');

    return {
      companyRegistrationNo: data?.companyRegistrationNo || '',
      oltProvider: data?.oltProvider || '',
      companyNature: typeof data?.companyNature === 'string' ? { name: data.companyNature } : data?.companyNature || '',
      sharePlan: sharePlanObj || '',
      agreementNumber: data?.agreementNumber || '',
      agreementDate: data?.agreementDate || '',
      popName: (() => {
        const raw = Array.isArray(data?.popName) ? data.popName[0] : data?.popName;
        if (!raw) return '';
        const obj = typeof raw === 'string' ? { name: raw } : raw;
        if (obj.id) return obj;
        const match = popName?.find((p) => p.name === obj.name);
        return match ? { id: match.id, name: match.name } : obj;
      })(),
      distributor: distributorObj || ''
    };
  }, [agreementDetails, distributorFieldValue, sharePlan, popName]);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(agreementDetailsSchema(t, agreementType)),
    defaultValues: getInitialValues(),
    mode: 'onChange'
  });

  const selectedSharePlan = useWatch({ control, name: 'sharePlan' });
  const isKfonShare = selectedSharePlan?.name === 'KFON_Share';

  const handleSharePlanChange = () => {
    setValue('distributor', '');
  };

  useEffect(() => {
    if (agreementDetails) {
      reset(getInitialValues());
    } else {
      const values = getInitialValues();
      if (values.distributor) {
        reset((formValues) => ({
          ...formValues,
          distributor: values.distributor
        }));
      }
    }
  }, [agreementDetails, basicDetails, reset, getInitialValues]);

  const onSubmit = (data) => {
    if (onBeforeSave && !onBeforeSave()) return;
    if (isEmpty(onboardingId) || onboardingId === null) {
      const element = document.getElementById('accordion-step1');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    const payload = {
      ...data,
      companyNature: data?.companyNature?.name,
      revenueShare: { id: data?.sharePlan?.id, name: data?.sharePlan?.name },
      popName: data?.popName?.name ? { id: data.popName.id, name: data.popName.name } : null,
      distributor: data?.distributor?.id,
      onSuccess: onSaveSuccess
    };

    delete payload.sharePlan;
    submitFormdata({ ...payload, id: onboardingId });
  };

  return (
    <>
      <AccordionItem
        title={t('agreementDetails')}
        name={'step2'}
        value={'step2'}
        onSubmit={handleSubmit(onSubmit)}
        saveButton={showSaveButton}
        buttonValue={t('save')}
      >
        <FormController
          placeholder={t('enter', { 0: t('companyRegistrationNo') })}
          labelName={t('companyRegistrationNo')}
          name='companyRegistrationNo'
          control={control}
          errors={errors}
          required
          disabled={isDisabled}
        />

        {isLnpUrl && (
          <>
            <FormController
              labelName={t('oltProvider')}
              name='oltProvider'
              errors={errors}
              control={control}
              type='radio'
              required
              disabled={isDisabled}
              items={[
                { label: t('lnp'), value: 'LNP' },
                { label: t('kfon'), value: 'KFON' }
              ]}
            />

            <FormController
              placeholder={t('enter', { 0: t('sharePlan') })}
              labelName={t('sharePlan')}
              name='sharePlan'
              control={control}
              errors={errors}
              type='select'
              items={sharePlan}
              required
              isDisabled={isDisabled}
              onOptionSelect={handleSharePlanChange}
            />
          </>
        )}

        {isLnpUrl && !isKfonShare && (
          <FormController
            placeholder={t('select', { 0: t('distributor') })}
            labelName={t('distributor')}
            name='distributor'
            control={control}
            errors={errors}
            type='select'
            items={distributorFieldValue || []}
            required
            isDisabled={isDisabled}
          />
        )}

        <FormController
          placeholder={t('select', { 0: t('natureOfCompany') })}
          labelName={t('natureOfCompany')}
          name='companyNature'
          control={control}
          errors={errors}
          type='select'
          items={companyNature}
          required
          isDisabled={isDisabled}
        />

        <FormController
          placeholder={t('enter', { 0: t('agreementNumber') })}
          labelName={t('agreementNumber')}
          name='agreementNumber'
          control={control}
          errors={errors}
          required
          disabled={isDisabled}
        />

        <FormController
          placeholder={t('enter', { 0: t('agreementDate') })}
          labelName={t('agreementDate')}
          name='agreementDate'
          control={control}
          errors={errors}
          type='date'
          disableFuture
          required
          disabled={isDisabled}
        />

        <FormController
          type='select'
          placeholder={t('select', { 0: t('popName') })}
          labelName={t('primaryPopName')}
          name='popName'
          control={control}
          errors={errors}
          items={popName}
          required
          isDisabled={isDisabled}
        />
      </AccordionItem>
    </>
  );
};

const mapStateToProps = (state) => ({
  popName: getPopName(state),
  companyNature: getCompanyNature(state),
  sharePlan: getSharePlan(state),
  distributorFieldValue: getDistributorField(state),
  agreementDetails: getAgreementDetails(state),
  basicDetails: getBasicDetails(state)
});

const mapDispatchToProps = {
  submitFormdata: submitOnboardingAgreementDetails,
  fetchPopName: fetchOnboardingPopName,
  fetchCompanyNature: fetchOnboardingCompanyNature,
  fetchSharePlan: fetchOnboardingSharePlan,
  getDistributorFieldValue: fetchDistributorField
};

export default connect(mapStateToProps, mapDispatchToProps)(OnboardingFormStep2);
