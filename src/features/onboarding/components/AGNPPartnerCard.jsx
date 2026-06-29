import EnquiryPartnerCard from './EnquiryPartnerCard';
import PartnerForwardPlusPopup from './PartnerForwardPlusPopup';
import PartnerStatusPopup from './PartnerStatusPopup';

const AGNPPartnerCard = ({ data, index, onClick, expandAll, forwardType }) => {
  const statusCode = data.agnpStatus?.code;
  const statusName = data.agnpStatus?.name || (typeof data.agnpStatus === 'string' ? data.agnpStatus : 'Pending');

  return (
    <EnquiryPartnerCard
      data={data}
      index={index}
      onClick={onClick}
      expandAll={expandAll}
      mainTitle={data.agnpName || '-'}
      trackingId={data.trackingId || data.agnpId || '-'}
      status={{ name: statusName, code: statusCode }}
      contactName={data.agnpContactName || '-'}
      address={data.agnpAddress}
      location={`${data.agnpLocation || ''}, ${data.agnpDistrict || ''} - ${data.agnpPincode || ''}`}
      latitude={data.agnpLatitude}
      longitude={data.agnpLongitude}
      mobile={data.agnpMobileNumber || '-'}
      altMobile={data.agnpAltrContactNumber}
      landline={data.agnpLandlineNumber}
      email={data.agnpEmail || '-'}
      source={data.createdBy || 'WEB'}
      onboardStatusCode='APPROVED'
      previewPath={`/app/partners/list/agnp/${data.partnerOnboardId}`}
      onboardPath={`/app/partners/enquiry-list/onboarding/agnp/${data.enquiryId}`}
      onboardState={{
        ...data,
        onboarded: !!data.onboarded,
        trackingId: data.trackingId || data.agnpId
      }}
      FeasibilityPopup={PartnerStatusPopup}
      ApprovePopup={PartnerStatusPopup}
      ForwardPlusPopup={PartnerForwardPlusPopup}
      partnerType='agnp'
      forwardType={forwardType}
      assignedFromSeatName={data.assignedFromSeatName}
      assignedFromUsername={data.assignedFromUsername}
      assignedToSeatName={data.assignedToSeatName}
      assignedToUsername={data.assignedToUsername}
    />
  );
};

export default AGNPPartnerCard;
