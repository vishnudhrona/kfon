import { formatDisplayDate } from '@/utils/dateUtils';

/**
 * Maps a raw stock detail item (from myStockList / inventoryDetailsList API)
 * to the shape expected by DeviceDetailCard.
 */
export const mapStockItemToCard = (item) => ({
  detailsId: item.detailsId,
  deviceType: item.type?.name,
  category: item.category?.name ?? item.categoryName ?? item.deviceCategory,
  make: item.make?.name,
  modelNo: item.model?.name ?? item.deviceModel,
  custodian: item.custodian?.username,
  custodianId: item.custodianId ?? '',
  status: item.status,
  condition: item.deviceCondition,
  serialNumber: item.deviceSlNo,
  gponSerialNumber: item.gponSerialNumber,
  equipmentId: item.deviceSlNo ?? '',
  macAddress: item.deviceMac,
  warrantyStartDate: formatDisplayDate(item.warrantyStartDate),
  warrantyEndDate: formatDisplayDate(item.warrantyEndDate),
  distanceInKm: item.distanceInKm ?? item.sfpDistance,
  oem: item.vendor
    ? {
        name: item.vendor.name,
        contactNo: item.vendor.mobileNumber ?? '',
        address: item.vendor.address ?? ''
      }
    : null,
  mappedToLocation: item.mappedToLocation ?? false
});

/**
 * Maps a raw transferred-stock item to the shape expected by
 * StockTransferModal / DeviceDetailCard in the TransferredStock view.
 */
export const mapTransferredItemToCard = (item) => ({
  slNo: item.deviceId,
  transferId: item.id,
  deviceType: item.deviceType,
  category: item.category,
  modelNo: item.deviceModel,
  custodian: item.custodianName,
  status: item.status,
  condition: item.deviceCondition,
  serialNumber: item.deviceSerialNumber,
  gponSerialNumber: item.gponSerialNumber,
  equipmentId: item.deviceSlNo,
  macAddress: item.macAddress,
  distanceInKm: item.distanceInKm ?? item.sfpDistance
});
