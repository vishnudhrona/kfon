import * as yup from 'yup';

export const walletFilterSchema = () => {
  // const validate = validation(t);
  return yup.object().shape({
    district: yup.string().optional(),
    status: yup.string().optional(),
    search: yup.string().optional()
  });
};
