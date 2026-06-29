import CryptoJS from 'crypto-js';

import { STORAGE_KEYS } from '@/constants';

const SECRET = import.meta.env.VITE_ENCRYPTION_SECRET || 'default-secret-key-change-in-production';

export const createEncryptionFunctions = (SECRET_KEY) => {
  const encryptData = (data, key) => {
    return CryptoJS.AES.encrypt(data, key).toString();
  };

  const bytes = (data, key) => CryptoJS.AES.decrypt(data, key).toString(CryptoJS.enc.Utf8);

  const encrypt = (data, isObj) => encryptData(isObj ? JSON.stringify(data) : data, SECRET_KEY);
  const decrypt = (data, isObj) => (isObj ? JSON.parse(bytes(data, SECRET_KEY)) : bytes(data, SECRET_KEY));

  const setDataToStorage = (key, data, isObj) => {
    try {
      localStorage.setItem(key, encrypt(data, isObj));
    } catch (error) {
      console.error(`Encryption failed for key ${key} , ${error}`);
    }
  };

  const getDataFromStorage = (key, isObj, defaultValue) => {
    const data = localStorage.getItem(key);
    try {
      return data ? decrypt(data, isObj) : data;
    } catch (error) {
      console.error(`Decryption failed for '${key}' , ${error}`);

      if (defaultValue) {
        return defaultValue;
      }
      return undefined;
    }
  };

  return {
    setDataToStorage,
    getDataFromStorage,
    encrypt,
    decrypt
  };
};

// Export a default instance with the SECRET
export const { setDataToStorage, getDataFromStorage, encrypt, decrypt } = createEncryptionFunctions(SECRET);

/**
 * Parse JWT token to extract payload
 * @param {string} token - JWT token string
 * @returns {object|null} - Decoded token payload or null if invalid
 */
export const parseJwtToken = (token) => {
  try {
    if (!token) return null;
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error parsing JWT token:', error);
    return null;
  }
};

/**
 * Get decrypted token from localStorage
 * @param {string} key - Storage key for token (default: 'token')
 * @returns {string|null} - Decrypted token or null
 */
export const getDecryptedToken = (key = 'token') => {
  try {
    const encryptedToken = localStorage.getItem(key);
    if (!encryptedToken) return null;
    return decrypt(encryptedToken, false);
  } catch (error) {
    console.error('Error decrypting token:', error);
    return null;
  }
};

/**
 * Get decoded token data from localStorage
 * @param {string} key - Storage key for token (default: 'token')
 * @returns {object|null} - Decoded token data or null
 */
export const getTokenData = (key = 'token') => {
  const token = getDecryptedToken(key);
  return parseJwtToken(token);
};

/**
 * Get user roles from token
 * @param {string} key - Storage key for token (default: 'token')
 * @returns {Array} - Array of user roles or empty array
 */
export const getUserRoles = (key = 'token') => {
  const tokenData = getTokenData(key);
  console.log('tokenData', tokenData);
  return tokenData?.roles || tokenData?.role || [];
};

/**
 * Check if user has a specific role
 * @param {string} role - Role to check
 * @param {string} key - Storage key for token (default: 'token')
 * @returns {boolean} - True if user has the role
 */
export const hasRole = (role, key = STORAGE_KEYS.AUTH_TOKEN) => {
  const roles = getUserRoles(key);
  if (Array.isArray(roles)) {
    return roles.map((role) => role.name).includes(role);
  }
  return roles === role;
};

/**
 * Get user ID from token
 * @param {string} key - Storage key for token (default: 'token')
 * @returns {string|number|null} - User ID or null
 */
export const getUserId = (key = 'token') => {
  const tokenData = getTokenData(key);
  return tokenData?.userId || tokenData?.id || tokenData?.sub || null;
};

/**
 * Get username from token
 * @param {string} key - Storage key for token (default: 'token')
 * @returns {string|null} - Username or null
 */
export const getUsername = (key = 'token') => {
  const tokenData = getTokenData(key);
  return tokenData?.username || tokenData?.name || tokenData?.email || null;
};

/**
 * Check if token is expired
 * @param {string} key - Storage key for token (default: 'token')
 * @returns {boolean} - True if token is expired or invalid
 */
export const isTokenExpired = (key = 'token') => {
  const tokenData = getTokenData(key);
  if (!tokenData || !tokenData.exp) {
    return true;
  }
  const currentTime = Date.now() / 1000;
  return tokenData.exp < currentTime;
};

/**
 * Get all token data including roles, user info, etc.
 * @param {string} key - Storage key for token (default: 'token')
 * @returns {object} - Object containing all token information
 */
export const getAllTokenInfo = (key = 'token') => {
  const tokenData = getTokenData(key);
  if (!tokenData) {
    return {
      isValid: false,
      isExpired: true,
      roles: [],
      userId: null,
      username: null,
      data: null
    };
  }

  return {
    isValid: true,
    isExpired: isTokenExpired(key),
    roles: getUserRoles(key),
    userId: getUserId(key),
    username: getUsername(key),
    data: tokenData
  };
};
