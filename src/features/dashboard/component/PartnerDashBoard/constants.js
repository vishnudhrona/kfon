export const STATE_REDUCER_KEY = 'partnerDashboard';

// Onboarding pipeline stages, ordered. API returns `stage` as one of these labels;
// we match it back to this list (case-insensitive) to drive badge colours + filter.
export const STAGES = ['Open', 'Feasible', 'Approved', 'Onboarded'];

export const STAGE_COLORS = [
  { bg: '#F2D9DF', color: '#7A1C2E' },
  { bg: '#FFF6EE', color: '#FF8C00' },
  { bg: '#F5F0FF', color: '#9B59B6' },
  { bg: '#EDFAF4', color: '#27AE60' }
];

// Resolve an API stage label to its index in STAGES. Returns -1 when unknown.
export const resolveStageIndex = (label) => {
  if (label == null) return -1;
  const norm = String(label).trim().toLowerCase();
  return STAGES.findIndex((s) => {
    const a = s.toLowerCase().replace(/[.\s]+/g, '');
    const b = norm.replace(/[.\s]+/g, '');
    return a === b || a.includes(b) || b.includes(a);
  });
};

export const PERIOD_OPTIONS = ['Today', 'This Week', 'This Month', 'This Year'];

// Period label → i18n key. Values stay English (used as state + PERIOD_PARAM keys).
export const PERIOD_LABEL_KEYS = {
  Today: 'dashboard.periodToday',
  'This Week': 'dashboard.periodThisWeek',
  'This Month': 'dashboard.periodThisMonth',
  'This Year': 'dashboard.periodThisYear'
};

// Stage label → i18n key. STAGES values stay English (matched against API + filter values).
export const STAGE_LABEL_KEYS = {
  Open: 'dashboard.stageOpen',
  Feasible: 'dashboard.stageFeasible',
  Approved: 'dashboard.stageApproved',
  Onboarded: 'dashboard.stageOnboarded'
};

export const DEFAULT_PAGE_SIZE = 10;

// Maps a UI period label to the `period` query param the backend expects.
export const PERIOD_PARAM = {
  Today: 'TODAY',
  'This Week': 'THIS_WEEK',
  'This Month': 'THIS_MONTH',
  'This Year': 'THIS_YEAR',
  'Custom Period': 'CUSTOM'
};

// Hero gradient cards — backed by the summary-stat-cards endpoint.
// `key` maps each card to a field on PartnerStatCardsResponse.
export const HERO_STATS = [
  {
    key: 'pendingFeasibility',
    labelKey: 'dashboard.pendingFeasibility',
    subKey: 'dashboard.pendingFeasibilitySub',
    gradient: 'linear-gradient(135deg,#FF5A7E,#E53070)'
  },
  {
    key: 'pendingApproval',
    labelKey: 'dashboard.pendingApproval',
    subKey: 'dashboard.pendingApprovalSub',
    gradient: 'linear-gradient(135deg,#9B59B6,#6C3483)'
  },
  {
    key: 'pendingOnboarding',
    labelKey: 'dashboard.pendingOnboarding',
    subKey: 'dashboard.pendingOnboardingSub',
    gradient: 'linear-gradient(135deg,#00C8A8,#00A088)'
  },
  {
    key: 'pendingLinkEstablishment',
    labelKey: 'dashboard.pendingLinkEstablishment',
    subKey: 'dashboard.pendingLinkEstablishmentSub',
    gradient: 'linear-gradient(135deg,#4488FF,#2255CC)'
  },
  {
    key: 'pendingFrc',
    labelKey: 'dashboard.pendingFrc',
    subKey: 'dashboard.pendingFrcSub',
    gradient: 'linear-gradient(135deg,#C0395A,#7A1C2E)'
  },
  {
    key: 'highPerformingSubscribers',
    labelKey: 'dashboard.highPerformingSubscribers',
    subKey: 'dashboard.highPerformingSubscribersSub',
    gradient: 'linear-gradient(135deg,#D4A017,#B8860B)'
  }
];
