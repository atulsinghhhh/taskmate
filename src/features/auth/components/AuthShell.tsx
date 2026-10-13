import type { ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Logo } from '@/components/Logo';
import { colors } from '@/theme/colors';
import { ScreenContainer } from '@/components/ScreenContainer';

interface AuthShellProps {
  variant: 'login' | 'register';
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
  onBack: () => void;
}

export function AuthShell({ variant, title, subtitle, children, footer, onBack }: AuthShellProps) {
  const isLogin = variant === 'login';

  return (
    <ScreenContainer scroll edges={['top', 'bottom', 'left', 'right']} className="px-6 pb-6">
      {/* Decorative blobs sit behind everything (absolute, no touches). */}
      <View pointerEvents="none" className="absolute inset-0 overflow-hidden">
        {isLogin ? (
          <View className="absolute -left-10 -right-10 -top-24 h-[310px] rounded-b-[160px] bg-primarySoft" />
        ) : (
          <>
            <View className="absolute -right-[70px] -top-[90px] h-[230px] w-[230px] rounded-full bg-primarySoft" />
            <View className="absolute -left-[50px] top-[70px] h-[110px] w-[110px] rounded-full bg-primarySoft" />
          </>
        )}
      </View>

      <Pressable
        onPress={onBack}
        accessibilityLabel="Back"
        className="mt-2 h-11 w-11 items-center justify-center rounded-full border-[1.5px] border-border bg-surface"
      >
        <Ionicons name="chevron-back" size={22} color={colors.ink} />
      </Pressable>

      <View className={`items-center ${isLogin ? 'mt-2' : 'mt-0'}`}>
        <View style={LOGO_SHADOW} className={isLogin ? 'rounded-[22px]' : 'rounded-[18px]'}>
          <Logo size={isLogin ? 72 : 56} />
        </View>
      </View>

      <View className={isLogin ? 'mt-10' : 'mt-4'}>
        <Text
          className={`font-sansXBold text-ink ${
            isLogin ? 'text-[30px] leading-9' : 'text-center text-[28px] leading-9'
          }`}
        >
          {title}
        </Text>
        <Text
          className={`mb-4 mt-1 font-sans text-[15px] leading-[22px] text-muted ${
            isLogin ? '' : 'text-center'
          }`}
        >
          {subtitle}
        </Text>
        {children}
      </View>

      <View className="flex-1" />
      <View className="mt-4 flex-row items-center justify-center">{footer}</View>
    </ScreenContainer>
  );
}

const LOGO_SHADOW = {
  shadowColor: '#6558F5',
  shadowOpacity: 0.3,
  shadowRadius: 10,
  shadowOffset: { width: 0, height: 8 },
  elevation: 6,
};
