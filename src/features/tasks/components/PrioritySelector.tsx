import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PRIORITIES, PRIORITY_CONFIG } from '../priority';
import type { TaskPriority } from '../types/task';

interface PrioritySelectorProps {
  value: TaskPriority;
  onChange: (priority: TaskPriority) => void;
}

// Three side-by-side options. Unselected ones show a colored dot; the
// selected one fills with its soft tint and a check, so the choice is
// recognizable even before reading the label.
export function PrioritySelector({ value, onChange }: PrioritySelectorProps) {
  return (
    <View className="mb-5">
      <Text className="mb-1.5 font-sansBold text-[13px] text-ink">Priority</Text>
      <View className="flex-row gap-2.5">
        {PRIORITIES.map((priority) => {
          const config = PRIORITY_CONFIG[priority];
          const selected = value === priority;
          return (
            <Pressable
              key={priority}
              onPress={() => onChange(priority)}
              accessibilityRole="radio"
              accessibilityState={{ selected }}
              className={`h-[52px] flex-1 flex-row items-center justify-center rounded-[14px] ${
                selected ? `border-2 ${config.selectedClass}` : 'border-[1.5px] border-border bg-surface'
              }`}
            >
              {selected ? (
                <Ionicons name="checkmark" size={16} color={config.color} />
              ) : (
                <View style={{ backgroundColor: config.color }} className="h-2 w-2 rounded-full" />
              )}
              <Text
                className={`ml-2 font-sansBold text-sm ${selected ? config.textClass : 'text-muted'}`}
              >
                {config.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
