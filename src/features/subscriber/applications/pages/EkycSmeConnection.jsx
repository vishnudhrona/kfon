import ApplicationForm from '../components/common/ApplicationForm';
import { CONNECTION_TYPES } from '../components/common/constants';
import AdharDetails from '../components/newEkycApplication/AdharDetails';

const EkycSmeConnection = () => {
  return <ApplicationForm CustomBasicDetails={AdharDetails} connectionType={CONNECTION_TYPES.SME_EKYC_CONNECTION} />;
};

export default EkycSmeConnection;
