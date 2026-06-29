import { useNavigate } from '@tanstack/react-router';

import BPLEnquiry from '@/features/public/pages/enquiryForms/components/BPLEnquiry';

const EwsEnquiryPage = () => {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate({ to: '/app/subscribers/enquiry-list', search: { type: 'EWS' } });
  };

  return <BPLEnquiry onSuccess={handleSuccess} bare />;
};

export default EwsEnquiryPage;
