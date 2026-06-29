import ApplicationForm from '../components/common/ApplicationForm';
import { CONNECTION_TYPES } from '../components/common/constants';
import AdharDetails from '../components/newEkycApplication/AdharDetails';

const EkycHomeConnection = () => {
  return <ApplicationForm CustomBasicDetails={AdharDetails} connectionType={CONNECTION_TYPES.EKYC_CONNECTION} />;
};

export default EkycHomeConnection;
