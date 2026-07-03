import axios from 'axios';
import { firebaseAuth } from '@/core/auth/firebaseConfig';
import { API_BASE_URL } from './apiConstants';

export const axiosClient = axios.create({
  baseURL: API_BASE_URL,
});

axiosClient.interceptors.request.use(async (config) => {
  const user = firebaseAuth?.currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers.set('Authorization', `Bearer ${token}`);
  }
  return config;
});

// See Flutter Bug #2: a backend sync failure must not sign the user out.
// Only a structured "token_expired" error means the Firebase token itself
// is stale — a generic 401/500/network error on any other endpoint must not
// trigger a sign-out.
let tokenExpiredHandler: (() => void) | null = null;

export function setTokenExpiredHandler(handler: (() => void) | null) {
  tokenExpiredHandler = handler;
}

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (import.meta.env.DEV) {
      console.error('[API Error]', error);
    }

    const status = axios.isAxiosError(error) ? error.response?.status : undefined;
    const code = axios.isAxiosError(error)
      ? (error.response?.data as { code?: string } | undefined)?.code
      : undefined;

    if (status === 401 && code === 'token_expired') {
      tokenExpiredHandler?.();
    }

    return Promise.reject(error);
  },
);
