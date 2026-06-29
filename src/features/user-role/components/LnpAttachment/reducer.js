export const INIT = {
  districtId: null,
  feId: null,
  selected: new Set(),
  searchQ: '',
  statusFilter: 'all',
  page: 0,
  size: 10,
  showModal: false,
  pendingIds: []
};

export function reducer(state, action) {
  switch (action.type) {
    case 'PICK_DISTRICT':
      return { ...state, districtId: action.id, feId: null, selected: new Set(), page: 0 };
    case 'PICK_FE':
      return { ...state, feId: action.id, selected: new Set(), page: 0 };
    case 'TOGGLE_ONE': {
      const s = new Set(state.selected);
      s.has(action.id) ? s.delete(action.id) : s.add(action.id);
      return { ...state, selected: s };
    }
    case 'TOGGLE_ALL': {
      const ids = action.ids || [];
      const all = ids.length > 0 && ids.every((id) => state.selected.has(id));
      const s = new Set(state.selected);
      ids.forEach((id) => (all ? s.delete(id) : s.add(id)));
      return { ...state, selected: s };
    }
    case 'CLEAR_SEL':
      return { ...state, selected: new Set() };
    case 'SET_SEARCH':
      return { ...state, searchQ: action.q, page: 0 };
    case 'SET_STATUS':
      return { ...state, statusFilter: action.v, selected: new Set(), page: 0 };
    case 'SET_PAGE':
      return { ...state, page: action.page, size: action.size, selected: new Set() };
    case 'SHOW_MODAL':
      return { ...state, showModal: true, pendingIds: action.ids };
    case 'CLOSE_MODAL':
      return { ...state, showModal: false, pendingIds: [] };
    default:
      return state;
  }
}
