import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { signInSchema, type SignInFormData } from '../schemas/authSchemas';
import { api } from '../../../api/client';
import { useAuthStore } from '../../../stores/authStore';
import { RiMailLine, RiLockPasswordLine } from 'react-icons/ri';

interface SignInFormProps {
  onSuccess: () => void;
}

export function SignInForm({ onSuccess }: SignInFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = async (data: SignInFormData) => {
    setIsLoading(true);
    try {
      const res = await api.post('/v1/auth/login', {
        email: data.email,
        password: data.password,
      });
      const { token, user } = res.data.data;

      if (!token || !user) {
        toast.error('Invalid response from server');
        return;
      }

      login(token, user);
      toast.success('Login successful!');
      // Navigate directly to ensure redirect
      window.location.href = '/dashboard';
    } catch (err: any) {
      if (err.isNetworkError) {
        toast.error(err.message, { duration: 5000 });
      } else if (err.response?.status === 403) {
        toast.error('Invalid password. Please try again.');
      } else if (err.response?.status === 404) {
        toast.error('Account not found. Please register first.');
      } else if (err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error('Login failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div>
        <h2 className="text-3xl font-extrabold text-text-primary tracking-tight">Sign In</h2>
        <p className="text-sm text-text-secondary mt-1">
          Welcome back! Access your accounts and telemetry
        </p>
      </div>

      <div className="space-y-1.5 mt-2">
        <label className="text-xs font-semibold text-text-secondary">Email Address</label>
        <div className="relative">
          <RiMailLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-tertiary text-base pointer-events-none" />
          <input
            type="email"
            placeholder="yourname@domain.com"
            aria-label="Email address"
            {...register('email')}
            className="input-field pl-10 text-sm"
          />
        </div>
        {errors.email && <p className="text-danger-500 text-xs mt-1">{errors.email.message}</p>}
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-text-secondary">Password</label>
        <div className="relative">
          <RiLockPasswordLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-tertiary text-base pointer-events-none" />
          <input
            type="password"
            placeholder="••••••••••••"
            aria-label="Password"
            {...register('password')}
            className="input-field pl-10 text-sm"
          />
        </div>
        {errors.password && <p className="text-danger-500 text-xs mt-1">{errors.password.message}</p>}
      </div>

      <div className="flex items-center justify-between pt-1">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            {...register('rememberMe')}
            className="w-4 h-4 rounded border-border accent-[#9067A7] cursor-pointer"
          />
          <span className="text-xs font-medium text-text-secondary">Remember me</span>
        </label>
        <a href="/forgot-password" className="text-xs font-semibold text-[#CF9CCD] hover:text-white transition-colors">
          Forgot password?
        </a>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="btn-primary w-full py-3.5 text-sm font-bold mt-2"
      >
        {isLoading ? 'Authenticating...' : 'Sign In'}
      </button>
    </form>
  );
}
