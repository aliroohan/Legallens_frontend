import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { ArrowLeft } from 'lucide-react';
import { AuthLayout } from '../../components/layout/AuthLayout';
import { InputField } from '../../components/ui/InputField';
import { Button } from '../../components/ui/Button';
import { authApi } from '../../api/auth.api';
import styles from './AuthPages.module.css';

const forgotSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type ForgotFormData = z.infer<typeof forgotSchema>;

export const ForgotPassword = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotFormData>({
    resolver: zodResolver(forgotSchema),
  });

  const mutation = useMutation({
    mutationFn: (data: ForgotFormData) => authApi.forgotPassword(data),
    onSuccess: () => {
      navigate('/auth/reset-email-sent');
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      const message = error.response?.data?.message ?? 'Failed to send reset link.';
      toast.error(message);
    },
  });

  const onSubmit = (data: ForgotFormData) => {
    mutation.mutate(data);
  };

  return (
    <AuthLayout>
      <div className={styles.container}>
        <Link
          to="/auth/signin"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            color: 'var(--text-secondary)',
            fontSize: 'var(--text-sm)',
            textDecoration: 'none',
            marginBottom: 'var(--space-2)',
          }}
        >
          <ArrowLeft size={16} /> Back to Sign In
        </Link>

        <div className={styles.header}>
          <h2 className={styles.title}>Forgot Password</h2>
          <p className={styles.subtitle}>
            Enter your registered email address and we'll send you a secure link to reset your password.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form} noValidate>
          <InputField
            id="forgot-email"
            label="Email Address"
            type="email"
            placeholder="lawyer@firm.com"
            autoComplete="email"
            error={errors.email?.message}
            {...register('email')}
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            isLoading={mutation.isPending}
          >
            Send Reset Link
          </Button>
        </form>
      </div>
    </AuthLayout>
  );
};
