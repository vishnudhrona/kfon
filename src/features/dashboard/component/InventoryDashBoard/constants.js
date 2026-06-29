export const STATE_REDUCER_KEY = 'inventoryDashboard';

export const DEVICE_TYPES = ['OLT', 'Switch', 'Router', 'SFP', 'Media Converter', 'Fiber Patch Cord'];

// Section 1 — summary cards (API: /inventory-dashboard/summary-cards)
export const DUMMY_SUMMARY_CARDS = [
  {
    id: 'total_devices',
    labelKey: 'totalDevices',
    value: 4280,
    accent: '#8D0247',
    accentBg: '#FFEDF6',
    icon: '📦',
    byType: { OLT: 320, Switch: 580, Router: 240, SFP: 1800, 'Media Converter': 640, 'Fiber Patch Cord': 700 },
    route: '/app/inventory/device-list'
  },
  {
    id: 'faulty_devices',
    labelKey: 'faultyDevices',
    value: 218,
    accent: '#D72D2E',
    accentBg: '#FFF5F5',
    icon: '⚠️',
    byType: { OLT: 12, Switch: 28, Router: 8, SFP: 96, 'Media Converter': 42, 'Fiber Patch Cord': 32 },
    alert: true
  },
  {
    id: 'devices_in_use',
    labelKey: 'devicesInUse',
    value: 2640,
    accent: '#028D20',
    accentBg: '#DEFFF1',
    icon: '✅',
    byType: { OLT: 280, Switch: 490, Router: 190, SFP: 1140, 'Media Converter': 310, 'Fiber Patch Cord': 230 }
  },
  {
    id: 'devices_not_in_use',
    labelKey: 'devicesNotInUse',
    value: 1422,
    accent: '#C58C10',
    accentBg: '#FDF8DC',
    icon: '🔒',
    byType: { OLT: 28, Switch: 62, Router: 42, SFP: 564, 'Media Converter': 288, 'Fiber Patch Cord': 438 }
  },
  {
    id: 'mapped_to_subscriber',
    labelKey: 'deviceMappedToSubscriber',
    value: 1980,
    accent: '#027F8D',
    accentBg: '#EDFFFF',
    icon: '🔗',
    byType: null
  },
  {
    id: 'devices_in_transit',
    labelKey: 'devicesInTransit',
    value: 186,
    accent: '#5E36EF',
    accentBg: '#F3EFFF',
    icon: '🚚',
    byType: { OLT: 8, Switch: 22, Router: 10, SFP: 88, 'Media Converter': 36, 'Fiber Patch Cord': 22 }
  },
  {
    id: 'total_device_requests',
    labelKey: 'totalDeviceRequests',
    value: 342,
    accent: '#F5612A',
    accentBg: '#FFF1DE',
    icon: '📋',
    byType: { OLT: 18, Switch: 54, Router: 20, SFP: 146, 'Media Converter': 64, 'Fiber Patch Cord': 40 }
  },
  {
    id: 'sent_to_oem',
    labelKey: 'sentToOem',
    value: 94,
    accent: '#02748D',
    accentBg: '#EFFFFB',
    icon: '📤',
    byType: { OLT: 6, Switch: 14, Router: 4, SFP: 40, 'Media Converter': 18, 'Fiber Patch Cord': 12 }
  },
  {
    id: 'refurbished_devices',
    labelKey: 'refurbishedDevices',
    value: 138,
    accent: '#5E36EF',
    accentBg: '#F3EFFF',
    icon: '♻️',
    byType: { OLT: 8, Switch: 20, Router: 6, SFP: 60, 'Media Converter': 28, 'Fiber Patch Cord': 16 }
  },
  {
    id: 'replaced_devices',
    labelKey: 'replacedDevices',
    value: 76,
    accent: '#C58C10',
    accentBg: '#FDF8DC',
    icon: '🔄',
    byType: { OLT: 4, Switch: 12, Router: 2, SFP: 32, 'Media Converter': 16, 'Fiber Patch Cord': 10 }
  }
];

// Section 2 — stock type count (API: /inventory-dashboard/stock-type-count)
export const DUMMY_STOCK_TYPE_COUNT = [
  { type: 'OLT',            total: 320, inUse: 280, notInUse: 28,  faulty: 12, inTransit: 8,  sentToOem: 6,  refurbished: 8  },
  { type: 'Switch',         total: 580, inUse: 490, notInUse: 62,  faulty: 28, inTransit: 22, sentToOem: 14, refurbished: 20 },
  { type: 'Router',         total: 240, inUse: 190, notInUse: 42,  faulty: 8,  inTransit: 10, sentToOem: 4,  refurbished: 6  },
  { type: 'SFP',            total: 1800,inUse: 1140,notInUse: 564, faulty: 96, inTransit: 88, sentToOem: 40, refurbished: 60 },
  { type: 'Media Converter',total: 640, inUse: 310, notInUse: 288, faulty: 42, inTransit: 36, sentToOem: 18, refurbished: 28 },
  { type: 'Fiber Patch Cord',total: 700,inUse: 230, notInUse: 438, faulty: 32, inTransit: 22, sentToOem: 12, refurbished: 16 }
];

// Section 3 — device list (API: /inventory-dashboard/device-list)
export const DUMMY_DEVICE_LIST = [
  { id: 'DEV-001', serialNo: 'SN-OLT-0012', type: 'OLT',    make: 'Nokia',   model: 'ISAM 7360', status: 'In Use',    location: 'DC-TVM-01', mappedTo: 'SUB-10421' },
  { id: 'DEV-002', serialNo: 'SN-OLT-0044', type: 'OLT',    make: 'Huawei',  model: 'MA5800',    status: 'Faulty',    location: 'DC-EKM-01', mappedTo: null        },
  { id: 'DEV-003', serialNo: 'SN-SW-0081',  type: 'Switch',  make: 'Cisco',   model: 'C9300',     status: 'In Use',    location: 'DC-KZD-01', mappedTo: 'SUB-20811' },
  { id: 'DEV-004', serialNo: 'SN-SW-0092',  type: 'Switch',  make: 'Juniper', model: 'EX4300',    status: 'In Transit',location: 'DC-TSR-01', mappedTo: null        },
  { id: 'DEV-005', serialNo: 'SN-RT-0033',  type: 'Router',  make: 'Cisco',   model: 'ASR 920',   status: 'In Use',    location: 'DC-MLP-01', mappedTo: 'SUB-30192' },
  { id: 'DEV-006', serialNo: 'SN-SFP-1102', type: 'SFP',     make: 'Finisar', model: 'FTLX8574D3',status: 'Not In Use',location: 'DC-TVM-01', mappedTo: null        },
  { id: 'DEV-007', serialNo: 'SN-SFP-1188', type: 'SFP',     make: 'Intel',   model: 'E25GSFP28X',status: 'In Use',    location: 'DC-KNR-01', mappedTo: 'SUB-41008' },
  { id: 'DEV-008', serialNo: 'SN-MC-0019',  type: 'Media Converter',make: 'TP-Link',model: 'MC220L',status: 'Refurbished',location: 'DC-PKD-01', mappedTo: null   },
  { id: 'DEV-009', serialNo: 'SN-FP-0311',  type: 'Fiber Patch Cord',make: 'Corning',model: 'LC-LC',status: 'Not In Use',location: 'DC-KTM-01', mappedTo: null  },
  { id: 'DEV-010', serialNo: 'SN-OLT-0099', type: 'OLT',    make: 'ZTE',     model: 'C320',      status: 'Sent to OEM',location: 'OEM-HQ',   mappedTo: null        }
];

// Scope values
export const INVENTORY_DASHBOARD_SCOPES = {
  STATE_LEVEL: 'stateLevel',
  DISTRICT_LEVEL: 'districtLevel',
  OWNED: 'owned'
};

// Section 4 — district breakdown (API: /inventory-dashboard/district-breakdown)
// name/abbr/rank/custType/custName/type used by StockAvailability + KeralaTreemap
export const DUMMY_DISTRICT_BREAKDOWN = [
  { no: 1,  name: 'Thiruvananthapuram', district: 'Thiruvananthapuram', abbr: 'TVM', rank: '#1',  custType: 'WH',    custName: 'State Warehouse, TVM',  type: 'OLT',             total: 480, inUse: 380, count: 480, pct: 68, faulty: 28, inTransit: 12, requestsPending: 8 },
  { no: 2,  name: 'Ernakulam',          district: 'Ernakulam',          abbr: 'EKM', rank: '#2',  custType: 'DC',    custName: 'DC Ernakulam',           type: 'Switch',          total: 420, inUse: 340, count: 420, pct: 81, faulty: 22, inTransit: 10, requestsPending: 6 },
  { no: 3,  name: 'Kozhikode',          district: 'Kozhikode',          abbr: 'KZD', rank: '#3',  custType: 'DC',    custName: 'DC Kozhikode',           type: 'SFP',             total: 380, inUse: 300, count: 380, pct: 79, faulty: 18, inTransit: 8,  requestsPending: 5 },
  { no: 4,  name: 'Thrissur',           district: 'Thrissur',           abbr: 'TSR', rank: '#4',  custType: 'FE',    custName: 'FE Thrissur Team',       type: 'Router',          total: 340, inUse: 268, count: 340, pct: 79, faulty: 16, inTransit: 7,  requestsPending: 4 },
  { no: 5,  name: 'Malappuram',         district: 'Malappuram',         abbr: 'MLP', rank: '#5',  custType: 'DC',    custName: 'DC Malappuram',          type: 'SFP',             total: 310, inUse: 244, count: 310, pct: 79, faulty: 14, inTransit: 6,  requestsPending: 3 },
  { no: 6,  name: 'Kannur',             district: 'Kannur',             abbr: 'KNR', rank: '#6',  custType: 'FE',    custName: 'FE Kannur Unit',         type: 'Media Converter', total: 280, inUse: 220, count: 280, pct: 79, faulty: 12, inTransit: 5,  requestsPending: 3 },
  { no: 7,  name: 'Palakkad',           district: 'Palakkad',           abbr: 'PKD', rank: '#7',  custType: 'COORD', custName: 'Coordinator Palakkad',   type: 'Switch',          total: 260, inUse: 200, count: 260, pct: 77, faulty: 11, inTransit: 5,  requestsPending: 2 },
  { no: 8,  name: 'Kottayam',           district: 'Kottayam',           abbr: 'KTM', rank: '#8',  custType: 'DC',    custName: 'DC Kottayam',            type: 'SFP',             total: 240, inUse: 188, count: 240, pct: 78, faulty: 10, inTransit: 4,  requestsPending: 2 },
  { no: 9,  name: 'Kasaragod',          district: 'Kasaragod',          abbr: 'KSD', rank: '#9',  custType: 'DC',    custName: 'DC Kasaragod',           type: 'SFP',             total: 200, inUse: 156, count: 200, pct: 78, faulty: 9,  inTransit: 3,  requestsPending: 2 },
  { no: 10, name: 'Alappuzha',          district: 'Alappuzha',          abbr: 'ALP', rank: '#10', custType: 'DC',    custName: 'DC Alappuzha',           type: 'Switch',          total: 190, inUse: 148, count: 190, pct: 78, faulty: 8,  inTransit: 3,  requestsPending: 1 },
  { no: 11, name: 'Kollam',             district: 'Kollam',             abbr: 'KLM', rank: '#11', custType: 'DC',    custName: 'DC Kollam',              type: 'OLT',             total: 180, inUse: 140, count: 180, pct: 78, faulty: 8,  inTransit: 3,  requestsPending: 1 },
  { no: 12, name: 'Idukki',             district: 'Idukki',             abbr: 'IDK', rank: '#12', custType: 'FE',    custName: 'FE Idukki Unit',         type: 'Router',          total: 120, inUse: 94,  count: 120, pct: 78, faulty: 5,  inTransit: 2,  requestsPending: 1 },
  { no: 13, name: 'Wayanad',            district: 'Wayanad',            abbr: 'WYD', rank: '#13', custType: 'FE',    custName: 'FE Wayanad Unit',        type: 'Switch',          total: 110, inUse: 86,  count: 110, pct: 78, faulty: 4,  inTransit: 2,  requestsPending: 1 },
  { no: 14, name: 'Pathanamthitta',     district: 'Pathanamthitta',     abbr: 'PTA', rank: '#14', custType: 'DC',    custName: 'DC Pathanamthitta',      type: 'SFP',             total: 100, inUse: 76,  count: 100, pct: 76, faulty: 4,  inTransit: 2,  requestsPending: 1 }
];

// Section 5 — warranty alerts (API: /inventory-dashboard/warranty-alerts)
export const DUMMY_WARRANTY_ALERTS = {
  expiringSoon: [
    { serialNo: 'SN-OLT-0012', type: 'OLT',    model: 'ISAM 7360', warrantyEndDate: '2026-06-10', location: 'DC-TVM-01' },
    { serialNo: 'SN-SW-0081',  type: 'Switch',  model: 'C9300',     warrantyEndDate: '2026-06-18', location: 'DC-EKM-01' },
    { serialNo: 'SN-RT-0033',  type: 'Router',  model: 'ASR 920',   warrantyEndDate: '2026-06-25', location: 'DC-KZD-01' },
    { serialNo: 'SN-MC-0019',  type: 'Media Converter', model: 'MC220L', warrantyEndDate: '2026-06-28', location: 'DC-KNR-01' }
  ],
  expired: [
    { serialNo: 'SN-OLT-0044', type: 'OLT',    model: 'MA5800',     warrantyEndDate: '2025-12-31', location: 'DC-TSR-01' },
    { serialNo: 'SN-SFP-1102', type: 'SFP',     model: 'FTLX8574D3', warrantyEndDate: '2026-01-15', location: 'DC-MLP-01' },
    { serialNo: 'SN-SW-0092',  type: 'Switch',  model: 'EX4300',     warrantyEndDate: '2026-02-28', location: 'DC-PKD-01' }
  ],
  safeCount: 4270
};

// Section 6 — request pipeline (API: /inventory-dashboard/request-pipeline)
export const DUMMY_REQUEST_PIPELINE = {
  raised: 342,
  pendingApproval: 128,
  approved: 186,
  rejected: 28
};

// Section 7 — recent activity (API: /inventory-dashboard/recent-activity)
export const DUMMY_RECENT_ACTIVITY = [
  { id: 'ACT-001', action: 'Transfer',         deviceSerial: 'SN-OLT-0012', actor: 'Suresh Nair',   timestamp: '2026-05-18T10:32:00Z' },
  { id: 'ACT-002', action: 'Stock Received',   deviceSerial: 'SN-SW-0093',  actor: 'Priya Menon',   timestamp: '2026-05-18T09:15:00Z' },
  { id: 'ACT-003', action: 'OEM Send',         deviceSerial: 'SN-OLT-0044', actor: 'Arun Pillai',   timestamp: '2026-05-18T08:44:00Z' },
  { id: 'ACT-004', action: 'Mapped',           deviceSerial: 'SN-SFP-1102', actor: 'Lekshmi S',     timestamp: '2026-05-17T16:20:00Z' },
  { id: 'ACT-005', action: 'Condition Change', deviceSerial: 'SN-SW-0081',  actor: 'Nasrin TK',     timestamp: '2026-05-17T14:05:00Z' },
  { id: 'ACT-006', action: 'Replaced',         deviceSerial: 'SN-RT-0033',  actor: 'Mohammed Shan', timestamp: '2026-05-17T11:30:00Z' },
  { id: 'ACT-007', action: 'Transfer',         deviceSerial: 'SN-MC-0019',  actor: 'Aishwarya Raj', timestamp: '2026-05-16T15:48:00Z' },
  { id: 'ACT-008', action: 'Stock Received',   deviceSerial: 'SN-FP-0311',  actor: 'Shahina K',     timestamp: '2026-05-16T13:20:00Z' },
  { id: 'ACT-009', action: 'Mapped',           deviceSerial: 'SN-SFP-1188', actor: 'Suresh Nair',   timestamp: '2026-05-16T10:10:00Z' },
  { id: 'ACT-010', action: 'OEM Send',         deviceSerial: 'SN-OLT-0099', actor: 'Sreejith KP',   timestamp: '2026-05-15T17:00:00Z' }
];

// Section 8 — transfer list (API: /inventory-dashboard/transfer-list)
export const DUMMY_TRANSFER_LIST = [
  { no: 1, type: 'OLT',    id: 'DEV-TVM-0012', from: 'State Warehouse', fromType: 'WH', to: 'DC Ernakulam',  toType: 'DC', date: '18 May', eta: '21 May', status: 'transit'   },
  { no: 2, type: 'Switch', id: 'DEV-EKM-0081', from: 'DC Kozhikode',   fromType: 'DC', to: 'FE Malappuram', toType: 'FE', date: '18 May', eta: '19 May', status: 'dispatch'  },
  { no: 3, type: 'SFP',    id: 'DEV-KZD-1102', from: 'State Warehouse', fromType: 'WH', to: 'DC Thrissur',   toType: 'DC', date: '17 May', eta: '20 May', status: 'transit'   },
  { no: 4, type: 'Router', id: 'DEV-TSR-0033', from: 'DC Kannur',      fromType: 'DC', to: 'FE Wayanad',    toType: 'FE', date: '16 May', eta: '—',      status: 'delivered' },
  { no: 5, type: 'ONT',    id: 'DEV-MLP-0044', from: 'State Warehouse', fromType: 'WH', to: 'DC Kasaragod',  toType: 'DC', date: '15 May', eta: '—',      status: 'delivered' }
];

// Section 9 — request queue (API: /inventory-dashboard/request-queue)
export const DUMMY_REQUEST_QUEUE = [
  { id: 'RQ-001', initials: 'SN', colorClass: 0, name: 'Suresh Nair',  role: 'FE',    device: 'OLT × 2',             time: '2h ago', status: 'pend' },
  { id: 'RQ-002', initials: 'PM', colorClass: 1, name: 'Priya Menon',  role: 'DC',    device: 'SFP × 10',            time: '4h ago', status: 'app'  },
  { id: 'RQ-003', initials: 'AP', colorClass: 2, name: 'Arun Pillai',  role: 'COORD', device: 'Switch × 1',          time: '6h ago', status: 'rej'  },
  { id: 'RQ-004', initials: 'LS', colorClass: 3, name: 'Lekshmi S',    role: 'FE',    device: 'Media Converter × 3', time: '1d ago', status: 'itr'  },
  { id: 'RQ-005', initials: 'NT', colorClass: 4, name: 'Nasrin TK',    role: 'FE',    device: 'Router × 1',          time: '1d ago', status: 'pend' }
];

// Section 10 — active routes (API: /inventory-dashboard/active-routes)
export const DUMMY_ACTIVE_ROUTES = [
  { id: 'TRK-0012', from: 'State WH',     fromSub: 'TVM', to: 'DC Ernakulam',  toSub: 'EKM', devices: 8,  type: 'OLT',    progress: 62 },
  { id: 'TRK-0019', from: 'DC Kozhikode', fromSub: 'KZD', to: 'FE Malappuram', toSub: 'MLP', devices: 24, type: 'SFP',    progress: 40 },
  { id: 'TRK-0023', from: 'State WH',     fromSub: 'TVM', to: 'DC Thrissur',   toSub: 'TSR', devices: 5,  type: 'Switch', progress: 80 }
];

// Section 11 — vendor stock breakdown (API: /inventory-dashboard/vendor-stock)
// color values mirror tokens.js T object — update both when migrating to bss-ui-components
export const DUMMY_VENDOR_STOCK = [
  {
    name: 'Nokia',   sub: 'OLT & Core Network',  color: '#e94e77', total: 620, pct: '91%',
    splits: [{ label: 'OLT', val: 320, color: '#e94e77' }, { label: 'Switch', val: 180, color: '#2fb8c6' }, { label: 'ONT', val: 120, color: '#f97316' }]
  },
  {
    name: 'Cisco',   sub: 'Switching & Routing',  color: '#2fb8c6', total: 540, pct: '88%',
    splits: [{ label: 'Switch', val: 320, color: '#2fb8c6' }, { label: 'Router', val: 140, color: '#8b7fd6' }, { label: 'SFP', val: 80, color: '#5bbf95' }]
  },
  {
    name: 'Huawei',  sub: 'OLT & Access',         color: '#8b7fd6', total: 480, pct: '85%',
    splits: [{ label: 'OLT', val: 280, color: '#8b7fd6' }, { label: 'ONT', val: 200, color: '#f97316' }]
  },
  {
    name: 'Finisar', sub: 'SFP Transceivers',     color: '#5bbf95', total: 980, pct: '96%',
    splits: [{ label: 'SFP 1G', val: 560, color: '#5bbf95' }, { label: 'SFP 10G', val: 280, color: '#2fb8c6' }, { label: 'SFP 25G', val: 140, color: '#5b8cb8' }]
  }
];

// Section 12 — PO / stock entries (API: /inventory-dashboard/stock-entries)
export const DUMMY_STOCK_ENTRIES = [
  { no: 1, po: 'PO-2026-0412', date: '18 May', vendor: 'Nokia',   type: 'OLT',             model: 'ISAM 7360',  qty: 50,  allocated: 38, custodian: 'DC Ernakulam',  status: 'app'  },
  { no: 2, po: 'PO-2026-0409', date: '17 May', vendor: 'Finisar', type: 'SFP',             model: 'FTLX8574D3', qty: 200, allocated: 160,custodian: 'State WH',      status: 'app'  },
  { no: 3, po: 'PO-2026-0405', date: '16 May', vendor: 'Cisco',   type: 'Switch',          model: 'C9300',      qty: 25,  allocated: 10, custodian: 'DC Kozhikode',  status: 'pend' },
  { no: 4, po: 'PO-2026-0401', date: '15 May', vendor: 'Huawei',  type: 'OLT',             model: 'MA5800',     qty: 30,  allocated: 30, custodian: 'DC Thrissur',   status: 'app'  },
  { no: 5, po: 'PO-2026-0398', date: '14 May', vendor: 'TP-Link', type: 'Media Converter', model: 'MC220L',     qty: 80,  allocated: 45, custodian: 'DC Malappuram', status: 'pend' }
];

// Census type data — maps to stockTypeCount shape (API: /inventory-dashboard/stock-type-count)
export const CENSUS_TYPE_META = {
  OLT:              { sub: 'Optical Line Terminal',     colorKey: 'rose'     },
  Switch:           { sub: 'Layer 2/3 switching',       colorKey: 'teal'     },
  Router:           { sub: 'Core & edge routing',       colorKey: 'lavender' },
  SFP:              { sub: 'Transceiver modules',       colorKey: 'mint'     },
  'Media Converter':{ sub: 'Fiber-to-copper bridging',  colorKey: 'info'     },
  'Fiber Patch Cord':{ sub: 'Patch cables & connectors',colorKey: 'amber'    },
  Splitter:         { sub: 'PLC fiber splitters',       colorKey: 'plum'     },
  ONT:              { sub: 'Optical Network Terminal',  colorKey: 'orange'   }
};

// Inventory asset value (API: /inventory-dashboard/asset-value)
export const DUMMY_ASSET_VALUE = { value: '14.2', period: 'May 2026' };
