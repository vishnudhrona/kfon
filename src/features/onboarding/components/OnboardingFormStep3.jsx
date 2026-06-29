import { yupResolver } from '@hookform/resolvers/yup';
import { AccordionItem, FormController, useForm } from '@kfonbss/bss-ui-components';
import { useParams } from '@tanstack/react-router';
import { isEmpty } from 'lodash-es';
import { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';

import { regex } from '@/utils/validationUtils';

import { fetchOnboardingBankAccountType, fetchOnboardingIfscDetails, submitOnboardingBankDetails } from '../action';
import { getBankAccountType, getBankDetails, getBasicDetails, getIfscDetails } from '../selector';
import { bankDetails as bankDetailsSchema } from '../validation';

const OnboardingFormStep3 = ({
  submitFormdata,
  bankDetails,
  basicDetails,
  fetchIfscDetails,
  ifscDetails,
  fetchBankAccountType,
  bankAccountType,
  showSaveButton = false,
  isActive,
  isDisabled = false,
  onSaveSuccess,
  onBeforeSave
}) => {
  const { t } = useTranslation();
  const { id } = useParams({ strict: false });
  const onboardingId = basicDetails?.id || id;

  useEffect(() => {
    if (isActive && !bankAccountType?.length) {
      fetchBankAccountType();
    }
  }, [fetchBankAccountType, bankAccountType?.length, isActive]);

  const getInitialValues = useCallback(() => {
    const data = bankDetails || {};

    return {
      bankIfsc: data?.bankIfsc || '',
      bankName: data?.bankName || '',
      bankBranch: data?.bankBranch || '',
      bankAcHolderName: data?.bankAcHolderName || '',
      bankAcNo: data?.bankAcNo || '',
      bankAcType: typeof data?.bankAcType === 'string' ? { name: data.bankAcType } : data?.bankAcType || ''
    };
  }, [bankDetails]);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(bankDetailsSchema(t)),
    mode: 'onChange',
    defaultValues: getInitialValues()
  });

  useEffect(() => {
    if (bankDetails) {
      reset(getInitialValues());
    }
  }, [bankDetails, reset, getInitialValues]);

  const bankIfscValue = watch('bankIfsc');

  useEffect(() => {
    const ifscRegex = regex.ifsc;
    const upperCaseIfsc = bankIfscValue ? bankIfscValue.toUpperCase() : '';
    if (upperCaseIfsc && ifscRegex.test(upperCaseIfsc)) {
      fetchIfscDetails({ ifscCode: upperCaseIfsc });
    }
  }, [bankIfscValue, fetchIfscDetails]);

  useEffect(() => {
    if (ifscDetails?.data) {
      setValue('bankName', ifscDetails?.data?.bankName);
      setValue('bankBranch', ifscDetails?.data?.bankBranch);
    }
  }, [ifscDetails, setValue]);

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
      bankAcType: data?.bankAcType?.name,
      onSuccess: onSaveSuccess
    };
    submitFormdata({ ...payload, id: onboardingId });
  };

  return (
    <>
      <AccordionItem
        title={t('bankDetails')}
        name={'Step3'}
        value={'step3'}
        onSubmit={handleSubmit(onSubmit)}
        saveButton={showSaveButton}
        buttonValue={t('save')}
      >
        <FormController
          placeholder={t('enter', { 0: t('ifscCode') })}
          labelName={t('ifscCode')}
          name='bankIfsc'
          textTransform='uppercase'
          control={control}
          errors={errors}
          required
          disabled={isDisabled}
        />

        <FormController
          placeholder={t('enter', { 0: t('bankName') })}
          labelName={t('bankName')}
          name='bankName'
          control={control}
          errors={errors}
          disabled
          required
        />

        <FormController
          placeholder={t('enter', { 0: t('branch') })}
          labelName={t('branch')}
          name='bankBranch'
          control={control}
          errors={errors}
          disabled
          required
        />

        <FormController
          placeholder={t('enter', { 0: t('accountHolderPlaceholder') })}
          labelName={t('accountHolderName')}
          name='bankAcHolderName'
          control={control}
          errors={errors}
          required
          disabled={isDisabled}
        />

        <FormController
          placeholder={t('enter', { 0: t('bankAccountNumber') })}
          labelName={t('bankAccountNumber')}
          name='bankAcNo'
          control={control}
          errors={errors}
          required
          disabled={isDisabled}
        />

        <FormController
          placeholder={t('select', { 0: t('bankAccountType') })}
          labelName={t('bankAccountType')}
          name='bankAcType'
          control={control}
          errors={errors}
          type='select'
          items={bankAccountType}
          required
          isDisabled={isDisabled}
        />
      </AccordionItem>
    </>
  );
};

const mapStateToProps = (state) => ({
  ifscDetails: getIfscDetails(state),
  bankAccountType: getBankAccountType(state),
  bankDetails: getBankDetails(state),
  basicDetails: getBasicDetails(state)
});

const mapDispatchToProps = {
  submitFormdata: submitOnboardingBankDetails,
  fetchIfscDetails: fetchOnboardingIfscDetails,
  fetchBankAccountType: fetchOnboardingBankAccountType
};

export default connect(mapStateToProps, mapDispatchToProps)(OnboardingFormStep3);
