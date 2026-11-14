import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { PageSpinner } from '../components/ui/Spinner';
import { PageLayout } from '../components/layout/PageLayout';
import { homePath } from '../utils/homePath';

/**
 * PrivateRoute — redirects to /auth/signin if not authenticated.
 * Shows a page spinner while session restoration is in progress.
 */
export const PrivateRoute = () => {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) return <PageSpinner />;
  if (!isAuthenticated) return <Navigate to="/auth/signin" replace />;

  return <Outlet />;
};

/**
 * VerifiedRoute — wraps PrivateRoute; additionally enforces bar ID verification.
 * pending → /auth/verification-pending
 * rejected → /auth/verification-failed
 * verified → renders PageLayout shell with Outlet for protected pages
 */
export const VerifiedRoute = () => {
  const { isAuthenticated, isLoading, user } = useAuthStore();

  if (isLoading) return <PageSpinner />;
  if (!isAuthenticated) return <Navigate to="/auth/signin" replace />;

  if (user?.role === 'lawyer' && user.barIdStatus === 'pending') {
    return <Navigate to="/auth/verification-pending" replace />;
  }
  if (user?.role === 'lawyer' && user.barIdStatus === 'rejected') {
    return <Navigate to="/auth/verification-failed" replace />;
  }

  return (
    <PageLayout>
      <RoleShell />
    </PageLayout>
  );
};

const RoleShell = () => {
  const { user } = useAuthStore();
  const location = useLocation();
  const path = location.pathname;

  if (user?.role === 'super_admin' && !path.startsWith('/admin')) {
    return <Navigate to="/admin" replace />;
  }
  if (user?.role === 'org_admin' && (path.startsWith('/admin') || path === '/dashboard')) {
    return <Navigate to="/org" replace />;
  }
  if (user?.role === 'lawyer' && (path.startsWith('/admin') || path.startsWith('/org'))) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

/**
 * GuestRoute — redirects authenticated + verified users away from auth pages.
 */
export const GuestRoute = () => {
  const { isAuthenticated, isLoading, user } = useAuthStore();

  if (isLoading) return <PageSpinner />;

  if (isAuthenticated) {
    return <Navigate to={homePath(user)} replace />;
  }

  return <Outlet />;
};
