import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { onAuthStateChanged, type User as FirebaseUser } from 'firebase/auth';
import { firebaseAuth } from './firebaseConfig';
import type { AuthState } from '@/types/auth';

const AuthContext = createContext<AuthState>({
  firebaseUser: null,
  backendUser: null,
  loading: true,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    firebaseUser: null,
    backendUser: null,
    loading: true,
  });

  useEffect(() => {
    if (!firebaseAuth) {
      setState((prev) => ({ ...prev, firebaseUser: null, loading: false }));
      return;
    }
    return onAuthStateChanged(firebaseAuth, (firebaseUser: FirebaseUser | null) => {
      setState((prev) => ({ ...prev, firebaseUser, loading: false }));
    });
  }, []);

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  return useContext(AuthContext);
}
