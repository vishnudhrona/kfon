export const PALETTE = {
  mar: '#7A1C2E',
  mar2: '#9B2438',
  bg: '#EDEAF5',
  card: '#FFFFFF',
  bdr: 'rgba(0,0,0,0.07)',
  tx: '#1A1030',
  tx2: '#5A5070',
  tx3: '#9A90A8'
};

export const GRADIENTS = {
  orange: 'linear-gradient(135deg,#FF9800,#FF6B00)',
  coral: 'linear-gradient(135deg,#FF5A7E,#E53070)',
  teal: 'linear-gradient(135deg,#00C8A8,#00A088)',
  blue: 'linear-gradient(135deg,#4488FF,#2255CC)',
  purple: 'linear-gradient(135deg,#9B59B6,#6C3483)',
  green: 'linear-gradient(135deg,#27AE60,#1A7A42)',
  red: 'linear-gradient(135deg,#C82020,#FF5A7E)'
};

export const HERO_GRADIENTS = [GRADIENTS.orange, GRADIENTS.coral, GRADIENTS.teal, GRADIENTS.blue];


export const PERIOD_DATA = {
  today: { total: 47, open: 21, processing: 14, closed: 12 },
  week: { total: 284, open: 98, processing: 67, closed: 119 },
  month: { total: 1142, open: 213, processing: 189, closed: 740 }
};

export const SUBJECTS = [
  { label: 'Modem Issue', today: 18, week: 102, month: 412, div: 'Team Network', c: '#FF6B00' },
  { label: 'Internet Slow', today: 12, week: 74, month: 298, div: 'Team ISP', c: '#00C8A8' },
  { label: 'Site Not Loading', today: 7, week: 48, month: 187, div: 'Team ISP', c: '#4488FF' },
  { label: 'Payment Issue', today: 6, week: 38, month: 156, div: 'Finance Team', c: '#FF5A7E' },
  { label: 'Other', today: 4, week: 22, month: 89, div: 'General Support', c: '#9B59B6' }
];

export const USERS = [
  { label: 'Subscriber', today: 28, week: 168, month: 672, c: '#FF6B00' },
  { label: 'LNP', today: 8, week: 52, month: 209, c: '#00C8A8' },
  { label: 'AGNP', today: 5, week: 30, month: 121, c: '#4488FF' },
  { label: 'General Public', today: 4, week: 24, month: 97, c: '#FF5A7E' },
  { label: 'Officials', today: 2, week: 10, month: 43, c: '#9B59B6' }
];

export const TOP10 = [
  { issue: 'Modem Not Syncing', count: 87 },
  { issue: 'Speed Below Committed', count: 74 },
  { issue: 'No Internet', count: 61 },
  { issue: 'Payment Not Reflected', count: 52 },
  { issue: 'Frequent Disconnects', count: 48 },
  { issue: 'DNS Failure', count: 39 },
  { issue: 'Router Config Reset', count: 34 },
  { issue: 'Govt Portal Down', count: 28 },
  { issue: 'IP Conflict', count: 22 },
  { issue: 'Billing Error', count: 18 }
];

export const TOP10_COLORS = [
  '#FF6B00',
  '#FF6B00',
  '#FF5A7E',
  '#FF5A7E',
  '#4488FF',
  '#4488FF',
  '#00C8A8',
  '#00C8A8',
  '#9B59B6',
  '#9B59B6'
];

export const DIVS = [
  { div: 'Team Network', subj: 'Modem Issue', closed: 412, total: 480, c: '#FF6B00', bg: '#FFF6EE' },
  { div: 'Team ISP', subj: 'Slow / Site', closed: 378, total: 485, c: '#00C8A8', bg: '#EDFCF9' },
  { div: 'Finance Team', subj: 'Payment Issues', closed: 148, total: 156, c: '#FF5A7E', bg: '#FFF0F4' },
  { div: 'Gen. Support', subj: 'Other / Misc', closed: 82, total: 89, c: '#9B59B6', bg: '#F5F0FF' }
];

export const DISTRICTS = [
  { name: 'TVM', tickets: 142, resolved: 135 },
  { name: 'KLM', tickets: 97, resolved: 87 },
  { name: 'PTA', tickets: 54, resolved: 49 },
  { name: 'ALP', tickets: 76, resolved: 65 },
  { name: 'KTM', tickets: 88, resolved: 71 },
  { name: 'IDK', tickets: 41, resolved: 29 },
  { name: 'EKM', tickets: 168, resolved: 160 },
  { name: 'TSR', tickets: 112, resolved: 84 },
  { name: 'PKD', tickets: 89, resolved: 53 },
  { name: 'MLP', tickets: 103, resolved: 43 },
  { name: 'KZD', tickets: 119, resolved: 36 },
  { name: 'WYD', tickets: 38, resolved: 14 },
  { name: 'KNR', tickets: 87, resolved: 12 },
  { name: 'KSD', tickets: 56, resolved: 6 }
];

export const RES = [
  { label: 'Within SLA ≤24h', pct: 68, desc: '68% of all tickets', c: '#27AE60', bg: '#F0FAF4' },
  { label: '24 – 48 hours', pct: 18, desc: 'Slightly delayed', c: '#FF8C00', bg: '#FFF6EE' },
  { label: '48 – 72 hours', pct: 9, desc: 'Breached SLA', c: '#FF5A7E', bg: '#FFF0F4' },
  { label: 'Over 72 hours', pct: 5, desc: 'Critical breach', c: '#7A1C2E', bg: '#FDF5F7' }
];

export const PENDING = [
  { id: 'TKT-0812', subject: 'Modem Not Syncing', user: 'Subscriber', days: 14, district: 'Ernakulam', status: 'Open' },
  { id: 'TKT-0799', subject: 'No Internet – 3 Days', user: 'LNP', days: 11, district: 'Kozhikode', status: 'Open' },
  {
    id: 'TKT-0783',
    subject: 'Payment Not Reflected',
    user: 'General Public',
    days: 9,
    district: 'Thrissur',
    status: 'Processing'
  },
  {
    id: 'TKT-0776',
    subject: 'Very Slow Speed',
    user: 'Subscriber',
    days: 8,
    district: 'Malappuram',
    status: 'Processing'
  },
  {
    id: 'TKT-0761',
    subject: 'Govt Portal Down',
    user: 'Officials',
    days: 7,
    district: 'Thiruvananthapuram',
    status: 'Open'
  },
  { id: 'TKT-0748', subject: 'IP Not Assigned', user: 'AGNP', days: 5, district: 'Kannur', status: 'Open' },
  { id: 'TKT-0731', subject: 'DNS Failure', user: 'Subscriber', days: 4, district: 'Palakkad', status: 'Processing' }
];

export const TICKETS = [
  {
    id: 'TKT-1042',
    type: 'Modem Issue',
    subject: 'Modem not powering on',
    status: 'Open',
    user: 'Subscriber',
    district: 'Ernakulam',
    date: '08 Aug 2025, 14:32'
  },
  {
    id: 'TKT-1041',
    type: 'Internet Slow',
    subject: 'Speed below 2 Mbps',
    status: 'Processing',
    user: 'LNP',
    district: 'Kozhikode',
    date: '08 Aug 2025, 13:58'
  },
  {
    id: 'TKT-1040',
    type: 'Payment Issue',
    subject: 'Amount debited twice',
    status: 'Open',
    user: 'General Public',
    district: 'Thrissur',
    date: '08 Aug 2025, 13:21'
  },
  {
    id: 'TKT-1039',
    type: 'Site Not Loading',
    subject: 'Government portal 404 error',
    status: 'Closed',
    user: 'Officials',
    district: 'Thiruvananthapuram',
    date: '08 Aug 2025, 12:47'
  },
  {
    id: 'TKT-1038',
    type: 'Other',
    subject: 'Request for plan upgrade',
    status: 'Closed',
    user: 'Subscriber',
    district: 'Malappuram',
    date: '08 Aug 2025, 11:30'
  },
  {
    id: 'TKT-1037',
    type: 'Modem Issue',
    subject: 'Modem restarting every hour',
    status: 'Processing',
    user: 'AGNP',
    district: 'Palakkad',
    date: '08 Aug 2025, 10:55'
  },
  {
    id: 'TKT-1036',
    type: 'Internet Slow',
    subject: 'Buffering on video calls',
    status: 'Open',
    user: 'Subscriber',
    district: 'Kannur',
    date: '08 Aug 2025, 10:10'
  },
  {
    id: 'TKT-1035',
    type: 'Payment Issue',
    subject: 'Receipt not generated',
    status: 'Closed',
    user: 'LNP',
    district: 'Kollam',
    date: '08 Aug 2025, 09:42'
  },
  {
    id: 'TKT-1034',
    type: 'Modem Issue',
    subject: 'Modem showing red light',
    status: 'Open',
    user: 'Subscriber',
    district: 'Alappuzha',
    date: '08 Aug 2025, 09:11'
  },
  {
    id: 'TKT-1033',
    type: 'Site Not Loading',
    subject: 'Banking portal unreachable',
    status: 'Processing',
    user: 'Officials',
    district: 'Kottayam',
    date: '08 Aug 2025, 08:55'
  },
  {
    id: 'TKT-1032',
    type: 'Other',
    subject: 'Plan change pending',
    status: 'Open',
    user: 'General Public',
    district: 'Idukki',
    date: '07 Aug 2025, 18:30'
  },
  {
    id: 'TKT-1031',
    type: 'Internet Slow',
    subject: 'Night speed drops',
    status: 'Closed',
    user: 'Subscriber',
    district: 'Kasaragod',
    date: '07 Aug 2025, 17:44'
  }
];

export const MONTHLY = [
  { m: 'Mar', closed: 680, proc: 120, open: 98, sla: 72 },
  { m: 'Apr', closed: 720, proc: 135, open: 88, sla: 70 },
  { m: 'May', closed: 695, proc: 118, open: 95, sla: 68 },
  { m: 'Jun', closed: 760, proc: 142, open: 102, sla: 71 },
  { m: 'Jul', closed: 810, proc: 158, open: 120, sla: 74 },
  { m: 'Aug', closed: 740, proc: 189, open: 213, sla: 68 }
];

export const KPIS = [
  { l: 'Total This Month', v: '1,142', n: '', c: '#FF6B00', bg: '#FFF6EE' },
  { l: 'Resolved', v: '740', n: '64.8% close rate', c: '#27AE60', bg: '#F0FAF4' },
  { l: 'SLA Compliance', v: '68%', n: 'Target: 80%', c: '#FF8C00', bg: '#FFF8E6' },
  { l: 'CSAT Score', v: '4.2/5', n: 'Satisfaction', c: '#00C8A8', bg: '#EDFCF9' },
  { l: 'Tickets / L1', v: '38/day', n: 'Avg agent load', c: '#4488FF', bg: '#EFF5FF' },
  { l: 'Escalation Rate', v: '4.7%', n: 'Escalated to L2', c: '#9B59B6', bg: '#F5F0FF' }
];

export const STATUS_PILL = {
  Open: { bg: '#EFF5FF', color: '#2255CC', dot: '#4488FF' },
  Closed: { bg: '#EDFAF4', color: '#1A7A42', dot: '#27AE60' },
  Processing: { bg: '#FFF8E6', color: '#9A6F00', dot: '#FF8C00' },
  TAKEN_OVER: { bg: '#F5F0FF', color: '#6C3483', dot: '#9B59B6' }
};
