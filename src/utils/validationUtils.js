import * as yup from 'yup';

export const validation = (t) => ({
  required: (fieldKey) => t('validations.required', { 0: t(fieldKey) }),
  pleaseSelect: (fieldKey) => t('validations.pleaseSelect', { 0: t(fieldKey) }),

  invalidDigits: (fieldKey, digits) => t('validations.invalidDigits', { 0: t(fieldKey), 1: digits }),

  invalidFormat: (fieldKey) => t('validations.invalidFormat', { 0: t(fieldKey) }),

  mustBeNumber: (fieldKey) => t('validations.mustBeNumber', { 0: t(fieldKey) }),

  invalidMaxLength: (fieldKey, max) => t('validations.invalidMaxLength', { 0: t(fieldKey), 1: max }),

  invalidMinLength: (fieldKey, min) => t('validations.invalidMinLength', { 0: t(fieldKey), 1: min }),
  minAge: (fieldKey, age) => t('validations.minAge', { 0: t(fieldKey), 1: age }),
  minValue: (fieldKey, min) => t('validations.minValue', { 0: t(fieldKey), 1: min }),
  maxValue: (fieldKey, max) => t('validations.maxValue', { 0: t(fieldKey), 1: max }),
  mustBeGreaterThan: (fieldKey, refKey) => t('validations.mustBeGreaterThan', { 0: t(fieldKey), 1: t(refKey) }),
  noSpacesAllowed: (fieldKey) => t('validations.noSpacesAllowed', { 0: t(fieldKey) }),
  mustAcceptTerms: () => t('validations.mustAcceptTerms'),
  invalidUsernameFormat: () => t('validations.invalidUsernameFormat'),

  nonEmptyObject: (fieldKey = 'field') =>
    yup
      .object()
      .nullable()
      .test('not-empty', t('choose', { 0: t(fieldKey) }), (value) => {
        return value && Object.keys(value).length > 0;
      })
      .required(t('validations.required', { 0: t(fieldKey) }))
});

// True when the selected circle/tenant is Kerala (by code "KL" or name).
// Kerala has its own tighter PIN-code range; every other circle falls back to
// the generic pan-India 6-digit format since per-state ranges aren't available.
export const isKeralaCircle = (circle) => {
  const code = (circle?.code || circle?.tenantCode || '').toString().toUpperCase();
  const name = (circle?.name || circle?.stateName || '').toString().toLowerCase();
  return code === 'KL' || name === 'kerala';
};

// PIN-code format test driven by the sibling `circle` field. Use inside a yup
// `.test(...)` chain: skips empty (handled by `.required`), Kerala vs generic.
export const isValidCirclePincode = (value, circle) => {
  if (!value) return true;
  const pattern = isKeralaCircle(circle) ? regex.keralaPinCode : regex.pinCode;
  return pattern.test(value);
};

export const dropdownRequired = (label) =>
  yup
    .mixed()
    .nullable()
    .test('dropdown-required', label, (value) => {
      if (!value) return false;

      // If value is an object, check common keys
      if (typeof value === 'object') {
        const id = value.srvId ?? value.id ?? value.value ?? value.code ?? value.uuid;
        return id !== undefined && id !== null && id !== '';
      }

    // Primitive value
    return value !== undefined && value !== null && value !== '';
  });

const SERVICE_DESCRIPTION_CHAR_SET = 'a-zA-Z0-9 .&/()-,';
const SERVICE_DESCRIPTION_CHAR_REGEX = new RegExp(`^[${SERVICE_DESCRIPTION_CHAR_SET}]$`);

export const regex = {
  mobile: /^[6-9]\d{9}$/,
  macAddress: /^([0-9A-Fa-f]{2}[:-]){5}[0-9A-Fa-f]{2}$/,
  aadhaar: /^[2-9][0-9]{11}$/,
  pinCode: /^[1-9]\d{5}$/,
  keralaPinCode: /^(6[78]\d{4}|69[0-5]\d{3})$/,
  otp: /^\d{6}$/,
  ifsc: /^[A-Z]{4}0[A-Z0-9]{6}$/,
  bankAccount: /^[0-9]{9,18}$/,
  panNumber: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
  stateCode: /^[0-9]{2}$/,
  gstNumber: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
  holderName: /^[a-zA-Z\s]+$/,
  personNameRegex: /^[a-zA-Z][a-zA-Z\s.]*[a-zA-Z]$/,
  decimal: /^(?:\d+\.?\d*|\.\d+)$/,
  landline: /^0[1-9]\d{0,3}-?\d{6,8}$/,
  email: /^(?!.*\.\.)(?!\.)(?!.*\.$)[a-zA-Z0-9]+(?:[._+%-][a-zA-Z0-9]+)*@[a-zA-Z0-9-]+(?:\.[a-zA-Z]{2,})+$/i,
  ipAddress: /^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$/,
  portNumber: /^([1-9]\d{0,4})$/,
  rationCard: /^\d{10}$/,
  orgName: /^[a-zA-Z0-9][a-zA-Z0-9\s.&()-,/]*$/,
  serviceDescription: new RegExp(`^[a-zA-Z0-9(][${SERVICE_DESCRIPTION_CHAR_SET}]*$`),
  // Alphanumeric + . @ _ only; must start/end with alphanumeric; no consecutive special chars; no spaces
  username: /^[a-zA-Z0-9]([a-zA-Z0-9._@]*[a-zA-Z0-9])?$/
};

export const excelTypes = [
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel',
  '.xlsx',
  '.xls'
];

export const CSV_FILE = ['text/csv', '.csv', 'text/plain'];
export const DOCUMENT_FILES = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
export const PDF_FILES = ['application/pdf'];
export const VLAN_ID_MIN = 1;
export const VLAN_ID_MAX = 4094;
export const VLAN_SHORT_NAME_MIN = 3;
export const VLAN_SHORT_NAME_MAX = 20;
export const VLAN_ALLOWED_TYPES = ['juniper', 'mikrotik'];

// Shared field lengths
export const OTP_LENGTH = 6;
export const MOBILE_NUMBER_LENGTH = 10;
export const PINCODE_LENGTH = 6;
export const USERNAME_MIN_LENGTH = 3;
export const USERNAME_MAX_LENGTH = 25;

// Common transform functions for Yup validations
export const trimString = (v) => (typeof v === 'string' ? v.trim() : v);
export const hasNoLeadingOrTrailingSpaces = (v) => typeof v !== 'string' || v === v.trim();
export const isDigitsOnly = (v) => typeof v === 'string' && /^\d+$/.test(v);

// Username format: regex.username + length bounds. Shared by UsernameInput and ChangeUsernamePopup.
export const isUsernameFormatValid = (val) =>
  typeof val === 'string' &&
  val.length >= USERNAME_MIN_LENGTH &&
  val.length <= USERNAME_MAX_LENGTH &&
  regex.username.test(val);

export const isVlanIdInRange = (v, min = VLAN_ID_MIN, max = VLAN_ID_MAX) => {
  const normalized = typeof v === 'number' ? String(v) : v;
  if (!isDigitsOnly(normalized)) return false;
  const value = Number(normalized);
  return value >= min && value <= max;
};

const normalizeLookupValue = (value) => {
  if (value === null || value === undefined) return '';
  return String(value).trim().toLowerCase();
};

const getPartnerLookupId = (value) =>
  normalizeLookupValue(
    typeof value === 'object' ? value?.partnerId ?? value?.franchiseId ?? value?.id ?? value?.value ?? value?.code : value
  );

const getVlanTypeLookupValue = (value) =>
  normalizeLookupValue(typeof value === 'object' ? value?.name ?? value?.nasType ?? value?.value ?? value?.code : value);

const getVlanIdLookupValue = (value) => {
  const normalized = typeof value === 'object' ? value?.vlanId ?? value?.value : value;
  if (!isDigitsOnly(String(normalized ?? ''))) return normalizeLookupValue(normalized);
  return String(Number(normalized));
};

export const isDuplicateVlanMapping = (mappings = [], partnerId, vlanId, vlanType) => {
  const partnerLookupId = getPartnerLookupId(partnerId);
  const vlanIdLookupValue = getVlanIdLookupValue(vlanId);
  const vlanTypeLookupValue = getVlanTypeLookupValue(vlanType);

  if (!partnerLookupId || !vlanIdLookupValue || !vlanTypeLookupValue) return false;

  return mappings.some((mapping) => {
    const mappingPartnerId = getPartnerLookupId(mapping?.partnerId ?? mapping?.franchiseId);
    const mappingVlanId = getVlanIdLookupValue(mapping?.vlanId);
    const mappingVlanType = getVlanTypeLookupValue(mapping?.vlanType ?? mapping?.nasType);

    return (
      mappingPartnerId === partnerLookupId &&
      mappingVlanId === vlanIdLookupValue &&
      mappingVlanType === vlanTypeLookupValue
    );
  });
};

export const isDuplicateVlanShortName = (mappings = [], vlanShortName, excludeId) => {
  const shortNameLookupValue = normalizeLookupValue(vlanShortName);
  if (!shortNameLookupValue) return false;

  return mappings.some((mapping) => {
    const mappingId = mapping?.id ?? mapping?.vlanMappingId ?? mapping?.mappingId;
    const mappingShortName = normalizeLookupValue(mapping?.vlanShortName);

    if (excludeId != null && mappingId != null && String(mappingId) === String(excludeId)) {
      return false;
    }

    return mappingShortName === shortNameLookupValue;
  });
};

export const isValidVlanShortName = (value) => typeof value === 'string' && /^[A-Za-z0-9_-]{3,20}$/.test(value);

export const isAllowedVlanType = (value) => {
  const normalizedValue = getVlanTypeLookupValue(value);
  return VLAN_ALLOWED_TYPES.includes(normalizedValue);
};

export const sortByNameAsc = (items = [], field = 'name') =>
  [...items].sort((a, b) => String(a?.[field] ?? '').localeCompare(String(b?.[field] ?? ''), undefined, { sensitivity: 'base' }));

const NAV_KEYS = ['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight'];

// Allow only digit key presses in input fields (use with onKeyDown)
export const allowOnlyDigits = (e) => {
  if (e.ctrlKey || e.metaKey || /^\d$/.test(e.key) || NAV_KEYS.includes(e.key)) return;
  e.preventDefault();
};

export const allowOnlyVlanShortNameChars = (e) => {
  if (!/^[A-Za-z0-9_-]$/.test(e.key) && !NAV_KEYS.includes(e.key)) e.preventDefault();
};

// Allow only alphabet and space key presses in input fields (use with onKeyDown)
export const allowOnlyAlpha = (e) => {
  if (!/^[a-zA-Z\s]$/.test(e.key) && !NAV_KEYS.includes(e.key)) e.preventDefault();
};

// Allow only alphabet, space, and dot key presses in input fields (use with onKeyDown)
export const allowOnlyAlphaWithDot = (e) => {
  if (!/^[a-zA-Z\s.]$/.test(e.key) && !NAV_KEYS.includes(e.key)) e.preventDefault();
};

// Strip leading whitespace from input value (use with onInput)
export const stripLeadingSpaces = (e) => {
  e.target.value = e.target.value.replace(/^\s+/, '');
};

// Strip leading spaces and collapse multiple consecutive spaces into one (use with onInput)
export const stripExtraSpaces = (e) => {
  e.target.value = e.target.value.replace(/^\s+/, '').replace(/\s{2,}/g, ' ');
};

// Strip trailing whitespace from input value (use with onBlur)
export const stripTrailingSpaces = (e) => {
  e.target.value = e.target.value.replace(/\s+$/, '');
};

// Strip all non-digit characters from input value (use with onInput)
export const stripNonDigits = (e) => {
  e.target.value = e.target.value.replace(/\D/g, '');
};

// Strip all characters except digits and hyphens from input value (use with onInput)
export const stripNonDigitsAndHyphens = (e) => {
  e.target.value = e.target.value.replace(/[^0-9-]/g, '');
};

// Format decimal input: allow up to 3 decimal places, prevent multiple dots (use with onInput)
export const formatDecimalInput = (e) => {
  let val = e.target.value.replace(/[^0-9.]/g, '');
  const parts = val.split('.');
  if (parts.length > 2) val = parts[0] + '.' + parts.slice(1).join('');
  if (parts.length === 2) val = parts[0] + '.' + parts[1].slice(0, 3);
  e.target.value = val;
};

// Format fibre KM input: max 4 integer digits and 3 decimal places (max 9999.999)
export const formatFibreKmInput = (e) => {
  let val = e.target.value.replace(/[^0-9.]/g, '');
  const parts = val.split('.');
  if (parts.length > 2) val = parts[0] + '.' + parts.slice(1).join('');
  const intPart = parts[0].slice(0, 4);
  e.target.value = parts.length === 2 ? intPart + '.' + parts[1].slice(0, 3) : intPart;
};

// Allow only alphanumeric key presses for PAN number input (use with onKeyDown)
export const allowOnlyPanChars = (e) => {
  if (!/^[a-zA-Z0-9]$/.test(e.key) && !NAV_KEYS.includes(e.key)) e.preventDefault();
};

// Allow only alphanumeric and space key presses in input fields (use with onKeyDown)
export const allowOnlyAlphaNumericSpace = (e) => {
  if (!/^[a-zA-Z0-9 ]$/.test(e.key) && !NAV_KEYS.includes(e.key)) e.preventDefault();
};

// Allow alphanumeric and basic special characters for Service Description (., -, &, /, ())
export const allowOnlyServiceDescriptionChars = (e) => {
  if (!SERVICE_DESCRIPTION_CHAR_REGEX.test(e.key) && !NAV_KEYS.includes(e.key)) e.preventDefault();
};

// Allow only alphanumeric and forward-slash key presses (no spaces)
export const allowOnlyAlphaNumeric = (e) => {
  if (!/^[a-zA-Z0-9/]$/.test(e.key) && !NAV_KEYS.includes(e.key)) e.preventDefault();
};

// Strip non-alphanumeric/slash and convert to uppercase
export const transformUppercaseAlphaNumeric = (e) => {
  e.target.value = e.target.value.replace(/[^a-zA-Z0-9/]/g, '').toUpperCase();
};

// Allow only digit key presses for IP address inputs (dots are auto-inserted by formatIpAddress)
export const allowOnlyIpChars = (e) => {
  if (!/^\d$/.test(e.key) && !NAV_KEYS.includes(e.key)) e.preventDefault();
};

// Auto-format IP address: clamps each octet to 0-255, inserts dot after 3 digits automatically.
// Pass prevValue (the value before this change) so deletion is detected and dot is not re-inserted.
// Use with handleChange in FormController: setValue('field', formatIpAddress(e.target.value, prevValue))
export const formatIpAddress = (value, prevValue = '') => {
  const isDeleting = value.length < prevValue.length;

  const cleaned = value.replace(/[^\d.]/g, '');

  const octets = cleaned.split('.').slice(0, 4).map((o) => o.slice(0, 3));

  const clamped = octets.map((o, i) => {
    if (i < octets.length - 1 || o.length === 3) {
      const n = parseInt(o, 10);
      if (!isNaN(n) && n > 255) return '255';
    }
    return o;
  });

  const result = clamped.join('.');

  const lastOctet = clamped[clamped.length - 1];
  if (!isDeleting && clamped.length < 4 && lastOctet.length === 3) {
    return result + '.';
  }

  return result;
};

// Format a raw input value into a colon-separated MAC address (AA:BB:CC:DD:EE:FF)
export const formatMacAddress = (value) => {
  const hex = value.replace(/[^0-9A-Fa-f]/g, '').slice(0, 12);
  return hex.match(/.{1,2}/g)?.join(':') ?? hex;
};

export const handleKeyDown = (event) => {
  const { value, selectionStart } = event.target;
  if (event.key === ' ' && (selectionStart === 0 || value[selectionStart - 1] === ' ')) {
    event.preventDefault();
  }
};
