import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Briefcase,
  Building2,
  LogOut,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useLogout } from '../../hooks/auth/useLogout';
import styles from './Sidebar.module.css';

const lawyerNav = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Cases', path: '/cases', icon: Briefcase },
];

const orgNav = [
  { label: 'Firm', path: '/org', icon: Building2 },
  { label: 'Cases', path: '/cases', icon: Briefcase },
];

const adminNav = [
  { label: 'Platform', path: '/admin', icon: Building2 },
];

export const Sidebar = () => {
  const { user } = useAuthStore();
  const logout = useLogout();

  const userInitials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'LL';

  return (
    <aside className={styles.sidebar}>
      <div className={styles.topSection}>
        {/* Brand */}
        <div className={styles.brand}>
          <svg width="26" height="30" viewBox="0 0 30 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="15" cy="15" r="14" stroke="#2F4F2F" strokeWidth="2.5"/>
            <circle cx="15" cy="15" r="8" stroke="#2F4F2F" strokeWidth="2"/>
            <line x1="15" y1="1" x2="15" y2="29" stroke="#2F4F2F" strokeWidth="2"/>
            <line x1="1" y1="15" x2="29" y2="15" stroke="#2F4F2F" strokeWidth="2"/>
            <line x1="15" y1="29" x2="15" y2="36" stroke="#2F4F2F" strokeWidth="2"/>
          </svg>
          <div className={styles.brandTextGroup}>
            <span className={styles.brandName}>Legalens</span>
            <span className={styles.workspaceBadge}>
              {user?.role === 'super_admin' ? 'Platform' : user?.role === 'org_admin' ? 'Organization' : 'Lawyer Workspace'}
            </span>
          </div>
        </div>

        {/* Firm or Practice Card */}
        <div className={styles.firmInfo}>
          <span className={styles.firmLabel}>Practice</span>
          <p className={styles.firmName}>
            {user?.organizationName || 'Independent Practice'}
          </p>
        </div>

        {/* Navigation */}
        <nav className={styles.nav} aria-label="Main Navigation">
          {(user?.role === 'super_admin' ? adminNav : user?.role === 'org_admin' ? orgNav : lawyerNav).map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `${styles.navItem} ${isActive ? styles.navItemActive : ''}`
                }
              >
                <Icon size={18} className={styles.navIcon} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* User profile & Logout */}
      <div className={styles.bottomSection}>
        <div className={styles.userCard}>
          <div className={styles.userInfo}>
            <div className={styles.userAvatar}>{userInitials}</div>
            <div className={styles.userNameGroup}>
              <span className={styles.userName} title={user?.name}>
                {user?.name || 'Lawyer'}
              </span>
              <span className={styles.userRole}>
                {user?.role === 'super_admin' ? 'Super Admin' : user?.role === 'org_admin' ? 'Org Admin' : 'Lawyer'}
              </span>
            </div>
          </div>
          <button
            type="button"
            className={styles.logoutBtn}
            onClick={() => logout.mutate()}
            title="Sign out"
            aria-label="Sign out"
            disabled={logout.isPending}
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
};
