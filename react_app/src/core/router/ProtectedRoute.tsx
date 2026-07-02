import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthContext } from '@/core/auth/AuthContext';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { firebaseUser, loading } = useAuthContext();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!firebaseUser) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
