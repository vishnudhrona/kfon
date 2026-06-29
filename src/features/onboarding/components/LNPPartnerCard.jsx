import EnquiryPartnerCard from './EnquiryPartnerCard';
import PartnerForwardPlusPopup from './PartnerForwardPlusPopup';
import PartnerStatusPopup from './PartnerStatusPopup';

const LNPPartnerCard = ({ data, index, onClick, expandAll, forwardType }) => {
  const statusCode = data.status?.code;

  return (
    <EnquiryPartnerCard
      data={data}
      index={index}
      onClick={onClick}
      expandAll={expandAll}
      mainTitle={data.partnerCompanyName || '-'}
      trackingId={data.trackingId || data.id || '-'}
      status={{ name: data.status?.name || '-', code: statusCode }}
      contactName={data.partnerName || '-'}
      address={data.partnerAddress}
      location={`${data.partnerLocation || ''}, ${data.district || ''} - ${data.partnerPincode || ''}`}
      latitude={data.partnerLatitude}
      longitude={data.partnerLongitude}
      mobile={data.partnerMobile || '-'}
      altMobile={data.partnerPhone}
      landline={data.partnerLandline}
      email={data.partnerEmail || '-'}
      source={data.createdBy}
      onboardStatusCode='APPROVED'
      previewPath={`/app/partners/list/lnp/${data.partnerOnboardId}`}
      onboardPath={`/app/partners/enquiry-list/onboarding/lnp/${data.enquiryId}`}
      onboardState={{
        ...data,
        onboarded: !!data.onboarded,
        trackingId: data.trackingId || data.id
      }}
      FeasibilityPopup={PartnerStatusPopup}
      ApprovePopup={PartnerStatusPopup}
      ForwardPlusPopup={PartnerForwardPlusPopup}
      partnerType='lnp'
      forwardType={forwardType}
      moreDetails={{
        cableTvSubCount: data.partnerCableTvSubCount,
        internetSubCount: data.partnerInternetSubCount,
        networkQty: data.partnerNetworkQty
      }}
      showOnboardPending={!!(data.partnerOnboardingId || data.partnerOnboardId) && statusCode !== 'ONBOARDED'}
      statusDotBg={statusCode === 'APPROVED' ? 'green.500' : '#FD1C7A'}
      assignedFromSeatName={data.assignedFromSeatName}
      assignedFromUsername={data.assignedFromUsername}
      assignedToSeatName={data.assignedToSeatName}
      assignedToUsername={data.assignedToUsername}
    />
  );
};

export default LNPPartnerCard;
