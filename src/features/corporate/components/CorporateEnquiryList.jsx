import { Box, Button, HStack, Icons, Popover, Text } from '@kfonbss/bss-ui-components';
import { useNavigate } from '@tanstack/react-router';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import CsvDownloadBtn from '@/components/custom/CsvDownloadBtn';
import ExpandButton from '@/components/custom/ExpandButton';
import GenericCardPage from '@/components/custom/GenericCardPage';
import { showToast } from '@/components/custom/Toast';
import { STORAGE_KEYS } from '@/constants';
import { PERMISSIONS } from '@/constants/permissions';
import { SERVER_SIDE_TABLE_KEYS } from '@/constants/server_table';
import { usePageActions } from '@/hooks/usePageActions';
import { getTokenData } from '@/utils/encryptionUtils';

import { downloadEnquiryListCsv, fetchCorporateEnquiryExpandedList, fetchCorporateEnquiryOutbox, fetchCorporateEnquirySummaryList } from '../action';
import { createCorporateEnquiryRoute } from '../routes';
import { getEnquiryList } from '../selector';
import EnquiryCardItem from './EnquiryCardItem';
import ForwardPopup from './popUps/ForwardPopup';
import LocationPopup from './popUps/LocationPopup';

const { FilterIcon, UserProfileIcon, InboxIcon, OutboxIcon, DownArrowIcon } = Icons;

const CorporateEnquiryList = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const tokenData = getTokenData(STORAGE_KEYS.AUTH_TOKEN);
  const seatId = tokenData?.seatId ?? null;
  const navigate = useNavigate();
  const { hasPermission } = usePageActions();
  const [isLocationPopupOpen, setIsLocationPopupOpen] = useState(false);
  const [isForwardOpen, setIsForwardOpen] = useState(false);
  const [forwardEnquiry, setForwardEnquiry] = useState(null);
  const [isAllExpanded, setIsAllExpanded] = useState(false);

  const handleSetIsAllExpanded = useCallback((value) => {
    setIsAllExpanded(value);
    if (value) {
      dispatch(fetchCorporateEnquiryExpandedList({ ...(seatId && { seatId }) }));
    }
  }, [dispatch, seatId]);
  const [selectedEnquiries, setSelectedEnquiries] = useState([]);
  const [selectedType, setSelectedType] = useState('ALL');
  const [viewType, setViewType] = useState('inbox');

  const handleForwardPlus = useCallback((row) => {
    setForwardEnquiry({ enquiryId: row?.enquiryId ?? null });
    setIsForwardOpen(true);
  }, []);

  const handleForward = useCallback((row) => {
    setForwardEnquiry({
      enquiryId: row?.enquiryId ?? null
    });
    setIsForwardOpen(true);
  }, []);

  const handleSelectRow = useCallback(
    (id) => {
      setSelectedEnquiries((prev) =>
        prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
      );
    },
    []
  );

  const handleAssign = () => {
    if (selectedEnquiries.length === 0) {
      showToast({
        title: t('warning'),
        theme: 'colored',
        description: t('pleaseSelectAtLeastOneEnquiry'),
        type: 'warning'
      });
      return;
    }
    setForwardEnquiry({ enquiryId: selectedEnquiries[0] });
    setIsForwardOpen(true);
  };

  const EnquiryCard = useCallback(
    ({ data, index }) => (
      <EnquiryCardItem
        data={data}
        index={index}
        isSelected={selectedEnquiries.includes(data.enquiryId)}
        onSelect={handleSelectRow}
        onForwardPlus={handleForwardPlus}
        onForward={handleForward}
        isAllExpanded={isAllExpanded}
        viewType={viewType}
      />
    ),
    [handleForwardPlus, handleForward, handleSelectRow, selectedEnquiries, isAllExpanded, viewType]
  );

  const TYPE_OPTIONS = [
    { name: 'All', code: 'ALL' },
    { name: 'Private', code: 'PRIVATE' },
    { name: 'Government', code: 'GOVERNMENT' }
  ];

  const inboxOutboxToggle = (
    <HStack spacing={0} bg="gray.100" borderRadius="full" p={1} gap='10px'>
      <Button
        border="none"
        bg={viewType === 'inbox' ? '#FFDE74' : 'transparent'}
        color={viewType === 'inbox' ? '#000' : 'gray.500'}
        onClick={() => setViewType('inbox')}
        fontSize='16px'
        fontWeight='500'
        fontStyle='normal'
        width='140px'
        height='40px'
      >
        <InboxIcon color={viewType === 'inbox' ? '#000' : 'gray.500'} /> {t('inbox')}
      </Button>
      <Button
        border="none"
        bg={viewType === 'outbox' ? '#FFDE74' : 'transparent'}
        color={viewType === 'outbox' ? '#000' : 'gray.500'}
        onClick={() => setViewType('outbox')}
        fontSize='16px'
        fontWeight='500'
        fontStyle='normal'
        width='140px'
        height='40px'
      >
        <OutboxIcon color={viewType === 'outbox' ? '#000' : 'gray.500'} /> {t('outbox')}
      </Button>
    </HStack>
  );

  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);

  const selectedTypeLabel = TYPE_OPTIONS.find((opt) => opt.code === selectedType)?.name ?? 'All';

  const filters = (
    <HStack spacing={2}>
      <Popover.Root
        open={isTypeDropdownOpen}
        onOpenChange={(e) => setIsTypeDropdownOpen(e.open)}
        positioning={{ placement: 'bottom-start' }}
      >
        <Popover.Trigger asChild>
          <Button variant='outline' borderRadius='md' height='40px'>
            {selectedTypeLabel}
            <DownArrowIcon style={{ marginLeft: '6px' }} />
          </Button>
        </Popover.Trigger>
        <Popover.Positioner>
          <Popover.Content
            width='160px'
            bg='white'
            boxShadow='md'
            border='1px solid'
            borderColor='gray.200'
            borderRadius='md'
            p={1}
          >
            <Popover.Body p={0}>
              {TYPE_OPTIONS.map((opt) => (
                <Box
                  key={opt.code}
                  px={3}
                  py={2}
                  cursor='pointer'
                  borderRadius='sm'
                  bg={selectedType === opt.code ? 'gray.100' : 'transparent'}
                  _hover={{ bg: 'gray.100' }}
                  onClick={() => { setSelectedType(opt.code); setIsTypeDropdownOpen(false); }}
                >
                  <Text fontSize='14px' fontWeight={selectedType === opt.code ? '600' : '400'}>
                    {opt.name}
                  </Text>
                </Box>
              ))}
            </Popover.Body>
          </Popover.Content>
        </Popover.Positioner>
      </Popover.Root>
      <Button variant='outline' borderRadius='md' height='40px'>
        <FilterIcon />
        {t('filter')}
      </Button>
    </HStack>
  );

  const actions = (
    <>
      {hasPermission(PERMISSIONS.CORPORATE.CORP_DOWNLOAD_CSV) && (
        <CsvDownloadBtn
          variant='outline'
          borderRadius='md'
          height='40px'
          onClick={() => dispatch(downloadEnquiryListCsv({ type: selectedType }))}
        />
      )}
      {hasPermission(PERMISSIONS.CORPORATE.CORP_CREATE_ENQUIRY) && (
        <Button
          variant='outline'
          borderRadius='md'
          height='40px'
          onClick={() => navigate({ to: createCorporateEnquiryRoute.to })}
        >
          <UserProfileIcon />
          {t('createCorporateEnquiry')}
        </Button>
      )}
      {viewType !== 'outbox' && hasPermission(PERMISSIONS.CORPORATE.CORP_FORWARD_PLUS) && (
        <Button variant='outline' borderRadius='md' height='40px' onClick={handleAssign}>
          {t('forward')}
        </Button>
      )}
      <ExpandButton isAllExpanded={isAllExpanded} setIsAllExpanded={handleSetIsAllExpanded} />
    </>
  );

  return (
    <>
      <GenericCardPage
        key={`${viewType}-${selectedType}`}
        dataSelector={getEnquiryList}
        fetchAction={viewType === 'outbox' ? fetchCorporateEnquiryOutbox : fetchCorporateEnquirySummaryList}
        tableKey={SERVER_SIDE_TABLE_KEYS.ENQUIRY_LIST}
        staticParams={{
          ...(seatId && { seatId }),
          ...(selectedType !== 'ALL' && { type: selectedType })
        }}
        searchPrefix={inboxOutboxToggle}
        filters={filters}
        actions={actions}
        columns={[]}
        CardComponent={EnquiryCard}
      />
      <LocationPopup isOpen={isLocationPopupOpen} setIsOpen={setIsLocationPopupOpen} />
      <ForwardPopup
        isOpen={isForwardOpen}
        setIsOpen={setIsForwardOpen}
        enquiryId={forwardEnquiry?.enquiryId}
      />
    </>
  );
};

export default CorporateEnquiryList;
