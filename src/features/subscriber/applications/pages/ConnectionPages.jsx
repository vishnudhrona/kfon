import ApplicationForm from '../components/common/ApplicationForm';
import { CONNECTION_TYPES } from '../components/common/constants';

export const HomeConnectionPage = () => (
  <ApplicationForm connectionType={CONNECTION_TYPES.HOME_CONNECTION} />
);

export const SmeConnectionPage = () => (
  <ApplicationForm connectionType={CONNECTION_TYPES.SME_CONNECTION} />
);
