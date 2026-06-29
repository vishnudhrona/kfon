import { Outlet, useParams } from '@tanstack/react-router';

import EnquiryForm from './index';

const EnquiryIndex = () => {
  const { type } = useParams({ from: '/enquiry/$type' });

  const showTabs = ['home', 'corporate', 'government'].includes(type);

  return showTabs ? <EnquiryForm /> : <Outlet />;
};

export default EnquiryIndex;
