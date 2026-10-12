import { useState } from 'react';
import { Pressable, Text, TextInput, View, type TextInputProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/theme/colors';

interface AppInputProps extends TextInputProps {
  label: string;
  error?: string;
  // Small helper line under the field (e.g. "At least 8 characters").
  hint?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  // Set for password fields: adds the show/hide eye button.
  secureToggle?: boolean;
}

// Label + input + inline error. `...inputProps` forwards everything a normal
// TextInput accepts (keyboardType, autoCapitalize, multiline...), so screens
// configure behavior without this component knowing about it.
export function AppInput({
  label,
  error,
  hint,
  icon,
  secureToggle = false,
  multiline,
  editable = true,
  onFocus,
  onBlur,
  ...inputProps
}: AppInputProps) {
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(true);

  const borderClass = error ? 'border-danger' : focused ? 'border-primary' : 'border-border';
  const fillClass = !editable ? 'bg-fieldDisabled' : focused ? 'bg-surface' : 'bg-field';

  return (
    <View className="mb-3.5">
      <Text className="mb-1.5 font-sansBold text-[13px] text-ink">{label}</Text>
      <View
        className={`flex-row rounded-[14px] border-[1.5px] px-3.5 ${borderClass} ${fillClass} ${
          multiline ? 'items-start pt-3' : 'h-[52px] items-center'
        }`}
      >
        {icon ? (
          <Ionicons
            name={icon}
            size={20}
            color={colors.muted}
            style={{ marginRight: 10, marginTop: multiline ? 2 : 0 }}
          />
        ) : null}
        <TextInput
          className={`flex-1 font-sansSemi text-[15px] ${editable ? 'text-ink' : 'text-[#7C8196]'} ${
            multiline ? 'h-[88px] pb-3' : 'h-full py-0'
          }`}
          {...inputProps}
          editable={editable}
          placeholderTextColor="#9AA0B5"
          multiline={multiline}
          textAlignVertical={multiline ? 'top' : 'center'}
          secureTextEntry={secureToggle && hidden}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
        />
        {secureToggle ? (
          <Pressable
            onPress={() => setHidden((h) => !h)}
            hitSlop={10}
            accessibilityLabel={hidden ? 'Show password' : 'Hide password'}
            className="-mr-3 h-11 w-11 items-center justify-center"
          >
            <Ionicons name={hidden ? 'eye-outline' : 'eye-off-outline'} size={20} color={colors.muted} />
          </Pressable>
        ) : null}
      </View>
      {error ? (
        <Text className="mt-1.5 font-sansSemi text-[13px] text-danger">{error}</Text>
      ) : hint ? (
        <Text className="mt-1.5 font-sans text-[13px] text-muted">{hint}</Text>
      ) : null}
    </View>
  );
}
