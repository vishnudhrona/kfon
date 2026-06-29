import { Box } from '@kfonbss/bss-ui-components';
import { useNavigate, useParams } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import CustomLoaderProvider from '@/components/custom/CustomLoaderProvider';
import { getApiProgress } from '@/features/others/ApiProgress/selectors';

import { ACTION_TYPES, downloadAgnpListCsv, fetchPartnerDetailsById, resetPassword } from '../action';
import AddPonPort from '../components/AddPonPort';
import AddServiceArea from '../components/AddServiceArea';
import PartnerDetailPreview, { ServiceAreaPopup } from '../components/PartnerDetailPreview';
import { getPartnerDetails } from '../selector';
import { actions } from '../slice';

const PartnerPreviewList = ({ getRowListData, detailedData, onResetPassword, isLoading, clearDetailedData }) => {
  const navigate = useNavigate();
  const params = useParams({ strict: false });
  const id = params.id;

  const [isServiceAreaOpen, setIsServiceAreaOpen] = useState(false);
  const [isViewServiceAreaOpen, setIsViewServiceAreaOpen] = useState(false);
  const [isPonPortOpen, setIsPonPortOpen] = useState(false);

  useEffect(() => {
    if (id) {
      clearDetailedData(null);
      getRowListData(id);
    }
  }, [id, getRowListData, clearDetailedData]);

  const handleBackClick = () => {
    navigate({ to: '/app/partners/list' });
  };

  const handleResetPassword = () => {
    if (detailedData?.basicDetails?.id) {
      onResetPassword(detailedData.basicDetails.id);
    }
  };

  const handleAddServiceArea = () => {
    setIsServiceAreaOpen(true);
  };

  return (
    <CustomLoaderProvider isLoading={isLoading || !detailedData} h='full' w='full'>
      {detailedData && (
        <>
          <Box h='full' overflowY='auto' p={4}>
            <PartnerDetailPreview
              detailedData={detailedData}
              onAddServiceArea={handleAddServiceArea}
              onViewServiceArea={() => setIsViewServiceAreaOpen(true)}
              onBack={handleBackClick}
              onResetPassword={handleResetPassword}
            />
          </Box>
          <AddServiceArea
            isOpen={isServiceAreaOpen}
            onClose={() => setIsServiceAreaOpen(false)}
            id={detailedData?.basicDetails?.id}
          />
          <AddPonPort isOpen={isPonPortOpen} onClose={() => setIsPonPortOpen(false)} id={detailedData?.basicDetails?.id} />
          <ServiceAreaPopup
            isOpen={isViewServiceAreaOpen}
            onClose={() => setIsViewServiceAreaOpen(false)}
            serviceAreas={detailedData?.serviceAreas}
          />
        </>
      )}
    </CustomLoaderProvider>
  );
};

const mapStateToProps = (state) => ({
  detailedData: getPartnerDetails(state),
  isLoading: !!getApiProgress(state)?.[ACTION_TYPES.FETCH_PARTNER_DETAILS_BY_ID]
});

const mapDispatchToProps = {
  getRowListData: fetchPartnerDetailsById,
  onResetPassword: resetPassword,
  downloadCsv: downloadAgnpListCsv,
  clearDetailedData: actions.setPartnerDetails
};

export default connect(mapStateToProps, mapDispatchToProps)(PartnerPreviewList);
