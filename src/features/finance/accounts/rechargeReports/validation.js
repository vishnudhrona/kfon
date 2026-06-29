import * as yup from 'yup';

// import { validation } from '@/utils/validationUtils';

export const rechargeFilterSchema = () => {
  // const validate = validation(t);
  return yup.object().shape({
    month: yup.string().optional(),
    gateway: yup.string().optional(),
    search: yup.string().optional()
  });
};
