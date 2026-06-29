import { Button, Icons } from '@kfonbss/bss-ui-components';
import { useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

import CsvDownloadBtn from '@/components/custom/CsvDownloadBtn';
import ExpandButton from '@/components/custom/ExpandButton';
import { PERMISSIONS } from '@/constants/permissions';
import { usePageActions } from '@/hooks/usePageActions';

const { NewSubscriber } = Icons;

const StatisticsIcon = () => (
  <svg xmlns='http://www.w3.org/2000/svg' width='19' height='19' viewBox='0 0 19 19' fill='none'>
    <path
      d='M6.30469 17.4164V8.15635C6.30469 7.13469 7.13469 6.30469 8.15635 6.30469H11.8597'
      stroke='currentColor'
      strokeWidth='1.5'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
    <path
      d='M11.8617 17.4167V2.60167C11.8617 1.58 12.69 0.75 13.7133 0.75H15.565C16.5867 0.75 17.4167 1.58 17.4167 2.60167V15.565C17.4167 16.5867 16.5867 17.4167 15.565 17.4167H2.60167C1.58 17.4167 0.75 16.5867 0.75 15.565V13.7133C0.75 12.6917 1.58 11.8617 2.60167 11.8617H6.305'
      stroke='currentColor'
      strokeWidth='1.5'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
);

export const RetailActions = ({ expandAll, setExpandAll, onToggleStats, onDownloadCSV, onNewEnquiry }) => {
  const { t } = useTranslation();
  const { hasPermission } = usePageActions();

  return (
    <>
      <Button height='10' borderRadius='lg' variant='outline' onClick={onToggleStats}>
        <StatisticsIcon /> {t('statistics')}
      </Button>
      {hasPermission(PERMISSIONS.SUBSCRIBER.SUBSCRIBER_DOWNLOAD_CSV) && (
        <CsvDownloadBtn onClick={onDownloadCSV} />
      )}
      {hasPermission(PERMISSIONS.SUBSCRIBER.SUBSCRIBER_CREATE_ENQUIRY) && (
        <Button height='10' borderRadius='lg' variant='outline' onClick={onNewEnquiry}>
          <NewSubscriber /> {t('createEnquiry')}
        </Button>
      )}
      <ExpandButton isAllExpanded={expandAll} setIsAllExpanded={setExpandAll} />
    </>
  );
};

export const EwsActions = ({ expandAll, setExpandAll }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { hasPermission } = usePageActions();

  return (
    <>
      {hasPermission(PERMISSIONS.SUBSCRIBER.SUBSCRIBER_CREATE_ENQUIRY) && (
        <Button
          height='10'
          borderRadius='lg'
          variant='outline'
          onClick={() => navigate({ to: '/app/subscribers/ews-enquiry' })}
        >
          <NewSubscriber /> {t('createEnquiry')}
        </Button>
      )}
      <ExpandButton isAllExpanded={expandAll} setIsAllExpanded={setExpandAll} />
    </>
  );
};
