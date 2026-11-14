import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Search, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { notificationsApi } from '../../api/notifications.api';
import styles from './AppHeader.module.css';

export const AppHeader = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const notifications = useQuery({
    queryKey: ['notifications'],
    queryFn: notificationsApi.list,
    refetchInterval: 15000,
  });
  const markRead = useMutation({
    mutationFn: notificationsApi.markRead,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });
  const unread = (notifications.data ?? []).filter((item) => !item.read).length;

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
        <div style={{ position: 'relative' }}>
          <button
            type="button"
            className={styles.iconBtn}
            title="Notifications"
            aria-label="Notifications"
            onClick={() => setOpen((value) => !value)}
          >
            <Bell size={18} />
            {unread > 0 && <span className={styles.badgeDot} />}
          </button>
          {open && (
            <div style={{ position: 'absolute', right: 0, top: '120%', width: 320, background: 'var(--surface-white)', border: '1px solid var(--border)', borderRadius: 12, padding: 12, zIndex: 20, boxShadow: 'var(--shadow-md)' }}>
              {(notifications.data ?? []).length === 0 && <p style={{ margin: 0, color: 'var(--text-secondary)' }}>No notifications.</p>}
              {(notifications.data ?? []).slice(0, 8).map((item) => (
                <button
                  key={item.notificationId}
                  type="button"
                  onClick={() => {
                    if (!item.read) markRead.mutate(item.notificationId);
                    if (item.caseId && user?.role !== 'super_admin') navigate(`/cases/${item.caseId}`);
                    setOpen(false);
                  }}
                  style={{ display: 'block', width: '100%', textAlign: 'left', background: 'transparent', border: 0, padding: '8px 0', cursor: 'pointer' }}
                >
                  <strong>{item.title}</strong>
                  <div style={{ color: 'var(--text-secondary)', fontSize: 12 }}>{item.message}</div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className={styles.divider} />

        <div className={styles.userBadge}>
          <div className={styles.userAvatar}>{userInitials}</div>
          <span className={styles.userTitle}>{user?.name?.split(' ')[0] || 'Counsel'}</span>
        </div>
      </div>
    </header>
  );
};
