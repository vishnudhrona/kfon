import { Box } from '@kfonbss/bss-ui-components';
import { useParams } from '@tanstack/react-router';

import CorporateGovernmentEnquiry from '@/features/public/pages/enquiryForms/components/CorporateGovernmentEnquiry';

const CreateCorporateEnquiryForm = () => {
  return (
    <Box h='full' position='relative'>
      <CorporateGovernmentEnquiry hideLeftSection={true} tabType="CORPORATE" />
    </Box>
  );
};

export const EditCorporateEnquiryForm = () => {
  const { enquiryId } = useParams({ strict: false });
  return (
    <Box h='full' position='relative'>
      <CorporateGovernmentEnquiry hideLeftSection={true} tabType="CORPORATE" enquiryId={enquiryId} />
    </Box>
  );
};

export default CreateCorporateEnquiryForm;
