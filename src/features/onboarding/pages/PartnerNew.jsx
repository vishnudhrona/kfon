import { useNavigate } from '@tanstack/react-router';

import PartnerEnquiry from '@/features/public/pages/enquiryForms/components/PartnerEnquiry';

const PartnerNew = () => {
  const navigate = useNavigate();

  const handleCancel = () => {
    navigate({ to: '/app/partners/list' });
  };

  return <PartnerEnquiry isPopup={true} onCancel={handleCancel} />;
};

export default PartnerNew;
