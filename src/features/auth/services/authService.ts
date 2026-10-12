import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type User,
} from 'firebase/auth';
import { auth } from '@/services/firebase/config';
import type { AuthError, AuthUser } from '../types';

function toAuthUser(user: User): AuthUser {
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    createdAt: user.metadata.creationTime ?? null,
  };
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

export async function registerWithEmail(
  email: string,
  password: string,
  displayName: string,
): Promise<AuthUser> {
  try {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    // The account exists at this point; a failed name write shouldn't make
    // sign-up look like it failed, so the name can be re-added from Profile.
    if (displayName) {
      await updateProfile(credential.user, { displayName }).catch(() => {});
    }
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

export async function sendPasswordReset(email: string): Promise<void> {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    const authError = toAuthError(error);
    // "No such user" is reported as success so the screen can't be used to
    // find out which emails are registered.
    if ((error as { code?: string })?.code === 'auth/user-not-found') return;
    throw authError;
  }
}

export async function logout(): Promise<void> {
  await signOut(auth);
}

// updateProfile only takes effect on auth.currentUser and does NOT trigger
// onAuthStateChanged, so the caller (authStore) is responsible for updating
// its own `user` state with the new name afterwards.
export async function updateDisplayName(displayName: string): Promise<void> {
  if (!auth.currentUser) throw toAuthError({ code: 'unknown' });
  try {
    await updateProfile(auth.currentUser, { displayName });
  } catch (error) {
    throw toAuthError(error);
  }
}

// Fires immediately with the current session (or null), then again every
// time the user logs in/out — including automatically on app restart once
// Firebase has restored the session from AsyncStorage.
export function subscribeToAuthChanges(callback: (user: AuthUser | null) => void): () => void {
  return onAuthStateChanged(auth, (user) => {
    callback(user ? toAuthUser(user) : null);
  });
}
