import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { AuthLayout } from '../../components/layout/AuthLayout';
import { InputField } from '../../components/ui/InputField';
import { Button } from '../../components/ui/Button';
import { useLogin } from '../../hooks/auth/useLogin';
import styles from './AuthPages.module.css';

const signInSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type SignInFormData = z.infer<typeof signInSchema>;

export const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const loginMutation = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = (data: SignInFormData) => {
    loginMutation.mutate(data);
  };

  return (
    <AuthLayout>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Welcome Back</h2>
          <p className={styles.subtitle}>
            Sign in to access your digital evidence workspace
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form} noValidate>
          <InputField
            id="email"
            label="Email Address"
            type="email"
            placeholder="lawyer@firm.com"
            autoComplete="email"
            error={errors.email?.message}
            {...register('email')}
          />

          <InputField
            id="password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••••••"
            autoComplete="current-password"
            error={errors.password?.message}
            rightElement={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  padding: 0,
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            }
            {...register('password')}
          />

          <div className={styles.optionsRow}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldCheck size={16} color="var(--sage-mid)" />
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                Encrypted Session
              </span>
            </div>
            <Link to="/auth/forgot-password" className={styles.forgotLink}>
              Forgot password?
            </Link>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            isLoading={loginMutation.isPending}
          >
            Sign In
          </Button>
        </form>

        <div className={styles.footer}>
          Don't have an account?
          <Link to="/auth/register" className={styles.footerLink}>
            Register
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
};
