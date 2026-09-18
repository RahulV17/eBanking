import axios from 'axios';
import { useAuthStore } from '../stores/authStore';

export const api = axios.create({
  baseURL: '/api',
  timeout: 30000, // 30 second default timeout
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Network error (backend down)
    if (!error.response && error.code === 'ECONNABORTED') {
      return Promise.reject({
        isNetworkError: true,
        message: 'Connection timed out. Please try again.',
      });
    }
    
    if (!error.response && error.message === 'Network Error') {
      return Promise.reject({
        isNetworkError: true,
        message: 'Cannot connect to server. Please check your connection.',
      });
    }

    // Session expired: drop local state and bounce to /login with the reason
    // encoded in the query (a toast alone would die with the page reload).
    // Only trigger logout on GET requests — POST/PUT/DELETE 401s are usually
    // transient (e.g. /error forwarding) and the user should see the real error.
    if (error.response?.status === 401 && error.config?.method === 'get') {
      useAuthStore.getState().logout();
      if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
        window.location.href = '/login?session=expired';
      }
    }

    return Promise.reject(error);
  }
);
