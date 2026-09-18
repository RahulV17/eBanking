import { lazy, Suspense, useState, useEffect, useCallback } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { ThemeProvider } from './providers/ThemeProvider';
import { useAuthStore } from './stores/authStore';
import { api } from './api/client';
import Layout from './components/layout/Layout';
import LoginPage from './features/auth/LoginPage';
import ForgotPassword from './pages/ForgotPassword';
import NotFound from './pages/NotFound';
import HomePage from './pages/HomePage';

// Lazy-loaded pages
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Transactions = lazy(() => import('./pages/Transactions'));
const Transfers = lazy(() => import('./pages/Transfers'));
const Admin = lazy(() => import('./pages/Admin'));
const AIChat = lazy(() => import('./pages/AIChat'));
const Profile = lazy(() => import('./pages/Profile'));
const Accounts = lazy(() => import('./pages/Accounts'));
const Deposits = lazy(() => import('./pages/Deposits'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 3,
      refetchOnWindowFocus: false,
    },
  },
});

const PageSkeleton = () => (
  <div className="animate-pulse space-y-6 p-6">
    <div className="h-8 bg-surface-muted rounded w-48"></div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="h-32 bg-surface-muted rounded-xl"></div>
      ))}
    </div>
    <div className="h-64 bg-surface-muted rounded-xl"></div>
  </div>
);

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, user } = useAuthStore();
  const [isReady, setIsReady] = useState(false);
  
  // Allow Zustand state to propagate after login
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);
  
  // Also update isReady when auth state changes
  useEffect(() => {
    if (isAuthenticated && user) {
      setIsReady(true);
    }
  }, [isAuthenticated, user]);
  
  if (isLoading || !isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-text-secondary text-sm">Verifying your session...</p>
        </div>
      </div>
    );
  }
  
  return isAuthenticated && user ? <>{children}</> : <Navigate to="/login" replace />;
}

function IndexRoute() {
  const { isAuthenticated, user } = useAuthStore();
  if (isAuthenticated && user) return <Navigate to="/dashboard" replace />;
  return <HomePage />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <BrowserRouter>
          <Toaster position="top-right" />
          <AuthGuard>
            <IdleTimeoutHandler>
              <Suspense fallback={<PageSkeleton />}>
                <Routes>
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<LoginPage />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/landing" element={<HomePage />} />
                  <Route path="/" element={<IndexRoute />} />
                  <Route element={
                    <ProtectedRoute>
                      <Layout />
                    </ProtectedRoute>
                  }>
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="transactions" element={<Transactions />} />
                    <Route path="transfers" element={<Transfers />} />
                    <Route path="accounts" element={<Accounts />} />
                    <Route path="deposits" element={<Deposits />} />
                    <Route path="ai-chat" element={<AIChat />} />
                    <Route path="chat" element={<Navigate to="/ai-chat" replace />} />
                    <Route path="profile" element={<Profile />} />
                    <Route path="admin" element={<Admin />} />
                    <Route path="*" element={<NotFound />} />
                  </Route>
                </Routes>
              </Suspense>
            </IdleTimeoutHandler>
          </AuthGuard>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

function AuthGuard({ children }: { children: React.ReactNode }) {
  const [isValidating, setIsValidating] = useState(true);
  const { token, logout, isAuthenticated } = useAuthStore();

  useEffect(() => {
    const validateToken = async () => {
      // Skip validation if already authenticated and token exists
      if (isAuthenticated && token) {
        setIsValidating(false);
        return;
      }
      
      if (!token) {
        setIsValidating(false);
        return;
      }

      try {
        await api.get('/v1/user/account/bank');
        setIsValidating(false);
      } catch (error: any) {
        if (error.response?.status === 401 || error.response?.status === 403) {
          logout();
        }
        setIsValidating(false);
      }
    };

    validateToken();
  }, []); // Only run once on mount, not on every token change

  if (isValidating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-text-secondary text-sm">Verifying your session...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

const IDLE_TIMEOUT = 30 * 60 * 1000;

function IdleTimeoutHandler({ children }: { children: React.ReactNode }) {
  const [lastActivity, setLastActivity] = useState(Date.now());
  const { logout, isAuthenticated } = useAuthStore();

  const resetActivity = useCallback(() => {
    setLastActivity(Date.now());
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;

    window.addEventListener('mousemove', resetActivity);
    window.addEventListener('keypress', resetActivity);
    window.addEventListener('scroll', resetActivity);
    window.addEventListener('click', resetActivity);

    const interval = setInterval(() => {
      const idleTime = Date.now() - lastActivity;
      if (idleTime >= IDLE_TIMEOUT) {
        logout();
        window.location.href = '/login?session=idle';
      }
    }, 60 * 1000);

    return () => {
      window.removeEventListener('mousemove', resetActivity);
      window.removeEventListener('keypress', resetActivity);
      window.removeEventListener('scroll', resetActivity);
      window.removeEventListener('click', resetActivity);
      clearInterval(interval);
    };
  }, [lastActivity, logout, isAuthenticated, resetActivity]);

  return <>{children}</>;
}

export default App;
