import * as yup from 'yup';

import { dropdownRequired, validation } from '@/utils/validationUtils';

export const newGroupValidation = (t) => {
  const msg = validation(t);
  return yup.object({
    lnp: yup.mixed().required(msg.required('lnp')),
    agnp: yup.mixed().required(msg.required('agnp')),
    sharePlan: dropdownRequired(msg.required('sharePlan'))
  });
};
