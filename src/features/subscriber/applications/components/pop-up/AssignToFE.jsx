import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { assignEnquiryToFE, fetchFEList } from '../../actions';
import { getFEList } from '../../selectors';
import AssignToPopup from './AssignToPopup';

const AssignToFE = ({ open, setOpen, selectedEnquiryId }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const feList = useSelector(getFEList);

  const handleFetchList = useCallback((pincode) => dispatch(fetchFEList({ pincode })), [dispatch]);

  const handleAssign = useCallback(
    (selectedFE, enquiryId) => {
      dispatch(assignEnquiryToFE({ enquiryId, feId: selectedFE?.id, feName: selectedFE?.name }));
    },
    [dispatch]
  );

  return (
    <AssignToPopup
      open={open}
      setOpen={setOpen}
      titleMain={t('fieldEngineer')}
      fieldName='feId'
      list={feList}
      selectedEnquiryId={selectedEnquiryId}
      onFetchList={handleFetchList}
      onAssign={handleAssign}
    />
  );
};

export default AssignToFE;
