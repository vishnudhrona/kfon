import { Box, VStack } from '@kfonbss/bss-ui-components';
import { useNavigate, useParams, useSearch } from '@tanstack/react-router';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import IssueCard from '@/components/custom/IssueCard';

import { fetchAttachment, fetchFileUrl } from '../action';
import { getAttachment, getInboxTickets } from '../selector';
import TicketOverview from './TicketOverview';

const TicketDetails = () => {
  const { ticketId } = useParams({ from: '/app/crm/ticket-list/ticket-details/$ticketId' });
  const search = useSearch({ strict: false });
  const viewType = search.viewType || 'inbox';
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const attachment = useSelector(getAttachment);
  const inboxTickets = useSelector(getInboxTickets);

  const pinnedCount = (inboxTickets || []).filter((item) => item.isClicked).length;

  useEffect(() => {
    if (ticketId) {
      dispatch(fetchAttachment(ticketId));
    }
  }, [dispatch, ticketId]);

  useEffect(() => {
    if (attachment?.attachments) {
      attachment.attachments.forEach((item) => {
        if (item?.fileId && !item.fileId.startsWith('http')) {
          dispatch(fetchFileUrl(item.fileId));
        }
      });
    }
    if (attachment?.movements) {
      attachment.movements.forEach((movement) => {
        movement.imageUrl?.forEach((img) => {
          if (img?.fileId && !img.fileId.startsWith('http')) {
            dispatch(fetchFileUrl(img.fileId));
          }
        });
        movement.videoUrl?.forEach((vid) => {
          if (vid?.fileId && !vid.fileId.startsWith('http')) {
            dispatch(fetchFileUrl(vid.fileId));
          }
        });
      });
    }
  }, [attachment, dispatch]);

  const handleBack = () => {
    navigate({
      to: '/app/crm/ticket-list',
      search: { viewType }
    });
  };

  if (!attachment) {
    return (
      <Box p={5} textAlign="center">
        {t('ticketNotFoundRedirectingToList')}
      </Box>
    );
  }

  return (
    <VStack gap={0} alignItems="stretch" h="calc(100vh - 120px)" overflow="hidden">
      <IssueCard
        data={[attachment]}
        onOpen={handleBack}
        isExpandOnly={true}
        border={'1px solid #E8EFF4'}
        noSerialKey={false}
        viewType={viewType}
        pinnedCount={pinnedCount}
        currentStatus={attachment?.status}
      />
      <Box flex="1" overflow="hidden">
        <TicketOverview isOpen={true} onClose={handleBack} data={attachment} viewType={viewType} />
      </Box>
    </VStack>
  );
};

export default TicketDetails;