import { Image } from 'react-native';

interface LogoProps {
  size?: number;
}

// The TaskMate logo (purple tile with a white check, assets/logo.png).
// Use this wherever the app shows its brand mark.
export function Logo({ size = 56 }: LogoProps) {
  return (
    <Image
      source={require('../../assets/logo.png')}
      style={{ width: size, height: size }}
      accessibilityLabel="TaskMate logo"
    />
  );
}
