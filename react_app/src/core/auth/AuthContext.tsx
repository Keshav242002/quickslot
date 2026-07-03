import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { onAuthStateChanged, type User as FirebaseUser } from 'firebase/auth';
import { useQueryClient } from '@tanstack/react-query';
import { firebaseAuth } from './firebaseConfig';
import { setTokenExpiredHandler } from '@/core/api/axiosClient';
import { syncWithBackend, signOut as authServiceSignOut } from '@/features/auth/services/authService';
import type { AuthState } from '@/types/auth';

interface AuthContextValue extends AuthState {
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  firebaseUser: null,
  backendUser: null,
  loading: true,
  error: null,
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(() => ({
    firebaseUser: null,
    backendUser: null,
    loading: Boolean(firebaseAuth),
    error: null,
  }));
  const queryClient = useQueryClient();
  // Guards against re-syncing the same Firebase user twice — onAuthStateChanged
  // fires immediately after signUpWithEmail, and syncWithBackend is a
  // network call we don't want to duplicate for an unchanged uid.
  const syncedUidRef = useRef<string | null>(null);

  const signOut = async () => {
    await authServiceSignOut(queryClient);
    syncedUidRef.current = null;
    setState({ firebaseUser: null, backendUser: null, loading: false, error: null });
  };

  useEffect(() => {
    setTokenExpiredHandler(() => {
      void signOut();
    });
    return () => setTokenExpiredHandler(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!firebaseAuth) {
      return;
    }

    return onAuthStateChanged(firebaseAuth, (firebaseUser: FirebaseUser | null) => {
      setState((prev) => ({ ...prev, firebaseUser, loading: false }));

      if (!firebaseUser) {
        syncedUidRef.current = null;
        return;
      }

      if (syncedUidRef.current === firebaseUser.uid) {
        return;
      }
      syncedUidRef.current = firebaseUser.uid;

      syncWithBackend(firebaseUser)
        .then((backendUser) => {
          setState((prev) => ({ ...prev, backendUser, error: null }));
        })
        .catch((err) => {
          // Flutter Bug #2: a sync failure must NOT sign the user out.
          console.error('[Auth] backend sync failed', err);
          setState((prev) => ({ ...prev, error: 'Could not sync your account. Some features may be limited.' }));
        });
    });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, signOut }}>{children}</AuthContext.Provider>
  );
}

export function useAuthContext() {
  return useContext(AuthContext);
}
