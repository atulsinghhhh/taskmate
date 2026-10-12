import { Text, View } from 'react-native';

// "Jane Doe" -> "JD". Falls back to the email's local part, then "?".
export function getInitials(displayName: string | null, email: string | null): string {
  const source = displayName?.trim() || email?.split('@')[0] || '';
  if (!source) return '?';

  const words = source.split(/\s+/).filter(Boolean);
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
  return source.slice(0, 2).toUpperCase();
}

interface AvatarProps {
  displayName: string | null;
  email: string | null;
  size: number;
}

// Purple circle with the user's initials.
export function Avatar({ displayName, email, size }: AvatarProps) {
  return (
    <View
      style={{ width: size, height: size, borderRadius: size / 2 }}
      className="items-center justify-center bg-primary"
    >
      <Text style={{ fontSize: size * 0.35 }} className="font-sansXBold text-white">
        {getInitials(displayName, email)}
      </Text>
    </View>
  );
}
