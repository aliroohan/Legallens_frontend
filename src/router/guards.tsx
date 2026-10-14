import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { PageSpinner } from '../components/ui/Spinner';
import { PageLayout } from '../components/layout/PageLayout';

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

  if (user?.barIdStatus === 'pending') {
    return <Navigate to="/auth/verification-pending" replace />;
  }
  if (user?.barIdStatus === 'rejected') {
    return <Navigate to="/auth/verification-failed" replace />;
  }

  return <PageLayout />;
};

/**
 * GuestRoute — redirects authenticated + verified users away from auth pages.
 */
export const GuestRoute = () => {
  const { isAuthenticated, isLoading, user } = useAuthStore();

  if (isLoading) return <PageSpinner />;

  if (isAuthenticated) {
    if (user?.barIdStatus === 'pending') {
      return <Navigate to="/auth/verification-pending" replace />;
    }
    if (user?.barIdStatus === 'rejected') {
      return <Navigate to="/auth/verification-failed" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};
