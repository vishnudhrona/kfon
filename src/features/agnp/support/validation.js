import * as yup from 'yup';

import { validation } from '@/utils/validationUtils';

 export const ticketFormSchema = (t) => {
    const validate = validation(t)
    return yup.object().shape({
        selectSubject: yup.string().required(validate.required('selectSubject')),
        attachment: yup.string().required(validate.required('attachment')),
        description:yup.string().required(validate.required('description'))
   })
 }