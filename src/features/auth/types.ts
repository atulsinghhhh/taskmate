export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  // creationTime string from firebase
  createdAt: string | null;
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
