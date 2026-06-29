export const formatNearestConnectionPayload = (data) => {
    const {
        nearestLnp,
        nearestSubscriberId,
        connectedBy,
        distance,
        nearestClosureId,
        nearestPop,
        otc,
        fiberQuantity,
        remarks
    } = data;

    return {
        nearestLnpId: nearestLnp?.value ?? nearestLnp?.id ?? '',
        nearestSubscriberId: nearestSubscriberId || '',
        scope: connectedBy?.name ?? connectedBy?.code ?? connectedBy ?? '',
        distanceMeters: parseFloat(distance) || 0,
        nearestClosureId: nearestClosureId || '',
        nearestPop: nearestPop?.name ?? nearestPop?.label ?? nearestPop ?? '',
        estimatedOtc: parseFloat(otc) || 0,
        estimatedFiberQuantity: parseFloat(fiberQuantity) || 0,
        remarks: remarks || ''
    };
};

export const formatDispositionPayload = (data) => {
    const { disposition, reason, followUpUnit, followUpValue } = data;
    const followUpUnitCode = followUpUnit?.id ?? followUpUnit ?? '';
    const isDate = followUpUnitCode === 'DATE';

    return {
        disposition: disposition?.name ?? disposition ?? '',
        dispositionCode: disposition?.id ?? disposition ?? '',
        reason: reason?.name ?? reason ?? '',
        reasonCode: reason?.id ?? reason ?? '',
        followUpType: followUpUnitCode,
        followUpDays: isDate ? 0 : (parseFloat(followUpValue) || 0),
        followUpDate: isDate ? (followUpValue ?? '') : '',
        remarks: data.remarks || ''
    };
};

export const formatSubmitEnquiryLocationRequest = (data, customerId) => {
    const {
        locName,
        contactPerson,
        mobile,
        email,
        pincode,
        address,
        latitude,
        longitude,
        serviceId,
        packageType,
        packageId,
        additionalServices,
        remarks
    } = data;

    const normalizedAdditional = Array.isArray(additionalServices)
        ? additionalServices
            .filter(s => s?.serviceId && Array.isArray(s?.planIds) && s.planIds.length > 0)
            .map(s => ({
                serviceId: s.serviceId,
                planIds: s.planIds.map(p => p?.id ?? p),
                serviceName: s.serviceName || '',
                planNames: Array.isArray(s.planNames) ? s.planNames : []
            }))
        : [];

    return {
        locName: locName || '',
        contactPerson: contactPerson || '',
        mobile: mobile || '',
        email: email || '',
        pincode: pincode || '',
        address: address || '',
        latitude: parseFloat(latitude) || 0,
        longitude: parseFloat(longitude) || 0,
        serviceId: serviceId?.uuid || serviceId?.id || serviceId || '',
        serviceName: serviceId?.name || '',
        packageType: packageType?.id || packageType || '',
        packageId: packageId?.id || packageId || '',
        packageName: packageId?.packageName || packageId?.name || '',
        additionalServices: normalizedAdditional,
        remarks: remarks || '',
        ...(customerId && { customerId })
    };
};
