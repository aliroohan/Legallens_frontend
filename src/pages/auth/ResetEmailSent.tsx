import { Link } from 'react-router-dom';
import { MailCheck } from 'lucide-react';
import { AuthLayout } from '../../components/layout/AuthLayout';
import { Button } from '../../components/ui/Button';
import styles from './AuthPages.module.css';

export const ResetEmailSent = () => {
  return (
    <AuthLayout>
      <div className={styles.stateCard}>
        <div className={`${styles.iconCircle} ${styles.iconSuccess}`}>
          <MailCheck size={32} />
        </div>

        <div className={styles.header}>
          <h2 className={styles.title} style={{ fontSize: 'var(--text-2xl)' }}>
            Check Your Inbox
          </h2>
          <p className={styles.subtitle}>
            We've sent a password reset link to your registered email address. The link will expire in 1 hour.
          </p>
        </div>

        <div className={styles.infoBox} style={{ width: '100%', textAlign: 'left' }}>
          <span>
            Didn't receive the email? Check your spam folder or try requesting another link.
          </span>
        </div>

        <Link to="/auth/signin" style={{ width: '100%', textDecoration: 'none' }}>
          <Button variant="primary" size="lg" fullWidth>
            Return to Sign In
          </Button>
        </Link>
      </div>
    </AuthLayout>
  );
};
