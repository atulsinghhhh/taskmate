import { Image } from 'react-native';

interface LogoProps {
  size?: number;
}

export function Logo({ size = 56 }: LogoProps) {
  return (
    <Image
      source={require('../../assets/logo.png')}
      style={{ width: size, height: size }}
      accessibilityLabel="TaskMate logo"
    />
  );
}
