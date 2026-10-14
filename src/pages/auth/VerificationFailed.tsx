import { AlertTriangle, LogOut, Mail } from 'lucide-react';
import { AuthLayout } from '../../components/layout/AuthLayout';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { useAuthStore } from '../../store/authStore';
import { useLogout } from '../../hooks/auth/useLogout';
import styles from './AuthPages.module.css';

export const VerificationFailed = () => {
  const { user } = useAuthStore();
  const logout = useLogout();

  return (
    <AuthLayout>
      <div className={styles.stateCard}>
        <div className={`${styles.iconCircle} ${styles.iconDanger}`}>
          <AlertTriangle size={36} />
        </div>

        <div className={styles.header}>
          <h2 className={styles.title} style={{ fontSize: 'var(--text-2xl)' }}>
            Verification Unsuccessful
          </h2>
          <p className={styles.subtitle}>
            We were unable to verify your Bar Council ID against official regulatory registries.
          </p>
        </div>

        {user && (
          <div className={styles.statusDetails}>
            <div className={styles.statusRow}>
              <span className={styles.statusLabel}>Account</span>
              <span className={styles.statusValue}>{user.name}</span>
            </div>
            <div className={styles.statusRow}>
              <span className={styles.statusLabel}>Email</span>
              <span className={styles.statusValue}>{user.email}</span>
            </div>
            <div className={styles.statusRow} style={{ alignItems: 'center' }}>
              <span className={styles.statusLabel}>Status</span>
              <StatusBadge label="Rejected" tone="danger" />
            </div>
          </div>
        )}

        <div className={styles.infoBox} style={{ width: '100%', textAlign: 'left' }}>
          <span>
            If you believe this is an error or your details were entered incorrectly, please contact LegalLens Support at <strong>support@legallens.com</strong> with your credentials.
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', width: '100%' }}>
          <a
            href="mailto:support@legallens.com"
            style={{ width: '100%', textDecoration: 'none' }}
          >
            <Button
              variant="secondary"
              size="md"
              fullWidth
              icon={<Mail size={16} />}
            >
              Contact Support
            </Button>
          </a>

          <Button
            variant="ghost"
            size="md"
            fullWidth
            onClick={() => logout.mutate()}
            isLoading={logout.isPending}
            icon={<LogOut size={16} />}
          >
            Sign Out
          </Button>
        </div>
      </div>
    </AuthLayout>
  );
};
