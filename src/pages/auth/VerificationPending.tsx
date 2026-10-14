import { Clock, RefreshCw, LogOut } from 'lucide-react';
import { AuthLayout } from '../../components/layout/AuthLayout';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { useAuthStore } from '../../store/authStore';
import { useLogout } from '../../hooks/auth/useLogout';
import styles from './AuthPages.module.css';

export const VerificationPending = () => {
  const { user } = useAuthStore();
  const logout = useLogout();

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <AuthLayout>
      <div className={styles.stateCard}>
        <div className={`${styles.iconCircle} ${styles.iconWarning}`}>
          <Clock size={36} />
        </div>

        <div className={styles.header}>
          <h2 className={styles.title} style={{ fontSize: 'var(--text-2xl)' }}>
            Verification in Progress
          </h2>
          <p className={styles.subtitle}>
            Your Bar Council credentials and identity are currently being verified by our compliance team.
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
            <div className={styles.statusRow}>
              <span className={styles.statusLabel}>Role</span>
              <span className={styles.statusValue}>
                {user.role === 'org_admin' ? 'Organization Admin' : 'Independent Lawyer'}
              </span>
            </div>
            <div className={styles.statusRow} style={{ alignItems: 'center' }}>
              <span className={styles.statusLabel}>Status</span>
              <StatusBadge label="Pending Review" tone="warning" />
            </div>
          </div>
        )}

        <div className={styles.infoBox} style={{ width: '100%', textAlign: 'left' }}>
          <span>
            Verifications are typically completed within 24-48 business hours. You will receive an email once your workspace is unlocked.
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', width: '100%' }}>
          <Button
            variant="secondary"
            size="md"
            fullWidth
            onClick={handleRefresh}
            icon={<RefreshCw size={16} />}
          >
            Check Status
          </Button>

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
