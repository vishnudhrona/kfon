import { AV_COLORS } from './constants';

export function initials(name) {
  return (name || '?')
    .trim()
    .split(/\s+/)
    .map((s) => s[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export function avIndex(id) {
  let h = 0;
  for (let i = 0; i < (id || '').length; i++) h = (h * 31 + id.charCodeAt(i)) & 0xffff;
  return h % AV_COLORS.length;
}

// Map fe-lnp/lnp-users content item → shape the cards expect
export function mapLnpRow(item) {
  return {
    id: item.lnpUserId,
    partnerId: item.lnpPartnerId,
    name: item.companyName || item.lnpPartnerId || '',
    address: item.address || '',
    pin: item.pincode || '',
    mobile: item.mobile || '',
    status: item.status,
    feId: item.assignedFeUserId || null
  };
}

// Map fe-lnp/fe-users item → shape the FE cards expect
export function mapFeUser(u) {
  return {
    id: u.userId,
    empName: u.empName,
    name: u.empName,
    username: u.username,
    seatId: u.seatId,
    seatName: u.seatName
  };
}

export function buildSeatsById(seats) {
  const map = {};
  for (const s of seats) map[s.id] = s;
  return map;
}

export function feName(seat) {
  return seat ? (seat.empName || seat.name || '') : '';
}
