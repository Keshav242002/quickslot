import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  updateProfile,
  type User as FirebaseUser,
} from 'firebase/auth';
import type { QueryClient } from '@tanstack/react-query';
import { firebaseAuth, googleProvider } from '@/core/auth/firebaseConfig';
import { axiosClient } from '@/core/api/axiosClient';
import { API_ROUTES } from '@/core/api/apiConstants';
import type { BackendUser } from '@/types/api';

function requireAuth() {
  if (!firebaseAuth) {
    throw new Error('Firebase Auth is not configured.');
  }
  return firebaseAuth;
}

export async function signInWithEmail(email: string, password: string): Promise<FirebaseUser> {
  const { user } = await signInWithEmailAndPassword(requireAuth(), email, password);
  return user;
}

export async function signUpWithEmail(
  name: string,
  email: string,
  password: string,
): Promise<FirebaseUser> {
  const { user } = await createUserWithEmailAndPassword(requireAuth(), email, password);
  await updateProfile(user, { displayName: name });
  return user;
}

export async function signInWithGoogle(): Promise<FirebaseUser> {
  const { user } = await signInWithPopup(requireAuth(), googleProvider);
  return user;
}

export async function syncWithBackend(user: FirebaseUser): Promise<BackendUser> {
  const token = await user.getIdToken();
  const response = await axiosClient.post<BackendUser>(
    API_ROUTES.authSync,
    {},
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return response.data;
}

export async function signOut(queryClient?: QueryClient): Promise<void> {
  await firebaseSignOut(requireAuth());
  queryClient?.clear();
  localStorage.clear();
}
