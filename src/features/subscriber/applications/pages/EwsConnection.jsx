import ApplicationForm from '../components/common/ApplicationForm';
import { CONNECTION_TYPES } from '../components/common/constants';
import AdharDetails from '../components/newEkycApplication/AdharDetails';

const EwsConnection = () => {
  return (
    <ApplicationForm CustomBasicDetails={AdharDetails} connectionType={CONNECTION_TYPES.EWS_EKYC_CONNECTION} hideGst />
  );
};

export default EwsConnection;
