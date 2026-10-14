import { Search, Bell } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import styles from './AppHeader.module.css';

export const AppHeader = () => {
  const { user } = useAuthStore();

  const userInitials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'LL';

  return (
    <header className={styles.header}>
      {/* Search Bar */}
      <div className={styles.searchWrapper}>
        <Search size={16} color="var(--text-secondary)" />
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Search cases, files, or reports..."
          aria-label="Global search"
        />
      </div>

      {/* Right Actions */}
      <div className={styles.actions}>
        <button
          type="button"
          className={styles.iconBtn}
          title="Notifications"
          aria-label="Notifications"
        >
          <Bell size={18} />
          <span className={styles.badgeDot} />
        </button>

        <div className={styles.divider} />

        <div className={styles.userBadge}>
          <div className={styles.userAvatar}>{userInitials}</div>
          <span className={styles.userTitle}>{user?.name?.split(' ')[0] || 'Counsel'}</span>
        </div>
      </div>
    </header>
  );
};
