import type { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { AppHeader } from './AppHeader';
import styles from './PageLayout.module.css';

interface PageLayoutProps {
  children?: ReactNode;
}

export const PageLayout = ({ children }: PageLayoutProps) => {
  return (
    <div className={styles.layout}>
      <Sidebar />
      <div className={styles.mainArea}>
        <AppHeader />
        <main className={styles.content}>
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};
