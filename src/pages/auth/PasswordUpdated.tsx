import { Link } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { AuthLayout } from '../../components/layout/AuthLayout';
import { Button } from '../../components/ui/Button';
import styles from './AuthPages.module.css';

export const PasswordUpdated = () => {
  return (
    <AuthLayout>
      <div className={styles.stateCard}>
        <div className={`${styles.iconCircle} ${styles.iconSuccess}`}>
          <CheckCircle2 size={36} />
        </div>

        <div className={styles.header}>
          <h2 className={styles.title} style={{ fontSize: 'var(--text-2xl)' }}>
            Password Updated
          </h2>
          <p className={styles.subtitle}>
            Your password has been changed successfully. You can now log into your LegalLens account.
          </p>
        </div>

        <Link to="/auth/signin" style={{ width: '100%', textDecoration: 'none' }}>
          <Button variant="primary" size="lg" fullWidth>
            Sign In with New Password
          </Button>
        </Link>
      </div>
    </AuthLayout>
  );
};
