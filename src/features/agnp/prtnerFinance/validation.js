import * as yup from 'yup';

import { validation } from '@/utils/validationUtils';

export const addServiceAreaSchema = (t) => {
  const msg = validation(t);
  return yup.object({
    pinCode: yup
      .mixed()
      .required(msg.required('pinCode'))
      .test('has-name', msg.required('pinCode'), (value) => {
        return value?.pincode ? true : false;
      }),
    postOfficeName: yup
      .mixed()
      .required(msg.required('postOffice'))
      .test('has-name', msg.required('postOffice'), (value) => {
        return value?.name ? true : false;
      })
  });
};
