import { useMemo } from 'react';

import { PERMISSIONS } from '@/constants/permissions';
import { usePageActions } from '@/hooks/usePageActions';

export const ENQUIRY_STAGE = new Set(['ENQUIRY', 'REJECTED']);
const SUBMITTED_STAGE = new Set(['SUBMITTED', 'RE-SUBMITTED']);
export const CONNECTED_STAGE = new Set(['CONNECTED', 'KYC_COMPLETED_FRC_PENDING', 'ACTIVE', 'IN_ACTIVE']);
const NO_ACTION_STAGE = new Set(['VERIFIED', 'KYC_COMPLETED_FRC_PENDING', 'ACTIVE', 'IN_ACTIVE']);

export const isNoActionStatus = (status) => NO_ACTION_STAGE.has(status?.toUpperCase());

const useEnquiryActionItems = ({ data, onAction, latestDisposition }) => {
  const { hasPermission } = usePageActions();
  // enquiryStatus is a display string ("Re-Submitted") — stage Sets match its uppercased form.
  const status = data.enquiryStatus?.toUpperCase();
  const isFeasible = latestDisposition?.toLowerCase() === 'feasible';
  const isEnquiryStage = ENQUIRY_STAGE.has(status);
  const isSubmittedStage = SUBMITTED_STAGE.has(status);
  const isRejected = status === 'REJECTED';

  return useMemo(
    () => [
      {
        label: 'meeting',
        onClick: (row) => onAction?.(row, 'MEETING'),
        hidden: !hasPermission(PERMISSIONS.SUBSCRIBER.SUBSCRIBER_MEETING) || !isEnquiryStage
      },
      {
        label: 'disposition',
        onClick: (row) => onAction?.(row, 'DISPOSITION'),
        hidden: !hasPermission(PERMISSIONS.SUBSCRIBER.SUBSCRIBER_DISPOSITION) || !isEnquiryStage
      },
      {
        label: 'checkFeasibility',
        onClick: (row) => onAction?.(row, 'CHECK_FEASIBILITY'),
        hidden: !hasPermission(PERMISSIONS.SUBSCRIBER.SUBSCRIBER_DISPOSITION) || !isEnquiryStage
      },
      {
        label: 'cafDetails',
        onClick: (row) => onAction?.(row, 'CAF'),
        hidden:
          !hasPermission(PERMISSIONS.SUBSCRIBER.SUBSCRIBER_ONBOARD_SUBSCRIBER) ||
          (!(isEnquiryStage && isFeasible) && !isRejected)
      },
      {
        label: 'forwardPlus',
        onClick: (row) => onAction?.(row, 'FORWARD_PLUS'),
        hidden:
          !hasPermission(PERMISSIONS.SUBSCRIBER.SUBSCRIBER_ENQ_FORWARD_PLUS) || (!isEnquiryStage && !isSubmittedStage)
      },
      {
        label: 'verify',
        onClick: (row) => onAction?.(row, 'VERIFY'),
        hidden: !hasPermission(PERMISSIONS.SUBSCRIBER.SUBSCRIBER_VERIFY) || !isSubmittedStage
      },
      {
        label: 'viewDetails',
        onClick: (row) => onAction?.(row, 'VIEW'),
        hidden: status === 'ENQUIRY'
      }
    ],
    [onAction, hasPermission, status, isEnquiryStage, isSubmittedStage, isRejected, isFeasible]
  );
};

export default useEnquiryActionItems;
