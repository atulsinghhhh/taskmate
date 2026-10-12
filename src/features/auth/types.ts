// A trimmed-down view of Firebase's User object — we only ever need these
// two fields anywhere in the UI, so the rest of the app doesn't need to
// know about Firebase's internal User shape.
export interface AuthUser {
  uid: string;
  email: string | null;
}

export type AuthErrorCode =
  | 'invalid-credentials'
  | 'email-already-in-use'
  | 'weak-password'
  | 'invalid-email'
  | 'network-error'
  | 'unknown';

export interface AuthError {
  code: AuthErrorCode;
  message: string;
}
