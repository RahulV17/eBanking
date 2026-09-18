import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Mail, KeyRound, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '../api/client';

type Step = 'email' | 'otp' | 'reset' | 'success';

export default function ForgotPassword() {
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.patch(`/v1/auth/forgot-password/${email}`);
      toast.success('If an account exists for this email, an OTP has been sent.');
      setStep('otp');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast.error('Enter valid 6-digit OTP');
      return;
    }
    setStep('reset');
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setIsLoading(true);
    try {
      await api.patch('/v1/auth/reset-password', { email, otp: parseInt(otp), password });
      toast.success('Password reset successful!');
      setStep('success');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center overflow-hidden login-bg py-10 px-4">
      {/* Ambient Lighting Blooms matching Landing Page */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#9067A7]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#FF7A29]/10 rounded-full blur-3xl pointer-events-none" />

      {step === 'success' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-[#15181F] border border-white/12 shadow-[0_30px_60px_-12px_rgba(0,0,0,0.65)] rounded-3xl p-8 w-full max-w-md text-center backdrop-blur-xl relative z-10"
        >
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 className="text-emerald-400" size={32} />
          </div>
          <h2 className="text-2xl font-black mb-2 text-text-primary">Password Reset!</h2>
          <p className="text-sm text-text-secondary mb-6">
            Your security credentials have been successfully updated.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            <ArrowLeft size={16} />
            <span>Back to Sign In</span>
          </button>
        </motion.div>
      )}

      {step === 'reset' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-[#15181F] border border-white/12 shadow-[0_30px_60px_-12px_rgba(0,0,0,0.65)] rounded-3xl p-8 w-full max-w-md backdrop-blur-xl relative z-10"
        >
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-[#9067A7]/20 border border-[#9067A7]/40 flex items-center justify-center mx-auto mb-4">
              <KeyRound className="text-[#CF9CCD]" size={28} />
            </div>
            <h2 className="text-2xl font-black text-text-primary">Set New Password</h2>
            <p className="text-xs text-text-secondary mt-1">Create a strong password for your account</p>
          </div>
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-text-secondary">New Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field text-sm mt-1"
                placeholder="Enter new password"
                required
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-text-secondary">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input-field text-sm mt-1"
                placeholder="Confirm new password"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full mt-2"
            >
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        </motion.div>
      )}

      {step === 'otp' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-[#15181F] border border-white/12 shadow-[0_30px_60px_-12px_rgba(0,0,0,0.65)] rounded-3xl p-8 w-full max-w-md backdrop-blur-xl relative z-10"
        >
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-[#9067A7]/20 border border-[#9067A7]/40 flex items-center justify-center mx-auto mb-4">
              <KeyRound className="text-[#CF9CCD]" size={28} />
            </div>
            <h2 className="text-2xl font-black text-text-primary">Verify OTP</h2>
            <p className="text-xs text-text-secondary mt-1">Enter the 6-digit OTP sent to <strong className="text-text-primary">{email}</strong></p>
          </div>
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <input
              type="text"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              className="w-full text-center text-3xl font-black tracking-widest py-3 border border-white/12 rounded-xl focus:outline-none focus:border-[#9067A7] focus:ring-2 focus:ring-[#9067A7]/20 bg-[#12141A] text-text-primary"
              placeholder="000000"
              required
            />
            <button
              type="submit"
              disabled={isLoading || otp.length !== 6}
              className="btn-primary w-full"
            >
              {isLoading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </form>
          <button
            onClick={() => setStep('email')}
            className="w-full mt-4 text-xs font-semibold text-[#CF9CCD] hover:text-white transition-colors flex items-center justify-center gap-1"
          >
            ← Back to email input
          </button>
        </motion.div>
      )}

      {step === 'email' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-[#15181F] border border-white/12 shadow-[0_30px_60px_-12px_rgba(0,0,0,0.65)] rounded-3xl p-8 w-full max-w-md backdrop-blur-xl relative z-10"
        >
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-[#9067A7]/20 border border-[#9067A7]/40 flex items-center justify-center mx-auto mb-4">
              <Shield className="text-[#CF9CCD]" size={28} />
            </div>
            <h1 className="text-2xl font-black text-text-primary">Reset Password</h1>
            <p className="text-xs text-text-secondary mt-1">
              Enter your verified email to receive an authentication code
            </p>
          </div>
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-tertiary" size={16} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field pl-10 text-sm"
                placeholder="yourname@domain.com"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full"
            >
              {isLoading ? 'Sending OTP...' : 'Send Verification OTP'}
            </button>
          </form>
          <Link
            to="/login"
            className="w-full mt-5 text-xs font-semibold text-[#CF9CCD] hover:text-white transition-colors flex items-center justify-center gap-1.5"
          >
            <ArrowLeft size={14} />
            <span>Back to Sign In</span>
          </Link>
        </motion.div>
      )}
    </div>
  );
}
