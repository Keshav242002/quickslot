import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/core/auth/firebaseConfig', () => ({
  firebaseAuth: {},
  googleProvider: { providerId: 'google.com' },
}));

vi.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: vi.fn(),
  createUserWithEmailAndPassword: vi.fn(),
  signInWithPopup: vi.fn(),
  signOut: vi.fn(),
  updateProfile: vi.fn(),
}));

vi.mock('@/core/api/axiosClient', () => ({
  axiosClient: { post: vi.fn() },
}));

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  updateProfile,
} from 'firebase/auth';
import { axiosClient } from '@/core/api/axiosClient';
import {
  signInWithEmail,
  signUpWithEmail,
  signInWithGoogle,
  syncWithBackend,
  signOut,
} from '../services/authService';

const mockUser = {
  uid: 'uid-1',
  getIdToken: vi.fn().mockResolvedValue('fake-token'),
} as unknown as import('firebase/auth').User;

beforeEach(() => {
  vi.clearAllMocks();
  Storage.prototype.clear = vi.fn();
});

describe('authService', () => {
  it('signInWithEmail calls Firebase signInWithEmailAndPassword', async () => {
    (signInWithEmailAndPassword as ReturnType<typeof vi.fn>).mockResolvedValue({ user: mockUser });

    const result = await signInWithEmail('a@b.com', 'password123');

    expect(signInWithEmailAndPassword).toHaveBeenCalledWith({}, 'a@b.com', 'password123');
    expect(result).toBe(mockUser);
  });

  it('signInWithEmail throws on wrong password', async () => {
    (signInWithEmailAndPassword as ReturnType<typeof vi.fn>).mockRejectedValue(
      Object.assign(new Error('wrong password'), { code: 'auth/wrong-password' }),
    );

    await expect(signInWithEmail('a@b.com', 'bad')).rejects.toThrow('wrong password');
  });

  it('signUpWithEmail creates user and calls updateProfile with display name', async () => {
    (createUserWithEmailAndPassword as ReturnType<typeof vi.fn>).mockResolvedValue({
      user: mockUser,
    });

    const result = await signUpWithEmail('Jane', 'jane@b.com', 'password123');

    expect(createUserWithEmailAndPassword).toHaveBeenCalledWith({}, 'jane@b.com', 'password123');
    expect(updateProfile).toHaveBeenCalledWith(mockUser, { displayName: 'Jane' });
    expect(result).toBe(mockUser);
  });

  it('signInWithGoogle calls signInWithPopup', async () => {
    (signInWithPopup as ReturnType<typeof vi.fn>).mockResolvedValue({ user: mockUser });

    const result = await signInWithGoogle();

    expect(signInWithPopup).toHaveBeenCalledWith({}, { providerId: 'google.com' });
    expect(result).toBe(mockUser);
  });

  it('syncWithBackend posts with Bearer token', async () => {
    (axiosClient.post as ReturnType<typeof vi.fn>).mockResolvedValue({
      data: { id: 1, firebase_uid: 'uid-1', email: 'jane@b.com', display_name: 'Jane' },
    });

    await syncWithBackend(mockUser);

    expect(axiosClient.post).toHaveBeenCalledWith(
      '/auth/sync/',
      {},
      { headers: { Authorization: 'Bearer fake-token' } },
    );
  });

  it('syncWithBackend returns BackendUser on 200', async () => {
    const backendUser = { id: 1, firebase_uid: 'uid-1', email: 'jane@b.com', display_name: 'Jane' };
    (axiosClient.post as ReturnType<typeof vi.fn>).mockResolvedValue({ data: backendUser });

    const result = await syncWithBackend(mockUser);

    expect(result).toEqual(backendUser);
  });

  it('syncWithBackend throws on backend failure', async () => {
    (axiosClient.post as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('network error'));

    await expect(syncWithBackend(mockUser)).rejects.toThrow('network error');
  });

  it('signOut calls Firebase signOut', async () => {
    await signOut();

    expect(firebaseSignOut).toHaveBeenCalledWith({});
  });

  it('signOut clears localStorage', async () => {
    await signOut();

    expect(Storage.prototype.clear).toHaveBeenCalled();
  });
});
