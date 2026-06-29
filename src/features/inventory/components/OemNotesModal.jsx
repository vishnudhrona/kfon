import NotesModal from '@/features/notes/components/NotesModal';
import { NOTES_MODULE } from '@/features/notes/constants';

import DeviceInfoHeader from './DeviceInfoHeader';

const { MODULE_NAME, OEM: SUB_MODULE } = NOTES_MODULE.INVENTORY;

/**
 * OemNotesModal — thin wrapper around the shared NotesModal.
 *
 * Two usage modes:
 *  - Card context: pass `device` (already-mapped object) + `deviceId`
 *  - Notification context: pass only `deviceId` — DeviceInfoHeader fetches internally
 */
const OemNotesModal = ({ isOpen, onClose, device, deviceId }) => (
  <NotesModal
    isOpen={isOpen}
    onClose={onClose}
    moduleId={deviceId}
    moduleName={MODULE_NAME}
    subModule={SUB_MODULE}
    title='sendNotes'
    headerContent={<DeviceInfoHeader device={device} deviceId={deviceId} />}
  />
);

export default OemNotesModal;
