import axios from 'axios';

import { STORAGE_KEYS } from '@/constants';
import { HTTP_HEADERS } from '@/constants/api';
import { API_URL } from '@/constants/urls';
import { getDataFromStorage, setDataToStorage } from '@/utils/encryptionUtils';
import { isTokenExpired } from '@/utils/jwtUtils';
import {
  getIsRefreshing,
  rejectQueue,
  resolveQueue,
  setIsRefreshing
} from '@/utils/refreshLock';

export async function attemptTokenRefresh() {
  const refreshToken = getDataFromStorage(STORAGE_KEYS.REFRESH_TOKEN, false);
  if (!refreshToken || isTokenExpired(refreshToken)) return false;

  if (getIsRefreshing()) {
    const start = Date.now();
    while (getIsRefreshing()) {
      if (Date.now() - start >= 5000) return false;
      await new Promise((res) => setTimeout(res, 100));
    }
    const updatedToken = getDataFromStorage(STORAGE_KEYS.AUTH_TOKEN, false);
    return !!updatedToken && !isTokenExpired(updatedToken);
  }

  setIsRefreshing(true);
  try {
    const baseURL = import.meta.env.VITE_API_BASE_URL;
    const response = await axios.post(
      `${baseURL}/${API_URL.AUTH.REFRESH_TOKEN}`,
      { refreshToken },
      { headers: HTTP_HEADERS }
    );

    const payload = response.data ?? {};
    const token = payload.token ?? payload.data?.token;
    if (!token) {
      rejectQueue(new Error('No token in refresh response'));
      setIsRefreshing(false);
      return false;
    }

    setDataToStorage(STORAGE_KEYS.AUTH_TOKEN, token, false);
    const newRefreshToken = payload.refreshToken ?? payload.data?.refreshToken;
    if (newRefreshToken) {
      setDataToStorage(STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken, false);
    }
    const expiresIn = payload.expiresIn ?? payload.data?.expiresIn;
    if (expiresIn) {
      setDataToStorage(STORAGE_KEYS.TOKEN_EXPIRES_IN, String(expiresIn), false);
    }

    setIsRefreshing(false);
    resolveQueue(token);
    return true;
  } catch (err) {
    rejectQueue(err);
    setIsRefreshing(false);
    return false;
  }
}
