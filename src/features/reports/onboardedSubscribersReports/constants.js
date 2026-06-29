export const STATE_REDUCER_KEY = 'onboardedSubscribersReports';

export const ONBOARDED_SUBSCRIBERS_REPORT_COLUMNS = [
  { header: 'slNo', accessor: 'slNo' },
  { header: 'id', accessor: 'id' },
  { header: 'username', accessor: 'username' },
  { header: 'package', accessor: 'package' },
  { header: 'renewalDate', accessor: 'renewalDate' },
  { header: 'balance', accessor: 'balance' },
  { header: 'mobileNo', accessor: 'mobileNo' },
  { header: 'email', accessor: 'email' },
  { header: 'registrationDate', accessor: 'registrationDate' },
  { header: 'status', accessor: 'status' }
];

export const MOCK_ONBOARDED_SUBSCRIBERS_DATA = [
  { slNo: '01', id: 'KFON10001', username: 'vishnu.nr', package: 'KFON Fiber 100 Mbps', renewalDate: '2026-02-24', balance: '500.00', mobileNo: '9876543210', email: 'vishnu@example.com', registrationDate: '2025-02-24', status: 'Active' },
  { slNo: '02', id: 'KFON10002', username: 'sarath.babu', package: 'KFON Fiber 50 Mbps', renewalDate: '2026-03-10', balance: '0.00', mobileNo: '9876543211', email: 'sarath@example.com', registrationDate: '2025-03-10', status: 'Inactive' },
  { slNo: '03', id: 'KFON10003', username: 'asif.mohammed', package: 'KFON Fiber 200 Mbps', renewalDate: '2026-04-05', balance: '200.00', mobileNo: '9876543212', email: 'asif@example.com', registrationDate: '2025-04-05', status: 'Suspended' },
  { slNo: '04', id: 'KFON10004', username: 'sunil.kumar', package: 'KFON Fiber 100 Mbps', renewalDate: '2026-02-26', balance: '750.00', mobileNo: '9876543213', email: 'sunil@example.com', registrationDate: '2025-02-26', status: 'Active' },
  { slNo: '05', id: 'KFON10005', username: 'anitha.menon', package: 'KFON Fiber 50 Mbps', renewalDate: '2026-01-15', balance: '0.00', mobileNo: '9876543214', email: 'anitha@example.com', registrationDate: '2025-01-15', status: 'Terminated' },
  { slNo: '06', id: 'KFON10006', username: 'rajesh.kumar', package: 'KFON Fiber 200 Mbps', renewalDate: '2026-03-20', balance: '1200.00', mobileNo: '9876543215', email: 'rajesh@example.com', registrationDate: '2025-03-20', status: 'Active' },
  { slNo: '07', id: 'KFON10007', username: 'priya.nair', package: 'KFON Fiber 50 Mbps', renewalDate: '2026-02-28', balance: '100.00', mobileNo: '9876543216', email: 'priya@example.com', registrationDate: '2025-02-28', status: 'Inactive' },
  { slNo: '08', id: 'KFON10008', username: 'deepak.menon', package: 'KFON Fiber 100 Mbps', renewalDate: '2026-05-01', balance: '900.00', mobileNo: '9876543217', email: 'deepak@example.com', registrationDate: '2025-05-01', status: 'Active' },
  { slNo: '09', id: 'KFON10009', username: 'lakshmi.devi', package: 'KFON Fiber 50 Mbps', renewalDate: '2026-02-22', balance: '300.00', mobileNo: '9876543218', email: 'lakshmi@example.com', registrationDate: '2025-02-22', status: 'Suspended' },
  { slNo: '10', id: 'KFON10010', username: 'arun.prasad', package: 'KFON Fiber 200 Mbps', renewalDate: '2026-04-15', balance: '650.00', mobileNo: '9876543219', email: 'arun@example.com', registrationDate: '2025-04-15', status: 'Active' }
];

export const TILE_CARDS = [
  { key: 'total', label: 'Total', statusKey: null, isIncrease: true, chartColor: '#008FFB' },
  { key: 'active', label: 'Active', statusKey: 'Active', isIncrease: true, chartColor: '#00E396' },
  { key: 'inactive', label: 'Inactive', statusKey: 'Inactive', isIncrease: false, chartColor: '#FEB019' },
  { key: 'suspended', label: 'Suspended', statusKey: 'Suspended', isIncrease: false, chartColor: '#FF4560' },
  { key: 'terminated', label: 'Terminated', statusKey: 'Terminated', isIncrease: false, chartColor: '#775DD0' }
];

export const ONBOARDED_SUBSCRIBERS_TABS = ['Home', 'BPL', 'Corporate', 'Government', 'DarkFibre'];

export const TAB_TILE_COUNTS = {
  Home: { total: 2140, active: 1380, inactive: 420, suspended: 240, terminated: 100, totalPct: 15.2, activePct: 10.5, inactivePct: 4.3, suspendedPct: 2.8, terminatedPct: 1.1 },
  BPL: { total: 980, active: 620, inactive: 195, suspended: 110, terminated: 55, totalPct: 18.6, activePct: 12.4, inactivePct: 5.7, suspendedPct: 3.2, terminatedPct: 1.9 },
  Corporate: { total: 540, active: 380, inactive: 90, suspended: 50, terminated: 20, totalPct: 9.8, activePct: 7.2, inactivePct: 3.1, suspendedPct: 1.8, terminatedPct: 0.7 },
  Government: { total: 320, active: 240, inactive: 48, suspended: 24, terminated: 8, totalPct: 12.4, activePct: 9.6, inactivePct: 3.8, suspendedPct: 2.1, terminatedPct: 0.5 },
  DarkFibre: { total: 300, active: 140, inactive: 87, suspended: 56, terminated: 17, totalPct: 6.5, activePct: 4.8, inactivePct: 2.9, suspendedPct: 1.7, terminatedPct: 0.6 }
};
