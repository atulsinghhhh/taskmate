import { useState } from 'react';
import { Platform, Pressable, Text, View } from 'react-native';
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/theme/colors';

interface DateFieldProps {
  label: string;
  value: Date | null;
  onChange: (date: Date | null) => void;
  placeholder?: string;
}

function formatLong(date: Date): string {
  return date.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

// android opens an imperative dialog, ios renders the picker inline
export function DateField({ label, value, onChange, placeholder = 'Select a date' }: DateFieldProps) {
  const [iosOpen, setIosOpen] = useState(false);

  const openPicker = () => {
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value: value ?? new Date(),
        mode: 'date',
        onValueChange: (_event, date) => onChange(date),
      });
    } else {
      setIosOpen((open) => !open);
    }
  };

  return (
    <View className="mb-3.5">
      <Text className="mb-1.5 font-sansBold text-[13px] text-ink">{label}</Text>
      <Pressable
        onPress={openPicker}
        accessibilityRole="button"
        accessibilityLabel={`${label}: ${value ? formatLong(value) : 'not set'}`}
        className={`h-[52px] flex-row items-center rounded-[14px] border-[1.5px] px-3.5 ${
          iosOpen ? 'border-primary bg-surface' : 'border-border bg-field'
        }`}
      >
        <Ionicons name="calendar-outline" size={20} color={colors.muted} />
        <Text
          className={`ml-2.5 flex-1 font-sansSemi text-[15px] ${value ? 'text-ink' : 'text-[#9AA0B5]'}`}
        >
          {value ? formatLong(value) : placeholder}
        </Text>
        {value ? (
          <Pressable
            onPress={() => {
              onChange(null);
              setIosOpen(false);
            }}
            hitSlop={10}
            accessibilityLabel="Clear date"
          >
            <Ionicons name="close-circle" size={18} color={colors.muted} />
          </Pressable>
        ) : (
          <Ionicons name="chevron-down" size={18} color={colors.muted} />
        )}
      </Pressable>

      {Platform.OS === 'ios' && iosOpen ? (
        <View className="mt-2 rounded-2xl border border-border bg-surface p-2">
          <DateTimePicker
            value={value ?? new Date()}
            mode="date"
            display="inline"
            accentColor={colors.primary}
            themeVariant="light"
            onValueChange={(_event, date) => {
              onChange(date);
              setIosOpen(false);
            }}
          />
        </View>
      ) : null}
    </View>
  );
}
