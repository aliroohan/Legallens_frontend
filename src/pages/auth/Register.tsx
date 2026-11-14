import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, Info } from 'lucide-react';
import { AuthLayout } from '../../components/layout/AuthLayout';
import { InputField } from '../../components/ui/InputField';
import { Button } from '../../components/ui/Button';
import { useRegisterIndependent } from '../../hooks/auth/useRegister';
import styles from './AuthPages.module.css';

const independentSchema = z.object({
  name: z.string().min(2, 'Full name is required'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  barId: z.string().min(3, 'Valid Bar Council ID is required'),
});

type IndependentFormData = z.infer<typeof independentSchema>;

export const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const registerIndependent = useRegisterIndependent();
  const form = useForm<IndependentFormData>({ resolver: zodResolver(independentSchema) });

  return (
    <AuthLayout>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Create Account</h2>
          <p className={styles.subtitle}>Register as an independent lawyer. Firm accounts are created by a platform administrator.</p>
        </div>

        <div className={styles.infoBox}>
          <Info size={18} style={{ flexShrink: 0, marginTop: '2px', color: 'var(--sage-mid)' }} />
          <span>Independent lawyer accounts require Bar Council ID verification before workspace access is activated.</span>
        </div>

        <form onSubmit={form.handleSubmit((data) => registerIndependent.mutate(data))} className={styles.form} noValidate>
          <InputField id="ind-name" label="Full Name" placeholder="Adv. Sarah Jenkins" autoComplete="name" error={form.formState.errors.name?.message} {...form.register('name')} />
          <InputField id="ind-email" label="Email Address" type="email" placeholder="sarah.jenkins@law.com" autoComplete="email" error={form.formState.errors.email?.message} {...form.register('email')} />
          <InputField id="ind-barId" label="Bar Council ID / License Number" placeholder="e.g. BC-12345/2020" error={form.formState.errors.barId?.message} {...form.register('barId')} />
          <InputField
            id="ind-password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Minimum 8 characters"
            autoComplete="new-password"
            error={form.formState.errors.password?.message}
            rightElement={
              <button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Hide password' : 'Show password'} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex' }}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            }
            {...form.register('password')}
          />
          <Button type="submit" variant="primary" size="lg" fullWidth isLoading={registerIndependent.isPending}>
            Register as Independent Lawyer
          </Button>
        </form>

        <div className={styles.footer}>
          Already have an account?
          <Link to="/auth/signin" className={styles.footerLink}>Sign In</Link>
        </div>
      </div>
    </AuthLayout>
  );
};
