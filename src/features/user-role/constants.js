export const STATE_REDUCER_KEY = 'roleMenu-key';

export const VISIBLE_COLUMNS_USER_LIST = [
  { header: 'userName', accessor: 'username' },
  { header: 'employeeName', accessor: 'empName' },
  { header: 'employeeMobileNumber', accessor: 'mobile' },
  { header: 'employeeEmailId', accessor: 'email' },
  { header: 'designation', accessor: 'designationName' },
  { header: 'Seat Name', accessor: 'seatName' },
  { header: 'roles', accessor: 'roles' },
  { header: 'Pincode', accessor: 'pincodes' },
  { header: 'District', accessor: 'districtMaps' },
  { header: 'status', accessor: 'active' }
];

export const VISIBLE_COLUMNS_ROLE_LIST = [
  { header: 'Role Name', accessor: 'roleName' },
  { header: 'Reports To', accessor: 'parentName' },
  { header: 'Description', accessor: 'description' },
  { header: 'Status', accessor: 'active' }
];

export const VISIBLE_COLUMNS_SEAT_LIST = [
  { header: 'Organization', accessor: 'organizationName' },
  { header: 'Division', accessor: 'divisionName' },
  { header: 'Seat Name', accessor: 'name' },
  { header: 'Seat Code', accessor: 'code' },
  { header: 'Employee Name', accessor: 'empName' },
  { header: 'User Name', accessor: 'username' },
  { header: 'Status', accessor: 'active' },
  { header: 'Role Status', accessor: 'roleStatus' },
  { header: 'User Status', accessor: 'userStatus' },
  { header: 'Pincode Status', accessor: 'pincodeStatus' },
  { header: 'roles', accessor: 'roles' },
  { header: 'Pincode', accessor: 'pincodes' },
  { header: 'District', accessor: 'districtMaps' }
];

export const VISIBLE_COLUMNS_ZONE_LIST = [
  { name: 'Calicut', accessor: 'zoneName' },
  { name: 'Trivandrum', accessor: 'zoneCode' },
  { name: 'Kochi', accessor: 'active' }
];

export const VISIBLE_COLUMNS_TEMPLATE_LIST = [
  { header: 'External Users', accessor: 'name' },
  { header: 'Role', accessor: 'roleName' },
  { header: 'status', accessor: 'active' }
];

export const VISIBLE_COLUMNS_DIVISION_LIST = [
  { header: 'Organization', accessor: 'organizationName' },
  { header: 'Division Name', accessor: 'name' },
  { header: 'status', accessor: 'active' }
];

export const VISIBLE_COLUMNS_DESIGNATION_LIST = [
  { header: 'Designation Name', accessor: 'name' },
  { header: 'Description', accessor: 'label' },
  { header: 'Status', accessor: 'active' }
];

export const EMPLOYEE_TITLE_OPTIONS = [
  { label: 'Mr.', value: 'Mr.' },
  { label: 'Mrs.', value: 'Mrs.' },
  { label: 'Ms.', value: 'Ms.' },
  { label: 'Dr.', value: 'Dr.' },
  { label: 'Prof.', value: 'Prof.' },
  { label: 'Rev.', value: 'Rev.' }
];
