import { useState } from 'react';
import { useAuthContext } from '@/core/auth/AuthContext';
import {
  signInWithEmail as signInWithEmailService,
  signUpWithEmail as signUpWithEmailService,
  signInWithGoogle as signInWithGoogleService,
} from '../services/authService';
import { parseApiError } from '@/core/utils/errorUtils';

export function useAuth() {
  const auth = useAuthContext();
  const [submitting, setSubmitting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  async function run(action: () => Promise<unknown>) {
    setSubmitting(true);
    setActionError(null);
    try {
      await action();
    } catch (err) {
      setActionError(parseApiError(err));
      throw err;
    } finally {
      setSubmitting(false);
    }
  }

  return {
    firebaseUser: auth.firebaseUser,
    backendUser: auth.backendUser,
    loading: auth.loading,
    error: auth.error,
    submitting,
    actionError,
    signInWithEmail: (email: string, password: string) =>
      run(() => signInWithEmailService(email, password)),
    signUpWithEmail: (name: string, email: string, password: string) =>
      run(() => signUpWithEmailService(name, email, password)),
    signInWithGoogle: () => run(() => signInWithGoogleService()),
    signOut: auth.signOut,
  };
}
