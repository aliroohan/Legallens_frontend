import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, Info } from 'lucide-react';
import { AuthLayout } from '../../components/layout/AuthLayout';
import { InputField } from '../../components/ui/InputField';
import { Button } from '../../components/ui/Button';
import { useRegisterIndependent, useRegisterOrgAdmin } from '../../hooks/auth/useRegister';
import styles from './AuthPages.module.css';

type RegisterMode = 'independent' | 'org_admin';

const independentSchema = z.object({
  name: z.string().min(2, 'Full name is required'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  barId: z.string().min(3, 'Valid Bar Council ID is required'),
});

const orgAdminSchema = z.object({
  name: z.string().min(2, 'Admin name is required'),
  organizationName: z.string().min(2, 'Organization or firm name is required'),
  email: z.string().email('Please enter a valid work email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  barId: z.string().min(3, 'Admin Bar Council ID is required'),
});

type IndependentFormData = z.infer<typeof independentSchema>;
type OrgAdminFormData = z.infer<typeof orgAdminSchema>;

export const Register = () => {
  const [mode, setMode] = useState<RegisterMode>('independent');
  const [showPassword, setShowPassword] = useState(false);

  const registerIndependent = useRegisterIndependent();
  const registerOrgAdmin = useRegisterOrgAdmin();

  // Form for Independent Lawyer
  const independentForm = useForm<IndependentFormData>({
    resolver: zodResolver(independentSchema),
  });

  // Form for Org Admin
  const orgAdminForm = useForm<OrgAdminFormData>({
    resolver: zodResolver(orgAdminSchema),
  });

  const onIndependentSubmit = (data: IndependentFormData) => {
    registerIndependent.mutate(data);
  };

  const onOrgAdminSubmit = (data: OrgAdminFormData) => {
    registerOrgAdmin.mutate(data);
  };

  const isSubmitting = registerIndependent.isPending || registerOrgAdmin.isPending;

  return (
    <AuthLayout>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Create Account</h2>
          <p className={styles.subtitle}>
            Register for verified digital forensics access
          </p>
        </div>

        {/* Mode Selector */}
        <div className={styles.modeToggle} role="tablist" aria-label="Registration type">
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'independent'}
            className={`${styles.modeButton} ${mode === 'independent' ? styles.modeButtonActive : ''}`}
            onClick={() => setMode('independent')}
          >
            Independent Lawyer
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'org_admin'}
            className={`${styles.modeButton} ${mode === 'org_admin' ? styles.modeButtonActive : ''}`}
            onClick={() => setMode('org_admin')}
          >
            Organization Admin
          </button>
        </div>

        {/* Notice box */}
        <div className={styles.infoBox}>
          <Info size={18} style={{ flexShrink: 0, marginTop: '2px', color: 'var(--sage-mid)' }} />
          <span>
            {mode === 'independent'
              ? 'Independent lawyer accounts require Bar Council ID verification before workspace access is activated.'
              : 'Organization accounts and administrator credentials require Super Admin approval before member onboarding begins.'}
          </span>
        </div>

        {mode === 'independent' ? (
          <form
            onSubmit={independentForm.handleSubmit(onIndependentSubmit)}
            className={styles.form}
            noValidate
          >
            <InputField
              id="ind-name"
              label="Full Name"
              placeholder="Adv. Sarah Jenkins"
              autoComplete="name"
              error={independentForm.formState.errors.name?.message}
              {...independentForm.register('name')}
            />

            <InputField
              id="ind-email"
              label="Email Address"
              type="email"
              placeholder="sarah.jenkins@law.com"
              autoComplete="email"
              error={independentForm.formState.errors.email?.message}
              {...independentForm.register('email')}
            />

            <InputField
              id="ind-barId"
              label="Bar Council ID / License Number"
              placeholder="e.g. BC-12345/2020"
              hint="Required for legal authenticity and evidence custody"
              error={independentForm.formState.errors.barId?.message}
              {...independentForm.register('barId')}
            />

            <InputField
              id="ind-password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Minimum 8 characters"
              autoComplete="new-password"
              error={independentForm.formState.errors.password?.message}
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
              {...independentForm.register('password')}
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isSubmitting}
            >
              Register as Independent Lawyer
            </Button>
          </form>
        ) : (
          <form
            onSubmit={orgAdminForm.handleSubmit(onOrgAdminSubmit)}
            className={styles.form}
            noValidate
          >
            <InputField
              id="org-name"
              label="Administrator Full Name"
              placeholder="Managing Partner Name"
              autoComplete="name"
              error={orgAdminForm.formState.errors.name?.message}
              {...orgAdminForm.register('name')}
            />

            <InputField
              id="org-firmName"
              label="Law Firm / Organization Name"
              placeholder="e.g. Apex Legal Associates"
              error={orgAdminForm.formState.errors.organizationName?.message}
              {...orgAdminForm.register('organizationName')}
            />

            <InputField
              id="org-email"
              label="Work Email Address"
              type="email"
              placeholder="admin@apexlegal.com"
              autoComplete="email"
              error={orgAdminForm.formState.errors.email?.message}
              {...orgAdminForm.register('email')}
            />

            <InputField
              id="org-barId"
              label="Admin Bar Council ID"
              placeholder="e.g. BC-88712/2015"
              hint="Bar ID of the primary administrator or managing counsel"
              error={orgAdminForm.formState.errors.barId?.message}
              {...orgAdminForm.register('barId')}
            />

            <InputField
              id="org-password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Minimum 8 characters"
              autoComplete="new-password"
              error={orgAdminForm.formState.errors.password?.message}
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
              {...orgAdminForm.register('password')}
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isSubmitting}
            >
              Register Organization
            </Button>
          </form>
        )}

        <div className={styles.footer}>
          Already have an account?
          <Link to="/auth/signin" className={styles.footerLink}>
            Sign In
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
};
