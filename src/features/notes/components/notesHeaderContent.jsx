import DeviceInfoHeader from '@/features/inventory/components/DeviceInfoHeader';

import { NOTES_MODULE } from '../constants';

/**
 * Returns the appropriate headerContent element for a NotesModal
 * based on moduleName + subModule.
 *
 * Pass moduleId so header components that need to self-fetch can do so.
 */
export const resolveNotesHeaderContent = ({ moduleName, subModule, moduleId }) => {
  if (moduleName === NOTES_MODULE.INVENTORY.MODULE_NAME && subModule === NOTES_MODULE.INVENTORY.OEM) {
    return <DeviceInfoHeader deviceId={moduleId} />;
  }
  return null;
};
