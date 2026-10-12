import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from 'firebase/auth';
import { auth } from '@/services/firebase/config';
import type { AuthError, AuthUser } from '../types';

function toAuthUser(user: User): AuthUser {
  return { uid: user.uid, email: user.email };
}

// Firebase throws errors shaped like { code: "auth/weak-password", message }.
// We translate the codes we expect into our own AuthError type so screens
// can show a friendly message without knowing Firebase's error strings.
function toAuthError(error: unknown): AuthError {
  const code = (error as { code?: string })?.code ?? '';

  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      return { code: 'invalid-credentials', message: 'Incorrect email or password.' };
    case 'auth/email-already-in-use':
      return { code: 'email-already-in-use', message: 'An account with this email already exists.' };
    case 'auth/weak-password':
      return { code: 'weak-password', message: 'Password must be at least 6 characters.' };
    case 'auth/invalid-email':
      return { code: 'invalid-email', message: 'That email address looks invalid.' };
    case 'auth/network-request-failed':
      return { code: 'network-error', message: 'Network error. Check your connection and try again.' };
    default:
      return { code: 'unknown', message: 'Something went wrong. Please try again.' };
  }
}

export async function registerWithEmail(email: string, password: string): Promise<AuthUser> {
  try {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    return toAuthUser(credential.user);
  } catch (error) {
    throw toAuthError(error);
  }
}

export async function loginWithEmail(email: string, password: string): Promise<AuthUser> {
  try {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    return toAuthUser(credential.user);
  } catch (error) {
    throw toAuthError(error);
  }
}

export async function logout(): Promise<void> {
  await signOut(auth);
}

// Fires immediately with the current session (or null), then again every
// time the user logs in/out — including automatically on app restart once
// Firebase has restored the session from AsyncStorage.
export function subscribeToAuthChanges(callback: (user: AuthUser | null) => void): () => void {
  return onAuthStateChanged(auth, (user) => {
    callback(user ? toAuthUser(user) : null);
  });
}
