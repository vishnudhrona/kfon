import { Button, HStack, Icons } from '@kfonbss/bss-ui-components';
import { useTranslation } from 'react-i18next';

const tabStyle = (active) => ({
  border: 'none',
  bg: active ? '#FFDE74' : 'transparent',
  color: active ? '#000' : 'gray.500',
  fontSize: '16px',
  fontWeight: '500',
  fontStyle: 'normal',
  width: '120px',
  height: '40px',
  borderRadius: 'full'
});

const EnquiryForwardTypeTabs = ({ selectedForwardType, onForwardTypeChange }) => {
  const { t } = useTranslation();
  const inboxActive = selectedForwardType === 'inbox';
  const outboxActive = selectedForwardType === 'outbox';

  return (
    <HStack bg='gray.100' borderRadius='full' p={1} gap='10px'>
      <Button {...tabStyle(inboxActive)} onClick={() => onForwardTypeChange('inbox')}>
        <Icons.InboxIcon color={inboxActive ? '#000' : 'gray.500'} /> {t('inbox')}
      </Button>
      <Button {...tabStyle(outboxActive)} onClick={() => onForwardTypeChange('outbox')}>
        <Icons.OutboxIcon color={outboxActive ? '#000' : 'gray.500'} /> {t('outbox')}
      </Button>
    </HStack>
  );
};

export default EnquiryForwardTypeTabs;
