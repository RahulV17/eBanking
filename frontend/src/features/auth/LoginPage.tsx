import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SignInForm } from './components/SignInForm';
import { SignUpForm } from './components/SignUpForm';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Shield, Lock, ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';

type Mode = 'signin' | 'signup';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mode, setMode] = useState<Mode>(location.pathname === '/login' ? 'signin' : 'signup');
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    const reason = new URLSearchParams(location.search).get('session');
    if (reason === 'expired' || reason === 'idle') {
      toast.error(
        reason === 'idle'
          ? 'You were signed out for inactivity. Please sign in again.'
          : 'Session expired. Please sign in again.'
      );
      navigate('/login', { replace: true });
    }
  }, [location.search, navigate]);

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard');
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const timer = setTimeout(() => {
      import('../../pages/Dashboard');
      import('../../pages/Transactions');
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (isAuthenticated) return null;

  const handleSuccess = () => {
    navigate('/dashboard');
  };

  const toggleMode = () => {
    const nextMode = mode === 'signin' ? 'signup' : 'signin';
    setMode(nextMode);
    window.history.replaceState(null, '', nextMode === 'signin' ? '/login' : '/register');
  };

  return (
    <div className="min-h-screen w-full relative flex flex-col items-center justify-center overflow-hidden login-bg py-8 px-4 sm:px-6">
      {/* Ambient Lighting Blooms matching Landing Page */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#9067A7]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#FF7A29]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar with Return to Home */}
      <div className="w-full max-w-[1040px] flex items-center justify-between mb-6 z-20">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-text-secondary hover:text-white transition-colors px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 backdrop-blur-md"
        >
          <ArrowLeft size={14} />
          <span>Back to Home</span>
        </Link>
        <div className="flex items-center gap-2 text-xs font-semibold text-[#CF9CCD]">
          <Sparkles size={13} />
          <span>Infinite Wealth Architecture</span>
        </div>
      </div>

      {/* Centered Floating Luxury Card */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="auth-card"
      >
        {/* LEFT BRAND PANEL (42% width) */}
        <div className="auth-left-panel">
          {/* Subtle Ambient Vignette & Shield Mark */}
          <div className="flex items-center gap-2.5 mb-8 z-10">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#9067A7] to-[#5F3A76] flex items-center justify-center border border-white/20 shadow-[0_0_20px_rgba(144,103,167,0.4)]">
              <Shield size={20} className="text-white" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-white block leading-none">eBanking</span>
              <span className="text-[9px] font-bold tracking-[0.2em] text-[#CF9CCD] block mt-1 uppercase">Digital Platform</span>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-[#CF9CCD] mb-8 z-10">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Bank-Grade Institutional Security</span>
          </div>

          {/* Dynamic Content Switching */}
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.25 }}
              className="relative z-10 flex flex-col items-start gap-5"
            >
              {mode === 'signup' ? (
                <>
                  <h1 className="heading-main text-white font-extrabold tracking-tight">
                    Welcome<br />
                    <span className="bg-gradient-to-r from-white via-[#FFEBFE] to-[#CF9CCD] bg-clip-text text-transparent">
                      Back.
                    </span>
                  </h1>
                  <p className="text-body text-white/70 max-w-[280px]">
                    To manage your portfolios, initiate instant transfers, and monitor your 3D titanium card, sign in to your private vault.
                  </p>
                  <button
                    onClick={toggleMode}
                    className="mt-2 rounded-full px-7 py-3 font-bold text-sm bg-white text-[#0E1013] hover:bg-[#F3E8FF] shadow-[0_0_20px_rgba(255,255,255,0.25)] transition-all flex items-center gap-2 active:scale-95"
                  >
                    <span>Sign In to Portal</span>
                    <ArrowRight size={15} />
                  </button>
                </>
              ) : (
                <>
                  <h1 className="heading-main text-white font-extrabold tracking-tight">
                    Banking<br />
                    <span className="bg-gradient-to-r from-white via-[#FFEBFE] to-[#CF9CCD] bg-clip-text text-transparent">
                      Evolved.
                    </span>
                  </h1>
                  <p className="text-body text-white/70 max-w-[280px]">
                    Open your account in under 3 minutes. Unlock up to 8.5% APY fixed deposits and claim your proprietary 3D metal card.
                  </p>
                  <button
                    onClick={toggleMode}
                    className="mt-2 rounded-full px-7 py-3 font-bold text-sm bg-white text-[#0E1013] hover:bg-[#F3E8FF] shadow-[0_0_20px_rgba(255,255,255,0.25)] transition-all flex items-center gap-2 active:scale-95"
                  >
                    <span>Create Free Account</span>
                    <ArrowRight size={15} />
                  </button>
                </>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Subtext Watermark in Left Corner */}
          <div className="mt-auto pt-8 text-[11px] font-mono text-white/30 tracking-wider">
            SYSTEM VERSION 2.0 • 256-BIT AES
          </div>
        </div>

        {/* RIGHT FORM PANEL (58% width) */}
        <div className="auth-right-panel">
          {/* Form area */}
          <div className="flex-1 flex flex-col justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={mode}
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.25 }}
              >
                {mode === 'signup' ? (
                  <SignUpForm onSuccess={handleSuccess} />
                ) : (
                  <SignInForm onSuccess={handleSuccess} />
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Luxury Security Footer */}
          <div className="mt-auto pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-text-tertiary">
            <div className="flex items-center gap-1.5">
              <Lock size={13} className="text-emerald-400" />
              <span>256-Bit SSL Encrypted Vault</span>
            </div>
            <div className="flex items-center gap-4">
              <a href="#" className="hover:text-text-secondary transition-colors">Privacy</a>
              <span>•</span>
              <a href="#" className="hover:text-text-secondary transition-colors">Terms</a>
              <span>•</span>
              <a href="#" className="hover:text-text-secondary transition-colors">Compliance</a>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
