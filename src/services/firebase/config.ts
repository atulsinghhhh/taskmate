import { getApp, getApps, initializeApp, type FirebaseOptions } from 'firebase/app';
import {
  connectAuthEmulator,
  getReactNativePersistence,
  initializeAuth,
  getAuth,
  type Auth,
} from 'firebase/auth';
import { connectFirestoreEmulator, getFirestore, type Firestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Every EXPO_PUBLIC_* var gets baked into the app at build time (see .env).
// This config is PUBLIC (not a secret) — Firestore security rules are what
// actually protect user data, not hiding these values.
const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

// getApps()/getApp() avoids "Firebase App already exists" errors when this
// module gets re-executed by Metro's Fast Refresh during development.
export const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);

let auth: Auth;
try {
  // AsyncStorage persistence is what makes the login session survive an app
  // restart — without it, the user would be logged out every time they
  // reopen the app.
  auth = initializeAuth(firebaseApp, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch {
  // initializeAuth throws if it was already called once for this app
  // (e.g. on Fast Refresh) — fall back to the existing instance.
  auth = getAuth(firebaseApp);
}

export { auth };
export const db: Firestore = getFirestore(firebaseApp);

const useEmulator = process.env.EXPO_PUBLIC_USE_FIREBASE_EMULATOR === 'true';

if (useEmulator) {
  // The Android emulator can't reach the host machine via "localhost" — it
  // needs the special alias 10.0.2.2. iOS simulator and web both use
  // localhost directly since they share the host's network.
  const host = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';

  try {
    connectAuthEmulator(auth, `http://${host}:9099`, { disableWarnings: true });
    connectFirestoreEmulator(db, host, 8080);
  } catch {
    // Already connected (Fast Refresh re-ran this module) — safe to ignore.
  }
}
