import type { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';

interface ScreenContainerProps {
  children: ReactNode;
  // true: content scrolls and stays reachable when the keyboard opens
  // (forms). false: a plain fixed layout (lists manage their own scrolling).
  scroll?: boolean;
  // Which screen edges to keep clear of notches / home indicator.
  edges?: Edge[];
  // Extra classes for the inner content wrapper, e.g. "px-5 pt-4".
  className?: string;
}

// Every screen starts from this: safe-area padding, the app background,
// and (optionally) keyboard-aware scrolling.
export function ScreenContainer({
  children,
  scroll = false,
  edges = ['top', 'left', 'right'],
  className = '',
}: ScreenContainerProps) {
  return (
    <SafeAreaView edges={edges} className="flex-1 bg-background">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {scroll ? (
          <ScrollView
            className="flex-1"
            contentContainerClassName={`grow px-5 pb-8 ${className}`}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {children}
          </ScrollView>
        ) : (
          <View className={`flex-1 ${className}`}>{children}</View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
