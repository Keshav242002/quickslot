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

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (import.meta.env.DEV) {
      console.error('[API Error]', error);
    }
    return Promise.reject(error);
  },
);
