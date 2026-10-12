import { Stack } from 'expo-router';

// This is the ROOT layout. Expo Router renders this once, and it decides
// what wraps every screen in the app (e.g. a navigator, a theme provider,
// an auth check). Right now it just renders a basic stack navigator.
export default function RootLayout() {
  return <Stack />;
}
