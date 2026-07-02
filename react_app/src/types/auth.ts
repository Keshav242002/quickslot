import type { User as FirebaseUser } from 'firebase/auth';
import type { BackendUser } from './api';

export interface AuthState {
  firebaseUser: FirebaseUser | null;
  backendUser: BackendUser | null;
  loading: boolean;
}
