import * as yup from 'yup';

// import { validation } from '@/utils/validationUtils';

export const gstFilterSchema = () => {
  // const validate = validation(t);
  return yup.object().shape({
    month: yup.string().optional(),
    gstin: yup.string().optional()
  });
};
