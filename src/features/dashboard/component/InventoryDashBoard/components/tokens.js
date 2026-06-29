export const T = {
  maroon700: '#6b1a3d',
  maroon800: '#5a1433',
  maroon900: '#4a0f2a',
  yellow: '#ffd557',
  yellowBg: '#fff9e8',
  yellowWarm: '#fdf3c8',
  rose: '#e94e77',
  roseSoft: '#ffe5ec',
  roseDeep: '#a8284e',
  roseBorder: '#f5b9cc',
  teal: '#2fb8c6',
  tealSoft: '#d6f2f4',
  tealDeep: '#0c5a63',
  mint: '#5bbf95',
  mintSoft: '#d9f0e5',
  mintDeep: '#1b6b3a',
  mintBorder: '#9ad5b8',
  amber: '#f5b93b',
  amberSoft: '#fff0cf',
  amberDeep: '#9a7800',
  amberBorder: '#f5dc99',
  lavender: '#8b7fd6',
  lavenderSoft: '#e5e0fa',
  lavenderDeep: '#4a3d8e',
  lavenderBorder: '#c4bcec',
  info: '#5b8cb8',
  infoSoft: '#dde8f2',
  infoDeep: '#2c6a96',
  infoBorder: '#b9d2e8',
  coral: '#f76c7a',
  coralSoft: '#ffe2e4',
  orange: '#f97316',
  plum: '#b85a8e',
  plumSoft: '#f5dae8',
  plumDeep: '#7a2d5a',
  slate: '#5b6e8b',
  slateSoft: '#dde3ed',
  ink: '#2b1a26',
  inkSoft: '#6f5e6a',
  inkFaint: '#a898a0',
  line: '#f0e4ea',
  lineSoft: '#f7ecf1',
  paper: '#fbf7f5',
  card: '#ffffff'
};

export const SHADOWS = {
  base: '0 2px 8px rgba(107,26,61,0.06)',
  hover: '0 6px 18px rgba(107,26,61,0.12)'
};

export const CUST_TAG_COLORS = {
  WH:    { bg: T.yellowBg,     color: T.maroon800,    border: T.yellowWarm },
  DC:    { bg: T.infoSoft,     color: T.infoDeep,     border: T.infoBorder },
  COORD: { bg: T.lavenderSoft, color: T.lavenderDeep, border: T.lavenderBorder },
  FE:    { bg: T.mintSoft,     color: T.mintDeep,     border: T.mintBorder }
};

export const TYPE_COLORS = {
  OLT: T.rose,
  Switch: T.teal,
  Router: T.lavender,
  SFP: T.mint,
  'Media Converter': T.info,
  'Fiber Patch Cord': T.amber
};

export const BAR_COLORS = [T.rose, T.teal, T.lavender, T.mint, T.info, T.amber, T.plum, T.orange];

export const AV_GRADIENTS = [
  `linear-gradient(135deg, ${T.rose}, ${T.coral})`,
  `linear-gradient(135deg, ${T.teal}, ${T.info})`,
  `linear-gradient(135deg, ${T.lavender}, ${T.plum})`,
  `linear-gradient(135deg, ${T.amber}, ${T.orange})`,
  `linear-gradient(135deg, ${T.mint}, ${T.teal})`
];

// Shared status color map — extend per-component for additional statuses
export const STATUS_COLORS = {
  app:       { bg: T.mintSoft,     color: T.mintDeep,     border: T.mintBorder,     label: 'Approved'   },
  pend:      { bg: T.amberSoft,    color: T.amberDeep,    border: T.amberBorder,    label: 'Pending'    },
  rej:       { bg: T.roseSoft,     color: T.roseDeep,     border: T.roseBorder,     label: 'Rejected'   },
  itr:       { bg: T.infoSoft,     color: T.infoDeep,     border: T.infoBorder,     label: 'In Transit' },
  del:       { bg: T.lavenderSoft, color: T.lavenderDeep, border: T.lavenderBorder, label: 'Delivered'  },
  transit:   { bg: T.amberSoft,    color: T.amberDeep,    border: T.amberBorder,    label: 'In Transit' },
  dispatch:  { bg: T.infoSoft,     color: T.infoDeep,     border: T.infoBorder,     label: 'Dispatched' },
  delivered: { bg: T.mintSoft,     color: T.mintDeep,     border: T.mintBorder,     label: 'Delivered'  }
};

export const DISTRICT_COLORS = [
  T.rose, T.teal, T.lavender, T.mint, T.info, T.amber, T.plum,
  T.orange, T.coral, T.slate, T.roseDeep, T.tealDeep, T.lavenderDeep, T.mintDeep
];
