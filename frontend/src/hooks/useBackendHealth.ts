import { useEffect, useState } from 'react';
import { api } from '../api/client';

export function useBackendHealth() {
  const [isOnline, setIsOnline] = useState(true);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const check = async () => {
      try {
        await api.get('/v1/user/account/bank', { timeout: 3000 });
        setIsOnline(true);
      } catch (error: any) {
        if (error.isNetworkError || error.code === 'ECONNABORTED') {
          setIsOnline(false);
        } else if (error.response) {
          // Server responded but with error (e.g., 401) — backend is online
          setIsOnline(true);
        } else {
          setIsOnline(false);
        }
      } finally {
        setIsChecking(false);
      }
    };

    check();
    const interval = setInterval(check, 10000);
    return () => clearInterval(interval);
  }, []);

  return { isOnline, isChecking };
}
