export const STATE_REDUCER_KEY = 'crm';
export const TABLE_KEY = 'CRM_TICKET_LIST';

export const UPDATE_STATE_OPTIONS = [
  { label: 'OPEN', name: 'Open' },
  { label: 'IN_PROGRESS', name: 'In Progress' },
  { label: 'CLOSED', name: 'Closed' },
  { label: 'REOPEN', name: 'Reopen' },
  { label: 'UNASSIGNED', name: 'Unassigned' }
];

export const VISIBLE_COLUMNS_ISSUE_MAPPING = [
  { header: 'Customer Type', accessor: 'customerTypeName' },
  { header: 'Issue Category', accessor: 'categoryName' },
  { header: 'Role', accessor: 'roleName' }
];

export const LNP = 'LNP';
export const RETURN = 'RETURN';
export const FORWARD = 'FORWARD';
export const FORWARD_PLUS = 'FORWARD_PLUS';
export const CLOSED = 'CLOSED';
export const CLOSE = 'Closed'
export const REOPEN = 'REOPEN';
