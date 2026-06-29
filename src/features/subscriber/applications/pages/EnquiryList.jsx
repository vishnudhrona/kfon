import { Box } from '@kfonbss/bss-ui-components';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import EnquiryCardList from '../components/EnquiryCardList';
import EnquiryDashboardCards from '../components/EnquiryDashboardCards';
import EnquiryForwardTypeTabs from '../components/EnquiryForwardTypeTabs';
import AssignToFE from '../components/pop-up/AssignToFE';
import AssignToLNP from '../components/pop-up/AssignToLNP';
import CheckFeasibility from '../components/pop-up/CheckFeasibility';
import Disposition from '../components/pop-up/Disposition';
import NewApplication from '../components/pop-up/NewApplication';
import NewEnquiry from '../components/pop-up/NewEnquiry';
import NewMeeting from '../components/pop-up/NewMeeting';
import SubscriberForwardPlusPopup from '../components/pop-up/SubscriberForwardPlusPopup';
import useEnquiryList from '../hooks/useEnquiryList';

const EnquiryList = () => {
  const { t } = useTranslation();
  const {
    selectedType,
    isEwsSelected,
    selectedForwardType,
    showStats,
    expandAll,
    listConfig,
    open, setOpen,
    newEnquiryOpen, setNewEnquiryOpen,
    meetingOpen, setMeetingOpen,
    dispositionOpen, setDispositionOpen,
    assignToOpen, setAssignToOpen,
    assignToLNPOpen, setAssignToLNPOpen,
    feasibilityOpen, setFeasibilityOpen,
    forwardPlusOpen, setForwardPlusOpen,
    selectedEnquiryId,
    handleForwardTypeChange
  } = useEnquiryList();

  const searchPrefix = useMemo(
    () => (
      <EnquiryForwardTypeTabs
        selectedForwardType={selectedForwardType}
        onForwardTypeChange={handleForwardTypeChange}
      />
    ),
    [selectedForwardType, handleForwardTypeChange]
  );

  return (
    <Box display='flex' flexDirection='column' h='calc(100vh - 120px)' overflow='hidden'>
      {showStats && !isEwsSelected && <EnquiryDashboardCards />}
      <EnquiryCardList
        key={`${selectedType}-${selectedForwardType}-${expandAll}`}
        pageTitle={t('enquiryList')}
        searchPrefix={searchPrefix}
        expandAll={expandAll}
        {...listConfig}
      />
      <NewApplication open={open} setOpen={setOpen} selectedEnquiryId={selectedEnquiryId} isEws={isEwsSelected} />
      <NewEnquiry open={newEnquiryOpen} setOpen={setNewEnquiryOpen} />
      <NewMeeting open={meetingOpen} setOpen={setMeetingOpen} selectedEnquiryId={selectedEnquiryId} />
      <Disposition enquiryId={selectedEnquiryId?.enquiryId} open={dispositionOpen} setOpen={setDispositionOpen} />
      <AssignToFE open={assignToOpen} setOpen={setAssignToOpen} selectedEnquiryId={selectedEnquiryId} />
      <AssignToLNP open={assignToLNPOpen} setOpen={setAssignToLNPOpen} selectedEnquiryId={selectedEnquiryId} />
      <CheckFeasibility
        open={feasibilityOpen}
        setOpen={setFeasibilityOpen}
        enquiryId={selectedEnquiryId?.enquiryId}
        latitude={selectedEnquiryId?.latitude}
        longitude={selectedEnquiryId?.longitude}
        address={selectedEnquiryId?.address}
      />
      <SubscriberForwardPlusPopup
        open={forwardPlusOpen}
        setOpen={setForwardPlusOpen}
        selectedEnquiryId={selectedEnquiryId}
        forwardType={selectedForwardType}
      />
    </Box>
  );
};

export default EnquiryList;
