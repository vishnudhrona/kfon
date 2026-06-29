# MSP DC - KFON_DC Inventory

## Create Request

MSP creates a request.

**URL:** `https://devapi.kfon.co.in/bss-inventory-management-services/api/inventory-dc/msp-lnp/create-request`

**Request Body:**

```json
{
  "remarks": "sss",
  "requiredDeviceCount": 4,
  "typeId": "b25858f4-8e45-4ece-b83f-2a18949f4d54",
  "mspOrLnp": "MSP"
}
```

## List Requests

List all device requests.

**URL:** `https://devapi.kfon.co.in/bss-inventory-management-services/api/inventory-dc/msp-dc/device-requests-list`

**Response Example:**

```json
{
  "id": 8,
  "lnpRequestId": "975c5992-7d56-4570-8733-298720453531",
  "mspDcName": "dc.tvm",
  "deviceType": "ONT",
  "district": null,
  "requestedDeviceCount": 30,
  "approvedDeviceCount": null,
  "acceptedDeviceCount": null,
  "status": "Request submitted by MSP-DC",
  "remarks": "www",
  "createdDate": "2026-01-12T18:16:25.495905",
  "updatedDate": "2026-01-12T18:16:25.495905"
}
```

## Request Details

Fetch details for a specific MSP request.

**URL:** `https://devapi.kfon.co.in/bss-inventory-management-services/api/inventory-dc/fetch-msp/975c5992-7d56-4570-8733-298720453531`

**Response Example:**

```json
{
  "lnpRequestId": "975c5992-7d56-4570-8733-298720453531",
  "mspDcName": "dc.tvm",
  "deviceTypeName": "ONT",
  "requestedDeviceCount": 30,
  "approvedDeviceCount": 0,
  "remarks": "www",
  "approveRemarks": null,
  "requestStatus": 1,
  "approvalPending": true,
  "devices": [
    {
      "deviceId": "2faf8b57-4cd4-41bc-8d7b-b71dd5692e5b",
      "deviceType": "ONT",
      "deviceMake": "Alphion",
      "deviceCategory": "Non wifi router",
      "deviceModel": "AONT1420",
      "gponSerialNumber": "742302Q4745",
      "deviceSerialNumber": "33242SDS0028",
      "macAddress": "32:EE:E5:1C:38:54",
      "deviceStatus": "Available at KFON-DC",
      "createdDate": "2026-01-12",
      "updatedDate": "2026-01-12"
    }
  ],
  "page": 0,
  "size": 10,
  "totalElements": 7,
  "totalPages": 1
}
```

## Approve/Reject Request

KFON-DC can only approve a device once.

**URL:** `https://devapi.kfon.co.in/bss-inventory-management-services/api/inventory-dc/kfon/approve-reject`

### Approve Request

**Request Body:**

```json
{
  "mspLnpRequestId": "00b2b16b-e42a-4e0e-8122-789c36a09982",
  "type": "MSP",
  "status": "Approved",
  "remarks": "3 can send",
  "deviceIds": [
    "2faf8b57-4cd4-41bc-8d7b-b71dd5692e5b",
    "933b6183-4d40-429f-b39c-be11d01aeedd",
    "6cfa7c51-b82b-4091-b820-0a41f182bf7b"
  ],
  "selectedDeviceCount": 3
}
```

**Notes:**

- After submitting approval request, `approvalPending` updates to `false`.
- After approval, only approved devices are visible.
- Action buttons are hidden.
- Acknowledge button becomes visible for MSP-DC.

### Reject Request

After rejection, the device list is empty and buttons are hidden. For rejection, `deviceIds` are not required (send empty list).

**Request Body:**

```json
{
  "mspLnpRequestId": "975c5992-7d56-4570-8733-298720453531",
  "type": "MSP",
  "status": "Rejected",
  "remarks": "not available",
  "deviceIds": [],
  "selectedDeviceCount": 0
}
```

## Acknowledge Details view

**URL:** `https://devapi.kfon.co.in/bss-inventory-management-services/api/inventory-dc/fetch-msp/975c5992-7d56-4570-8733-298720453531`

**Response Example:**

```json
{
  "lnpRequestId": "975c5992-7d56-4570-8733-298720453531",
  "mspDcName": "dc.tvm",
  "deviceTypeName": "ONT",
  "requestedDeviceCount": 30,
  "approvedDeviceCount": 0,
  "remarks": "www",
  "approveRemarks": null,
  "requestStatus": 1,
  "approvalPending": false,
  "devices": [
    {
      "deviceId": "2faf8b57-4cd4-41bc-8d7b-b71dd5692e5b",
      "deviceType": "ONT",
      "deviceMake": "Alphion",
      "deviceCategory": "Non wifi router",
      "deviceModel": "AONT1420",
      "gponSerialNumber": "742302Q4745",
      "deviceSerialNumber": "33242SDS0028",
      "macAddress": "32:EE:E5:1C:38:54",
      "deviceStatus": "Available at KFON-DC",
      "createdDate": "2026-01-12",
      "updatedDate": "2026-01-12"
    }
  ],
  "page": 0,
  "size": 10,
  "totalElements": 7,
  "totalPages": 1
}
```

**Required**
devices list should contain isAccepted Flag after aknowleding

**url** `https://devapi.kfon.co.in/bss-inventory-management-services/api/inventory-dc/msp-lnp/acknowledge`

{
"mspLnpRequestId": "00b2b16b-e42a-4e0e-8122-789c36a09982",
"deviceIds": [
"2faf8b57-4cd4-41bc-8d7b-b71dd5692e5b"
],
"acceptCount": 1,
"type": "MSP"
}
