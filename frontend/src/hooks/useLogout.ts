import { api } from '../api/client';
import { useAuthStore } from '../stores/authStore';

export function useLogout() {
  return async () => {
    try {
      await api.post('/v1/auth/logout');
    } catch {
      // Ignore errors - still clear local state
    } finally {
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
  };
}
