/**
 * Shared constants and utilities for ALL finance report modules
 * (Expense Reports, Revenue Reports, etc.).
 *
 * Import from here instead of duplicating in each module's *Shared.js file.
 */

// ── Colour palette ──────────────────────────────────────────────────────────
export const C = {
  maroon900: '#4a0f2a',
  maroon800: '#5a1433',
  maroon700: '#6b1a3d',
  maroon600: '#7a2147',
  yellow: '#ffd557',
  yellowSoft: '#fff4cf',
  yellowBg: '#fff9e8',
  yellowWarm: '#fdf3c8',
  rose: '#e94e77',
  roseSoft: '#ffe5ec',
  roseBg: '#fff0f4',
  roseDeep: '#a8284e',
  teal: '#2fb8c6',
  tealSoft: '#d6f2f4',
  tealDeep: '#0c5a63',
  coral: '#f76c7a',
  coralSoft: '#ffe2e4',
  coralDeep: '#a3362f',
  amber: '#f5b93b',
  amberSoft: '#fff0cf',
  amberDeep: '#9a7800',
  mint: '#5bbf95',
  mintSoft: '#d9f0e5',
  mintDeep: '#1b6b3a',
  lavender: '#8b7fd6',
  lavenderSoft: '#e5e0fa',
  lavenderDeep: '#4a3d8e',
  info: '#5b8cb8',
  infoSoft: '#dde8f2',
  infoDeep: '#2c6a96',
  plum: '#b85a8e',
  plumSoft: '#f5dae8',
  plumDeep: '#7a2d5a',
  olive: '#a8a03e',
  oliveSoft: '#f0ecc7',
  oliveDeep: '#6b6720',
  slate: '#5b6e8b',
  slateSoft: '#dde3ed',
  slateDeep: '#2d3a52',
  ink: '#2b1a26',
  inkSoft: '#6f5e6a',
  inkFaint: '#a898a0',
  line: '#f0e4ea',
  lineSoft: '#f7ecf1',
  paper: '#fbf7f5',
  card: '#ffffff',
  border: '#f0e4ea',
  text: '#2b1a26',
  mid: '#6f5e6a',
  bg: '#fbf7f5',
  dark: '#5a1433',
  mid2: '#7a2147'
};

// ── Number formatters ────────────────────────────────────────────────────────

/** Compact INR formatter: shows Cr / L suffixes for large values. */
export const fmtINR = (n) => {
  if (n == null || isNaN(n)) return '—';
  const s = n < 0 ? '-' : '';
  const a = Math.abs(n);
  if (a >= 1e7) return s + (a / 1e7).toFixed(2) + ' Cr';
  if (a >= 1e5) return s + (a / 1e5).toFixed(2) + ' L';
  return s + a.toLocaleString('en-IN', { maximumFractionDigits: 0 });
};

/** Full INR with 2 decimal places, en-IN locale. */
export const fmtINRFull = (n) => {
  if (n == null || isNaN(n)) return '—';
  return (n < 0 ? '-' : '') + Math.abs(n).toLocaleString('en-IN', { maximumFractionDigits: 2 });
};

/** INR with no decimal places, en-IN locale. */
export const fmtINRShort = (n) => {
  if (n == null || isNaN(n)) return '—';
  return (n < 0 ? '-' : '') + Math.abs(n).toLocaleString('en-IN', { maximumFractionDigits: 0 });
};

// ── String helpers ───────────────────────────────────────────────────────────

/** Strip common verbose suffixes from report titles for compact display. */
export const shortTitle = (t) =>
  t
    .replace(' Detailed Report', '')
    .replace(' Detailed', '')
    .replace(' Revenue', '')
    .replace(' Invoice', '')
    .replace(' Summary', '');

/** HTML-escape a value for safe inline rendering. */
export const escapeHtml = (s) =>
  String(s ?? '').replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]
  );
