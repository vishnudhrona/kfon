import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { assignEnquiryToLNP, fetchLNPList } from '../../actions';
import { getLNPList } from '../../selectors';
import AssignToPopup from './AssignToPopup';

const AssignToLNP = ({ open, setOpen, selectedEnquiryId }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const lnpList = useSelector(getLNPList);

  const handleFetchList = useCallback((pincode) => dispatch(fetchLNPList({ pincode })), [dispatch]);

  const handleAssign = useCallback(
    (selectedLNP, enquiryId) => {
      dispatch(assignEnquiryToLNP({ enquiryId, lnpId: selectedLNP?.id, lnpName: selectedLNP?.name }));
    },
    [dispatch]
  );

  return (
    <AssignToPopup
      open={open}
      setOpen={setOpen}
      titleMain={t('lnp')}
      fieldName='lnpId'
      list={lnpList}
      selectedEnquiryId={selectedEnquiryId}
      onFetchList={handleFetchList}
      onAssign={handleAssign}
    />
  );
};

export default AssignToLNP;
