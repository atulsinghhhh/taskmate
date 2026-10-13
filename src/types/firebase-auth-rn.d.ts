// firebase/auth's shared .d.ts omits getReactNativePersistence but it exists in the RN build.
// https://github.com/firebase/firebase-js-sdk/issues/8332
import 'firebase/auth';

// import first so this merges with firebase/auth instead of replacing it
declare module 'firebase/auth' {
  export function getReactNativePersistence(storage: ReactNativeAsyncStorage): Persistence;
}
