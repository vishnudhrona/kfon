# Inventory Module Documentation

## Overview

The Inventory Module manages the lifecycle of devices within the system. It handles device onboarding, master data management (models, types, vendors), and the movement of devices between different entities (KFON DGM, DC, MSP, LNP) through request and transfer workflows.

## User Roles & Permissions

The module's behavior and access adjust dynamically based on the user's role:

- **Admin**: Creates master data and initiates initial inventory transfers.
- **KFON DGM**: Reviews and approves/rejects transfers initiated by Admin.
- **KFON DC (District Coordinator)**:
  - Receives transfers from DGM (acknowledges them).
  - Approves device requests from MSPs.
  - Manages local inventory.
- **MSP (Managed Service Provider)**:
  - Requests devices from DC.
  - Approves device requests from LNPs.
  - Acknowledges receipt of devices from DC.
- **LNP (Local Network Provider)**:
  - Requests devices from MSP.
  - Acknowledges receipt of devices from MSP.

## Business Logic & Detailed Workflows

### 1. Admin to KFON-DC Flow

This flow handles the initial movement of devices into the district eco-system.

1.  **Master Data Creation**:
    - **Actor**: Admin
    - **Action**: Creates device models, types, and adds devices via `AddDevice` or bulk upload.
    - **Route**: `/inventory/add-device`
2.  **Transfer Initiation**:
    - **Actor**: Admin
    - **Action**: Initiates transfer to KFON-DC via `TransferPage` (Bulk CSV or Individual).
    - **Route**: `/inventory/transfer`
3.  **DGM Approval**:
    - **Actor**: KFON DGM
    - **Action**: Views pending transfers in `TransferedToDgm`. Approves or Rejects the transfer.
    - **Component**: `TransferedToDgmDetails.jsx` uses `TransferDetailsHeader` to show Approve/Reject buttons if `isDgm` and `approvalPending` are true.
    - **Route**: `/inventory/transfered-to-kfon-dgm/$id`
4.  **DC Acknowledgment**:
    - **Actor**: KFON DC
    - **Action**: After approval, views the transfer. Selects received devices and calculates simple count. Clicks "Acknowledge Selected".
    - **Component**: `TransferedToDgmDetails.jsx` renders `GenericPageTable` with checkboxes. If `isDcView` is true, shows acknowledgment button.
    - **Route**: `/inventory/transfer-from-dgm/$id`

### 2. MSP to KFON-DC Flow

MSP requests inventory from the District Coordinator.

1.  **Request Creation**:
    - **Actor**: MSP
    - **Action**: Creates a request specifying device type and count.
    - **Component**: `RequestDevice.jsx` popup.
    - **Route**: `/inventory/device-request-msp-dc`
2.  **DC Approval**:
    - **Actor**: KFON DC
    - **Action**: Reviews request. Selects specific devices to allocate (fulfill request). Approves the request.
    - **Component**: `RequestDetails.jsx` in `APPROVE` mode. Uses `hasRole(ROLES.DC)` to enable approval controls.
3.  **MSP Acknowledgment**:
    - **Actor**: MSP
    - **Action**: Once devices are physically received/verified, acknowledges them in the system.
    - **Component**: `RequestDetails.jsx` in `ACKNOWLEDGE` mode.

### 3. LNP to MSP Flow

LNP requests inventory from the Managed Service Provider.

1.  **Request Creation**:
    - **Actor**: LNP
    - **Action**: Creates a request.
    - **Component**: `RequestDevice.jsx` (handles `isPartnerRequest` logic).
    - **Route**: `/inventory/device-request-partner`
2.  **MSP Approval**:
    - **Actor**: MSP
    - **Action**: Reviews LNP request. Allocates specific devices and approves.
    - **Component**: `RequestDetails.jsx`. Logic checks `if (isPartnerRequest && hasRole(ROLES.MSP)) { mode = 'APPROVE' }`.
3.  **LNP Acknowledgment**:
    - **Actor**: LNP
    - **Action**: Acknowledges receipt of allocated devices.
    - **Component**: `RequestDetails.jsx`. Logic checks `if (hasRole(ROLES.LNP)) { mode = 'ACKNOWLEDGE' }`.

## Routes Reference

Defined in `src/features/inventory/routes.jsx`.

| Route Path                              | Component                 | Description                                     |
| :-------------------------------------- | :------------------------ | :---------------------------------------------- |
| `/inventory`                            | `InventoryDashboard`      | Main entry, redirects to `device-list`.         |
| `/inventory/device-list`                | `InventoryDashboard`      | Lists all devices.                              |
| `/inventory/add-device`                 | `AddDevice`               | Form to add a new device.                       |
| `/inventory/transfer`                   | `TransferPage`            | Core interface for initiating device transfers. |
| `/inventory/transfered-to-kfon-dgm`     | `TransferedToDgm`         | Lists transfers pending DGM approval.           |
| `/inventory/transfered-to-kfon-dgm/$id` | `TransferedToDgmDetails`  | Details for DGM to approve/reject.              |
| `/inventory/transfer-from-dgm`          | `TransferedToDgm` (Reuse) | Lists incoming transfers for DC.                |
| `/inventory/transfer-from-dgm/$id`      | `TransferedToDgmDetails`  | Details for DC to acknowledge.                  |
| `/inventory/device-request-msp-dc`      | `RequestList`             | MSP-DC Request List.                            |
| `/inventory/device-request-msp-dc/$id`  | `RequestDetails`          | Details for DC Approval / MSP Acknowledgment.   |
| `/inventory/device-request-partner`     | `RequestList`             | LNP-MSP Request List.                           |
| `/inventory/device-request-partner/$id` | `RequestDetails`          | Details for MSP Approval / LNP Acknowledgment.  |

## API Endpoints

Key endpoints defined in `src/features/inventory/api.js`.

### Master Data & Devices

- `GET /inventory/dashboard/list` - Fetch device list.
- `POST /inventory/device/create` - Create a new device.

### Transfers & Requests

- `POST /inventory/device-transfer/submit-bulk` - Admin submits bulk transfer.
- `GET /inventory/device-transfer/transfered-to-kfon-dc` - List transfers.
- `POST /inventory/device-transfer/kfon-dgm-approval` - DGM approves/rejects.
- `POST /inventory/device-transfer/dc-acknowledge` - DC acknowledges receipt.
- `POST /inventory/device-transfer/create-request` - MSP/LNP creates request.
- `POST /inventory/device-transfer/approve-reject` - DC/MSP approves request.

## Components & Architecture

### Pages

- **`RequestDetails.jsx`**: Polymorphic component handling four states:
  1. MSP Viewing (Acknowledge)
  2. DC Viewing (Approve)
  3. LNP Viewing (Acknowledge)
  4. MSP Viewing Partner Request (Approve)
- **`TransferedToDgmDetails.jsx`**: Handles the Admin->DGM->DC flow details.
  - Conditionally renders `TransferDetailsHeader` with approval buttons for DGM.
  - Conditionally renders Acknowledge button for DC (`isDcView`).

### Reusable Components

- **`RequestDevice.jsx`**: Popup form for creating requests.
- **`TransferConfirmationModal.jsx`**: Confirmation for bulk transfers.
