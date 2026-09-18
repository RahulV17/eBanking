import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { signUpSchema, type SignUpFormData } from '../schemas/authSchemas';
import { api } from '../../../api/client';

interface SignUpFormProps {
  onSuccess: () => void;
}

export function SignUpForm({ onSuccess }: SignUpFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'register' | 'otp'>('register');
  const [email, setEmail] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      mobile: '',
      dob: '',
      role: 'USER',
      password: '',
      confirmPassword: '',
      acceptTerms: false,
    },
  });

  const password = watch('password');

  const getPasswordStrength = (pwd: string) => {
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (/[A-Z]/.test(pwd)) strength++;
    if (/[a-z]/.test(pwd)) strength++;
    if (/[0-9]/.test(pwd)) strength++;
    if (/[^A-Za-z0-9]/.test(pwd)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(password || '');
  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-lime-500', 'bg-green-500'];
  const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Strong', 'Very Strong'];

  const onRegister = async (data: SignUpFormData) => {
    setIsLoading(true);
    try {
      const res = await api.post('/v1/auth/register', {
        name: `${data.firstName} ${data.lastName}`.trim(),
        email: data.email,
        mobile: data.mobile,
        dob: data.dob,
        password: data.password,
        role: 'USER',
      });
      toast.success(res.data.message || 'OTP sent to your email');
      setEmail(data.email);
      setStep('otp');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const onVerifyOtp = async (otp: string) => {
    setIsLoading(true);
    try {
      const res = await api.post('/v1/auth/verify-otp', {
        email,
        otp: parseInt(otp),
      });
      toast.success(res.data.message || 'Account created!');
      onSuccess();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Invalid OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;
    try {
      const res = await api.patch(`/v1/auth/resend-otp/${email}`);
      toast.success(res.data.message || 'OTP re-sent');
      setResendCooldown(60);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to resend OTP');
    }
  };

  if (step === 'otp') {
    return (
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-text-primary tracking-tight">Verify Identity</h2>
          <p className="text-sm text-text-secondary mt-1">
            Enter the 6-digit OTP sent to <strong className="text-text-primary">{email}</strong>
          </p>
        </div>
        <OtpInput onComplete={onVerifyOtp} loading={isLoading} />
        <ResendOtpButton cooldown={resendCooldown} onResend={handleResendOtp} setCooldown={setResendCooldown} />
        <button
          type="button"
          onClick={() => setStep('register')}
          className="text-sm font-semibold text-[#CF9CCD] hover:text-white transition-colors text-center mt-2"
        >
          ← Back to registration
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onRegister)} className="flex flex-col gap-4">
      <div>
        <h2 className="text-3xl font-extrabold text-text-primary tracking-tight">Create Account</h2>
        <p className="text-sm text-text-secondary mt-1">
          Open your private wealth account in seconds
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <input
          placeholder="First Name"
          aria-label="First name"
          {...register('firstName')}
          className="input-field px-4 py-3 text-[14px]"
         
        />
        <input
          placeholder="Last Name"
          aria-label="Last name"
          {...register('lastName')}
          className="input-field px-4 py-3 text-[14px]"
         
        />
      </div>
      {errors.firstName && <p className="text-danger-600 text-[12px]">{errors.firstName.message}</p>}
      {errors.lastName && <p className="text-danger-600 text-[12px]">{errors.lastName.message}</p>}

      <input
        type="email"
        placeholder="yourname@email.com"
        aria-label="Email address"
        {...register('email')}
        className="input-field px-4 py-3 text-[14px]"
       
      />
      {errors.email && <p className="text-danger-600 text-[12px]">{errors.email.message}</p>}

      <input
        type="tel"
        placeholder="Mobile Number"
        aria-label="Mobile number"
        {...register('mobile')}
        className="input-field px-4 py-3 text-[14px]"
       
      />
      {errors.mobile && <p className="text-danger-600 text-[12px]">{errors.mobile.message}</p>}

      <input
        type="text"
        placeholder="Date of Birth (DD-MM-YYYY)"
        aria-label="Date of birth"
        {...register('dob')}
        className="input-field px-4 py-3 text-[14px]"
       
      />
      {errors.dob && <p className="text-danger-600 text-[12px]">{errors.dob.message}</p>}

      <div>
        <input
          type="password"
          placeholder="Password"
          aria-label="Password"
          {...register('password')}
          className="input-field px-4 py-3 text-[14px]"
         
        />
        {errors.password && <p className="text-danger-600 text-[12px] mt-1">{errors.password.message}</p>}
        {password && (
          <div className="mt-2">
            <div className="flex gap-1 mb-1">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={`h-1 flex-1 rounded-full transition-colors ${
                    i < passwordStrength ? strengthColors[passwordStrength - 1] : 'bg-border'
                  }`}
                />
              ))}
            </div>
            <p className="text-[12px] text-text-secondary">
              {strengthLabels[passwordStrength - 1] || 'Enter password'}
            </p>
          </div>
        )}
      </div>

      <input
        type="password"
        placeholder="Confirm"
        aria-label="Confirm password"
        {...register('confirmPassword')}
        className="input-field px-4 py-3 text-[14px]"
       
      />
      {errors.confirmPassword && <p className="text-danger-600 text-[12px]">{errors.confirmPassword.message}</p>}

      <p className="text-[11px] text-text-tertiary text-center">
        Use 8 or more characters with a mix of letters, numbers & symbols (@ $ ! % * ? &)
      </p>

      <label className="flex items-center gap-2 text-xs text-text-secondary cursor-pointer select-none">
        <input
          type="checkbox"
          aria-label="Accept terms and conditions"
          {...register('acceptTerms')}
          className="w-4 h-4 accent-[#9067A7] cursor-pointer rounded"
        />
        <span>I accept the terms and conditions</span>
      </label>
      {errors.acceptTerms && <p className="text-danger-500 text-xs">{errors.acceptTerms.message}</p>}

      <button
        type="submit"
        disabled={isLoading}
        className="btn-primary w-full py-3.5 text-sm font-bold mt-2"
      >
        {isLoading ? 'Creating Account...' : 'Create Account'}
      </button>
    </form>
  );
}

function OtpInput({ onComplete, loading }: { onComplete: (otp: string) => void; loading: boolean }) {
  const [otp, setOtp] = useState('');

  const OTP_LENGTH = 6;

  const handleChange = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, OTP_LENGTH);
    setOtp(digits);
    if (digits.length === OTP_LENGTH) {
      onComplete(digits);
    }
  };

  return (
    <div className="flex gap-2.5 sm:gap-3 justify-center py-2">
      {[...Array(OTP_LENGTH)].map((_, i) => (
        <input
          key={i}
          type="text"
          maxLength={1}
          aria-label={`Digit ${i + 1} of 6`}
          value={otp[i] || ''}
          onChange={(e) => handleChange(otp.slice(0, i) + e.target.value + otp.slice(i + 1))}
          disabled={loading}
          className="w-11 sm:w-12 h-14 text-center text-2xl font-black rounded-xl border border-white/10 bg-surface-elevated text-text-primary focus:outline-none focus:border-[#9067A7] focus:ring-2 focus:ring-[#9067A7]/25 transition-all"
        />
      ))}
    </div>
  );
}

function ResendOtpButton({ cooldown, onResend, setCooldown }: { cooldown: number; onResend: () => void; setCooldown: React.Dispatch<React.SetStateAction<number>> }) {
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown, setCooldown]);

  return (
    <button
      type="button"
      onClick={onResend}
      disabled={cooldown > 0}
      className="text-xs font-semibold text-[#CF9CCD] hover:text-white transition-colors text-center disabled:opacity-40 disabled:cursor-not-allowed"
    >
      {cooldown > 0 ? `Resend OTP in ${cooldown}s` : 'Resend OTP'}
    </button>
  );
}
