export const AVATAR_COLORS = [
  { bg: '#f3e2c8', color: '#c2a060' },
  { bg: '#d6eaff', color: '#4a7dc4' },
  { bg: '#d4f0e8', color: '#2e8b6a' },
  { bg: '#f5d6f0', color: '#a0469a' }
];

export const FORWARD_INITIAL_COLORS = ['#F1DEEC', '#DFCDE5', '#F3E2C8', '#FEEFC3', '#FCEBB6'];

export const getInitials = (name = '') => {
  const parts = name.trim().split(' ');
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
};

export const getAvatarColor = (name = '') => {
  const idx = name ? name.charCodeAt(0) % AVATAR_COLORS.length : 0;
  return AVATAR_COLORS[idx];
};

export const getForwardInitialColor = (index) => FORWARD_INITIAL_COLORS[index % FORWARD_INITIAL_COLORS.length];

export const formatNoteDate = (dateStr) => {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    const min = String(d.getMinutes()).padStart(2, '0');
    const ss = String(d.getSeconds()).padStart(2, '0');
    const period = d.getHours() >= 12 ? 'PM' : 'AM';
    const h12 = String(d.getHours() % 12 || 12).padStart(2, '0');
    return `${dd}-${mm}-${yyyy}  ${h12}:${min}:${ss} ${period}`;
  } catch {
    return dateStr;
  }
};
