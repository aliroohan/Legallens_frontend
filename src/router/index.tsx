import { createBrowserRouter, Navigate } from 'react-router-dom';
import { PrivateRoute, VerifiedRoute, GuestRoute } from './guards';

// Auth pages
import { SignIn } from '../pages/auth/SignIn';
import { Register } from '../pages/auth/Register';
import { ForgotPassword } from '../pages/auth/ForgotPassword';
import { ResetEmailSent } from '../pages/auth/ResetEmailSent';
import { ResetPassword } from '../pages/auth/ResetPassword';
import { PasswordUpdated } from '../pages/auth/PasswordUpdated';
import { VerificationPending } from '../pages/auth/VerificationPending';
import { VerificationFailed } from '../pages/auth/VerificationFailed';

// Lawyer workspace pages
import { Dashboard } from '../pages/lawyer/Dashboard';
import { Cases } from '../pages/lawyer/Cases';
import { CreateCase } from '../pages/lawyer/CreateCase';
import { CaseWorkspace } from '../pages/lawyer/CaseWorkspace';

export const router = createBrowserRouter([
  // ── Root redirect ───────────────────────────────────────────
  {
    index: true,
    element: <Navigate to="/auth/signin" replace />,
  },

  // ── Auth routes (guest only) ────────────────────────────────
  {
    path: '/auth',
    element: <GuestRoute />,
    children: [
      { index: true, element: <Navigate to="/auth/signin" replace /> },
      { path: 'signin', element: <SignIn /> },
      { path: 'register', element: <Register /> },
      { path: 'forgot-password', element: <ForgotPassword /> },
      { path: 'reset-email-sent', element: <ResetEmailSent /> },
      { path: 'reset-password', element: <ResetPassword /> },
      { path: 'password-updated', element: <PasswordUpdated /> },
    ],
  },

  // ── Semi-protected: authenticated but awaiting verification ─
  {
    path: '/auth',
    element: <PrivateRoute />,
    children: [
      { path: 'verification-pending', element: <VerificationPending /> },
      { path: 'verification-failed', element: <VerificationFailed /> },
    ],
  },

  // ── Protected + verified lawyer workspace ───────────────────
  {
    path: '/',
    element: <VerifiedRoute />,
    children: [
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'cases', element: <Cases /> },
      { path: 'cases/new', element: <CreateCase /> },
      { path: 'cases/:caseId', element: <CaseWorkspace /> },
      // Later phases
      // { path: 'evidence', element: <EvidenceLibrary /> },
      // { path: 'reports', element: <ReportsLibrary /> },
      // { path: 'audit', element: <AuditTrail /> },
      // { path: 'settings', element: <LawyerSettings /> },
      // { path: 'notifications', element: <Notifications /> },
    ],
  },

  // ── 404 fallback ─────────────────────────────────────────────
  {
    path: '*',
    element: <Navigate to="/auth/signin" replace />,
  },
]);
