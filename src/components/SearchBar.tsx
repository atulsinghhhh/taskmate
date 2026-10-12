import { Pressable, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/theme/colors';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export function SearchBar({ value, onChangeText, placeholder = 'Search tasks' }: SearchBarProps) {
  return (
    <View className="h-12 flex-row items-center rounded-2xl border-[1.5px] border-border bg-field px-3.5">
      <Ionicons name="search-outline" size={20} color={colors.muted} />
      <TextInput
        className="ml-2.5 h-full flex-1 py-0 font-sansSemi text-[15px] text-ink"
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9AA0B5"
        returnKeyType="search"
        autoCorrect={false}
      />
      {value.length > 0 ? (
        <Pressable onPress={() => onChangeText('')} hitSlop={10} accessibilityLabel="Clear search">
          <Ionicons name="close-circle" size={18} color={colors.muted} />
        </Pressable>
      ) : null}
    </View>
  );
}
