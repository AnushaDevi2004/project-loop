'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/lib/auth-context';
import { demoCredentials } from '@/lib/mock-data';
import { toast } from 'sonner';

const loginSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

type LoginValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginValues>({
    defaultValues: { email: 'admin@acme.com', password: 'demo1234' },
  });

  const onSubmit = async (values: LoginValues) => {
    setSubmitting(true);
    try {
      await login(values.email, values.password);
      toast.success('Welcome back to LOOP!');
      router.push('/dashboard');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  const fillDemo = (email: string) => {
    setValue('email', email);
    setValue('password', 'demo1234');
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Welcome back</h1>
        <p className="mt-1 text-sm text-slate-500">
          Sign in to your LOOP workspace to continue.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@company.com"
            {...register('email')}
          />
          {errors.email && (
            <p className="text-xs text-rose-600">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link
              href="#"
              className="text-xs font-medium text-sky-600 hover:text-sky-700"
            >
              Forgot password?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            {...register('password')}
          />
          {errors.password && (
            <p className="text-xs text-rose-600">{errors.password.message}</p>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox id="remember" />
          <Label htmlFor="remember" className="text-sm font-normal text-slate-600">
            Remember me for 30 days
          </Label>
        </div>

        <Button
          type="submit"
          className="w-full bg-sky-600 hover:bg-sky-700"
          disabled={submitting}
        >
          {submitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            'Sign in'
          )}
        </Button>
      </form>

      <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-4">
        <p className="text-xs font-semibold text-slate-700">Demo credentials</p>
        <p className="mt-1 text-xs text-slate-500">Password for all: demo1234</p>
        <div className="mt-3 space-y-1.5">
          {demoCredentials.map((c) => (
            <button
              key={c.email}
              type="button"
              onClick={() => fillDemo(c.email)}
              className="flex w-full items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs transition-colors hover:border-sky-300 hover:bg-sky-50"
            >
              <span className="font-medium text-slate-700">{c.email}</span>
              <span className="text-slate-400">{c.role}</span>
            </button>
          ))}
        </div>
      </div>

      <p className="mt-6 text-center text-sm text-slate-500">
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="font-medium text-sky-600 hover:text-sky-700">
          Sign up
        </Link>
      </p>
    </div>
  );
}
