import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Eye, EyeOff, KeyRound } from 'lucide-react';
import { AuthLayout } from '../../components/layout/AuthLayout';
import { InputField } from '../../components/ui/InputField';
import { Button } from '../../components/ui/Button';
import { authApi } from '../../api/auth.api';
import styles from './AuthPages.module.css';

const resetSchema = z
  .object({
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(8, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type ResetFormData = z.infer<typeof resetSchema>;

export const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetFormData>({
    resolver: zodResolver(resetSchema),
  });

  const mutation = useMutation({
    mutationFn: (data: ResetFormData) =>
      authApi.resetPassword({
        token,
        password: data.password,
        confirmPassword: data.confirmPassword,
      }),
    onSuccess: () => {
      navigate('/auth/password-updated');
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      const message = error.response?.data?.message ?? 'Failed to reset password. Link may be invalid or expired.';
      toast.error(message);
    },
  });

  const onSubmit = (data: ResetFormData) => {
    if (!token) {
      toast.error('Invalid or missing reset token.');
      return;
    }
    mutation.mutate(data);
  };

  return (
    <AuthLayout>
      <div className={styles.container}>
        <div className={styles.header}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <KeyRound size={22} color="var(--sage-dark)" />
          </div>
          <h2 className={styles.title}>Set New Password</h2>
          <p className={styles.subtitle}>
            Your new password must be at least 8 characters long.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form} noValidate>
          <InputField
            id="new-password"
            label="New Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Minimum 8 characters"
            autoComplete="new-password"
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

          <InputField
            id="confirm-password"
            label="Confirm Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Re-enter your new password"
            autoComplete="new-password"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            isLoading={mutation.isPending}
          >
            Update Password
          </Button>
        </form>
      </div>
    </AuthLayout>
  );
};
