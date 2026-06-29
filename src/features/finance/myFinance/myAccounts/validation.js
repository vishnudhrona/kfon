import * as yup from 'yup';

import { validation } from '@/utils/validationUtils';

export const tiketFormSchema = (t) => {
  const validate = validation(t);
  return yup.object().shape({
    selectSubject: yup.string().required(validate.required('selectSubject')),
    attatchment: yup.string().required(validate.required('attatchment')),
    description: yup.string().required(validate.required('description'))
  });
};

export const onlineTopupSchema = (t) => {
  const validate = validation(t);
  return yup.object().shape({
    topupAmount: yup
      .number()
      .typeError(validate.required('topupAmount'))
      .required(validate.required('topupAmount'))
      .positive(t('amountMustBePositive'))
      .min(1, t('amountMustBeGreaterThanZero'))
      .max(9999999999.99, t('amountExceedsLimit'))
      .test('maxDecimals', t('maxTwoDecimals'), (val) => {
        if (!val) return true;
        return /^\d+(\.\d{1,2})?$/.test(String(val));
      }),
    paymentGateway: yup.string().required(validate.required('paymentGateway')),
    agreedToTerms: yup
      .boolean()
      .oneOf([true], t('pleaseAgreeToTermsAndConditions'))
      .required(t('pleaseAgreeToTermsAndConditions'))
  });
};
