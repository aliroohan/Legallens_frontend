import type { User } from '../types';

export function homePath(user?: Pick<User, 'role' | 'barIdStatus'> | null): string {
  if (!user) return '/auth/signin';
  if (user.role === 'lawyer' && user.barIdStatus === 'pending') return '/auth/verification-pending';
  if (user.role === 'lawyer' && user.barIdStatus === 'rejected') return '/auth/verification-failed';
  if (user.role === 'super_admin') return '/admin';
  if (user.role === 'org_admin') return '/org';
  return '/dashboard';
}

export function apiErrorMessage(error: unknown, fallback: string): string {
  const data = (error as { response?: { data?: { message?: string; error?: { message?: string } } } })?.response?.data;
  return data?.error?.message || data?.message || fallback;
}
