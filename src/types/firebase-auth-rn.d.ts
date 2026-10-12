// `getReactNativePersistence` is a real, documented Firebase Auth API (see
// https://github.com/expo/fyi/blob/main/firebase-js-auth-setup.md) and works
// correctly at runtime — Metro resolves "firebase/auth" to @firebase/auth's
// React Native build, which implements it. But the shared .d.ts that ships
// with "firebase/auth" deliberately excludes platform-specific APIs, so
// TypeScript can't see it. This augmentation adds the missing declaration
// back. Tracked upstream: https://github.com/firebase/firebase-js-sdk/issues/8332
import 'firebase/auth';

// Importing the real module first (above) makes this an augmentation that
// merges with firebase/auth's existing exports, instead of a standalone
// module declaration that would replace them.
declare module 'firebase/auth' {
  export function getReactNativePersistence(storage: ReactNativeAsyncStorage): Persistence;
}
